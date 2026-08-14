"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { restablecerPasswordSchema, type RestablecerPasswordInput } from "@/lib/validations/restablecer-password";
import { updatePassword } from "@/app/restablecer-password/actions";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FieldGroup } from "@/components/cv-vivo/FieldGroup";
import { FormField } from "@/components/cv-vivo/FormField";
import { PasswordField } from "@/components/forms/PasswordField";

export function RestablecerPasswordForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RestablecerPasswordInput>({
    resolver: zodResolver(restablecerPasswordSchema),
    defaultValues: { password: "" },
  });

  const password = useWatch({ control, name: "password" }) ?? "";

  function onSubmit(data: RestablecerPasswordInput) {
    setFormError(null);
    startTransition(async () => {
      const result = await updatePassword(data);
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
        <h2 className="font-heading text-h1 text-text-heading">Crea tu nueva contraseña</h2>
        <p className="mt-1.5 font-body text-small text-text-muted">Úsala la próxima vez que inicies sesión.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6 px-6 py-6">
        <FieldGroup title="Nueva contraseña">
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

        {formError && (
          <p role="alert" className="font-body text-small text-status-danger">
            {formError}
          </p>
        )}

        <div className="flex items-center justify-end border-t border-border-subtle pt-4">
          <Button type="submit" iconAfter={ArrowRight} loading={isPending}>
            {isPending ? "Guardando…" : "Guardar contraseña"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
