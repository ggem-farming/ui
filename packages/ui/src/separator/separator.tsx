import { Separator as BaseSeparator } from '@base-ui/react/separator';
import { forwardRef } from 'react';
import { cn } from '../lib/cn.ts';

export type SeparatorProps = Omit<BaseSeparator.Props, 'className'> & { className?: string };

/** A dividing line between groups of content. `orientation="vertical"` inside a row. */
export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
  { className, ...props },
  ref
) {
  return (
    <BaseSeparator
      ref={ref}
      className={cn(
        'shrink-0 bg-border',
        'data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full',
        'data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch',
        className
      )}
      {...props}
    />
  );
});
