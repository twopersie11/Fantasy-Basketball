import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
  })),
}));

test('renders application shell logo', () => {
  render(<App />);
  expect(screen.getByAltText(/NBALogo/i)).toBeInTheDocument();
});
