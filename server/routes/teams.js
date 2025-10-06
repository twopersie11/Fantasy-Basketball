const express = require('express');
const { getTeamSummaries, getTeamDetail } = require('../lib/teams');

const router = express.Router();

router.get('/teams', (_req, res) => {
  try {
    res.json(getTeamSummaries());
  } catch (error) {
    console.error('Failed to load teams', error);
    res.status(500).json({ error: 'Teams data not found' });
  }
});

router.get('/teams/:teamName', (req, res) => {
  try {
    const team = getTeamDetail(req.params.teamName);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    return res.json(team);
  } catch (error) {
    console.error('Failed to load team detail', error);
    return res.status(500).json({ error: 'Team data could not be retrieved' });
  }
});

module.exports = router;
