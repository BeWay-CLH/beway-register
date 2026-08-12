import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/cv-vivo/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { getCatalog } from "@/lib/catalogs";
import { CertificacionesForm, type CertificationEntry } from "@/components/forms/CertificacionesForm";
import { StageShell } from "@/components/cv-vivo/StageShell";

export default async function CertificacionesPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/iniciar-sesion");

  const supabase = await createClient();
  const [{ data: rows }, certificationTypes] = await Promise.all([
    supabase
      .from("certifications")
      .select("*")
      .eq("profile_id", profile.id)
      .order("created_at", { ascending: true }),
    getCatalog("certification_types"),
  ]);

  const entries: CertificationEntry[] = (rows ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    certificationTypeId: row.certification_type_id,
    institution: row.institution,
    issueDate: row.issue_date,
    credentialUrl: row.credential_url,
  }));

  return (
    <StageShell
      slug="certificaciones"
      title="Formación complementaria"
      description="Suma valor a tu perfil con formación adicional. Hasta 3 cursos, certificaciones, bootcamps o talleres."
      whyText="Las certificaciones y cursos complementarios demuestran tu iniciativa para aprender más allá de tu formación académica. Esto puede ser un diferencial importante para empresas que buscan candidatos comprometidos con el crecimiento continuo."
    >
      <CertificacionesForm
        entries={entries}
        certificationTypes={certificationTypes.map((t) => ({ value: t.id, label: t.name }))}
      />
    </StageShell>
  );
}
