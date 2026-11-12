import { cva } from 'class-variance-authority';
import { AlertTriangle, CircleCheck, Info, OctagonAlert, X } from 'lucide-react';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/cn.ts';
import { inlineIconButton } from '../lib/popup.ts';

const alert = cva('flex items-start gap-3 rounded-lg border px-4 py-3 text-sm', {
  variants: {
    tone: {
      neutral: 'border-border bg-surface-muted text-fg',
      info: 'border-transparent bg-info-soft text-on-info-soft',
      success: 'border-transparent bg-success-soft text-on-success-soft',
      warning: 'border-transparent bg-warning-soft text-on-warning-soft',
      danger: 'border-transparent bg-danger-soft text-on-danger-soft',
    },
  },
  defaultVariants: { tone: 'info' },
});

const icons = {
  neutral: Info,
  info: Info,
  success: CircleCheck,
  warning: AlertTriangle,
  danger: OctagonAlert,
} as const;

export type AlertTone = keyof typeof icons;

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: AlertTone;
  /** A short summary in bold. The children add detail. */
  title?: ReactNode;
  /** A button or link for the next step, e.g. "Review payouts". */
  action?: ReactNode;
  /** Shows a close button. Omit for messages the user must not dismiss. */
  onDismiss?: () => void;
  /**
   * Announce the message when it appears. Defaults to true for `danger`; use it for messages that
   * appear after an action, not for notes present when the page loads.
   */
  live?: boolean;
}

/**
 * An inline message about the page or a region: a warning, a result or a note. For a failed load
 * use `ErrorState`; for a passing confirmation after an action, use the app's toast.
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { tone = 'info', title, action, onDismiss, live, className, children, ...props },
  ref
) {
  const Icon = icons[tone];
  const announce = live ?? tone === 'danger';
  return (
    <div
      ref={ref}
      role={announce ? (tone === 'danger' ? 'alert' : 'status') : undefined}
      className={cn(alert({ tone }), className)}
      {...props}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-2">
        <div className="min-w-[min(100%,14rem)] flex-1 space-y-0.5">
          {title && <p className="font-semibold">{title}</p>}
          {children && <div className="[&_a]:font-medium [&_a]:underline">{children}</div>}
        </div>
        {action && <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
          className={cn(inlineIconButton, '-my-0.5 -mr-1 text-current hover:text-current')}
        >
          <X className="size-4" aria-hidden />
        </button>
      )}
    </div>
  );
});
