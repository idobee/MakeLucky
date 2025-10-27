import React, { useEffect, useState } from 'react';

// Lightweight visitor counter with graceful fallback.
// 1) Tries CountAPI to get/increment a numeric counter once per device (via localStorage gate)
// 2) Falls back to a hits.seeyoufarm.com badge image if API is unavailable

const NAMESPACE = 'idobee.github.io';
const KEY = 'root-visitors';
const COUNTAPI_BASE = 'https://api.countapi.xyz';

const storageKey = `makelucky-visit-sent:${NAMESPACE}:${KEY}`;

const VisitorCounter: React.FC = () => {
  const [count, setCount] = useState<number | null>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const METRICS_BASE = String((import.meta as any).env?.VITE_METRICS_API_BASE || '').trim();

        // Prefer Worker API if configured
        if (METRICS_BASE) {
          // Read current value
          const getRes = await fetch(`${METRICS_BASE}/api/visitors`, { headers: { 'Cache-Control': 'no-cache' } });
          if (!getRes.ok) throw new Error('metrics get failed');
          const getJson = await getRes.json();
          if (!cancelled && typeof getJson?.value === 'number') setCount(getJson.value);

          // Increment once per device/browser
          let alreadySent = false;
          try { alreadySent = localStorage.getItem(storageKey) === '1'; } catch {}
          if (!alreadySent) {
            const hitRes = await fetch(`${METRICS_BASE}/api/visitors/hit`, { method: 'POST' });
            if (hitRes.ok) {
              const hitJson = await hitRes.json();
              if (!cancelled && typeof hitJson?.value === 'number') setCount(hitJson.value);
              try { localStorage.setItem(storageKey, '1'); } catch {}
            }
          }
          return; // done
        }

        // Fallback to CountAPI
        const getRes = await fetch(`${COUNTAPI_BASE}/get/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(KEY)}`);
        if (!getRes.ok) throw new Error('countapi get failed');
        const getJson = await getRes.json();
        if (!cancelled && typeof getJson?.value === 'number') {
          setCount(getJson.value);
        }

        // Increment once per device/browser
        let alreadySent = false;
        try {
          alreadySent = localStorage.getItem(storageKey) === '1';
        } catch (_) {
          // ignore storage errors
        }
        if (!alreadySent) {
          const hitRes = await fetch(`${COUNTAPI_BASE}/hit/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(KEY)}`);
          if (hitRes.ok) {
            const hitJson = await hitRes.json();
            if (!cancelled && typeof hitJson?.value === 'number') {
              setCount(hitJson.value);
            }
            try { localStorage.setItem(storageKey, '1'); } catch {}
          }
        }
      } catch (e) {
        if (!cancelled) setFallback(true);
      }
    };
    run();
    return () => { cancelled = true; };
  }, []);

  // Render a local badge-style pill to avoid third-party image blockers
  const pill = (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-slate-700 border border-slate-200">
      <span className="text-slate-600">방문자</span>
      <span className="font-semibold text-slate-800">{count ?? '—'}</span>
    </span>
  );

  if (fallback) {
    return pill;
  }

  return pill;
};

export default VisitorCounter;
