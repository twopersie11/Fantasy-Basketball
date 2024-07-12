const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/data', (req,res) => {
    res.json({
        data: "Server data"
    })
})

/** MOCK DATA FOR TESTING/DEVELOPMENT PURPOSES */
const teamsData = {
  "New York Knicks": {
    name: "New York Knicks (MOCK DATA)",
    performanceData: [
      { season: "2022", wins: 45, losses: 37, points: 110 },
      { season: "2021", wins: 41, losses: 41, points: 108 },
      // Add more seasons as needed
    ],
    currentForm: {
      last10Games: [
        { game: "Game 1", points: 110, outcome: "Win" },
        { game: "Game 2", points: 105, outcome: "Loss" },
        // Add more games as needed
      ],
      rollingAverages: {
        points: 108,
        assists: 25,
        rebounds: 45,
        fgPercentage: 45.6,
        threePtPercentage: 37.2,
      },
    },
  },
  // Add more teams as needed
};

// const teamsData = {
//   "New York Knicks": {
//     performanceData: [
//       { season: "2022", wins: 45, losses: 37, points: 110 },
//       { season: "2021", wins: 41, losses: 41, points: 108 },
//     ],
//     currentForm: {
//       last10Games: [
//         { game: "Game 1", points: 110, outcome: "Win" },
//         { game: "Game 2", points: 105, outcome: "Loss" },
//       ],
//       rollingAverages: {
//         points: 108,
//         assists: 25,
//         rebounds: 45,
//         fgPercentage: 45.6,
//         threePtPercentage: 37.2,
//       },
//     },
//   },
//   "Los Angeles Lakers": {
//     performanceData: [
//       { season: "2022", wins: 50, losses: 32, points: 115 },
//       { season: "2021", wins: 42, losses: 40, points: 112 },
//     ],
//     currentForm: {
//       last10Games: [
//         { game: "Game 1", points: 120, outcome: "Win" },
//         { game: "Game 2", points: 110, outcome: "Loss" },
//       ],
//       rollingAverages: {
//         points: 110,
//         assists: 27,
//         rebounds: 47,
//         fgPercentage: 46.2,
//         threePtPercentage: 38.1,
//       },
//     },
//   },
//   "Cleveland Cavaliers": {
//     performanceData: [
//       { season: "2022", wins: 50, losses: 32, points: 115 },
//       { season: "2021", wins: 42, losses: 40, points: 112 },
//     ],
//     matchups: {
//       "Los Angeles Lakers": { season: "2022", wins: 10, losses: 12, avgPoints: 105 },
//       "Chicago Bulls": { season: "2022", wins: 8, losses: 5, avgPoints: 110 },
//       "Golden State Warriors": { season: "2022", wins: 2, losses: 10, avgPoints: 106 }
//     },
//     currentForm: {
//       last10Games: [
//         { game: "Game 1", points: 120, outcome: "Win" },
//         { game: "Game 2", points: 110, outcome: "Loss" },
//       ],
//       rollingAverages: {
//         points: 110,
//         assists: 27,
//         rebounds: 47,
//         fgPercentage: 46.2,
//         threePtPercentage: 38.1,
//       },
//     },
//   },
//   "Golden State Warriors": {
//     performanceData: [
//       { season: "2022", wins: 60, losses: 22, points: 163 },
//       { season: "2021", wins: 45, losses: 37, points: 121 },
//     ],
//     matchups: {
//       "Los Angeles Lakers": { season: "2022", wins: 10, losses: 12, avgPoints: 105 },
//       "Chicago Bulls": { season: "2022", wins: 8, losses: 5, avgPoints: 110 },
//       "Cleveland Cavaliers": { season: "2022", wins: 10, losses: 2, avgPoints: 113 }
//     },
//     currentForm: {
//       last10Games: [
//         { game: "Game 1", points: 120, outcome: "Win" },
//         { game: "Game 2", points: 110, outcome: "Loss" },
//       ],
//       rollingAverages: {
//         points: 110,
//         assists: 27,
//         rebounds: 47,
//         fgPercentage: 46.2,
//         threePtPercentage: 38.1,
//       },
//     },
//   },
//   // Add more teams as needed
// };
  
app.get('/api/teams/:teamName', (req, res) => {
    const teamName = decodeURIComponent(req.params.teamName);
    console.log("Received team name:", teamName);

    const teamData = teamsData[teamName];
  
    if (teamData) {
      res.json(teamData);
    } else {
      res.status(404).json({ error: 'Team not found' });
    }
});

// app.get('/api/matchup/:teamName1/:teamName2', (req, res) => {
//   const teamName1 = decodeURIComponent(req.params.teamName1);
//   const teamName2 = decodeURIComponent(req.params.teamName2);
//   console.log("Received team names:", teamName1, "and", teamName2); // Log the received team names

//   const teamData1 = teamsData[teamName1];
//   const teamData2 = teamsData[teamName2];

//   if (teamData1 && teamData2) {
//     const matchupData = {
//       team1: teamData1,
//       team2: teamData2,
//       matchup: {
//         team1VsTeam2: teamData1.matchups[teamName2],
//         team2VsTeam1: teamData2.matchups[teamName1]
//       }
//     };
//     console.log("Sending matchup data:", matchupData); // Log the matchup data being sent
//     res.json(matchupData);
//   } else {
//     console.log("One or both teams not found");
//     res.status(404).json({ error: 'One or both teams not found' });
//   }
// });

const PORT = 4000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))