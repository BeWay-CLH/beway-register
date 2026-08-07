"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Plus, Pencil, Trash2, ArrowRight } from "lucide-react";
import { experienceEntrySchema, type ExperienceEntryInput } from "@/lib/validations/cv-vivo/experiencia";
import { saveExperienceEntry, deleteExperienceEntry } from "@/app/cv-vivo/experiencia/actions";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

const MAX_EXPERIENCES = 3;

export type ExperienceEntry = {
  id: string;
  companyName: string;
  roleTitle: string;
  experienceTypeId: number | null;
  sectorId: number | null;
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
};

type ExperienciaFormProps = {
  entries: ExperienceEntry[];
  experienceTypes: SelectOption[];
  sectors: SelectOption[];
};

export function ExperienciaForm({ entries, experienceTypes, sectors }: ExperienciaFormProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | "new" | null>(entries.length === 0 ? "new" : null);
  const [isDeleting, startDeleteTransition] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const editingEntry = editingId && editingId !== "new" ? entries.find((e) => e.id === editingId) ?? null : null;
  const atLimit = entries.length >= MAX_EXPERIENCES;

  function handleDelete(id: string) {
    if (!window.confirm("¿Eliminar esta experiencia de tu CV Vivo?")) return;
    setDeleteError(null);
    startDeleteTransition(async () => {
      const result = await deleteExperienceEntry(id);
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
          experienceTypes={experienceTypes}
          sectors={sectors}
          onSaved={() => {
            setEditingId(null);
            router.refresh();
          }}
          onCancel={entries.length === 0 ? undefined : () => setEditingId(null)}
        />
      ) : atLimit ? (
        <p className="text-center font-body text-small text-text-muted">
          Ya agregaste el máximo de {MAX_EXPERIENCES} experiencias.
        </p>
      ) : (
        <Button variant="outline" icon={Plus} onClick={() => setEditingId("new")}>
          Agregar otra experiencia
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
  onEdit,
  onDelete,
  disabled,
}: {
  entry: ExperienceEntry;
  onEdit: () => void;
  onDelete: () => void;
  disabled: boolean;
}) {
  return (
    <li>
      <Card elevation="sm" className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="font-body text-body font-semibold text-text-body">{entry.roleTitle}</p>
          <p className="font-body text-small text-text-muted">{entry.companyName}</p>
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

type EntryFormValues = z.input<typeof experienceEntrySchema>;

function EntryForm({
  entry,
  experienceTypes,
  sectors,
  onSaved,
  onCancel,
}: {
  entry: ExperienceEntry | null;
  experienceTypes: SelectOption[];
  sectors: SelectOption[];
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
  } = useForm<EntryFormValues, unknown, ExperienceEntryInput>({
    resolver: zodResolver(experienceEntrySchema),
    defaultValues: {
      id: entry?.id,
      companyName: entry?.companyName ?? "",
      roleTitle: entry?.roleTitle ?? "",
      experienceTypeId: entry?.experienceTypeId ?? undefined,
      sectorId: entry?.sectorId ?? undefined,
      startDate: entry?.startDate ?? "",
      endDate: entry?.endDate ?? "",
      isCurrent: entry?.isCurrent ?? false,
      description: entry?.description ?? "",
    },
  });

  const isCurrent = useWatch({ control, name: "isCurrent" });

  function onSubmit(data: ExperienceEntryInput) {
    setFormError(null);
    startTransition(async () => {
      const result = await saveExperienceEntry(data);
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
        <Field label="Empresa" required htmlFor="companyName" error={errors.companyName?.message}>
          <Input id="companyName" invalid={!!errors.companyName} {...register("companyName")} />
        </Field>
        <Field label="Puesto" required htmlFor="roleTitle" error={errors.roleTitle?.message}>
          <Input id="roleTitle" invalid={!!errors.roleTitle} {...register("roleTitle")} />
        </Field>
        <Field
          label="Tipo de experiencia"
          required
          htmlFor="experienceTypeId"
          error={errors.experienceTypeId?.message}
        >
          <Select
            id="experienceTypeId"
            placeholder="Selecciona una opción"
            options={experienceTypes}
            invalid={!!errors.experienceTypeId}
            {...register("experienceTypeId")}
          />
        </Field>
        <Field label="Sector" htmlFor="sectorId" hint="Opcional." error={errors.sectorId?.message}>
          <Select
            id="sectorId"
            placeholder="Selecciona una opción"
            options={sectors}
            invalid={!!errors.sectorId}
            {...register("sectorId")}
          />
        </Field>
        <Field label="Fecha de inicio" required htmlFor="startDate" error={errors.startDate?.message}>
          <Input id="startDate" type="date" invalid={!!errors.startDate} {...register("startDate")} />
        </Field>
        <Checkbox label="Actualmente trabajo aquí" {...register("isCurrent")} />
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
