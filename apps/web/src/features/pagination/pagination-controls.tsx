export interface PaginationControlsProps {
  readonly currentPage: number;
  readonly totalPages: number;
}

export function PaginationControls({ currentPage, totalPages }: PaginationControlsProps) {
  return (
    <nav className="pagination" aria-label="Opportunity pagination">
      <a aria-disabled={currentPage <= 1} href="?page=1">
        First
      </a>
      <a aria-disabled={currentPage <= 1} href={`?page=${Math.max(currentPage - 1, 1)}`}>
        Previous
      </a>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <a aria-disabled={currentPage >= totalPages} href={`?page=${Math.min(currentPage + 1, totalPages)}`}>
        Next
      </a>
    </nav>
  );
}
