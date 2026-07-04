import { Button } from "../../components/ui";
import { FilterPanel } from "../filters/filter-panel";
import { SearchBox } from "../search/search-box";

export function DashboardToolbar() {
  return (
    <form className="toolbar" action="/opportunities">
      <SearchBox />
      <FilterPanel />
      <Button type="submit">Apply</Button>
    </form>
  );
}
