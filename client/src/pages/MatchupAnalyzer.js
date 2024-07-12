

// client/src/pages/TeamPerformanceAnalysis.js
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import NavButton from '../components/NavButton';
import logo from '../images/ma.png'
import Modal from '../components/Modal.js';

function MatchupAnalyzer() {
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [data, setData] = useState({});
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchMatchupData = (team1, team2) => {
    const encodedTeam1 = encodeURIComponent(team1.trim());
    const encodedTeam2 = encodeURIComponent(team2.trim());
    console.log('Team 1: ', encodedTeam1);
    console.log('Team 2: ', encodedTeam2);

    fetch(`http://localhost:4000/api/matchup/${encodedTeam1}/${encodedTeam2}`)
      .then(response => {
        console.log(response.ok);
        console.log('Response', response);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Data fetched for TeamPerformanceAnalysis: ", data);
        setData(data);
        setError('');
        setShowModal(true);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Error fetching data. Please try again.');
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchMatchupData(team1, team2);
  };

  const handleCloseModal = () => {
    setShowModal(false); // Hide modal when close button is clicked
  };

  // const renderChart = (team1Data, team2Data) => {
  //   const data = {
  //     labels: ['Team 1', 'Team 2'],
  //     datasets: [
  //       {
  //         label: 'Average Points',
  //         data: [team1Data.avgPoints, team2Data.avgPoints],
  //         backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)'],
  //         borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
  //         borderWidth: 1,
  //       },
  //     ],
  //   };

  //   const options = {
  //     scales: {
  //       y: {
  //         beginAtZero: true,
  //       },
  //     },
  //   };

  //   return <Bar data={data} options={options} />;
  // };

  return (
    <div>
      <header>
        <img src={logo} alt="NBALogo" className="nbalogo" />
      </header>

      <div>
        <NavButton path="/" label="⇦   Return to Home" className="backbutton"/>

        <div className = "inner">
          
        <h2>ENTER TWO TEAMS TO COMPARE</h2>
        <p style={{fontSize: "80%"}}>→ Analyze historical matchups between teams to evaluate matchup outcomes
        <br /> → Highlight performance trends against specific types of opponent specialities</p>
        <hr />
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Team 1: [City] [Team]"
            value={team1}
            onChange={(e) => setTeam1(e.target.value)}
            className="team-input"
          />
          <input 
            type="text"
            placeholder="Team 2: [City] [Team]"
            value={team2}
            onChange={(e) => setTeam2(e.target.value)}
            className="team-input"
          />
          <p>
          <strong>Format:</strong> [City] [Team] <br />
          <strong>Example: </strong> New York Knicks</p>
          <button type="submit" className="submit" label = "Submit" style={{margin: '1px'}}>Submit</button>
        </form>

        </div>


        {error && <p className="error">{error}</p>}
        
        <Modal show={showModal} handleClose={handleCloseModal}>
          {data.team1 && data.team2 && data.matchup && (
            <div className = "mainPage">
              <h1>{team1} v. {team2}</h1>
              <hr />
              <p>Scroll through this module to see the matchup between {team1} and {team2}.</p>
              <hr />
                <h3>WIN/LOSS RECORD</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Team</th>
                      <th>Wins</th>
                      <th>Losses</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{team1}</td>
                      <td>{data.matchup.team1VsTeam2.wins}</td>
                      <td>{data.matchup.team1VsTeam2.losses}</td>
                    </tr>
                    <tr>
                      <td>{team2}</td>
                      <td>{data.matchup.team2VsTeam1.wins}</td>
                      <td>{data.matchup.team2VsTeam1.losses}</td>
                    </tr>
                  </tbody>
                </table>
                <hr />
                <h3>AVERAGE POINTS SCORED</h3>
                {/*{renderChart(data.matchup.team1VsTeam2, data.matchup.team2VsTeam1)}*/}

                <h3>Performance Trends Against Specific Opponents</h3>
                <h5>Against Defensive Teams</h5>
                <table>
                  <thead>
                    <tr>
                      <th>Team</th>
                      <th>Wins</th>
                      <th>Losses</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{team1}</td>
                      <td>{data.team1.performanceData[0].wins}</td>
                      <td>{data.team1.performanceData[0].losses}</td>
                    </tr>
                    <tr>
                      <td>{team2}</td>
                      <td>{data.team2.performanceData[0].wins}</td>
                      <td>{data.team2.performanceData[0].losses}</td>
                    </tr>
                  </tbody>
                </table>
                <h5>Against Offensive Teams</h5>
                <table>
                  <thead>
                    <tr>
                      <th>Team</th>
                      <th>Wins</th>
                      <th>Losses</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{team1}</td>
                      <td>{data.team1.performanceData[1].wins}</td>
                      <td>{data.team1.performanceData[1].losses}</td>
                    </tr>
                    <tr>
                      <td>{team2}</td>
                      <td>{data.team2.performanceData[1].wins}</td>
                      <td>{data.team2.performanceData[1].losses}</td>
                    </tr>
                  </tbody>
                </table>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default MatchupAnalyzer;

