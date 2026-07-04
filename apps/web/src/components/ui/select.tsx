export interface SelectOption {
  readonly label: string;
  readonly value: string;
}

export interface SelectProps {
  readonly label: string;
  readonly name: string;
  readonly options: readonly SelectOption[];
  readonly defaultValue?: string;
  readonly disabled?: boolean;
}

export function Select({ label, name, options, defaultValue, disabled = false }: SelectProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <select name={name} disabled={disabled} defaultValue={defaultValue ?? options[0]?.value}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
