import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/cn.ts';

/**
 * A strip of key figures (at most 4 per view). Columns are divided by 1px lines at any width.
 * Renders a description list; put only `Stat`s inside.
 */
export const StatGroup = forwardRef<HTMLDListElement, HTMLAttributes<HTMLDListElement>>(
  function StatGroup({ className, ...props }, ref) {
    return (
      <dl
        ref={ref}
        className={cn(
          'grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-4',
          className
        )}
        {...props}
      />
    );
  }
);

const deltaTone = {
  positive: 'bg-success-soft text-on-success-soft',
  negative: 'bg-danger-soft text-on-danger-soft',
  neutral: 'bg-neutral-soft text-on-neutral-soft',
} as const;

export interface StatProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  label: ReactNode;
  /** Formatted value, e.g. "3,527" or "MWK 1.2M". */
  value: ReactNode;
  /** Change or ratio, e.g. "+86" or "82%". Write it so it reads correctly as text. */
  delta?: ReactNode;
  /** Arrow direction for `delta`. Omit for ratios. */
  trend?: 'up' | 'down';
  /** Whether the change is good or bad news (a rising debt is `negative`). */
  deltaTone?: keyof typeof deltaTone;
  /** Context for the delta, e.g. "this month". */
  note?: ReactNode;
}

export const Stat = forwardRef<HTMLDivElement, StatProps>(function Stat(
  { label, value, delta, trend, deltaTone: tone = 'neutral', note, className, ...props },
  ref
) {
  const Arrow = trend === 'down' ? ArrowDownRight : ArrowUpRight;
  return (
    <div
      ref={ref}
      className={cn('flex flex-col bg-surface px-4 py-4 sm:px-5', className)}
      {...props}
    >
      <dt className="text-sm text-fg-muted">{label}</dt>
      <dd className="mt-1 text-xl font-medium tracking-tight tabular-nums sm:text-3xl">{value}</dd>
      {(delta !== undefined || note !== undefined) && (
        <dd className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-fg-muted">
          {delta !== undefined && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-medium tabular-nums',
                deltaTone[tone]
              )}
            >
              {trend && <Arrow className="size-3" aria-hidden />}
              {delta}
            </span>
          )}
          {note}
        </dd>
      )}
    </div>
  );
});
