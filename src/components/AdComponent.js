import React, { useEffect } from 'react';

const AdComponent = ({ adSlot, width, height, style = {} }) => {
  useEffect(() => {
    // AdSense script is now loaded in index.html head section
    // Just push the ad when component mounts
    if (typeof window !== 'undefined' && window.adsbygoogle) {
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
