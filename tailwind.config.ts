import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pb: ["PBGothic", "sans-serif"],
      },
      letterSpacing: {
        pb: "-0.07em",
        "pb-tight": "-0.05em",
      },
      colors: {
        // 기존 별칭 (변수 리매핑으로 자동으로 PB 톤이 적용됨)
        fg: "var(--color-fg)",
        "fg-muted": "var(--color-fg-muted)",
        theme: "var(--color-theme)",
        divider: "var(--color-divider)",

        // PB design tokens (subset — 자주 쓸 것만)
        canvas: "#ffffff",
        "canvas-soft": "#fbfbfd",
        navy: {
          50: "#eef1f7",
          100: "#d5dcea",
          200: "#a7b3ce",
          400: "#3f568c",
          500: "#1b3970",
          600: "#09275a",
          700: "#061e47",
        },
        royal: {
          400: "#4e5f9f",
          500: "#2c428d",
          600: "#22367a",
        },
        porcelain: {
          50: "#fbfbfd",
          100: "#f5f6f9",
          200: "#edeff4",
          300: "#dee2eb",
          400: "#b8bfce",
          500: "#8890a3",
          600: "#5e6679",
          700: "#3e455a",
          800: "#262b3c",
        },
        wheat: {
          100: "#faf6ed",
          200: "#f2e8d5",
          400: "#d9c396",
        },
        "accent-hot": "#f44b01",
        "accent-hot-tint": "#fff1ea",
        "accent-new": "#f9bd00",
        "accent-new-tint": "#fff8e0",
        ink: "#262b3c",
      },
      boxShadow: {
        "pb-sm": "0 1px 2px rgba(9,39,90,0.06), 0 1px 1px rgba(0,0,0,0.04)",
        "pb-md": "0 4px 10px rgba(9,39,90,0.08), 0 2px 4px rgba(0,0,0,0.05)",
        "pb-lg": "0 12px 24px rgba(9,39,90,0.12), 0 4px 8px rgba(0,0,0,0.06)",
        "pb-focus": "0 0 0 3px rgba(9,39,90,0.18)",
      },
    },
  },
  plugins: [],
} satisfies Config;
