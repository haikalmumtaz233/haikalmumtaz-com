import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <section role="alert" className="shell flex min-h-[70vh] flex-col items-start justify-center gap-6 py-20">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/45">Something went wrong</p>
        <h1 className="font-monument text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
          This page failed to load
        </h1>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-full bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-colors duration-300 hover:bg-white/90"
        >
          Reload page
        </button>
      </section>
    );
  }
}

export default ErrorBoundary;
