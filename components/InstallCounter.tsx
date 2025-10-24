import React, { useEffect, useState } from 'react';

const NAMESPACE = 'idobee.github.io';
const KEY = 'root-installs';
const COUNTAPI_BASE = 'https://api.countapi.xyz';

const InstallCounter: React.FC = () => {
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const res = await fetch(`${COUNTAPI_BASE}/get/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(KEY)}`);
        if (!res.ok) throw new Error('countapi get failed');
        const json = await res.json();
        if (!cancelled && typeof json?.value === 'number') {
          setCount(json.value);
        }
      } catch (_) {
        if (!cancelled) setError(true);
      }
    };
    run();
    return () => { cancelled = true; };
  }, []);

  return (
    <span className="text-slate-500">
      설치 수: {error ? '—' : (count ?? '—')}
    </span>
  );
};

export default InstallCounter;
