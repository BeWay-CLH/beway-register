import { redirect } from "next/navigation";
import { getWizardContext } from "@/lib/cv-vivo/get-current-profile";
import { getWizardProgress } from "@/lib/cv-vivo/progress";
import { WizardChrome } from "@/components/cv-vivo/WizardChrome";

// Shell del wizard del CV Vivo (Paso 2, etapas 2-11 — CLAUDE.md > Estructura
// de carpetas). Protege todas las sub-rutas: sin sesión no hay perfil que
// editar. No existe una ruta /login separada todavía — el único punto de
// entrada de auth es /registro (crea la cuenta y, si no requiere
// confirmación de email, ya deja sesión iniciada).
export default async function CvVivoLayout({ children }: { children: React.ReactNode }) {
  const context = await getWizardContext();

  if (!context) {
    redirect("/registro");
  }

  const progress = getWizardProgress(context);

  return <WizardChrome progress={progress}>{children}</WizardChrome>;
}
