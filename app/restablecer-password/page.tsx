import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RestablecerPasswordForm } from "@/components/forms/RestablecerPasswordForm";
import { BrandPanel } from "@/components/forms/BrandPanel";

// Destino final del correo #9 (recuperación de contraseña): llega vía
// /auth/confirm?type=recovery&next=/restablecer-password tras verificar el
// token, que ya deja una sesión activa — sin ella no hay forma válida de
// llegar acá, así que se trata igual que cualquier página protegida.
export default async function RestablecerPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/recuperar-password");

  return (
    <main className="flex flex-1 flex-col md:grid md:grid-cols-[46fr_54fr]">
      <BrandPanel eyebrow="Casi listo" title="Una contraseña nueva y sigues donde quedaste" showStats={false} />

      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 md:px-12 md:py-16">
        <RestablecerPasswordForm />
      </div>
    </main>
  );
}
