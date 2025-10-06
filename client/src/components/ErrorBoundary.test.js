import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

describe('ErrorBoundary', () => {
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  afterEach(() => {
    consoleErrorSpy.mockClear();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  const ProblemChild = () => {
    throw new Error('Boom');
  };

  it('renders fallback UI when an error is thrown', () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/Beklenmeyen bir hata oluştu/i)).toBeInTheDocument();
  });

  it('allows retrying after error', async () => {
    const Harness = () => {
      const [shouldThrow, setShouldThrow] = React.useState(true);

      return (
        <ErrorBoundary
          fallback={({ resetErrorBoundary }) => (
            <div>
              <span>Fallback</span>
              <button
                type="button"
                onClick={() => {
                  resetErrorBoundary();
                  setShouldThrow(false);
                }}
              >
                Retry
              </button>
            </div>
          )}
        >
          {shouldThrow ? <ProblemChild /> : <span>Recovered</span>}
        </ErrorBoundary>
      );
    };

    render(<Harness />);
    expect(screen.getByText('Fallback')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText('Retry'));
    });

    expect(await screen.findByText('Recovered')).toBeInTheDocument();
  });
});
