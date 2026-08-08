"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Plus, Pencil, Trash2, ArrowRight, ExternalLink } from "lucide-react";
import { projectEntrySchema, type ProjectEntryInput } from "@/lib/validations/cv-vivo/proyectos";
import { saveProjectEntry, deleteProjectEntry } from "@/app/cv-vivo/proyectos/actions";
import { MAX_REPEATABLE_ENTRIES } from "@/lib/cv-vivo/limits";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { LoadingRow } from "@/components/ui/LoadingRow";

export type ProjectEntry = {
  id: string;
  name: string;
  projectTypeId: number | null;
  url: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
};

type ProyectosFormProps = {
  entries: ProjectEntry[];
  projectTypes: SelectOption[];
};

export function ProyectosForm({ entries, projectTypes }: ProyectosFormProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | "new" | null>(entries.length === 0 ? "new" : null);
  // Cubre tanto guardar como eliminar: vive en el padre para que siga
  // visible mientras router.refresh() trae los datos reales, aunque el
  // formulario hijo que lo disparó ya se haya desmontado.
  const [isRefreshing, startRefresh] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const editingEntry = editingId && editingId !== "new" ? entries.find((e) => e.id === editingId) ?? null : null;
  const atLimit = entries.length >= MAX_REPEATABLE_ENTRIES;

  function handleDelete(id: string) {
    if (!window.confirm("¿Eliminar este proyecto de tu CV Vivo?")) return;
    setDeleteError(null);
    startRefresh(async () => {
      const result = await deleteProjectEntry(id);
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
    <div className="flex w-full max-w-md flex-col gap-6">
      {entries.length > 0 && (
        <ul className="flex flex-col gap-3">
          {entries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              projectTypes={projectTypes}
              onEdit={() => setEditingId(entry.id)}
              onDelete={() => handleDelete(entry.id)}
              disabled={isRefreshing}
            />
          ))}
        </ul>
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
          projectTypes={projectTypes}
          onSaved={handleSaved}
          onCancel={entries.length === 0 ? undefined : () => setEditingId(null)}
        />
      ) : atLimit ? (
        <p className="text-center font-body text-small text-text-muted">
          Ya agregaste el máximo de {MAX_REPEATABLE_ENTRIES} proyectos.
        </p>
      ) : (
        <Button variant="outline" icon={Plus} onClick={() => setEditingId("new")} disabled={isRefreshing}>
          Agregar otro proyecto
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
  projectTypes,
  onEdit,
  onDelete,
  disabled,
}: {
  entry: ProjectEntry;
  projectTypes: SelectOption[];
  onEdit: () => void;
  onDelete: () => void;
  disabled: boolean;
}) {
  const typeName = projectTypes.find((t) => t.value === entry.projectTypeId)?.label;

  return (
    <li>
      <Card elevation="sm" className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="font-body text-body font-semibold text-text-body">{entry.name}</p>
          {typeName && <p className="font-body text-small text-text-muted">{typeName}</p>}
          {(entry.startDate || entry.endDate) && (
            <p className="font-body text-small text-text-muted">{formatDateRange(entry.startDate, entry.endDate)}</p>
          )}
          {entry.url && (
            <a
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-body text-small text-link hover:text-link-hover hover:underline"
            >
              Ver enlace <ExternalLink size={12} />
            </a>
          )}
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

function formatDateRange(startDate: string | null, endDate: string | null) {
  const format = (value: string) => new Date(value).toLocaleDateString("es-ES", { month: "short", year: "numeric" });
  return [startDate ? format(startDate) : "", endDate ? format(endDate) : ""].filter(Boolean).join(" — ");
}

type EntryFormValues = z.input<typeof projectEntrySchema>;

function EntryForm({
  entry,
  projectTypes,
  onSaved,
  onCancel,
}: {
  entry: ProjectEntry | null;
  projectTypes: SelectOption[];
  onSaved: () => void;
  onCancel?: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EntryFormValues, unknown, ProjectEntryInput>({
    resolver: zodResolver(projectEntrySchema),
    defaultValues: {
      id: entry?.id,
      name: entry?.name ?? "",
      projectTypeId: entry?.projectTypeId ?? undefined,
      url: entry?.url ?? "",
      startDate: entry?.startDate ?? "",
      endDate: entry?.endDate ?? "",
      description: entry?.description ?? "",
    },
  });

  function onSubmit(data: ProjectEntryInput) {
    setFormError(null);
    startTransition(async () => {
      const result = await saveProjectEntry(data);
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
        <Field label="Nombre del proyecto" required htmlFor="name" error={errors.name?.message}>
          <Input id="name" invalid={!!errors.name} {...register("name")} />
        </Field>
        <Field label="Tipo de proyecto" required htmlFor="projectTypeId" error={errors.projectTypeId?.message}>
          <Select
            id="projectTypeId"
            placeholder="Selecciona una opción"
            options={projectTypes}
            invalid={!!errors.projectTypeId}
            {...register("projectTypeId")}
          />
        </Field>
        <Field
          label="Enlace"
          htmlFor="url"
          hint="Opcional. Incluye https:// al inicio."
          error={errors.url?.message}
        >
          <Input id="url" type="url" placeholder="https://…" invalid={!!errors.url} {...register("url")} />
        </Field>
        <Field label="Fecha de inicio" htmlFor="startDate" hint="Opcional." error={errors.startDate?.message}>
          <Input id="startDate" type="date" invalid={!!errors.startDate} {...register("startDate")} />
        </Field>
        <Field label="Fecha de fin" htmlFor="endDate" hint="Opcional." error={errors.endDate?.message}>
          <Input id="endDate" type="date" invalid={!!errors.endDate} {...register("endDate")} />
        </Field>
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
          <Button type="submit" fullWidth={!onCancel} loading={isPending}>
            Guardar
          </Button>
        </div>
      </Card>
    </form>
  );
}
