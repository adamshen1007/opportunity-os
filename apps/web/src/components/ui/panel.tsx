import type { ReactNode } from "react";

export interface PanelProps {
  readonly title: string;
  readonly children: ReactNode;
}

export function Panel({ title, children }: PanelProps) {
  return (
    <section className="panel" aria-label={title}>
      <h3>{title}</h3>
      {children}
    </section>
  );
}
