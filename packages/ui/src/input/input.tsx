import { Field as BaseField } from '@base-ui/react/field';
import { Input as BaseInput } from '@base-ui/react/input';
import { forwardRef } from 'react';
import { cn } from '../lib/cn.ts';
import { controlFocus, controlFrame, controlHeight } from '../lib/control.ts';

export interface InputProps extends Omit<BaseInput.Props, 'className'> {
  className?: string;
}

/** A text input. Inside a `Field` it is labelled, described and validated by that field. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref
) {
  return (
    <BaseInput
      ref={ref}
      className={cn(
        controlFrame,
        controlFocus,
        controlHeight,
        'px-2.5 placeholder:text-fg-muted',
        'file:mr-2 file:border-0 file:bg-transparent file:font-medium',
        className
      )}
      {...props}
    />
  );
});

export interface TextareaProps extends Omit<
  BaseField.Control.Props,
  'className' | 'render' | 'type'
> {
  className?: string;
  rows?: number;
}

/** A multi-line text input. Grows with `rows` (default 3) and can be resized vertically. */
export const Textarea = forwardRef<HTMLElement, TextareaProps>(function Textarea(
  { className, rows = 3, ...props },
  ref
) {
  return (
    <BaseField.Control
      ref={ref}
      render={<textarea rows={rows} />}
      className={cn(
        controlFrame,
        controlFocus,
        'min-h-16 resize-y px-2.5 py-1.5 placeholder:text-fg-muted',
        className
      )}
      {...props}
    />
  );
});
