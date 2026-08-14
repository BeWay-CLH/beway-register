import { EmailShell, Header, Banderola, Footer, TextBlock, BodyText, EmailButton, Fallback, Callout } from "./components";

// docs/email-strategy.md > correo #9 (Recuperación de contraseña). Igual
// que VerificationEmail: fuente para la plantilla "Reset Password" de
// Supabase Auth (ver scripts/build-auth-email-templates.mjs y
// supabase/config.toml > [auth.email.template.recovery]). ACTION_URL se
// sustituye por `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/restablecer-password`.
// Composición: Shell · Header/labelled · Title · Body · Button ·
// Fallback · Callout(neutro, caducidad) · Banderola · Footer(transaccional).
const ACTION_URL = "__SUPABASE_ACTION_URL__";

export function PasswordRecoveryEmail() {
  return (
    <EmailShell preview="Restablece tu contraseña de BeWay.">
      <Header label="Cuenta" />
      <TextBlock title="Restablece tu contraseña">
        <BodyText last>
          Recibimos una solicitud para restablecer la contraseña de tu cuenta en BeWay. Si no fuiste tú, puedes
          ignorar este correo — tu contraseña actual sigue funcionando.
        </BodyText>
      </TextBlock>
      <EmailButton href={ACTION_URL} label="Crear nueva contraseña" />
      <Fallback url={ACTION_URL} />
      <Callout tone="neutral">
        Este enlace caduca en 24 horas. Si expira, puedes solicitar uno nuevo desde la pantalla de acceso.
      </Callout>
      <Banderola />
      <Footer category="transactional" />
    </EmailShell>
  );
}

export default PasswordRecoveryEmail;
