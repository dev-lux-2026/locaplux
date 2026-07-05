/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",

  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      // ⭐ Palette premium Locaplux
      colors: {
        "lp-black": "#0A0A0A",
        "lp-white": "#FFFFFF",
        "lp-gold": "#C6A667",
        "lp-blue": "#2563EB",
        "lp-green": "#16A34A",
        "lp-red": "#DC2626",

        "lp-neutral-50": "#FAFAFA",
        "lp-neutral-100": "#F3F3F3",
        "lp-neutral-200": "#E5E5E5",
        "lp-neutral-300": "#D4D4D4",
        "lp-neutral-800": "#1F1F1F",
        "lp-neutral-900": "#141414",
      },

      // ⭐ Radius premium
      borderRadius: {
        lg: "10px",
        xl: "14px",
        "2xl": "18px",
      },

      // ⭐ Typographies premium
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["SF Pro Display", "Inter", "sans-serif"],
      },

      // ⭐ Animations (tes animations conservées)
      keyframes: {
        fadeInMenu: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeInMenu: "fadeInMenu 0.25s ease-out forwards",
      },
    },
  },

  plugins: [],
};
