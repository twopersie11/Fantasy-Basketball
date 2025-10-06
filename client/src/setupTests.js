// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

jest.mock('chartjs-chart-matrix', () => {
  class MatrixElementStub {}
  MatrixElementStub.id = 'matrix';

  class MatrixControllerStub {
    static id = 'matrix';
  }

  return {
    MatrixController: MatrixControllerStub,
    MatrixElement: MatrixElementStub,
  };
});
