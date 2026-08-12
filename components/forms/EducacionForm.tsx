"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { clsx } from "clsx";
import { Plus, GraduationCap } from "lucide-react";
import { educationEntrySchema, type EducationEntryInput } from "@/lib/validations/cv-vivo/educacion";
import { saveEducationEntry, deleteEducationEntry } from "@/app/cv-vivo/educacion/actions";
import { Input } from "@/components/ui/Input";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { LoadingRow } from "@/components/ui/LoadingRow";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { FieldGroup } from "@/components/cv-vivo/FieldGroup";
import { FormField } from "@/components/cv-vivo/FormField";
import { EntryRow } from "@/components/cv-vivo/EntryRow";
import { UniversitySelect } from "@/components/forms/UniversitySelect";

export type EducationEntry = {
  id: string;
  universityId: number | null;
  universityName: string | null;
  studyFieldId: number | null;
  academicStatusId: number | null;
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
  isPrimary: boolean;
  description: string | null;
};

type Prefill = {
  countryId: string | null;
  universityId: number | null;
  studyFieldId: number | null;
  academicStatusId: number | null;
};

type EducacionFormProps = {
  entries: EducationEntry[];
  countries: SelectOption[];
  studyFields: SelectOption[];
  academicStatuses: SelectOption[];
  prefill: Prefill;
};

export function EducacionForm({ entries, countries, studyFields, academicStatuses, prefill }: EducacionFormProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | "new" | null>(entries.length === 0 ? "new" : null);
  // Cubre tanto guardar como eliminar: vive en el padre para que siga
  // visible mientras router.refresh() trae los datos reales, aunque el
  // formulario hijo que lo disparó ya se haya desmontado.
  const [isRefreshing, startRefresh] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const editingEntry = editingId && editingId !== "new" ? entries.find((e) => e.id === editingId) ?? null : null;

  function handleDelete(id: string) {
    if (!window.confirm("¿Eliminar esta educación de tu CV Vivo?")) return;
    setDeleteError(null);
    startRefresh(async () => {
      const result = await deleteEducationEntry(id);
      if (result.status === "error") {
        setDeleteError(result.message);
        return;
      }
      if (editingId === id) setEditingId(null);
      router.refresh();
    });
  }

  function handleSaved() {
    setEditingId(null);
    startRefresh(() => {
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {entries.length > 0 && (
        <div className="flex flex-col gap-3">
          <FieldLabel>Ya añadido · {entries.length}</FieldLabel>
          {entries.map((entry) => {
            const studyFieldName = studyFields.find((s) => s.value === entry.studyFieldId)?.label ?? "Carrera";
            return (
              <EntryRow
                key={entry.id}
                icon={GraduationCap}
                title={studyFieldName}
                meta={`${entry.universityName ?? "Universidad"} · ${formatDateRange(entry.startDate, entry.endDate, entry.isCurrent)}`}
                onEdit={() => setEditingId(entry.id)}
                onDelete={() => handleDelete(entry.id)}
                disabled={isRefreshing}
              />
            );
          })}
        </div>
      )}

      {isRefreshing && <LoadingRow />}

      {deleteError && (
        <p role="alert" className="font-body text-small text-status-danger">
          {deleteError}
        </p>
      )}

      {editingId ? (
        <EntryForm
          key={editingId}
          entry={editingEntry}
          countries={countries}
          studyFields={studyFields}
          academicStatuses={academicStatuses}
          prefill={prefill}
          onSaved={handleSaved}
          onCancel={entries.length === 0 ? undefined : () => setEditingId(null)}
        />
      ) : (
        <Button variant="outline" icon={Plus} onClick={() => setEditingId("new")} disabled={isRefreshing}>
          Agregar otra educación
        </Button>
      )}
    </div>
  );
}

function formatDateRange(startDate: string | null, endDate: string | null, isCurrent: boolean) {
  const format = (value: string) => new Date(value).toLocaleDateString("es-ES", { month: "short", year: "numeric" });
  const start = startDate ? format(startDate) : "";
  const end = isCurrent ? "Actualidad" : endDate ? format(endDate) : "";
  return [start, end].filter(Boolean).join(" — ");
}

type EntryFormValues = z.input<typeof educationEntrySchema>;

function EntryForm({
  entry,
  countries,
  studyFields,
  academicStatuses,
  prefill,
  onSaved,
  onCancel,
}: {
  entry: EducationEntry | null;
  countries: SelectOption[];
  studyFields: SelectOption[];
  academicStatuses: SelectOption[];
  prefill: Prefill;
  onSaved: () => void;
  onCancel?: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  // Filtro de universidad, no se guarda en `education` (que solo tiene
  // university_id) — se preselecciona con el país del Paso 1.
  const [countryId, setCountryId] = useState<string | null>(prefill.countryId);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<EntryFormValues, unknown, EducationEntryInput>({
    resolver: zodResolver(educationEntrySchema),
    defaultValues: {
      id: entry?.id,
      universityId: entry?.universityId ?? prefill.universityId ?? undefined,
      studyFieldId: entry?.studyFieldId ?? prefill.studyFieldId ?? undefined,
      academicStatusId: entry?.academicStatusId ?? prefill.academicStatusId ?? undefined,
      startDate: entry?.startDate ?? "",
      endDate: entry?.endDate ?? "",
      isCurrent: entry?.isCurrent ?? false,
      description: entry?.description ?? "",
    },
  });

  const isCurrent = useWatch({ control, name: "isCurrent" });

  function onSubmit(data: EducationEntryInput) {
    setFormError(null);
    startTransition(async () => {
      const result = await saveEducationEntry(data);
      if (result.status === "error") {
        setFormError(result.message);
        return;
      }
      onSaved();
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <FieldGroup title="Institución">
        <FormField label="País de la institución" span={5} hint="Filtra la lista de universidades." htmlFor="entryCountryId">
          <Select
            id="entryCountryId"
            placeholder="Selecciona un país"
            options={countries}
            value={countryId ?? ""}
            onChange={(event) => setCountryId(event.target.value || null)}
          />
        </FormField>
        <FormField label="Universidad o centro" span={7} required htmlFor="universityId" error={errors.universityId?.message}>
          <UniversitySelect
            id="universityId"
            control={control}
            setValue={setValue}
            name="universityId"
            countryId={countryId}
            invalid={!!errors.universityId}
          />
        </FormField>
        <FormField label="Carrera" span={7} required htmlFor="studyFieldId" error={errors.studyFieldId?.message}>
          <Select
            id="studyFieldId"
            placeholder="Selecciona tu carrera"
            options={studyFields}
            invalid={!!errors.studyFieldId}
            {...register("studyFieldId")}
          />
        </FormField>
        <FormField
          label="Situación académica"
          span={5}
          required
          htmlFor="academicStatusId"
          error={errors.academicStatusId?.message}
        >
          <Select
            id="academicStatusId"
            placeholder="Selecciona una opción"
            options={academicStatuses}
            invalid={!!errors.academicStatusId}
            {...register("academicStatusId")}
          />
        </FormField>
      </FieldGroup>

      <FieldGroup title="Periodo">
        <FormField label="Fecha de inicio" span={4} required htmlFor="startDate" error={errors.startDate?.message}>
          <Input id="startDate" type="date" invalid={!!errors.startDate} {...register("startDate")} />
        </FormField>
        {!isCurrent && (
          <FormField label="Fecha de fin" span={4} htmlFor="endDate" error={errors.endDate?.message}>
            <Input id="endDate" type="date" invalid={!!errors.endDate} {...register("endDate")} />
          </FormField>
        )}
        <div className={clsx("col-span-12 flex items-end pb-2.5", isCurrent ? "sm:col-span-8" : "sm:col-span-4")}>
          <Checkbox label="Actualmente estudio aquí" {...register("isCurrent")} />
        </div>
      </FieldGroup>

      <FieldGroup title="Detalle" caption="Opcional">
        <FormField label="Descripción" span={12} hint="Máximo 500 caracteres." htmlFor="description" error={errors.description?.message}>
          <Textarea id="description" rows={3} invalid={!!errors.description} {...register("description")} />
        </FormField>
      </FieldGroup>

      {formError && (
        <p role="alert" className="font-body text-small text-status-danger">
          {formError}
        </p>
      )}

      <div className="flex gap-3">
        {onCancel && (
          <Button variant="outline" type="button" onClick={onCancel} disabled={isPending}>
            Cancelar
          </Button>
        )}
        <Button type="submit" fullWidth={!onCancel} loading={isPending}>
          Guardar
        </Button>
      </div>
    </form>
  );
}
