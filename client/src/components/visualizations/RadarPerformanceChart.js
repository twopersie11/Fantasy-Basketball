import React from 'react';
import PropTypes from 'prop-types';
import { Radar } from 'react-chartjs-2';
import { ensureChartRegistration } from './chartConfig';
import './Visualizations.css';

ensureChartRegistration();

const buildChartData = (scores) => ({
  labels: scores.map((entry) => entry.label),
  datasets: [
    {
      label: 'Category Strength',
      data: scores.map((entry) => entry.value),
      backgroundColor: 'rgba(76, 110, 245, 0.25)',
      borderColor: 'rgba(116, 166, 255, 0.95)',
      pointBackgroundColor: 'rgba(232, 241, 255, 1)',
      borderWidth: 2,
    },
  ],
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      beginAtZero: true,
      max: 100,
      ticks: {
        stepSize: 20,
        display: true,
        showLabelBackdrop: false,
      },
      grid: {
        color: 'rgba(116, 166, 255, 0.18)',
      },
      angleLines: {
        color: 'rgba(116, 166, 255, 0.25)',
      },
      pointLabels: {
        color: 'rgba(229, 236, 255, 0.9)',
        font: {
          size: 12,
        },
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.label}: ${context.formattedValue}`,
      },
    },
  },
};

function RadarPerformanceChart({ title, description, scores }) {
  if (!scores || scores.length === 0) {
    return (
      <div className="visualization-card">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="visualization-empty">Kategori skorları bulunamadı.</div>
      </div>
    );
  }

  return (
    <div className="visualization-card" data-testid="radar-visualization">
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="visualization-chart">
        <Radar data={buildChartData(scores)} options={chartOptions} role="img" aria-label="Category radar chart" />
      </div>
      <div className="visualization-footnote">
        Değerler, mevcut draft çekirdeğinin 9 kategoriye göre normalize edilmiş güç dengesini gösterir (0-100).
      </div>
    </div>
  );
}

RadarPerformanceChart.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  scores: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    }),
  ),
};

RadarPerformanceChart.defaultProps = {
  scores: [],
};

export default RadarPerformanceChart;
