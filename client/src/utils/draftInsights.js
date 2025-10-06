const getNumber = (value, fallback = 0) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  return fallback;
};

const resolveStrategyFit = (player, strategyId) => {
  if (!player) {
    return 0;
  }

  if (typeof player.strategy_fit === 'number') {
    return getNumber(player.strategy_fit);
  }

  if (strategyId && player.strategy_fit && player.strategy_fit[strategyId] !== undefined) {
    return getNumber(player.strategy_fit[strategyId]);
  }

  if (player.strategy_fit) {
    const keys = Object.keys(player.strategy_fit);
    if (keys.length > 0) {
      return getNumber(player.strategy_fit[keys[0]]);
    }
  }

  return getNumber(player.strategyFit);
};

const CATEGORY_BLUEPRINT = [
  { key: 'points', label: 'PTS', weights: { vorp: 0.45, strategyFit: 0.35, teamNeed: 0.2 } },
  { key: 'rebounds', label: 'REB', weights: { teamNeed: 0.45, scarcity: 0.35, playoffStrength: 0.2 } },
  { key: 'assists', label: 'AST', weights: { strategyFit: 0.45, vorp: 0.25, teamNeed: 0.3 } },
  { key: 'steals', label: 'STL', weights: { strategyFit: 0.4, injuryResilience: 0.4, playoffStrength: 0.2 } },
  { key: 'blocks', label: 'BLK', weights: { scarcity: 0.45, teamNeed: 0.35, playoffStrength: 0.2 } },
  { key: 'threes', label: '3PM', weights: { strategyFit: 0.4, vorp: 0.3, scarcity: 0.3 } },
  { key: 'fg', label: 'FG%', weights: { vorp: 0.4, playoffStrength: 0.35, injuryResilience: 0.25 } },
  { key: 'ft', label: 'FT%', weights: { strategyFit: 0.45, injuryResilience: 0.3, teamNeed: 0.25 } },
  { key: 'turnovers', label: 'TO', weights: { control: 1 } },
];

export const buildCategoryScores = (players = [], strategyId) => {
  if (!Array.isArray(players) || players.length === 0) {
    return [];
  }

  const aggregates = CATEGORY_BLUEPRINT.reduce((acc, category) => {
    acc[category.key] = 0;
    return acc;
  }, {});

  players.forEach((player) => {
    const vorp = getNumber(player.vorp ?? player.value_over_replacement);
    const scarcity = getNumber(player.scarcity ?? player.position_scarcity);
    const teamNeed = getNumber(player.team_need ?? player.teamNeed);
    const playoffStrength = getNumber(player.playoff_strength ?? player.playoffStrength);
    const injuryRisk = getNumber(player.injury_risk ?? player.injuryRisk);
    const strategyFit = resolveStrategyFit(player, strategyId);
    const injuryResilience = 1 - injuryRisk;
    const control = 1 - Math.min(1, (strategyFit * 0.4 + injuryRisk * 0.6));

    const metrics = {
      vorp,
      scarcity,
      teamNeed,
      playoffStrength,
      injuryResilience,
      strategyFit,
      control,
    };

    CATEGORY_BLUEPRINT.forEach((category) => {
      const total = Object.entries(category.weights).reduce(
        (sum, [metricKey, weight]) => sum + weight * (metrics[metricKey] ?? 0),
        0,
      );
      aggregates[category.key] += total;
    });
  });

  return CATEGORY_BLUEPRINT.map((category) => ({
    label: category.label,
    value: Math.round((aggregates[category.key] / players.length) * 100),
  }));
};

const POSITION_ORDER = ['PG', 'SG', 'SF', 'PF', 'C', 'UTIL'];

const normalisePosition = (player) => {
  if (Array.isArray(player.positions) && player.positions.length > 0) {
    return player.positions[0];
  }

  if (typeof player.positions === 'string') {
    return player.positions.split(/[\s/,-]+/)[0];
  }

  return 'UTIL';
};

export const buildDraftTrendHeatmap = (players = []) => {
  if (!Array.isArray(players) || players.length === 0) {
    return null;
  }

  const rounds = Math.max(1, Math.ceil(players.length / 2));
  const rows = Array.from({ length: rounds }, (_, index) => `Round ${index + 1}`);
  const columns = POSITION_ORDER;
  const cells = [];

  players.forEach((player, index) => {
    const roundIndex = Math.min(rows.length - 1, Math.floor(index / 2));
    const position = normalisePosition(player);
    const columnIndex = Math.max(0, columns.indexOf(position));
    const baseScore = getNumber(player.score, 0.5);
    const vorp = getNumber(player.vorp);
    const scarcity = getNumber(player.scarcity);
    const intensity = baseScore * 0.5 + vorp * 0.3 + scarcity * 0.2;

    cells.push({
      xIndex: columnIndex,
      yIndex: roundIndex,
      value: Number((intensity * 100).toFixed(1)),
      player: player.name,
      position,
    });
  });

  return { rows, columns, cells };
};

export const buildRiskMatrixPoints = (players = []) => {
  if (!Array.isArray(players) || players.length === 0) {
    return [];
  }

  return players.map((player) => ({
    player: player.name,
    team: player.team,
    positions: Array.isArray(player.positions) ? player.positions.join(' / ') : player.positions,
    vorp: Math.round(getNumber(player.vorp) * 100),
    injuryRisk: Math.round(getNumber(player.injury_risk ?? player.injuryRisk) * 100),
  }));
};

const PLAYOFF_WEEKS = ['Quarterfinal', 'Semifinal', 'Final'];

export const buildPlayoffSchedule = (players = []) => {
  if (!Array.isArray(players) || players.length === 0) {
    return [];
  }

  const averagePlayoffStrength =
    players.reduce((sum, player) => sum + getNumber(player.playoff_strength ?? player.playoffStrength), 0) /
    players.length;

  const groupedByTeam = players.reduce((acc, player) => {
    if (!player.team) {
      return acc;
    }
    if (!acc[player.team]) {
      acc[player.team] = [];
    }
    acc[player.team].push(player);
    return acc;
  }, {});

  const focusTeams = Object.entries(groupedByTeam)
    .sort(([, aPlayers], [, bPlayers]) => bPlayers.length - aPlayers.length)
    .slice(0, 3)
    .map(([team]) => team);

  return PLAYOFF_WEEKS.map((week, index) => {
    const games = Math.max(2, Math.round(averagePlayoffStrength * 4 + index));
    const difficulty = Math.max(0, Math.min(100, Math.round((1 - averagePlayoffStrength) * 60 + index * 10 + 20)));

    return {
      week,
      games,
      difficulty,
      focusTeams,
    };
  });
};
