import { z } from "zod";

// Solicitud de recuperación de contraseña: solo el correo. El mensaje de
// éxito es genérico independientemente de si la cuenta existe (ver
// app/recuperar-password/actions.ts) — no confirmar ni negar qué correos
// están registrados.
export const recuperarPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Ingresa un correo válido."),
});

export type RecuperarPasswordInput = z.infer<typeof recuperarPasswordSchema>;
