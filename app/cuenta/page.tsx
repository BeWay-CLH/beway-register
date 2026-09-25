import { redirect } from "next/navigation";
import { getWizardContext } from "@/lib/cv-vivo/get-current-profile";
import { getWizardProgress } from "@/lib/cv-vivo/progress";
import { createClient } from "@/lib/supabase/server";
import {
  IdentityPanel,
  VideoPitchPanel,
  CVPanel,
  SkillsPanel,
  CertificationsPanel,
  ProofPanel,
  AIRecommendationPanel,
  ActivityPanel,
} from "@/components/cv-vivo/PerfilPanels";
import { CuentaActions } from "@/components/forms/CuentaActions";
import { Card } from "@/components/ui/Card";

// "Mi perfil y CV" (BeWay Design System > ui_kits/platform/Profile.jsx),
// adaptada a solo-lectura: el dato se edita en su etapa del wizard
// (/cv-vivo/*), acá se muestra tal como lo verán las empresas. Video-pitch,
// recomendación IA y actividad en el ecosistema son de la plataforma final
// (CLAUDE.md > Fuera de alcance) — se muestran con su esqueleto real detrás
// de un aviso, no se eliminan del layout.
export default async function CuentaPage() {
  const context = await getWizardContext();
  if (!context) redirect("/iniciar-sesion");

  const { profile } = context;
  const progress = getWizardProgress(context);
  const memberSince = new Date(profile.created_at).toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

  const supabase = await createClient();
  const [
    { data: identity },
    { data: educationRows },
    { data: experienceRows },
    { data: languageRows },
    { data: skillRows },
    { data: certificationRows },
    { data: projectRows },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("countries!country_id(name), universities(name)")
      .eq("id", profile.id)
      .single(),
    supabase
      .from("education")
      .select("*, universities(name), study_fields(name)")
      .eq("profile_id", profile.id)
      .order("created_at", { ascending: true }),
    supabase.from("experiences").select("*").eq("profile_id", profile.id).order("created_at", { ascending: true }),
    supabase
      .from("languages")
      .select("*, languages_catalog(name), proficiency_levels(name)")
      .eq("profile_id", profile.id)
      .order("created_at", { ascending: true }),
    supabase.from("skills").select("id, name").eq("profile_id", profile.id).order("created_at", { ascending: true }),
    supabase
      .from("certifications")
      .select("*, certification_types(name)")
      .eq("profile_id", profile.id)
      .order("created_at", { ascending: true }),
    supabase
      .from("projects")
      .select("*, project_types(name)")
      .eq("profile_id", profile.id)
      .order("created_at", { ascending: true }),
  ]);

  const education = (educationRows ?? []).map((row) => ({
    id: row.id,
    universityName: row.universities?.name ?? null,
    studyFieldName: row.study_fields?.name ?? null,
    startDate: row.start_date,
    endDate: row.end_date,
    isCurrent: row.is_current,
    description: row.description,
  }));

  const experiences = (experienceRows ?? []).map((row) => ({
    id: row.id,
    roleTitle: row.role_title,
    companyName: row.company_name,
    startDate: row.start_date,
    endDate: row.end_date,
    isCurrent: row.is_current,
    description: row.description,
  }));

  const languages = (languageRows ?? []).map((row) => ({
    id: row.id,
    languageName: row.languages_catalog?.name ?? "Idioma",
    proficiencyName: row.proficiency_levels?.name ?? "",
  }));

  const certifications = (certificationRows ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    institution: row.institution,
    issueDate: row.issue_date,
    typeName: row.certification_types?.name ?? null,
  }));

  const projects = (projectRows ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    url: row.url,
    typeName: row.project_types?.name ?? null,
  }));

  return (
    <main className="flex flex-1 justify-center px-4 py-8 md:px-8 md:py-10">
      <div className="flex w-full max-w-[1200px] flex-col gap-6">
        <div>
          <h1 className="font-heading text-h1 text-brand-dark">Mi perfil y CV</h1>
          <p className="mt-1.5 font-body text-small text-text-muted">
            Así se ve tu CV Vivo para las empresas. Para editarlo, completa las etapas correspondientes.
          </p>
        </div>

        <IdentityPanel
          name={profile.full_name}
          headline={profile.headline}
          countryName={identity?.countries?.name ?? null}
          universityName={identity?.universities?.name ?? null}
        />

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex flex-col gap-6">
            <VideoPitchPanel />
            <CVPanel education={education} experiences={experiences} languages={languages} bio={profile.bio} />
            <SkillsPanel skills={skillRows ?? []} />
            <CertificationsPanel certifications={certifications} />
            <ProofPanel projects={projects} />
          </div>

          <div className="flex flex-col gap-6 lg:sticky lg:top-6">
            <AIRecommendationPanel />
            <ActivityPanel />
            <Card elevation="sm" className="flex flex-col gap-4">
              <div>
                <h2 className="font-heading text-h3 text-text-heading">Tu cuenta</h2>
                <p className="mt-1 font-body text-small text-text-muted">
                  Miembro desde {memberSince} · {progress.percent}% completo
                </p>
              </div>
              <CuentaActions />
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
