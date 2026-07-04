import type { ButtonHTMLAttributes } from "react";

export interface ButtonProps {
  readonly children: string;
  readonly type?: "button" | "submit";
  readonly disabled?: boolean;
  readonly onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
}

export function Button({ children, type = "button", disabled = false, onClick }: ButtonProps) {
  return (
    <button className="button" type={type} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
