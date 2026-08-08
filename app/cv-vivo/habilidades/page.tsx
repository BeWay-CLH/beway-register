import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/cv-vivo/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { getCatalog } from "@/lib/catalogs";
import { getStagePosition } from "@/lib/cv-vivo/stages";
import { HabilidadesForm, type SkillItem, type LanguageItem } from "@/components/forms/HabilidadesForm";
import { SectionLabel } from "@/components/ui/SectionLabel";

export default async function HabilidadesPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/registro");

  const { position, total } = getStagePosition("habilidades");
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
    <div className="flex w-full max-w-md flex-col gap-6">
      <SectionLabel>
        Etapa {position} de {total}
      </SectionLabel>
      <div>
        <h1 className="font-heading text-h1 text-brand-dark">Habilidades e idiomas</h1>
        <p className="mt-2 font-body text-body text-text-muted">
          Así las empresas encuentran tu perfil cuando buscan por habilidad o idioma. Sin límite
          de cantidad.
        </p>
      </div>
      <HabilidadesForm
        skills={skills}
        languages={languages}
        languageOptions={languagesCatalog.map((l) => ({ value: l.id, label: l.name }))}
        proficiencyOptions={proficiencyLevels.map((p) => ({ value: p.id, label: p.name }))}
      />
    </div>
  );
}
