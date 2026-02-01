import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#05060A] to-[#0a0b12] flex items-center justify-center p-4">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-red-500/50 max-w-md">
            <h1 className="text-2xl font-bold text-red-400 mb-4">⚠️ Etwas ist schief gelaufen</h1>
            <p className="text-gray-300 mb-4">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-[#D6B25E] to-[#e8c76f] text-black font-bold py-2 px-4 rounded-lg hover:shadow-lg hover:shadow-[#D6B25E]/50 transition"
            >
              Seite neu laden
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
