"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { ArrowRight } from "lucide-react";
import { presentacionSchema, type PresentacionInput } from "@/lib/validations/cv-vivo/presentacion";
import { savePresentacion } from "@/app/cv-vivo/presentacion/actions";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { FieldGroup } from "@/components/cv-vivo/FieldGroup";
import { FormField } from "@/components/cv-vivo/FormField";

type PresentacionFormValues = z.input<typeof presentacionSchema>;

type PresentacionFormProps = {
  defaultValues: { headline: string; bio: string };
};

export function PresentacionForm({ defaultValues }: PresentacionFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PresentacionFormValues, unknown, PresentacionInput>({
    resolver: zodResolver(presentacionSchema),
    defaultValues,
  });

  function onSubmit(data: PresentacionInput) {
    setFormError(null);
    startTransition(async () => {
      const result = await savePresentacion(data);
      if (result.status === "success") {
        router.push("/cv-vivo");
        return;
      }
      setFormError(result.message);
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <FieldGroup title="Presentación">
        <FormField
          label="Titular"
          required
          span={12}
          htmlFor="headline"
          hint="Una frase corta que te describa profesionalmente."
          error={errors.headline?.message}
        >
          <Input id="headline" invalid={!!errors.headline} {...register("headline")} />
        </FormField>

        <FormField label="Sobre ti" span={12} htmlFor="bio" hint="Opcional. Cuéntales a las empresas quién eres." error={errors.bio?.message}>
          <Textarea id="bio" rows={5} invalid={!!errors.bio} {...register("bio")} />
        </FormField>
      </FieldGroup>

      {formError && (
        <p role="alert" className="font-body text-small text-status-danger">
          {formError}
        </p>
      )}

      <Button type="submit" size="lg" fullWidth iconAfter={ArrowRight} loading={isPending}>
        Guardar y continuar
      </Button>
    </form>
  );
}
