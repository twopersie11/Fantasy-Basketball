// client/src/pages/TeamPerformanceAnalysis.js
import React, { useState } from 'react';
import '../components/Header.css';
import './TeamPerformanceAnalysis.css';
import NavButton from '../components/NavButton';
import '../components/Form.css'
import logo from '../images/tpa.png';
import Modal from '../components/Modal.js';

function TeamPerformanceAnalysis() {
  const [teamName, setTeamName] = useState('');
  const [data, setData] = useState({});
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchTeamData = (teamName) => {
    const encodedTeamName = encodeURIComponent(teamName.trim());
    console.log('Team Name: ', encodedTeamName);
    fetch(`http://localhost:4000/api/teams/${encodedTeamName}`)
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
    fetchTeamData(teamName);
  };

  const handleCloseModal = () => {
    setShowModal(false); // Hide modal when close button is clicked
  };

  return (
    <div>
      <header>
        <img src={logo} alt="NBALogo" className="nbalogo" />
      </header>

      <div>
        <NavButton path="/" label="⇦   Return to Home" className="backbutton"/>

        <div className = "inner">
          
        <h2>ENTER A TEAM</h2>
        <p style={{fontSize: "80%"}}>→ Analyze historical data over the last nine seasons to predict future team performances 
          <br /> → Identify rolling averages of key statistics over recent games to determine current form and identify trends</p>
        <hr />
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Format: [City] [Team]"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
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
          {data.name && (
            <div className = "mainPage">
              <h1>{data.name}</h1>
              <hr />
              <p>Scroll through this module to see your team's relevant performance insights.</p>
              <hr />
                <h3>HISTORICAL DATA INSIGHTS</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Season</th>
                      <th>Wins</th>
                      <th>Losses</th>
                      <th>Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.performanceData.map((season, index) => (
                      <tr key={index}>
                        <td>{season.season}</td>
                        <td>{season.wins}</td>
                        <td>{season.losses}</td>
                        <td>{season.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <hr />
                <h3>CURRENT FORM</h3>
                  <h4>Last 10 Games:</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>Game</th>
                        <th>Points</th>
                        <th>Outcome</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.currentForm.last10Games.map((game, index) => (
                        <tr key={index}>
                          <td>{game.game}</td>
                          <td>{game.points}</td>
                          <td>{game.outcome}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <h4>Rolling Averages:</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>Statistic</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(data.currentForm.rollingAverages).map(([stat, value], index) => (
                        <tr key={index}>
                          <td>{stat}</td>
                          <td>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default TeamPerformanceAnalysis;
