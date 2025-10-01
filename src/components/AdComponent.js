import React, { useEffect } from 'react';

const AdComponent = ({ adSlot, width, height, style = {} }) => {
  useEffect(() => {
    // Load AdSense script if not already loaded
    if (window.adsbygoogle && window.adsbygoogle.loaded) {
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
      />
    </div>
  );
};

export default AdComponent;
