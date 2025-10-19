import React, { useEffect } from 'react';

// This is a global variable from the Google Adsense script
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

// ❗️TODO: 아래 두 값을 당신의 실제 구글 애드센스 정보로 교체하세요.
// 1. 당신의 애드센스 게시자 ID (ca-pub-XXXXXXXXXXXXXXXX)
const AD_CLIENT = (import.meta as any)?.env?.VITE_GOOGLE_ADSENSE_CLIENT_ID as string | undefined;
// 2. 당신이 생성한 광고 단위의 슬롯 ID (숫자 10자리)
//    .env의 VITE_GOOGLE_ADSENSE_SLOT_ID로 설정할 수 있으며, 미설정 시 아래 기본값을 사용합니다.
const AD_SLOT = ((import.meta as any)?.env?.VITE_GOOGLE_ADSENSE_SLOT_ID as string | undefined) || "6971312071";

const IS_PLACEHOLDER = !AD_CLIENT || !AD_SLOT || AD_CLIENT.startsWith("ca-pub-000") || AD_SLOT.startsWith("000");

const GoogleAd: React.FC = () => {
  useEffect(() => {
    if (IS_PLACEHOLDER) return;

    // Inject AdSense script once
    const existing = document.querySelector('script[data-origin="adsense"]') as HTMLScriptElement | null;
    if (!existing) {
      const s = document.createElement('script');
      s.async = true;
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
        AD_CLIENT as string
      )}`;
      s.setAttribute('data-origin', 'adsense');
      s.crossOrigin = 'anonymous';
      document.head.appendChild(s);
    }

    const adPushTimeout = setTimeout(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('Could not push ad:', e);
      }
    }, 500);

    return () => clearTimeout(adPushTimeout);
  }, []);

  return (
    <div className="w-full h-full border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-center p-4">
      {IS_PLACEHOLDER ? (
        <div className="text-slate-500">
          <h4 className="font-bold text-lg mb-2">광고 영역</h4>
          <p className="text-sm">
            실제 광고를 표시하려면, <br />
            <code className="bg-slate-200 text-rose-600 font-mono text-xs p-1 rounded">components/GoogleAd.tsx</code> 파일 상단의<br />
            <code className="bg-slate-200 text-rose-600 font-mono text-xs p-1 rounded">AD_CLIENT</code>와 <code className="bg-slate-200 text-rose-600 font-mono text-xs p-1 rounded">AD_SLOT</code> 값을<br />
            당신의 애드센스 ID로 교체해주세요.
          </p>
        </div>
      ) : (
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '100%' }}
          data-ad-client={AD_CLIENT as string}
          data-ad-slot={AD_SLOT as string}
          data-ad-format="horizontal"
          data-full-width-responsive="true"
        ></ins>
      )}
    </div>
  );
};

export default GoogleAd;