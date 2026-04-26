import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pb: ["PBGothic", "sans-serif"],
      },
      colors: {
        fg: "var(--color-fg)",
        "fg-muted": "var(--color-fg-muted)",
        theme: "var(--color-theme)",
        divider: "var(--color-divider)",
      },
    },
  },
  plugins: [],
} satisfies Config;
