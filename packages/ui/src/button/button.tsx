import { Button as BaseButton } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cn } from '../lib/cn.ts';

export const buttonVariants = cva(
  [
    'inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap',
    'rounded-md border font-medium transition-colors duration-fast ease-standard select-none',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
    'data-disabled:cursor-not-allowed data-disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    'pointer-coarse:min-h-11',
  ],
  {
    variants: {
      variant: {
        primary:
          'border-transparent bg-primary text-on-primary shadow-xs hover:not-data-disabled:bg-primary-hover',
        secondary:
          'border-border bg-surface text-fg shadow-xs hover:not-data-disabled:bg-surface-muted',
        ghost:
          'border-transparent bg-transparent text-fg-muted hover:not-data-disabled:bg-surface-muted hover:not-data-disabled:text-fg',
        danger:
          'border-transparent bg-danger text-on-danger shadow-xs hover:not-data-disabled:bg-danger-hover',
      },
      size: {
        sm: 'h-7 px-2.5 text-sm',
        md: 'h-8 px-3 text-base',
        lg: 'h-10 px-4 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

export interface ButtonProps
  extends Omit<BaseButton.Props, 'className'>, VariantProps<typeof buttonVariants> {
  className?: string;
}

/**
 * An action button. Use `primary` for the main action of a view (one per view), `secondary` for
 * other actions, `ghost` for low-emphasis actions in toolbars and tables, and `danger` only for
 * destructive confirmations. For navigation, style a link instead so it keeps the link role:
 * `<a href="…" className={buttonVariants({ variant: 'secondary' })}>`.
 */
export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  { className, variant, size, ...props },
  ref
) {
  return (
    <BaseButton ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
});
