import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { RightsRequestForm } from "@/components/forms/RightsRequestForm";

export const metadata: Metadata = { title: "Ejercer mis derechos — BeWay" };

export default function DerechosPage() {
  return (
    <LegalPageShell title="Ejercer mis derechos">
      <p className="font-body text-body leading-relaxed text-text-muted">
        Puedes solicitar acceso, rectificación, supresión, limitación, oposición y, cuando corresponda,
        portabilidad de tus datos. También puedes retirar los consentimientos que hayas otorgado. Utiliza
        preferentemente el mismo correo con el que te registraste. Si tenemos dudas razonables sobre tu identidad,
        podremos pedir información adicional de forma proporcionada.
      </p>
      <div className="mt-6">
        <RightsRequestForm />
      </div>
    </LegalPageShell>
  );
}
