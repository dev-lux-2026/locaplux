"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function IntroClient() {
  const router = useRouter();
  const pathname = usePathname();

  // Extraire la locale depuis l'URL : /fr/home → "fr"
  const locale = pathname.split("/")[1] || "fr";

  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // ⭐ Ne jouer l’intro qu’une seule fois
    const hasSeenIntro = localStorage.getItem("introSeen");

    if (hasSeenIntro) {
      // Ne pas afficher l’intro
      setVisible(false);
      return;
    }

    // Marquer l’intro comme vue
    localStorage.setItem("introSeen", "true");

    // ⭐ Animation + redirection rapide
    const timer = setTimeout(() => {
      const intro = document.getElementById("intro-container");
      const header = document.getElementById("main-header");

      if (intro) {
        intro.animate(
          [
            { transform: "translate(0,0) scale(1)", opacity: 1 },
            { transform: "translate(-50%, -50%) scale(0.1)", opacity: 0 }
          ],
          {
            duration: 600, // plus rapide
            easing: "ease-in-out",
            fill: "forwards"
          }
        );
      }

      if (header) {
        header.style.opacity = "1";
      }

      // Disparition rapide
      setTimeout(() => {
        setVisible(false);
      }, 650);

      // ⭐ Redirection quasi instantanée
      setTimeout(() => {
        router.push(`/${locale}/home`);
      }, 700);

    }, 400); // intro visible 0.4s avant animation

    return () => clearTimeout(timer);
  }, [router, locale]);

  if (!visible) return null;

  return (
    <div
      id="intro-container"
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
    >
      <div className="flex gap-4 text-[5rem] md:text-[8rem] font-semibold tracking-tight text-white">
        <div className="flex">
          {"LOCA".split("").map((letter, i) => (
            <span
              key={i}
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {letter}
            </span>
          ))}
        </div>

        <div className="flex">
          {"PLUX".split("").map((letter, i) => (
            <span
              key={i}
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${400 + i * 100}ms` }}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
