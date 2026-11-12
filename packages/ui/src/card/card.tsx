import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../lib/cn.ts';

type DivProps = HTMLAttributes<HTMLDivElement>;

/** A bordered surface grouping one piece of content: a chart, a list, a set of details. */
export const Card = forwardRef<HTMLDivElement, DivProps>(function Card(
  { className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn('flex flex-col rounded-xl border border-border bg-surface text-fg', className)}
      {...props}
    />
  );
});

/** Title area; put a `CardAction` last to place a link or button on the right. */
export const CardHeader = forwardRef<HTMLDivElement, DivProps>(function CardHeader(
  { className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn('flex items-start justify-between gap-3 px-5 pt-4', className)}
      {...props}
    />
  );
});

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Heading level that fits the page outline. Defaults to h2. */
  as?: 'h2' | 'h3' | 'h4';
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle(
  { as: Heading = 'h2', className, ...props },
  ref
) {
  return <Heading ref={ref} className={cn('text-base font-semibold', className)} {...props} />;
});

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(function CardDescription({ className, ...props }, ref) {
  return <p ref={ref} className={cn('text-sm text-fg-muted', className)} {...props} />;
});

export const CardAction = forwardRef<HTMLDivElement, DivProps>(function CardAction(
  { className, ...props },
  ref
) {
  return <div ref={ref} className={cn('flex shrink-0 items-center gap-2', className)} {...props} />;
});

export const CardContent = forwardRef<HTMLDivElement, DivProps>(function CardContent(
  { className, ...props },
  ref
) {
  return <div ref={ref} className={cn('flex-1 px-5 pt-3 pb-5', className)} {...props} />;
});

export const CardFooter = forwardRef<HTMLDivElement, DivProps>(function CardFooter(
  { className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn('flex items-center gap-2 border-t border-border px-5 py-3', className)}
      {...props}
    />
  );
});
