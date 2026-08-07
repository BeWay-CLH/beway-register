"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { ArrowRight } from "lucide-react";
import { preferencesSchema, type PreferencesInput } from "@/lib/validations/cv-vivo/preferencias";
import { savePreferences } from "@/app/cv-vivo/preferencias/actions";
import { Field } from "@/components/ui/Field";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";

type PreferenciasDefaultValues = {
  availabilityOptionId: number | undefined;
  opportunityTypeIds: number[];
  workModalityIds: number[];
  sectorIds: number[];
};

type PreferenciasFormProps = {
  availabilityOptions: SelectOption[];
  opportunityTypes: SelectOption[];
  workModalities: SelectOption[];
  sectors: SelectOption[];
  defaultValues: PreferenciasDefaultValues;
};

type FormValues = z.input<typeof preferencesSchema>;
type ArrayFieldName = "opportunityTypeIds" | "workModalityIds" | "sectorIds";

export function PreferenciasForm({
  availabilityOptions,
  opportunityTypes,
  workModalities,
  sectors,
  defaultValues,
}: PreferenciasFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues, unknown, PreferencesInput>({
    resolver: zodResolver(preferencesSchema),
    defaultValues,
  });

  const opportunityTypeIds = useWatch({ control, name: "opportunityTypeIds" }) ?? [];
  const workModalityIds = useWatch({ control, name: "workModalityIds" }) ?? [];
  const sectorIds = useWatch({ control, name: "sectorIds" }) ?? [];

  function toggle(field: ArrayFieldName, current: number[], id: number) {
    const next = current.includes(id) ? current.filter((value) => value !== id) : [...current, id];
    setValue(field, next, { shouldDirty: true });
  }

  function onSubmit(data: PreferencesInput) {
    setFormError(null);
    startTransition(async () => {
      const result = await savePreferences(data);
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
        label="Disponibilidad"
        required
        htmlFor="availabilityOptionId"
        error={errors.availabilityOptionId?.message}
      >
        <Select
          id="availabilityOptionId"
          placeholder="Selecciona una opción"
          options={availabilityOptions}
          invalid={!!errors.availabilityOptionId}
          {...register("availabilityOptionId")}
        />
      </Field>

      <TagGroup
        label="Tipo de oportunidad"
        hint="Opcional. Elige todas las que apliquen."
        options={opportunityTypes}
        selected={opportunityTypeIds}
        onToggle={(id) => toggle("opportunityTypeIds", opportunityTypeIds, id)}
      />

      <TagGroup
        label="Modalidad de trabajo"
        hint="Opcional. Elige todas las que apliquen."
        options={workModalities}
        selected={workModalityIds}
        onToggle={(id) => toggle("workModalityIds", workModalityIds, id)}
      />

      <TagGroup
        label="Sector"
        hint="Opcional. Elige todos los que apliquen."
        options={sectors}
        selected={sectorIds}
        onToggle={(id) => toggle("sectorIds", sectorIds, id)}
      />

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

function TagGroup({
  label,
  hint,
  options,
  selected,
  onToggle,
}: {
  label: string;
  hint?: string;
  options: SelectOption[];
  selected: number[];
  onToggle: (id: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2 text-left">
      <p className="font-body text-small font-semibold text-text-body">{label}</p>
      {hint && <p className="-mt-1 font-body text-small text-text-muted">{hint}</p>}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onToggle(Number(option.value))}
            className="rounded-pill border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:shadow-focus-ring"
          >
            <Tag selected={selected.includes(Number(option.value))}>{option.label}</Tag>
          </button>
        ))}
      </div>
    </div>
  );
}
