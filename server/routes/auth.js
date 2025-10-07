const express = require('express');
const {
  buildAuthUrl,
  createState,
  exchangeCodeForTokens,
  storeTokensOnSession,
  isYahooConnected,
} = require('../lib/yahoo');
const logger = require('../lib/logger');

const router = express.Router();

const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

router.get('/yahoo/login', (req, res) => {
  try {
    const state = createState();
    req.session.yahooOauthState = state;

    const redirectUrl = buildAuthUrl(req, state);
    return res.redirect(redirectUrl);
  } catch (error) {
    logger.error('Failed to initiate Yahoo OAuth flow', { error: error.message });
    return res.status(500).json({ error: 'Unable to initiate Yahoo authentication' });
  }
});

router.get('/yahoo/callback', async (req, res) => {
  const { code, state, error } = req.query;

  if (error) {
    logger.warn('Yahoo OAuth returned an error', { error });
    return res.redirect(`${clientOrigin}/?yahoo=error`);
  }

  if (!code || !state) {
    return res.status(400).json({ error: 'Missing OAuth parameters' });
  }

  if (!req.session.yahooOauthState || state !== req.session.yahooOauthState) {
    logger.warn('Yahoo OAuth state mismatch', {
      expected: req.session.yahooOauthState,
      received: state,
    });
    return res.status(400).json({ error: 'OAuth state mismatch' });
  }

  try {
    const tokens = await exchangeCodeForTokens(req, code);
    storeTokensOnSession(req.session, tokens);
    delete req.session.yahooOauthState;

    return req.session.save((saveError) => {
      if (saveError) {
        logger.error('Failed to persist Yahoo session', { error: saveError.message });
        return res.status(500).json({ error: 'Unable to persist Yahoo session' });
      }

      return res.redirect(`${clientOrigin}/?yahoo=connected`);
    });
  } catch (oauthError) {
    logger.error('Failed to complete Yahoo OAuth flow', { error: oauthError.message });
    return res.status(500).json({ error: 'Failed to authenticate with Yahoo' });
  }
});

router.get('/status', (req, res) => {
  const connected = isYahooConnected(req.session);

  res.json({
    connected,
    authenticated: connected,
    user: req.session?.yahoo?.profile || null,
  });
});

module.exports = router;
