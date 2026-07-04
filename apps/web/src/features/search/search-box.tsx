import { Input } from "../../components/ui";

export interface SearchBoxProps {
  readonly defaultValue?: string;
}

export function SearchBox({ defaultValue = "" }: SearchBoxProps) {
  return <Input label="Search" name="q" placeholder="Search opportunities, evidence, or feedback" defaultValue={defaultValue} />;
}
