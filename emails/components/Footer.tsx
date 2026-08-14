import { SITE_URL, BRAND, FONT_BODY } from "./constants";

type FooterProps = {
  /** Transaccional: razón del envío = "tienes una cuenta en BeWay", sin
   * enlace de baja. Comunicación: razón = consentimiento de marketing +
   * enlaces de preferencias/baja — CLAUDE.md > Seguridad, consentimientos
   * separados y revocables. */
  category: "transactional" | "communication";
  unsubscribeUrl?: string;
};

const linkStyle = { color: BRAND.cyan, textDecoration: "underline" };

// BeWay Design System > email-components.html > EM-Footer.
export function Footer({ category, unsubscribeUrl }: FooterProps) {
  const reason =
    category === "communication"
      ? "Recibes este correo porque te suscribiste a las novedades de BeWay durante tu pre-registro."
      : "Recibes este correo porque tienes una cuenta en BeWay.";

  return (
    <tr>
      <td bgcolor={BRAND.dark} className="gutter" style={{ backgroundColor: BRAND.dark, padding: "32px 40px" }}>
        <img
          src={`${SITE_URL}/brand/logo-mono-white-transparent.png`}
          width={112}
          height={40}
          alt="BeWay"
          style={{ display: "block", border: 0, outline: "none", textDecoration: "none", marginBottom: 16 }}
        />
        <p style={{ margin: "0 0 14px", fontFamily: FONT_BODY, fontSize: 12, lineHeight: 1.7, color: BRAND.gray400 }}>{reason}</p>
        {/* Dirección legal pendiente de negocio/legal — ver docs/pending-decisions.md.
            CAN-SPAM/GDPR exigen una dirección postal real en correos comerciales. */}
        <p style={{ margin: "0 0 18px", fontFamily: FONT_BODY, fontSize: 12, lineHeight: 1.7, color: BRAND.gray400 }}>
          BeWay · [Dirección legal pendiente] · [Ciudad, País]
        </p>
        <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 12, lineHeight: 1.7, color: BRAND.gray400 }}>
          {category === "communication" && unsubscribeUrl && (
            <>
              <a href={`${SITE_URL}/cuenta`} style={linkStyle}>
                Preferencias de correo
              </a>
              &nbsp;&nbsp;·&nbsp;&nbsp;
              <a href={unsubscribeUrl} style={linkStyle}>
                Darme de baja
              </a>
              &nbsp;&nbsp;·&nbsp;&nbsp;
            </>
          )}
          {/* Sin página propia de Política de Privacidad todavía (pendiente
              de redacción legal) — texto plano, no un enlace roto. Mismo
              criterio que RegistroForm/el footer de la landing. */}
          Privacidad
        </p>
      </td>
    </tr>
  );
}
