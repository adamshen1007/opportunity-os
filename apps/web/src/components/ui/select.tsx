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
}

export function Select({ label, name, options, defaultValue, disabled = false, ...selectProps }: SelectProps) {
  return (
    <label className="field">
      <span>{label}</span>
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
import type { SelectHTMLAttributes } from "react";
