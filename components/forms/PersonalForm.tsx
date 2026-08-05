"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { ArrowRight } from "lucide-react";
import { personalSchema, type PersonalInput } from "@/lib/validations/cv-vivo/personal";
import { savePersonal } from "@/app/cv-vivo/personal/actions";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

type PersonalFormValues = z.input<typeof personalSchema>;

type PersonalFormProps = {
  academicStatuses: SelectOption[];
  defaultValues: { phone: string; academicStatusId: number | undefined };
};

export function PersonalForm({ academicStatuses, defaultValues }: PersonalFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalFormValues, unknown, PersonalInput>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      phone: defaultValues.phone,
      academicStatusId: defaultValues.academicStatusId,
    },
  });

  function onSubmit(data: PersonalInput) {
    setFormError(null);
    startTransition(async () => {
      const result = await savePersonal(data);
      if (result.status === "success") {
        router.push("/cv-vivo");
        return;
      }
      setFormError(result.message);
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <Field label="Teléfono" htmlFor="phone" hint="Opcional. Lo usan las empresas para contactarte.">
        <Input id="phone" type="tel" autoComplete="tel" {...register("phone")} />
      </Field>

      <Field label="Situación académica" required htmlFor="academicStatusId" error={errors.academicStatusId?.message}>
        <Select
          id="academicStatusId"
          placeholder="Selecciona una opción"
          options={academicStatuses}
          invalid={!!errors.academicStatusId}
          {...register("academicStatusId")}
        />
      </Field>

      {formError && (
        <p role="alert" className="font-body text-small text-status-danger">
          {formError}
        </p>
      )}

      <Button type="submit" size="lg" fullWidth iconAfter={ArrowRight} disabled={isPending}>
        {isPending ? "Guardando…" : "Guardar y continuar"}
      </Button>
    </form>
  );
}
