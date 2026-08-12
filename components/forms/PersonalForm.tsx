"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { ArrowRight } from "lucide-react";
import { personalSchema, type PersonalInput } from "@/lib/validations/cv-vivo/personal";
import { savePersonal } from "@/app/cv-vivo/personal/actions";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { FieldGroup } from "@/components/cv-vivo/FieldGroup";
import { FormField } from "@/components/cv-vivo/FormField";
import { PhoneField } from "@/components/forms/PhoneField";

type PersonalFormValues = z.input<typeof personalSchema>;

type PersonalFormProps = {
  academicStatuses: SelectOption[];
  countries: SelectOption[];
  defaultValues: { phoneCountryId: string; phone: string; academicStatusId: number | undefined };
};

export function PersonalForm({ academicStatuses, countries, defaultValues }: PersonalFormProps) {
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
      phoneCountryId: defaultValues.phoneCountryId,
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
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <FieldGroup title="Contacto">
        <FormField label="Teléfono" span={7} hint="Opcional. Lo usan las empresas para contactarte." htmlFor="phone">
          <PhoneField
            countries={countries}
            countryFieldProps={register("phoneCountryId")}
            numberFieldProps={register("phone")}
            invalidNumber={!!errors.phone}
          />
        </FormField>

        <FormField label="Situación académica" required span={5} htmlFor="academicStatusId" error={errors.academicStatusId?.message}>
          <Select
            id="academicStatusId"
            placeholder="Selecciona una opción"
            options={academicStatuses}
            invalid={!!errors.academicStatusId}
            {...register("academicStatusId")}
          />
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
