import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../lib/cn.ts';

const badge = cva(
  'inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap',
  {
    variants: {
      variant: {
        soft: '',
        outline: 'border border-border bg-surface text-fg',
      },
      tone: {
        neutral: '',
        brand: '',
        success: '',
        warning: '',
        danger: '',
        info: '',
      },
    },
    compoundVariants: [
      { variant: 'soft', tone: 'neutral', className: 'bg-neutral-soft text-on-neutral-soft' },
      { variant: 'soft', tone: 'brand', className: 'bg-brand-soft text-on-brand-soft' },
      { variant: 'soft', tone: 'success', className: 'bg-success-soft text-on-success-soft' },
      { variant: 'soft', tone: 'warning', className: 'bg-warning-soft text-on-warning-soft' },
      { variant: 'soft', tone: 'danger', className: 'bg-danger-soft text-on-danger-soft' },
      { variant: 'soft', tone: 'info', className: 'bg-info-soft text-on-info-soft' },
    ],
    defaultVariants: { variant: 'soft', tone: 'neutral' },
  }
);

const dotTone = {
  neutral: 'bg-neutral',
  brand: 'bg-brand',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
} as const;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badge> {
  /** Show a coloured dot before the text (the default for `outline`). */
  dot?: boolean;
}

/**
 * A short status or category label. The text must carry the meaning on its own; colour only
 * reinforces it. Map statuses to tones in one place (a status registry), not per screen.
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, variant, tone, dot, children, ...props },
  ref
) {
  const showDot = dot ?? variant === 'outline';
  return (
    <span ref={ref} className={cn(badge({ variant, tone }), className)} {...props}>
      {showDot && (
        <span className={cn('size-1.5 rounded-full', dotTone[tone ?? 'neutral'])} aria-hidden />
      )}
      {children}
    </span>
  );
});
