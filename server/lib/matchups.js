const matchupDefinitions = require('../data/matchups.json');

const matchupMap = {};

const createMatchupPayload = (primary, secondary, definition) => ({
  summary: definition.summary,
  pace: definition.pace,
  keyFactors: definition.keyFactors,
  team1VsTeam2: definition.headToHead[primary],
  team2VsTeam1: definition.headToHead[secondary],
  recentGames: definition.recentGames.map((game) => ({
    date: game.date,
    venue: game.venue,
    winner: game.winner,
    team1Points: game.scores[primary],
    team2Points: game.scores[secondary],
  })),
});

matchupDefinitions.forEach((definition) => {
  const [teamA, teamB] = definition.teams;
  if (!matchupMap[teamA]) matchupMap[teamA] = {};
  if (!matchupMap[teamB]) matchupMap[teamB] = {};
  matchupMap[teamA][teamB] = createMatchupPayload(teamA, teamB, definition);
  matchupMap[teamB][teamA] = createMatchupPayload(teamB, teamA, definition);
});

const getMatchup = (teamA, teamB) => matchupMap[teamA]?.[teamB] || null;

module.exports = {
  getMatchup,
};
