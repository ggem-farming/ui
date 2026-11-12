import { AlertTriangle, RefreshCw } from 'lucide-react';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Button } from '../button/button.tsx';
import { cn } from '../lib/cn.ts';

/**
 * A placeholder shape while data loads. Size it like the content it replaces. Skeletons are
 * hidden from screen readers, so wrap them in a region that says what is loading:
 * `<div role="status" aria-busy="true"><span className="sr-only">Loading farmers…</span>…</div>`.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'animate-pulse rounded-md bg-surface-hover motion-reduce:animate-none',
        className
      )}
    />
  );
}

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** A simple line icon, e.g. `<Users />`. */
  icon?: ReactNode;
  title: ReactNode;
  /** Why it is empty and what to do next. */
  description?: ReactNode;
  /** The next step, e.g. a "Register farmer" button or "Clear filters". */
  action?: ReactNode;
}

/** Shown when a list or region has no data. Always say why and offer the next step. */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { icon, title, description, action, className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn('flex flex-col items-center px-6 py-12 text-center', className)}
      {...props}
    >
      {icon && (
        <div className="mb-3 grid size-10 place-items-center rounded-lg border border-border bg-surface text-fg-muted shadow-xs [&_svg]:size-5">
          {icon}
        </div>
      )}
      <p className="text-base font-semibold">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-fg-muted">{description}</p>}
      {action && <div className="mt-4 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  );
});

export interface ErrorStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  /** What failed and what the user can do. Avoid raw technical messages. */
  description?: ReactNode;
  /** Shows a "Try again" button. */
  onRetry?: () => void;
  /** True while retrying: the button is disabled and spins. */
  retrying?: boolean;
  /** `block` replaces a region; `banner` sits above content that is still shown. */
  variant?: 'block' | 'banner';
}

/**
 * Shown when data fails to load. Never show zeros or "no results" for a failed load.
 * Announced to screen readers when it appears.
 */
export const ErrorState = forwardRef<HTMLDivElement, ErrorStateProps>(function ErrorState(
  {
    title = "Couldn't load this",
    description = 'Check your connection and try again.',
    onRetry,
    retrying = false,
    variant = 'block',
    className,
    ...props
  },
  ref
) {
  const retry = onRetry && (
    <Button
      variant="secondary"
      size="sm"
      disabled={retrying}
      focusableWhenDisabled
      onClick={onRetry}
    >
      <RefreshCw
        className={cn(retrying && 'animate-spin motion-reduce:animate-none')}
        aria-hidden
      />
      Try again
    </Button>
  );

  if (variant === 'banner') {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'flex flex-wrap items-center gap-3 rounded-lg border border-border bg-danger-soft px-4 py-3 text-on-danger-soft',
          className
        )}
        {...props}
      >
        <AlertTriangle className="size-4 shrink-0" aria-hidden />
        <div className="min-w-0 flex-1 text-sm">
          <p className="font-semibold">{title}</p>
          {description && <p>{description}</p>}
        </div>
        {retry}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      role="alert"
      className={cn('flex flex-col items-center px-6 py-12 text-center', className)}
      {...props}
    >
      <div className="mb-3 grid size-10 place-items-center rounded-lg bg-danger-soft text-on-danger-soft">
        <AlertTriangle className="size-5" aria-hidden />
      </div>
      <p className="text-base font-semibold">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-fg-muted">{description}</p>}
      {retry && <div className="mt-4">{retry}</div>}
    </div>
  );
});
