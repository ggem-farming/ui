import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/cn.ts';

export interface RecordLayoutProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Identity, status and actions; usually a RecordHeader. */
  header: ReactNode;
  /** Key facts beside the content (right rail from 1024px, above the content on smaller screens). */
  aside?: ReactNode;
  /** Name of the aside region for screen readers. */
  asideLabel?: string;
  /** The record's sections, usually Tabs kept in the URL. */
  children: ReactNode;
}

/** One layout for every record page (farmer, contract, partner): header, summary rail, tabs. */
export const RecordLayout = forwardRef<HTMLDivElement, RecordLayoutProps>(function RecordLayout(
  { header, aside, asideLabel = 'Summary', children, className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        'mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-8 lg:py-8',
        className
      )}
      {...props}
    >
      {header}
      <div
        className={cn('grid gap-6', aside !== undefined && 'lg:grid-cols-[minmax(0,1fr)_18rem]')}
      >
        {aside !== undefined && (
          <aside aria-label={asideLabel} className="flex flex-col gap-4 lg:order-last">
            {aside}
          </aside>
        )}
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
});

export interface RecordHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  /** An Avatar or icon. */
  media?: ReactNode;
  /** A Badge with the record's status. */
  status?: ReactNode;
  /** One line of context, e.g. "GGEM farmer · Chikwawa hub · Registered 4 Mar 2025". */
  meta?: ReactNode;
  /** The main action visible; the rest in an overflow menu. */
  actions?: ReactNode;
  /** Defaults to h2 because the PageBar title is the page's h1. */
  as?: 'h1' | 'h2';
}

export const RecordHeader = forwardRef<HTMLDivElement, RecordHeaderProps>(function RecordHeader(
  { title, media, status, meta, actions, as: Heading = 'h2', className, ...props },
  ref
) {
  return (
    <div ref={ref} className={cn('flex flex-wrap items-center gap-3', className)} {...props}>
      {media}
      <div className="min-w-[12rem] flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Heading className="text-2xl font-semibold tracking-tight">{title}</Heading>
          {status}
        </div>
        {meta && <p className="text-sm text-fg-muted">{meta}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
});

export interface DetailItem {
  label: ReactNode;
  /** Shown as "—" (read as "Not recorded") when null, undefined or an empty string. */
  value?: ReactNode;
}

export interface DetailListProps extends HTMLAttributes<HTMLDListElement> {
  items: readonly DetailItem[];
  /** Two columns from 640px. */
  columns?: 1 | 2;
}

/** Label/value pairs for record details. Never shows raw IDs or true/false: format values first. */
export const DetailList = forwardRef<HTMLDListElement, DetailListProps>(function DetailList(
  { items, columns = 1, className, ...props },
  ref
) {
  return (
    <dl
      ref={ref}
      className={cn('grid text-sm', columns === 2 && 'gap-x-8 sm:grid-cols-2', className)}
      {...props}
    >
      {items.map((item, i) => {
        const empty = item.value === undefined || item.value === null || item.value === '';
        return (
          <div key={i} className="flex justify-between gap-4 border-b border-border py-2.5">
            <dt className="text-fg-muted">{item.label}</dt>
            <dd className="text-right font-medium">
              {empty ? (
                <>
                  <span aria-hidden className="text-fg-muted">
                    —
                  </span>
                  <span className="sr-only">Not recorded</span>
                </>
              ) : (
                item.value
              )}
            </dd>
          </div>
        );
      })}
    </dl>
  );
});
