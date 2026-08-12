import { z } from "zod";
import { optionalText } from "@/lib/validations/shared";

// Etapa 2 — información personal (CLAUDE.md > Modelo de datos > profiles).
// El teléfono es opcional (columnas nullable): prefijo (FK a countries) +
// número local, capturados por separado en un componente especializado
// (components/forms/PhoneField). La situación académica es el campo que
// define si la etapa cuenta como completa (ver lib/cv-vivo/stages.ts).
export const personalSchema = z.object({
  phoneCountryId: z
    .string()
    .trim()
    .nullable()
    .transform((value) => (value && value.length === 2 ? value.toUpperCase() : null)),
  phone: optionalText(30, "Número demasiado largo."),
  academicStatusId: z.coerce.number().int().positive("Selecciona tu situación académica."),
});

export type PersonalInput = z.infer<typeof personalSchema>;
