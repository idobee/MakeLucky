import React, { useEffect } from 'react';

// This is a global variable from the Google Adsense script
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

// 환경변수에서 구글 애드센스 값을 읽어옵니다.
// 반드시 import.meta.env.VITE_* 형태로 접근해야 Vite가 빌드 시 정적으로 치환합니다.
// 로컬 개발: .env.local에 VITE_GOOGLE_ADSENSE_CLIENT_ID, VITE_GOOGLE_ADSENSE_SLOT_ID 설정
// GitHub Pages: Repo Settings → Secrets and variables → Actions → Variables 에 동일 키로 설정
// 섹션 표시 플래그: VITE_GOOGLE_ADSENSE_FLAG=TRUE 일 때에만 광고 섹션 노출
const ENABLE_ADS: boolean = String(
  (import.meta.env as any).VITE_GOOGLE_ADSENSE_FLAG || ''
)
  .toString()
  .trim()
  .toUpperCase() === 'TRUE';
const AD_CLIENT: string | undefined = import.meta.env.VITE_GOOGLE_ADSENSE_CLIENT_ID as any;
// 슬롯 ID는 선택사항이지만, 실제 광고 노출을 위해 본인 슬롯을 설정하는 것을 권장합니다.
const AD_SLOT: string = (import.meta.env.VITE_GOOGLE_ADSENSE_SLOT_ID as any) || "6971312071";

const IS_PLACEHOLDER = !AD_CLIENT || !AD_SLOT || AD_CLIENT.startsWith("ca-pub-000") || AD_SLOT.startsWith("000");

const GoogleAd = () => {
  // 플래그가 TRUE가 아니면 아무것도 렌더링하지 않습니다.
  if (!ENABLE_ADS) return null;
  useEffect(() => {
    if (IS_PLACEHOLDER) {
      // 개발자 콘솔에 상세 가이드 노출
      // eslint-disable-next-line no-console
      console.warn(
        "[GoogleAd] 광고 플레이스홀더 상태입니다. 환경변수를 설정하세요:\n" +
          " - 로컬: .env.local에 VITE_GOOGLE_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx / VITE_GOOGLE_ADSENSE_SLOT_ID=xxxxxxxxxx\n" +
          " - GitHub Pages: Settings → Secrets and variables → Actions → Variables에 동일 키 추가\n" +
          `현재 값: AD_CLIENT='${AD_CLIENT ?? ''}', AD_SLOT='${AD_SLOT ?? ''}'`
      );
      return;
    }

    // Inject AdSense script once (detect by src)
    const existing = document.querySelector(
      'script[src^="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]'
    ) as HTMLScriptElement | null;
    if (!existing) {
      const s = document.createElement('script');
      s.async = true;
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
        AD_CLIENT as string
      )}`;
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
    <div className="w-full border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-center p-4">
      {IS_PLACEHOLDER ? (
        <div className="text-slate-500">
          <h4 className="font-bold text-lg mb-2">광고 영역</h4>
          <div className="text-sm space-y-1">
            <p>실제 광고를 보려면 환경변수를 설정하세요.</p>
            <p>
              로컬: <code className="bg-slate-200 text-rose-600 font-mono text-xs p-1 rounded">.env.local</code>에
              <code className="bg-slate-200 text-rose-600 font-mono text-xs p-1 rounded ml-1">VITE_GOOGLE_ADSENSE_CLIENT_ID</code>,
              <code className="bg-slate-200 text-rose-600 font-mono text-xs p-1 rounded ml-1">VITE_GOOGLE_ADSENSE_SLOT_ID</code>
            </p>
            <p>
              배포(GitHub Pages): 저장소 Settings → Secrets and variables → Actions → Variables에 동일 키 추가
            </p>
          </div>
        </div>
      ) : (
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '90px' }}
          data-ad-client={AD_CLIENT as string}
          data-ad-slot={AD_SLOT as string}
          data-ad-format="auto"
          data-full-width-responsive="true"
          data-adtest={import.meta.env.MODE !== 'production' ? 'on' : undefined}
        ></ins>
      )}
    </div>
  );
};

export default GoogleAd;