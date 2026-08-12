import type { UseFormRegisterReturn } from "react-hook-form";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";

type PhoneFieldProps = {
  countries: SelectOption[];
  countryFieldProps: UseFormRegisterReturn;
  numberFieldProps: UseFormRegisterReturn;
  invalidCountry?: boolean;
  invalidNumber?: boolean;
};

// Teléfono con selector de prefijo por país (CLAUDE.md > Modelo de datos >
// profiles.phone) — evita errores de formato del prefijo al escribirlo a
// mano y homogeneiza el dato entre países.
export function PhoneField({
  countries,
  countryFieldProps,
  numberFieldProps,
  invalidCountry,
  invalidNumber,
}: PhoneFieldProps) {
  return (
    <div className="flex gap-2">
      <div className="w-32 shrink-0">
        <Select
          id="phoneCountryId"
          placeholder="Prefijo"
          options={countries}
          invalid={invalidCountry}
          {...countryFieldProps}
        />
      </div>
      <div className="flex-1">
        <Input
          id="phoneNumber"
          type="tel"
          autoComplete="tel-national"
          invalid={invalidNumber}
          {...numberFieldProps}
        />
      </div>
    </div>
  );
}
