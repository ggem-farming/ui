import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { forwardRef } from 'react';
import { cn } from '../lib/cn.ts';

export interface SwitchProps extends Omit<BaseSwitch.Root.Props, 'className'> {
  className?: string;
}

/**
 * An on/off switch for settings that apply immediately. Use a Checkbox inside forms that are
 * submitted. Label it by wrapping it in `FieldLabel`, or with `aria-label`.
 */
export const Switch = forwardRef<HTMLElement, SwitchProps>(function Switch(
  { className, ...props },
  ref
) {
  return (
    <BaseSwitch.Root
      ref={ref}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-input p-0.5',
        'transition-colors duration-fast ease-standard data-checked:bg-primary',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        'data-disabled:cursor-not-allowed data-disabled:opacity-50',
        'pointer-coarse:before:absolute pointer-coarse:before:-inset-x-1 pointer-coarse:before:-inset-y-3',
        className
      )}
      {...props}
    >
      <BaseSwitch.Thumb
        className={cn(
          'size-4 rounded-full bg-surface shadow-sm transition-transform duration-fast ease-standard',
          'data-checked:translate-x-4'
        )}
      />
    </BaseSwitch.Root>
  );
});
