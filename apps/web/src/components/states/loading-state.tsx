export interface LoadingStateProps {
  readonly title: string;
  readonly message: string;
}

export function LoadingState({ title, message }: LoadingStateProps) {
  return (
    <div className="state state-loading" role="status" aria-live="polite">
      <strong>{title}</strong>
      <span>{message}</span>
    </div>
  );
}
