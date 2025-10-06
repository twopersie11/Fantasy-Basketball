const express = require('express');
const cors = require('cors');
const session = require('express-session');

const teamsRouter = require('./routes/teams');
const authRouter = require('./routes/auth');
const metricsRouter = require('./routes/metrics');
const { teamsByName, getCanonicalTeamName } = require('./lib/teams');
const { getMatchup } = require('./lib/matchups');
const { getFantasyOptions, getFantasyAdvice } = require('./lib/fantasy');

const app = express();
app.set('trust proxy', 1);

const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
const sessionSecret = process.env.SESSION_SECRET || 'change-me';

app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  }),
);
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: app.get('env') === 'production',
      sameSite: app.get('env') === 'production' ? 'none' : 'lax',
    },
  }),
);
app.use(express.json());

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
