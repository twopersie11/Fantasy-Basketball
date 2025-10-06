const teamProfiles = require('../data/teams.json');

const teamsByName = teamProfiles.reduce((acc, team) => {
  acc[team.name] = team;
  return acc;
}, {});

const getCanonicalTeamName = (teamName = '') => {
  const normalized = teamName.trim().toLowerCase();
  return teamProfiles.find((team) => team.name.toLowerCase() === normalized)?.name || null;
};

const getTeamSummaries = () =>
  teamProfiles.map((team) => ({
    name: team.name,
    code: team.code,
    conference: team.conference,
    division: team.division,
    coach: team.coach,
    latestSeason: team.performanceData?.[0] ?? null,
    currentNetRating: team.currentForm?.rollingAverages?.netRating ?? null,
  }));

const getTeamDetail = (teamName) => {
  const canonicalName = getCanonicalTeamName(teamName);
  return canonicalName ? teamsByName[canonicalName] : null;
};

module.exports = {
  teamProfiles,
  teamsByName,
  getCanonicalTeamName,
  getTeamSummaries,
  getTeamDetail,
};
