import { UnsubscribeConfirmForm } from "@/components/forms/UnsubscribeConfirmForm";
import { Card } from "@/components/ui/Card";

type UnsubscribePageProps = {
  searchParams: Promise<{ token?: string }>;
};

// Destino de "Darme de baja" en el footer de los correos de comunicación
// (#3/#4/#5/#7) — sin sesión, la única prueba de identidad es
// profiles.unsubscribe_token en el enlace (ver lib/email/unsubscribe.ts).
// La baja real se confirma con un clic humano en UnsubscribeConfirmForm,
// que es quien valida el token contra la base de datos.
export default async function UnsubscribePage({ searchParams }: UnsubscribePageProps) {
  const { token } = await searchParams;

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      {token ? (
        <UnsubscribeConfirmForm token={token} />
      ) : (
        <Card elevation="md" className="w-full max-w-[480px] text-center">
          <h2 className="font-heading text-h2 text-brand-dark">Enlace no válido</h2>
          <p className="mt-3 font-body text-body text-text-muted">
            Este enlace de baja no es válido o ya expiró. Si quieres dejar de recibir correos de BeWay, escríbenos a{" "}
            <a href="mailto:team@clhglobal.org" className="font-semibold text-link hover:text-link-hover hover:underline">
              team@clhglobal.org
            </a>
            .
          </p>
        </Card>
      )}
    </main>
  );
}
