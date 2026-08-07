import { z } from "zod";
import { optionalText, optionalUrl } from "@/lib/validations/shared";

// Etapa 6 — un proyecto o actividad (CLAUDE.md > Modelo de datos >
// projects). Máx. 3 por perfil, igual que experiences. A diferencia de
// education/experiences, projects no tiene is_current — solo fechas
// sueltas, ambas opcionales.
export const projectEntrySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, "Ingresa el nombre del proyecto.").max(150, "Máximo 150 caracteres."),
  projectTypeId: z.coerce.number().int().positive("Selecciona el tipo de proyecto."),
  url: optionalUrl(300),
  startDate: optionalText(20),
  endDate: optionalText(20),
  description: optionalText(500, "Máximo 500 caracteres."),
});

export type ProjectEntryInput = z.infer<typeof projectEntrySchema>;
