"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";

interface ProductItem {
  id: string;
  name: string;
  images?: string[];
}

export default function HomeConnected({
  userName,
}: {
  userName: string;
}) {
  const t = useTranslations("HomeConnected");
  const router = useRouter();
  const params = useParams();

  const locale = params?.locale || "fr";
  const [searchQuery, setSearchQuery] = useState("");
  const [randomProductImages, setRandomProductImages] = useState<string[]>([]);

  const SUGGESTION_ITEMS = useMemo(
    () => [
      { id: 1, label: t("suggestion.fashion"), fallbackImage: "/images/slide1.JPG" },
      { id: 2, label: t("suggestion.home"), fallbackImage: "/images/slide2.JPG" },
      { id: 3, label: t("suggestion.tech"), fallbackImage: "/images/slide3.JPG" },
      { id: 4, label: t("suggestion.collection"), fallbackImage: "/images/slide1.JPG" },
      { id: 5, label: t("suggestion.brands"), fallbackImage: "/images/slide2.JPG" },
      { id: 6, label: t("suggestion.stock"), fallbackImage: "/images/slide3.JPG" },
    ],
    [t]
  );

  const [items, setItems] = useState(SUGGESTION_ITEMS);

  useEffect(() => {
    setItems([...SUGGESTION_ITEMS].sort(() => Math.random() - 0.5));
  }, [SUGGESTION_ITEMS]);

  useEffect(() => {
    let active = true;

    async function loadRandomProducts() {
      try {
        const responses = await Promise.all([
          fetch("/api/products/popular").then((r) => (r.ok ? r.json() : [])),
          fetch("/api/products/latest").then((r) => (r.ok ? r.json() : [])),
          fetch("/api/products/featured").then((r) => (r.ok ? r.json() : [])),
        ]);

        const allProducts: ProductItem[] = responses.flatMap((list) =>
          Array.isArray(list) ? list : []
        );

        const uniqueImages = Array.from(
          new Set(
            allProducts
              .map((p) => (Array.isArray(p.images) ? p.images[0] : undefined))
              .filter((img): img is string => typeof img === "string" && img.trim().length > 0)
          )
        );

        const shuffledImages = uniqueImages.sort(() => Math.random() - 0.5);

        if (active && shuffledImages.length > 0) {
          setRandomProductImages(shuffledImages);
        }
      } catch {
        // Garde les images de repli en cas d'erreur réseau
      }
    }

    loadRandomProducts();
    return () => {
      active = false;
    };
  }, []);

  const handleSearch = (customQuery?: string) => {
    const query = (customQuery ?? searchQuery).trim();
    if (query) {
      router.push(`/${locale}/search?q=${encodeURIComponent(query)}`);
    } else {
      router.push(`/${locale}/search`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="w-full bg-white dark:bg-[#0B0B0C] py-10 px-4 transition-colors">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">

        {/* TITRE */}
        <div className="text-center max-w-3xl mx-auto animate-fadeIn">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
            {t("welcome")}{userName ? `, ${userName}` : ""} 👋
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mt-4 text-sm md:text-base leading-relaxed">
            {t("intro")}
          </p>
        </div>

        {/* SUGGESTIONS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 relative">

          {items.map((item, idx) => {
            const imageUrl =
              randomProductImages.length > 0
                ? randomProductImages[idx % randomProductImages.length]
                : item.fallbackImage;

            return (
              <div
                key={item.id}
                onClick={() => handleSearch(item.label)}
                className="relative h-28 md:h-32 rounded-lg overflow-hidden 
                           bg-gray-200 dark:bg-[#1F1F22] group cursor-pointer"
              >
                <img
                  src={imageUrl}
                  alt={item.label}
                  onError={(e) => {
                    if (e.currentTarget.src !== window.location.origin + item.fallbackImage) {
                      e.currentTarget.src = item.fallbackImage;
                    } else {
                      e.currentTarget.style.display = "none";
                    }
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/45 to-black/15" />
                <div className="absolute inset-0 flex items-end p-2">
                  <span className="text-xs md:text-[13px] text-white font-medium drop-shadow">
                    {item.label}
                  </span>
                </div>
              </div>
            );
          })}

          {/* SEARCH BOX */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/95 dark:bg-[#18181A]/95 backdrop-blur-sm 
                            border border-gray-200 dark:border-white/10 
                            rounded-xl shadow-lg px-4 py-3 w-full max-w-md 
                            pointer-events-auto transition-colors">
              
              <p className="text-[13px] text-gray-600 dark:text-gray-400 mb-2">
                {t("search.label")}
              </p>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 border border-gray-300 dark:border-white/10 
                             bg-white dark:bg-[#0B0B0C] 
                             text-gray-900 dark:text-white 
                             rounded-md px-3 py-2 text-[14px] 
                             placeholder-gray-400 dark:placeholder-gray-500
                             focus:outline-none focus:ring-2 
                             focus:ring-black dark:focus:ring-white 
                             focus:border-black dark:focus:border-white"
                  placeholder={t("search.placeholder")}
                />

                <button 
                  onClick={() => handleSearch()}
                  className="px-4 py-2 
                                   bg-black dark:bg-white 
                                   text-white dark:text-black 
                                   text-[13px] rounded-md 
                                   hover:bg-gray-900 dark:hover:bg-gray-200 
                                   transition"
                >
                  {t("search.button")}
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}