export interface ButtonProps {
  readonly children: string;
  readonly type?: "button" | "submit";
  readonly disabled?: boolean;
}

export function Button({ children, type = "button", disabled = false }: ButtonProps) {
  return (
    <button className="button" type={type} disabled={disabled}>
      {children}
    </button>
  );
}
