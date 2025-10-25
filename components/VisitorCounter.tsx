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

  if (fallback) {
    const badgeUrl = `https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=${encodeURIComponent('https://idobee.github.io/')}&count_bg=%234F46E5&title_bg=%23F1F5F9&icon=&icon_color=%23E5E7EB&title=%EB%B0%A9%EB%AC%B8%EC%9E%90&edge_flat=true`;
    return (
      <a href="https://idobee.github.io/" target="_blank" rel="noreferrer" aria-label="방문자 카운트 배지">
        <img src={badgeUrl} alt="방문자" className="inline-block align-middle" />
      </a>
    );
  }

  return (
    <span className="text-slate-500">
      방문자 수: {count ?? '—'}
    </span>
  );
};

export default VisitorCounter;
