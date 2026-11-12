import { Popover as BasePopover } from '@base-ui/react/popover';
import { forwardRef } from 'react';
import { cn } from '../lib/cn.ts';
import { popupSurface } from '../lib/popup.ts';

export const Popover = BasePopover.Root;
export type PopoverProps = BasePopover.Root.Props;

/** Opens the popover. Use `render={<Button variant="secondary" />}`. */
export const PopoverTrigger = BasePopover.Trigger;

export interface PopoverContentProps extends Omit<BasePopover.Popup.Props, 'className'> {
  className?: string;
  side?: BasePopover.Positioner.Props['side'];
  align?: BasePopover.Positioner.Props['align'];
  sideOffset?: number;
}

/** Floating panel for small, non-blocking content (a filter, a quick note). */
export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  function PopoverContent(
    { className, side = 'bottom', align = 'start', sideOffset = 6, ...props },
    ref
  ) {
    return (
      <BasePopover.Portal>
        <BasePopover.Positioner
          side={side}
          align={align}
          sideOffset={sideOffset}
          className="z-(--z-popover)"
        >
          <BasePopover.Popup
            ref={ref}
            className={cn(popupSurface, 'w-72 max-w-(--available-width) p-4', className)}
            {...props}
          />
        </BasePopover.Positioner>
      </BasePopover.Portal>
    );
  }
);

export type PopoverTitleProps = Omit<BasePopover.Title.Props, 'className'> & { className?: string };

export const PopoverTitle = forwardRef<HTMLHeadingElement, PopoverTitleProps>(function PopoverTitle(
  { className, ...props },
  ref
) {
  return (
    <BasePopover.Title ref={ref} className={cn('text-base font-semibold', className)} {...props} />
  );
});

export type PopoverDescriptionProps = Omit<BasePopover.Description.Props, 'className'> & {
  className?: string;
};

export const PopoverDescription = forwardRef<HTMLParagraphElement, PopoverDescriptionProps>(
  function PopoverDescription({ className, ...props }, ref) {
    return (
      <BasePopover.Description
        ref={ref}
        className={cn('text-sm text-fg-muted', className)}
        {...props}
      />
    );
  }
);

export const PopoverClose = BasePopover.Close;
