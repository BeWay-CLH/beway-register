"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { recuperarPasswordSchema, type RecuperarPasswordInput } from "@/lib/validations/recuperar-password";
import { requestPasswordReset } from "@/app/recuperar-password/actions";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FieldGroup } from "@/components/cv-vivo/FieldGroup";
import { FormField } from "@/components/cv-vivo/FormField";

export function RecuperarPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecuperarPasswordInput>({
    resolver: zodResolver(recuperarPasswordSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(data: RecuperarPasswordInput) {
    setFormError(null);
    startTransition(async () => {
      const result = await requestPasswordReset(data);
      if (result.status === "error") {
        setFormError(result.message);
        return;
      }
      setSent(true);
    });
  }

  if (sent) {
    return (
      <Card elevation="md" className="w-full max-w-[560px] text-center">
        <CheckCircle2 size={32} className="mx-auto text-status-success" />
        <h2 className="mt-3 font-heading text-h2 text-brand-dark">Revisa tu correo</h2>
        <p className="mt-3 font-body text-body text-text-muted">
          Si existe una cuenta en BeWay con ese correo, te enviamos un enlace para restablecer tu contraseña.
        </p>
      </Card>
    );
  }

  return (
    <Card padding="none" elevation="md" className="w-full max-w-[560px] overflow-hidden">
      <div className="rounded-t-lg border-b border-border-subtle bg-gradient-to-b from-surface-accent-subtle to-surface-card px-6 py-5">
        <h2 className="font-heading text-h1 text-text-heading">Recupera tu contraseña</h2>
        <p className="mt-1.5 font-body text-small text-text-muted">Te enviamos un enlace para crear una nueva.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6 px-6 py-6">
        <FieldGroup title="Tu cuenta">
          <FormField label="Correo electrónico" required span={12} htmlFor="email" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              icon={Mail}
              autoComplete="email"
              invalid={!!errors.email}
              {...register("email")}
            />
          </FormField>
        </FieldGroup>

        {formError && (
          <p role="alert" className="font-body text-small text-status-danger">
            {formError}
          </p>
        )}

        <div className="flex items-center gap-4 border-t border-border-subtle pt-4">
          <Link href="/iniciar-sesion" className="font-body text-small font-semibold text-link hover:text-link-hover hover:underline">
            Volver a inicio de sesión
          </Link>
          <Button type="submit" className="ml-auto" iconAfter={ArrowRight} loading={isPending}>
            {isPending ? "Enviando…" : "Enviar enlace"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
