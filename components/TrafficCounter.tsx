import React, { useEffect, useState } from 'react';

type Daily = { timestamp: string; count: number; uniques: number };
type Section = { repo: string; totalViews: number; totalUniques: number; views: Daily[] };
type TrafficJson = { generatedAt: string; root?: Section; project?: Section };

const TrafficCounter: React.FC = () => {
  const [views, setViews] = useState<number | null>(null);
  const [uniques, setUniques] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const url = 'https://idobee.github.io/traffic.json';
        const res = await fetch(url, { headers: { 'Cache-Control': 'no-cache' } });
        if (!res.ok) throw new Error('traffic fetch failed');
        const json = (await res.json()) as TrafficJson;
        const section = json.project ?? json.root;
        if (!section) throw new Error('no section');
        if (!cancelled) {
          setViews(section.totalViews ?? null);
          setUniques(section.totalUniques ?? null);
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
      GitHub 14d: {error ? '—' : `${views ?? '—'}/${uniques ?? '—'}`}
    </span>
  );
};

export default TrafficCounter;
