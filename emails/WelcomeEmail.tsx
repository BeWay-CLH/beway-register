import {
  EmailShell,
  Header,
  Banderola,
  Footer,
  TextBlock,
  BodyText,
  Callout,
  Steps,
  EmailButton,
  Signature,
  SITE_URL,
} from "./components";

type WelcomeEmailProps = {
  firstName: string;
};

// docs/email-strategy.md > correo #2 (Bienvenida). Inmediato al verificar
// el correo del Paso 1 — ver app/auth/confirm/route.ts. Composición
// (ui_kits/email/README.md): Shell · Header · Eyebrow · Title · Body ·
// Callout(insignia) · Steps · Button · Signature · Banderola ·
// Footer(transaccional).
export function WelcomeEmail({ firstName }: WelcomeEmailProps) {
  return (
    <EmailShell preview={`Bienvenido a BeWay, ${firstName} — ya eres parte del ecosistema.`}>
      <Header />
      <TextBlock eyebrow="Cuenta activa" title={`¡Bienvenido a BeWay, ${firstName}! 🎉`}>
        <BodyText>
          Tu cuenta ya está activa. Eres de los primeros en unirte al ecosistema BeWay: conectamos talento,
          impulsamos la innovación y generamos oportunidades reales entre estudiantes y empresas.
        </BodyText>
        <BodyText muted last>
          Completar tu CV Vivo es opcional, pero cuanto antes lo hagas, antes estará listo para las empresas
          cuando lancemos.
        </BodyText>
      </TextBlock>
      <Callout tone="accent">
        <b style={{ fontWeight: 700 }}>Insignia de fundador.</b> Al llegar al 100% de tu CV Vivo, tu perfil queda
        marcado como fundador — visible para las empresas del ecosistema.
      </Callout>
      <Steps
        steps={[
          { title: "Completa tu CV Vivo.", body: "Diez etapas cortas y guardables, a tu ritmo." },
          { title: "Gana tu insignia de fundador.", body: "Visible para las empresas cuando lancemos." },
        ]}
      />
      <EmailButton href={`${SITE_URL}/cv-vivo`} label="Comenzar mi CV Vivo" />
      <Signature />
      <Banderola />
      <Footer category="transactional" />
    </EmailShell>
  );
}

// Datos de ejemplo para `npm run email:dev`/`email export` — sin esto, la
// vista previa renderiza con props vacías (ver render-email-test.mjs, que
// mostró literalmente "undefined" en el título hasta agregar esto).
WelcomeEmail.PreviewProps = { firstName: "Ana" } satisfies WelcomeEmailProps;

export default WelcomeEmail;
