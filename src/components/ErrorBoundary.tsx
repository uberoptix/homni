import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = async () => {
    try {
      const dbs = ['homni', 'selfhosted_dashboard'];
      await Promise.all(
        dbs.map(
          (name) =>
            new Promise<void>((resolve) => {
              const req = indexedDB.deleteDatabase(name);
              req.onsuccess = () => resolve();
              req.onerror = () => resolve();
              req.onblocked = () => resolve();
            })
        )
      );
      localStorage.clear();
    } catch {
      // proceed with reload regardless
    }
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const containerStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '24px',
      background: 'var(--server-background, #1a1a2e)',
      color: 'var(--service-text, #c0c0c0)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    };

    const cardStyle: React.CSSProperties = {
      maxWidth: '520px',
      width: '100%',
      padding: '32px',
      borderRadius: '12px',
      background: 'var(--server-background, #1a1a2e)',
      border: '1px solid var(--status-red, #e74c3c)',
    };

    const headingStyle: React.CSSProperties = {
      margin: '0 0 8px',
      fontSize: 'var(--font-size-lg, 18px)',
      color: 'var(--server-text, #ffffff)',
    };

    const textStyle: React.CSSProperties = {
      margin: '0 0 20px',
      fontSize: 'var(--font-size-base, 14px)',
      lineHeight: 1.5,
      color: 'var(--service-text, #c0c0c0)',
    };

    const codeStyle: React.CSSProperties = {
      display: 'block',
      padding: '12px',
      marginBottom: '24px',
      borderRadius: '6px',
      background: 'rgba(0, 0, 0, 0.3)',
      color: 'var(--status-red, #e74c3c)',
      fontSize: 'var(--font-size-sm, 12px)',
      fontFamily: 'monospace',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      overflowX: 'auto',
      maxHeight: '120px',
    };

    const buttonRowStyle: React.CSSProperties = {
      display: 'flex',
      gap: '12px',
    };

    const primaryButtonStyle: React.CSSProperties = {
      flex: 1,
      padding: '10px 16px',
      border: 'none',
      borderRadius: '6px',
      fontSize: 'var(--font-size-base, 14px)',
      fontWeight: 600,
      cursor: 'pointer',
      background: 'var(--primary-button, #6366f1)',
      color: 'var(--primary-button-text, #ffffff)',
    };

    const dangerButtonStyle: React.CSSProperties = {
      flex: 1,
      padding: '10px 16px',
      border: '1px solid var(--status-red, #e74c3c)',
      borderRadius: '6px',
      fontSize: 'var(--font-size-base, 14px)',
      fontWeight: 600,
      cursor: 'pointer',
      background: 'transparent',
      color: 'var(--status-red, #e74c3c)',
    };

    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={headingStyle}>Something went wrong</h1>
          <p style={textStyle}>
            An unexpected error crashed the interface. You can reload to try
            again, or reset all data to defaults if the problem persists.
          </p>
          <code style={codeStyle}>
            {this.state.error?.message || 'Unknown error'}
          </code>
          <div style={buttonRowStyle}>
            <button style={primaryButtonStyle} onClick={this.handleReload}>
              Reload page
            </button>
            <button style={dangerButtonStyle} onClick={this.handleReset}>
              Reset to defaults
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
