import { Progress as BaseProgress } from '@base-ui/react/progress';
import { LoaderCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.ts';

export interface ProgressBarProps extends Omit<BaseProgress.Root.Props, 'className' | 'children'> {
  /** What is progressing, e.g. "Import progress". Shown above the bar unless `hideLabel`. */
  label: ReactNode;
  /** Keep the label for screen readers only. */
  hideLabel?: boolean;
  /** Show the formatted value (e.g. "40%") beside the label. */
  showValue?: boolean;
  tone?: 'brand' | 'success' | 'warning' | 'danger';
  className?: string;
}

const indicatorTone = {
  brand: 'bg-brand',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
} as const;

/**
 * A horizontal bar for a task's progress. Pass `value={null}` while the amount is unknown.
 * For a share of a target (not a running task), the same bar works: say so in the label.
 */
export function ProgressBar({
  label,
  hideLabel = false,
  showValue = false,
  tone = 'brand',
  value,
  className,
  ...props
}: ProgressBarProps) {
  return (
    <BaseProgress.Root value={value} className={cn('grid gap-1.5', className)} {...props}>
      <div
        className={cn('flex items-center justify-between gap-3 text-sm', hideLabel && 'sr-only')}
      >
        <BaseProgress.Label className="font-medium">{label}</BaseProgress.Label>
        {showValue && value !== null && (
          <BaseProgress.Value className="text-fg-muted tabular-nums" />
        )}
      </div>
      <BaseProgress.Track className="h-1.5 overflow-hidden rounded-full bg-surface-hover">
        <BaseProgress.Indicator
          className={cn(
            'block h-full rounded-full transition-[width] duration-normal ease-standard',
            indicatorTone[tone],
            'data-indeterminate:w-1/3 data-indeterminate:animate-[ggem-progress_1.2s_ease-in-out_infinite]',
            'motion-reduce:data-indeterminate:w-full motion-reduce:data-indeterminate:animate-none'
          )}
        />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
}

export interface SpinnerProps {
  /** Announced to screen readers, e.g. "Saving farmer". Omit when nearby text already says it. */
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const spinnerSize = { sm: 'size-4', md: 'size-5', lg: 'size-8' } as const;

/** A small busy indicator for a button or a region that is waiting. Prefer Skeleton for loads. */
export function Spinner({ label, size = 'md', className }: SpinnerProps) {
  const icon = (
    <LoaderCircle
      className={cn(
        'shrink-0 animate-spin text-fg-muted motion-reduce:animate-none',
        spinnerSize[size],
        className
      )}
      aria-hidden
    />
  );
  if (!label) return icon;
  return (
    <span role="status" className="inline-flex">
      {icon}
      <span className="sr-only">{label}</span>
    </span>
  );
}
