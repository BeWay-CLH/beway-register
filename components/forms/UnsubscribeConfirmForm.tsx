"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { CheckCircle2, BellOff } from "lucide-react";
import { confirmUnsubscribe } from "@/app/unsubscribe/actions";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type UnsubscribeConfirmFormProps = {
  token: string;
};

// Confirmación explícita antes de mutar (RFC 8058 / buena práctica de
// correo): un GET que da de baja al cargar la página es vulnerable a que
// un escáner de seguridad corporativo (ej. Microsoft Safe Links) precargue
// el enlace del correo y dé de baja a alguien que nunca hizo clic en
// "confirmar". Por eso /unsubscribe solo MUESTRA este botón — la baja
// real ocurre en el Server Action, tras un clic humano.
export function UnsubscribeConfirmForm({ token }: UnsubscribeConfirmFormProps) {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<"idle" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleConfirm() {
    startTransition(async () => {
      const result = await confirmUnsubscribe(token);
      if (result.status === "error") {
        setState("error");
        setErrorMessage(result.message);
        return;
      }
      setState("done");
    });
  }

  if (state === "done") {
    return (
      <Card elevation="md" className="w-full max-w-[480px] text-center">
        <CheckCircle2 size={32} className="mx-auto text-status-success" />
        <h2 className="mt-3 font-heading text-h2 text-brand-dark">Listo, te diste de baja</h2>
        <p className="mt-3 font-body text-body text-text-muted">
          No volverás a recibir correos de novedades de BeWay. Los correos necesarios para tu cuenta (como
          confirmaciones de seguridad) siguen llegando.
        </p>
        <Link href="/" className="mt-4 inline-block font-body text-small font-semibold text-link hover:text-link-hover hover:underline">
          Volver a BeWay
        </Link>
      </Card>
    );
  }

  return (
    <Card elevation="md" className="w-full max-w-[480px] text-center">
      <BellOff size={32} className="mx-auto text-text-muted" />
      <h2 className="mt-3 font-heading text-h2 text-brand-dark">¿Dejar de recibir novedades de BeWay?</h2>
      <p className="mt-3 font-body text-body text-text-muted">
        Seguirás recibiendo los correos necesarios para tu cuenta (verificación, seguridad, confirmaciones), solo se
        detienen las novedades y recordatorios opcionales.
      </p>
      {state === "error" && errorMessage && (
        <p role="alert" className="mt-3 font-body text-small text-status-danger">
          {errorMessage}
        </p>
      )}
      <Button className="mt-5" onClick={handleConfirm} loading={isPending} disabled={state === "error"}>
        {isPending ? "Procesando…" : "Confirmar baja"}
      </Button>
    </Card>
  );
}
