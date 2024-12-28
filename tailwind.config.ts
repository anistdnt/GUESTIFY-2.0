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
        cardsBackground : "#fcf5d6"
      },
      fontSize : {
        cardTitle : '24px'
      }
    },
  },
  plugins: [],
} satisfies Config;
