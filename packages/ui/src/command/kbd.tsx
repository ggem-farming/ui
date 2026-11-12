import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../lib/cn.ts';

/**
 * A keyboard key, e.g. `<Kbd>⌘</Kbd><Kbd>K</Kbd>` or `<Kbd>Enter</Kbd>`. Pair symbol-only keys with
 * text for screen readers (`aria-label="Command"`) where the meaning isn't otherwise given.
 */
export const Kbd = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function Kbd(
  { className, ...props },
  ref
) {
  return (
    <kbd
      ref={ref}
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-surface-muted px-1',
        'font-mono text-[0.6875rem] leading-none font-medium text-fg-muted',
        className
      )}
      {...props}
    />
  );
});
