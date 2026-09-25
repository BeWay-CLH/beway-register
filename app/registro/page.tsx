import { redirect } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCatalog } from "@/lib/catalogs";
import { RegistroForm } from "@/components/forms/RegistroForm";
import { BrandPanel } from "@/components/forms/BrandPanel";
import { MiniSteps } from "@/components/forms/MiniSteps";
import { Footer } from "@/components/layout/Footer";

const BENEFITS = [
  "Construye tu CV Vivo antes del lanzamiento",
  "Convierte proyectos, habilidades y resultados en evidencia",
  "Avanza por etapas y continúa cuando quieras",
];

type RegistroPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function RegistroPage({ searchParams }: RegistroPageProps) {
  const supabase = await createClient();
  const [
    {
      data: { user },
    },
    { error },
    countries,
    studyFields,
    referralSources,
  ] = await Promise.all([
    supabase.auth.getUser(),
    searchParams,
    getCatalog("countries"),
    getCatalog("study_fields"),
    getCatalog("referral_sources"),
  ]);

  // Ya con sesión: no tiene sentido volver a mostrar el formulario de alta.
  if (user) redirect("/cv-vivo");

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 flex-col md:grid md:grid-cols-[46fr_54fr]">
        <BrandPanel eyebrow="Únete" title="Tu talento, listo desde el primer momento">
          <ul className="flex flex-col gap-3">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start justify-center gap-3 md:justify-start">
                <span className="mt-0.5 shrink-0 text-brand-cyan">
                  <CheckCircle size={20} />
                </span>
                <span className="text-left font-body text-body text-white/90">{benefit}</span>
              </li>
            ))}
          </ul>
        </BrandPanel>

        <div className="flex flex-1 flex-col items-center gap-4 px-6 py-12 md:px-12 md:py-16">
          <div className="flex w-full max-w-[560px] flex-col gap-4">
            <MiniSteps current={0} />

            {error === "confirmation_failed" && (
              <p
                role="alert"
                className="w-full rounded-md border border-status-danger/40 bg-status-danger/10 px-4 py-3 text-center font-body text-small text-status-danger"
              >
                Tu enlace de confirmación expiró o ya se usó. Vuelve a crear tu cuenta para recibir uno nuevo.
              </p>
            )}

            <RegistroForm
              countries={countries.map((c) => ({ value: c.id, label: c.name }))}
              studyFields={studyFields.map((s) => ({ value: s.id, label: s.name }))}
              referralSources={referralSources.map((r) => ({ value: r.id, label: r.name }))}
            />

            <p className="text-center font-body text-[12px] text-text-muted">
              Al continuar entras en el Pre-Registro: podrás completar tu CV Vivo por etapas y guardarlo cuando
              quieras.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
