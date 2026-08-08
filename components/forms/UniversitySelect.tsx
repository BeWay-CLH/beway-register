"use client";

import { useEffect, useRef, useState } from "react";
import { useWatch, type Control, type FieldValues, type FieldPath, type UseFormSetValue } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { Select, type SelectOption } from "@/components/ui/Select";

type UniversitySelectProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  setValue: UseFormSetValue<TFieldValues>;
  name: FieldPath<TFieldValues>;
  countryId: string | null | undefined;
  id?: string;
  invalid?: boolean;
};

// Universidad filtrada por el país seleccionado (CLAUDE.md > UX del wizard):
// con ~6000 filas en el catálogo, mandar la lista completa al cliente en
// cada carga de página no es viable en mobile. Como universities es de
// lectura pública (RLS), se consulta directo desde el navegador solo el
// subconjunto del país activo, en vez de pasar por un catálogo cacheado.
export function UniversitySelect<TFieldValues extends FieldValues>({
  control,
  setValue,
  name,
  countryId,
  id,
  invalid,
}: UniversitySelectProps<TFieldValues>) {
  const value = useWatch({ control, name });
  const [options, setOptions] = useState<SelectOption[]>([]);
  // Derivado en vez de un `isLoading` propio: evita un setState síncrono al
  // inicio del effect (solo se actualiza dentro del .then, ya asíncrono).
  const [loadedCountryId, setLoadedCountryId] = useState<string | null | undefined>(null);
  const isLoading = !!countryId && countryId !== loadedCountryId;
  const previousCountryId = useRef(countryId);

  useEffect(() => {
    if (!countryId) return;

    let cancelled = false;

    createClient()
      .from("universities")
      .select("id, name")
      .or(`country_id.eq.${countryId},country_id.is.null`)
      .eq("is_active", true)
      .order("name")
      .then(({ data, error }) => {
        if (cancelled) return;
        setOptions(!error && data ? data.map((u) => ({ value: u.id, label: u.name })) : []);
        setLoadedCountryId(countryId);
      });

    return () => {
      cancelled = true;
    };
  }, [countryId]);

  useEffect(() => {
    // Si el usuario cambia de país después de haber elegido universidad, esa
    // selección ya no aplica: se limpia para no guardar una combinación
    // inconsistente.
    if (previousCountryId.current !== countryId) {
      previousCountryId.current = countryId;
      setValue(name, undefined as never, { shouldDirty: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryId]);

  return (
    <Select
      id={id}
      options={countryId ? options : []}
      value={(value as number | string | undefined) ?? ""}
      onChange={(event) =>
        setValue(name, (event.target.value ? Number(event.target.value) : undefined) as never, {
          shouldValidate: true,
          shouldDirty: true,
        })
      }
      placeholder={
        !countryId
          ? "Primero selecciona tu país"
          : isLoading
            ? "Cargando universidades…"
            : "Selecciona tu universidad"
      }
      disabled={!countryId || isLoading}
      invalid={invalid}
    />
  );
}
