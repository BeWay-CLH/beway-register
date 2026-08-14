import { SITE_URL, BRAND, FONT_BODY, FONT_DISPLAY } from "./constants";

type AwardProps = {
  label?: string;
  title?: string;
};

// BeWay Design System > email-components.html > EM-Award. Reconocimiento
// centrado para el correo de 100% (#6). El isotipo es una imagen con
// dimensiones explícitas — nunca un emoji como elemento gráfico principal.
export function Award({ label = "Insignia desbloqueada", title = "Fundador BeWay" }: AwardProps) {
  return (
    <tr>
      <td className="gutter" style={{ padding: "12px 40px 32px" }}>
        <table role="presentation" width="100%" cellpadding={0} cellspacing={0} border={0} bgcolor={BRAND.dark} style={{ backgroundColor: BRAND.dark }}>
          <tbody>
            <tr>
              <td align="center" style={{ padding: "32px 32px 30px" }}>
                <img
                  src={`${SITE_URL}/brand/logo-icon-transparent.png`}
                  width={56}
                  height={62}
                  alt="Insignia de fundador BeWay"
                  style={{ display: "block", border: 0, outline: "none", textDecoration: "none", margin: "0 auto 16px" }}
                />
                <p
                  style={{
                    margin: "0 0 8px",
                    fontFamily: FONT_BODY,
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: BRAND.cyan,
                  }}
                >
                  {label}
                </p>
                <p style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 700, lineHeight: 1.25, color: "#FFFFFF" }}>{title}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
}
