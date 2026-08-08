"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { User, Mail, ArrowRight } from "lucide-react";
import { registroSchema, type RegistroInput } from "@/lib/validations/registro";
import { registerAccount } from "@/app/registro/actions";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { Turnstile } from "@/components/forms/Turnstile";

type RegistroFormValues = z.input<typeof registroSchema>;

type RegistroFormProps = {
  countries: SelectOption[];
  universities: SelectOption[];
  studyFields: SelectOption[];
  referralSources: SelectOption[];
};

export function RegistroForm({
  countries,
  universities,
  studyFields,
  referralSources,
}: RegistroFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmEmail, setConfirmEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<RegistroFormValues, unknown, RegistroInput>({
    resolver: zodResolver(registroSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      countryId: "",
      turnstileToken: "",
      marketingConsent: false,
    },
  });

  function onSubmit(data: RegistroInput) {
    setFormError(null);
    startTransition(async () => {
      const result = await registerAccount(data);
      if (result.status === "success") {
        router.push("/cv-vivo");
        return;
      }
      if (result.status === "confirm_email") {
        setConfirmEmail(result.email);
        return;
      }
      setFormError(result.message);
    });
  }

  if (confirmEmail) {
    return (
      <Card elevation="md" className="w-full max-w-md text-center">
        <h2 className="font-heading text-h2 text-brand-dark">Revisa tu correo</h2>
        <p className="mt-3 font-body text-body text-text-muted">
          Te enviamos un enlace de confirmación a <strong>{confirmEmail}</strong>. Ábrelo para
          activar tu cuenta y continuar con tu CV Vivo.
        </p>
      </Card>
    );
  }

  return (
    <Card elevation="md" className="flex w-full max-w-md flex-col gap-5">
      <div>
        <h2 className="font-heading text-h2 text-brand-dark">Crear mi perfil</h2>
        <p className="mt-2 font-body text-small text-text-muted">
          Dos minutos. Sin coste para el talento.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        <Field label="Nombre completo" required htmlFor="fullName" error={errors.fullName?.message}>
          <Input id="fullName" icon={User} autoComplete="name" invalid={!!errors.fullName} {...register("fullName")} />
        </Field>

        <Field label="Correo electrónico" required htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            icon={Mail}
            autoComplete="email"
            invalid={!!errors.email}
            {...register("email")}
          />
        </Field>

        <Field
          label="Contraseña"
          required
          htmlFor="password"
          hint="Mínimo 8 caracteres."
          error={errors.password?.message}
        >
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            invalid={!!errors.password}
            {...register("password")}
          />
        </Field>

        <Field
          label="Confirma tu contraseña"
          required
          htmlFor="confirmPassword"
          error={errors.confirmPassword?.message}
        >
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            invalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
        </Field>

        <Field label="País" required htmlFor="countryId" error={errors.countryId?.message}>
          <Select
            id="countryId"
            placeholder="Selecciona tu país"
            options={countries}
            invalid={!!errors.countryId}
            {...register("countryId")}
          />
        </Field>

        <Field label="Universidad" required htmlFor="universityId" error={errors.universityId?.message}>
          <Select
            id="universityId"
            placeholder="Selecciona tu universidad"
            options={universities}
            invalid={!!errors.universityId}
            {...register("universityId")}
          />
        </Field>

        <Field label="Carrera" required htmlFor="studyFieldId" error={errors.studyFieldId?.message}>
          <Select
            id="studyFieldId"
            placeholder="Selecciona tu carrera"
            options={studyFields}
            invalid={!!errors.studyFieldId}
            {...register("studyFieldId")}
          />
        </Field>

        <Field
          label="¿Cómo te enteraste de BeWay?"
          required
          htmlFor="referralSourceId"
          error={errors.referralSourceId?.message}
        >
          <Select
            id="referralSourceId"
            placeholder="Selecciona una opción"
            options={referralSources}
            invalid={!!errors.referralSourceId}
            {...register("referralSourceId")}
          />
        </Field>

        <div className="flex flex-col gap-1.5">
          <Turnstile
            onVerify={(token) => setValue("turnstileToken", token, { shouldValidate: true })}
            onExpire={() => setValue("turnstileToken", "", { shouldValidate: true })}
            onError={() =>
              setError("turnstileToken", {
                message: "No se pudo cargar la verificación anti-bot. Recarga la página.",
              })
            }
          />
          {errors.turnstileToken && (
            <p role="alert" className="font-body text-small text-status-danger">
              {errors.turnstileToken.message}
            </p>
          )}
        </div>

        <Switch label="Recibir oportunidades y novedades de BeWay por correo" {...register("marketingConsent")} />

        <Checkbox
          label="Acepto los Términos y Condiciones y la Política de Privacidad de BeWay."
          error={errors.acceptedTerms?.message}
          {...register("acceptedTerms")}
        />

        {formError && (
          <p role="alert" className="font-body text-small text-status-danger">
            {formError}
          </p>
        )}

        <Button type="submit" size="lg" fullWidth iconAfter={ArrowRight} loading={isPending}>
          {isPending ? "Creando cuenta…" : "Crear mi perfil"}
        </Button>
      </form>
    </Card>
  );
}
