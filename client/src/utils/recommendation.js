const DEFAULT_WEIGHTS = {
  strategyFit: 0.3,
  vorp: 0.25,
  scarcity: 0.2,
  teamNeed: 0.15,
  playoffStrength: 0.05,
  injuryRisk: 0.05,
};

const STRATEGY_WEIGHT_OVERRIDES = {
  lineup: {
    strategyFit: 0.32,
    teamNeed: 0.18,
  },
  trades: {
    strategyFit: 0.28,
    vorp: 0.27,
    scarcity: 0.18,
    teamNeed: 0.17,
  },
  sleepers: {
    strategyFit: 0.34,
    vorp: 0.18,
    scarcity: 0.22,
    injuryRisk: 0.08,
  },
};

const getMetric = (value) => (typeof value === 'number' ? value : 0);

const resolveStrategyFit = (player, strategyId) => {
  if (!player?.strategy_fit) {
    return getMetric(player?.strategyFit);
  }

  if (typeof player.strategy_fit === 'number') {
    return getMetric(player.strategy_fit);
  }

  if (strategyId && player.strategy_fit[strategyId] !== undefined) {
    return getMetric(player.strategy_fit[strategyId]);
  }

  const fallbackKeys = Object.keys(player.strategy_fit);
  if (fallbackKeys.length > 0) {
    return getMetric(player.strategy_fit[fallbackKeys[0]]);
  }

  return 0;
};

const buildWeights = (strategyId) => ({
  ...DEFAULT_WEIGHTS,
  ...(strategyId ? STRATEGY_WEIGHT_OVERRIDES[strategyId] : {}),
});

export const calculatePlayerScore = (player, strategyId) => {
  const weights = buildWeights(strategyId);

  const metrics = {
    strategyFit: resolveStrategyFit(player, strategyId),
    vorp: getMetric(player.vorp ?? player.value_over_replacement),
    scarcity: getMetric(player.scarcity ?? player.position_scarcity),
    teamNeed: getMetric(player.team_need ?? player.teamNeed),
    playoffStrength: getMetric(player.playoff_strength ?? player.playoffStrength),
    injuryRisk: getMetric(player.injury_risk ?? player.injuryRisk),
  };

  const score =
    weights.strategyFit * metrics.strategyFit +
    weights.vorp * metrics.vorp +
    weights.scarcity * metrics.scarcity +
    weights.teamNeed * metrics.teamNeed +
    weights.playoffStrength * metrics.playoffStrength +
    weights.injuryRisk * (1 - metrics.injuryRisk);

  return Number(score.toFixed(4));
};

export const rankPlayers = (players, { strategyId, limit = 10 } = {}) => {
  if (!Array.isArray(players)) {
    return [];
  }

  return players
    .map((player) => ({
      ...player,
      score: calculatePlayerScore(player, strategyId),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

export const buildPlayerSummary = (player) => {
  const positions = Array.isArray(player.positions) ? player.positions.join(' / ') : player.positions;
  return {
    name: player.name,
    team: player.team,
    positions: positions || 'N/A',
    score: player.score,
    vorp: getMetric(player.vorp),
    scarcity: getMetric(player.scarcity),
    teamNeed: getMetric(player.team_need ?? player.teamNeed),
    playoffStrength: getMetric(player.playoff_strength ?? player.playoffStrength),
    injuryRisk: getMetric(player.injury_risk ?? player.injuryRisk),
  };
};

export default rankPlayers;
