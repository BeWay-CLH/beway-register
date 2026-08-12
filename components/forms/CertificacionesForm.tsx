"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Plus, Award } from "lucide-react";
import {
  certificationEntrySchema,
  type CertificationEntryInput,
} from "@/lib/validations/cv-vivo/certificaciones";
import { saveCertificationEntry, deleteCertificationEntry } from "@/app/cv-vivo/certificaciones/actions";
import { MAX_REPEATABLE_ENTRIES } from "@/lib/cv-vivo/limits";
import { Input } from "@/components/ui/Input";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { LoadingRow } from "@/components/ui/LoadingRow";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { FieldGroup } from "@/components/cv-vivo/FieldGroup";
import { FormField } from "@/components/cv-vivo/FormField";
import { EntryRow } from "@/components/cv-vivo/EntryRow";

export type CertificationEntry = {
  id: string;
  name: string;
  certificationTypeId: number | null;
  institution: string | null;
  issueDate: string | null;
  credentialUrl: string | null;
};

type CertificacionesFormProps = {
  entries: CertificationEntry[];
  certificationTypes: SelectOption[];
};

export function CertificacionesForm({ entries, certificationTypes }: CertificacionesFormProps) {
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
    if (!window.confirm("¿Eliminar esta certificación de tu CV Vivo?")) return;
    setDeleteError(null);
    startRefresh(async () => {
      const result = await deleteCertificationEntry(id);
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
            const typeName = certificationTypes.find((t) => t.value === entry.certificationTypeId)?.label ?? "Certificación";
            return (
              <EntryRow
                key={entry.id}
                icon={Award}
                title={entry.name}
                meta={`${entry.institution ?? "Institución"} · ${typeName}${entry.issueDate ? ` · ${new Date(entry.issueDate).toLocaleDateString("es-ES", { month: "short", year: "numeric" })}` : ""}`}
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
          certificationTypes={certificationTypes}
          onSaved={handleSaved}
          onCancel={entries.length === 0 ? undefined : () => setEditingId(null)}
        />
      ) : atLimit ? (
        <p className="text-center font-body text-small text-text-muted">
          Ya agregaste el máximo de {MAX_REPEATABLE_ENTRIES} certificaciones.
        </p>
      ) : (
        <Button variant="outline" icon={Plus} onClick={() => setEditingId("new")} disabled={isRefreshing}>
          Agregar otra certificación
        </Button>
      )}
    </div>
  );
}

type EntryFormValues = z.input<typeof certificationEntrySchema>;

function EntryForm({
  entry,
  certificationTypes,
  onSaved,
  onCancel,
}: {
  entry: CertificationEntry | null;
  certificationTypes: SelectOption[];
  onSaved: () => void;
  onCancel?: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EntryFormValues, unknown, CertificationEntryInput>({
    resolver: zodResolver(certificationEntrySchema),
    defaultValues: {
      id: entry?.id,
      name: entry?.name ?? "",
      certificationTypeId: entry?.certificationTypeId ?? undefined,
      institution: entry?.institution ?? "",
      issueDate: entry?.issueDate ?? "",
      credentialUrl: entry?.credentialUrl ?? "",
    },
  });

  function onSubmit(data: CertificationEntryInput) {
    setFormError(null);
    startTransition(async () => {
      const result = await saveCertificationEntry(data);
      if (result.status === "error") {
        setFormError(result.message);
        return;
      }
      onSaved();
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <FieldGroup title="Certificación">
        <FormField label="Nombre del curso o certificación" required span={7} htmlFor="name" error={errors.name?.message}>
          <Input id="name" invalid={!!errors.name} {...register("name")} />
        </FormField>
        <FormField label="Tipo" required span={5} htmlFor="certificationTypeId" error={errors.certificationTypeId?.message}>
          <Select
            id="certificationTypeId"
            placeholder="Selecciona una opción"
            options={certificationTypes}
            invalid={!!errors.certificationTypeId}
            {...register("certificationTypeId")}
          />
        </FormField>
        <FormField label="Institución" span={12} htmlFor="institution" error={errors.institution?.message}>
          <Input id="institution" invalid={!!errors.institution} {...register("institution")} />
        </FormField>
      </FieldGroup>

      <FieldGroup title="Fecha">
        <FormField label="Fecha de emisión" span={5} htmlFor="issueDate" error={errors.issueDate?.message}>
          <Input id="issueDate" type="date" invalid={!!errors.issueDate} {...register("issueDate")} />
        </FormField>
      </FieldGroup>

      <FieldGroup title="Detalle" caption="Opcional">
        <FormField
          label="Enlace a la credencial"
          span={12}
          htmlFor="credentialUrl"
          hint="Incluye https:// al inicio."
          error={errors.credentialUrl?.message}
        >
          <Input
            id="credentialUrl"
            type="url"
            placeholder="https://…"
            invalid={!!errors.credentialUrl}
            {...register("credentialUrl")}
          />
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
