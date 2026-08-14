import { z } from "zod";

// Nueva contraseña tras un enlace de recuperación válido. Sin "confirmar
// contraseña" — mismo criterio que registroSchema: el show/hide de
// PasswordField cumple ese rol.
export const restablecerPasswordSchema = z.object({
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
});

export type RestablecerPasswordInput = z.infer<typeof restablecerPasswordSchema>;
