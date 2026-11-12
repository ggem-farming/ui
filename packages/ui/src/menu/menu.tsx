import { Menu as BaseMenu } from '@base-ui/react/menu';
import { Check } from 'lucide-react';
import { forwardRef } from 'react';
import { cn } from '../lib/cn.ts';
import { popupItem, popupSurface } from '../lib/popup.ts';

export const Menu = BaseMenu.Root;
export type MenuProps = BaseMenu.Root.Props;

/**
 * Opens the menu. For a row's overflow actions:
 * `<MenuTrigger render={<IconButton label="Actions for Chikondi Banda"><MoreHorizontal /></IconButton>} />`.
 */
export const MenuTrigger = BaseMenu.Trigger;

export interface MenuContentProps extends Omit<BaseMenu.Popup.Props, 'className'> {
  className?: string;
  side?: BaseMenu.Positioner.Props['side'];
  align?: BaseMenu.Positioner.Props['align'];
  sideOffset?: number;
}

export const MenuContent = forwardRef<HTMLDivElement, MenuContentProps>(function MenuContent(
  { className, side = 'bottom', align = 'start', sideOffset = 4, ...props },
  ref
) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        className="z-(--z-popover) outline-none"
      >
        <BaseMenu.Popup
          ref={ref}
          className={cn(popupSurface, 'min-w-48 max-w-(--available-width) p-1', className)}
          {...props}
        />
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
});

const itemIcons = '[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-fg-muted';

export interface MenuItemProps extends Omit<BaseMenu.Item.Props, 'className'> {
  className?: string;
  /** `danger` for destructive actions; confirm them with ConfirmDialog. */
  tone?: 'default' | 'danger';
}

export const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(function MenuItem(
  { className, tone = 'default', ...props },
  ref
) {
  return (
    <BaseMenu.Item
      ref={ref}
      className={cn(
        popupItem,
        itemIcons,
        tone === 'danger' &&
          'text-on-danger-soft data-highlighted:bg-danger-soft [&_svg]:text-on-danger-soft',
        className
      )}
      {...props}
    />
  );
});

export type MenuLinkItemProps = Omit<BaseMenu.LinkItem.Props, 'className'> & { className?: string };

/** A menu item that navigates. Pass `href`, or `render` with your router's link. */
export const MenuLinkItem = forwardRef<HTMLAnchorElement, MenuLinkItemProps>(function MenuLinkItem(
  { className, ...props },
  ref
) {
  return <BaseMenu.LinkItem ref={ref} className={cn(popupItem, itemIcons, className)} {...props} />;
});

export type MenuCheckboxItemProps = Omit<BaseMenu.CheckboxItem.Props, 'className'> & {
  className?: string;
};

/** A toggle in a menu, e.g. showing or hiding a table column. */
export const MenuCheckboxItem = forwardRef<HTMLDivElement, MenuCheckboxItemProps>(
  function MenuCheckboxItem({ className, children, ...props }, ref) {
    return (
      <BaseMenu.CheckboxItem ref={ref} className={cn(popupItem, 'pl-8', className)} {...props}>
        <BaseMenu.CheckboxItemIndicator className="absolute left-2 flex">
          <Check className="size-4" aria-hidden />
        </BaseMenu.CheckboxItemIndicator>
        {children}
      </BaseMenu.CheckboxItem>
    );
  }
);

export const MenuRadioGroup = BaseMenu.RadioGroup;

export type MenuRadioItemProps = Omit<BaseMenu.RadioItem.Props, 'className'> & {
  className?: string;
};

/** One choice in a MenuRadioGroup, e.g. a sort order. */
export const MenuRadioItem = forwardRef<HTMLDivElement, MenuRadioItemProps>(function MenuRadioItem(
  { className, children, ...props },
  ref
) {
  return (
    <BaseMenu.RadioItem ref={ref} className={cn(popupItem, 'pl-8', className)} {...props}>
      <BaseMenu.RadioItemIndicator className="absolute left-2 flex">
        <Check className="size-4" aria-hidden />
      </BaseMenu.RadioItemIndicator>
      {children}
    </BaseMenu.RadioItem>
  );
});

export function MenuSeparator({ className }: { className?: string }) {
  return <BaseMenu.Separator className={cn('-mx-1 my-1 h-px bg-border', className)} />;
}

export const MenuGroup = BaseMenu.Group;

export type MenuGroupLabelProps = Omit<BaseMenu.GroupLabel.Props, 'className'> & {
  className?: string;
};

export const MenuGroupLabel = forwardRef<HTMLDivElement, MenuGroupLabelProps>(
  function MenuGroupLabel({ className, ...props }, ref) {
    return (
      <BaseMenu.GroupLabel
        ref={ref}
        className={cn('px-2 py-1.5 text-xs font-medium text-fg-muted', className)}
        {...props}
      />
    );
  }
);
