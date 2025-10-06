import React from 'react';
import { render, screen } from '@testing-library/react';
import RadarPerformanceChart from '../RadarPerformanceChart';
import DraftTrendHeatmap from '../DraftTrendHeatmap';
import RiskMatrix from '../RiskMatrix';
import PlayoffScheduler from '../PlayoffScheduler';

describe('Visualization components', () => {
  beforeAll(() => {
    window.HTMLCanvasElement.prototype.getContext = () => ({});
  });

  it('renders radar chart with provided scores', () => {
    const scores = [
      { label: 'PTS', value: 75 },
      { label: 'REB', value: 60 },
    ];

    render(
      <RadarPerformanceChart
        title="Test Radar"
        description="Radar description"
        scores={scores}
      />,
    );

    expect(screen.getByText('Test Radar')).toBeInTheDocument();
    expect(screen.getByText('Radar description')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /category radar chart/i })).toBeInTheDocument();
  });

  it('renders heatmap when data is present', () => {
    const heatmap = {
      rows: ['Round 1'],
      columns: ['PG'],
      cells: [{ xIndex: 0, yIndex: 0, value: 50, player: 'Player A', position: 'PG' }],
    };

    render(
      <DraftTrendHeatmap
        title="Heatmap"
        description="Heatmap description"
        heatmap={heatmap}
      />,
    );

    expect(screen.getByText('Heatmap')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /draft trend heatmap/i })).toBeInTheDocument();
  });

  it('renders risk matrix scatter plot', () => {
    const points = [
      { player: 'Test Player', team: 'TST', positions: 'PG', vorp: 80, injuryRisk: 20 },
    ];

    render(
      <RiskMatrix
        title="Risk"
        description="Risk description"
        points={points}
      />,
    );

    expect(screen.getByText('Risk')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /risk matrix scatter plot/i })).toBeInTheDocument();
  });

  it('renders playoff scheduler chart and table', () => {
    const schedule = [
      { week: 'Quarterfinal', games: 4, difficulty: 42, focusTeams: ['LAL'] },
    ];

    render(
      <PlayoffScheduler
        title="Scheduler"
        description="Scheduler description"
        schedule={schedule}
      />,
    );

    expect(screen.getByText('Scheduler')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /playoff schedule chart/i })).toBeInTheDocument();
    expect(screen.getByText('Quarterfinal')).toBeInTheDocument();
  });
});
