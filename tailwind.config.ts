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
        "brand-navy-600": "var(--brand-navy-600)",
        "brand-navy-400": "var(--brand-navy-400)",
        "brand-cyan-600": "var(--brand-cyan-600)",
        "brand-cyan-300": "var(--brand-cyan-300)",
        "brand-cyan-100": "var(--brand-cyan-100)",
        "brand-gray-400": "var(--brand-gray-400)",
        "brand-gray-200": "var(--brand-gray-200)",
        "brand-gray-100": "var(--brand-gray-100)",
        // Superficies, texto, bordes y acciones semánticas — ver
        // design-tokens.md y app/globals.css.
        "surface-page": "var(--surface-page)",
        "surface-card": "var(--surface-card)",
        "surface-sunken": "var(--surface-sunken)",
        "surface-inverse": "var(--surface-inverse)",
        "surface-inverse-alt": "var(--surface-inverse-alt)",
        "surface-accent-subtle": "var(--surface-accent-subtle)",
        "text-body": "var(--text-body)",
        "text-heading": "var(--text-heading)",
        "text-muted": "var(--text-muted)",
        "text-accent": "var(--text-accent)",
        "text-on-inverse": "var(--text-on-inverse)",
        "text-on-inverse-muted": "var(--text-on-inverse-muted)",
        "text-on-accent": "var(--text-on-accent)",
        "border-subtle": "var(--border-subtle)",
        "border-strong": "var(--border-strong)",
        "border-inverse": "var(--border-inverse)",
        "border-accent": "var(--border-accent)",
        "action-primary": "var(--action-primary)",
        "action-primary-hover": "var(--action-primary-hover)",
        "action-primary-active": "var(--action-primary-active)",
        "action-secondary": "var(--action-secondary)",
        "action-secondary-hover": "var(--action-secondary-hover)",
        "status-success": "var(--status-success)",
        "status-warning": "var(--status-warning)",
        "status-danger": "var(--status-danger)",
        "status-info": "var(--status-info)",
        link: "var(--link)",
        "link-hover": "var(--link-hover)",
        "link-on-inverse": "var(--link-on-inverse)",
      },
      backgroundImage: {
        "brand-gradient": "var(--brand-gradient)",
        "brand-gradient-soft": "var(--brand-gradient-soft)",
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
        eyebrow: ["12px", { lineHeight: "1.4", fontWeight: "700", letterSpacing: "0.14em" }],
      },
      letterSpacing: {
        display: "-0.02em",
        tight: "-0.01em",
        caps: "0.14em",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        glow: "var(--shadow-glow)",
        "focus-ring": "var(--ring-focus)",
      },
      transitionDuration: {
        fast: "120ms",
        base: "200ms",
        slow: "360ms",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(.4,0,.2,1)",
        out: "cubic-bezier(.16,1,.3,1)",
      },
      height: {
        "control-sm": "32px",
        "control-md": "40px",
        "control-lg": "48px",
      },
    },
  },
  plugins: [],
};

export default config;
