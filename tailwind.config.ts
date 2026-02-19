import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#070411",
        surface: "#100a22",
        "electric-purple": "#8b5cf6",
        gold: "#f5c451",
        muted: "#b9b2d6"
      },
      fontFamily: {
        display: ["Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 30px rgba(139, 92, 246, 0.4)",
        gold: "0 0 30px rgba(245, 196, 81, 0.3)"
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at top, rgba(139,92,246,0.35), transparent 55%), radial-gradient(circle at 80% 20%, rgba(245,196,81,0.15), transparent 42%)"
      }
    }
  },
  plugins: []
};

export default config;
