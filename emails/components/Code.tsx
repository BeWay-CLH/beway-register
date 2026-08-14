import { BRAND, FONT_MONO } from "./constants";

// BeWay Design System > email-components.html > EM-Code. Código de
// verificación — fondo hundido, monoespaciado con fallback Courier New.
export function CodeBlock({ code }: { code: string }) {
  return (
    <tr>
      <td className="gutter" style={{ padding: "24px 40px" }}>
        <table role="presentation" width="100%" cellpadding={0} cellspacing={0} border={0} bgcolor={BRAND.sunken} style={{ backgroundColor: BRAND.sunken }}>
          <tbody>
            <tr>
              <td align="center" style={{ padding: 20, fontFamily: FONT_MONO, fontSize: 28, fontWeight: 700, letterSpacing: "0.22em", color: BRAND.dark }}>
                {code}
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
}

// Misma familia EM-Code, variante URL larga: word-break:break-all para
// que no rompa el ancho de 600px.
export function UrlBlock({ url, paddingTop = 0 }: { url: string; paddingTop?: number }) {
  return (
    <tr>
      <td className="gutter" style={{ padding: `${paddingTop}px 40px 24px` }}>
        <table role="presentation" width="100%" cellpadding={0} cellspacing={0} border={0} bgcolor={BRAND.sunken} style={{ backgroundColor: BRAND.sunken }}>
          <tbody>
            <tr>
              <td style={{ padding: "14px 18px", fontFamily: FONT_MONO, fontSize: 12, lineHeight: 1.6, color: BRAND.navy, wordBreak: "break-all" }}>{url}</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
}
