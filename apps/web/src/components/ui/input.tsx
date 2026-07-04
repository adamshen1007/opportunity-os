export interface InputProps {
  readonly label: string;
  readonly name: string;
  readonly placeholder?: string;
  readonly defaultValue?: string;
  readonly disabled?: boolean;
}

export function Input({ label, name, placeholder, defaultValue, disabled = false }: InputProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <input name={name} placeholder={placeholder} defaultValue={defaultValue} disabled={disabled} />
    </label>
  );
}
