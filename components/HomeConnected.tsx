"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";

interface ProductItem {
  id: string;
  name: string;
  images?: string[];
  prix_locaplux?: number;
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
  const [productsPool, setProductsPool] = useState<ProductItem[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<ProductItem[]>([]);

  const fallbackLabels = useMemo(
    () => [
      t("suggestion.fashion"),
      t("suggestion.home"),
      t("suggestion.tech"),
      t("suggestion.collection"),
      t("suggestion.brands"),
      t("suggestion.stock"),
    ],
    [t]
  );

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        const responses = await Promise.all([
          fetch("/api/products/popular").then((r) => (r.ok ? r.json() : [])),
          fetch("/api/products/latest").then((r) => (r.ok ? r.json() : [])),
          fetch("/api/products/featured").then((r) => (r.ok ? r.json() : [])),
        ]);

        const merged: ProductItem[] = responses.flatMap((list) =>
          Array.isArray(list) ? list : []
        );

        const uniqueById = Array.from(
          new Map(merged.filter((p) => p && p.id && p.name).map((p) => [p.id, p])).values()
        );

        if (!active || uniqueById.length === 0) return;

        setProductsPool(uniqueById);
        const initialPick = [...uniqueById]
          .sort(() => Math.random() - 0.5)
          .slice(0, 6);
        setDisplayedProducts(initialPick);
      } catch {
        // Garde l'affichage par défaut en cas d'erreur réseau
      }
    }

    loadProducts();
    return () => {
      active = false;
    };
  }, []);

  // Rotation aléatoire douce de 1 ou 2 cartes toutes les 4,5 secondes
  useEffect(() => {
    if (productsPool.length <= 1 || displayedProducts.length === 0) return;

    const timer = setInterval(() => {
      setDisplayedProducts((prev) => {
        if (prev.length === 0) return prev;
        const next = [...prev];
        const cardIndex = Math.floor(Math.random() * next.length);
        const candidates = productsPool.filter(
          (candidate) => !next.some((current) => current.id === candidate.id)
        );
        const poolToPickFrom = candidates.length > 0 ? candidates : productsPool;
        const randomProduct =
          poolToPickFrom[Math.floor(Math.random() * poolToPickFrom.length)];

        if (randomProduct) {
          next[cardIndex] = randomProduct;
        }
        return next;
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [productsPool, displayedProducts.length]);

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

  const handleCardClick = (product?: ProductItem, fallbackLabel?: string) => {
    if (product?.id) {
      router.push(`/${locale}/product/${product.id}`);
    } else if (fallbackLabel) {
      handleSearch(fallbackLabel);
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

        {/* BARRE DE RECHERCHE */}
        <div className="max-w-xl w-full mx-auto bg-white/95 dark:bg-[#18181A]/95 border border-gray-200 dark:border-white/10 rounded-xl shadow-sm px-4 py-3 transition-colors">
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

        {/* CARTES DYNAMIQUES (ROTATION ALÉATOIRE DES PRODUITS RÉELS) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
          {fallbackLabels.map((label, idx) => {
            const product = displayedProducts[idx];
            const imageUrl =
              Array.isArray(product?.images) && product.images[0]
                ? product.images[0]
                : null;
            const displayTitle = product?.name || label;

            return (
              <div
                key={`${label}-${idx}`}
                onClick={() => handleCardClick(product, label)}
                className="relative h-32 md:h-36 rounded-lg overflow-hidden 
                           bg-gray-200 dark:bg-[#1F1F22] group cursor-pointer"
              >
                {imageUrl && (
                  <img
                    key={imageUrl}
                    src={imageUrl}
                    alt={displayTitle}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 flex items-end justify-between gap-2">
                  <span className="text-xs md:text-[13px] text-white font-medium drop-shadow truncate">
                    {displayTitle}
                  </span>
                  {product?.prix_locaplux !== undefined && (
                    <span className="text-xs text-white/90 font-semibold shrink-0 drop-shadow">
                      {product.prix_locaplux} €
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}