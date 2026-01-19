import React from 'react';

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  message?: string;
  stack?: string;
};

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: unknown): State {
    const message =
      error instanceof Error ? error.message : typeof error === 'string' ? error : 'Unknown error';
    const stack = error instanceof Error ? error.stack : undefined;
    return { hasError: true, message, stack };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    // Keep a breadcrumb in devtools, but also surface on-screen via state.
    // eslint-disable-next-line no-console
    console.error('ALFRED_UI_CRASH:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#000814',
          color: '#00d2ff',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          padding: 24,
        }}
      >
        <div style={{ border: '1px solid rgba(0,210,255,0.6)', padding: 16 }}>
          <div style={{ fontWeight: 900, letterSpacing: '0.2em', marginBottom: 8 }}>
            ALFRED_UI_CRASH_DETECTED
          </div>
          <div style={{ opacity: 0.8, marginBottom: 12 }}>
            The UI failed to render. Copy the message below and send it to me.
          </div>
          <pre style={{ whiteSpace: 'pre-wrap', margin: 0, color: '#b8f3ff' }}>
            {this.state.message}
            {this.state.stack ? `\n\n${this.state.stack}` : ''}
          </pre>
        </div>
      </div>
    );
  }
}
