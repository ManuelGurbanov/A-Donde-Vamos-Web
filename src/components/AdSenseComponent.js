import React, { useEffect } from "react";

const AdSenseComponent = () => {
  useEffect(() => {
    // Asegúrate de que el script de adsbygoogle está cargado
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7393353451633229";
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);

    // Inicializa el anuncio después de cargar el script
    script.onload = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("Error initializing AdSense", e);
      }
    };

    return () => {
      // Opcional: limpia el script si el componente se desmonta
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      {/* Contenedor del anuncio */}
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-7393353451633229"
        data-ad-slot="4789439665"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdSenseComponent;
