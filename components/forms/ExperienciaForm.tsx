"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { clsx } from "clsx";
import { Plus, Briefcase } from "lucide-react";
import { experienceEntrySchema, type ExperienceEntryInput } from "@/lib/validations/cv-vivo/experiencia";
import { saveExperienceEntry, deleteExperienceEntry } from "@/app/cv-vivo/experiencia/actions";
import { MAX_REPEATABLE_ENTRIES } from "@/lib/cv-vivo/limits";
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
    if (!window.confirm("¿Eliminar esta experiencia de tu CV Vivo?")) return;
    setDeleteError(null);
    startRefresh(async () => {
      const result = await deleteExperienceEntry(id);
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
          {entries.map((entry) => (
            <EntryRow
              key={entry.id}
              icon={Briefcase}
              title={entry.roleTitle}
              meta={`${entry.companyName} · ${formatDateRange(entry.startDate, entry.endDate, entry.isCurrent)}`}
              onEdit={() => setEditingId(entry.id)}
              onDelete={() => handleDelete(entry.id)}
              disabled={isRefreshing}
            />
          ))}
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
          experienceTypes={experienceTypes}
          sectors={sectors}
          onSaved={handleSaved}
          onCancel={() => setEditingId(null)}
        />
      ) : atLimit ? (
        <p className="text-center font-body text-small text-text-muted">
          Ya agregaste el máximo de {MAX_REPEATABLE_ENTRIES} experiencias.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          <Button variant="outline" icon={Plus} onClick={() => setEditingId("new")} disabled={isRefreshing}>
            {entries.length === 0 ? "Agregar experiencia" : "Agregar otra experiencia"}
          </Button>
          {entries.length === 0 && (
            <p className="text-center font-body text-[12px] text-text-muted">
              Esta etapa es opcional — puedes continuar sin añadir ninguna.
            </p>
          )}
        </div>
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
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <FieldGroup title="Empresa">
        <FormField label="Empresa" span={7} required htmlFor="companyName" error={errors.companyName?.message}>
          <Input id="companyName" invalid={!!errors.companyName} {...register("companyName")} />
        </FormField>
        <FormField label="Puesto" span={5} required htmlFor="roleTitle" error={errors.roleTitle?.message}>
          <Input id="roleTitle" invalid={!!errors.roleTitle} {...register("roleTitle")} />
        </FormField>
        <FormField
          label="Tipo de experiencia"
          span={6}
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
        </FormField>
        <FormField label="Sector" span={6} htmlFor="sectorId" error={errors.sectorId?.message}>
          <Select
            id="sectorId"
            placeholder="Selecciona una opción"
            options={sectors}
            invalid={!!errors.sectorId}
            {...register("sectorId")}
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
          <Checkbox label="Actualmente trabajo aquí" {...register("isCurrent")} />
        </div>
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
