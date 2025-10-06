const path = require('path');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const morgan = require('morgan');

const teamsRouter = require('./routes/teams');
const authRouter = require('./routes/auth');
const metricsRouter = require('./routes/metrics');
const { teamsByName, getCanonicalTeamName } = require('./lib/teams');
const { getMatchup } = require('./lib/matchups');
const { getFantasyOptions, getFantasyAdvice } = require('./lib/fantasy');
const { ensureFreshToken, isYahooConnected } = require('./lib/yahoo');
const logger = require('./lib/logger');

const app = express();
app.set('trust proxy', 1);

const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
const sessionSecret = process.env.SESSION_SECRET || 'change-me';

app.use(
  morgan('combined', {
    stream: logger.stream,
    skip: () => process.env.NODE_ENV === 'test',
  }),
);

app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  }),
);

const sessionMiddleware = session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: app.get('env') === 'production',
    sameSite: app.get('env') === 'production' ? 'none' : 'lax',
  },
});

app.use(sessionMiddleware);
app.use(express.json());

const createYahooHealthCheck = (sessionStore) => {
  if (!sessionStore?.all || !sessionStore?.set) {
    logger.warn('Session store does not expose all/set helpers; skipping Yahoo token health check.');
    return null;
  }

  return () => {
    sessionStore.all((error, sessions = {}) => {
      if (error) {
        logger.error('Yahoo health check could not read session store', { error: error.message });
        return;
      }

      Object.entries(sessions).forEach(([sessionId, sessionData]) => {
        if (!sessionData?.yahoo) {
          return;
        }

        if (isYahooConnected(sessionData)) {
          return;
        }

        ensureFreshToken(sessionData)
          .then(() => {
            sessionStore.set(sessionId, sessionData, (setError) => {
              if (setError) {
                logger.error('Failed to persist refreshed Yahoo token', {
                  sessionId,
                  error: setError.message,
                });
              } else {
                logger.info('Refreshed Yahoo token during scheduled health check', { sessionId });
              }
            });
          })
          .catch((refreshError) => {
            logger.warn('Unable to refresh Yahoo token during health check', {
              sessionId,
              error: refreshError.message,
            });
          });
      });
    });
  };
};

const startYahooHealthCheck = (sessionStore, interval = 5 * 60 * 1000) => {
  if (process.env.NODE_ENV === 'test') {
    return null;
  }

  const runner = createYahooHealthCheck(sessionStore);
  if (!runner) {
    return null;
  }

  runner();
  return setInterval(runner, interval);
};

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/data', (_req, res) => {
  res.json({
    data: 'Fantasy Basketball insights API is online',
  });
});

app.use('/api/auth', authRouter);
app.use('/api/metrics', metricsRouter);
app.use('/api', teamsRouter);

app.get('/api/matchups/:teamName1/:teamName2', (req, res) => {
  const teamOne = getCanonicalTeamName(req.params.teamName1);
  const teamTwo = getCanonicalTeamName(req.params.teamName2);

  if (!teamOne || !teamTwo) {
    return res.status(404).json({ error: 'One or both teams were not found' });
  }

  if (teamOne === teamTwo) {
    return res.status(400).json({ error: 'Select two different teams to analyze a matchup' });
  }

  const matchup = getMatchup(teamOne, teamTwo);

  if (!matchup) {
    return res.status(404).json({ error: 'Matchup data not available for the selected teams' });
  }

  return res.json({
    team1: teamsByName[teamOne],
    team2: teamsByName[teamTwo],
    matchup,
  });
});

app.get('/api/fantasy/options', (_req, res) => {
  res.json(getFantasyOptions());
});

app.get('/api/fantasy', (req, res) => {
  const optionId = req.query.option;

  if (!optionId) {
    return res.status(400).json({ error: 'Provide an option query parameter (e.g. ?option=lineup)' });
  }

  const advice = getFantasyAdvice(optionId);

  if (!advice) {
    return res.status(404).json({ error: 'Fantasy advice option not found' });
  }

  return res.json(advice);
});

if (process.env.NODE_ENV === 'production') {
  const buildPath = path.resolve(__dirname, '../client/build');
  app.use(express.static(buildPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

const PORT = Number(process.env.PORT || 5000);
let yahooHealthInterval = null;

const start = () => {
  if (!yahooHealthInterval) {
    yahooHealthInterval = startYahooHealthCheck(sessionMiddleware.store);
  }

  const server = app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });

  server.on('close', () => {
    if (yahooHealthInterval) {
      clearInterval(yahooHealthInterval);
      yahooHealthInterval = null;
    }
  });

  return server;
};

if (require.main === module) {
  start();
}

module.exports = { app, start, sessionStore: sessionMiddleware.store };
