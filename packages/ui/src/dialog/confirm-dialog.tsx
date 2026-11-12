import { AlertDialog } from '@base-ui/react/alert-dialog';
import { useState, type ReactElement, type ReactNode } from 'react';
import { Button } from '../button/button.tsx';
import { cn } from '../lib/cn.ts';
import { overlayBackdrop } from './dialog.tsx';

export interface ConfirmDialogProps {
  /** Element that opens the dialog, e.g. `<Button variant="ghost">Delete</Button>`. */
  trigger?: ReactElement;
  /** Control the dialog yourself (e.g. opened from a row menu) instead of using `trigger`. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** A question naming the thing, e.g. "Delete contract GG-2026-0101?" */
  title: ReactNode;
  /** What happens and whether it can be undone. */
  description?: ReactNode;
  /** The action as a verb, e.g. "Delete contract". Never "OK" or "Yes". */
  confirmLabel: string;
  cancelLabel?: string;
  /** `danger` for destructive actions. */
  tone?: 'danger' | 'primary';
  /**
   * Runs the action. If it returns a promise the dialog stays open and busy until it settles;
   * a rejection keeps it open and shows the error's message.
   */
  onConfirm: () => unknown;
}

/** Asks before a consequential action. Focus starts on Cancel. */
export function ConfirmDialog({
  trigger,
  open: openProp,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  tone = 'danger',
  onConfirm,
}: ConfirmDialogProps) {
  const [openState, setOpenState] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const open = openProp ?? openState;

  const setOpen = (next: boolean) => {
    if (!next && pending) return;
    if (next) setError(null);
    setOpenState(next);
    onOpenChange?.(next);
  };

  const confirm = async () => {
    setError(null);
    setPending(true);
    try {
      await onConfirm();
      setPending(false);
      setOpenState(false);
      onOpenChange?.(false);
    } catch (reason) {
      setPending(false);
      setError(
        reason instanceof Error && reason.message ? reason.message : 'Something went wrong.'
      );
    }
  };

  return (
    <AlertDialog.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
      }}
    >
      {trigger && <AlertDialog.Trigger render={trigger} />}
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className={overlayBackdrop} />
        <AlertDialog.Popup
          className={cn(
            'fixed z-(--z-modal) flex flex-col gap-4 border-border bg-surface-raised p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-fg shadow-lg outline-none sm:pb-5',
            'inset-x-0 bottom-0 rounded-t-xl border-t transition-[translate,scale,opacity] duration-normal ease-standard',
            'data-starting-style:translate-y-full data-ending-style:translate-y-full',
            'sm:inset-x-auto sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:w-[calc(100vw-2rem)] sm:max-w-md',
            'sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl sm:border',
            'sm:data-starting-style:-translate-y-1/2 sm:data-starting-style:scale-95 sm:data-starting-style:opacity-0',
            'sm:data-ending-style:-translate-y-1/2 sm:data-ending-style:scale-95 sm:data-ending-style:opacity-0'
          )}
        >
          <div className="flex flex-col gap-1">
            <AlertDialog.Title className="text-lg font-semibold">{title}</AlertDialog.Title>
            {description && (
              <AlertDialog.Description className="text-sm text-fg-muted">
                {description}
              </AlertDialog.Description>
            )}
          </div>
          {error && (
            <p
              role="alert"
              className="rounded-md bg-danger-soft px-3 py-2 text-sm font-medium text-on-danger-soft"
            >
              {error}
            </p>
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <AlertDialog.Close
              disabled={pending}
              render={<Button variant="secondary">{cancelLabel}</Button>}
            />
            <Button
              variant={tone === 'danger' ? 'danger' : 'primary'}
              disabled={pending}
              focusableWhenDisabled
              aria-busy={pending || undefined}
              onClick={() => void confirm()}
            >
              {pending ? `${confirmLabel}…` : confirmLabel}
            </Button>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
