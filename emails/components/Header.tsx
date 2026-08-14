import { SITE_URL, BRAND, FONT_BODY } from "./constants";

type HeaderProps = {
  /** Etiqueta a la derecha del logo — marca los correos de sistema
   * (verificación, recuperación, exportación/eliminación) para
   * diferenciarlos del nurture. Sin ella, header idéntico en los 9 correos. */
  label?: string;
};

// BeWay Design System > ui_kits/email/email-components.html > EM-Header.
export function Header({ label }: HeaderProps) {
  const logo = (
    <img
      src={`${SITE_URL}/brand/logo-negative-inline-transparent.png`}
      width={160}
      height={58}
      alt="BeWay"
      style={{ display: "block", border: 0, outline: "none", textDecoration: "none" }}
    />
  );

  if (!label) {
    return (
      <tr>
        <td bgcolor={BRAND.dark} className="gutter" style={{ backgroundColor: BRAND.dark, padding: "22px 40px" }}>
          {logo}
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td bgcolor={BRAND.dark} className="gutter" style={{ backgroundColor: BRAND.dark, padding: "22px 40px" }}>
        <table role="presentation" width="100%" cellpadding={0} cellspacing={0} border={0}>
          <tbody>
            <tr>
              <td width="60%">{logo}</td>
              <td
                align="right"
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: BRAND.cyan,
                }}
              >
                {label}
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
}
