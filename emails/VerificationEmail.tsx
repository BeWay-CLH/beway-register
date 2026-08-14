import { EmailShell, Header, Banderola, Footer, TextBlock, BodyText, EmailButton, Fallback, Callout } from "./components";

// docs/email-strategy.md > correo #1 (Verificación de cuenta). Este
// archivo NO se envía vía Resend: es la fuente para generar el HTML
// estático de la plantilla "Confirm signup" de Supabase Auth (ver
// scripts/build-auth-email-templates.mjs y supabase/config.toml >
// [auth.email.template.confirmation]). El botón/fallback usan el
// placeholder ACTION_URL en vez de una URL real — el script de build lo
// sustituye por `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup`,
// sintaxis de Go template que Supabase resuelve al enviar, no algo que
// React pueda producir. Composición: Shell · Header/labelled · Title ·
// Body · Button · Fallback · Callout(neutro, caducidad) ·
// Banderola · Footer(transaccional).
const ACTION_URL = "__SUPABASE_ACTION_URL__";

export function VerificationEmail() {
  return (
    <EmailShell preview="Confirma tu correo para activar tu cuenta en BeWay.">
      <Header label="Cuenta" />
      <TextBlock title="Confirma tu correo para activar tu cuenta">
        <BodyText last>
          Estás a un paso de entrar al ecosistema BeWay. Confirma tu correo para activar tu cuenta y empezar tu CV
          Vivo.
        </BodyText>
      </TextBlock>
      <EmailButton href={ACTION_URL} label="Confirmar mi correo" />
      <Fallback url={ACTION_URL} />
      <Callout tone="neutral">
        Este enlace caduca en 24 horas. Si expira, puedes solicitar uno nuevo desde la pantalla de registro.
      </Callout>
      <Banderola />
      <Footer category="transactional" />
    </EmailShell>
  );
}

export default VerificationEmail;
