// client/src/pages/FantasyRecommendations.js
import React, { useEffect, useState } from 'react';
import NavButton from '../components/NavButton';
import logo from "../images/Fr.png"

const options = [
  "Optimal Lineup Suggestions", "Trading/Free Agency Advice"
];

function FantasyRecommendations() {
  const [option, setOption] = useState('');
  // const [data, setData] = useState({});
  const [error, setError] = useState('');

  const fantasyRec = (option) => {
    const encodedOption = encodeURIComponent(option.trim());
    console.log('Option: ', encodedOption);

    fetch(`http://localhost:4000/api/matchup/${encodedOption}`)
      // .then(response => {
      //   console.log(response.ok);
      //   console.log('Response', response);
      //   if (!response.ok) {
      //     throw new Error(`Network response was not ok: ${response.statusText}`);
      //   }
      //   return response.json();
      // })
      // .then(data => {
      //   console.log("Data fetched for TeamPerformanceAnalysis: ", data);
      //   setData(data);
      //   setError('');
      //   setShowModal(true);
      // })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Error fetching data. Please try again.');
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fantasyRec(option);
  };

  // const handleCloseModal = () => {
  //   setShowModal(false); // Hide modal when close button is clicked
  // };

  return (
    <div>
      <header>
        <img src={logo} alt="NBALogo" className="nbalogo"/>
      </header>

      <div>
        <NavButton path="/" label="⇦   Return to Home" className="backbutton"/>

        <div className = "inner">
          
        <h2>SELECT FANTASY CRITERIA</h2>
        <p style={{fontSize: "80%"}}>→ Prioritize specific statistics and receive tailored recommendations</p>
        <hr />
        <form onSubmit={handleSubmit}>
        <select
              value={option}
              onChange={(e) => setOption(e.target.value)}
              className="team-input"
            >
              <option value="" disabled>Select an option</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          <br /> <br />
          <button type="submit" className="submit" label = "Submit" style={{margin: '1px'}}>Submit</button>
        </form>

        </div>


        {error && <p className="error">{error}</p>}
        
        {/* <Modal show={showModal} handleClose={handleCloseModal}>
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
        </Modal> */}
      </div>
    </div>
  );
}

export default FantasyRecommendations;
