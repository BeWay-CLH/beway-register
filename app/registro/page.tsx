import { CheckCircle } from "lucide-react";
import { getCatalog } from "@/lib/catalogs";
import { RegistroForm } from "@/components/forms/RegistroForm";
import { Logo } from "@/components/ui/Logo";
import { SectionLabel } from "@/components/ui/SectionLabel";

const BENEFITS = [
  "Acceso anticipado cuando lancemos la plataforma",
  "Tu CV Vivo, listo para compartir con empresas del ecosistema",
  "Guardas tu progreso y lo completas cuando quieras",
];

type RegistroPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function RegistroPage({ searchParams }: RegistroPageProps) {
  const [{ error }, countries, universities, studyFields, referralSources] = await Promise.all([
    searchParams,
    getCatalog("countries"),
    getCatalog("universities"),
    getCatalog("study_fields"),
    getCatalog("referral_sources"),
  ]);

  return (
    <main className="flex flex-1 flex-col md:flex-row">
      <div className="flex flex-col gap-6 bg-brand-gradient px-6 py-12 text-text-on-inverse md:w-1/2 md:justify-center md:px-16 md:py-24">
        <Logo height={72} className="mx-auto md:mx-0" />
        <div className="flex flex-col gap-4 text-center md:text-left">
          <SectionLabel onInverse align="center" className="mx-auto md:mx-0 md:items-start">
            Únete
          </SectionLabel>
          <h1 className="font-heading text-h1 text-white">
            Tu perfil, visible para todo el ecosistema BeWay
          </h1>
        </div>
        <ul className="flex flex-col gap-4">
          {BENEFITS.map((benefit) => (
            <li key={benefit} className="flex items-center gap-3">
              <span className="text-brand-cyan">
                <CheckCircle size={20} />
              </span>
              <span className="font-body text-body text-white/85">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-1 flex-col items-center gap-4 px-6 py-12 md:px-16 md:py-24">
        {error === "confirmation_failed" && (
          <p
            role="alert"
            className="w-full max-w-md rounded-md border border-status-danger/40 bg-status-danger/10 px-4 py-3 text-center font-body text-small text-status-danger"
          >
            Tu enlace de confirmación expiró o ya se usó. Vuelve a crear tu cuenta para recibir uno nuevo.
          </p>
        )}
        <RegistroForm
          countries={countries.map((c) => ({ value: c.id, label: c.name }))}
          universities={universities.map((u) => ({ value: u.id, label: u.name }))}
          studyFields={studyFields.map((s) => ({ value: s.id, label: s.name }))}
          referralSources={referralSources.map((r) => ({ value: r.id, label: r.name }))}
        />
      </div>
    </main>
  );
}
