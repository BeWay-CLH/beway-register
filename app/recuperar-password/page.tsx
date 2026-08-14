import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RecuperarPasswordForm } from "@/components/forms/RecuperarPasswordForm";
import { BrandPanel } from "@/components/forms/BrandPanel";

export default async function RecuperarPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Ya con sesión: no tiene sentido pedir recuperar una contraseña que ya
  // no necesitas para entrar.
  if (user) redirect("/cv-vivo");

  return (
    <main className="flex flex-1 flex-col md:grid md:grid-cols-[46fr_54fr]">
      <BrandPanel eyebrow="Acceso" title="Retoma el control de tu cuenta" showStats={false} />

      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 md:px-12 md:py-16">
        <RecuperarPasswordForm />
      </div>
    </main>
  );
}
