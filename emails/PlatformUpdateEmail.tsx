import { EmailShell, Header, Banderola, Footer, TextBlock, BodyText, EmailImage, TwoUp, Rule, EmailButton, SITE_URL, type TwoUpItem } from "./components";

type PlatformUpdateEmailProps = {
  eyebrow?: string;
  title: string;
  /** Un párrafo por elemento — contenido editorial real, nunca relleno
   * (docs/email-strategy.md > correo #7). */
  bodyParagraphs: string[];
  image?: { src: string; width?: number; height: number; alt: string; caption?: string };
  stats?: [TwoUpItem, TwoUpItem];
  /** Recordatorio suave al final, solo si el destinatario no completó su
   * CV Vivo — nunca como cuerpo principal del correo. */
  reminderText?: string;
  ctaUrl: string;
  ctaLabel: string;
  unsubscribeUrl: string;
};

// docs/email-strategy.md > correo #7 (Actualización de avance de la
// plataforma). Broadcast manual, filtrado por marketing_consent — ver
// lib/email/send.tsx > sendPlatformUpdateEmail. Composición: Shell ·
// Header · Eyebrow · Title · Body · Image · TwoUp · Rule ·
// Body(recordatorio suave) · Button · Banderola · Footer(comunicación,
// con baja).
export function PlatformUpdateEmail({
  eyebrow = "Actualización de BeWay",
  title,
  bodyParagraphs,
  image,
  stats,
  reminderText,
  ctaUrl,
  ctaLabel,
  unsubscribeUrl,
}: PlatformUpdateEmailProps) {
  return (
    <EmailShell preview={title}>
      <Header />
      <TextBlock eyebrow={eyebrow} title={title}>
        {bodyParagraphs.map((paragraph, index) => (
          <BodyText key={paragraph} last={index === bodyParagraphs.length - 1}>
            {paragraph}
          </BodyText>
        ))}
      </TextBlock>
      {image && <EmailImage src={image.src} width={image.width} height={image.height} alt={image.alt} caption={image.caption} />}
      {stats && <TwoUp items={stats} />}
      {reminderText && (
        <>
          <Rule />
          <tr>
            <td className="gutter" style={{ padding: "0 40px" }}>
              <BodyText muted last>
                {reminderText}
              </BodyText>
            </td>
          </tr>
        </>
      )}
      <EmailButton href={ctaUrl} label={ctaLabel} paddingTop={reminderText ? 16 : 28} />
      <Banderola />
      <Footer category="communication" unsubscribeUrl={unsubscribeUrl} />
    </EmailShell>
  );
}

PlatformUpdateEmail.PreviewProps = {
  title: "Ya tenemos 12 universidades piloto confirmadas",
  bodyParagraphs: [
    "El ecosistema BeWay sigue creciendo: doce universidades ya confirmaron su participación en el piloto, y más de mil cuatrocientos estudiantes ya crearon su CV Vivo.",
  ],
  stats: [
    { value: "12", label: "Universidades piloto confirmadas" },
    { value: "1.400", label: "Perfiles en pre-registro" },
  ],
  reminderText: "Todavía no completaste tu CV Vivo — son etapas cortas, puedes hacerlo por partes.",
  ctaUrl: `${SITE_URL}/cv-vivo`,
  ctaLabel: "Continuar mi CV Vivo",
  unsubscribeUrl: `${SITE_URL}/unsubscribe?token=preview`,
} satisfies PlatformUpdateEmailProps;

export default PlatformUpdateEmail;
