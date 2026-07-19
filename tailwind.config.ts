import type { Config } from "tailwindcss";

// Fuente de verdad de los tokens de marca: ver /design-tokens.md
// Si cambia un valor aquí, debe cambiar también en app/globals.css (y viceversa).
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-dark": "#0B132B",
        "brand-navy": "#1C2541",
        "brand-cyan": "#00D4FF",
        "brand-light": "#F8FAFC",
        "brand-gray": "#64748B",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #0B132B 0%, #00D4FF 100%)",
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      fontSize: {
        display: ["40px", { lineHeight: "1.1", fontWeight: "800" }],
        h1: ["32px", { lineHeight: "1.25", fontWeight: "700" }],
        h2: ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        h3: ["20px", { lineHeight: "1.35", fontWeight: "600" }],
        body: ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        small: ["14px", { lineHeight: "1.5", fontWeight: "400" }],
      },
      borderRadius: {
        brand: "8px",
        "brand-card": "16px",
      },
      boxShadow: {
        brand: "0 4px 20px rgba(11, 19, 43, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
