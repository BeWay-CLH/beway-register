import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/forms/LoginForm";
import { BrandPanel } from "@/components/forms/BrandPanel";
import { Footer } from "@/components/layout/Footer";

export default async function IniciarSesionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Ya con sesión: no tiene sentido volver a mostrar el formulario de login.
  if (user) redirect("/cv-vivo");

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 flex-col md:grid md:grid-cols-[46fr_54fr]">
        <BrandPanel eyebrow="Bienvenido de vuelta" title="Tu progreso te está esperando" />

        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 md:px-12 md:py-16">
          <LoginForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
