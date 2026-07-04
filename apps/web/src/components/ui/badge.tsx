export interface BadgeProps {
  readonly children: string;
  readonly tone?: "neutral" | "success" | "warning";
}

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
