import React, { useState, useEffect } from 'react';
import { AdItem, fetchAds } from '../services/geminiService';
import { MegaphoneIcon } from './Icons';

interface RollingAdBannerProps {
  adItems?: AdItem[]; // optional: if omitted, load from JSON via service
}

const RollingAdBanner: React.FC<RollingAdBannerProps> = ({ adItems }) => {
  const [loadedAds, setLoadedAds] = useState<AdItem[]>(Array.isArray(adItems) ? adItems : []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Read rolling timings from env with sensible defaults
  const ROLL_INTERVAL = Number(((import.meta as any).env?.VITE_ROLLING_INTERVAL_MS as any) ?? '') || 5000;
  const ROLL_FADE_MS = Number(((import.meta as any).env?.VITE_ROLLING_FADE_MS as any) ?? '') || 500;
  const fadeStyle = { transitionDuration: `${ROLL_FADE_MS}ms` } as any;

  // If no props provided, load from bundled JSON
  useEffect(() => {
    if (!adItems || adItems.length === 0) {
      (async () => {
        try {
          const fromJson = await fetchAds();
          if (Array.isArray(fromJson) && fromJson.length > 0) {
            setLoadedAds(fromJson);
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn('RollingAdBanner: failed to load ads from JSON', e);
        }
      })();
    } else {
      setLoadedAds(adItems);
    }
  }, [adItems]);

  useEffect(() => {
    const list = loadedAds;
    if (!list || list.length <= 1) {
        return;
    }

    const intervalId = setInterval(() => {
      setIsVisible(false); // Start fade-out
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % list.length);
        setIsVisible(true); // Start fade-in with new content
      }, ROLL_FADE_MS); // Match CSS transition duration
    }, ROLL_INTERVAL); // Change ad every N ms

    return () => clearInterval(intervalId);
  }, [loadedAds]);

  if (!loadedAds || loadedAds.length === 0) {
    return null; // Don't render anything if there are no ads
  }

  const currentAd = loadedAds[currentIndex];

  return (
    <a 
      href={currentAd.link} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block bg-gradient-to-r from-sky-100 to-indigo-100 border border-slate-200 rounded-lg p-3 sm:p-4 text-slate-800 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 bg-white/70 p-2 rounded-full">
            <MegaphoneIcon className="w-6 h-6 text-indigo-500" />
        </div>
      <div className="flex-grow text-left overflow-hidden">
         <div
           className={`transition-opacity ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
           style={fadeStyle}
         >
                <p className="font-semibold text-sm sm:text-base truncate">{currentAd.text}</p>
                <p className="text-xs sm:text-sm text-slate-500">자세히 보기 &rarr;</p>
            </div>
        </div>
      </div>
    </a>
  );
};

export default RollingAdBanner;