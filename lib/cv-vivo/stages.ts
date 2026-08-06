import type { Database } from "@/lib/supabase/database.types";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export type WizardStage = {
  slug: string;
  order: number;
  label: string;
  description: string;
  /** false = ruta ya existe (aparece en el stepper) pero aún es un stub. */
  implemented: boolean;
  isComplete: (profile: ProfileRow) => boolean;
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
    isComplete: (profile) => profile.academic_status_id !== null,
  },
  {
    slug: "presentacion",
    order: 3,
    label: "Presentación",
    description: "Un titular y una breve descripción de ti.",
    implemented: true,
    isComplete: (profile) => Boolean(profile.headline),
  },
  {
    slug: "educacion",
    order: 4,
    label: "Educación",
    description: "Tu formación académica.",
    implemented: false,
    isComplete: () => false,
  },
  {
    slug: "experiencia",
    order: 5,
    label: "Experiencia",
    description: "Hasta 3 experiencias laborales.",
    implemented: false,
    isComplete: () => false,
  },
  {
    slug: "proyectos",
    order: 6,
    label: "Proyectos y actividades",
    description: "Hasta 3 proyectos o actividades.",
    implemented: false,
    isComplete: () => false,
  },
  {
    slug: "habilidades",
    order: 7,
    label: "Habilidades e idiomas",
    description: "Tus habilidades e idiomas.",
    implemented: false,
    isComplete: () => false,
  },
  {
    slug: "certificaciones",
    order: 8,
    label: "Formación complementaria",
    description: "Hasta 3 cursos, certificaciones o talleres.",
    implemented: false,
    isComplete: () => false,
  },
  {
    slug: "preferencias",
    order: 9,
    label: "Preferencias profesionales",
    description: "Qué tipo de oportunidades buscas.",
    implemented: false,
    isComplete: () => false,
  },
  {
    slug: "evidencias",
    order: 10,
    label: "Evidencias",
    description: "Enlaces a tu portafolio, GitHub u otros.",
    implemented: false,
    isComplete: () => false,
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
