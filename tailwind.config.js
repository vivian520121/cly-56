/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FDFBF7",
          100: "#F8F5F0",
          200: "#F0EBE2",
          300: "#E5DDD0",
          400: "#D4C7B5",
          500: "#BFA893",
        },
        sage: {
          50: "#F0F5EE",
          100: "#DCE8D7",
          200: "#C2D6BA",
          300: "#A8C3A0",
          400: "#8BB081",
          500: "#6E9C63",
        },
        clay: {
          50: "#FDF3EC",
          100: "#F9E2D3",
          200: "#F3CBAF",
          300: "#E8A87C",
          400: "#D98A5A",
          500: "#C66D3D",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "PingFang SC",
          "Hiragino Sans GB",
          "Microsoft YaHei",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0, 0, 0, 0.06)",
        softer: "0 1px 4px rgba(0, 0, 0, 0.04)",
        card: "0 4px 16px rgba(0, 0, 0, 0.08)",
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
    },
  },
  plugins: [],
};
