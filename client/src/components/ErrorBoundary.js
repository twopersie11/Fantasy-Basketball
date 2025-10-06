import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (this.props.onError) {
      this.props.onError(error, info);
    }
    // eslint-disable-next-line no-console
    console.error('Unexpected UI error captured by boundary', error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback({ error, resetErrorBoundary: this.handleRetry });
      }

      return (
        <div className="error-boundary" role="alert">
          <h2>Beklenmeyen bir hata oluştu.</h2>
          <p>Lütfen sayfayı yenileyin veya tekrar deneyin.</p>
          <button type="button" onClick={this.handleRetry}>
            Yeniden dene
          </button>
        </div>
      );
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.func,
  onError: PropTypes.func,
};

ErrorBoundary.defaultProps = {
  fallback: null,
  onError: null,
};

export default ErrorBoundary;
