"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, ArrowRight, ExternalLink } from "lucide-react";
import { evidenceEntrySchema, type EvidenceEntryInput } from "@/lib/validations/cv-vivo/evidencias";
import { saveEvidenceEntry, deleteEvidenceEntry } from "@/app/cv-vivo/evidencias/actions";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { LoadingRow } from "@/components/ui/LoadingRow";

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
    <div className="flex w-full max-w-md flex-col gap-6">
      {entries.length > 0 && (
        <ul className="flex flex-col gap-3">
          {entries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
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
          onSaved={handleSaved}
          onCancel={entries.length === 0 ? undefined : () => setEditingId(null)}
        />
      ) : (
        <Button variant="outline" icon={Plus} onClick={() => setEditingId("new")} disabled={isRefreshing}>
          Agregar otro enlace
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
  entry: EvidenceEntry;
  onEdit: () => void;
  onDelete: () => void;
  disabled: boolean;
}) {
  return (
    <li>
      <Card elevation="sm" className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="font-body text-body font-semibold text-text-body">{entry.label}</p>
          <a
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-body text-small text-link hover:text-link-hover hover:underline"
          >
            {entry.url} <ExternalLink size={12} />
          </a>
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
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Card elevation="sm" className="flex flex-col gap-5">
        <Field
          label="Etiqueta"
          required
          htmlFor="label"
          hint="Ej. Portafolio, GitHub, LinkedIn."
          error={errors.label?.message}
        >
          <Input id="label" invalid={!!errors.label} {...register("label")} />
        </Field>
        <Field label="Enlace" required htmlFor="url" hint="Incluye https:// al inicio." error={errors.url?.message}>
          <Input id="url" type="url" placeholder="https://…" invalid={!!errors.url} {...register("url")} />
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
