import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/forms/LoginForm";
import { Logo } from "@/components/ui/Logo";
import { SectionLabel } from "@/components/ui/SectionLabel";

export default async function IniciarSesionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Ya con sesión: no tiene sentido volver a mostrar el formulario de login.
  if (user) redirect("/cv-vivo");

  return (
    <main className="flex flex-1 flex-col md:flex-row">
      <div className="flex flex-col gap-6 bg-brand-gradient px-6 py-12 text-text-on-inverse md:w-1/2 md:justify-center md:px-16 md:py-24">
        <Logo height={72} className="mx-auto md:mx-0" />
        <div className="flex flex-col gap-4 text-center md:text-left">
          <SectionLabel onInverse align="center" className="mx-auto md:mx-0 md:items-start">
            Bienvenido de vuelta
          </SectionLabel>
          <h1 className="font-heading text-h1 text-white">Tu progreso te está esperando</h1>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 md:px-16 md:py-24">
        <LoginForm />
      </div>
    </main>
  );
}
