import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { forwardRef } from 'react';
import { toggleBox } from '../checkbox/checkbox.tsx';
import { cn } from '../lib/cn.ts';

export interface RadioGroupProps extends Omit<BaseRadioGroup.Props, 'className'> {
  className?: string;
}

/** A set of radios with one value. Label it with `Fieldset render={<RadioGroup />}`. */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  { className, ...props },
  ref
) {
  return <BaseRadioGroup ref={ref} className={cn('flex flex-col gap-2', className)} {...props} />;
});

export interface RadioProps extends Omit<BaseRadio.Root.Props, 'className'> {
  className?: string;
}

/** One option in a `RadioGroup`. Label it by wrapping it in `FieldLabel`. */
export const Radio = forwardRef<HTMLElement, RadioProps>(function Radio(
  { className, ...props },
  ref
) {
  return (
    <BaseRadio.Root
      ref={ref}
      className={cn(
        toggleBox,
        'mt-0.5 rounded-full data-checked:border-primary data-checked:bg-primary',
        className
      )}
      {...props}
    >
      <BaseRadio.Indicator className="size-1.5 rounded-full bg-on-primary data-unchecked:hidden" />
    </BaseRadio.Root>
  );
});
