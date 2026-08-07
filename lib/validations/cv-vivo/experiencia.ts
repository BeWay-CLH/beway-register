import { z } from "zod";
import { optionalText } from "@/lib/validations/shared";

// Etapa 5 — una entrada de experiencia (CLAUDE.md > Modelo de datos >
// experiences). Máx. 3 por perfil — lo aplica un trigger de Postgres
// (enforce_max_entries_per_profile); el formulario también lo bloquea del
// lado del cliente para no depender solo del error de la base.
export const experienceEntrySchema = z.object({
  id: z.string().uuid().optional(),
  companyName: z.string().trim().min(1, "Ingresa el nombre de la empresa.").max(150, "Máximo 150 caracteres."),
  roleTitle: z.string().trim().min(1, "Ingresa tu puesto.").max(150, "Máximo 150 caracteres."),
  experienceTypeId: z.coerce.number().int().positive("Selecciona el tipo de experiencia."),
  sectorId: z.coerce
    .number()
    .int()
    .nullable()
    .transform((value) => (value && value > 0 ? value : null)),
  startDate: z.string().trim().min(1, "Ingresa la fecha de inicio."),
  endDate: optionalText(20),
  isCurrent: z.boolean(),
  description: optionalText(500, "Máximo 500 caracteres."),
});

export type ExperienceEntryInput = z.infer<typeof experienceEntrySchema>;
