import React from 'react';
import PropTypes from 'prop-types';
import { Chart } from 'react-chartjs-2';
import { ensureChartRegistration } from './chartConfig';
import './Visualizations.css';

ensureChartRegistration();

const buildMatrixDataset = (heatmap) => {
  const maxValue = heatmap.cells.reduce((acc, cell) => Math.max(acc, cell.value), 0) || 1;

  return [
    {
      label: 'Draft Runs',
      data: heatmap.cells.map((cell) => ({
        x: cell.xIndex,
        y: cell.yIndex,
        v: cell.value,
        player: cell.player,
        position: cell.position,
      })),
      width: ({ chart }) => {
        const chartArea = chart.chartArea || { width: 0 };
        return chartArea.width / Math.max(1, heatmap.columns.length);
      },
      height: ({ chart }) => {
        const chartArea = chart.chartArea || { height: 0 };
        return chartArea.height / Math.max(1, heatmap.rows.length);
      },
      backgroundColor: (context) => {
        const value = context.raw?.v ?? 0;
        const ratio = Math.min(1, value / maxValue);
        const alpha = 0.18 + ratio * 0.7;
        return `rgba(76, 110, 245, ${alpha.toFixed(3)})`;
      },
      borderColor: 'rgba(164, 192, 255, 0.6)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255, 198, 93, 0.8)',
      hoverBorderColor: 'rgba(255, 198, 93, 1)',
    },
  ];
};

const buildMatrixOptions = (heatmap) => ({
  indexAxis: 'x',
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    x: {
      type: 'category',
      labels: heatmap.columns,
      grid: {
        display: false,
      },
      ticks: {
        color: 'rgba(229, 236, 255, 0.9)',
        font: { size: 12 },
      },
      position: 'top',
    },
    y: {
      type: 'category',
      labels: heatmap.rows,
      grid: {
        color: 'rgba(116, 166, 255, 0.18)',
      },
      reverse: true,
      ticks: {
        color: 'rgba(229, 236, 255, 0.9)',
        font: { size: 12 },
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
          const item = items[0];
          const row = heatmap.rows[item.raw?.y ?? 0];
          const column = heatmap.columns[item.raw?.x ?? 0];
          return `${row} · ${column}`;
        },
        label: (item) => {
          const player = item.raw?.player;
          const value = item.raw?.v ?? 0;
          return player ? `${player} — ${value.toFixed(1)} draft score` : `${value.toFixed(1)} draft score`;
        },
      },
    },
  },
});

function DraftTrendHeatmap({ title, description, heatmap }) {
  if (!heatmap || heatmap.cells.length === 0) {
    return (
      <div className="visualization-card">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="visualization-empty">Draft trend verisi bulunamadı.</div>
      </div>
    );
  }

  const data = { datasets: buildMatrixDataset(heatmap) };
  const options = buildMatrixOptions(heatmap);

  return (
    <div className="visualization-card" data-testid="heatmap-visualization">
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="visualization-chart">
        <Chart type="matrix" data={data} options={options} role="img" aria-label="Draft trend heatmap" />
      </div>
      <div className="visualization-footnote">
        Renk yoğunluğu, belirli raund/pozisyon kombinasyonlarında artan oyuncu tercihlerini ("run") gösterir.
      </div>
    </div>
  );
}

DraftTrendHeatmap.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  heatmap: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.string).isRequired,
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    cells: PropTypes.arrayOf(
      PropTypes.shape({
        xIndex: PropTypes.number.isRequired,
        yIndex: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
        player: PropTypes.string,
        position: PropTypes.string,
      }),
    ).isRequired,
  }),
};

DraftTrendHeatmap.defaultProps = {
  heatmap: null,
};

export default DraftTrendHeatmap;
