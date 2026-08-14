import { BRAND, FONT_BODY } from "./constants";

// BeWay Design System > email-components.html > EM-Signature. Cierre
// humano, solo en nurture y bienvenida — nunca en correos de sistema
// (#8, #9), que deben leerse como factuales.
export function Signature() {
  return (
    <tr>
      <td className="gutter" style={{ padding: "8px 40px 28px" }}>
        <p style={{ margin: "0 0 4px", fontFamily: FONT_BODY, fontSize: 15, lineHeight: 1.6, color: BRAND.dark }}>— El equipo de BeWay</p>
        <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 13, lineHeight: 1.6, color: BRAND.gray }}>Conectamos talento, impulsamos innovación.</p>
      </td>
    </tr>
  );
}
