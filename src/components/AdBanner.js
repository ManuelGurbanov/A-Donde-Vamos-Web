import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

const AdBanner = () => {
  useEffect(() => {
    // Esto asegura que el script de Google AdSense se ejecute correctamente
    if (window.adsbygoogle) {
      window.adsbygoogle.push({});
    }
  }, []);

  return (
    <div>
      <Helmet>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          crossOrigin="anonymous"></script>
      </Helmet>
      <ins className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-client="ca-pub-3940256099942544"
        data-ad-slot="1234567890"></ins>
    </div>
  );
};

export default AdBanner;
