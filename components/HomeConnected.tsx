"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

export default function HomeConnected({ userName }) {
  const t = useTranslations("HomeConnected");

  const SUGGESTION_ITEMS = useMemo(
    () => [
      { id: 1, label: t("suggestion.fashion"), image: "/images/suggestions/fashion.jpg" },
      { id: 2, label: t("suggestion.home"), image: "/images/suggestions/home.jpg" },
      { id: 3, label: t("suggestion.tech"), image: "/images/suggestions/tech.jpg" },
      { id: 4, label: t("suggestion.collection"), image: "/images/suggestions/collection.jpg" },
      { id: 5, label: t("suggestion.brands"), image: "/images/suggestions/brands.jpg" },
      { id: 6, label: t("suggestion.stock"), image: "/images/suggestions/stock.jpg" },
    ],
    [t]
  );

  const shuffled = useMemo(
    () => [...SUGGESTION_ITEMS].sort(() => Math.random() - 0.5),
    [SUGGESTION_ITEMS]
  );

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

          {shuffled.map((item) => (
            <div
              key={item.id}
              className="relative h-28 md:h-32 rounded-lg overflow-hidden 
                         bg-gray-200 dark:bg-[#1F1F22] group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/10" />
              <div className="absolute inset-0 flex items-end p-2">
                <span className="text-xs md:text-[13px] text-white font-medium drop-shadow">
                  {item.label}
                </span>
              </div>
            </div>
          ))}

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

                <button className="px-4 py-2 
                                   bg-black dark:bg-white 
                                   text-white dark:text-black 
                                   text-[13px] rounded-md 
                                   hover:bg-gray-900 dark:hover:bg-gray-200 
                                   transition">
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
