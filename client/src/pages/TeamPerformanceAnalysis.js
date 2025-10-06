// client/src/pages/TeamPerformanceAnalysis.js
import React, { useEffect, useState } from 'react';
import '../components/Header.css';
import './TeamPerformanceAnalysis.css';
import NavButton from '../components/NavButton';
import '../components/Form.css';
import logo from '../images/tpa.png';
import Modal from '../components/Modal.js';
import YahooConnectButton from '../components/YahooConnectButton';
import { getTeamDetails } from '../services/api';

function TeamPerformanceAnalysis() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [teamData, setTeamData] = useState(null);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [loadingTeamData, setLoadingTeamData] = useState(false);

  const loadTeamDetails = async (teamName, { openModal = true } = {}) => {
    if (!teamName) {
      setError('Lütfen bir takım seçin.');
      return;
    }

    setLoadingTeamData(true);
    try {
      const data = await getTeamDetails(teamName);
      setTeamData(data);
      setError('');
      if (openModal) {
        setShowModal(true);
      }
    } catch (err) {
      console.error('Error fetching team data', err);
      setError('Takım verileri alınırken bir hata oluştu.');
    } finally {
      setLoadingTeamData(false);
    }
  };

  useEffect(() => {
    const initialiseTeams = async () => {
      setLoadingTeams(true);
      try {
        const response = await fetch('/api/teams', { credentials: 'include' });
        if (!response.ok) {
          throw new Error(`Failed to fetch teams: ${response.status}`);
        }

        const fetchedTeams = await response.json();
        setTeams(fetchedTeams);
        if (fetchedTeams.length > 0) {
          const defaultTeam = fetchedTeams[0].name;
          setSelectedTeam(defaultTeam);
          await loadTeamDetails(defaultTeam, { openModal: true });
        }
        setError('');
      } catch (err) {
        console.error('Unable to load teams', err);
        setTeams([]);
        setSelectedTeam('');
        setTeamData(null);
        setError('Takım listesi yüklenemedi. Tekrar Dene.');
      } finally {
        setLoadingTeams(false);
      }
    };

    initialiseTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await loadTeamDetails(selectedTeam, { openModal: true });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="team-performance-page">
      <header className="page-header">
        <img src={logo} alt="Team performance" className="nbalogo" />
      </header>

      <div className="page-content">
        <div className="page-toolbar">
          <NavButton path="/" label="⇦   Return to Home" className="backbutton" />
          <YahooConnectButton className="page-yahoo-button" />
        </div>

        <div className="inner">
          <h2>SELECT A TEAM</h2>
          <p className="helper-text">
            → Analyze historical data over the last five seasons to project future performance.
            <br /> → Review rolling averages from the most recent 10 games to understand current form.
          </p>
          <hr />
          <form onSubmit={handleSubmit} className="form-grid">
            <select
              value={selectedTeam}
              onChange={(event) => setSelectedTeam(event.target.value)}
              className="team-input"
              disabled={loadingTeams}
            >
              {teams.map((team) => (
                <option key={team.code} value={team.name}>
                  {team.name} — {team.coach}
                </option>
              ))}
            </select>
            <button type="submit" className="submit" disabled={loadingTeamData || loadingTeams}>
              {loadingTeamData ? 'Loading…' : 'View Insights'}
            </button>
          </form>

          {error && <p className="error">{error}</p>}
        </div>

        <Modal show={showModal} handleClose={handleCloseModal}>
          {teamData && (
            <div className="mainPage">
              <h1>{teamData.name}</h1>
              <p className="modal-subtitle">
                {teamData.conference} Conference · {teamData.division} Division · Coach {teamData.coach}
              </p>
              <hr />
              {teamData.highlights?.length > 0 && (
                <section>
                  <h3>Key Insights</h3>
                  <ul className="insights-list">
                    {teamData.highlights.map((insight, index) => (
                      <li key={insight + index}>{insight}</li>
                    ))}
                  </ul>
                </section>
              )}

              <section>
                <h3>Historical Performance (Last 5 Seasons)</h3>
                <div className="table-wrapper">
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
                      {teamData.performanceData.map((season) => (
                        <tr key={season.season}>
                          <td>{season.season}</td>
                          <td>{season.wins}</td>
                          <td>{season.losses}</td>
                          <td>{season.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h3>Current Form — Last 10 Games</h3>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Game</th>
                        <th>Points</th>
                        <th>Outcome</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamData.currentForm.last10Games.map((game, index) => (
                        <tr key={`${teamData.name}-game-${index}`}>
                          <td>{game.game}</td>
                          <td>{game.points}</td>
                          <td>{game.outcome}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h3>Rolling Averages</h3>
                <div className="card-grid">
                  {Object.entries(teamData.currentForm.rollingAverages).map(([stat, value]) => (
                    <div key={stat} className="card">
                      <h4 className="card-title">{stat}</h4>
                      <p className="card-metric">{value}</p>
                    </div>
                  ))}
                </div>
              </section>

              {teamData.keyPlayers?.length > 0 && (
                <section>
                  <h3>Player Spotlights</h3>
                  <div className="card-grid">
                    {teamData.keyPlayers.map((player) => (
                      <div key={player.name} className="card">
                        <h4 className="card-title">{player.name}</h4>
                        <p className="card-subtitle">{player.position}</p>
                        <p className="card-note">{player.trend}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default TeamPerformanceAnalysis;
