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
        cardTitle: ["Roboto", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        buttons: "#d0a400",
        buttonsSecondary: "#e4b500",
        priceCol: "#c29a00",
        buttonsHover: "#c29a00",
        ratingStarCol: "#b39009",
        cardsBackground: "#fcf5d6",
        cardTitleCol: "#5b645d",
        cardDesCol: "#788b7c",
        headingCol: "#c29a00",
        subheadingCol: "#c29a00",
        primaryText: "#5B645D",
        footerBg: "#a78604",
      },
      animation: {
        slideFadeIn: "slideFadeIn 0.5s ease-out forwards",
        slideInRight: 'slideInRight 0.3s ease-out forwards',
        slideOutRight: 'slideOutRight 0.3s ease-in forwards',
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
