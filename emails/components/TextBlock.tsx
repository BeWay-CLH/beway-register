import type { ReactNode } from "react";
import { BRAND, FONT_BODY, FONT_DISPLAY } from "./constants";

type TextBlockProps = {
  eyebrow?: string;
  title: string;
  /** Top del bloque — 36 cuando sigue directo al Header; menor cuando
   * sigue a un bloque que ya cierra con su propio padding (ej. Award). */
  paddingTop?: number;
  children?: ReactNode;
};

// BeWay Design System > email-components.html > EM-Eyebrow · EM-Title.
// El título nunca pasa de 28px en escritorio ni de dos líneas — los
// párrafos van en <BodyText />, como hijos de este bloque.
export function TextBlock({ eyebrow, title, paddingTop = 36, children }: TextBlockProps) {
  return (
    <tr>
      <td className="gutter" style={{ padding: `${paddingTop}px 40px 0` }}>
        {eyebrow && (
          <p
            style={{
              margin: "0 0 10px",
              fontFamily: FONT_BODY,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: BRAND.cyanDark,
            }}
          >
            {eyebrow}
          </p>
        )}
        <h1
          className="h1"
          style={{
            margin: "0 0 14px",
            fontFamily: FONT_DISPLAY,
            fontSize: 28,
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
            fontWeight: 700,
            color: BRAND.dark,
          }}
        >
          {title}
        </h1>
        {children}
      </td>
    </tr>
  );
}

type BodyTextProps = {
  /** Gris secundario para contexto de apoyo, en vez del texto principal. */
  muted?: boolean;
  /** Sin margin-bottom — para el último párrafo del bloque. */
  last?: boolean;
  children: ReactNode;
};

// EM-Body: <p> con margin vertical explícito (nunca <br>), margin:0 en el último.
export function BodyText({ muted = false, last = false, children }: BodyTextProps) {
  return (
    <p
      style={{
        margin: last ? 0 : "0 0 16px",
        fontFamily: FONT_BODY,
        fontSize: 16,
        lineHeight: 1.6,
        color: muted ? BRAND.gray : BRAND.dark,
      }}
    >
      {children}
    </p>
  );
}
