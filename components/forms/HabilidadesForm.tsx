"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Plus, ArrowRight, X } from "lucide-react";
import {
  skillSchema,
  languageEntrySchema,
  type SkillInput,
  type LanguageEntryInput,
} from "@/lib/validations/cv-vivo/habilidades";
import { addSkill, deleteSkill, addLanguage, deleteLanguage } from "@/app/cv-vivo/habilidades/actions";
import { Input } from "@/components/ui/Input";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";

export type SkillItem = { id: string; name: string };
export type LanguageItem = { id: string; languageId: number; proficiencyLevelId: number };

type HabilidadesFormProps = {
  skills: SkillItem[];
  languages: LanguageItem[];
  languageOptions: SelectOption[];
  proficiencyOptions: SelectOption[];
};

export function HabilidadesForm({ skills, languages, languageOptions, proficiencyOptions }: HabilidadesFormProps) {
  const router = useRouter();
  const canContinue = skills.length > 0 && languages.length > 0;

  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <SkillsSection skills={skills} onChanged={() => router.refresh()} />
      <LanguagesSection
        languages={languages}
        languageOptions={languageOptions}
        proficiencyOptions={proficiencyOptions}
        onChanged={() => router.refresh()}
      />
      {canContinue && (
        <Button size="lg" fullWidth iconAfter={ArrowRight} onClick={() => router.push("/cv-vivo")}>
          Continuar
        </Button>
      )}
    </div>
  );
}

function SkillsSection({ skills, onChanged }: { skills: SkillItem[]; onChanged: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SkillInput>({
    resolver: zodResolver(skillSchema),
    defaultValues: { name: "" },
  });

  function onSubmit(data: SkillInput) {
    setError(null);
    startTransition(async () => {
      const result = await addSkill(data);
      if (result.status === "error") {
        setError(result.message);
        return;
      }
      reset({ name: "" });
      onChanged();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteSkill(id);
      onChanged();
    });
  }

  return (
    <div className="flex flex-col gap-3 text-left">
      <h2 className="font-heading text-h3 text-brand-dark">Habilidades</h2>
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Tag key={skill.id} onRemove={() => handleDelete(skill.id)}>
              {skill.name}
            </Tag>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex items-start gap-2">
        <div className="flex-1">
          <Input placeholder="Ej. Excel, Python, diseño…" invalid={!!errors.name} {...register("name")} />
        </div>
        <Button type="submit" icon={Plus} disabled={isPending}>
          Agregar
        </Button>
      </form>
      {(errors.name?.message ?? error) && (
        <p role="alert" className="font-body text-small text-status-danger">
          {errors.name?.message ?? error}
        </p>
      )}
    </div>
  );
}

type LanguageFormValues = z.input<typeof languageEntrySchema>;

function LanguagesSection({
  languages,
  languageOptions,
  proficiencyOptions,
  onChanged,
}: {
  languages: LanguageItem[];
  languageOptions: SelectOption[];
  proficiencyOptions: SelectOption[];
  onChanged: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LanguageFormValues, unknown, LanguageEntryInput>({
    resolver: zodResolver(languageEntrySchema),
  });

  function onSubmit(data: LanguageEntryInput) {
    setError(null);
    startTransition(async () => {
      const result = await addLanguage(data);
      if (result.status === "error") {
        setError(result.message);
        return;
      }
      reset({ languageId: undefined, proficiencyLevelId: undefined });
      onChanged();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteLanguage(id);
      onChanged();
    });
  }

  return (
    <div className="flex flex-col gap-3 text-left">
      <h2 className="font-heading text-h3 text-brand-dark">Idiomas</h2>
      {languages.length > 0 && (
        <ul className="flex flex-col gap-2">
          {languages.map((lang) => (
            <li
              key={lang.id}
              className="flex items-center justify-between rounded-md border border-border-subtle bg-surface-card px-4 py-2"
            >
              <span className="font-body text-small text-text-body">
                {languageOptions.find((o) => o.value === lang.languageId)?.label} —{" "}
                {proficiencyOptions.find((o) => o.value === lang.proficiencyLevelId)?.label}
              </span>
              <button
                type="button"
                onClick={() => handleDelete(lang.id)}
                aria-label="Eliminar"
                className="rounded-md p-1.5 text-text-muted transition-colors duration-fast ease-standard hover:bg-surface-sunken hover:text-status-danger"
              >
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Select
            placeholder="Idioma"
            options={languageOptions}
            invalid={!!errors.languageId}
            {...register("languageId")}
          />
        </div>
        <div className="flex-1">
          <Select
            placeholder="Nivel"
            options={proficiencyOptions}
            invalid={!!errors.proficiencyLevelId}
            {...register("proficiencyLevelId")}
          />
        </div>
        <Button type="submit" icon={Plus} disabled={isPending}>
          Agregar
        </Button>
      </form>
      {(errors.languageId?.message || errors.proficiencyLevelId?.message || error) && (
        <p role="alert" className="font-body text-small text-status-danger">
          {errors.languageId?.message ?? errors.proficiencyLevelId?.message ?? error}
        </p>
      )}
    </div>
  );
}
