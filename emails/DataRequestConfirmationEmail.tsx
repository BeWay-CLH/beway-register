import { EmailShell, Header, Banderola, Footer, TextBlock, BodyText, DataList, Callout } from "./components";

type DataRequestConfirmationEmailProps = {
  action: "export" | "deletion";
  requestedAt: string;
  timezoneLabel?: string;
};

const COPY = {
  export: {
    headerLabel: "Datos",
    title: "Tu solicitud de exportar tus datos fue procesada",
    intro: "Descargaste una copia de toda la información que registraste en tu CV Vivo, en formato JSON.",
    requestLabel: "Exportación de datos",
    retentionNote:
      "Esta copia es tuya — BeWay conserva tus datos originales según los plazos de retención vigentes (ver Política de Privacidad).",
  },
  deletion: {
    headerLabel: "Cuenta",
    title: "Tu solicitud de eliminar tu cuenta fue procesada",
    intro: "Tu cuenta y todo tu CV Vivo (educación, experiencia, proyectos, habilidades y evidencias) fueron eliminados de BeWay.",
    requestLabel: "Eliminación de cuenta",
    retentionNote:
      "Se eliminó todo salvo lo que la ley nos obliga a conservar por un periodo limitado (ej. registros contables/fiscales, si aplica) — nunca datos de tu perfil o CV Vivo.",
  },
} as const;

// docs/email-strategy.md > correo #8 (Confirmación de exportación/
// eliminación de datos, Art. 15/17 RGPD). Inmediato al usar esas
// funciones — ver app/cuenta/actions.ts. Composición: Shell ·
// Header/labelled · Title · Body · DataList · Callout(neutro, retención
// legal) · Banderola · Footer(transaccional).
export function DataRequestConfirmationEmail({ action, requestedAt, timezoneLabel = "CET" }: DataRequestConfirmationEmailProps) {
  const copy = COPY[action];
  const formattedDate = new Date(requestedAt).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <EmailShell preview={copy.title}>
      <Header label={copy.headerLabel} />
      <TextBlock title={copy.title}>
        <BodyText last>{copy.intro}</BodyText>
      </TextBlock>
      <DataList
        rows={[
          { label: "Solicitud", value: copy.requestLabel },
          { label: "Fecha y hora", value: `${formattedDate} ${timezoneLabel}` },
          { label: "Estado", value: "Procesada", valueColor: "#0FA97F" },
        ]}
      />
      <Callout tone="neutral">{copy.retentionNote}</Callout>
      <Banderola />
      <Footer category="transactional" />
    </EmailShell>
  );
}

DataRequestConfirmationEmail.PreviewProps = {
  action: "export",
  requestedAt: "2026-08-13T10:24:00.000Z",
} satisfies DataRequestConfirmationEmailProps;

export default DataRequestConfirmationEmail;
