import { Field as BaseField } from '@base-ui/react/field';
import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset';
import { Form as BaseForm } from '@base-ui/react/form';
import { forwardRef } from 'react';
import { cn } from '../lib/cn.ts';

type WithClassName<P> = Omit<P, 'className'> & { className?: string };

export type FormProps = WithClassName<BaseForm.Props>;

/** A form that shows each field's errors, including `errors` returned by the server by name. */
export const Form = forwardRef<HTMLFormElement, FormProps>(function Form(
  { className, ...props },
  ref
) {
  return <BaseForm ref={ref} className={cn('flex flex-col gap-5', className)} {...props} />;
});

export type FieldProps = WithClassName<BaseField.Root.Props>;

/**
 * Groups a label, one control, a description and an error. Give it `name` to submit the control's
 * value with a `Form`, and `invalid` to mark it invalid from outside (e.g. a form library).
 */
export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(
  { className, ...props },
  ref
) {
  return <BaseField.Root ref={ref} className={cn('flex flex-col gap-1.5', className)} {...props} />;
});

export const fieldLabelClass =
  'text-sm font-medium text-fg data-disabled:cursor-not-allowed data-disabled:opacity-50';

export type FieldLabelProps = WithClassName<BaseField.Label.Props>;

/** The field's visible label. Wrap a Checkbox, Radio or Switch in it to label that control. */
export const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(function FieldLabel(
  { className, ...props },
  ref
) {
  return <BaseField.Label ref={ref} className={cn(fieldLabelClass, className)} {...props} />;
});

export type FieldDescriptionProps = WithClassName<BaseField.Description.Props>;

export const FieldDescription = forwardRef<HTMLParagraphElement, FieldDescriptionProps>(
  function FieldDescription({ className, ...props }, ref) {
    return (
      <BaseField.Description
        ref={ref}
        className={cn('text-sm text-fg-muted', className)}
        {...props}
      />
    );
  }
);

export type FieldErrorProps = WithClassName<BaseField.Error.Props>;

/**
 * Shows the field's error when it is invalid. Pick one approach per field:
 * - your own wording per check: `<FieldError match="valueMissing">Enter a name</FieldError>`;
 * - errors you manage (server or form library): `<Field invalid={Boolean(error)}>` with
 *   `<FieldError match={Boolean(error)}>{error}</FieldError>`;
 * - one catch-all `<FieldError />`, which shows the browser's message or the `Form` `errors` entry.
 * A catch-all next to a specific `match` repeats the message, so don't combine them.
 * Unlike Base UI, `match={false}` hides the error (Base UI treats `false` like no `match`).
 */
export const FieldError = forwardRef<HTMLDivElement, FieldErrorProps>(function FieldError(
  { className, ...props },
  ref
) {
  if (props.match === false) return null;
  return (
    <BaseField.Error
      ref={ref}
      className={cn('text-sm font-medium text-on-danger-soft', className)}
      {...props}
    />
  );
});

export type FieldItemProps = WithClassName<BaseField.Item.Props>;

/** One option (checkbox or radio) with its own label and description inside a group. */
export const FieldItem = forwardRef<HTMLDivElement, FieldItemProps>(function FieldItem(
  { className, ...props },
  ref
) {
  return (
    <BaseField.Item
      ref={ref}
      className={cn('flex items-start gap-2.5 pointer-coarse:min-h-11', className)}
      {...props}
    />
  );
});

export type FieldsetProps = WithClassName<BaseFieldset.Root.Props>;

/** Labels a group of controls, e.g. `<Fieldset render={<RadioGroup />}>`. */
export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(function Fieldset(
  { className, ...props },
  ref
) {
  return (
    <BaseFieldset.Root ref={ref} className={cn('flex flex-col gap-2.5', className)} {...props} />
  );
});

export type FieldsetLegendProps = WithClassName<BaseFieldset.Legend.Props>;

export const FieldsetLegend = forwardRef<HTMLDivElement, FieldsetLegendProps>(
  function FieldsetLegend({ className, ...props }, ref) {
    return (
      <BaseFieldset.Legend
        ref={ref}
        className={cn('text-sm font-medium text-fg', className)}
        {...props}
      />
    );
  }
);
