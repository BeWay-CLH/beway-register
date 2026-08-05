import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function LandingPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-brand-gradient px-6 py-24 text-center text-brand-light">
      <Logo height={96} />
      <p className="max-w-md font-body text-body text-brand-light/90">
        Conectamos talento, impulsamos la innovación, generamos oportunidades,
        construimos el futuro.
      </p>
      <Link
        href="/registro"
        className="inline-flex h-control-lg items-center justify-center rounded-md bg-action-primary px-5 font-body text-body font-semibold text-text-on-accent tracking-tight transition-all duration-fast ease-standard hover:bg-brand-cyan-300 hover:shadow-glow"
      >
        Pre-regístrate
      </Link>
    </main>
  );
}
