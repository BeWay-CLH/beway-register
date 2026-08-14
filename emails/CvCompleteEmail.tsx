import { EmailShell, Header, Banderola, Footer, Award, TextBlock, BodyText, Steps, EmailButton, Signature, SITE_URL } from "./components";

type CvCompleteEmailProps = {
  firstName: string;
};

// docs/email-strategy.md > correo #6 (100% completado). Inmediato al
// completar la última etapa — ver profiles.cv_completed_at para la
// idempotencia (se envía una sola vez). Sin fecha de lanzamiento ficticia:
// CLAUDE.md no fija una, así que el mensaje es honesto ("te avisaremos").
// Composición: Shell · Header · Award · Title · Body · Steps ·
// Button(secundario) · Signature · Banderola · Footer(transaccional).
export function CvCompleteEmail({ firstName }: CvCompleteEmailProps) {
  return (
    <EmailShell preview={`${firstName}, tu CV Vivo está completo — ya ganaste tu insignia de fundador.`}>
      <Header />
      <Award />
      <TextBlock title={`¡Lo lograste, ${firstName}!`} paddingTop={0}>
        <BodyText>
          Tu CV Vivo está completo al 100% — formación, experiencia, proyectos, habilidades y evidencias, todo en
          un solo lugar. Ya ganaste tu insignia de fundador: las empresas del ecosistema la verán en tu perfil y
          sabrán que estuviste desde el primer día.
        </BodyText>
        <BodyText muted last>
          Aún no fijamos la fecha de lanzamiento — te avisaremos por correo apenas abramos la plataforma a las
          empresas.
        </BodyText>
      </TextBlock>
      <Steps
        steps={[
          { title: "Tu perfil ya está listo.", body: "No necesitas hacer nada más por ahora." },
          { title: "Te avisamos en el lanzamiento.", body: "Sin correos de más mientras tanto." },
        ]}
      />
      <EmailButton href={`${SITE_URL}/cuenta`} label="Ver mi perfil" variant="secondary" />
      <Signature />
      <Banderola />
      <Footer category="transactional" />
    </EmailShell>
  );
}

CvCompleteEmail.PreviewProps = { firstName: "Ana" } satisfies CvCompleteEmailProps;

export default CvCompleteEmail;
