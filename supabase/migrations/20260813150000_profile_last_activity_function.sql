-- Última actividad de un perfil en el wizard, para los correos #3/#4/#5
-- (docs/email-strategy.md > recordatorios por inactividad). profiles.updated_at
-- por sí solo NO sirve: las etapas 4-10 escriben en tablas hijas
-- (education, experiences...), nunca en profiles, así que un usuario
-- activo en esas etapas parecería inactivo si solo mirásemos profiles.
-- skills/languages/evidences no tienen updated_at (solo se agregan o se
-- borran, nunca se editan) — created_at es su señal de "última actividad"
-- correcta ahí.
create function public.get_profile_last_activity(p_profile_id uuid)
returns timestamptz
language sql
security invoker
stable
set search_path = ''
as $$
  select greatest(
    (select updated_at from public.profiles where id = p_profile_id),
    (select max(updated_at) from public.education where profile_id = p_profile_id),
    (select max(updated_at) from public.experiences where profile_id = p_profile_id),
    (select max(updated_at) from public.projects where profile_id = p_profile_id),
    (select max(updated_at) from public.certifications where profile_id = p_profile_id),
    (select max(created_at) from public.skills where profile_id = p_profile_id),
    (select max(created_at) from public.languages where profile_id = p_profile_id),
    (select max(created_at) from public.evidences where profile_id = p_profile_id),
    (select updated_at from public.preferences where profile_id = p_profile_id),
    (select updated_at from public.privacy_settings where profile_id = p_profile_id)
  );
$$;

-- Lo llama el job de recordatorios (app/api/cron/email-reminders) vía
-- service role, y en teoría podría llamarlo un usuario autenticado sobre
-- su propio perfil — RLS en cada tabla referenciada sigue aplicando igual
-- que en get_wizard_progress, así que nunca expone actividad ajena.
revoke execute on function public.get_profile_last_activity(uuid) from public;
grant execute on function public.get_profile_last_activity(uuid) to authenticated, service_role;
