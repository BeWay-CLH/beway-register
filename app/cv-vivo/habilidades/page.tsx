import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/cv-vivo/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { getCatalog } from "@/lib/catalogs";
import { HabilidadesForm, type SkillItem, type LanguageItem } from "@/components/forms/HabilidadesForm";
import { StageShell } from "@/components/cv-vivo/StageShell";

export default async function HabilidadesPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/iniciar-sesion");

  const supabase = await createClient();
  const [{ data: skillRows }, { data: languageRows }, languagesCatalog, proficiencyLevels] = await Promise.all([
    supabase.from("skills").select("*").eq("profile_id", profile.id).order("created_at", { ascending: true }),
    supabase.from("languages").select("*").eq("profile_id", profile.id).order("created_at", { ascending: true }),
    getCatalog("languages_catalog"),
    getCatalog("proficiency_levels"),
  ]);

  const skills: SkillItem[] = (skillRows ?? []).map((row) => ({ id: row.id, name: row.name }));
  const languages: LanguageItem[] = (languageRows ?? []).map((row) => ({
    id: row.id,
    languageId: row.language_id,
    proficiencyLevelId: row.proficiency_level_id,
  }));

  return (
    <StageShell
      slug="habilidades"
      title="Habilidades e idiomas"
      description="Así las empresas encuentran tu perfil cuando buscan por habilidad o idioma. Sin límite de cantidad."
      whyText="Las empresas buscan candidatos por habilidades e idiomas específicos. Esto ayuda a emparejarlas mejor contigo y a mejorar tu visibilidad en búsquedas."
    >
      <HabilidadesForm
        skills={skills}
        languages={languages}
        languageOptions={languagesCatalog.map((l) => ({ value: l.id, label: l.name }))}
        proficiencyOptions={proficiencyLevels.map((p) => ({ value: p.id, label: p.name }))}
      />
    </StageShell>
  );
}
