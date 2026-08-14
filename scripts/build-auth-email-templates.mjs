// Genera supabase/templates/{confirmation,recovery}.html a partir de
// emails/VerificationEmail.tsx y emails/PasswordRecoveryEmail.tsx
// (docs/email-strategy.md > correos #1 y #9). Estos dos correos los
// envía Supabase Auth directamente (no Resend vía lib/email/send.tsx),
// así que su HTML final tiene que vivir como plantilla estática que
// Supabase sirve — pero seguimos escribiendo el DISEÑO en React/JSX como
// el resto de los correos (menos duplicación, misma librería de
// componentes) y solo compilamos a HTML acá.
//
// El placeholder __SUPABASE_ACTION_URL__ (ver esos dos archivos) se
// sustituye por la sintaxis de Go template que Supabase resuelve al
// enviar — no algo que React pueda producir directamente.
//
// Por qué un directorio temporal con solo estos dos archivos: `email
// export` renderiza TODO lo que encuentra en --dir, y plantillas como
// PlatformUpdateEmail.tsx requieren props reales (no tienen valores por
// defecto) — exportar el directorio emails/ completo falla apenas llega a
// esa, aunque los dos archivos que sí necesitamos ya se hayan renderizado
// bien. Aislar solo estos dos (+ components/) evita depender de que el
// resto de las plantillas también toleren un render sin props.
//
// Uso: node scripts/build-auth-email-templates.mjs
// (o `npm run email:build-auth`). Requiere haber corrido `npm install`
// (usa el CLI de react-email, ya en devDependencies).

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, rmSync, mkdirSync, existsSync, cpSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Estos dos HTML quedan estáticos en supabase/templates/ — a diferencia
// del resto de la app, no se vuelven a renderizar por request, así que no
// pueden depender del NEXT_PUBLIC_SITE_URL de quien corra este script
// (típicamente localhost en una máquina de desarrollo). Se fija acá al
// dominio real y verificado (bbeway.com) para que las imágenes del correo
// (logo del header/footer) siempre apunten a una URL pública real.
process.env.NEXT_PUBLIC_SITE_URL = "https://bbeway.com";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const emailsDir = join(projectRoot, "emails");
const tmpSourceDir = join(projectRoot, ".tmp-auth-email-src");
const tmpExportDir = join(projectRoot, ".tmp-auth-email-export");
const templatesDir = join(projectRoot, "supabase", "templates");

const PLACEHOLDER = "__SUPABASE_ACTION_URL__";

const TARGETS = [
  {
    source: "VerificationEmail.html",
    output: "confirmation.html",
    actionUrl: "{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup",
  },
  {
    source: "PasswordRecoveryEmail.html",
    output: "recovery.html",
    actionUrl: "{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/restablecer-password",
  },
];

for (const dir of [tmpSourceDir, tmpExportDir]) {
  if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
}

mkdirSync(tmpSourceDir, { recursive: true });
cpSync(join(emailsDir, "components"), join(tmpSourceDir, "components"), { recursive: true });
for (const target of TARGETS) {
  const fileName = target.source.replace(/\.html$/, ".tsx");
  cpSync(join(emailsDir, fileName), join(tmpSourceDir, fileName));
}

console.log("Exportando plantillas de correo (react-email)...");
// shell:true es necesario en Windows para invocar el binario .cmd de
// react-email — sin riesgo de inyección acá, todos los argumentos son
// rutas construidas con join()/import.meta.url, nunca entrada externa.
execFileSync("npx", ["email", "export", "--dir", tmpSourceDir, "--outDir", tmpExportDir], {
  cwd: projectRoot,
  stdio: "inherit",
  shell: true,
});

if (!existsSync(templatesDir)) mkdirSync(templatesDir, { recursive: true });

for (const target of TARGETS) {
  const sourcePath = join(tmpExportDir, target.source);
  const html = readFileSync(sourcePath, "utf8");
  const replaced = html.split(PLACEHOLDER).join(target.actionUrl);

  if (replaced === html) {
    throw new Error(`${target.source}: no se encontró el placeholder ${PLACEHOLDER} — revisa el template.`);
  }

  const outputPath = join(templatesDir, target.output);
  writeFileSync(outputPath, replaced, "utf8");
  console.log(`✔ supabase/templates/${target.output}`);
}

rmSync(tmpSourceDir, { recursive: true, force: true });
rmSync(tmpExportDir, { recursive: true, force: true });
console.log("Listo. Recuerda: supabase/config.toml > [auth.email.template.*] ya apunta a estos archivos.");
