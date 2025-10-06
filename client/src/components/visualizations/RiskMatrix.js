import React from 'react';
import PropTypes from 'prop-types';
import { Scatter } from 'react-chartjs-2';
import { ensureChartRegistration } from './chartConfig';
import './Visualizations.css';

ensureChartRegistration();

const buildDataset = (points) => ({
  datasets: [
    {
      label: 'Players',
      data: points.map((point) => ({
        x: point.vorp,
        y: point.injuryRisk,
        player: point.player,
        team: point.team,
        positions: point.positions,
      })),
      backgroundColor: 'rgba(76, 245, 196, 0.85)',
      borderColor: 'rgba(35, 201, 159, 0.95)',
      pointRadius: 6,
      pointHoverRadius: 8,
    },
  ],
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      title: {
        display: true,
        text: 'VORP Impact (0-100)',
        color: 'rgba(229, 236, 255, 0.9)',
      },
      min: 0,
      max: 100,
      ticks: {
        color: 'rgba(229, 236, 255, 0.8)',
      },
      grid: {
        color: 'rgba(116, 166, 255, 0.15)',
      },
    },
    y: {
      title: {
        display: true,
        text: 'Injury Risk (0-100)',
        color: 'rgba(229, 236, 255, 0.9)',
      },
      min: 0,
      max: 100,
      ticks: {
        color: 'rgba(229, 236, 255, 0.8)',
      },
      grid: {
        color: 'rgba(116, 166, 255, 0.15)',
      },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        title: (items) => {
          if (!items.length) {
            return '';
          }
          return items[0].raw?.player || '';
        },
        label: (item) => {
          const team = item.raw?.team;
          const positions = item.raw?.positions;
          const vorp = item.raw?.x ?? 0;
          const risk = item.raw?.y ?? 0;
          return [
            `Team: ${team}`,
            `Positions: ${positions}`,
            `VORP: ${vorp.toFixed(1)}`,
            `Risk: ${risk.toFixed(1)}`,
          ];
        },
      },
    },
  },
};

function RiskMatrix({ title, description, points }) {
  if (!points || points.length === 0) {
    return (
      <div className="visualization-card">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="visualization-empty">Risk metriği gösterecek oyuncu verisi bulunamadı.</div>
      </div>
    );
  }

  return (
    <div className="visualization-card" data-testid="risk-visualization">
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="visualization-chart">
        <Scatter data={buildDataset(points)} options={chartOptions} role="img" aria-label="Risk matrix scatter plot" />
      </div>
      <div className="visualization-legend">
        <span>
          <i style={{ background: 'rgba(76, 245, 196, 0.85)' }} /> Düşük riskli yüksek değerli oyuncular sol-alt bölgede kümelenir.
        </span>
      </div>
    </div>
  );
}

RiskMatrix.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  points: PropTypes.arrayOf(
    PropTypes.shape({
      player: PropTypes.string.isRequired,
      team: PropTypes.string,
      positions: PropTypes.string,
      vorp: PropTypes.number.isRequired,
      injuryRisk: PropTypes.number.isRequired,
    }),
  ),
};

RiskMatrix.defaultProps = {
  points: [],
};

export default RiskMatrix;
