
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Expose metrics API base for inline scripts in index.html (PWA install tracking)
try {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).METRICS_API_BASE = String((import.meta as any).env?.VITE_METRICS_API_BASE || '').trim();
} catch {}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
