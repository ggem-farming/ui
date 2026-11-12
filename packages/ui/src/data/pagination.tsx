import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IconButton } from '../button/icon-button.tsx';
import { cn } from '../lib/cn.ts';
import { Select } from '../select/select.tsx';

export interface PaginationProps {
  /** Zero-based page index. */
  pageIndex: number;
  pageSize: number;
  /** Total rows across all pages (from the server when paging there). */
  rowCount: number;
  onPageIndexChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizes?: readonly number[];
  className?: string;
}

const count = (n: number) => n.toLocaleString('en-GB');

/** "Showing 1–25 of 3,527", rows per page, previous and next. */
export function Pagination({
  pageIndex,
  pageSize,
  rowCount,
  onPageIndexChange,
  onPageSizeChange,
  pageSizes = [25, 50, 100],
  className,
}: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(rowCount / pageSize));
  const first = rowCount === 0 ? 0 : pageIndex * pageSize + 1;
  const last = Math.min(rowCount, (pageIndex + 1) * pageSize);
  return (
    <nav
      aria-label="Pagination"
      className={cn(
        'flex flex-wrap items-center justify-between gap-2 text-sm text-fg-muted',
        className
      )}
    >
      <p role="status">
        Showing{' '}
        <span className="text-fg tabular-nums">
          {count(first)}–{count(last)}
        </span>{' '}
        of <span className="text-fg tabular-nums">{count(rowCount)}</span>
      </p>
      <div className="flex items-center gap-2">
        <span className="hidden sm:inline" aria-hidden>
          Rows per page
        </span>
        <Select
          aria-label="Rows per page"
          options={pageSizes.map((size) => ({ value: size, label: String(size) }))}
          value={pageSize}
          onValueChange={(size) => {
            if (size !== null) onPageSizeChange(size);
          }}
          className="h-7 w-20"
        />
        <IconButton
          label="Previous page"
          variant="secondary"
          size="sm"
          disabled={pageIndex <= 0}
          onClick={() => {
            onPageIndexChange(pageIndex - 1);
          }}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          label="Next page"
          variant="secondary"
          size="sm"
          disabled={pageIndex >= pageCount - 1}
          onClick={() => {
            onPageIndexChange(pageIndex + 1);
          }}
        >
          <ChevronRight />
        </IconButton>
      </div>
    </nav>
  );
}
