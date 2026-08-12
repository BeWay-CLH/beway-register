import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/ui/Logo";

// Landing pública. Consciente de la sesión (CLAUDE.md > UX del wizard —
// "guardar y continuar"): si ya hay una cuenta con sesión activa, el CTA
// principal retoma el CV Vivo en vez de mandar de nuevo al formulario de
// alta, sin importar si el usuario entra por acá o directo a /cv-vivo.
export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-brand-gradient px-6 py-24 text-center text-brand-light">
      <Logo height={96} />
      <p className="max-w-md font-body text-body text-brand-light/90">
        Conectamos talento, impulsamos la innovación, generamos oportunidades,
        construimos el futuro.
      </p>
      {user ? (
        <Link
          href="/cv-vivo"
          className="inline-flex h-control-lg items-center justify-center rounded-md bg-action-primary px-5 font-body text-body font-semibold text-text-on-accent tracking-tight transition-all duration-fast ease-standard hover:bg-brand-cyan-300 hover:shadow-glow"
        >
          Continuar mi CV Vivo
        </Link>
      ) : (
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/registro"
            className="inline-flex h-control-lg items-center justify-center rounded-md bg-action-primary px-5 font-body text-body font-semibold text-text-on-accent tracking-tight transition-all duration-fast ease-standard hover:bg-brand-cyan-300 hover:shadow-glow"
          >
            Pre-regístrate
          </Link>
          <Link
            href="/iniciar-sesion"
            className="inline-flex h-control-lg items-center justify-center rounded-md border border-white/40 px-5 font-body text-body font-semibold text-white tracking-tight transition-all duration-fast ease-standard hover:bg-white/10"
          >
            Ya tengo cuenta
          </Link>
        </div>
      )}
    </main>
  );
}
