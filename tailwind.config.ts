import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-outfit)", "sans-serif"],
        "serif-display": ["var(--font-instrument)", "serif"],
        jakarta: ["var(--font-inter)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        cardTitle: ["Roboto", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // New Redesign Palette (Amber/Gold based)
        primary: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        buttons: "#d97706", // primary-600
        buttonsSecondary: "#f59e0b", // primary-500
        priceCol: "#b45309", // primary-700
        buttonsHover: "#b45309", // primary-700
        ratingStarCol: "#f59e0b", // primary-500
        cardsBackground: "#fffbeb", // primary-50
        cardTitleCol: "#1f2937", // gray-800
        cardDesCol: "#4b5563", // gray-600
        headingCol: "#d97706", // primary-600
        subheadingCol: "#92400e", // primary-800
        primaryText: "#374151", // gray-700
        footerBg: "#78350f", // primary-900
      },
      animation: {
        slideFadeIn: "slideFadeIn 0.5s ease-out forwards",
        slideInRight: 'slideInRight 0.3s ease-out forwards',
        slideOutRight: 'slideOutRight 0.3s ease-in forwards',
      },
      backgroundImage: {
        'gradient-male': 'linear-gradient(to right, #3B82F6, #6366F1)', // from-blue-500 to-indigo-500
        'gradient-female': 'linear-gradient(to right, #EC4899, #F43F5E)', // from-pink-500 to-rose-500
      },
      keyframes: {
        slideFadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
