import { BRAND, FONT_BODY, FONT_DISPLAY } from "./constants";

type ProgressProps = {
  percent: number;
  /** Nombre exacto de la etapa donde quedó — nunca un CTA genérico al
   * dashboard (docs/email-strategy.md > correo #4). */
  stageName: string;
  stagePosition?: number;
  stageTotal?: number;
};

// BeWay Design System > email-components.html > EM-Progress. El relleno
// es una tabla anidada con ancho en porcentaje — sin degradados ni
// border-radius dependiente (Outlook lo cuadra y sigue leyéndose).
export function Progress({ percent, stageName, stagePosition, stageTotal }: ProgressProps) {
  const value = Math.max(0, Math.min(100, Math.round(percent)));
  const stageSuffix = stagePosition && stageTotal ? `, la etapa ${stagePosition} de ${stageTotal}.` : ".";

  return (
    <tr>
      <td className="gutter" style={{ padding: "28px 40px 0" }}>
        <table role="presentation" width="100%" cellpadding={0} cellspacing={0} border={0}>
          <tbody>
            <tr>
              <td
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: BRAND.gray,
                }}
              >
                Tu CV Vivo
              </td>
              <td align="right" style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 700, color: BRAND.dark }}>
                {value}%
              </td>
            </tr>
          </tbody>
        </table>
        <table role="presentation" width="100%" cellpadding={0} cellspacing={0} border={0}>
          <tbody>
            <tr>
              <td height={10} style={{ height: 10, lineHeight: "10px", fontSize: 0 }}>
                &nbsp;
              </td>
            </tr>
          </tbody>
        </table>
        <table role="presentation" width="100%" cellpadding={0} cellspacing={0} border={0} bgcolor={BRAND.gray200} style={{ backgroundColor: BRAND.gray200 }}>
          <tbody>
            <tr>
              <td width={`${value}%`} bgcolor={BRAND.cyan} height={10} style={{ backgroundColor: BRAND.cyan, height: 10, lineHeight: "10px", fontSize: 0 }}>
                &nbsp;
              </td>
              <td width={`${100 - value}%`} height={10} style={{ height: 10, lineHeight: "10px", fontSize: 0 }}>
                &nbsp;
              </td>
            </tr>
          </tbody>
        </table>
        <table role="presentation" width="100%" cellpadding={0} cellspacing={0} border={0}>
          <tbody>
            <tr>
              <td height={12} style={{ height: 12, lineHeight: "12px", fontSize: 0 }}>
                &nbsp;
              </td>
            </tr>
          </tbody>
        </table>
        <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 15, lineHeight: 1.6, color: BRAND.dark }}>
          Te quedaste en <b style={{ fontWeight: 700 }}>{stageName}</b>
          {stageSuffix}
        </p>
      </td>
    </tr>
  );
}
