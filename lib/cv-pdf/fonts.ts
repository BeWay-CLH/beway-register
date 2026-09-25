import fs from "node:fs";
import path from "node:path";
import { Font } from "@react-pdf/renderer";

const FONTS_DIR = path.join(process.cwd(), "assets", "fonts");

// @react-pdf/renderer's FontSource loader only accepts a STRING src (path,
// URL, or data: URL) at runtime — a raw Buffer trips `dataUrl.substring is
// not a function` inside @react-pdf/font, despite older docs suggesting
// Buffer works. A literal file path would also work via fontkit.open(), but
// that reads the file lazily at RENDER time from a path we only compute at
// runtime — invisible to Vercel's build-time file tracing, so the font
// could go missing in the deployed function. A data: URL, built here from a
// literal fs.readFileSync() call (which the tracer DOES pick up), avoids
// that risk entirely.
function fontDataUrl(filename: string): string {
  const buffer = fs.readFileSync(path.join(FONTS_DIR, filename));
  return `data:font/woff;base64,${buffer.toString("base64")}`;
}

let registered = false;

// Registro global por proceso Node — idempotente para no reintentar en
// cada PDF generado dentro del mismo proceso (dev con hot-reload, o una
// función serverless "caliente" que atiende varias solicitudes). Pesos
// reales descargados de @fontsource (WOFF estático, no la variable-font que
// publica Google Fonts — más predecible para el renderer). Tipografía de
// marca (CLAUDE.md > Diseño): Space Grotesk para títulos, Inter para
// cuerpo.
export function registerCvFonts() {
  if (registered) return;
  registered = true;

  Font.register({
    family: "Inter",
    fonts: [
      { src: fontDataUrl("inter-latin-400-normal.woff"), fontWeight: 400 },
      { src: fontDataUrl("inter-latin-600-normal.woff"), fontWeight: 600 },
      { src: fontDataUrl("inter-latin-700-normal.woff"), fontWeight: 700 },
    ],
  });

  Font.register({
    family: "Space Grotesk",
    fonts: [
      { src: fontDataUrl("space-grotesk-latin-600-normal.woff"), fontWeight: 600 },
      { src: fontDataUrl("space-grotesk-latin-700-normal.woff"), fontWeight: 700 },
    ],
  });

  // Sin diccionario de guionización en español disponible — mejor no
  // partir palabras con las reglas en inglés por defecto que romper una
  // palabra larga a la mitad de forma rara.
  Font.registerHyphenationCallback((word) => [word]);
}
