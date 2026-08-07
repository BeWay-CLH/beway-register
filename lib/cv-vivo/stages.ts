import type { Database } from "@/lib/supabase/database.types";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

// Contexto para calcular completitud. profiles alcanza para las etapas 2-3,
// pero desde la etapa 4 la completitud depende de tablas hijas (education,
// experiences, etc.) — cada una agrega su propia señal aquí cuando se
// implementa, en vez de rediseñar esto de una vez para las 10 etapas.
export type WizardContext = {
  profile: ProfileRow;
  hasEducation: boolean;
  hasExperience: boolean;
  hasProjects: boolean;
  hasSkills: boolean;
  hasLanguages: boolean;
  hasCertifications: boolean;
  hasPreferences: boolean;
  hasEvidences: boolean;
};

export type WizardStage = {
  slug: string;
  order: number;
  label: string;
  description: string;
  /** false = ruta ya existe (aparece en el stepper) pero aún es un stub. */
  implemented: boolean;
  isComplete: (ctx: WizardContext) => boolean;
};

// Etapas 2-11 del CV Vivo (CLAUDE.md > Modelo de datos). El Paso 1
// (creación de cuenta) no cuenta aquí — ya se resolvió en /registro.
// Cada etapa define su propio criterio de "completa": campos legítimamente
// opcionales (ej. teléfono, bio) no cuentan para el % de completitud, solo
// el campo principal de la etapa.
export const WIZARD_STAGES: WizardStage[] = [
  {
    slug: "personal",
    order: 2,
    label: "Información personal",
    description: "Tu teléfono y situación académica actual.",
    implemented: true,
    isComplete: (ctx) => ctx.profile.academic_status_id !== null,
  },
  {
    slug: "presentacion",
    order: 3,
    label: "Presentación",
    description: "Un titular y una breve descripción de ti.",
    implemented: true,
    isComplete: (ctx) => Boolean(ctx.profile.headline),
  },
  {
    slug: "educacion",
    order: 4,
    label: "Educación",
    description: "Tu formación académica.",
    implemented: true,
    isComplete: (ctx) => ctx.hasEducation,
  },
  {
    slug: "experiencia",
    order: 5,
    label: "Experiencia",
    description: "Hasta 3 experiencias laborales.",
    implemented: true,
    isComplete: (ctx) => ctx.hasExperience,
  },
  {
    slug: "proyectos",
    order: 6,
    label: "Proyectos y actividades",
    description: "Hasta 3 proyectos o actividades.",
    implemented: true,
    isComplete: (ctx) => ctx.hasProjects,
  },
  {
    slug: "habilidades",
    order: 7,
    label: "Habilidades e idiomas",
    description: "Tus habilidades e idiomas.",
    implemented: true,
    isComplete: (ctx) => ctx.hasSkills && ctx.hasLanguages,
  },
  {
    slug: "certificaciones",
    order: 8,
    label: "Formación complementaria",
    description: "Hasta 3 cursos, certificaciones o talleres.",
    implemented: true,
    isComplete: (ctx) => ctx.hasCertifications,
  },
  {
    slug: "preferencias",
    order: 9,
    label: "Preferencias profesionales",
    description: "Qué tipo de oportunidades buscas.",
    implemented: true,
    isComplete: (ctx) => ctx.hasPreferences,
  },
  {
    slug: "evidencias",
    order: 10,
    label: "Evidencias",
    description: "Enlaces a tu portafolio, GitHub u otros.",
    implemented: true,
    isComplete: (ctx) => ctx.hasEvidences,
  },
  {
    slug: "privacidad",
    order: 11,
    label: "Privacidad",
    description: "Quién puede ver tu perfil y tus datos de contacto.",
    implemented: false,
    isComplete: () => false,
  },
];
