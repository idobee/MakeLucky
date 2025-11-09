
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

// Splash / intro behavior: show a full-screen intro image on first visit (or until dismissed).
// Use localStorage flag `makelucky-splash-seen` to avoid showing repeatedly.
const basePath = String(((import.meta as any).env?.BASE_URL ?? '/'));
const origin = typeof location !== 'undefined' ? location.origin : '';
const normalizedBase = basePath.endsWith('/') ? basePath : basePath + '/';
const introImgUrl = origin + normalizedBase + 'icons/intro.jpg';

function mountApp() {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

try {
  const seen = typeof localStorage !== 'undefined' && localStorage.getItem('makelucky-splash-seen') === '1';
  if (seen) {
    mountApp();
  } else {
    // Create a lightweight splash element above the root that covers the viewport
    const splash = document.createElement('div');
    splash.id = 'makelucky-splash';
    Object.assign(splash.style, {
      position: 'fixed',
      inset: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000',
      backgroundImage: `url('${introImgUrl}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      zIndex: '99999',
      cursor: 'pointer'
    });

    const hint = document.createElement('div');
    hint.innerText = '화면을 터치하여 시작';
    Object.assign(hint.style, {
      position: 'absolute',
      bottom: '18px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(0,0,0,0.5)',
      color: '#fff',
      padding: '8px 12px',
      borderRadius: '999px',
      fontSize: '14px'
    });
    splash.appendChild(hint);

    const removeAndMount = () => {
      try { localStorage.setItem('makelucky-splash-seen', '1'); } catch (_){ }
      splash.remove();
      mountApp();
    };

    splash.addEventListener('click', removeAndMount, { once: true });
    splash.addEventListener('touchstart', removeAndMount, { once: true });

    // Insert splash before root so it's visible
    document.body.appendChild(splash);

    // Also attempt preloading image so it shows quickly
    const img = new Image();
    img.src = introImgUrl;
    img.onload = () => { /* noop */ };
    img.onerror = () => {
      // If image missing, fall back to mounting app after short delay so user isn't stuck
      setTimeout(() => {
        try { localStorage.setItem('makelucky-splash-seen', '1'); } catch (_){ }
        if (document.body.contains(splash)) splash.remove();
        mountApp();
      }, 800);
    };
  }
} catch (e) {
  // If anything goes wrong, just mount the app to avoid blank screen
  mountApp();
}
