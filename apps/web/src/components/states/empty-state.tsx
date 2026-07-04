export interface EmptyStateProps {
  readonly title: string;
  readonly message: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="state">
      <strong>{title}</strong>
      <span>{message}</span>
    </div>
  );
}
