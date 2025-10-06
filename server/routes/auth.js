const express = require('express');
const {
  buildAuthUrl,
  createState,
  exchangeCodeForTokens,
  storeTokensOnSession,
  isYahooConnected,
} = require('../lib/yahoo');

const router = express.Router();

const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

router.get('/yahoo/login', (req, res) => {
  try {
    const state = createState();
    req.session.yahooOauthState = state;

    const redirectUrl = buildAuthUrl(req, state);
    return res.redirect(redirectUrl);
  } catch (error) {
    console.error('Failed to initiate Yahoo OAuth flow', error);
    return res.status(500).json({ error: 'Unable to initiate Yahoo authentication' });
  }
});

router.get('/yahoo/callback', async (req, res) => {
  const { code, state, error } = req.query;

  if (error) {
    console.error('Yahoo OAuth returned an error', error);
    return res.redirect(`${clientOrigin}/?yahoo=error`);
  }

  if (!code || !state) {
    return res.status(400).json({ error: 'Missing OAuth parameters' });
  }

  if (!req.session.yahooOauthState || state !== req.session.yahooOauthState) {
    return res.status(400).json({ error: 'OAuth state mismatch' });
  }

  try {
    const tokens = await exchangeCodeForTokens(req, code);
    storeTokensOnSession(req.session, tokens);
    delete req.session.yahooOauthState;

    return req.session.save((saveError) => {
      if (saveError) {
        console.error('Failed to persist Yahoo session', saveError);
        return res.status(500).json({ error: 'Unable to persist Yahoo session' });
      }

      return res.redirect(`${clientOrigin}/?yahoo=connected`);
    });
  } catch (oauthError) {
    console.error('Failed to complete Yahoo OAuth flow', oauthError);
    return res.status(500).json({ error: 'Failed to authenticate with Yahoo' });
  }
});

router.get('/status', (req, res) => {
  res.json({ connected: isYahooConnected(req.session) });
});

module.exports = router;
