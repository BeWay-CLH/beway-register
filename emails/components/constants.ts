// Tokens de marca para correo (BeWay Design System > ui_kits/email). Copia
// deliberadamente aparte de app/globals.css/tailwind.config.ts: los clientes
// de correo no leen CSS variables ni clases Tailwind, cada valor debe ir
// inline y literal en el HTML — ver docs/email-strategy.md.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const BRAND = {
  dark: "#0B132B",
  navy: "#1C2541",
  cyan: "#00D4FF",
  cyanDark: "#00A8CC",
  cyanTint: "#D6F6FF",
  light: "#F8FAFC",
  sunken: "#EEF2F7",
  gray: "#64748B",
  gray200: "#E2E8F0",
  gray400: "#94A3B8",
  success: "#0FA97F",
  white: "#FFFFFF",
} as const;

export const FONT_BODY = "Inter,Arial,Helvetica,sans-serif";
export const FONT_DISPLAY = "'Space Grotesk',Arial,Helvetica,sans-serif";
export const FONT_MONO = "'JetBrains Mono','Courier New',Courier,monospace";
