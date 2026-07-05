"use client";

import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("lp_cookie_consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem(
      "lp_cookie_consent",
      JSON.stringify({ necessary: true, analytics: true })
    );
    setAnalytics(true);
    setVisible(false);
  };

  const refuseAll = () => {
    localStorage.setItem(
      "lp_cookie_consent",
      JSON.stringify({ necessary: true, analytics: false })
    );
    setAnalytics(false);
    setVisible(false);
  };

  const savePreferences = () => {
    localStorage.setItem(
      "lp_cookie_consent",
      JSON.stringify({ necessary: true, analytics })
    );
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[480px] z-50">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Gestion des cookies
        </h2>

        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Locaplux utilise des cookies nécessaires au bon fonctionnement de la
          plateforme. Vous pouvez activer ou désactiver les cookies de mesure
          d’audience selon vos préférences.
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              Cookies nécessaires
            </span>
            <span className="text-xs px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
              Toujours actifs
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              Cookies analytics
            </span>
            <input
              type="checkbox"
              checked={analytics}
              onChange={() => setAnalytics(!analytics)}
              className="h-4 w-4 accent-black dark:accent-white"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 pt-2">
          <button
            onClick={refuseAll}
            className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            Tout refuser
          </button>

          <button
            onClick={savePreferences}
            className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            Enregistrer
          </button>

          <button
            onClick={acceptAll}
            className="w-full px-4 py-2 rounded-lg bg-black text-white text-sm hover:bg-neutral-800 transition"
          >
            Tout accepter
          </button>
        </div>
      </div>
    </div>
  );
}
