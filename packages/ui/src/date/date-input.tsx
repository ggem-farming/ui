import { forwardRef } from 'react';
import { Input, type InputProps } from '../input/input.tsx';
import { cn } from '../lib/cn.ts';

/** Dates are plain ISO calendar dates (`YYYY-MM-DD`); an empty input is `null`. */
export type IsoDate = string;

export interface DateInputProps extends Omit<
  InputProps,
  'type' | 'value' | 'defaultValue' | 'onValueChange' | 'min' | 'max'
> {
  value?: IsoDate | null;
  defaultValue?: IsoDate | null;
  onValueChange?: (value: IsoDate | null) => void;
  /** Earliest allowed date, `YYYY-MM-DD`. */
  min?: IsoDate;
  /** Latest allowed date, `YYYY-MM-DD`. */
  max?: IsoDate;
}

const dateFrame =
  'w-auto min-w-36 tabular-nums [&::-webkit-calendar-picker-indicator]:opacity-60 [&::-webkit-calendar-picker-indicator]:hover:opacity-100';

/**
 * A calendar date picker using the browser's native control, so it works with the keyboard,
 * screen readers and phone date wheels. Values are ISO dates, never `Date` objects.
 */
export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(function DateInput(
  { value, defaultValue, onValueChange, className, ...props },
  ref
) {
  return (
    <Input
      ref={ref}
      type="date"
      value={value === undefined ? undefined : (value ?? '')}
      defaultValue={defaultValue === undefined ? undefined : (defaultValue ?? '')}
      onValueChange={(next) => {
        onValueChange?.(next || null);
      }}
      className={cn(dateFrame, className)}
      {...props}
    />
  );
});

export interface DateRange {
  from: IsoDate | null;
  to: IsoDate | null;
}

export interface DateRangeInputProps {
  value: DateRange;
  onValueChange: (value: DateRange) => void;
  /** Names the pair for screen readers, e.g. "Booking dates". */
  'aria-label': string;
  /** Labels for each end. Default "From" and "To". */
  labels?: { from: string; to: string };
  min?: IsoDate;
  max?: IsoDate;
  disabled?: boolean;
  className?: string;
}

/**
 * Two date inputs for a range. The end cannot be before the start. Both ends are optional, so
 * "from 1 March" with no end is a valid filter.
 */
export function DateRangeInput({
  value,
  onValueChange,
  'aria-label': ariaLabel,
  labels = { from: 'From', to: 'To' },
  min,
  max,
  disabled,
  className,
}: DateRangeInputProps) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn('inline-flex flex-wrap items-center gap-2', className)}
    >
      <DateInput
        aria-label={labels.from}
        value={value.from}
        min={min}
        max={value.to ?? max}
        disabled={disabled}
        onValueChange={(from) => {
          onValueChange({ from, to: from && value.to && value.to < from ? null : value.to });
        }}
      />
      <span className="text-sm text-fg-muted" aria-hidden>
        –
      </span>
      <DateInput
        aria-label={labels.to}
        value={value.to}
        min={value.from ?? min}
        max={max}
        disabled={disabled}
        onValueChange={(to) => {
          onValueChange({ ...value, to });
        }}
      />
    </div>
  );
}
