import { z } from "zod";

// Etapa 11 — privacidad (CLAUDE.md > Modelo de datos > privacy_settings).
// profile_visibility no viene de un catálogo: es un check constraint fijo
// en la tabla, así que las opciones se definen aquí, no en Postgres.
export const PROFILE_VISIBILITY_VALUES = ["public", "companies_only", "private"] as const;

export const PROFILE_VISIBILITY_OPTIONS: { value: string; label: string }[] = [
  { value: "public", label: "Público — cualquiera puede verlo" },
  { value: "companies_only", label: "Solo empresas del ecosistema BeWay" },
  { value: "private", label: "Privado — nadie puede verlo" },
];

export const privacySettingsSchema = z.object({
  profileVisibility: z.enum(PROFILE_VISIBILITY_VALUES),
  showContactEmail: z.boolean(),
  showContactPhone: z.boolean(),
});

export type PrivacySettingsInput = z.infer<typeof privacySettingsSchema>;
