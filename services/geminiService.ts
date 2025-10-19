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
  const data = adsDataRaw as AdsData;
  allAds = Array.isArray(data?.ads) ? data.ads : [];
  return allAds;
}

export async function fetchAds(): Promise<AdItem[]> {
    // Resolve synchronously from bundled JSON; keep async signature for callers
    return loadAdsFromModule();
}
