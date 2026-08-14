import { EmailShell, Header, Banderola, Footer, TextBlock, BodyText, Callout, EmailButton, Signature, SITE_URL } from "./components";

type NoStartReminderEmailProps = {
  firstName: string;
  unsubscribeUrl: string;
};

// docs/email-strategy.md > correo #3 (No ha iniciado el CV Vivo). Job
// programado, N días tras el registro sin ninguna etapa iniciada — ver
// app/api/cron/email-reminders/route.ts. Composición: Shell · Header ·
// Title · Body · Callout(insignia) · Button · Signature · Banderola ·
// Footer(comunicación).
export function NoStartReminderEmail({ firstName, unsubscribeUrl }: NoStartReminderEmailProps) {
  return (
    <EmailShell preview="Tu perfil profesional te está esperando — son etapas cortas, a tu ritmo.">
      <Header />
      <TextBlock title="Tu perfil profesional te está esperando">
        <BodyText>
          Hola {firstName}, creaste tu cuenta en BeWay pero todavía no empezaste tu CV Vivo. Son etapas cortas —
          puedes hacerlo por partes, guardando tu progreso en cada una.
        </BodyText>
        <BodyText muted last>
          Cuanto antes lo completes, antes queda listo para las empresas del ecosistema cuando lancemos.
        </BodyText>
      </TextBlock>
      <Callout tone="accent">
        <b style={{ fontWeight: 700 }}>Insignia de fundador.</b> Al llegar al 100% de tu CV Vivo, tu perfil queda
        marcado como fundador — visible para las empresas del ecosistema.
      </Callout>
      <EmailButton href={`${SITE_URL}/cv-vivo`} label="Empezar mi CV Vivo" />
      <Signature />
      <Banderola />
      <Footer category="communication" unsubscribeUrl={unsubscribeUrl} />
    </EmailShell>
  );
}

NoStartReminderEmail.PreviewProps = {
  firstName: "Ana",
  unsubscribeUrl: `${SITE_URL}/unsubscribe?token=preview`,
} satisfies NoStartReminderEmailProps;

export default NoStartReminderEmail;
