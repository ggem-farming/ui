import {
  forwardRef,
  type HTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from 'react';
import { cn } from '../lib/cn.ts';

type Align = 'left' | 'center' | 'right';
const alignClass = (align?: Align) =>
  align === 'right' ? 'text-right tabular-nums' : align === 'center' ? 'text-center' : 'text-left';

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  /** Classes for the scrolling wrapper. */
  containerClassName?: string;
}

/**
 * A small static table: a summary, a breakdown, a comparison. It scrolls sideways when narrow.
 * For lists with sorting, paging or many rows use `DataTable`.
 */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { className, containerClassName, ...props },
  ref
) {
  return (
    <div className={cn('w-full overflow-x-auto', containerClassName)}>
      <table ref={ref} className={cn('w-full text-sm', className)} {...props} />
    </div>
  );
});

export const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  HTMLAttributes<HTMLTableCaptionElement>
>(function TableCaption({ className, ...props }, ref) {
  return (
    <caption
      ref={ref}
      className={cn('caption-top pb-2 text-left text-sm font-medium', className)}
      {...props}
    />
  );
});

export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(function TableHeader({ className, ...props }, ref) {
  return (
    <thead
      ref={ref}
      className={cn('bg-surface-muted text-xs text-fg-muted', className)}
      {...props}
    />
  );
});

export const TableBody = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(function TableBody({ className, ...props }, ref) {
  return <tbody ref={ref} className={cn('[&>tr:last-child]:border-0', className)} {...props} />;
});

/** Totals row. Put the label in the first cell and right-align the amounts. */
export const TableFooter = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(function TableFooter({ className, ...props }, ref) {
  return (
    <tfoot
      ref={ref}
      className={cn('border-t border-border bg-surface-muted font-medium', className)}
      {...props}
    />
  );
});

export const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  function TableRow({ className, ...props }, ref) {
    return <tr ref={ref} className={cn('border-b border-border', className)} {...props} />;
  }
);

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  align?: Align;
}

/** A column header (`scope="col"` by default). Use `scope="row"` for a row's label cell. */
export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead(
  { className, align, scope = 'col', ...props },
  ref
) {
  return (
    <th
      ref={ref}
      scope={scope}
      className={cn(
        'h-9 px-3 font-medium whitespace-nowrap first:pl-4 last:pr-4',
        alignClass(align),
        className
      )}
      {...props}
    />
  );
});

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  /** `right` for numbers and money; it also uses tabular figures. */
  align?: Align;
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { className, align, ...props },
  ref
) {
  return (
    <td
      ref={ref}
      className={cn('h-10 px-3 py-2 first:pl-4 last:pr-4', alignClass(align), className)}
      {...props}
    />
  );
});
