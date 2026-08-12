import { z } from "zod";

// Inicio de sesión con credenciales ya existentes (distinto de registroSchema
// — sin datos de perfil, solo lo que pide supabase.auth.signInWithPassword).
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Ingresa un correo válido."),
  password: z.string().min(1, "Ingresa tu contraseña."),
});

export type LoginInput = z.infer<typeof loginSchema>;
