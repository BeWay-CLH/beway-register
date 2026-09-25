"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Plus, Rocket } from "lucide-react";
import { projectEntrySchema, type ProjectEntryInput } from "@/lib/validations/cv-vivo/proyectos";
import { saveProjectEntry, deleteProjectEntry } from "@/app/cv-vivo/proyectos/actions";
import { MAX_REPEATABLE_ENTRIES } from "@/lib/cv-vivo/limits";
import { Input } from "@/components/ui/Input";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { LoadingRow } from "@/components/ui/LoadingRow";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { FieldGroup } from "@/components/cv-vivo/FieldGroup";
import { FormField } from "@/components/cv-vivo/FormField";
import { EntryRow } from "@/components/cv-vivo/EntryRow";

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
  // Etapa opcional (lib/cv-vivo/stages.ts): a diferencia de las etapas
  // obligatorias, no arranca con el formulario ya abierto — el usuario
  // puede llegar, ver que puede saltarla, y continuar sin fricción.
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
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
    <div className="flex flex-col gap-6">
      {entries.length > 0 && (
        <div className="flex flex-col gap-3">
          <FieldLabel>Ya añadido · {entries.length}</FieldLabel>
          {entries.map((entry) => {
            const typeName = projectTypes.find((t) => t.value === entry.projectTypeId)?.label ?? "Proyecto";
            return (
              <EntryRow
                key={entry.id}
                icon={Rocket}
                title={entry.name}
                meta={`${typeName} · ${formatDateRange(entry.startDate, entry.endDate)}`}
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
          projectTypes={projectTypes}
          onSaved={handleSaved}
          onCancel={() => setEditingId(null)}
        />
      ) : atLimit ? (
        <p className="text-center font-body text-small text-text-muted">
          Ya agregaste el máximo de {MAX_REPEATABLE_ENTRIES} proyectos.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          <Button variant="outline" icon={Plus} onClick={() => setEditingId("new")} disabled={isRefreshing}>
            {entries.length === 0 ? "Agregar proyecto" : "Agregar otro proyecto"}
          </Button>
          {entries.length === 0 && (
            <p className="text-center font-body text-[12px] text-text-muted">
              Esta etapa es opcional — puedes continuar sin añadir ninguno.
            </p>
          )}
        </div>
      )}
    </div>
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
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <FieldGroup title="Proyecto">
        <FormField label="Nombre" span={7} required htmlFor="name" error={errors.name?.message}>
          <Input id="name" invalid={!!errors.name} {...register("name")} />
        </FormField>
        <FormField label="Tipo" span={5} required htmlFor="projectTypeId" error={errors.projectTypeId?.message}>
          <Select
            id="projectTypeId"
            placeholder="Selecciona una opción"
            options={projectTypes}
            invalid={!!errors.projectTypeId}
            {...register("projectTypeId")}
          />
        </FormField>
        <FormField label="Enlace" span={12} htmlFor="url" hint="Incluye https:// al inicio." error={errors.url?.message}>
          <Input id="url" type="url" placeholder="https://…" invalid={!!errors.url} {...register("url")} />
        </FormField>
      </FieldGroup>

      <FieldGroup title="Periodo">
        <FormField label="Fecha de inicio" span={4} htmlFor="startDate" error={errors.startDate?.message}>
          <Input id="startDate" type="date" invalid={!!errors.startDate} {...register("startDate")} />
        </FormField>
        <FormField label="Fecha de fin" span={4} htmlFor="endDate" error={errors.endDate?.message}>
          <Input id="endDate" type="date" invalid={!!errors.endDate} {...register("endDate")} />
        </FormField>
      </FieldGroup>

      <FieldGroup title="Detalle" caption="Opcional">
        <FormField label="Descripción" span={12} htmlFor="description" error={errors.description?.message}>
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
