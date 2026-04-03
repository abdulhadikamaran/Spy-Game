// @ts-nocheck
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[100dvh] bg-background text-white p-6 flex flex-col items-center justify-center text-center font-sans" dir="rtl">
          <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black mb-2 text-red-400">هەڵەیەک ڕوویدا</h1>
          <p className="text-text-muted mb-6 text-sm">ببورە، کێشەیەک لە کارپێکردنی ئەپەکەدا دروست بوو.</p>
          
          <div className="bg-black/50 p-4 rounded-xl border border-red-500/30 w-full max-w-md overflow-auto text-left text-xs mb-8" dir="ltr">
            <pre className="text-red-300 font-mono whitespace-pre-wrap word-break-all">
              {this.state.error?.toString()}
            </pre>
            {this.state.errorInfo && (
              <pre className="text-gray-400 font-mono mt-2 pt-2 border-t border-white/10 whitespace-pre-wrap">
                {this.state.errorInfo.componentStack}
              </pre>
            )}
          </div>

          <button
            onClick={() => window.location.reload()}
            className="w-full max-w-xs h-14 bg-primary hover:bg-primary-hover active:scale-95 rounded-xl font-bold transition-all shadow-glow flex items-center justify-center gap-2"
          >
            دووبارە هەوڵبدەرەوە
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
