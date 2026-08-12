import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Users,
  Lightbulb,
  TrendingUp,
  Globe,
  FileUser,
  Rocket,
  HeartHandshake,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/ui/Logo";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { GlyphTile } from "@/components/ui/GlyphTile";
import { StepNav } from "@/components/cv-vivo/StepNav";
import type { WizardProgress } from "@/lib/cv-vivo/progress";

const CONTACT_EMAIL = "team@clhglobal.org";

// Vista previa del riel de progreso en el Hero: no es un usuario real, solo
// ilustra "así se ve avanzar tu CV Vivo" (BeWay Design System >
// ui_kits/platform/Landing.jsx > Hero). Recorte curado de 6 etapas (no las
// 10 reales) para que la tarjeta quepa en el hero — por eso `order` es
// secuencial 1-6 en vez de los valores 2-11 reales de WIZARD_STAGES.
const HERO_PROGRESS: WizardProgress = {
  stages: [
    { slug: "personal", order: 1, label: "Información personal", implemented: true, isComplete: true },
    { slug: "presentacion", order: 2, label: "Presentación", implemented: true, isComplete: true },
    { slug: "educacion", order: 3, label: "Educación", implemented: true, isComplete: false },
    { slug: "experiencia", order: 4, label: "Experiencia", implemented: true, isComplete: false },
    { slug: "habilidades", order: 5, label: "Habilidades e idiomas", implemented: true, isComplete: false },
    { slug: "evidencias", order: 6, label: "Evidencias", implemented: true, isComplete: false },
  ],
  completedCount: 2,
  totalCount: 6,
  percent: 33,
  nextIncompleteSlug: "educacion",
};

const HEX_CLIP = "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)";

function TopBar({ hasSession }: { hasSession: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border-inverse bg-brand-dark/90 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-[1200px] items-center gap-4 px-6">
        <Logo height={32} priority />
        <div className="ml-auto flex items-center gap-3">
          {hasSession ? (
            <Button href="/cv-vivo" size="sm" iconAfter={ArrowRight}>
              Continuar mi CV Vivo
            </Button>
          ) : (
            <>
              <Button href="/iniciar-sesion" variant="ghost" size="sm" onInverse>
                Ya tengo cuenta
              </Button>
              <Button href="/registro" size="sm" iconAfter={ArrowRight}>
                Pre-regístrate
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function Hero({ hasSession }: { hasSession: boolean }) {
  return (
    <section className="relative overflow-hidden bg-brand-gradient text-text-on-inverse">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-no-repeat opacity-[0.06]"
        style={{
          backgroundImage: "url(/brand/logo-icon-transparent.png)",
          backgroundPosition: "108% -10%",
          backgroundSize: "560px",
        }}
      />
      <div className="relative mx-auto grid max-w-[1200px] gap-10 px-6 py-16 md:grid-cols-[1.15fr_0.85fr] md:items-center md:py-24">
        <div className="flex flex-col items-center gap-5 text-center md:items-start md:text-left">
          <span className="inline-flex items-center gap-2 rounded-pill border border-brand-cyan/45 bg-brand-cyan/10 px-3 py-1.5 font-body text-[12px] font-bold uppercase tracking-caps text-brand-cyan">
            <Sparkles size={14} />
            Pre-registro abierto
          </span>
          <h1 className="max-w-[620px] text-balance font-heading text-display text-white">
            Conectamos talento, impulsamos la innovación
          </h1>
          <p className="max-w-[520px] font-body text-body leading-relaxed text-white/85">
            BeWay es el ecosistema donde tu formación, tus proyectos y tus habilidades se convierten en
            oportunidades reales. Crea tu CV Vivo antes del lanzamiento.
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:justify-start">
            {hasSession ? (
              <Button href="/cv-vivo" size="lg" iconAfter={ArrowRight}>
                Continuar mi CV Vivo
              </Button>
            ) : (
              <>
                <Button href="/registro" size="lg" iconAfter={ArrowRight}>
                  Pre-regístrate
                </Button>
                <Button href="/iniciar-sesion" size="lg" variant="outline" onInverse>
                  Ya tengo cuenta
                </Button>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 font-body text-small text-text-on-inverse-muted">
            <ShieldCheck size={16} className="shrink-0 text-brand-cyan" />
            Gratis para estudiantes · 2 minutos para crear tu cuenta · Completa tu CV cuando quieras
          </div>
        </div>

        <div className="hidden justify-end md:flex">
          <div className="w-full max-w-[360px] -rotate-[1.5deg] rounded-lg shadow-lg">
            <StepNav progress={HERO_PROGRESS} currentSlug="educacion" />
          </div>
        </div>
      </div>
    </section>
  );
}

const PILLARS: { icon: typeof Users; label: string }[] = [
  { icon: Users, label: "Conectamos talento" },
  { icon: Lightbulb, label: "Impulsamos la innovación" },
  { icon: TrendingUp, label: "Generamos oportunidades" },
  { icon: Globe, label: "Construimos el futuro" },
];

function Banderola() {
  return (
    <div className="bg-gradient-footer">
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-y-5 px-6 py-5 md:grid-cols-4 md:gap-y-0">
        {PILLARS.map((pillar) => (
          <div
            key={pillar.label}
            className="flex items-center gap-3 px-4 text-white first:pl-0 md:border-l md:border-white/20 md:first:border-l-0 md:first:pl-0"
          >
            <pillar.icon size={26} strokeWidth={1.5} className="shrink-0" />
            <span className="font-body text-[12px] font-semibold uppercase leading-tight tracking-caps">
              {pillar.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const STEPS = [
  { title: "Crea tu cuenta", body: "Nombre, correo y tu contexto académico. Dos minutos, sin coste." },
  {
    title: "Completa tu CV Vivo",
    body: "Diez etapas guardables: educación, experiencia, proyectos, habilidades y evidencias.",
  },
  { title: "Entra al ecosistema", body: "Cuando lancemos, tu perfil ya estará visible para las empresas del ecosistema." },
];

function HowItWorks() {
  return (
    <section className="bg-surface-page py-16 md:py-20">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-6">
        <div>
          <SectionLabel>Cómo funciona</SectionLabel>
          <h2 className="mt-3 font-heading text-h1 text-text-heading">Tres pasos hasta tu CV Vivo</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <Card key={step.title} className="flex flex-col gap-3">
              <span
                className="grid h-[38px] w-[38px] place-items-center bg-brand-gradient-soft font-heading text-[16px] font-bold text-white"
                style={{ clipPath: HEX_CLIP }}
              >
                {index + 1}
              </span>
              <h3 className="font-heading text-h3 text-text-heading">{step.title}</h3>
              <p className="font-body text-small leading-relaxed text-text-muted">{step.body}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Adaptación honesta del ValueSection de Landing.jsx: el original habla de
// "Validated Skills" y "Corporate Bridge", productos de la plataforma
// final que CLAUDE.md marca como fuera de alcance del pre-registro. Un
// visitante anónimo no tiene contexto de que son aspiracionales (a
// diferencia de un usuario logueado, donde ComingSoon lo deja claro con un
// cartel) — así que aquí se sustituyen por lo que el pre-registro
// realmente ofrece hoy.
const VALUE = [
  {
    icon: FileUser,
    title: "CV Vivo",
    body: "Un perfil que crece contigo: educación, proyectos, habilidades y evidencias en un solo lugar.",
  },
  {
    icon: Rocket,
    title: "Acceso anticipado",
    body: "Sé de los primeros en el ecosistema BeWay cuando abramos la plataforma a las empresas.",
  },
  {
    icon: HeartHandshake,
    title: "Gratis para el talento",
    body: "Crear y completar tu CV Vivo no cuesta nada. Guarda tu progreso y retómalo cuando quieras.",
  },
];

function ValueSection() {
  return (
    <section className="bg-surface-sunken py-16 md:py-20">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-6">
        <div>
          <SectionLabel>Qué obtienes</SectionLabel>
          <h2 className="mt-3 font-heading text-h1 text-text-heading">Evidencia, no promesas</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {VALUE.map((value) => (
            <Card key={value.title} className="flex flex-col gap-3">
              <GlyphTile icon={value.icon} tone="navy" size={38} />
              <h3 className="font-heading text-h3 text-text-heading">{value.title}</h3>
              <p className="font-body text-small leading-relaxed text-text-muted">{value.body}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ hasSession }: { hasSession: boolean }) {
  return (
    <section className="bg-surface-page py-16 md:py-20">
      <div className="mx-auto max-w-[720px] px-6">
        <Card surface="inverse" elevation="lg" className="relative overflow-hidden text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(90% 120% at 50% 130%, rgba(0,212,255,.30), transparent 60%)" }}
          />
          <div className="relative flex flex-col items-center gap-4 px-6 py-12 md:px-10">
            <span className="inline-flex items-center rounded-pill bg-brand-cyan/15 px-3 py-1.5 font-body text-[12px] font-bold uppercase tracking-caps text-brand-cyan">
              100% completo = insignia especial
            </span>
            <h2 className="max-w-[480px] font-heading text-h1 text-white">
              Empieza tu CV Vivo hoy y llega listo al lanzamiento
            </h2>
            <p className="max-w-[440px] font-body text-body text-text-on-inverse-muted">
              Guardas tu progreso etapa por etapa. Cuando abramos la plataforma, tu perfil ya estará listo.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {hasSession ? (
                <Button href="/cv-vivo" size="lg" iconAfter={ArrowRight}>
                  Continuar mi CV Vivo
                </Button>
              ) : (
                <Button href="/registro" size="lg" iconAfter={ArrowRight}>
                  Pre-regístrate
                </Button>
              )}
              <Button href={`mailto:${CONTACT_EMAIL}`} size="lg" variant="ghost" onInverse>
                ¿Eres empresa? Habla con nosotros
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-brand-dark py-10">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-6 px-6">
        <Logo height={28} />
        <div className="flex w-full flex-col items-center gap-3 border-t border-border-inverse pt-6 font-body text-small text-text-on-inverse-muted md:flex-row md:justify-between">
          <p>© {year} BeWay. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            {/* Política de Privacidad y Términos y Condiciones: pendiente de
                revisión legal (CLAUDE.md > Privacidad y GDPR/LOPDGDD) — sin
                página propia todavía, así que quedan como texto plano, no
                enlaces rotos. Contacto sí es real: mismo correo que usan
                los mensajes de error de la app. */}
            <span>Privacidad</span>
            <span>Términos</span>
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white hover:underline">
              Contacto
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Landing pública (CLAUDE.md > app/(marketing)/). Consciente de la sesión:
// si ya hay una cuenta con sesión activa, todos los CTA retoman el CV Vivo
// en vez de mandar de nuevo al formulario de alta — BeWay Design System >
// ui_kits/platform/Landing.jsx, adaptado para ser honesto sobre lo que el
// pre-registro ofrece hoy (ver ValueSection y FinalCTA arriba).
export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const hasSession = Boolean(user);

  return (
    <div className="flex flex-1 flex-col">
      <TopBar hasSession={hasSession} />
      <Hero hasSession={hasSession} />
      <Banderola />
      <HowItWorks />
      <ValueSection />
      <FinalCTA hasSession={hasSession} />
      <Footer />
    </div>
  );
}
