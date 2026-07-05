"use client";

import { useEffect } from "react";

export default function AnalyticsLoader() {
  useEffect(() => {
    const consent = localStorage.getItem("lp_cookie_consent");
    if (!consent) return;

    const parsed = JSON.parse(consent);

    // Si l'utilisateur n'a pas accepté les cookies analytics → on ne charge rien
    if (!parsed.analytics) return;

    // Exemple : Google Analytics (GA4)
    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX";
    script.async = true;
    document.head.appendChild(script);

    const inlineScript = document.createElement("script");
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXX', { anonymize_ip: true });
    `;
    document.head.appendChild(inlineScript);
  }, []);

  return null;
}
