"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useWatch, type Control, type FieldValues, type FieldPath, type UseFormSetValue } from "react-hook-form";
import { clsx } from "clsx";
import { Search, Loader2, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type UniversityOption = { id: number; name: string };

type UniversitySelectProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  setValue: UseFormSetValue<TFieldValues>;
  name: FieldPath<TFieldValues>;
  countryId: string | null | undefined;
  id?: string;
  invalid?: boolean;
};

const RESULT_LIMIT = 50;
const SEARCH_DEBOUNCE_MS = 200;

// Combobox con búsqueda (CLAUDE.md > UX del wizard): con países como
// Estados Unidos rondando las 2300 universidades, ni una lista completa en
// el cliente ni un <select> nativo son navegables en mobile. Se busca
// server-side (ilike, acotado por país) a medida que el usuario escribe, en
// vez de mandar el catálogo completo o filtrar en memoria.
export function UniversitySelect<TFieldValues extends FieldValues>({
  control,
  setValue,
  name,
  countryId,
  id,
  invalid,
}: UniversitySelectProps<TFieldValues>) {
  const value = useWatch({ control, name }) as number | undefined;
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const listboxId = `${inputId}-listbox`;

  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<UniversityOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [resolvedId, setResolvedId] = useState<number | undefined>(undefined);
  const [fallbackOption, setFallbackOption] = useState<UniversityOption | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const previousCountryId = useRef(countryId);

  // "Otra universidad" (country_id null): se busca una sola vez y se fija al
  // final del listado, sin importar el texto de búsqueda — siempre debe ser
  // alcanzable como salida de emergencia.
  useEffect(() => {
    let cancelled = false;
    createClient()
      .from("universities")
      .select("id, name")
      .is("country_id", null)
      .eq("is_active", true)
      .limit(1)
      .then(({ data }) => {
        if (!cancelled && data?.[0]) setFallbackOption(data[0]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Resuelve el nombre a mostrar cuando el valor viene de fuera (editar una
  // entrada existente o precarga del Paso 1), no de una selección hecha acá.
  useEffect(() => {
    if (!value || value === resolvedId) return;
    let cancelled = false;
    createClient()
      .from("universities")
      .select("name")
      .eq("id", value)
      .single()
      .then(({ data }) => {
        if (cancelled || !data) return;
        setInputValue(data.name);
        setResolvedId(value);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Si el usuario cambia de país después de haber elegido universidad, esa
  // selección ya no aplica.
  useEffect(() => {
    if (previousCountryId.current !== countryId) {
      previousCountryId.current = countryId;
      setValue(name, undefined as never, { shouldDirty: true });
      setInputValue("");
      setResolvedId(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryId]);

  // Búsqueda con debounce, acotada al país activo.
  useEffect(() => {
    if (!countryId || !isOpen) return;

    let cancelled = false;
    const timeout = setTimeout(() => {
      if (cancelled) return;
      setIsSearching(true);
      createClient()
        .from("universities")
        .select("id, name")
        .eq("country_id", countryId)
        .eq("is_active", true)
        .ilike("name", `%${inputValue.trim()}%`)
        .order("name")
        .limit(RESULT_LIMIT)
        .then(({ data, error }) => {
          if (cancelled) return;
          setOptions(!error && data ? data : []);
          setIsSearching(false);
        });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [countryId, inputValue, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen]);

  const visibleOptions =
    fallbackOption && !options.some((o) => o.id === fallbackOption.id) ? [...options, fallbackOption] : options;

  function selectOption(option: UniversityOption) {
    setValue(name, option.id as never, { shouldValidate: true, shouldDirty: true });
    setResolvedId(option.id);
    setInputValue(option.name);
    setIsOpen(false);
    setHighlighted(-1);
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
    setIsOpen(true);
    setHighlighted(-1);
    if (resolvedId !== undefined) {
      setResolvedId(undefined);
      setValue(name, undefined as never, { shouldDirty: true });
    }
  }

  function handleBlur() {
    // Pequeño margen para que el mousedown de una opción se procese antes de
    // cerrar y descartar el texto libre sin selección.
    setTimeout(() => {
      setIsOpen(false);
      if (resolvedId === undefined) setInputValue("");
    }, 150);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!countryId) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setHighlighted((current) => Math.min(current + 1, visibleOptions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlighted((current) => Math.max(current - 1, 0));
    } else if (event.key === "Enter") {
      if (isOpen && highlighted >= 0 && visibleOptions[highlighted]) {
        event.preventDefault();
        selectOption(visibleOptions[highlighted]);
      }
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
          <Search size={16} />
        </span>
        <input
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={highlighted >= 0 ? `${listboxId}-option-${highlighted}` : undefined}
          aria-invalid={invalid || undefined}
          autoComplete="off"
          disabled={!countryId}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={!countryId ? "Primero selecciona tu país" : "Escribe para buscar tu universidad…"}
          className={clsx(
            "h-control-md w-full rounded-md border bg-surface-card pl-9 pr-9 font-body text-body text-text-body placeholder:text-text-muted",
            "transition-all duration-fast ease-standard focus-visible:outline-none focus-visible:shadow-focus-ring",
            "disabled:cursor-not-allowed disabled:bg-surface-sunken",
            invalid
              ? "border-status-danger focus-visible:border-status-danger"
              : "border-border-strong focus-visible:border-brand-cyan",
          )}
        />
        {isSearching && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
            <Loader2 size={16} className="animate-spin" />
          </span>
        )}
      </div>

      {isOpen && countryId && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-10 mt-1 max-h-64 w-full overflow-auto rounded-md border border-border-subtle bg-surface-card py-1 shadow-lg"
        >
          {visibleOptions.length === 0 && !isSearching && (
            <li className="px-3 py-2 font-body text-small text-text-muted">
              {inputValue.trim() ? "Sin resultados. Intenta con otro nombre." : "Escribe para buscar."}
            </li>
          )}
          {visibleOptions.map((option, index) => (
            <li
              key={option.id}
              id={`${listboxId}-option-${index}`}
              role="option"
              aria-selected={resolvedId === option.id}
              onMouseDown={(event) => {
                event.preventDefault();
                selectOption(option);
              }}
              onMouseEnter={() => setHighlighted(index)}
              className={clsx(
                "flex cursor-pointer items-center justify-between gap-2 px-3 py-2 font-body text-body text-text-body",
                (highlighted === index || resolvedId === option.id) && "bg-surface-sunken",
              )}
            >
              <span className="truncate">{option.name}</span>
              {resolvedId === option.id && <Check size={16} className="shrink-0 text-brand-cyan" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
