// client/src/pages/MatchupAnalyzer.js
import React, { useEffect, useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import NavButton from '../components/NavButton';
import logo from '../images/ma.png';
import Modal from '../components/Modal.js';
import '../components/Header.css';
import '../components/Form.css';
import './MatchupAnalyzer.css';
import { getMatchup } from '../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function MatchupAnalyzer() {
  const [teams, setTeams] = useState([]);
  const [teamOne, setTeamOne] = useState('');
  const [teamTwo, setTeamTwo] = useState('');
  const [matchupData, setMatchupData] = useState(null);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [loadingMatchup, setLoadingMatchup] = useState(false);

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
        if (fetchedTeams.length >= 2) {
          setTeamOne(fetchedTeams[0].name);
          setTeamTwo(fetchedTeams[1].name);
        }
        setError('');
      } catch (err) {
        console.error('Unable to load teams', err);
        setTeams([]);
        setTeamOne('');
        setTeamTwo('');
        setError('Takım listesi yüklenemedi. Tekrar Dene.');
      } finally {
        setLoadingTeams(false);
      }
    };

    initialiseTeams();
  }, []);

  const loadMatchup = async () => {
    if (!teamOne || !teamTwo) {
      setError('İki takım seçmelisiniz.');
      return;
    }

    if (teamOne === teamTwo) {
      setError('Lütfen iki farklı takım seçin.');
      return;
    }

    setLoadingMatchup(true);
    setError('');
    try {
      const data = await getMatchup(teamOne, teamTwo);
      setMatchupData(data);
      setError('');
      setShowModal(true);
    } catch (err) {
      console.error('Error fetching matchup data', err);
      setError('Seçilen takımlar için eşleşme verisi bulunamadı.');
    } finally {
      setLoadingMatchup(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await loadMatchup();
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const chartData = useMemo(() => {
    if (!matchupData) {
      return null;
    }

    const { matchup } = matchupData;
    return {
      labels: [teamOne, teamTwo],
      datasets: [
        {
          label: 'Average Points',
          data: [matchup.team1VsTeam2.avgPoints, matchup.team2VsTeam1.avgPoints],
          backgroundColor: ['rgba(59, 130, 246, 0.6)', 'rgba(249, 115, 22, 0.6)'],
          borderColor: ['rgba(59, 130, 246, 1)', 'rgba(249, 115, 22, 1)'],
          borderWidth: 1,
        },
      ],
    };
  }, [matchupData, teamOne, teamTwo]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Average Points Scored vs. Opponent',
          color: '#0f172a',
          font: { size: 16, weight: 'bold' },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: '#0f172a' },
          grid: { color: 'rgba(148, 163, 184, 0.35)' },
        },
        x: {
          ticks: { color: '#0f172a' },
          grid: { display: false },
        },
      },
    }),
    [],
  );

  return (
    <div className="matchup-page">
      <header className="page-header">
        <img src={logo} alt="Matchup analyzer" className="nbalogo" />
      </header>

      <div className="page-content">
        <NavButton path="/" label="⇦   Return to Home" className="backbutton" />

        <div className="inner">
          <h2>COMPARE TWO TEAMS</h2>
          <p className="helper-text">
            → Analyze historical matchups to understand head-to-head trends.
            <br /> → Highlight pace, key factors, and recent game results to guide your decision making.
          </p>
          <hr />
          <form onSubmit={handleSubmit} className="form-grid">
            <select
              value={teamOne}
              onChange={(event) => setTeamOne(event.target.value)}
              className="team-input"
              disabled={loadingTeams}
            >
              {teams.map((team) => (
                <option key={`team-one-${team.code}`} value={team.name}>
                  {team.name}
                </option>
              ))}
            </select>
            <select
              value={teamTwo}
              onChange={(event) => setTeamTwo(event.target.value)}
              className="team-input"
              disabled={loadingTeams}
            >
              {teams.map((team) => (
                <option key={`team-two-${team.code}`} value={team.name}>
                  {team.name}
                </option>
              ))}
            </select>
            <button type="submit" className="submit" disabled={loadingMatchup || loadingTeams}>
              {loadingMatchup ? 'Analyzing…' : 'Analyze Matchup'}
            </button>
          </form>

          {error && <p className="error">{error}</p>}
        </div>

        <Modal show={showModal} handleClose={handleCloseModal}>
          {matchupData && (
            <div className="mainPage">
              <h1>
                {teamOne} vs. {teamTwo}
              </h1>
              <p className="modal-subtitle">
                Pace: {matchupData.matchup.pace} possessions · {matchupData.matchup.summary}
              </p>
              <hr />
              <section className="metrics-section">
                <div className="card-grid">
                  <div className="card">
                    <h4 className="card-title">{teamOne} Record</h4>
                    <p className="card-note">
                      {matchupData.matchup.team1VsTeam2.wins}W — {matchupData.matchup.team1VsTeam2.losses}L
                    </p>
                    <p className="card-metric">{matchupData.matchup.team1VsTeam2.avgPoints} PPG</p>
                    <p className="card-note">
                      Off Rating: {matchupData.matchup.team1VsTeam2.offensiveRating}
                      <br />Def Rating: {matchupData.matchup.team1VsTeam2.defensiveRating}
                      <br />Rebound Margin: {matchupData.matchup.team1VsTeam2.reboundMargin}
                    </p>
                  </div>
                  <div className="card">
                    <h4 className="card-title">{teamTwo} Record</h4>
                    <p className="card-note">
                      {matchupData.matchup.team2VsTeam1.wins}W — {matchupData.matchup.team2VsTeam1.losses}L
                    </p>
                    <p className="card-metric">{matchupData.matchup.team2VsTeam1.avgPoints} PPG</p>
                    <p className="card-note">
                      Off Rating: {matchupData.matchup.team2VsTeam1.offensiveRating}
                      <br />Def Rating: {matchupData.matchup.team2VsTeam1.defensiveRating}
                      <br />Rebound Margin: {matchupData.matchup.team2VsTeam1.reboundMargin}
                    </p>
                  </div>
                </div>
              </section>

              {chartData && (
                <section>
                  <div className="chart-wrapper">
                    <Bar data={chartData} options={chartOptions} />
                  </div>
                </section>
              )}

              {matchupData.matchup.keyFactors?.length > 0 && (
                <section>
                  <h3>Key Factors</h3>
                  <ul className="insights-list">
                    {matchupData.matchup.keyFactors.map((factor, index) => (
                      <li key={`${teamOne}-${teamTwo}-factor-${index}`}>{factor}</li>
                    ))}
                  </ul>
                </section>
              )}

              {matchupData.matchup.recentGames?.length > 0 && (
                <section>
                  <h3>Recent Meetings</h3>
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Venue</th>
                          <th>Winner</th>
                          <th>{teamOne} Points</th>
                          <th>{teamTwo} Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {matchupData.matchup.recentGames.map((game) => (
                          <tr key={`${game.date}-${game.venue}`}>
                            <td>{game.date}</td>
                            <td>{game.venue}</td>
                            <td>{game.winner}</td>
                            <td>{game.team1Points}</td>
                            <td>{game.team2Points}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

export default MatchupAnalyzer;
