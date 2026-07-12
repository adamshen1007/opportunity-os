import type { SelectHTMLAttributes } from "react";
import { InfoHint } from "./info-hint";

export interface SelectOption {
  readonly label: string;
  readonly value: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "name" | "defaultValue"> {
  readonly label: string;
  readonly name: string;
  readonly options: readonly SelectOption[];
  readonly defaultValue?: string;
  readonly disabled?: boolean;
  readonly hint?: string;
}

export function Select({ label, name, options, defaultValue, disabled = false, hint, ...selectProps }: SelectProps) {
  return (
    <label className="field">
      <span>{label}{hint ? <InfoHint label={`About ${label}`}>{hint}</InfoHint> : null}</span>
      <select
        name={name}
        disabled={disabled}
        defaultValue={selectProps.value === undefined ? (defaultValue ?? options[0]?.value) : undefined}
        {...selectProps}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
