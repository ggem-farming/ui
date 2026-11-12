import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cn } from '../lib/cn.ts';
import { Tooltip } from '../tooltip/tooltip.tsx';
import { Button, type ButtonProps } from './button.tsx';

const iconButtonSize = cva('px-0', {
  variants: {
    size: {
      sm: 'size-7 pointer-coarse:size-11',
      md: 'size-8 pointer-coarse:size-11',
      lg: 'size-10 pointer-coarse:size-11',
    },
  },
  defaultVariants: { size: 'md' },
});

export interface IconButtonProps
  extends Omit<ButtonProps, 'size' | 'aria-label'>, VariantProps<typeof iconButtonSize> {
  /** What the button does, e.g. "Close" or "Next page". Read by screen readers. */
  label: string;
  /** Show `label` as a tooltip on hover and keyboard focus. Defaults to true. */
  tooltip?: boolean;
}

/**
 * A square button showing only an icon. `label` is required: it is the accessible name and, by
 * default, a tooltip.
 */
export const IconButton = forwardRef<HTMLElement, IconButtonProps>(function IconButton(
  { label, size, variant = 'ghost', tooltip = true, className, ...props },
  ref
) {
  const button = (
    <Button
      ref={ref}
      aria-label={label}
      variant={variant}
      className={cn(iconButtonSize({ size }), className)}
      {...props}
    />
  );
  return tooltip ? <Tooltip content={label}>{button}</Tooltip> : button;
});
