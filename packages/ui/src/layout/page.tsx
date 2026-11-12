import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/cn.ts';

const page = cva('w-full', {
  variants: {
    width: {
      /** Reading pages, dashboards, forms. */
      default: 'mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 lg:px-8 lg:py-8',
      /** Record pages with a summary rail. */
      wide: 'mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:px-8 lg:py-8',
      /** Full-bleed lists: toolbars and a table that fills the remaining height. */
      full: 'flex min-h-0 flex-1 flex-col',
    },
  },
  defaultVariants: { width: 'default' },
});

export interface PageProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof page> {}

/** The page body inside AppShell. Use `width="full"` for list pages with a table. */
export const Page = forwardRef<HTMLDivElement, PageProps>(function Page(
  { className, width, ...props },
  ref
) {
  return <div ref={ref} className={cn(page({ width }), className)} {...props} />;
});

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  /** Small text above the title, e.g. today's date. */
  eyebrow?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** Defaults to h2 because the PageBar title is the page's h1. */
  as?: 'h1' | 'h2';
}

/** A large heading block at the top of the page content (dashboards, settings sections). */
export const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(function PageHeader(
  { title, eyebrow, description, actions, as: Heading = 'h2', className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn('flex flex-wrap items-end justify-between gap-3', className)}
      {...props}
    >
      <div className="min-w-0">
        {eyebrow && <p className="text-sm text-fg-muted">{eyebrow}</p>}
        <Heading className="mt-0.5 text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </Heading>
        {description && <p className="mt-1 text-sm text-fg-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
});
