// Umbrales de inactividad para los correos #3/#4/#5 (docs/email-strategy.md
// > Decisiones abiertas): "Los umbrales de días para #3, #4 y #5 ... están
// marcados como pendientes de confirmar con negocio" — ver
// docs/pending-decisions.md #10. Valores de partida razonables, aislados
// acá como constantes nombradas para que ajustarlos no toque la lógica de
// app/api/cron/email-reminders/route.ts.
export const REMINDER_THRESHOLDS = {
  /** #3 — sin ninguna etapa iniciada, N días tras el registro. */
  noStartDays: 3,
  /** #4 — inactividad en el wizard con ≥1 etapa completada. */
  halfwayFirstDays: 5,
  /** #5 — 2do y último aviso, si el 1er aviso no generó actividad. */
  halfwaySecondDays: 10,
} as const;
