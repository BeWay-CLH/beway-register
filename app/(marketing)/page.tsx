import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-brand-gradient px-6 py-24 text-center text-brand-light">
      <h1 className="font-heading text-display">BeWay</h1>
      <p className="max-w-md font-body text-body text-brand-light/90">
        Conectamos talento, impulsamos la innovación, generamos oportunidades,
        construimos el futuro.
      </p>
      <Link
        href="/registro"
        className="rounded-brand bg-brand-cyan px-6 py-3 font-heading text-h3 text-brand-dark shadow-brand transition-opacity hover:opacity-90"
      >
        Pre-regístrate
      </Link>
    </main>
  );
}
