import { Chart, registerables } from 'chart.js';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';

let isRegistered = false;

export const ensureChartRegistration = () => {
  if (isRegistered) {
    return;
  }

  Chart.register(...registerables, MatrixController, MatrixElement);
  isRegistered = true;
};

ensureChartRegistration();

export default Chart;
