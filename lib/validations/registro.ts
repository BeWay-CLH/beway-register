import { z } from "zod";
import { consentsSchema } from "@/lib/validations/consents";

// Paso 1 del pre-registro (CLAUDE.md > Modelo de datos > profiles): cuenta +
// identidad académica. Universidad y carrera capturadas aquí se pre-cargan
// después en la etapa 4 del CV Vivo, así que se piden ya en este schema.
// Un solo schema, reutilizado en el cliente (react-hook-form) y en la
// Server Action — nunca confiar solo en la validación de cliente.
export const registroSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Ingresa tu nombre completo.")
      .max(200, "El nombre es demasiado largo."),
    email: z.string().trim().toLowerCase().email("Ingresa un correo válido."),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres."),
    confirmPassword: z.string(),
    countryId: z.string().length(2, "Selecciona tu país."),
    universityId: z.coerce
      .number()
      .int()
      .positive("Selecciona tu universidad."),
    studyFieldId: z.coerce.number().int().positive("Selecciona tu carrera."),
    referralSourceId: z.coerce
      .number()
      .int()
      .positive("Cuéntanos cómo te enteraste de BeWay."),
    turnstileToken: z.string().min(1, "Verificación anti-bot pendiente."),
  })
  .extend(consentsSchema.shape)
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export type RegistroInput = z.infer<typeof registroSchema>;
