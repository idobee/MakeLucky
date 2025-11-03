
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Expose metrics API base for inline scripts in index.html (PWA install tracking)
try {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const candidate = String(((import.meta as any).env?.VITE_METRICS_API_BASE ?? '')).trim();
  if (candidate) {
    try {
      const u = new URL(candidate);
      // Avoid known placeholder domains
      if (!/your-worker\.example\.workers\.dev$/i.test(u.hostname)) {
        (window as any).METRICS_API_BASE = candidate;
      }
    } catch {
      // ignore invalid URL
    }
  }
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
