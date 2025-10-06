// client/src/pages/FantasyRecommendations.js
import React, { useEffect, useMemo, useState } from 'react';
import NavButton from '../components/NavButton';
import logo from '../images/Fr.png';
import '../components/Header.css';
import '../components/Form.css';
import './FantasyRecommendations.css';
import YahooConnectButton from '../components/YahooConnectButton';
import { getFantasyAdvice, getFantasyOptions, getPlayerMetrics } from '../services/api';
import { buildPlayerSummary, rankPlayers } from '../utils/recommendation';
import RadarPerformanceChart from '../components/visualizations/RadarPerformanceChart';
import DraftTrendHeatmap from '../components/visualizations/DraftTrendHeatmap';
import RiskMatrix from '../components/visualizations/RiskMatrix';
import PlayoffScheduler from '../components/visualizations/PlayoffScheduler';
import {
  buildCategoryScores,
  buildDraftTrendHeatmap,
  buildRiskMatrixPoints,
  buildPlayoffSchedule,
} from '../utils/draftInsights';
import '../components/visualizations/Visualizations.css';

function FantasyRecommendations() {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [advice, setAdvice] = useState(null);
  const [error, setError] = useState('');
  const [metricsError, setMetricsError] = useState('');
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [playerMetrics, setPlayerMetrics] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [topPlayers, setTopPlayers] = useState([]);

  const loadAdvice = async (optionId, { silent = false } = {}) => {
    if (!optionId) {
      setError('Lütfen bir seçenek belirleyin.');
      return;
    }

    if (!silent) {
      setLoadingAdvice(true);
    }

    try {
      const data = await getFantasyAdvice(optionId);
      setAdvice(data);
      setError('');
    } catch (err) {
      console.error('Error fetching fantasy advice', err);
      setError('Tavsiye verileri alınamadı. Lütfen daha sonra tekrar deneyin.');
    } finally {
      if (!silent) {
        setLoadingAdvice(false);
      }
    }
  };

  useEffect(() => {
    const initialiseOptions = async () => {
      setLoadingOptions(true);
      try {
        const fetchedOptions = await getFantasyOptions();
        setOptions(fetchedOptions);
        if (fetchedOptions.length > 0) {
          const defaultOption = fetchedOptions[0].id;
          setSelectedOption(defaultOption);
          await loadAdvice(defaultOption, { silent: true });
        }
      } catch (err) {
        console.error('Unable to load fantasy options', err);
        setError('Seçenekler yüklenemedi. Lütfen sayfayı yenileyin.');
      } finally {
        setLoadingOptions(false);
      }
    };

    initialiseOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoadingMetrics(true);
      try {
        const metrics = await getPlayerMetrics();
        setPlayerMetrics(metrics);
        setMetricsError('');
      } catch (err) {
        console.error('Unable to load player metrics', err);
        setPlayerMetrics([]);
        setMetricsError('Oyuncu metrikleri yüklenemedi. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoadingMetrics(false);
      }
    };

    fetchMetrics();
  }, []);

  useEffect(() => {
    if (!playerMetrics.length || !selectedOption) {
      setRecommendations([]);
      setTopPlayers([]);
      return;
    }

    const ranked = rankPlayers(playerMetrics, { strategyId: selectedOption, limit: 10 });
    setTopPlayers(ranked);
    setRecommendations(ranked.map((player) => buildPlayerSummary(player)));
  }, [playerMetrics, selectedOption]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await loadAdvice(selectedOption);
  };

  const activeOption = useMemo(
    () => options.find((option) => option.id === selectedOption),
    [options, selectedOption],
  );

  const categoryScores = useMemo(
    () => buildCategoryScores(topPlayers, selectedOption),
    [topPlayers, selectedOption],
  );

  const draftTrendHeatmap = useMemo(
    () => buildDraftTrendHeatmap(topPlayers),
    [topPlayers],
  );

  const riskMatrixPoints = useMemo(() => buildRiskMatrixPoints(topPlayers), [topPlayers]);

  const playoffSchedule = useMemo(() => buildPlayoffSchedule(topPlayers), [topPlayers]);

  return (
    <div className="fantasy-page">
      <header className="page-header">
        <img src={logo} alt="Fantasy recommendations" className="nbalogo" />
      </header>

      <div className="page-content">
        <div className="page-toolbar">
          <NavButton path="/" label="⇦   Return to Home" className="backbutton" />
          <YahooConnectButton className="page-yahoo-button" />
        </div>

        <div className="inner">
          <h2>SELECT FANTASY CRITERIA</h2>
          <p className="helper-text">
            → Prioritize specific strategies and receive tailored recommendations for the upcoming slate.
            <br /> → Combine matchup data, usage trends, and roster balance to stay ahead of the competition.
          </p>
          <hr />
          <form onSubmit={handleSubmit} className="form-grid">
            <select
              value={selectedOption}
              onChange={(event) => setSelectedOption(event.target.value)}
              className="team-input"
              disabled={loadingOptions}
            >
              {options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <button type="submit" className="submit" disabled={loadingAdvice || loadingOptions}>
              {loadingAdvice ? 'Loading…' : 'Get Recommendations'}
            </button>
          </form>
          {activeOption?.description && <p className="option-description">{activeOption.description}</p>}
          {error && <p className="error">{error}</p>}
        </div>

        {advice && (
          <div className="inner results-panel">
            <h2>{advice.label}</h2>
            <p className="modal-subtitle">{advice.summary}</p>
            <hr />

            {advice.keyMetrics && (
              <section>
                <h3>Key Metrics</h3>
                <div className="card-grid">
                  {Object.entries(advice.keyMetrics).map(([metric, value]) => (
                    <div key={metric} className="card">
                      <h4 className="card-title">{metric.replace(/([A-Z])/g, ' $1')}</h4>
                      <p className="card-metric">{value}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {advice.lineup && (
              <section>
                <h3>Suggested Lineup</h3>
                <div className="card-grid">
                  {advice.lineup.map((slot) => (
                    <div key={`${slot.position}-${slot.player}`} className="card">
                      <h4 className="card-title">{slot.position}</h4>
                      <p className="card-subtitle">{slot.player}</p>
                      <p className="card-note">{slot.team}</p>
                      <p className="card-note">{slot.rationale}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {advice.benchStreamers && (
              <section>
                <h3>Bench & Streamer Targets</h3>
                <ul className="insights-list">
                  {advice.benchStreamers.map((streamer) => (
                    <li key={streamer}>{streamer}</li>
                  ))}
                </ul>
              </section>
            )}

            {advice.buyTargets && (
              <section className="grid-section">
                <div className="card-grid">
                  <div className="card">
                    <h3>Buy Targets</h3>
                    <ul className="insights-list">
                      {advice.buyTargets.map((target) => (
                        <li key={target.player}>
                          <strong>{target.player}</strong> — {target.team}: {target.rationale}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {advice.sellHighCandidates && (
                    <div className="card">
                      <h3>Sell-High Candidates</h3>
                      <ul className="insights-list">
                        {advice.sellHighCandidates.map((candidate) => (
                          <li key={candidate.player}>
                            <strong>{candidate.player}</strong> — {candidate.team}: {candidate.rationale}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {advice.waiverAdds && (
                    <div className="card">
                      <h3>Waiver Adds</h3>
                      <ul className="insights-list">
                        {advice.waiverAdds.map((player) => (
                          <li key={player.player}>
                            <strong>{player.player}</strong> — {player.team}: {player.rationale}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}

            {advice.watchList && (
              <section>
                <h3>Watch List</h3>
                <div className="card-grid">
                  {advice.watchList.map((player) => (
                    <div key={player.player} className="card">
                      <h4 className="card-title">{player.player}</h4>
                      <p className="card-subtitle">{player.team}</p>
                      <p className="card-note">{player.rationale}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {advice.injuryPivots && (
              <section>
                <h3>Injury Pivots</h3>
                <ul className="insights-list">
                  {advice.injuryPivots.map((pivot) => (
                    <li key={pivot.situation}>
                      <strong>{pivot.situation}:</strong> {pivot.pivot}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {advice.strategyTips && (
              <section>
                <h3>Strategy Tips</h3>
                <ul className="insights-list">
                  {advice.strategyTips.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}

        <div className="inner results-panel recommendation-engine">
          <h2>LIVE DRAFT RECOMMENDATIONS</h2>
          <p className="helper-text">
            → Yahoo bağlantısı sonrası canlı draft sırasında öne çıkan oyuncuları izleyin.
            <br /> → Seçtiğiniz stratejiye göre metrikleri ağırlıklandırıp en iyi 10 adayı sıralar.
          </p>
          <hr />

          {loadingMetrics && <p className="info">Oyuncu metrikleri yükleniyor…</p>}
          {!loadingMetrics && metricsError && <p className="error">{metricsError}</p>}

          {!loadingMetrics && !metricsError && recommendations.length > 0 && (
            <div className="recommendation-grid">
              {recommendations.map((player) => (
                <div key={`${player.name}-${player.team}`} className="card recommendation-card">
                  <div className="card-header">
                    <div>
                      <h4 className="card-title">{player.name}</h4>
                      <p className="card-subtitle">{player.team} · {player.positions}</p>
                    </div>
                    <div className="score-chip">
                      <span className="score-label">Score</span>
                      <span className="score-value">{(player.score * 100).toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="metric-pills">
                    <span className="metric-pill">
                      <span className="metric-label">VORP</span>
                      <span className="metric-value">{(player.vorp * 100).toFixed(0)}%</span>
                    </span>
                    <span className="metric-pill">
                      <span className="metric-label">Scarcity</span>
                      <span className="metric-value">{(player.scarcity * 100).toFixed(0)}%</span>
                    </span>
                    <span className="metric-pill">
                      <span className="metric-label">Team Need</span>
                      <span className="metric-value">{(player.teamNeed * 100).toFixed(0)}%</span>
                    </span>
                    <span className="metric-pill">
                      <span className="metric-label">Playoffs</span>
                      <span className="metric-value">{(player.playoffStrength * 100).toFixed(0)}%</span>
                    </span>
                    <span className="metric-pill warning">
                      <span className="metric-label">Injury Risk</span>
                      <span className="metric-value">{(player.injuryRisk * 100).toFixed(0)}%</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loadingMetrics && !metricsError && recommendations.length === 0 && (
            <p className="info">Strateji seçimi tamamlandığında öneriler burada görüntülenecek.</p>
          )}
        </div>

        <div className="inner results-panel">
          <h2>DRAFT GÖRSELLEŞTİRMELERİ</h2>
          <p className="helper-text">
            → Draft çekirdeğinizin kategori dağılımını ve pozisyon eğilimlerini takip edin.
            <br /> → Risk-maliyet dengesini ve playoff haftalarına yönelik program avantajını hızlıca inceleyin.
          </p>
          <hr />
          <div className="visualization-grid">
            <RadarPerformanceChart
              title="Kategori Güç Haritası"
              description="Seçilen stratejiye göre çekirdeğinizin 9 kategorideki ortalama gücünü gösterir."
              scores={categoryScores}
            />
            <DraftTrendHeatmap
              title="Draft Trend Heatmap"
              description="Raund ve pozisyon bazında hangi alanlarda oyuncu akınları oluştuğunu izleyin."
              heatmap={draftTrendHeatmap}
            />
            <RiskMatrix
              title="VORP vs. Injury Risk"
              description="Yüksek değer - düşük risk kombinasyonlarını bulmak için dağılımı inceleyin."
              points={riskMatrixPoints}
            />
            <PlayoffScheduler
              title="Playoff Takvim Planlayıcısı"
              description="Fikstür yoğunluğu ve rakip gücüne göre kritik haftalara hazırlan."
              schedule={playoffSchedule}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FantasyRecommendations;
