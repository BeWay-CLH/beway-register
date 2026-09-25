"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Mail, User, ShieldCheck, ArrowRight, ChevronDown } from "lucide-react";
import { registroSchema, type RegistroInput } from "@/lib/validations/registro";
import { registerAccount } from "@/app/registro/actions";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { FieldGroup } from "@/components/cv-vivo/FieldGroup";
import { FormField } from "@/components/cv-vivo/FormField";
import { PasswordField } from "@/components/forms/PasswordField";
import { UniversitySelect } from "@/components/forms/UniversitySelect";
import { Turnstile } from "@/components/forms/Turnstile";
import { LegalDocumentModal } from "@/components/forms/LegalDocumentModal";
import { TerminosContent, PrivacidadContent, PrivacyNoticeSummary } from "@/components/legal/LegalContent";

type RegistroFormValues = z.input<typeof registroSchema>;

type RegistroFormProps = {
  countries: SelectOption[];
  studyFields: SelectOption[];
  referralSources: SelectOption[];
};

export function RegistroForm({ countries, studyFields, referralSources }: RegistroFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmEmail, setConfirmEmail] = useState<string | null>(null);
  const [openLegalDoc, setOpenLegalDoc] = useState<"terminos" | "privacidad" | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    formState: { errors },
  } = useForm<RegistroFormValues, unknown, RegistroInput>({
    resolver: zodResolver(registroSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      countryId: "",
      turnstileToken: "",
      marketingConsent: false,
    },
  });

  const password = useWatch({ control, name: "password" }) ?? "";
  const countryId = useWatch({ control, name: "countryId" });
  const acceptedTerms = useWatch({ control, name: "acceptedTerms" });

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
      <Card elevation="md" className="w-full max-w-[560px] text-center">
        <h2 className="font-heading text-h2 text-brand-dark">Revisa tu correo</h2>
        <p className="mt-3 font-body text-body text-text-muted">
          Te enviamos un enlace de confirmación a <strong>{confirmEmail}</strong>. Ábrelo para
          activar tu cuenta y continuar con tu CV Vivo.
        </p>
      </Card>
    );
  }

  return (
    <Card padding="none" elevation="md" className="w-full max-w-[560px] overflow-hidden">
      <div className="rounded-t-lg border-b border-border-subtle bg-gradient-to-b from-surface-accent-subtle to-surface-card px-6 py-5">
        <h2 className="font-heading text-h1 text-text-heading">Crear mi cuenta</h2>
        <p className="mt-1.5 font-body text-small text-text-muted">Dos minutos. Sin coste para el talento.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6 px-6 py-6">
        <FieldGroup title="Tu cuenta">
          <FormField label="Nombre completo" required span={12} htmlFor="fullName" error={errors.fullName?.message}>
            <Input id="fullName" icon={User} autoComplete="name" invalid={!!errors.fullName} {...register("fullName")} />
          </FormField>

          <FormField
            label="Correo electrónico"
            required
            span={12}
            htmlFor="email"
            hint="Usa tu correo universitario si lo tienes: acelera la verificación."
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

          <FormField label="Contraseña" required span={12} htmlFor="password" hint="Mínimo 8 caracteres." error={errors.password?.message}>
            <PasswordField
              id="password"
              value={password}
              invalid={!!errors.password}
              showStrength
              autoComplete="new-password"
              registration={register("password")}
            />
          </FormField>
        </FieldGroup>

        <FieldGroup title="Contexto académico" caption="Puedes ampliarlo después">
          <FormField label="País de residencia" required span={5} htmlFor="countryId" error={errors.countryId?.message}>
            <Select
              id="countryId"
              placeholder="Selecciona tu país"
              options={countries}
              invalid={!!errors.countryId}
              {...register("countryId")}
            />
          </FormField>

          <FormField
            label="Universidad"
            required
            span={7}
            htmlFor="universityId"
            error={errors.universityId?.message}
          >
            <UniversitySelect
              id="universityId"
              control={control}
              setValue={setValue}
              name="universityId"
              countryId={countryId}
              invalid={!!errors.universityId}
            />
          </FormField>

          <FormField label="Carrera" required span={7} htmlFor="studyFieldId" error={errors.studyFieldId?.message}>
            <Select
              id="studyFieldId"
              placeholder="Selecciona tu carrera"
              options={studyFields}
              invalid={!!errors.studyFieldId}
              {...register("studyFieldId")}
            />
          </FormField>

          <FormField
            label="¿Cómo nos conociste? (opcional)"
            span={5}
            htmlFor="referralSourceId"
            error={errors.referralSourceId?.message}
          >
            <Select
              id="referralSourceId"
              placeholder="Selecciona"
              options={referralSources}
              invalid={!!errors.referralSourceId}
              {...register("referralSourceId")}
            />
          </FormField>
        </FieldGroup>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 rounded-md border border-border-subtle bg-surface-sunken p-4">
            <div className="flex items-center gap-2 font-body text-small font-semibold text-text-body">
              <ShieldCheck size={18} className="text-status-success" />
              Verificación anti-bot
              <span className="ml-auto font-body text-[11px] uppercase tracking-caps text-text-muted">
                Protegido por Cloudflare
              </span>
            </div>
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

          <Checkbox
            label={
              <>
                He leído y acepto los{" "}
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setOpenLegalDoc("terminos");
                  }}
                  className="font-semibold text-link underline hover:text-link-hover"
                >
                  Términos de Uso
                </button>{" "}
                del Pre-Registro de BeWay.
              </>
            }
            error={errors.acceptedTerms?.message}
            {...register("acceptedTerms")}
          />

          {/* Sin checkbox (BEWAY | Pre-Registro · Cambios UX + legal, 3.1):
              es información, no un consentimiento que aceptar. <details>
              nativo — cerrado por defecto, se abre antes de crear la
              cuenta sin bloquear el envío del formulario. */}
          <details className="group rounded-md border border-border-subtle bg-surface-sunken px-4 py-3">
            <summary className="flex cursor-pointer list-none items-center gap-2 font-body text-small text-text-body">
              Información básica de privacidad · Ver detalles
              <ChevronDown size={16} className="ml-auto text-text-muted transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-3 flex flex-col gap-2">
              <PrivacyNoticeSummary />
              <button
                type="button"
                onClick={() => setOpenLegalDoc("privacidad")}
                className="self-start font-body text-[12px] font-semibold text-link underline hover:text-link-hover"
              >
                Política de Privacidad
              </button>
            </div>
          </details>

          <Switch
            label="Quiero recibir oportunidades, eventos y novedades de BeWay por correo. Puedo darme de baja cuando quiera."
            {...register("marketingConsent")}
          />
        </div>

        {formError && (
          <p role="alert" className="font-body text-small text-status-danger">
            {formError}
          </p>
        )}

        <div className="flex items-center gap-4 border-t border-border-subtle pt-4">
          <p className="font-body text-small text-text-muted">
            ¿Ya tienes cuenta?{" "}
            <Link href="/iniciar-sesion" className="font-semibold text-link hover:text-link-hover hover:underline">
              Inicia sesión
            </Link>
          </p>
          <Button
            type="submit"
            className="ml-auto"
            iconAfter={ArrowRight}
            loading={isPending}
            disabled={!acceptedTerms}
          >
            {isPending ? "Creando cuenta…" : "Crear mi cuenta"}
          </Button>
        </div>
      </form>

      {openLegalDoc === "terminos" && (
        <LegalDocumentModal title="Términos de Uso" fullPageHref="/terminos" onClose={() => setOpenLegalDoc(null)}>
          <TerminosContent />
        </LegalDocumentModal>
      )}
      {openLegalDoc === "privacidad" && (
        <LegalDocumentModal
          title="Política de Privacidad"
          fullPageHref="/privacidad"
          onClose={() => setOpenLegalDoc(null)}
        >
          <PrivacidadContent />
        </LegalDocumentModal>
      )}
    </Card>
  );
}
