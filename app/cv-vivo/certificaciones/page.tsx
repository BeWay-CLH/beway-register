import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/cv-vivo/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { getCatalog } from "@/lib/catalogs";
import { CertificacionesForm, type CertificationEntry } from "@/components/forms/CertificacionesForm";
import { SectionLabel } from "@/components/ui/SectionLabel";

export default async function CertificacionesPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/registro");

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
    <div className="flex w-full max-w-md flex-col gap-6">
      <SectionLabel>Etapa 8 de 10</SectionLabel>
      <div>
        <h1 className="font-heading text-h1 text-brand-dark">Formación complementaria</h1>
        <p className="mt-2 font-body text-body text-text-muted">
          Hasta 3 cursos, certificaciones, bootcamps o talleres.
        </p>
      </div>
      <CertificacionesForm
        entries={entries}
        certificationTypes={certificationTypes.map((t) => ({ value: t.id, label: t.name }))}
      />
    </div>
  );
}
