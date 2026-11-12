import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { Check, ChevronDown, X } from 'lucide-react';
import { useMemo, type ReactNode } from 'react';
import { cn } from '../lib/cn.ts';
import { controlFrame, controlHeight } from '../lib/control.ts';
import { inlineIconButton, popupItem, popupSurface } from '../lib/popup.ts';

export interface ComboboxOption<Value extends string | number> {
  value: Value;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps<Value extends string | number> extends Omit<
  BaseCombobox.Root.Props<Value, false, ComboboxOption<Value>>,
  'items' | 'children' | 'multiple'
> {
  /** The choices. `value` is what the app stores (usually an ID); `label` is shown and searched. */
  options: readonly ComboboxOption<Value>[];
  placeholder?: string;
  /** Shown when nothing matches the typed text. */
  emptyText?: ReactNode;
  /** Name for screen readers when there is no `FieldLabel`. */
  'aria-label'?: string;
  /** Classes for the input group. */
  className?: string;
}

/**
 * Pick one value from a long list by typing to filter it. Inside a `Field`, `FieldLabel` labels it.
 * For server-side search, filter `options` from your query and pass `filter={null}`.
 */
export function Combobox<Value extends string | number>({
  options,
  placeholder,
  emptyText = 'No matches',
  className,
  'aria-label': ariaLabel,
  ...props
}: ComboboxProps<Value>) {
  const items = useMemo(
    () =>
      BaseCombobox.createItems(options, {
        getValue: (option) => option.value,
        getLabel: (option) => option.label,
      }),
    [options]
  );

  return (
    <BaseCombobox.Root items={items} {...props}>
      <BaseCombobox.InputGroup
        className={cn(
          controlFrame,
          controlHeight,
          'flex items-center gap-0.5 pr-1',
          'focus-within:outline-2 focus-within:-outline-offset-1 focus-within:outline-focus',
          'has-data-invalid:border-danger',
          className
        )}
      >
        <BaseCombobox.Input
          aria-label={ariaLabel}
          placeholder={placeholder}
          className="h-full min-w-0 flex-1 bg-transparent pl-2.5 outline-none placeholder:text-fg-muted"
        />
        <BaseCombobox.Clear aria-label="Clear selection" className={inlineIconButton}>
          <X className="size-3.5" aria-hidden />
        </BaseCombobox.Clear>
        <BaseCombobox.Trigger aria-label="Show options" className={inlineIconButton}>
          <ChevronDown className="size-4" aria-hidden />
        </BaseCombobox.Trigger>
      </BaseCombobox.InputGroup>
      <BaseCombobox.Portal>
        <BaseCombobox.Positioner sideOffset={4} className="z-(--z-popover) outline-none">
          <BaseCombobox.Popup
            className={cn(popupSurface, 'w-(--anchor-width) max-w-(--available-width)')}
          >
            <BaseCombobox.Empty>
              <div className="px-3 py-2.5 text-sm text-fg-muted">{emptyText}</div>
            </BaseCombobox.Empty>
            <BaseCombobox.List className="max-h-[min(22rem,var(--available-height))] scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0">
              {(option: ComboboxOption<Value>) => (
                <BaseCombobox.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled ?? false}
                  className={cn(popupItem, 'justify-between')}
                >
                  <span className="min-w-0 truncate">{option.label}</span>
                  <BaseCombobox.ItemIndicator className="flex text-fg">
                    <Check className="size-4" aria-hidden />
                  </BaseCombobox.ItemIndicator>
                </BaseCombobox.Item>
              )}
            </BaseCombobox.List>
          </BaseCombobox.Popup>
        </BaseCombobox.Positioner>
      </BaseCombobox.Portal>
    </BaseCombobox.Root>
  );
}
