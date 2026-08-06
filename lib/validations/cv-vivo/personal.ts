import { z } from "zod";

// Etapa 2 — información personal (CLAUDE.md > Modelo de datos > profiles).
// El teléfono es opcional (columna nullable); la situación académica es el
// campo que define si la etapa cuenta como completa (ver lib/cv-vivo/stages.ts).
export const personalSchema = z.object({
  phone: z
    .string()
    .trim()
    .max(30, "Número demasiado largo.")
    .transform((value) => (value.length > 0 ? value : null)),
  academicStatusId: z.coerce.number().int().positive("Selecciona tu situación académica."),
});

export type PersonalInput = z.infer<typeof personalSchema>;
