import { z } from "zod";
import { optionalText } from "@/lib/validations/shared";

// Etapa 4 — una entrada de educación (CLAUDE.md > Modelo de datos >
// education). Sin límite de cantidad (a diferencia de experiences/
// projects/certifications, que sí topan en 3). `id` presente = editar una
// entrada existente; ausente = crear una nueva.
export const educationEntrySchema = z.object({
  id: z.string().uuid().optional(),
  universityId: z.coerce.number().int().positive("Selecciona tu universidad."),
  studyFieldId: z.coerce.number().int().positive("Selecciona tu carrera."),
  academicStatusId: z.coerce.number().int().positive("Selecciona tu situación académica."),
  startDate: z.string().trim().min(1, "Ingresa la fecha de inicio."),
  endDate: optionalText(20),
  isCurrent: z.boolean(),
  description: optionalText(500, "Máximo 500 caracteres."),
});

export type EducationEntryInput = z.infer<typeof educationEntrySchema>;
