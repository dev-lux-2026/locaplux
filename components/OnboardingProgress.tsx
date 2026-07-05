"use client";

import clsx from "clsx";

export default function OnboardingProgress({ step }: { step: number }) {
  const steps = [
    { id: 1, label: "Inscription" },
    { id: 2, label: "Adresse" },
    { id: 3, label: "Préférences" },
  ];

  return (
    <div className="w-full max-w-xl mx-auto mt-4 mb-8">
      <div className="relative flex items-center justify-between">

        {/* Ligne de fond */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-200 dark:bg-white/10 -z-10" />

        {/* Ligne active */}
        <div
          className="absolute top-1/2 left-0 h-[2px] bg-black dark:bg-[#D4AF37] transition-all duration-500 -z-10"
          style={{ width: `${((step - 1) / 2) * 100}%` }}
        />

        {steps.map((s) => {
          const active = step >= s.id;

          return (
            <div key={s.id} className="flex flex-col items-center w-1/3">
              {/* Pastille */}
              <div
                className={clsx(
                  "w-3 h-3 rounded-full border transition-all",
                  active
                    ? "bg-black border-black dark:bg-[#D4AF37] dark:border-[#D4AF37]"
                    : "bg-white border-gray-300 dark:bg-[#18181A] dark:border-white/20"
                )}
              />

              {/* Label */}
              <span
                className={clsx(
                  "mt-2 text-[11px] font-medium tracking-wide transition-all",
                  active
                    ? "text-black dark:text-[#D4AF37]"
                    : "text-gray-500 dark:text-gray-400"
                )}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
