import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { createContext, forwardRef, useContext } from 'react';
import { cn } from '../lib/cn.ts';

type Variant = 'underline' | 'segmented';
const VariantContext = createContext<Variant>('underline');

export type TabsProps = Omit<BaseTabs.Root.Props, 'className'> & { className?: string };

/**
 * Switches between views of one subject. Keep the active tab in the URL: pass `value` and
 * `onValueChange` from your router's search params.
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { className, ...props },
  ref
) {
  return <BaseTabs.Root ref={ref} className={cn('flex flex-col gap-4', className)} {...props} />;
});

export interface TabsListProps extends Omit<BaseTabs.List.Props, 'className'> {
  className?: string;
  /** `underline` for page and record sections; `segmented` for a compact switch. */
  variant?: Variant;
}

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  { className, variant = 'underline', children, ...props },
  ref
) {
  return (
    <VariantContext.Provider value={variant}>
      <BaseTabs.List
        ref={ref}
        className={cn(
          // Scrolls sideways on narrow screens without showing a scrollbar.
          'relative z-0 flex max-w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          variant === 'underline'
            ? 'gap-5 border-b border-border'
            : 'w-fit gap-1 rounded-lg border border-border bg-surface-muted p-0.5',
          className
        )}
        {...props}
      >
        {children}
        <BaseTabs.Indicator
          className={cn(
            'absolute left-0 -z-1 w-(--active-tab-width) translate-x-(--active-tab-left)',
            'transition-[translate,width] duration-normal ease-standard',
            variant === 'underline'
              ? 'bottom-0 h-0.5 bg-primary'
              : 'top-(--active-tab-top) h-(--active-tab-height) rounded-md border border-border bg-surface shadow-xs'
          )}
        />
      </BaseTabs.List>
    </VariantContext.Provider>
  );
});

export type TabProps = Omit<BaseTabs.Tab.Props, 'className'> & { className?: string };

/** One tab. Counts can go inside: `Contracts <span>12</span>`. */
export const Tab = forwardRef<HTMLButtonElement, TabProps>(function Tab(
  { className, ...props },
  ref
) {
  const variant = useContext(VariantContext);
  return (
    <BaseTabs.Tab
      ref={ref}
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center gap-1.5 text-sm font-medium whitespace-nowrap text-fg-muted select-none',
        'hover:text-fg data-active:text-fg data-disabled:cursor-not-allowed data-disabled:opacity-50',
        'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus',
        variant === 'underline' ? 'h-10 px-0.5' : 'h-7 rounded-md px-2.5',
        'pointer-coarse:h-11',
        className
      )}
      {...props}
    />
  );
});

export type TabsPanelProps = Omit<BaseTabs.Panel.Props, 'className'> & { className?: string };

export const TabsPanel = forwardRef<HTMLDivElement, TabsPanelProps>(function TabsPanel(
  { className, ...props },
  ref
) {
  return (
    <BaseTabs.Panel
      ref={ref}
      className={cn('focus-visible:outline-2 focus-visible:outline-focus', className)}
      {...props}
    />
  );
});
