import React, { useEffect } from 'react';

// This is a global variable from the Google Adsense script
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const GoogleAd: React.FC = () => {
  useEffect(() => {
    // In a Single-Page Application (SPA) like React, components can render
    // before the page layout is fully calculated by the browser. This can lead to
    // the Google Ads script running when the ad container's width is still zero,
    // causing the "No slot size for availableWidth=0" error.
    //
    // To fix this, we wrap the ad request in a `setTimeout`. This delays the
    // request slightly, giving the browser enough time to render the component
    // and its container, ensuring `availableWidth` is correctly measured.
    const adPushTimeout = setTimeout(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('Could not push ad:', e);
      }
    }, 500);

    // Cleanup the timeout if the component unmounts before the timer fires
    return () => clearTimeout(adPushTimeout);
  }, []);

  return (
    // 이 컨테이너는 광고 슬롯의 위치를 시각적으로 보여줍니다.
    // h-full을 추가하여 부모 flex 컨테이너의 높이에 맞춰 늘어나도록 합니다.
    <div className="w-full h-full border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-center p-2">
      {/* 
        중요: 아래 값들을 자신의 구글 애드센스 계정 정보로 반드시 교체해야 합니다.
        - data-ad-client: index.html에 있는 클라이언트 ID와 일치해야 합니다 (예: ca-pub-1234567890123456).
        - data-ad-slot: 고유한 광고 단위 ID입니다 (예: 1234567890).
        
        광고가 보이지 않는 일반적인 이유:
        1. 위의 ID들이 올바르지 않은 경우 (가장 흔한 원인).
        2. 브라우저에 애드블록(AdBlock) 확장 프로그램이 설치된 경우.
        3. 애드센스 계정이 완전히 승인되지 않았거나, 구글에서 표시할 적절한 광고를 찾지 못한 경우.
      */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" 
        data-ad-slot="YOUR_AD_SLOT_ID" // ❗️이 값을 꼭 교체하세요!
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default GoogleAd;