"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import {
  rightsRequestSchema,
  REQUEST_TYPE_OPTIONS,
  type RightsRequestInput,
} from "@/lib/validations/rights-request";
import { submitRightsRequest } from "@/app/(marketing)/derechos/actions";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { FieldGroup } from "@/components/cv-vivo/FieldGroup";
import { FormField } from "@/components/cv-vivo/FormField";

export function RightsRequestForm() {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RightsRequestInput>({
    resolver: zodResolver(rightsRequestSchema),
    defaultValues: { email: "", details: null },
  });

  function onSubmit(data: RightsRequestInput) {
    setFormError(null);
    startTransition(async () => {
      const result = await submitRightsRequest(data);
      if (result.status === "success") {
        setSubmitted(true);
        return;
      }
      setFormError(result.message);
    });
  }

  if (submitted) {
    return (
      <Card elevation="md" className="text-center">
        <h2 className="font-heading text-h2 text-brand-dark">Solicitud enviada</h2>
        <p className="mt-3 font-body text-body text-text-muted">
          Hemos recibido tu solicitud. Te responderemos al correo indicado en los plazos legalmente previstos.
        </p>
      </Card>
    );
  }

  return (
    <Card elevation="md">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        <FieldGroup title="Tu solicitud">
          <FormField label="Tipo de solicitud" required span={12} htmlFor="requestType" error={errors.requestType?.message}>
            <Select
              id="requestType"
              placeholder="Selecciona el tipo de solicitud"
              options={REQUEST_TYPE_OPTIONS}
              invalid={!!errors.requestType}
              {...register("requestType")}
            />
          </FormField>

          <FormField
            label="Correo de la cuenta"
            required
            span={12}
            htmlFor="email"
            hint="Usa preferentemente el mismo correo con el que te registraste."
            error={errors.email?.message}
          >
            <Input
              id="email"
              type="email"
              icon={Mail}
              autoComplete="email"
              invalid={!!errors.email}
              {...register("email")}
            />
          </FormField>

          <FormField
            label="Descripción / detalle"
            span={12}
            htmlFor="details"
            hint="Opcional, salvo que sea necesario para entender la solicitud."
            error={errors.details?.message}
          >
            <Textarea id="details" invalid={!!errors.details} {...register("details")} />
          </FormField>
        </FieldGroup>

        {formError && (
          <p role="alert" className="font-body text-small text-status-danger">
            {formError}
          </p>
        )}

        <Button type="submit" className="self-end" loading={isPending}>
          {isPending ? "Enviando…" : "Enviar solicitud"}
        </Button>
      </form>
    </Card>
  );
}
