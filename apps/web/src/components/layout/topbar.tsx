import { Plus } from "lucide-react";

export interface TopbarProps {
  readonly title: string;
  readonly subtitle: string;
}

export function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <header className="topbar">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <div className="topbar-actions">
        <a className="primary-action" href="/#run-scan"><Plus aria-hidden="true" size={17} />New scan</a>
      </div>
    </header>
  );
}
