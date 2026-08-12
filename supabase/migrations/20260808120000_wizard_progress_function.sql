-- Colapsa las 9 consultas de conteo que lib/cv-vivo/get-current-profile.ts
-- hacía por separado (una por tabla del wizard) en una sola ida y vuelta a
-- Postgres. security invoker (el default, explícito aquí) + RLS en cada
-- tabla referenciada garantizan que un usuario nunca puede leer el
-- progreso de otro perfil aunque pase un profile_id ajeno: RLS filtra por
-- auth.uid() independientemente del parámetro, así que exists() da false
-- para cualquier perfil que no sea el propio.
create function public.get_wizard_progress(p_profile_id uuid)
returns table (
  has_education boolean,
  has_experience boolean,
  has_projects boolean,
  has_skills boolean,
  has_languages boolean,
  has_certifications boolean,
  has_preferences boolean,
  has_evidences boolean,
  has_privacy_settings boolean
)
language sql
security invoker
stable
set search_path = ''
as $$
  select
    exists(select 1 from public.education where profile_id = p_profile_id),
    exists(select 1 from public.experiences where profile_id = p_profile_id),
    exists(select 1 from public.projects where profile_id = p_profile_id),
    exists(select 1 from public.skills where profile_id = p_profile_id),
    exists(select 1 from public.languages where profile_id = p_profile_id),
    exists(select 1 from public.certifications where profile_id = p_profile_id),
    exists(
      select 1 from public.preferences
      where profile_id = p_profile_id and availability_option_id is not null
    ),
    exists(select 1 from public.evidences where profile_id = p_profile_id),
    exists(select 1 from public.privacy_settings where profile_id = p_profile_id);
$$;

-- Ejecutable solo por usuarios autenticados, no por anon ni por PUBLIC.
revoke execute on function public.get_wizard_progress(uuid) from public;
grant execute on function public.get_wizard_progress(uuid) to authenticated;
