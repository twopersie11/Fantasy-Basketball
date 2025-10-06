const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/data', (_req, res) => {
  res.json({
    data: 'Fantasy Basketball insights API is online',
  });
});

const teamProfiles = [
  {
    name: 'New York Knicks',
    code: 'NYK',
    conference: 'Eastern',
    division: 'Atlantic',
    coach: 'Tom Thibodeau',
    arena: 'Madison Square Garden',
    performanceData: [
      { season: '2023-24', wins: 50, losses: 32, points: 116.2 },
      { season: '2022-23', wins: 47, losses: 35, points: 114.8 },
      { season: '2021-22', wins: 37, losses: 45, points: 110.0 },
      { season: '2020-21', wins: 41, losses: 31, points: 107.0 },
      { season: '2019-20', wins: 21, losses: 45, points: 105.8 },
    ],
    currentForm: {
      last10Games: [
        { game: 'Game 1', points: 118, outcome: 'Win' },
        { game: 'Game 2', points: 115, outcome: 'Win' },
        { game: 'Game 3', points: 111, outcome: 'Win' },
        { game: 'Game 4', points: 104, outcome: 'Loss' },
        { game: 'Game 5', points: 119, outcome: 'Win' },
        { game: 'Game 6', points: 121, outcome: 'Win' },
        { game: 'Game 7', points: 109, outcome: 'Loss' },
        { game: 'Game 8', points: 124, outcome: 'Win' },
        { game: 'Game 9', points: 112, outcome: 'Win' },
        { game: 'Game 10', points: 117, outcome: 'Loss' },
      ],
      rollingAverages: {
        points: 115.4,
        assists: 25.7,
        rebounds: 46.9,
        fgPercentage: 47.8,
        threePtPercentage: 38.4,
        netRating: 4.6,
      },
    },
    highlights: [
      'Top-5 half-court defense over the last 15 games (107.1 defensive rating).',
      'Jalen Brunson usage has climbed to 31.6% with 8.2 assists per game in March.',
      'Second-chance points up 18% year-over-year thanks to Isaiah Hartenstein rebound control.',
    ],
    keyPlayers: [
      {
        name: 'Jalen Brunson',
        position: 'PG',
        trend: '31.6% usage, 7.8 drives per game creating 1.24 points per possession.',
      },
      {
        name: 'Josh Hart',
        position: 'G/F',
        trend: 'Averaging 11.2 rebounds over last 10 with elite hustle stats.',
      },
      {
        name: 'OG Anunoby',
        position: 'F',
        trend: 'Defensive matchup suppressor holding wings to 41% effective FG.',
      },
    ],
  },
  {
    name: 'Los Angeles Lakers',
    code: 'LAL',
    conference: 'Western',
    division: 'Pacific',
    coach: 'Darvin Ham',
    arena: 'Crypto.com Arena',
    performanceData: [
      { season: '2023-24', wins: 48, losses: 34, points: 117.5 },
      { season: '2022-23', wins: 43, losses: 39, points: 116.6 },
      { season: '2021-22', wins: 33, losses: 49, points: 112.1 },
      { season: '2020-21', wins: 42, losses: 30, points: 109.5 },
      { season: '2019-20', wins: 52, losses: 19, points: 113.4 },
    ],
    currentForm: {
      last10Games: [
        { game: 'Game 1', points: 121, outcome: 'Win' },
        { game: 'Game 2', points: 125, outcome: 'Win' },
        { game: 'Game 3', points: 118, outcome: 'Loss' },
        { game: 'Game 4', points: 131, outcome: 'Win' },
        { game: 'Game 5', points: 115, outcome: 'Loss' },
        { game: 'Game 6', points: 122, outcome: 'Win' },
        { game: 'Game 7', points: 111, outcome: 'Win' },
        { game: 'Game 8', points: 109, outcome: 'Loss' },
        { game: 'Game 9', points: 128, outcome: 'Win' },
        { game: 'Game 10', points: 119, outcome: 'Loss' },
      ],
      rollingAverages: {
        points: 120.3,
        assists: 26.9,
        rebounds: 43.7,
        fgPercentage: 49.6,
        threePtPercentage: 37.1,
        netRating: 2.8,
      },
    },
    highlights: [
      'Transition offense generates 1.23 points per possession, 3rd in the NBA since the break.',
      'LeBron James averaging 10.4 assists in March on 64% true shooting.',
      'Anthony Davis holds opponents to 57% at the rim, anchoring elite paint defense.',
    ],
    keyPlayers: [
      {
        name: 'LeBron James',
        position: 'F',
        trend: 'League-leading 15.2 potential assists per game during last two weeks.',
      },
      {
        name: 'Anthony Davis',
        position: 'C',
        trend: 'Averaging 28.4 points and 14.1 rebounds over previous 7 contests.',
      },
      {
        name: 'Austin Reaves',
        position: 'G',
        trend: 'Pick-and-roll efficiency up to 1.08 PPP as primary ball handler.',
      },
    ],
  },
  {
    name: 'Golden State Warriors',
    code: 'GSW',
    conference: 'Western',
    division: 'Pacific',
    coach: 'Steve Kerr',
    arena: 'Chase Center',
    performanceData: [
      { season: '2023-24', wins: 46, losses: 36, points: 118.3 },
      { season: '2022-23', wins: 44, losses: 38, points: 118.9 },
      { season: '2021-22', wins: 53, losses: 29, points: 113.8 },
      { season: '2020-21', wins: 39, losses: 33, points: 113.7 },
      { season: '2019-20', wins: 15, losses: 50, points: 106.3 },
    ],
    currentForm: {
      last10Games: [
        { game: 'Game 1', points: 124, outcome: 'Win' },
        { game: 'Game 2', points: 118, outcome: 'Win' },
        { game: 'Game 3', points: 127, outcome: 'Win' },
        { game: 'Game 4', points: 104, outcome: 'Loss' },
        { game: 'Game 5', points: 132, outcome: 'Win' },
        { game: 'Game 6', points: 110, outcome: 'Loss' },
        { game: 'Game 7', points: 129, outcome: 'Win' },
        { game: 'Game 8', points: 121, outcome: 'Win' },
        { game: 'Game 9', points: 126, outcome: 'Loss' },
        { game: 'Game 10', points: 133, outcome: 'Win' },
      ],
      rollingAverages: {
        points: 122.4,
        assists: 28.8,
        rebounds: 44.1,
        fgPercentage: 48.7,
        threePtPercentage: 39.9,
        netRating: 5.2,
      },
    },
    highlights: [
      'Top ranked in off-ball screen efficiency creating 21.4 catch-and-shoot points nightly.',
      'Stephen Curry averaging 5.2 made threes with 66% effective FG in last 10 games.',
      'Bench unit net rating of +9.7 sparked by Jonathan Kuminga two-way emergence.',
    ],
    keyPlayers: [
      {
        name: 'Stephen Curry',
        position: 'PG',
        trend: '40.3% usage in crunch time with 68% effective field goal percentage.',
      },
      {
        name: 'Klay Thompson',
        position: 'SG',
        trend: 'Scoring 23.1 points on 44% from deep when starting alongside Curry and Podziemski.',
      },
      {
        name: 'Draymond Green',
        position: 'F',
        trend: 'Facilitating 9.1 potential assists and anchoring switch-heavy defense.',
      },
    ],
  },
  {
    name: 'Cleveland Cavaliers',
    code: 'CLE',
    conference: 'Eastern',
    division: 'Central',
    coach: 'J. B. Bickerstaff',
    arena: 'Rocket Mortgage FieldHouse',
    performanceData: [
      { season: '2023-24', wins: 52, losses: 30, points: 115.1 },
      { season: '2022-23', wins: 51, losses: 31, points: 112.3 },
      { season: '2021-22', wins: 44, losses: 38, points: 112.0 },
      { season: '2020-21', wins: 22, losses: 50, points: 103.8 },
      { season: '2019-20', wins: 19, losses: 46, points: 106.9 },
    ],
    currentForm: {
      last10Games: [
        { game: 'Game 1', points: 116, outcome: 'Win' },
        { game: 'Game 2', points: 114, outcome: 'Win' },
        { game: 'Game 3', points: 101, outcome: 'Loss' },
        { game: 'Game 4', points: 119, outcome: 'Win' },
        { game: 'Game 5', points: 123, outcome: 'Win' },
        { game: 'Game 6', points: 108, outcome: 'Loss' },
        { game: 'Game 7', points: 112, outcome: 'Loss' },
        { game: 'Game 8', points: 125, outcome: 'Win' },
        { game: 'Game 9', points: 117, outcome: 'Win' },
        { game: 'Game 10', points: 111, outcome: 'Loss' },
      ],
      rollingAverages: {
        points: 114.2,
        assists: 26.1,
        rebounds: 44.8,
        fgPercentage: 48.1,
        threePtPercentage: 37.6,
        netRating: 3.9,
      },
    },
    highlights: [
      'Own the league’s best defensive rating (106.4) since the All-Star break.',
      'Donovan Mitchell averaging 29.6 points and 6.5 assists over his last 12 appearances.',
      'Jarrett Allen producing 17 double-doubles in a 20-game span.',
    ],
    keyPlayers: [
      {
        name: 'Donovan Mitchell',
        position: 'SG',
        trend: 'High-volume creator with 34% usage and elite pull-up efficiency.',
      },
      {
        name: 'Darius Garland',
        position: 'PG',
        trend: 'Running 52 pick-and-rolls per game generating 1.09 PPP for the Cavs.',
      },
      {
        name: 'Jarrett Allen',
        position: 'C',
        trend: 'Anchor of defensive schemes with 19.4 rebound chances nightly.',
      },
    ],
  },
];

const teamsData = teamProfiles.reduce((acc, team) => {
  acc[team.name] = team;
  return acc;
}, {});

const getCanonicalTeamName = (teamName = '') => {
  const normalized = teamName.trim().toLowerCase();
  return Object.keys(teamsData).find((name) => name.toLowerCase() === normalized) || null;
};

const matchupDefinitions = [
  {
    teams: ['New York Knicks', 'Los Angeles Lakers'],
    summary:
      'Knicks lean on half-court execution and glass dominance while the Lakers push pace through LeBron-led transition opportunities.',
    pace: 98.1,
    headToHead: {
      'New York Knicks': {
        wins: 6,
        losses: 4,
        avgPoints: 112.4,
        offensiveRating: 114.2,
        defensiveRating: 108.3,
        reboundMargin: '+4.2',
      },
      'Los Angeles Lakers': {
        wins: 4,
        losses: 6,
        avgPoints: 108.1,
        offensiveRating: 111.0,
        defensiveRating: 115.4,
        reboundMargin: '-4.2',
      },
    },
    keyFactors: [
      'New York holds the Lakers to 31% shooting from deep over the last two seasons.',
      'Lakers generate 18.2 fast-break points per meeting, best mark against Eastern opponents.',
      'Bench units favor New York with a +8.7 net rating in head-to-head minutes.',
    ],
    recentGames: [
      {
        date: '2024-02-12',
        venue: 'Madison Square Garden',
        winner: 'New York Knicks',
        scores: {
          'New York Knicks': 118,
          'Los Angeles Lakers': 109,
        },
      },
      {
        date: '2023-11-13',
        venue: 'Crypto.com Arena',
        winner: 'Los Angeles Lakers',
        scores: {
          'New York Knicks': 112,
          'Los Angeles Lakers': 118,
        },
      },
      {
        date: '2023-03-12',
        venue: 'Crypto.com Arena',
        winner: 'New York Knicks',
        scores: {
          'New York Knicks': 112,
          'Los Angeles Lakers': 108,
        },
      },
    ],
  },
  {
    teams: ['New York Knicks', 'Golden State Warriors'],
    summary:
      'Warriors spacing stretches the Knicks defense, but New York counters with physicality, offensive rebounds, and drives attacking closeouts.',
    pace: 101.3,
    headToHead: {
      'New York Knicks': {
        wins: 5,
        losses: 5,
        avgPoints: 114.2,
        offensiveRating: 112.9,
        defensiveRating: 113.7,
        reboundMargin: '+3.6',
      },
      'Golden State Warriors': {
        wins: 5,
        losses: 5,
        avgPoints: 116.8,
        offensiveRating: 118.7,
        defensiveRating: 115.5,
        reboundMargin: '-3.6',
      },
    },
    keyFactors: [
      'Golden State averages 16.4 made threes versus New York, forcing cross-matches in transition.',
      'Knicks own a +12 free-throw attempt differential thanks to aggressive drives from Brunson and Hart.',
      'Steph Curry vs. Knicks traps yields 1.04 points per possession when he hits the short-roll outlet.',
    ],
    recentGames: [
      {
        date: '2024-01-18',
        venue: 'Chase Center',
        winner: 'Golden State Warriors',
        scores: {
          'New York Knicks': 115,
          'Golden State Warriors': 123,
        },
      },
      {
        date: '2023-12-10',
        venue: 'Madison Square Garden',
        winner: 'New York Knicks',
        scores: {
          'New York Knicks': 120,
          'Golden State Warriors': 114,
        },
      },
      {
        date: '2023-02-23',
        venue: 'Chase Center',
        winner: 'Golden State Warriors',
        scores: {
          'New York Knicks': 107,
          'Golden State Warriors': 122,
        },
      },
    ],
  },
  {
    teams: ['New York Knicks', 'Cleveland Cavaliers'],
    summary:
      'Playoff-style defensive battle where both teams limit turnovers; New York leans into rebounding while Cleveland rides Mitchell-Garland creation.',
    pace: 94.6,
    headToHead: {
      'New York Knicks': {
        wins: 7,
        losses: 3,
        avgPoints: 108.6,
        offensiveRating: 109.7,
        defensiveRating: 104.8,
        reboundMargin: '+6.3',
      },
      'Cleveland Cavaliers': {
        wins: 3,
        losses: 7,
        avgPoints: 102.7,
        offensiveRating: 104.1,
        defensiveRating: 109.2,
        reboundMargin: '-6.3',
      },
    },
    keyFactors: [
      'Knicks limit Mitchell to 41% shooting with mixed coverages and physicality at the point of attack.',
      'Cleveland protects the paint, allowing only 45 points in the paint per game, forcing New York jumpers.',
      'Low turnover environment—both clubs rank top-5 in turnover percentage during meetings.',
    ],
    recentGames: [
      {
        date: '2024-03-05',
        venue: 'Rocket Mortgage FieldHouse',
        winner: 'New York Knicks',
        scores: {
          'New York Knicks': 109,
          'Cleveland Cavaliers': 102,
        },
      },
      {
        date: '2024-01-24',
        venue: 'Madison Square Garden',
        winner: 'Cleveland Cavaliers',
        scores: {
          'New York Knicks': 101,
          'Cleveland Cavaliers': 109,
        },
      },
      {
        date: '2023-11-01',
        venue: 'Madison Square Garden',
        winner: 'New York Knicks',
        scores: {
          'New York Knicks': 112,
          'Cleveland Cavaliers': 103,
        },
      },
    ],
  },
  {
    teams: ['Los Angeles Lakers', 'Golden State Warriors'],
    summary:
      'Two contrasting styles—Lakers batter the paint and draw fouls while the Warriors rely on perimeter gravity and ball movement.',
    pace: 102.4,
    headToHead: {
      'Los Angeles Lakers': {
        wins: 6,
        losses: 4,
        avgPoints: 117.9,
        offensiveRating: 116.1,
        defensiveRating: 112.7,
        reboundMargin: '+3.1',
      },
      'Golden State Warriors': {
        wins: 4,
        losses: 6,
        avgPoints: 115.3,
        offensiveRating: 113.4,
        defensiveRating: 116.8,
        reboundMargin: '-3.1',
      },
    },
    keyFactors: [
      'Anthony Davis averages 12 free-throw attempts per matchup, forcing early foul trouble.',
      'Golden State’s small-ball units generate 1.28 points per possession when Draymond screens for Curry.',
      'Lakers push pace off live rebounds (18% transition frequency) to catch Warriors cross-matched.',
    ],
    recentGames: [
      {
        date: '2024-03-16',
        venue: 'Crypto.com Arena',
        winner: 'Los Angeles Lakers',
        scores: {
          'Los Angeles Lakers': 128,
          'Golden State Warriors': 121,
        },
      },
      {
        date: '2024-02-22',
        venue: 'Chase Center',
        winner: 'Golden State Warriors',
        scores: {
          'Los Angeles Lakers': 115,
          'Golden State Warriors': 128,
        },
      },
      {
        date: '2023-05-12',
        venue: 'Crypto.com Arena',
        winner: 'Los Angeles Lakers',
        scores: {
          'Los Angeles Lakers': 122,
          'Golden State Warriors': 101,
        },
      },
    ],
  },
  {
    teams: ['Los Angeles Lakers', 'Cleveland Cavaliers'],
    summary:
      'Physical interior duel with Davis versus Allen/Mobley while Mitchell and LeBron trade elite shot creation.',
    pace: 97.6,
    headToHead: {
      'Los Angeles Lakers': {
        wins: 5,
        losses: 5,
        avgPoints: 113.2,
        offensiveRating: 112.5,
        defensiveRating: 111.9,
        reboundMargin: '+1.7',
      },
      'Cleveland Cavaliers': {
        wins: 5,
        losses: 5,
        avgPoints: 112.4,
        offensiveRating: 112.1,
        defensiveRating: 112.7,
        reboundMargin: '-1.7',
      },
    },
    keyFactors: [
      'Cleveland limits Lakers transition looks to 13% frequency—well below their season average.',
      'LeBron averages 29.4 points with 10.1 assists in last five meetings, exploiting switch mismatches.',
      'Donovan Mitchell attacks drop coverage for 1.16 PPP when Davis sits.',
    ],
    recentGames: [
      {
        date: '2024-01-29',
        venue: 'Rocket Mortgage FieldHouse',
        winner: 'Los Angeles Lakers',
        scores: {
          'Los Angeles Lakers': 123,
          'Cleveland Cavaliers': 118,
        },
      },
      {
        date: '2023-12-18',
        venue: 'Crypto.com Arena',
        winner: 'Cleveland Cavaliers',
        scores: {
          'Los Angeles Lakers': 110,
          'Cleveland Cavaliers': 116,
        },
      },
      {
        date: '2023-03-26',
        venue: 'Crypto.com Arena',
        winner: 'Los Angeles Lakers',
        scores: {
          'Los Angeles Lakers': 117,
          'Cleveland Cavaliers': 108,
        },
      },
    ],
  },
  {
    teams: ['Golden State Warriors', 'Cleveland Cavaliers'],
    summary:
      'Warriors spacing versus Cleveland size; whoever controls the tempo between pace and grind gains the edge.',
    pace: 100.2,
    headToHead: {
      'Golden State Warriors': {
        wins: 6,
        losses: 4,
        avgPoints: 118.7,
        offensiveRating: 117.9,
        defensiveRating: 110.8,
        reboundMargin: '-1.8',
      },
      'Cleveland Cavaliers': {
        wins: 4,
        losses: 6,
        avgPoints: 112.9,
        offensiveRating: 111.3,
        defensiveRating: 116.6,
        reboundMargin: '+1.8',
      },
    },
    keyFactors: [
      'Cleveland hammers the offensive glass for 14.6 second-chance points per game against Golden State.',
      'Warriors average 30.2 assists, punishing the Cavs whenever their two-big lineup is forced to rotate.',
      'Steph Curry vs. Cavs drop coverage yields 1.33 PPP on pull-up threes.',
    ],
    recentGames: [
      {
        date: '2024-02-08',
        venue: 'Chase Center',
        winner: 'Golden State Warriors',
        scores: {
          'Golden State Warriors': 126,
          'Cleveland Cavaliers': 118,
        },
      },
      {
        date: '2023-11-05',
        venue: 'Rocket Mortgage FieldHouse',
        winner: 'Cleveland Cavaliers',
        scores: {
          'Golden State Warriors': 110,
          'Cleveland Cavaliers': 115,
        },
      },
      {
        date: '2023-01-20',
        venue: 'Rocket Mortgage FieldHouse',
        winner: 'Golden State Warriors',
        scores: {
          'Golden State Warriors': 120,
          'Cleveland Cavaliers': 114,
        },
      },
    ],
  },
];

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

const fantasyAdvice = {
  lineup: {
    label: 'Optimal Lineup Suggestions',
    description: 'Build a high-upside weekly lineup using pace, usage, and opponent matchup data.',
    summary:
      'Lean into pace-up matchups while stacking reliable usage monsters. Prioritize players drawing soft defenses and target heavy transition opportunities.',
    lineup: [
      {
        position: 'PG',
        player: 'Jalen Brunson',
        team: 'New York Knicks',
        rationale: 'Facing two bottom-10 pick-and-roll defenses; 34% usage with 9.1 assists in last 10.',
      },
      {
        position: 'SG',
        player: 'Donovan Mitchell',
        team: 'Cleveland Cavaliers',
        rationale: 'Gets three pace-up opponents with weak point-of-attack resistance—prime scoring week.',
      },
      {
        position: 'SF',
        player: 'LeBron James',
        team: 'Los Angeles Lakers',
        rationale: 'Projected for 36 minutes nightly in a four-game slate featuring two top-10 pace teams.',
      },
      {
        position: 'PF',
        player: 'Draymond Green',
        team: 'Golden State Warriors',
        rationale: 'Stuffing box scores as small-ball five (9.6 assists, 9.2 rebounds last five contests).',
      },
      {
        position: 'C',
        player: 'Anthony Davis',
        team: 'Los Angeles Lakers',
        rationale: 'Averages 28/14/3 with 3.2 blocks against upcoming interior matchups.',
      },
      {
        position: 'G',
        player: 'Austin Reaves',
        team: 'Los Angeles Lakers',
        rationale: 'Secondary ball-handler upside; 27% usage with second unit, strong free-throw volume.',
      },
      {
        position: 'F',
        player: 'Josh Hart',
        team: 'New York Knicks',
        rationale: 'Elite rebounding wing averaging 38 minutes and 12 boards—secure floor with stocks.',
      },
      {
        position: 'UTIL',
        player: 'Stephen Curry',
        team: 'Golden State Warriors',
        rationale: 'Three opponents bottom third in defending pull-up threes; expect 5+ treys nightly.',
      },
    ],
    benchStreamers: [
      'Immanuel Quickley (TOR) for assists and threes mid-week.',
      'Norman Powell (LAC) for scoring burst in back-to-back sets.',
      'Nick Richards (CHA) as weekend rebounds/blocks specialist.',
    ],
    strategyTips: [
      'Target four-game weeks with at least one back-to-back to maximize counting stats.',
      'Prioritize players drawing bottom-10 defenses in opponent effective field goal percentage.',
      'Utilize UTIL slot for the highest projected usage regardless of position eligibility.',
    ],
    keyMetrics: {
      projectedGames: 27,
      averageUsage: '27.4%',
      estimatedFantasyPoints: 1435,
    },
  },
  trades: {
    label: 'Trading/Free Agency Advice',
    description: 'Identify buy-low, sell-high, and waiver-wire opportunities based on trend analysis.',
    summary:
      'Buy into players trending up in usage or efficiency while moving on from inflated shooting heaters. Balance your roster by addressing categorical weaknesses.',
    buyTargets: [
      {
        player: 'Darius Garland',
        team: 'Cleveland Cavaliers',
        rationale: 'Minutes restriction lifted and assist rate climbing; prime buy-low for playoffs.',
      },
      {
        player: 'Klay Thompson',
        team: 'Golden State Warriors',
        rationale: 'Reinserted into starting five with 28-minute floor—elite threes and points streamer.',
      },
      {
        player: 'OG Anunoby',
        team: 'New York Knicks',
        rationale: 'Stuffing stocks (2.6 steals + blocks) and high efficiency; fits 9-cat builds perfectly.',
      },
    ],
    sellHighCandidates: [
      {
        player: 'Rui Hachimura',
        team: 'Los Angeles Lakers',
        rationale: 'Shooting 63% over last 8; regression likely once defenses adjust to AD double-teams.',
      },
      {
        player: 'Caris LeVert',
        team: 'Cleveland Cavaliers',
        rationale: 'Usage dips with Garland/Mitchell healthy—use hot stretch to swing a trade.',
      },
    ],
    waiverAdds: [
      {
        player: 'Donte DiVincenzo',
        team: 'New York Knicks',
        rationale: 'Top-15 in made threes with expanded minutes; contributes steals.',
      },
      {
        player: 'Brandin Podziemski',
        team: 'Golden State Warriors',
        rationale: 'Across-the-board production, elite rebounds for a guard.',
      },
    ],
    strategyTips: [
      'Always package sell-high players with safe floor contributors to land established stars.',
      'Scan weekly schedules—target teams with Monday/Wednesday/Fri heavy loads to win volume.',
      'When streaming, prioritize minutes security over name value late in the season.',
    ],
  },
  sleepers: {
    label: 'High-Value Sleepers & Injury Watch',
    description: 'Monitor emerging contributors and injury pivots to stay ahead of the waiver wire.',
    summary:
      'Use injury reports and role changes to stash upside plays before they break out. Blend short-term injury fill-ins with high-upside stashes.',
    watchList: [
      {
        player: 'Miles McBride',
        team: 'New York Knicks',
        rationale: 'Crushing second-unit minutes with elite steals; leap in minutes if Brunson rests.',
      },
      {
        player: 'Max Christie',
        team: 'Los Angeles Lakers',
        rationale: 'Monitoring Reeves/DLo workload—Christie offers 3-and-D floor when minutes spike.',
      },
      {
        player: 'Isaiah Mobley',
        team: 'Cleveland Cavaliers',
        rationale: 'Stash for Allen injury insurance; per-36 double-double machine.',
      },
    ],
    injuryPivots: [
      {
        situation: 'Warriors resting veterans on back-to-backs',
        pivot: 'Jonathan Kuminga becomes must-start with 22+ usage and defensive stats.',
      },
      {
        situation: 'Lakers monitoring Anthony Davis minutes',
        pivot: 'Jaxson Hayes stream for rebounds/blocks when Davis sits.',
      },
    ],
    strategyTips: [
      'Check injury reports 90 minutes before tip-off to capitalize on late-breaking absences.',
      'Stagger sleeper adds with roster needs—stash upside wings if you’re heavy on guards.',
      'Plan waiver adds around low-competition nights (Tuesday/Thursday) to maximize games played.',
    ],
  },
};

app.get('/api/teams', (_req, res) => {
  const teams = teamProfiles.map((team) => ({
    name: team.name,
    code: team.code,
    conference: team.conference,
    division: team.division,
    coach: team.coach,
    latestSeason: team.performanceData[0],
    currentNetRating: team.currentForm?.rollingAverages?.netRating ?? null,
  }));

  res.json(teams);
});

app.get('/api/teams/:teamName', (req, res) => {
  const teamName = getCanonicalTeamName(req.params.teamName);
  if (!teamName) {
    return res.status(404).json({ error: 'Team not found' });
  }

  res.json(teamsData[teamName]);
});

app.get('/api/matchups/:teamName1/:teamName2', (req, res) => {
  const teamOne = getCanonicalTeamName(req.params.teamName1);
  const teamTwo = getCanonicalTeamName(req.params.teamName2);

  if (!teamOne || !teamTwo) {
    return res.status(404).json({ error: 'One or both teams were not found' });
  }

  if (teamOne === teamTwo) {
    return res.status(400).json({ error: 'Select two different teams to analyze a matchup' });
  }

  const matchup = matchupMap[teamOne]?.[teamTwo];

  if (!matchup) {
    return res.status(404).json({ error: 'Matchup data not available for the selected teams' });
  }

  res.json({
    team1: teamsData[teamOne],
    team2: teamsData[teamTwo],
    matchup,
  });
});

app.get('/api/fantasy/options', (_req, res) => {
  const options = Object.entries(fantasyAdvice).map(([id, option]) => ({
    id,
    label: option.label,
    description: option.description,
  }));

  res.json(options);
});

app.get('/api/fantasy', (req, res) => {
  const optionId = req.query.option;

  if (!optionId) {
    return res.status(400).json({ error: 'Provide an option query parameter (e.g. ?option=lineup)' });
  }

  const advice = fantasyAdvice[optionId];

  if (!advice) {
    return res.status(404).json({ error: 'Fantasy advice option not found' });
  }

  res.json(advice);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
