import { EmailShell, Header, Banderola, Footer, TextBlock, Progress, Callout, EmailButton, SITE_URL } from "./components";

type HalfwayFinalReminderEmailProps = {
  firstName: string;
  percent: number;
  stageName: string;
  stagePosition: number;
  stageTotal: number;
  ctaUrl: string;
  unsubscribeUrl: string;
};

// docs/email-strategy.md > correo #5 (CV Vivo a medias — 2do y último
// aviso). Tono más directo, transparente sobre que es el último de este
// tipo (no presión artificial) — tras este, el usuario pasa a la cadencia
// general de #7. Composición: Shell · Header · Title · Progress ·
// Callout(último aviso) · Button · Banderola · Footer(comunicación).
export function HalfwayFinalReminderEmail({
  firstName,
  percent,
  stageName,
  stagePosition,
  stageTotal,
  ctaUrl,
  unsubscribeUrl,
}: HalfwayFinalReminderEmailProps) {
  return (
    <EmailShell preview="Última oportunidad para tu insignia de fundador — no te escribiremos de nuevo por esto.">
      <Header />
      <TextBlock title={`${firstName}, última oportunidad para tu insignia de fundador`} />
      <Progress percent={percent} stageName={stageName} stagePosition={stagePosition} stageTotal={stageTotal} />
      <Callout tone="neutral">
        Este es el último recordatorio puntual sobre tu CV Vivo — no queremos saturarte. La insignia de fundador
        sigue disponible cuando quieras retomarlo, y las empresas del ecosistema la verán en tu perfil.
      </Callout>
      <EmailButton href={ctaUrl} label="Continuar donde quedé" />
      <Banderola />
      <Footer category="communication" unsubscribeUrl={unsubscribeUrl} />
    </EmailShell>
  );
}

HalfwayFinalReminderEmail.PreviewProps = {
  firstName: "Ana",
  percent: 60,
  stageName: "Experiencia",
  stagePosition: 3,
  stageTotal: 10,
  ctaUrl: `${SITE_URL}/cv-vivo/experiencia`,
  unsubscribeUrl: `${SITE_URL}/unsubscribe?token=preview`,
} satisfies HalfwayFinalReminderEmailProps;

export default HalfwayFinalReminderEmail;
