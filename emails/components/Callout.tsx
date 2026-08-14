import type { ReactNode } from "react";
import { BRAND, FONT_BODY } from "./constants";

type CalloutProps = {
  /** accent = idea destacada (insignia, incentivo). neutral = dato
   * factual/legal (caducidad, retención). Máximo un callout por correo. */
  tone?: "accent" | "neutral";
  paddingTop?: number;
  children: ReactNode;
};

// BeWay Design System > email-components.html > EM-Callout. El acento de
// borde izquierdo es una celda de 4px con bgcolor, no border-left
// (soporte inconsistente en Outlook).
export function Callout({ tone = "accent", paddingTop = 24, children }: CalloutProps) {
  const bg = tone === "accent" ? BRAND.cyanTint : BRAND.sunken;
  const bar = tone === "accent" ? BRAND.cyan : BRAND.gray;

  return (
    <tr>
      <td className="gutter" style={{ padding: `${paddingTop}px 40px 0` }}>
        <table role="presentation" width="100%" cellpadding={0} cellspacing={0} border={0} bgcolor={bg} style={{ backgroundColor: bg }}>
          <tbody>
            <tr>
              <td bgcolor={bar} width={4} style={{ backgroundColor: bar, width: 4, fontSize: 0, lineHeight: "0" }}>
                &nbsp;
              </td>
              <td style={{ padding: "18px 22px", fontFamily: FONT_BODY, fontSize: 15, lineHeight: 1.6, color: BRAND.dark }}>{children}</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
}
