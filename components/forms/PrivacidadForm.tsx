"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import {
  privacySettingsSchema,
  PROFILE_VISIBILITY_OPTIONS,
  type PrivacySettingsInput,
} from "@/lib/validations/cv-vivo/privacidad";
import { savePrivacySettings } from "@/app/cv-vivo/privacidad/actions";
import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";

type PrivacidadFormProps = {
  defaultValues: PrivacySettingsInput;
};

export function PrivacidadForm({ defaultValues }: PrivacidadFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PrivacySettingsInput>({
    resolver: zodResolver(privacySettingsSchema),
    defaultValues,
  });

  function onSubmit(data: PrivacySettingsInput) {
    setFormError(null);
    startTransition(async () => {
      const result = await savePrivacySettings(data);
      if (result.status === "error") {
        setFormError(result.message);
        return;
      }
      router.push("/cv-vivo");
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <Field
        label="¿Quién puede ver tu perfil?"
        required
        htmlFor="profileVisibility"
        error={errors.profileVisibility?.message}
      >
        <Select
          id="profileVisibility"
          options={PROFILE_VISIBILITY_OPTIONS}
          invalid={!!errors.profileVisibility}
          {...register("profileVisibility")}
        />
      </Field>

      <div className="flex flex-col gap-4">
        <Switch label="Mostrar mi correo a las empresas" {...register("showContactEmail")} />
        <Switch label="Mostrar mi teléfono a las empresas" {...register("showContactPhone")} />
      </div>

      {formError && (
        <p role="alert" className="font-body text-small text-status-danger">
          {formError}
        </p>
      )}

      <Button type="submit" size="lg" fullWidth iconAfter={Check} loading={isPending}>
        Guardar y terminar
      </Button>
    </form>
  );
}
