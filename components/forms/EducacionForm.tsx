"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Plus, Pencil, Trash2, ArrowRight } from "lucide-react";
import { educationEntrySchema, type EducationEntryInput } from "@/lib/validations/cv-vivo/educacion";
import { saveEducationEntry, deleteEducationEntry } from "@/app/cv-vivo/educacion/actions";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

export type EducationEntry = {
  id: string;
  universityId: number | null;
  studyFieldId: number | null;
  academicStatusId: number | null;
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
  isPrimary: boolean;
  description: string | null;
};

type Prefill = {
  universityId: number | null;
  studyFieldId: number | null;
  academicStatusId: number | null;
};

type EducacionFormProps = {
  entries: EducationEntry[];
  universities: SelectOption[];
  studyFields: SelectOption[];
  academicStatuses: SelectOption[];
  prefill: Prefill;
};

export function EducacionForm({ entries, universities, studyFields, academicStatuses, prefill }: EducacionFormProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | "new" | null>(entries.length === 0 ? "new" : null);
  const [isDeleting, startDeleteTransition] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const editingEntry = editingId && editingId !== "new" ? entries.find((e) => e.id === editingId) ?? null : null;

  function handleDelete(id: string) {
    if (!window.confirm("¿Eliminar esta educación de tu CV Vivo?")) return;
    setDeleteError(null);
    startDeleteTransition(async () => {
      const result = await deleteEducationEntry(id);
      if (result.status === "error") {
        setDeleteError(result.message);
        return;
      }
      if (editingId === id) setEditingId(null);
      router.refresh();
    });
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      {entries.length > 0 && (
        <ul className="flex flex-col gap-3">
          {entries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              universities={universities}
              studyFields={studyFields}
              onEdit={() => setEditingId(entry.id)}
              onDelete={() => handleDelete(entry.id)}
              disabled={isDeleting}
            />
          ))}
        </ul>
      )}

      {deleteError && (
        <p role="alert" className="font-body text-small text-status-danger">
          {deleteError}
        </p>
      )}

      {editingId ? (
        <EntryForm
          key={editingId}
          entry={editingEntry}
          universities={universities}
          studyFields={studyFields}
          academicStatuses={academicStatuses}
          prefill={prefill}
          onSaved={() => {
            setEditingId(null);
            router.refresh();
          }}
          onCancel={entries.length === 0 ? undefined : () => setEditingId(null)}
        />
      ) : (
        <Button variant="outline" icon={Plus} onClick={() => setEditingId("new")}>
          Agregar otra educación
        </Button>
      )}

      {entries.length > 0 && !editingId && (
        <Button size="lg" fullWidth iconAfter={ArrowRight} onClick={() => router.push("/cv-vivo")}>
          Continuar
        </Button>
      )}
    </div>
  );
}

function EntryCard({
  entry,
  universities,
  studyFields,
  onEdit,
  onDelete,
  disabled,
}: {
  entry: EducationEntry;
  universities: SelectOption[];
  studyFields: SelectOption[];
  onEdit: () => void;
  onDelete: () => void;
  disabled: boolean;
}) {
  const universityName = universities.find((u) => u.value === entry.universityId)?.label ?? "Universidad";
  const studyFieldName = studyFields.find((s) => s.value === entry.studyFieldId)?.label ?? "Carrera";

  return (
    <li>
      <Card elevation="sm" className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="font-body text-body font-semibold text-text-body">{studyFieldName}</p>
          <p className="font-body text-small text-text-muted">{universityName}</p>
          <p className="font-body text-small text-text-muted">
            {formatDateRange(entry.startDate, entry.endDate, entry.isCurrent)}
          </p>
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={onEdit}
            disabled={disabled}
            aria-label="Editar"
            className="rounded-md p-2 text-text-muted transition-colors duration-fast ease-standard hover:bg-surface-sunken hover:text-text-body disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={disabled}
            aria-label="Eliminar"
            className="rounded-md p-2 text-text-muted transition-colors duration-fast ease-standard hover:bg-surface-sunken hover:text-status-danger disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </Card>
    </li>
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
  universities,
  studyFields,
  academicStatuses,
  prefill,
  onSaved,
  onCancel,
}: {
  entry: EducationEntry | null;
  universities: SelectOption[];
  studyFields: SelectOption[];
  academicStatuses: SelectOption[];
  prefill: Prefill;
  onSaved: () => void;
  onCancel?: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
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
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Card elevation="sm" className="flex flex-col gap-5">
        <Field label="Universidad" required htmlFor="universityId" error={errors.universityId?.message}>
          <Select
            id="universityId"
            placeholder="Selecciona tu universidad"
            options={universities}
            invalid={!!errors.universityId}
            {...register("universityId")}
          />
        </Field>
        <Field label="Carrera" required htmlFor="studyFieldId" error={errors.studyFieldId?.message}>
          <Select
            id="studyFieldId"
            placeholder="Selecciona tu carrera"
            options={studyFields}
            invalid={!!errors.studyFieldId}
            {...register("studyFieldId")}
          />
        </Field>
        <Field
          label="Situación académica"
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
        </Field>
        <Field label="Fecha de inicio" required htmlFor="startDate" error={errors.startDate?.message}>
          <Input id="startDate" type="date" invalid={!!errors.startDate} {...register("startDate")} />
        </Field>
        <Checkbox label="Actualmente estudio aquí" {...register("isCurrent")} />
        {!isCurrent && (
          <Field label="Fecha de fin" htmlFor="endDate" error={errors.endDate?.message}>
            <Input id="endDate" type="date" invalid={!!errors.endDate} {...register("endDate")} />
          </Field>
        )}
        <Field label="Descripción" htmlFor="description" hint="Opcional." error={errors.description?.message}>
          <Textarea id="description" rows={3} invalid={!!errors.description} {...register("description")} />
        </Field>

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
          <Button type="submit" fullWidth={!onCancel} disabled={isPending}>
            {isPending ? "Guardando…" : "Guardar"}
          </Button>
        </div>
      </Card>
    </form>
  );
}
