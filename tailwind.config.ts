import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily : {
        'cardTitle': ["Roboto",'sans-serif']
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        buttons : "#c29a00",
        buttonsHover : "#c29a00",
        ratingStarCol : "#b39009",
        cardsBackground : "#fcf5d6",
        cardTitleCol : "#5b645d",
        cardDesCol : "#788b7c",
        headingCol : "#c29a00",
        subheadingCol : "#c29a00",
        primaryText:'#5B645D',
        footerBg : "#a78604",
      },
    },
  },
  plugins: [],
} satisfies Config;
