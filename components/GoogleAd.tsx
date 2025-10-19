import React, { useEffect } from 'react';

// This is a global variable from the Google Adsense script
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

// ❗️TODO: 아래 두 값을 당신의 실제 구글 애드센스 정보로 교체하세요.
// 1. 당신의 애드센스 게시자 ID (ca-pub-XXXXXXXXXXXXXXXX)
const AD_CLIENT = import.meta.env.VITE_GOOGLE_ADSENSE_CLIENT_ID as string; 
// 2. 당신이 생성한 광고 단위의 슬롯 ID (숫자 10자리)
const AD_SLOT = "6971312071";

const IS_PLACEHOLDER = AD_CLIENT.startsWith("ca-pub-000") || AD_SLOT.startsWith("000");

const GoogleAd: React.FC = () => {
  useEffect(() => {
    // 플레이스홀더 ID가 사용 중일 때는 광고를 요청하지 않습니다.
    if (IS_PLACEHOLDER) return;

    // SPA 환경에서 "No slot size for availableWidth=0" 오류를 방지하기 위해
    // 레이아웃이 계산될 시간을 준 후 광고를 요청합니다.
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
          data-ad-client={AD_CLIENT}
          data-ad-slot={AD_SLOT}
          data-ad-format="horizontal"
          data-full-width-responsive="true"
        ></ins>
      )}
    </div>
  );
};

export default GoogleAd;