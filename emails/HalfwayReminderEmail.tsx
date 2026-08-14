import { EmailShell, Header, Banderola, Footer, TextBlock, Progress, EmailButton, SITE_URL } from "./components";

type HalfwayReminderEmailProps = {
  firstName: string;
  percent: number;
  stageName: string;
  stagePosition: number;
  stageTotal: number;
  ctaUrl: string;
  unsubscribeUrl: string;
};

// docs/email-strategy.md > correo #4 (CV Vivo a medias — 1er aviso). Job
// programado, N días de inactividad con ≥1 etapa completada. El CTA
// enlaza directo a la etapa exacta donde quedó — nunca un CTA genérico al
// dashboard. Composición: Shell · Header · Eyebrow · Title · Progress ·
// Button · Banderola · Footer(comunicación).
export function HalfwayReminderEmail({ firstName, percent, stageName, stagePosition, stageTotal, ctaUrl, unsubscribeUrl }: HalfwayReminderEmailProps) {
  return (
    <EmailShell preview={`Vas al ${Math.round(percent)}% de tu CV Vivo — continúa donde quedaste.`}>
      <Header />
      <TextBlock eyebrow="CV Vivo" title={`Vas a la mitad de tu CV Vivo, ${firstName}`} />
      <Progress percent={percent} stageName={stageName} stagePosition={stagePosition} stageTotal={stageTotal} />
      <EmailButton href={ctaUrl} label="Continuar donde quedé" />
      <Banderola />
      <Footer category="communication" unsubscribeUrl={unsubscribeUrl} />
    </EmailShell>
  );
}

HalfwayReminderEmail.PreviewProps = {
  firstName: "Ana",
  percent: 60,
  stageName: "Experiencia",
  stagePosition: 3,
  stageTotal: 10,
  ctaUrl: `${SITE_URL}/cv-vivo/experiencia`,
  unsubscribeUrl: `${SITE_URL}/unsubscribe?token=preview`,
} satisfies HalfwayReminderEmailProps;

export default HalfwayReminderEmail;
