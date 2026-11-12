import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { forwardRef, type ReactNode } from 'react';
import { IconButton } from '../button/icon-button.tsx';
import { cn } from '../lib/cn.ts';

export const overlayBackdrop = [
  'fixed inset-0 z-(--z-overlay) min-h-dvh bg-overlay',
  'transition-opacity duration-normal ease-standard',
  'data-starting-style:opacity-0 data-ending-style:opacity-0',
].join(' ');

const popup = cva(
  [
    'fixed z-(--z-modal) flex flex-col border-border bg-surface-raised text-fg shadow-lg outline-none',
    'transition-[translate,scale,opacity] ease-standard',
  ],
  {
    variants: {
      placement: {
        // Centred dialog; a bottom sheet on phones.
        center: [
          'inset-x-0 bottom-0 max-h-[calc(100dvh-2rem)] rounded-t-xl border-t duration-normal',
          'data-starting-style:translate-y-full data-ending-style:translate-y-full',
          'sm:inset-x-auto sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:w-[calc(100vw-2rem)]',
          'sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl sm:border',
          'sm:data-starting-style:-translate-y-1/2 sm:data-starting-style:scale-95 sm:data-starting-style:opacity-0',
          'sm:data-ending-style:-translate-y-1/2 sm:data-ending-style:scale-95 sm:data-ending-style:opacity-0',
        ],
        // Side panel: full screen on phones, an inset panel on the right from tablet up.
        right: [
          'inset-0 duration-slow',
          'data-starting-style:translate-x-full data-ending-style:translate-x-full',
          'sm:inset-y-2 sm:right-2 sm:left-auto sm:w-[calc(100vw-1rem)] sm:rounded-xl sm:border',
        ],
      },
      size: { sm: 'sm:max-w-sm', md: 'sm:max-w-lg', lg: 'sm:max-w-2xl' },
    },
    defaultVariants: { placement: 'center', size: 'md' },
  }
);

export const Dialog = BaseDialog.Root;
export type DialogProps = BaseDialog.Root.Props;

/** Opens the dialog. Use `render={<Button />}` to show it as a kit button. */
export const DialogTrigger = BaseDialog.Trigger;

export interface DialogContentProps
  extends Omit<BaseDialog.Popup.Props, 'className'>, VariantProps<typeof popup> {
  className?: string;
  /** Show a close button in the top corner. Defaults to true. */
  showClose?: boolean;
}

/**
 * The dialog box. `placement="right"` makes it a side panel (record details, filters, quick edit).
 * Compose with DialogHeader, DialogBody and DialogFooter; DialogTitle is required for a name.
 */
export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent(
  { className, placement, size, showClose = true, children, ...props },
  ref
) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className={overlayBackdrop} />
      <BaseDialog.Popup ref={ref} className={cn(popup({ placement, size }), className)} {...props}>
        {children}
        {showClose && (
          <BaseDialog.Close
            render={
              <IconButton
                label="Close"
                size="sm"
                tooltip={false}
                className="absolute top-3.5 right-3.5"
              >
                <X />
              </IconButton>
            }
          />
        )}
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  );
});

export function DialogHeader({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('flex flex-col gap-1 px-5 pt-5 pr-12', className)}>{children}</div>;
}

export type DialogTitleProps = Omit<BaseDialog.Title.Props, 'className'> & { className?: string };

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(function DialogTitle(
  { className, ...props },
  ref
) {
  return (
    <BaseDialog.Title ref={ref} className={cn('text-lg font-semibold', className)} {...props} />
  );
});

export type DialogDescriptionProps = Omit<BaseDialog.Description.Props, 'className'> & {
  className?: string;
};

export const DialogDescription = forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  function DialogDescription({ className, ...props }, ref) {
    return (
      <BaseDialog.Description
        ref={ref}
        className={cn('text-sm text-fg-muted', className)}
        {...props}
      />
    );
  }
);

/** Scrollable middle section. */
export function DialogBody({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn('min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4', className)}>
      {children}
    </div>
  );
}

/** Actions row: secondary actions first, the main action last (rightmost). */
export function DialogFooter({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse gap-2 border-t border-border px-5 pt-3 sm:flex-row sm:justify-end',
        // Clear the iPhone home indicator when shown as a bottom sheet or full-screen panel.
        'pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-3',
        className
      )}
    >
      {children}
    </div>
  );
}

/** Closes the dialog. Use `render={<Button variant="secondary" />}`. */
export const DialogClose = BaseDialog.Close;
