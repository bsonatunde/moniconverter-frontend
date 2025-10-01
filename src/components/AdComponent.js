import React, { useEffect } from 'react';

const AdComponent = ({ adSlot, width, height, style = {} }) => {
  useEffect(() => {
    // Load AdSense script if not already loaded
    if (typeof window !== 'undefined' && !window.adsbygoogle) {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2195135566849441';
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
      
      script.onload = () => {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
          console.error('AdSense error:', err);
        }
      };
    } else if (window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, []);

  const adStyle = {
    display: 'inline-block',
    width: width || '360px',
    height: height || '800px',
    ...style
  };

  return (
    <div style={{ margin: '20px 0', textAlign: 'center' }}>
      <ins
        className="adsbygoogle"
        style={adStyle}
        data-ad-client="ca-pub-2195135566849441"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdComponent;
