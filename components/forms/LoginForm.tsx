"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowRight } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validations/login";
import { loginAccount } from "@/app/iniciar-sesion/actions";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

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
    <Card elevation="md" className="flex w-full max-w-md flex-col gap-5">
      <div>
        <h2 className="font-heading text-h2 text-brand-dark">Inicia sesión</h2>
        <p className="mt-2 font-body text-small text-text-muted">Retoma tu CV Vivo donde lo dejaste.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
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

        <Field label="Contraseña" required htmlFor="password" error={errors.password?.message}>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            invalid={!!errors.password}
            {...register("password")}
          />
        </Field>

        {formError && (
          <p role="alert" className="font-body text-small text-status-danger">
            {formError}
          </p>
        )}

        <Button type="submit" size="lg" fullWidth iconAfter={ArrowRight} loading={isPending}>
          {isPending ? "Entrando…" : "Entrar"}
        </Button>
      </form>

      <p className="text-center font-body text-small text-text-muted">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="font-semibold text-link hover:text-link-hover hover:underline">
          Regístrate
        </Link>
      </p>
    </Card>
  );
}
