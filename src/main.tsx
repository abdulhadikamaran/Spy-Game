import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import App from './App';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Signal to the inline rescue script that the app has loaded successfully
if (typeof (window as any).__sixurAppLoaded === 'function') {
  (window as any).__sixurAppLoaded();
}