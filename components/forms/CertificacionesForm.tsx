"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Plus, Pencil, Trash2, ArrowRight, ExternalLink } from "lucide-react";
import {
  certificationEntrySchema,
  type CertificationEntryInput,
} from "@/lib/validations/cv-vivo/certificaciones";
import { saveCertificationEntry, deleteCertificationEntry } from "@/app/cv-vivo/certificaciones/actions";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

const MAX_CERTIFICATIONS = 3;

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
  const [isDeleting, startDeleteTransition] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const editingEntry = editingId && editingId !== "new" ? entries.find((e) => e.id === editingId) ?? null : null;
  const atLimit = entries.length >= MAX_CERTIFICATIONS;

  function handleDelete(id: string) {
    if (!window.confirm("¿Eliminar esta certificación de tu CV Vivo?")) return;
    setDeleteError(null);
    startDeleteTransition(async () => {
      const result = await deleteCertificationEntry(id);
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
              certificationTypes={certificationTypes}
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
          certificationTypes={certificationTypes}
          onSaved={() => {
            setEditingId(null);
            router.refresh();
          }}
          onCancel={entries.length === 0 ? undefined : () => setEditingId(null)}
        />
      ) : atLimit ? (
        <p className="text-center font-body text-small text-text-muted">
          Ya agregaste el máximo de {MAX_CERTIFICATIONS} certificaciones.
        </p>
      ) : (
        <Button variant="outline" icon={Plus} onClick={() => setEditingId("new")}>
          Agregar otra certificación
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
  certificationTypes,
  onEdit,
  onDelete,
  disabled,
}: {
  entry: CertificationEntry;
  certificationTypes: SelectOption[];
  onEdit: () => void;
  onDelete: () => void;
  disabled: boolean;
}) {
  const typeName = certificationTypes.find((t) => t.value === entry.certificationTypeId)?.label;

  return (
    <li>
      <Card elevation="sm" className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="font-body text-body font-semibold text-text-body">{entry.name}</p>
          {(entry.institution || typeName) && (
            <p className="font-body text-small text-text-muted">
              {[entry.institution, typeName].filter(Boolean).join(" · ")}
            </p>
          )}
          {entry.issueDate && (
            <p className="font-body text-small text-text-muted">
              {new Date(entry.issueDate).toLocaleDateString("es-ES", { month: "short", year: "numeric" })}
            </p>
          )}
          {entry.credentialUrl && (
            <a
              href={entry.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-body text-small text-link hover:text-link-hover hover:underline"
            >
              Ver credencial <ExternalLink size={12} />
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
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Card elevation="sm" className="flex flex-col gap-5">
        <Field label="Nombre del curso o certificación" required htmlFor="name" error={errors.name?.message}>
          <Input id="name" invalid={!!errors.name} {...register("name")} />
        </Field>
        <Field label="Tipo" required htmlFor="certificationTypeId" error={errors.certificationTypeId?.message}>
          <Select
            id="certificationTypeId"
            placeholder="Selecciona una opción"
            options={certificationTypes}
            invalid={!!errors.certificationTypeId}
            {...register("certificationTypeId")}
          />
        </Field>
        <Field label="Institución" htmlFor="institution" hint="Opcional." error={errors.institution?.message}>
          <Input id="institution" invalid={!!errors.institution} {...register("institution")} />
        </Field>
        <Field label="Fecha de emisión" htmlFor="issueDate" hint="Opcional." error={errors.issueDate?.message}>
          <Input id="issueDate" type="date" invalid={!!errors.issueDate} {...register("issueDate")} />
        </Field>
        <Field
          label="Enlace a la credencial"
          htmlFor="credentialUrl"
          hint="Opcional. Incluye https:// al inicio."
          error={errors.credentialUrl?.message}
        >
          <Input
            id="credentialUrl"
            type="url"
            placeholder="https://…"
            invalid={!!errors.credentialUrl}
            {...register("credentialUrl")}
          />
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
