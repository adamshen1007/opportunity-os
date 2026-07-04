import { Select } from "../../components/ui";

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Ranked", value: "ranked" },
  { label: "Generated", value: "generated" },
  { label: "Validated", value: "validated" }
] as const;

const sourceOptions = [
  { label: "All sources", value: "all" },
  { label: "Reddit", value: "reddit" },
  { label: "Analysis", value: "analysis" }
] as const;

export interface FilterPanelProps {
  readonly status?: string;
  readonly source?: string;
}

export function FilterPanel({ status = "all", source = "all" }: FilterPanelProps) {
  return (
    <div className="filter-panel">
      <Select label="Status" name="status" options={statusOptions} defaultValue={status} />
      <Select label="Source" name="source" options={sourceOptions} defaultValue={source} />
    </div>
  );
}
