import {
  columnVisibilityFeature,
  createColumnHelper,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
  type CellData,
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  type Row,
  type RowData,
  type RowSelectionState,
  type SortingState,
  type TableFeatures,
  type ColumnVisibilityState,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { useMemo, type MouseEvent, type ReactNode } from 'react';
import { Checkbox } from '../checkbox/checkbox.tsx';
import { cn } from '../lib/cn.ts';
import { EmptyState, ErrorState, Skeleton } from '../state/states.tsx';
import { Pagination } from './pagination.tsx';

// The type parameters must match table-core's declaration exactly for the merge to apply.
/* eslint-disable @typescript-eslint/no-unused-vars */
declare module '@tanstack/table-core' {
  interface ColumnMeta<
    in out TFeatures extends TableFeatures,
    in out TData extends RowData,
    TValue extends CellData = CellData,
  > {
    /** Right-align numbers and money. */
    align?: 'left' | 'right';
    /** Role in the phone card: `title`, `subtitle` (joined with ·), `trailing`, or `false` to hide. */
    card?: 'title' | 'subtitle' | 'trailing' | false;
    /** `low` columns hide until the table is wide (64rem), e.g. phone, field officer. */
    priority?: 'low';
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */

/** The table features the kit registers: sorting, pagination, row selection, column visibility. */
export const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
    datetime: sortFn_datetime,
    basic: sortFn_basic,
  },
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowSelectionFeature,
  columnVisibilityFeature,
});

export type DataTableFeatures = typeof dataTableFeatures;
// `any` is TanStack's own convention for a list of columns with different value types.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DataTableColumn<TData extends RowData> = ColumnDef<DataTableFeatures, TData, any>;
export type DataTableRow<TData extends RowData> = Row<DataTableFeatures, TData>;
export type { PaginationState, RowSelectionState, SortingState };
/** Column ID → visible. Only an explicit `false` hides a column. */
export type VisibilityState = ColumnVisibilityState;

/**
 * Typed column helper. Build the list with `col.columns([...])` so each column keeps its own value
 * type; annotating the array as `DataTableColumn<T>[]` would widen cell values to `any`.
 * ```ts
 * const col = createDataTableColumnHelper<Farmer>();
 * const columns = col.columns([col.accessor('name', { header: 'Farmer' })]);
 * ```
 */
export function createDataTableColumnHelper<TData extends RowData>() {
  return createColumnHelper<DataTableFeatures, TData>();
}

const INTERACTIVE =
  'a, button, input, select, textarea, label, [role="checkbox"], [role="menuitem"]';
const EMPTY: never[] = [];

export interface DataTableProps<TData extends RowData> {
  /** Name of the table for screen readers, e.g. "Farmers". */
  'aria-label': string;
  columns: readonly DataTableColumn<TData>[];
  data: readonly TData[] | undefined;
  /** Stable ID per row (never the index). */
  getRowId: (row: TData) => string;
  /** Text naming a row, used for its selection checkbox, e.g. the farmer's name. */
  getRowLabel?: (row: TData) => string;

  /**
   * Total rows on the server. Setting it switches to server mode: `data` is the current page,
   * already sorted; the table only reports `sorting` and `pagination` changes.
   */
  rowCount?: number;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
  /** Show checkboxes. Selection is keyed by row ID, across pages. */
  enableRowSelection?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  /** Page sizes offered; `false` hides the footer (e.g. short fixed lists). */
  pageSizes?: readonly number[] | false;

  /**
   * Mouse shortcut: open the row when it is clicked anywhere. Keyboard users need a link in the
   * first column too. Clicks on links, buttons and checkboxes in the row are ignored.
   */
  onRowClick?: (row: TData) => void;

  /** First load with no data yet: shows skeleton rows. */
  loading?: boolean;
  /** Refetching with data shown: keeps rows and shows a progress line. */
  fetching?: boolean;
  /**
   * Why the load failed, e.g. "Check your connection and try again." The table supplies the title
   * ("Couldn't load farmers"). With rows still shown it appears as a banner above them.
   */
  error?: ReactNode;
  onRetry?: () => void;
  /** Shown when there are no rows; say why and offer the next step. */
  empty?: ReactNode;
  className?: string;
}

function sortLabel(direction: false | 'asc' | 'desc') {
  if (direction === 'asc') return 'ascending' as const;
  if (direction === 'desc') return 'descending' as const;
  return 'none' as const;
}

/**
 * A data table that fills the remaining height, with sorting, paging, selection, loading, error
 * and empty states. Narrow containers (under 42rem) show cards instead of a table.
 */
export function DataTable<TData extends RowData>({
  'aria-label': label,
  columns,
  data,
  getRowId,
  getRowLabel,
  rowCount,
  sorting,
  onSortingChange,
  pagination,
  onPaginationChange,
  columnVisibility,
  onColumnVisibilityChange,
  enableRowSelection = false,
  rowSelection,
  onRowSelectionChange,
  pageSizes = [25, 50, 100],
  onRowClick,
  loading = false,
  fetching = false,
  error,
  onRetry,
  empty,
  className,
}: DataTableProps<TData>) {
  const server = rowCount !== undefined;
  // Without a footer every row shows on one page.
  const [firstPageSize = 1_000_000] = pageSizes || [];

  const allColumns = useMemo<DataTableColumn<TData>[]>(() => {
    if (!enableRowSelection) return [...columns];
    const select: DataTableColumn<TData> = {
      id: '__select',
      enableSorting: false,
      enableHiding: false,
      meta: { card: false },
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all rows on this page"
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
          onCheckedChange={(checked) => {
            table.toggleAllPageRowsSelected(checked);
          }}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label={`Select ${getRowLabel ? getRowLabel(row.original) : `row ${String(row.index + 1)}`}`}
          checked={row.getIsSelected()}
          onCheckedChange={(_checked, details) => {
            row.getToggleSelectedHandler()(details.event);
          }}
        />
      ),
    };
    return [select, ...columns];
  }, [columns, enableRowSelection, getRowLabel]);

  const state = {
    ...(sorting && { sorting }),
    ...(pagination && { pagination }),
    ...(columnVisibility && { columnVisibility }),
    ...(rowSelection && { rowSelection }),
  };

  const table = useTable({
    features: dataTableFeatures,
    columns: allColumns,
    data: data ?? EMPTY,
    getRowId,
    manualSorting: server,
    // First click always sorts ascending (TanStack would start numbers descending).
    sortDescFirst: false,
    manualPagination: server,
    ...(server && { rowCount }),
    enableRowSelection,
    initialState: { pagination: { pageIndex: 0, pageSize: firstPageSize } },
    state,
    ...(onSortingChange && { onSortingChange }),
    ...(onPaginationChange && { onPaginationChange }),
    ...(onColumnVisibilityChange && { onColumnVisibilityChange }),
    ...(onRowSelectionChange && { onRowSelectionChange }),
  });

  const rows = table.getRowModel().rows;
  const headers = table.getHeaderGroups();
  const visibleColumns = table.getVisibleLeafColumns();
  const total = server ? rowCount : table.getPrePaginatedRowModel().rows.length;
  const page = table.state.pagination;
  const showInitialLoading = loading && rows.length === 0;
  const showBlockingError =
    error !== undefined && error !== null && error !== false && rows.length === 0;
  const showEmpty = !showInitialLoading && !showBlockingError && rows.length === 0;

  const rowClick = (row: TData) =>
    onRowClick &&
    ((event: MouseEvent) => {
      if ((event.target as HTMLElement).closest(INTERACTIVE)) return;
      onRowClick(row);
    });

  const alignClass = (align?: 'left' | 'right') => (align === 'right' ? 'text-right' : 'text-left');
  const priorityClass = (priority?: 'low') => (priority === 'low' ? 'hidden @5xl:table-cell' : '');

  const titleColumnId =
    visibleColumns.find((c) => c.columnDef.meta?.card === 'title')?.id ??
    visibleColumns.find((c) => c.id !== '__select' && c.columnDef.meta?.card !== false)?.id;

  return (
    <div className={cn('@container relative flex min-h-0 flex-1 flex-col', className)}>
      {fetching && rows.length > 0 && (
        <div className="absolute inset-x-0 top-0 z-(--z-header) h-0.5 overflow-hidden" aria-hidden>
          <div className="h-full w-1/3 animate-[ggem-progress_1.2s_ease-in-out_infinite] bg-brand motion-reduce:w-full motion-reduce:animate-none" />
        </div>
      )}

      {error !== undefined && error !== null && error !== false && rows.length > 0 && (
        <ErrorState
          variant="banner"
          title={`Couldn't refresh ${label.toLowerCase()}`}
          description={error}
          onRetry={onRetry}
          className="m-3"
        />
      )}

      {showBlockingError ? (
        <ErrorState
          title={`Couldn't load ${label.toLowerCase()}`}
          description={error}
          onRetry={onRetry}
          className="flex-1"
        />
      ) : showInitialLoading ? (
        <div role="status" aria-busy="true" className="flex flex-col gap-px border-t border-border">
          <span className="sr-only">Loading {label.toLowerCase()}…</span>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="flex items-center gap-4 border-b border-border px-5 py-3">
              <Skeleton className="size-6 rounded-full" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="ml-auto h-4 w-20" />
            </div>
          ))}
        </div>
      ) : showEmpty ? (
        <div className="flex flex-1 flex-col justify-center border-t border-border">
          {empty ?? (
            <EmptyState title="No results" description="Try changing or clearing the filters." />
          )}
        </div>
      ) : (
        <>
          {/* Table from 42rem of container width. */}
          <div className="hidden min-h-0 flex-1 overflow-auto border-t border-border @2xl:block">
            <table
              aria-label={label}
              aria-busy={fetching || undefined}
              className="w-full text-sm whitespace-nowrap"
            >
              <thead className="sticky top-0 z-(--z-sticky) bg-surface-muted text-xs text-fg-muted">
                {headers.map((group) => (
                  <tr key={group.id} className="border-b border-border">
                    {group.headers.map((header, i) => {
                      const meta = header.column.columnDef.meta;
                      const canSort = header.column.getCanSort();
                      const direction = header.column.getIsSorted();
                      const Icon =
                        direction === 'asc'
                          ? ArrowUp
                          : direction === 'desc'
                            ? ArrowDown
                            : ChevronsUpDown;
                      return (
                        <th
                          key={header.id}
                          scope="col"
                          aria-sort={canSort ? sortLabel(direction) : undefined}
                          className={cn(
                            'h-9 px-3 font-medium',
                            i === 0 && 'pl-5',
                            i === group.headers.length - 1 && 'pr-5',
                            header.column.id === '__select' && 'w-10',
                            alignClass(meta?.align),
                            priorityClass(meta?.priority)
                          )}
                        >
                          {header.isPlaceholder ? null : canSort ? (
                            <button
                              type="button"
                              onClick={header.column.getToggleSortingHandler()}
                              className={cn(
                                'group inline-flex items-center gap-1 rounded-sm hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                                meta?.align === 'right' && 'flex-row-reverse',
                                direction && 'text-fg'
                              )}
                            >
                              <table.FlexRender header={header} />
                              <Icon
                                className={cn(
                                  'size-3.5',
                                  !direction && 'opacity-40 group-hover:opacity-100'
                                )}
                                aria-hidden
                              />
                            </button>
                          ) : (
                            <table.FlexRender header={header} />
                          )}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={rowClick(row.original)}
                    data-selected={row.getIsSelected() || undefined}
                    className={cn(
                      'border-b border-border hover:bg-surface-muted data-selected:bg-brand-soft/40',
                      onRowClick && 'cursor-pointer'
                    )}
                  >
                    {row.getVisibleCells().map((cell, i, cells) => {
                      const meta = cell.column.columnDef.meta;
                      return (
                        <td
                          key={cell.id}
                          className={cn(
                            'h-11 px-3',
                            i === 0 && 'pl-5',
                            i === cells.length - 1 && 'pr-5',
                            alignClass(meta?.align),
                            meta?.align === 'right' && 'tabular-nums',
                            priorityClass(meta?.priority)
                          )}
                        >
                          <table.FlexRender cell={cell} />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards below 42rem of container width. */}
          <ul
            aria-label={label}
            className="divide-y divide-border border-t border-border @2xl:hidden"
          >
            {rows.map((row) => {
              const cells = row.getVisibleCells();
              const select = cells.find((c) => c.column.id === '__select');
              const title = cells.find((c) => c.column.id === titleColumnId);
              const subtitles = cells.filter((c) => c.column.columnDef.meta?.card === 'subtitle');
              const trailing = cells.filter((c) => c.column.columnDef.meta?.card === 'trailing');
              return (
                // Mouse shortcut only; the link in the card is the keyboard path.
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
                <li
                  key={row.id}
                  onClick={rowClick(row.original)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-3',
                    onRowClick && 'cursor-pointer'
                  )}
                >
                  {select && <table.FlexRender cell={select} />}
                  <div className="min-w-0 flex-1">
                    {title && (
                      <div className="truncate font-medium">
                        <table.FlexRender cell={title} />
                      </div>
                    )}
                    {subtitles.length > 0 && (
                      <div className="mt-0.5 flex min-w-0 flex-wrap gap-x-1.5 text-sm text-fg-muted">
                        {subtitles.map((cell, i) => (
                          <span key={cell.id} className="truncate">
                            {i > 0 && <span aria-hidden>· </span>}
                            <table.FlexRender cell={cell} />
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {trailing.map((cell) => (
                    <div key={cell.id} className="shrink-0">
                      <table.FlexRender cell={cell} />
                    </div>
                  ))}
                </li>
              );
            })}
          </ul>
        </>
      )}

      {pageSizes && total > 0 && !showBlockingError && (
        <Pagination
          className="border-t border-border px-3 py-2 lg:px-5"
          pageIndex={page.pageIndex}
          pageSize={page.pageSize}
          rowCount={total}
          pageSizes={pageSizes}
          onPageIndexChange={(pageIndex) => {
            table.setPageIndex(pageIndex);
          }}
          onPageSizeChange={(pageSize) => {
            table.setPagination({ pageIndex: 0, pageSize });
          }}
        />
      )}
    </div>
  );
}
