import type { ReactNode } from "react";
import { InfoHint } from "./info-hint";

export interface PanelProps {
  readonly title: string;
  readonly children: ReactNode;
  readonly hint?: string;
  readonly className?: string;
}

export function Panel({ title, children, hint, className }: PanelProps) {
  return (
    <section className={`panel${className ? ` ${className}` : ""}`} aria-label={title}>
      <div className="panel-heading">
        <h3>{title}</h3>
        {hint ? <InfoHint label={`About ${title}`}>{hint}</InfoHint> : null}
      </div>
      {children}
    </section>
  );
}
