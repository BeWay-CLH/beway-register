import fs from "node:fs";
import path from "node:path";
import type { ReactNode } from "react";
import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { registerCvFonts } from "@/lib/cv-pdf/fonts";
import type { CvPdfData } from "@/lib/cv-pdf/get-cv-pdf-data";

registerCvFonts();

// Nota: logo-negative-inline-transparent.png y logo-stacked-negative.png
// (el que usa components/ui/Logo.tsx) están truncados en el repo — les
// falta el IDAT final y el chunk IEND. El navegador lo disimula (sharp/
// next-image son tolerantes a PNGs incompletos), pero el decodificador de
// @react-pdf/renderer no, y descarta la imagen en silencio con un warning
// "Incomplete or corrupt PNG file". logo-icon-transparent.png sí está
// íntegro — se usa ese acá hasta que se regenere el asset correcto.
const LOGO_BUFFER = fs.readFileSync(path.join(process.cwd(), "public", "brand", "logo-icon-transparent.png"));

// Tokens de marca (tailwind.config.ts) — react-pdf no lee CSS/Tailwind, así
// que se repiten acá como constantes planas.
const BRAND = {
  dark: "#0B132B",
  cyan: "#00D4FF",
  gray: "#64748B",
  bodyText: "#334155",
  headerMuted: "#B8C1D9",
  tagBg: "#EFF3F8",
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 10,
    color: BRAND.dark,
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: BRAND.dark,
    paddingHorizontal: 40,
    paddingVertical: 28,
  },
  logo: { width: 26, height: 29, marginBottom: 14, objectFit: "contain" },
  name: { fontFamily: "Space Grotesk", fontWeight: 700, fontSize: 22, color: "#FFFFFF" },
  headline: { marginTop: 4, fontSize: 11, color: BRAND.headerMuted },
  contactRow: { marginTop: 10, flexDirection: "row", flexWrap: "wrap" },
  contactItem: { fontSize: 9, color: BRAND.headerMuted, marginRight: 14 },
  body: { paddingHorizontal: 40, paddingTop: 24, paddingBottom: 50 },
  section: { marginBottom: 16 },
  sectionTitle: {
    fontFamily: "Space Grotesk",
    fontWeight: 700,
    fontSize: 12,
    color: BRAND.dark,
    letterSpacing: 0.6,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: BRAND.cyan,
  },
  entry: { marginBottom: 10 },
  entryTitleRow: { flexDirection: "row", justifyContent: "space-between" },
  entryTitle: { fontFamily: "Inter", fontWeight: 600, fontSize: 10.5, color: BRAND.dark },
  entryMeta: { fontSize: 9, color: BRAND.gray, marginTop: 1 },
  entryDates: { fontSize: 9, color: BRAND.gray },
  entryDescription: { marginTop: 3, fontSize: 9.5, lineHeight: 1.4, color: BRAND.bodyText },
  tagsRow: { flexDirection: "row", flexWrap: "wrap" },
  tag: {
    fontSize: 9,
    color: BRAND.dark,
    backgroundColor: BRAND.tagBg,
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginRight: 6,
    marginBottom: 6,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: BRAND.gray,
  },
});

function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("es-ES", { month: "short", year: "numeric" });
}

function formatRange(start: string | null, end: string | null, isCurrent: boolean) {
  const startLabel = formatDate(start);
  const endLabel = isCurrent ? "Actualidad" : formatDate(end);
  return [startLabel, endLabel].filter(Boolean).join(" — ");
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section} wrap={false}>
      <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
      {children}
    </View>
  );
}

// CV en PDF con la marca de BeWay (feedback de negocio, sept. 2026):
// alojado como documento react-pdf independiente de la UI del wizard, para
// que Server Actions y la ruta de generación admin lo compartan sin
// depender de nada del árbol de componentes de la app. Layout de una sola
// columna a propósito: el contenido varía mucho en longitud por perfil (0
// a 3 experiencias/proyectos/certificaciones), y una sola columna nunca
// desbalancea entre columnas al paginar.
export function CvDocument({ data }: { data: CvPdfData }) {
  const contactParts = [data.email, data.phone, data.countryName].filter((part): part is string => Boolean(part));

  return (
    <Document title={`CV — ${data.fullName}`} author="BeWay">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- Image de @react-pdf/renderer, no <img>: no tiene prop alt. */}
          <Image src={LOGO_BUFFER} style={styles.logo} />
          <Text style={styles.name}>{data.fullName}</Text>
          {data.headline && <Text style={styles.headline}>{data.headline}</Text>}
          <View style={styles.contactRow}>
            {contactParts.map((part) => (
              <Text key={part} style={styles.contactItem}>
                {part}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.body}>
          {data.bio && (
            <Section title="Presentación">
              <Text style={styles.entryDescription}>{data.bio}</Text>
            </Section>
          )}

          {data.education.length > 0 && (
            <Section title="Educación">
              {data.education.map((entry, index) => (
                <View key={index} style={styles.entry} wrap={false}>
                  <View style={styles.entryTitleRow}>
                    <Text style={styles.entryTitle}>{entry.studyField ?? "Carrera sin especificar"}</Text>
                    <Text style={styles.entryDates}>
                      {formatRange(entry.startDate, entry.endDate, entry.isCurrent)}
                    </Text>
                  </View>
                  <Text style={styles.entryMeta}>{entry.university ?? "Universidad sin especificar"}</Text>
                  {entry.description && <Text style={styles.entryDescription}>{entry.description}</Text>}
                </View>
              ))}
            </Section>
          )}

          {data.experiences.length > 0 && (
            <Section title="Experiencia">
              {data.experiences.map((entry, index) => (
                <View key={index} style={styles.entry} wrap={false}>
                  <View style={styles.entryTitleRow}>
                    <Text style={styles.entryTitle}>{entry.roleTitle}</Text>
                    <Text style={styles.entryDates}>
                      {formatRange(entry.startDate, entry.endDate, entry.isCurrent)}
                    </Text>
                  </View>
                  <Text style={styles.entryMeta}>{entry.companyName}</Text>
                  {entry.description && <Text style={styles.entryDescription}>{entry.description}</Text>}
                </View>
              ))}
            </Section>
          )}

          {data.projects.length > 0 && (
            <Section title="Proyectos y actividades">
              {data.projects.map((entry, index) => (
                <View key={index} style={styles.entry} wrap={false}>
                  <View style={styles.entryTitleRow}>
                    <Text style={styles.entryTitle}>{entry.name}</Text>
                    <Text style={styles.entryDates}>{formatRange(entry.startDate, entry.endDate, false)}</Text>
                  </View>
                  {(entry.typeName || entry.url) && (
                    <Text style={styles.entryMeta}>{[entry.typeName, entry.url].filter(Boolean).join(" · ")}</Text>
                  )}
                  {entry.description && <Text style={styles.entryDescription}>{entry.description}</Text>}
                </View>
              ))}
            </Section>
          )}

          {data.skills.length > 0 && (
            <Section title="Habilidades">
              <View style={styles.tagsRow}>
                {data.skills.map((skill) => (
                  <Text key={skill} style={styles.tag}>
                    {skill}
                  </Text>
                ))}
              </View>
            </Section>
          )}

          {data.languages.length > 0 && (
            <Section title="Idiomas">
              <View style={styles.tagsRow}>
                {data.languages.map((lang, index) => (
                  <Text key={index} style={styles.tag}>
                    {lang.name}
                    {lang.proficiency ? ` · ${lang.proficiency}` : ""}
                  </Text>
                ))}
              </View>
            </Section>
          )}

          {data.certifications.length > 0 && (
            <Section title="Formación complementaria">
              {data.certifications.map((entry, index) => (
                <View key={index} style={styles.entry} wrap={false}>
                  <View style={styles.entryTitleRow}>
                    <Text style={styles.entryTitle}>{entry.name}</Text>
                    {entry.issueDate && <Text style={styles.entryDates}>{formatDate(entry.issueDate)}</Text>}
                  </View>
                  {(entry.institution || entry.typeName) && (
                    <Text style={styles.entryMeta}>
                      {[entry.institution, entry.typeName].filter(Boolean).join(" · ")}
                    </Text>
                  )}
                </View>
              ))}
            </Section>
          )}

          {data.evidences.length > 0 && (
            <Section title="Enlaces">
              {data.evidences.map((entry, index) => (
                <Text key={index} style={styles.entryDescription}>
                  {entry.label}: {entry.url}
                </Text>
              ))}
            </Section>
          )}
        </View>

        <View style={styles.footer} fixed>
          <Text>Generado por BeWay</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
