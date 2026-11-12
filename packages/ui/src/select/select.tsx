import { Select as BaseSelect } from '@base-ui/react/select';
import { Check, ChevronsUpDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { fieldLabelClass } from '../field/field.tsx';
import { cn } from '../lib/cn.ts';
import { controlFrame, controlHeight } from '../lib/control.ts';
import { popupItem, popupSurface } from '../lib/popup.ts';

export interface SelectOption<Value> {
  value: Value;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps<Value> extends Omit<
  BaseSelect.Root.Props<Value>,
  'items' | 'children' | 'multiple'
> {
  /** The choices. `value` is what the app stores (usually an ID); `label` is what users see. */
  options: readonly SelectOption<Value>[];
  /** Visible label. Without one, pass `aria-label`. */
  label?: ReactNode;
  'aria-label'?: string;
  placeholder?: ReactNode;
  /** Classes for the trigger button. */
  className?: string;
}

/**
 * Pick one value from a short, fixed list (up to ~15 options). For long or searchable lists use
 * `Combobox`. Inside a `Field` it is described and validated by that field; pass `label` here
 * rather than `FieldLabel`.
 */
export function Select<Value>({
  options,
  label,
  placeholder,
  className,
  'aria-label': ariaLabel,
  ...props
}: SelectProps<Value>) {
  return (
    <BaseSelect.Root items={options} {...props}>
      {label !== undefined && (
        <BaseSelect.Label className={cn(fieldLabelClass, 'cursor-default')}>
          {label}
        </BaseSelect.Label>
      )}
      <BaseSelect.Trigger
        // Base UI links the label by aria-labelledby; a plain-text label is also set as aria-label
        // so the trigger is named even where that reference doesn't resolve.
        aria-label={ariaLabel ?? (typeof label === 'string' ? label : undefined)}
        className={cn(
          controlFrame,
          controlHeight,
          'flex cursor-default items-center justify-between gap-2 pr-2 pl-2.5 text-left select-none',
          'hover:not-data-disabled:bg-surface-hover data-popup-open:bg-surface-hover',
          'focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-focus',
          className
        )}
      >
        <BaseSelect.Value
          placeholder={placeholder}
          className="min-w-0 truncate data-placeholder:text-fg-muted"
        />
        <BaseSelect.Icon className="flex text-fg-muted">
          <ChevronsUpDown className="size-4" aria-hidden />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner
          alignItemWithTrigger={false}
          sideOffset={4}
          className="z-(--z-popover) outline-none select-none"
        >
          <BaseSelect.Popup className={cn(popupSurface, 'min-w-(--anchor-width)')}>
            <BaseSelect.List className="max-h-[min(24rem,var(--available-height))] scroll-py-1 overflow-y-auto p-1">
              {options.map((option) => (
                <BaseSelect.Item
                  key={String(option.value)}
                  value={option.value}
                  disabled={option.disabled ?? false}
                  className={cn(popupItem, 'justify-between')}
                >
                  <BaseSelect.ItemText className="min-w-0 truncate">
                    {option.label}
                  </BaseSelect.ItemText>
                  <BaseSelect.ItemIndicator className="flex text-fg">
                    <Check className="size-4" aria-hidden />
                  </BaseSelect.ItemIndicator>
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}
