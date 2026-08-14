import { BRAND, FONT_BODY, FONT_DISPLAY } from "./constants";

export type TwoUpItem = { value: string; label: string };

function TwoUpCell({ item }: { item: TwoUpItem }) {
  return (
    <td className="col-stack" width="47%" valign="top" bgcolor={BRAND.light} style={{ width: "47%", backgroundColor: BRAND.light, padding: 20 }}>
      <p style={{ margin: "0 0 6px", fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 700, lineHeight: 1.1, color: BRAND.cyanDark }}>{item.value}</p>
      <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 14, lineHeight: 1.5, color: BRAND.dark }}>{item.label}</p>
    </td>
  );
}

// BeWay Design System > email-components.html > EM-TwoUp. Única
// estructura multicolumna permitida: dos celdas al 50% con gutter de 20px
// como celda intermedia, colapsan a 100% en móvil vía .col-stack.
export function TwoUp({ items }: { items: [TwoUpItem, TwoUpItem] }) {
  return (
    <tr>
      <td className="gutter" style={{ padding: "28px 40px 0" }}>
        <table role="presentation" width="100%" cellpadding={0} cellspacing={0} border={0}>
          <tbody>
            <tr>
              <TwoUpCell item={items[0]} />
              <td className="col-gutter" width="6%" style={{ width: "6%", fontSize: 0, lineHeight: "0" }}>
                &nbsp;
              </td>
              <TwoUpCell item={items[1]} />
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
}
