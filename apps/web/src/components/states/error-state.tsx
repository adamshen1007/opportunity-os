export interface ErrorStateProps {
  readonly title: string;
  readonly message: string;
}

export function ErrorState({ title, message }: ErrorStateProps) {
  return (
    <div className="state state-error" role="alert">
      <strong>{title}</strong>
      <span>{message}</span>
    </div>
  );
}
