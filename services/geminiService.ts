// Load ads data at build time to avoid runtime fetch/path issues (works on GitHub Pages)
// Vite supports importing JSON as a module by default
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - typing JSON import via cast below
import adsDataRaw from '../ads.json';

export interface AdItem {
  text: string;
  link: string;
}

// Cached ads
let allAds: AdItem[] | null = null;

interface AdsData {
  ads: AdItem[];
}

function loadAdsFromModule(): AdItem[] {
  if (allAds) return allAds;
  const data = adsDataRaw as unknown as AdsData;
  const raw = Array.isArray(data?.ads) ? data.ads : [];
  // Sanitize entries to avoid runtime issues if JSON is edited freely
  allAds = raw
    .filter((it: any) => it && typeof it.text === 'string')
    .map((it: any) => ({
      text: String(it.text).trim(),
      link: typeof it.link === 'string' && it.link.trim() ? String(it.link).trim() : '#',
    }))
    .filter((it) => it.text.length > 0);
  return allAds;
}

export async function fetchAds(): Promise<AdItem[]> {
    // Resolve synchronously from bundled JSON; keep async signature for callers
    return loadAdsFromModule();
}
