import Link from "next/link";
import { clsx } from "clsx";
import {
  MapPin,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  CircleCheck,
  ExternalLink,
  Building2,
  Trophy,
  Award,
  BookOpen,
  Briefcase,
  ClipboardCheck,
  Route,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { GlyphTile } from "@/components/ui/GlyphTile";
import { Tag } from "@/components/ui/Tag";
import { ComingSoon } from "@/components/ui/ComingSoon";

// Paneles de "Mi perfil y CV" (BeWay Design System > ui_kits/platform >
// Profile.jsx + ProfileSections.jsx), adaptados de la pantalla de edición
// de la plataforma final a una vista de solo lectura: acá el dato se EDITA
// en su etapa del wizard (/cv-vivo/*) y se MUESTRA acá tal como lo verán
// las empresas. Las secciones que dependen de datos que el pre-registro no
// modela (video-pitch, recomendación IA, actividad en el ecosistema) se
// muestran con su esqueleto real detrás de <ComingSoon>.

function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("es-ES", { month: "short", year: "numeric" });
}

function formatRange(start: string | null, end: string | null, isCurrent: boolean) {
  const startLabel = formatDate(start);
  const endLabel = isCurrent ? "Actualidad" : formatDate(end);
  return [startLabel, endLabel].filter(Boolean).join(" — ");
}

function EmptyStageNote({ slug, children }: { slug: string; children: string }) {
  return (
    <p className="font-body text-small text-text-muted">
      {children}{" "}
      <Link href={`/cv-vivo/${slug}`} className="font-semibold text-link hover:text-link-hover hover:underline">
        Completar
      </Link>
    </p>
  );
}

/* ── Identidad ────────────────────────────────────────────────────────── */
type IdentityPanelProps = {
  name: string;
  headline: string | null;
  countryName: string | null;
  universityName: string | null;
};

export function IdentityPanel({ name, headline, countryName, universityName }: IdentityPanelProps) {
  return (
    <Card elevation="sm" className="flex flex-col items-center gap-6 text-center sm:grid sm:grid-cols-[auto_1fr] sm:items-start sm:text-left">
      <div className="flex flex-col items-center gap-3">
        <Avatar name={name} size={96} ring />
      </div>
      <div className="flex min-w-0 flex-col items-center gap-3 sm:items-start">
        <div>
          <p className="font-heading text-h3 text-text-heading">{name}</p>
          {headline && <p className="mt-1 font-body text-small text-text-muted">{headline}</p>}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <FieldLabel icon={MapPin}>Ubicación</FieldLabel>
            <p className="font-body text-small text-text-body">{countryName ?? "Sin especificar"}</p>
          </div>
          <div>
            <FieldLabel icon={GraduationCap}>Universidad</FieldLabel>
            <p className="font-body text-small text-text-body">{universityName ?? "Sin especificar"}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ── Video pitch (fuera de alcance del pre-registro) ────────────────────── */
export function VideoPitchPanel() {
  return (
    <ComingSoon>
      <Card padding="none" elevation="sm" className="overflow-hidden">
        <div className="relative grid aspect-[16/10] place-items-center bg-surface-inverse text-center text-text-on-inverse">
          <div className="text-center">
            <p className="font-heading text-h3 font-semibold">Aún no has subido tu video pitch</p>
            <p className="mt-1.5 font-body text-small text-text-on-inverse-muted">
              Graba 60 segundos para destacar ante empresas
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 px-5 py-4">
          <div>
            <p className="font-heading text-[17px] font-semibold text-text-heading">Mi video pitch</p>
            <p className="font-body text-small text-text-muted">Presentación profesional de 60 segundos</p>
          </div>
        </div>
      </Card>
    </ComingSoon>
  );
}

/* ── CV: educación, experiencia, idiomas, presentación ──────────────────── */
type EducationSummary = {
  id: string;
  universityName: string | null;
  studyFieldName: string | null;
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
};

type ExperienceSummary = {
  id: string;
  roleTitle: string;
  companyName: string;
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
};

type LanguageSummary = { id: string; languageName: string; proficiencyName: string };

type CVPanelProps = {
  education: EducationSummary[];
  experiences: ExperienceSummary[];
  languages: LanguageSummary[];
  bio: string | null;
};

export function CVPanel({ education, experiences, languages, bio }: CVPanelProps) {
  return (
    <Card elevation="sm" className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <GlyphTile icon={Sparkles} />
        <h2 className="font-heading text-h3 text-text-heading">Mi CV</h2>
      </div>

      <div>
        <FieldLabel>Educación</FieldLabel>
        {education.length === 0 ? (
          <EmptyStageNote slug="educacion">Aún no agregaste tu formación académica.</EmptyStageNote>
        ) : (
          <ul className="flex flex-col gap-2">
            {education.map((entry) => (
              <li key={entry.id} className="font-body text-small text-text-body">
                <span className="font-medium">{entry.studyFieldName ?? "Carrera sin especificar"}</span>
                {" · "}
                {entry.universityName ?? "Universidad sin especificar"}
                <span className="text-text-muted"> · {formatRange(entry.startDate, entry.endDate, entry.isCurrent)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <FieldLabel>Experiencia</FieldLabel>
        {experiences.length === 0 ? (
          <EmptyStageNote slug="experiencia">Aún no agregaste experiencia laboral.</EmptyStageNote>
        ) : (
          <ul className="flex flex-col gap-2">
            {experiences.map((entry) => (
              <li key={entry.id} className="font-body text-small text-text-body">
                <span className="font-medium">{entry.roleTitle}</span> · {entry.companyName}
                <span className="text-text-muted"> · {formatRange(entry.startDate, entry.endDate, entry.isCurrent)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <FieldLabel>Idiomas</FieldLabel>
        {languages.length === 0 ? (
          <EmptyStageNote slug="habilidades">Aún no agregaste idiomas.</EmptyStageNote>
        ) : (
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <Tag key={lang.id}>
                {lang.languageName} · {lang.proficiencyName}
              </Tag>
            ))}
          </div>
        )}
      </div>

      <div>
        <FieldLabel>Presentación</FieldLabel>
        {bio ? (
          <p className="font-body text-small leading-relaxed text-text-body">{bio}</p>
        ) : (
          <EmptyStageNote slug="presentacion">Aún no escribiste tu presentación.</EmptyStageNote>
        )}
      </div>
    </Card>
  );
}

/* ── Skills ───────────────────────────────────────────────────────────────
   Solo el nombre de la habilidad: en pre-registro se auto-reporta, sin
   nivel ni fuente de validación (eso llega con el modelo de la plataforma
   final — no confundir con datos que no existen todavía). */
type SkillsPanelProps = { skills: { id: string; name: string }[] };

export function SkillsPanel({ skills }: SkillsPanelProps) {
  return (
    <Card elevation="sm" className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <GlyphTile icon={ShieldCheck} />
        <h2 className="font-heading text-h3 text-text-heading">Habilidades</h2>
      </div>
      {skills.length === 0 ? (
        <EmptyStageNote slug="habilidades">Aún no agregaste habilidades.</EmptyStageNote>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="flex items-center gap-2 rounded-md border border-border-subtle bg-surface-card p-4"
            >
              <CircleCheck size={16} className="shrink-0 text-status-success" />
              <span className="truncate font-heading text-[15px] font-semibold text-text-heading">{skill.name}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

/* ── Certificaciones ──────────────────────────────────────────────────── */
type CertificationSummary = {
  id: string;
  name: string;
  institution: string | null;
  issueDate: string | null;
  typeName: string | null;
};

export function CertificationsPanel({ certifications }: { certifications: CertificationSummary[] }) {
  return (
    <Card elevation="sm" className="flex flex-col gap-4">
      <h2 className="font-heading text-h3 text-text-heading">Formación complementaria</h2>
      {certifications.length === 0 ? (
        <EmptyStageNote slug="certificaciones">Aún no agregaste certificaciones.</EmptyStageNote>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {certifications.map((cert) => (
            <div key={cert.id} className="flex items-start gap-3 rounded-md border border-border-subtle p-4">
              <GlyphTile icon={Award} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-body text-small font-semibold text-text-body">{cert.name}</p>
                <p className="mt-1 truncate font-body text-[12px] text-text-muted">
                  {[cert.institution, cert.typeName].filter(Boolean).join(" · ") || "Sin institución"}
                </p>
                {cert.issueDate && (
                  <p className="mt-0.5 font-body text-[12px] text-text-muted">{formatDate(cert.issueDate)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

/* ── Proof of Work (proyectos) ────────────────────────────────────────── */
type ProjectSummary = {
  id: string;
  name: string;
  description: string | null;
  url: string | null;
  typeName: string | null;
};

export function ProofPanel({ projects }: { projects: ProjectSummary[] }) {
  return (
    <Card elevation="sm" className="flex flex-col gap-4">
      <h2 className="font-heading text-h3 text-text-heading">Proof of Work</h2>
      {projects.length === 0 ? (
        <EmptyStageNote slug="proyectos">Aún no agregaste proyectos o actividades.</EmptyStageNote>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="flex flex-col gap-3 rounded-md border border-border-subtle p-4">
              <GlyphTile icon={Briefcase} tone="navy" />
              <div>
                <p className="font-body text-small font-semibold text-text-body">{project.name}</p>
                {project.description && (
                  <p className="mt-1 line-clamp-3 font-body text-[12px] text-text-muted">{project.description}</p>
                )}
              </div>
              <div className="mt-auto flex items-center justify-between gap-2">
                {project.typeName && <Tag>{project.typeName}</Tag>}
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1 font-body text-[12px] text-link hover:text-link-hover hover:underline"
                  >
                    Ver <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

/* ── Recomendación IA (fuera de alcance del pre-registro) ───────────────── */
export function AIRecommendationPanel() {
  return (
    <ComingSoon>
      <Card elevation="sm" className="flex gap-3">
        <GlyphTile icon={Sparkles} tone="navy" />
        <div>
          <FieldLabel>Recomendación IA</FieldLabel>
          <p className="font-body text-small leading-relaxed text-text-body">
            Aquí verás sugerencias personalizadas para tu perfil, basadas en tu actividad dentro del ecosistema
            BeWay.
          </p>
        </div>
      </Card>
    </ComingSoon>
  );
}

/* ── Actividad en BeWay (fuera de alcance del pre-registro) ─────────────── */
const ACTIVITY_SKELETON = [
  { icon: Building2, label: "Empresas seguidas" },
  { icon: Trophy, label: "Challenges participados" },
  { icon: Award, label: "Challenges ganados" },
  { icon: BookOpen, label: "Certificaciones completadas" },
  { icon: Briefcase, label: "Mini proyectos completados" },
  { icon: ClipboardCheck, label: "Encuestas completadas" },
  { icon: Route, label: "Corporate Bridge seguido" },
];

export function ActivityPanel() {
  return (
    <ComingSoon>
      <Card elevation="sm">
        <h2 className="mb-4 font-heading text-h3 text-text-heading">Mi actividad en BeWay</h2>
        <div className="flex flex-col">
          {ACTIVITY_SKELETON.map(({ icon: Icon, label }, index) => (
            <div
              key={label}
              className={clsx("flex items-start gap-3 py-3", index > 0 && "border-t border-border-subtle")}
            >
              <Icon size={18} strokeWidth={1.75} className="mt-0.5 shrink-0 text-text-muted" />
              <div>
                <FieldLabel>{label}</FieldLabel>
                <p className="font-body text-small font-semibold text-text-heading">—</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </ComingSoon>
  );
}
