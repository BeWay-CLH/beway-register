"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowRight } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validations/login";
import { loginAccount } from "@/app/iniciar-sesion/actions";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FieldGroup } from "@/components/cv-vivo/FieldGroup";
import { FormField } from "@/components/cv-vivo/FormField";
import { PasswordField } from "@/components/forms/PasswordField";

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const password = useWatch({ control, name: "password" }) ?? "";

  function onSubmit(data: LoginInput) {
    setFormError(null);
    startTransition(async () => {
      const result = await loginAccount(data);
      if (result.status === "error") {
        setFormError(result.message);
        return;
      }
      router.push("/cv-vivo");
      router.refresh();
    });
  }

  return (
    <Card padding="none" elevation="md" className="w-full max-w-[560px] overflow-hidden">
      <div className="rounded-t-lg border-b border-border-subtle bg-gradient-to-b from-surface-accent-subtle to-surface-card px-6 py-5">
        <h2 className="font-heading text-h1 text-text-heading">Inicia sesión</h2>
        <p className="mt-1.5 font-body text-small text-text-muted">Retoma tu CV Vivo donde lo dejaste.</p>
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

          <FormField label="Contraseña" required span={12} htmlFor="password" error={errors.password?.message}>
            <PasswordField
              id="password"
              value={password}
              invalid={!!errors.password}
              autoComplete="current-password"
              registration={register("password")}
            />
          </FormField>
        </FieldGroup>

        <Link
          href="/recuperar-password"
          className="-mt-2 self-end font-body text-small font-semibold text-link hover:text-link-hover hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </Link>

        {formError && (
          <p role="alert" className="font-body text-small text-status-danger">
            {formError}
          </p>
        )}

        <div className="flex items-center gap-4 border-t border-border-subtle pt-4">
          <p className="font-body text-small text-text-muted">
            ¿No tienes cuenta?{" "}
            <Link href="/registro" className="font-semibold text-link hover:text-link-hover hover:underline">
              Regístrate
            </Link>
          </p>
          <Button type="submit" className="ml-auto" iconAfter={ArrowRight} loading={isPending}>
            {isPending ? "Entrando…" : "Entrar"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
