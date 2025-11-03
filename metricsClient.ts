const COUNTAPI_BASE = 'https://api.countapi.xyz';
const NS = 'idobee.github.io';

export function hitInstallOnce(): void {
  try {
    const flag = 'makelucky-install-counted';
    const counted = localStorage.getItem(flag) === '1';
    if (counted) return;
    const base = String(((window as any).METRICS_API_BASE ?? (import.meta as any).env?.VITE_METRICS_API_BASE ?? '')).trim();
    if (base) {
      fetch(`${base}/api/installs/hit`, { method: 'POST' }).catch(() => {});
    } else {
      fetch(`${COUNTAPI_BASE}/hit/${encodeURIComponent(NS)}/root-installs`).catch(() => {});
    }
    localStorage.setItem(flag, '1');
  } catch (_) {
    // ignore
  }
}

export async function getInstalls(): Promise<number | null> {
  try {
    const base = String(((window as any).METRICS_API_BASE ?? (import.meta as any).env?.VITE_METRICS_API_BASE ?? '')).trim();
    if (base) {
      const res = await fetch(`${base}/api/installs`, { headers: { 'Cache-Control': 'no-cache' } });
      if (!res.ok) return null;
      const j = await res.json();
      return typeof j?.value === 'number' ? j.value : null;
    }
    const res = await fetch(`${COUNTAPI_BASE}/get/${encodeURIComponent(NS)}/root-installs`);
    if (!res.ok) return null;
    const j = await res.json();
    return typeof j?.value === 'number' ? j.value : null;
  } catch {
    return null;
  }
}
