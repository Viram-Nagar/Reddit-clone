import { Component } from "react";
import ErrorFallback from "./ErrorFallback";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  // Called when a child throws — update state to show fallback
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Called after error — good place to log to error service
  componentDidCatch(error, errorInfo) {
    console.error("🔴 ErrorBoundary caught:", error, errorInfo);

    // In production you'd send to Sentry/LogRocket here:
    // Sentry.captureException(error, { extra: errorInfo });
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided, otherwise use default
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          resetErrorBoundary: this.resetErrorBoundary,
        });
      }

      return (
        <ErrorFallback
          error={this.state.error}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      );
    }

    return this.props.children;
  }
}

// ─── Lightweight section-level boundary ───────────────
// Use this inside pages for isolated failures
export const SectionErrorBoundary = ({ children, fallbackMessage }) => (
  <ErrorBoundary
    fallback={({ resetErrorBoundary }) => (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
        <p className="text-sm text-red-600 font-medium mb-2">
          {fallbackMessage || "This section failed to load"}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="text-xs text-red-500 hover:underline flex items-center gap-1 mx-auto"
        >
          <RefreshCw size={12} /> Try again
        </button>
      </div>
    )}
  >
    {children}
  </ErrorBoundary>
);

import { RefreshCw } from "lucide-react";
export default ErrorBoundary;
