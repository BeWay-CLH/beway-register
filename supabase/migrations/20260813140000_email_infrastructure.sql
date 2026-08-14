-- Infraestructura de correos (docs/email-strategy.md). Dos piezas:
--
-- 1. profiles.cv_completed_at — marca cuándo el perfil llegó al 100% de
--    completitud por primera vez. Gatea el correo #6 ("100% completado")
--    para que se envíe una sola vez incluso si el usuario edita etapas ya
--    completas después (lo que no debería volver a bajar el % a menos de
--    100, pero el guard es explícito en vez de asumirlo).
--
-- 2. email_log — idempotencia de los correos #3/#4/#5 (recordatorios por
--    inactividad, disparados por un job programado sin evento único que
--    los dispare) y #7 (broadcast, filtrado por marketing_consent). Sin
--    esta tabla, un cron que corre a diario reenviaría el mismo aviso cada
--    vez que encuentra al usuario todavía dentro del umbral.
--
-- dedupe_key permite reutilizar el mismo email_type para envíos que sí
-- deben repetirse por evento distinto (ej. cada broadcast de #7 usa su
-- propio slug/fecha como dedupe_key); los recordatorios de inactividad
-- (#3/#4/#5) dejan dedupe_key en '' porque cada uno se envía una sola vez
-- por perfil, nunca de nuevo.

alter table public.profiles add column cv_completed_at timestamptz;

create table public.email_log (
  id bigint generated always as identity primary key,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  email_type text not null,
  dedupe_key text not null default '',
  sent_at timestamptz not null default now()
);

create unique index email_log_dedupe_idx on public.email_log (profile_id, email_type, dedupe_key);
create index email_log_profile_id_idx on public.email_log (profile_id);

alter table public.email_log enable row level security;

-- Solo el backend (service role, ver lib/email/send.ts) escribe y
-- consulta este registro — es bookkeeping interno de envíos, no un dato
-- del perfil que el usuario necesite ver. A propósito no se crea ninguna
-- policy para `anon`/`authenticated`, así que RLS deniega todo acceso
-- salvo el service role (que bypassea RLS).
grant select, insert on table public.email_log to service_role;
