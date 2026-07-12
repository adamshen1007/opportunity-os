import { Info } from "lucide-react";

export interface InfoHintProps {
  readonly label: string;
  readonly children: string;
}

export function InfoHint({ label, children }: InfoHintProps) {
  return (
    <span className="info-hint">
      <button className="info-hint-trigger" type="button" aria-label={label} aria-describedby={`${label.replace(/\s+/gu, "-").toLowerCase()}-hint`}>
        <Info aria-hidden="true" size={14} strokeWidth={1.8} />
      </button>
      <span className="info-hint-content" id={`${label.replace(/\s+/gu, "-").toLowerCase()}-hint`} role="tooltip">
        {children}
      </span>
    </span>
  );
}
