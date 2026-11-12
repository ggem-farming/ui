import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import type { ReactElement, ReactNode } from 'react';
import { cn } from '../lib/cn.ts';

export type TooltipProviderProps = BaseTooltip.Provider.Props;

/**
 * Optional: wrap the app once so moving between tooltips shows the next one without a delay.
 */
export function TooltipProvider({ delay = 500, closeDelay = 0, ...props }: TooltipProviderProps) {
  return <BaseTooltip.Provider delay={delay} closeDelay={closeDelay} {...props} />;
}

export interface TooltipProps {
  /** Short text shown on hover and keyboard focus. Never put essential information only here. */
  content: ReactNode;
  /** The element that triggers the tooltip; it must accept a ref and props (e.g. a Button). */
  children: ReactElement;
  side?: BaseTooltip.Positioner.Props['side'];
  className?: string;
}

/** A small hint for a control. Icon-only controls still need their own accessible name. */
export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  return (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger render={children} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner side={side} sideOffset={6} className="z-(--z-tooltip)">
          <BaseTooltip.Popup
            className={cn(
              'origin-(--transform-origin) rounded-md bg-primary px-2 py-1 text-xs font-medium text-on-primary shadow-md',
              'transition-[scale,opacity] duration-fast ease-standard',
              'data-starting-style:scale-95 data-starting-style:opacity-0',
              'data-ending-style:scale-95 data-ending-style:opacity-0 data-instant:transition-none',
              className
            )}
          >
            {content}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}
