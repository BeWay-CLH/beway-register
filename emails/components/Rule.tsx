import { BRAND } from "./constants";

// BeWay Design System > email-components.html > EM-Rule · EM-Spacer.
// Regla de 1px hecha con una celda de fondo (no <hr>, inconsistente en
// Outlook). El spacer es una celda vacía con height + line-height +
// font-size:0 — sin las tres, Outlook añade altura fantasma.
export function Rule() {
  return (
    <tr>
      <td className="gutter" style={{ padding: "0 40px" }}>
        <table role="presentation" width="100%" cellpadding={0} cellspacing={0} border={0}>
          <tbody>
            <tr>
              <td height={28} style={{ height: 28, lineHeight: "28px", fontSize: 0 }}>
                &nbsp;
              </td>
            </tr>
            <tr>
              <td bgcolor={BRAND.gray200} height={1} style={{ backgroundColor: BRAND.gray200, height: 1, lineHeight: "1px", fontSize: 0 }}>
                &nbsp;
              </td>
            </tr>
            <tr>
              <td height={28} style={{ height: 28, lineHeight: "28px", fontSize: 0 }}>
                &nbsp;
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
}

type SpacerProps = {
  height?: number;
  /** false para un spacer angosto (ej. entre dos botones apilados, ya
   * dentro del padding lateral del bloque padre). */
  gutter?: boolean;
};

export function Spacer({ height = 16, gutter = false }: SpacerProps) {
  return (
    <tr>
      <td className={gutter ? "gutter" : undefined} style={gutter ? { padding: "0 40px" } : undefined}>
        <table role="presentation" width="100%" cellpadding={0} cellspacing={0} border={0}>
          <tbody>
            <tr>
              <td height={height} style={{ height, lineHeight: `${height}px`, fontSize: 0 }}>
                &nbsp;
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
}
