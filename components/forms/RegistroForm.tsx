"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { registroSchema, type RegistroInput } from "@/lib/validations/registro";

type RegistroFormValues = z.input<typeof registroSchema>;
import { registerAccount } from "@/app/registro/actions";
import { Input } from "@/components/ui/Input";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { Turnstile } from "@/components/forms/Turnstile";

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
      <div className="w-full max-w-md rounded-brand-card bg-white p-6 text-center shadow-brand">
        <h2 className="font-heading text-h2 text-brand-dark">Revisa tu correo</h2>
        <p className="mt-3 font-body text-body text-brand-gray">
          Te enviamos un enlace de confirmación a <strong>{confirmEmail}</strong>.
          Ábrelo para activar tu cuenta y continuar con tu CV Vivo.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex w-full max-w-md flex-col gap-4 rounded-brand-card bg-white p-6 shadow-brand"
    >
      <Input
        label="Nombre completo"
        autoComplete="name"
        error={errors.fullName?.message}
        {...register("fullName")}
      />
      <Input
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Contraseña"
        type="password"
        autoComplete="new-password"
        hint="Mínimo 8 caracteres."
        error={errors.password?.message}
        {...register("password")}
      />
      <Input
        label="Confirma tu contraseña"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      <Select
        label="País"
        placeholder="Selecciona tu país"
        options={countries}
        error={errors.countryId?.message}
        {...register("countryId")}
      />
      <Select
        label="Universidad"
        placeholder="Selecciona tu universidad"
        options={universities}
        error={errors.universityId?.message}
        {...register("universityId")}
      />
      <Select
        label="Carrera"
        placeholder="Selecciona tu carrera"
        options={studyFields}
        error={errors.studyFieldId?.message}
        {...register("studyFieldId")}
      />
      <Select
        label="¿Cómo te enteraste de BeWay?"
        placeholder="Selecciona una opción"
        options={referralSources}
        error={errors.referralSourceId?.message}
        {...register("referralSourceId")}
      />

      <div className="flex flex-col gap-1.5">
        <Turnstile
          onVerify={(token) =>
            setValue("turnstileToken", token, { shouldValidate: true })
          }
          onExpire={() =>
            setValue("turnstileToken", "", { shouldValidate: true })
          }
          onError={() =>
            setError("turnstileToken", {
              message:
                "No se pudo cargar la verificación anti-bot. Recarga la página.",
            })
          }
        />
        {errors.turnstileToken && (
          <p role="alert" className="font-body text-small text-red-600">
            {errors.turnstileToken.message}
          </p>
        )}
      </div>

      <Checkbox
        label="Acepto los Términos y Condiciones y la Política de Privacidad de BeWay."
        error={errors.acceptedTerms?.message}
        {...register("acceptedTerms")}
      />
      <Checkbox
        label="Quiero recibir novedades y oportunidades de BeWay por correo (opcional)."
        {...register("marketingConsent")}
      />

      {formError && (
        <p role="alert" className="font-body text-small text-red-600">
          {formError}
        </p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Creando cuenta…" : "Crear cuenta"}
      </Button>
    </form>
  );
}
