const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const router = express.Router();

const OUTPUT_DIR = process.env.METRICS_OUTPUT_DIR
  ? path.resolve(process.env.METRICS_OUTPUT_DIR)
  : path.resolve(__dirname, '..', '..', 'output');

const readJsonFile = async (fileName) => {
  const filePath = path.join(OUTPUT_DIR, fileName);
  const fileContents = await fs.readFile(filePath, 'utf8');
  return JSON.parse(fileContents);
};

router.get('/players', async (_req, res) => {
  try {
    const metrics = await readJsonFile('player_metrics.json');
    return res.json(metrics);
  } catch (error) {
    console.error('Failed to load player metrics', error);
    return res.status(500).json({ error: 'Player metrics are unavailable' });
  }
});

router.get('/injury-risk/:playerId', async (req, res) => {
  try {
    const risks = await readJsonFile('injury_risk.json');
    const playerId = String(req.params.playerId);

    let playerRisk;

    if (Array.isArray(risks)) {
      playerRisk = risks.find((entry) => String(entry.id) === playerId || String(entry.playerId) === playerId);
    } else if (risks && typeof risks === 'object') {
      const match = risks[playerId] || risks[String(playerId)];
      if (match !== undefined) {
        playerRisk = { id: playerId, risk: match };
      }
    }

    if (!playerRisk) {
      return res.status(404).json({ error: 'Injury risk data not found for the requested player' });
    }

    return res.json(playerRisk);
  } catch (error) {
    console.error('Failed to load injury risk data', error);
    return res.status(500).json({ error: 'Injury risk data is unavailable' });
  }
});

module.exports = router;
