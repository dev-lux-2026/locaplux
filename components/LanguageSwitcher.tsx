"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "fr", label: "Français", flag: "/flags/fr.svg" },
    { code: "en", label: "English", flag: "/flags/en.svg" },
    { code: "lu", label: "Lëtzebuergesch", flag: "/flags/lu.svg" },
  ];

  // 👉 Détecter la langue actuelle depuis l’URL
  const currentLocale = pathname?.split("/")[1] || "fr";
  const current = languages.find((l) => l.code === currentLocale);

  // 👉 Fermer le menu quand on clique ailleurs
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // 👉 Fonction pour changer la langue
  const changeLocale = (locale: string) => {
    const segments = pathname.split("/");
    segments[1] = locale; // remplacer la locale dans l’URL
    router.push(segments.join("/"));
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="text-[11px] px-3 py-1.5 border border-white rounded hover:bg-white hover:text-black transition flex items-center gap-2"
      >
        <Image
          src={current!.flag}
          alt={current!.code}
          width={18}
          height={18}
          className="rounded-full"
        />
        <span>{current!.code.toUpperCase()}</span>
      </button>

      <div
        className={`
          absolute right-0 mt-1 w-44 z-[9999]
          ${open ? "block animate-fadeInMenu" : "hidden"}
        `}
      >
        <div className="bg-white border rounded shadow-md text-sm text-gray-700">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => changeLocale(l.code)}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 hover:text-black w-full text-left transition"
            >
              <Image
                src={l.flag}
                alt={l.code}
                width={18}
                height={18}
                className="rounded-full"
              />
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
