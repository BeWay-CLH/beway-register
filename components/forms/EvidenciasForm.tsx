"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Link2 } from "lucide-react";
import { evidenceEntrySchema, type EvidenceEntryInput } from "@/lib/validations/cv-vivo/evidencias";
import { saveEvidenceEntry, deleteEvidenceEntry } from "@/app/cv-vivo/evidencias/actions";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { LoadingRow } from "@/components/ui/LoadingRow";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { FieldGroup } from "@/components/cv-vivo/FieldGroup";
import { FormField } from "@/components/cv-vivo/FormField";
import { EntryRow } from "@/components/cv-vivo/EntryRow";

export type EvidenceEntry = {
  id: string;
  label: string;
  url: string;
};

type EvidenciasFormProps = {
  entries: EvidenceEntry[];
};

export function EvidenciasForm({ entries }: EvidenciasFormProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | "new" | null>(entries.length === 0 ? "new" : null);
  // Cubre tanto guardar como eliminar: vive en el padre para que siga
  // visible mientras router.refresh() trae los datos reales, aunque el
  // formulario hijo que lo disparó ya se haya desmontado.
  const [isRefreshing, startRefresh] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const editingEntry = editingId && editingId !== "new" ? entries.find((e) => e.id === editingId) ?? null : null;

  function handleDelete(id: string) {
    if (!window.confirm("¿Eliminar este enlace de tu CV Vivo?")) return;
    setDeleteError(null);
    startRefresh(async () => {
      const result = await deleteEvidenceEntry(id);
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
              icon={Link2}
              title={entry.label}
              meta={entry.url}
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
          onSaved={handleSaved}
          onCancel={entries.length === 0 ? undefined : () => setEditingId(null)}
        />
      ) : (
        <Button variant="outline" icon={Plus} onClick={() => setEditingId("new")} disabled={isRefreshing}>
          Agregar otro enlace
        </Button>
      )}
    </div>
  );
}

function EntryForm({
  entry,
  onSaved,
  onCancel,
}: {
  entry: EvidenceEntry | null;
  onSaved: () => void;
  onCancel?: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EvidenceEntryInput>({
    resolver: zodResolver(evidenceEntrySchema),
    defaultValues: {
      id: entry?.id,
      label: entry?.label ?? "",
      url: entry?.url ?? "",
    },
  });

  function onSubmit(data: EvidenceEntryInput) {
    setFormError(null);
    startTransition(async () => {
      const result = await saveEvidenceEntry(data);
      if (result.status === "error") {
        setFormError(result.message);
        return;
      }
      onSaved();
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <FieldGroup title="Enlace">
        <FormField label="Etiqueta" required span={5} hint="Ej. Portafolio, GitHub, LinkedIn." htmlFor="label" error={errors.label?.message}>
          <Input id="label" invalid={!!errors.label} {...register("label")} />
        </FormField>
        <FormField label="Enlace" required span={7} hint="Incluye https:// al inicio." htmlFor="url" error={errors.url?.message}>
          <Input id="url" type="url" placeholder="https://…" invalid={!!errors.url} {...register("url")} />
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
