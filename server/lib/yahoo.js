const axios = require('axios');
const crypto = require('crypto');

const logger = require('./logger');

const AUTH_BASE_URL = 'https://api.login.yahoo.com';
const FANTASY_API_BASE_URL = 'https://fantasysports.yahooapis.com/fantasy/v2';

const isProduction = process.env.NODE_ENV === 'production';
const DEFAULT_CLIENT_ID =
  'dj0yJmk9eFJMT3U2YjNjWGZxJmQ9WVdrOVJWQm5TamswVmpZbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTU3';
const DEFAULT_CLIENT_SECRET = 'bbb596ed665de00fe2d07cde9f1795bbd3915a0d';

const resolveConfigValue = (primary, { aliases = [], fallback = null } = {}) => {
  const keys = [primary, ...aliases];

  for (const key of keys) {
    const value = process.env[key];
    if (value) {
      if (key !== primary) {
        logger.debug(`Using ${key} for Yahoo OAuth ${primary}`);
      }
      return value;
    }
  }

  if (fallback) {
    if (process.env.NODE_ENV !== 'test') {
      logger.warn(
        `Environment variable ${primary} is not set. Falling back to a development default. ` +
          'Set this variable (or one of its aliases) in production environments.',
      );
    }

    return fallback;
  }

  const message = `Yahoo OAuth credentials missing. Set one of: ${keys.join(', ')}`;
  logger.error(message);
  throw new Error(message);
};

const YAHOO_APP_ID = process.env.YAHOO_APP_ID || 'EPgJ94V6';
const YAHOO_CLIENT_ID = resolveConfigValue('YAHOO_CLIENT_ID', {
  aliases: ['YAHOO_CONSUMER_KEY'],
  fallback: isProduction ? null : DEFAULT_CLIENT_ID,
});
const YAHOO_CLIENT_SECRET = resolveConfigValue('YAHOO_CLIENT_SECRET', {
  aliases: ['YAHOO_CONSUMER_SECRET'],
  fallback: isProduction ? null : DEFAULT_CLIENT_SECRET,
});
const YAHOO_SCOPE = process.env.YAHOO_SCOPE || 'fspt-r fspt-w';

const authClient = axios.create({ baseURL: AUTH_BASE_URL });
const fantasyClient = axios.create({ baseURL: FANTASY_API_BASE_URL });

const createState = () => crypto.randomBytes(16).toString('hex');

const getRedirectUri = (req) =>
  process.env.YAHOO_REDIRECT_URI || `${req.protocol}://${req.get('host')}/api/auth/yahoo/callback`;

const buildAuthUrl = (req, state) => {
  const redirectUri = getRedirectUri(req);
  const params = new URLSearchParams({
    client_id: YAHOO_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: YAHOO_SCOPE,
    state,
  });

  return `${AUTH_BASE_URL}/oauth2/request_auth?${params.toString()}`;
};

const decodeTokenResponse = (payload) => ({
  accessToken: payload.access_token,
  refreshToken: payload.refresh_token,
  tokenType: payload.token_type,
  expiresIn: payload.expires_in,
  xoauthYahooGuid: payload.xoauth_yahoo_guid,
});

const storeTokensOnSession = (session, tokenPayload) => {
  if (!session) {
    return;
  }

  const { accessToken, refreshToken, tokenType, expiresIn, xoauthYahooGuid } = tokenPayload;
  const expiresAt = Date.now() + Math.max((expiresIn - 60) * 1000, 30 * 1000);

  session.yahoo = {
    ...(session.yahoo || {}),
    accessToken,
    refreshToken: refreshToken || session.yahoo?.refreshToken,
    tokenType,
    xoauthYahooGuid,
    expiresAt,
    appId: YAHOO_APP_ID,
  };
};

const exchangeCodeForTokens = async (req, code) => {
  const redirectUri = getRedirectUri(req);
  const params = new URLSearchParams({
    code,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${Buffer.from(`${YAHOO_CLIENT_ID}:${YAHOO_CLIENT_SECRET}`).toString('base64')}`,
  };

  const { data } = await authClient.post('/oauth2/get_token', params.toString(), { headers });
  return decodeTokenResponse(data);
};

const refreshTokens = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const params = new URLSearchParams({
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${Buffer.from(`${YAHOO_CLIENT_ID}:${YAHOO_CLIENT_SECRET}`).toString('base64')}`,
  };

  const { data } = await authClient.post('/oauth2/get_token', params.toString(), { headers });
  return decodeTokenResponse(data);
};

const isTokenExpired = (session) => {
  const expiresAt = session?.yahoo?.expiresAt;
  if (!expiresAt) {
    return true;
  }

  return Date.now() >= expiresAt;
};

const ensureFreshToken = async (session) => {
  if (!session?.yahoo) {
    throw new Error('Yahoo session not initialised');
  }

  if (!isTokenExpired(session)) {
    return session.yahoo.accessToken;
  }

  const tokens = await refreshTokens(session.yahoo.refreshToken);
  storeTokensOnSession(session, tokens);
  return session.yahoo.accessToken;
};

const yahooApiRequest = async (req, config) => {
  if (!req.session?.yahoo?.accessToken) {
    throw new Error('Yahoo account not connected');
  }

  await ensureFreshToken(req.session);

  try {
    return await fantasyClient.request({
      ...config,
      headers: {
        ...(config.headers || {}),
        Authorization: `Bearer ${req.session.yahoo.accessToken}`,
      },
    });
  } catch (error) {
    if (error.response?.status === 401) {
      const tokens = await refreshTokens(req.session.yahoo.refreshToken);
      storeTokensOnSession(req.session, tokens);

      return fantasyClient.request({
        ...config,
        headers: {
          ...(config.headers || {}),
          Authorization: `Bearer ${req.session.yahoo.accessToken}`,
        },
      });
    }

    throw error;
  }
};

const isYahooConnected = (session) => Boolean(session?.yahoo?.accessToken && !isTokenExpired(session));

module.exports = {
  buildAuthUrl,
  createState,
  exchangeCodeForTokens,
  refreshTokens,
  storeTokensOnSession,
  ensureFreshToken,
  yahooApiRequest,
  isYahooConnected,
  getRedirectUri,
};
