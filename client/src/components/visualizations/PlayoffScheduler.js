import React from 'react';
import PropTypes from 'prop-types';
import { Chart } from 'react-chartjs-2';
import { ensureChartRegistration } from './chartConfig';
import './Visualizations.css';

ensureChartRegistration();

const buildChartData = (schedule) => ({
  labels: schedule.map((entry) => entry.week),
  datasets: [
    {
      type: 'bar',
      label: 'Maç Sayısı',
      data: schedule.map((entry) => entry.games),
      backgroundColor: 'rgba(116, 166, 255, 0.65)',
      borderRadius: 8,
      yAxisID: 'y',
    },
    {
      type: 'line',
      label: 'Rakip Gücü',
      data: schedule.map((entry) => entry.difficulty),
      borderColor: 'rgba(255, 198, 93, 0.9)',
      backgroundColor: 'rgba(255, 198, 93, 0.35)',
      tension: 0.35,
      fill: false,
      yAxisID: 'y1',
    },
  ],
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Oyun Sayısı',
        color: 'rgba(229, 236, 255, 0.9)',
      },
      ticks: {
        color: 'rgba(229, 236, 255, 0.85)',
      },
      grid: {
        color: 'rgba(116, 166, 255, 0.15)',
      },
    },
    y1: {
      beginAtZero: true,
      position: 'right',
      title: {
        display: true,
        text: 'Rakip Gücü (0-100)',
        color: 'rgba(229, 236, 255, 0.9)',
      },
      ticks: {
        color: 'rgba(229, 236, 255, 0.85)',
      },
      grid: {
        drawOnChartArea: false,
      },
      min: 0,
      max: 100,
    },
    x: {
      ticks: {
        color: 'rgba(229, 236, 255, 0.85)',
      },
      grid: {
        display: false,
      },
    },
  },
  plugins: {
    legend: {
      labels: {
        color: 'rgba(229, 236, 255, 0.85)',
      },
    },
  },
};

function PlayoffScheduler({ title, description, schedule }) {
  if (!schedule || schedule.length === 0) {
    return (
      <div className="visualization-card">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="visualization-empty">Playoff takvimi için veri bulunamadı.</div>
      </div>
    );
  }

  const data = buildChartData(schedule);

  return (
    <div className="visualization-card" data-testid="scheduler-visualization">
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="visualization-chart">
        <Chart type="bar" data={data} options={chartOptions} role="img" aria-label="Playoff schedule chart" />
      </div>
      <table className="visualization-table">
        <thead>
          <tr>
            <th>Hafta</th>
            <th>Oyun Sayısı</th>
            <th>Rakip Gücü</th>
            <th>Avantajlı Takımlar</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((entry) => (
            <tr key={entry.week}>
              <td>{entry.week}</td>
              <td>{entry.games}</td>
              <td>{entry.difficulty}</td>
              <td>{entry.focusTeams.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="visualization-footnote">
        Rakip gücü metriği 0-100 aralığında normalize edilmiştir. Düşük değerler hedeflenmesi gereken daha zayıf rakipleri işaret eder.
      </div>
    </div>
  );
}

PlayoffScheduler.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  schedule: PropTypes.arrayOf(
    PropTypes.shape({
      week: PropTypes.string.isRequired,
      games: PropTypes.number.isRequired,
      difficulty: PropTypes.number.isRequired,
      focusTeams: PropTypes.arrayOf(PropTypes.string).isRequired,
    }),
  ),
};

PlayoffScheduler.defaultProps = {
  schedule: [],
};

export default PlayoffScheduler;
