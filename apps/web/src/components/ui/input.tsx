import { InfoHint } from "./info-hint";

export interface InputProps {
  readonly label: string;
  readonly name: string;
  readonly placeholder?: string;
  readonly defaultValue?: string;
  readonly disabled?: boolean;
  readonly type?: "text" | "password" | "number";
  readonly autoComplete?: string;
  readonly hint?: string;
}

export function Input({
  label,
  name,
  placeholder,
  defaultValue,
  disabled = false,
  type = "text",
  autoComplete,
  hint
}: InputProps) {
  return (
    <label className="field">
      <span>{label}{hint ? <InfoHint label={`About ${label}`}>{hint}</InfoHint> : null}</span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        disabled={disabled}
        autoComplete={autoComplete}
      />
    </label>
  );
}
