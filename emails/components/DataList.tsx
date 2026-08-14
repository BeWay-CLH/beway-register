import { Fragment, type ReactNode } from "react";
import { BRAND, FONT_BODY } from "./constants";

export type DataRow = { label: string; value: ReactNode; valueColor?: string };

// BeWay Design System > email-components.html > EM-DataList. Pares
// clave-valor para confirmaciones factuales (#8: exportación/eliminación).
export function DataList({ rows }: { rows: DataRow[] }) {
  return (
    <tr>
      <td className="gutter" style={{ padding: "24px 40px" }}>
        <table role="presentation" width="100%" cellpadding={0} cellspacing={0} border={0}>
          <tbody>
            {rows.map((row, index) => (
              <Fragment key={row.label}>
                <tr>
                  <td width={200} valign="top" style={{ width: 200, padding: "12px 0", fontFamily: FONT_BODY, fontSize: 14, lineHeight: 1.5, color: BRAND.gray }}>
                    {row.label}
                  </td>
                  <td
                    valign="top"
                    style={{
                      padding: "12px 0",
                      fontFamily: FONT_BODY,
                      fontSize: 14,
                      lineHeight: 1.5,
                      fontWeight: 600,
                      color: row.valueColor ?? BRAND.dark,
                    }}
                  >
                    {row.value}
                  </td>
                </tr>
                {index < rows.length - 1 && (
                  <tr>
                    <td colspan={2} bgcolor={BRAND.gray200} height={1} style={{ backgroundColor: BRAND.gray200, height: 1, lineHeight: "1px", fontSize: 0 }}>
                      &nbsp;
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </td>
    </tr>
  );
}
