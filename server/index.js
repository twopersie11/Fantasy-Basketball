const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MOCK DATA
app.get('/api/data', (req,res) => {
    res.json({
        data: "Server data"
    })
})

// app.get('/kobe', (req, res) => {
//     res.json({
//         data: "Kobe Bryant's performance data"
//     });
// });

// app.get('/michael', (req, res) => {
//     res.json({
//         data: "Michael Jordan's performance data"
//     });
// });

// app.get('/lebron', (req, res) => {
//     res.json({
//         data: "Lebron James' performance data"
//     });
// });

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

const PORT = 4000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))