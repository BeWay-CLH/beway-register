-- Etapa 2 (Personal): el teléfono pasa de un campo de texto libre a un
-- componente con selector de prefijo por país + número local, para evitar
-- errores de formato y homogeneizar el dato entre países.
alter table public.profiles
  add column phone_country_id text references public.countries (id);
