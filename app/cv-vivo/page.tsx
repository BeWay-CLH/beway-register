import { redirect } from "next/navigation";
import { getWizardContext } from "@/lib/cv-vivo/get-current-profile";
import { getWizardProgress } from "@/lib/cv-vivo/progress";

// Entrada al wizard del CV Vivo (Paso 2). Sin UI propia: siempre redirige a
// la primera etapa incompleta, así "/cv-vivo" es un enlace estable para
// retomar el progreso ("guardar y continuar" — CLAUDE.md > UX del wizard).
export default async function CvVivoIndexPage() {
  const context = await getWizardContext();
  if (!context) redirect("/registro");

  const progress = getWizardProgress(context);
  redirect(`/cv-vivo/${progress.nextIncompleteSlug}`);
}
