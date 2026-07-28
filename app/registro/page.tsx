import { getCatalog } from "@/lib/catalogs";
import { RegistroForm } from "@/components/forms/RegistroForm";

export default async function RegistroPage() {
  const [countries, universities, studyFields, referralSources] =
    await Promise.all([
      getCatalog("countries"),
      getCatalog("universities"),
      getCatalog("study_fields"),
      getCatalog("referral_sources"),
    ]);

  return (
    <main className="flex flex-1 flex-col items-center gap-6 px-6 py-16">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-heading text-h1 text-brand-dark">Crea tu cuenta</h1>
        <p className="max-w-md font-body text-body text-brand-gray">
          Paso 1 de tu pre-registro en BeWay. Toma menos de 2 minutos.
        </p>
      </div>
      <RegistroForm
        countries={countries.map((c) => ({ value: c.id, label: c.name }))}
        universities={universities.map((u) => ({ value: u.id, label: u.name }))}
        studyFields={studyFields.map((s) => ({ value: s.id, label: s.name }))}
        referralSources={referralSources.map((r) => ({
          value: r.id,
          label: r.name,
        }))}
      />
    </main>
  );
}
