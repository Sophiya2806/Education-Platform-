/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0E1320",
          50: "#F4F5F8",
          100: "#E4E6EE",
          200: "#C6CAD7",
          300: "#9AA1B4",
          400: "#6A7187",
          500: "#414861",
          600: "#262C42",
          700: "#1A1F30",
          800: "#0E1320",
          900: "#070A14",
        },
        parchment: {
          DEFAULT: "#F4ECDA",
          50: "#FCF8EE",
          100: "#F8F1E2",
          200: "#F4ECDA",
          300: "#E9DDC1",
          400: "#D9C7A0",
        },
        vellum: {
          DEFAULT: "#FBF6E9",
          dark: "#EFE6CE",
        },
        cardinal: {
          DEFAULT: "#C8362D",
          dark: "#9E2720",
          light: "#E56A60",
        },
        lapis: {
          DEFAULT: "#1E3A8A",
          dark: "#15296B",
          light: "#3B5BBA",
        },
        verdigris: {
          DEFAULT: "#3B8266",
          dark: "#2B6049",
          light: "#6BB394",
        },
        gilt: {
          DEFAULT: "#C8A24A",
          dark: "#9A7B2F",
          light: "#E4C374",
        },
        rust: "#A8552F",
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['"Inter Tight"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
        jp: ['"Noto Serif JP"', "serif"],
        ko: ['"Noto Serif KR"', "serif"],
        sc: ['"Noto Serif SC"', "serif"],
      },
      boxShadow: {
        atlas: "0 1px 0 0 rgba(14,19,32,0.08), 0 12px 32px -18px rgba(14,19,32,0.35)",
        gilt: "0 0 0 1px rgba(200,162,74,0.5), 0 14px 30px -16px rgba(200,162,74,0.6)",
        parchment: "inset 0 0 60px rgba(160,134,84,0.12), 0 18px 40px -28px rgba(14,19,32,0.45)",
      },
      backgroundImage: {
        parchment:
          "radial-gradient(at 20% 0%, rgba(200,162,74,0.12) 0px, transparent 45%), radial-gradient(at 80% 100%, rgba(30,58,138,0.10) 0px, transparent 50%), linear-gradient(180deg, #FBF6E9 0%, #F4ECDA 100%)",
        grain:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.12  0 0 0 0 0.08  0 0 0 0 0.04  0 0 0 0.12 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "draw-line": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "compass-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "pulse-soft": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.9" },
          "50%": { transform: "scale(1.05)", opacity: "1" },
        },
        "card-flip": {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(180deg)" },
        },
        "ring-fill": {
          "0%": { strokeDashoffset: "var(--circ)" },
          "100%": { strokeDashoffset: "var(--target)" },
        },
        "wave-pulse": {
          "0%, 100%": { transform: "scaleY(0.4)" },
          "50%": { transform: "scaleY(1)" },
        },
        "toast-in": {
          "0%": { opacity: "0", transform: "translateY(-12px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 420ms ease-out both",
        "fade-in": "fade-in 320ms ease-out both",
        "draw-line": "draw-line 320ms ease-out forwards",
        shimmer: "shimmer 3.2s linear infinite",
        "compass-spin": "compass-spin 36s linear infinite",
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
        "card-flip": "card-flip 600ms ease-in-out forwards",
        "wave-pulse": "wave-pulse 1s ease-in-out infinite",
        "toast-in": "toast-in 240ms ease-out both",
      },
    },
  },
  plugins: [],
};
