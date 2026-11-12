import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group';
import { Check, Minus } from 'lucide-react';
import { forwardRef } from 'react';
import { cn } from '../lib/cn.ts';

/** Classes for small toggles (checkbox, radio): 16px box, 44px hit area on touch screens. */
export const toggleBox = [
  'group relative inline-flex size-4 shrink-0 items-center justify-center border border-input bg-surface shadow-xs',
  'transition-colors duration-fast ease-standard',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
  'data-invalid:border-danger data-disabled:cursor-not-allowed data-disabled:opacity-50',
  'pointer-coarse:before:absolute pointer-coarse:before:-inset-3.5',
].join(' ');

export interface CheckboxProps extends Omit<BaseCheckbox.Root.Props, 'className'> {
  className?: string;
}

/**
 * A checkbox. Label it by wrapping it in `FieldLabel` (or a `<label>`), or with `aria-label`.
 * Set `indeterminate` for a "some selected" state, e.g. a select-all box in a table header.
 */
export const Checkbox = forwardRef<HTMLElement, CheckboxProps>(function Checkbox(
  { className, ...props },
  ref
) {
  return (
    <BaseCheckbox.Root
      ref={ref}
      className={cn(
        toggleBox,
        'mt-0.5 rounded-sm data-checked:border-primary data-checked:bg-primary data-checked:text-on-primary',
        'data-indeterminate:border-primary data-indeterminate:bg-primary data-indeterminate:text-on-primary',
        className
      )}
      {...props}
    >
      <BaseCheckbox.Indicator className="flex data-unchecked:hidden">
        <Check className="size-3 group-data-indeterminate:hidden" strokeWidth={3} aria-hidden />
        <Minus
          className="hidden size-3 group-data-indeterminate:block"
          strokeWidth={3}
          aria-hidden
        />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
});

export interface CheckboxGroupProps extends Omit<BaseCheckboxGroup.Props, 'className'> {
  className?: string;
}

/** Holds several checkboxes that share one array value. Pair with `Fieldset` for a label. */
export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(function CheckboxGroup(
  { className, ...props },
  ref
) {
  return (
    <BaseCheckboxGroup ref={ref} className={cn('flex flex-col gap-2', className)} {...props} />
  );
});
