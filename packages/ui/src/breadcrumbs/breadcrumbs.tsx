import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { ChevronRight } from 'lucide-react';
import { Children, isValidElement, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/cn.ts';

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  /** `BreadcrumbItem`s from the top level down to the current page. */
  children: ReactNode;
  /** Name for screen readers. Default "Breadcrumb". */
  'aria-label'?: string;
}

/**
 * Where the current page sits, e.g. Farmers › GGEM farmers › Jane Banda. Fits in
 * `PageHeader eyebrow` or above a record header. The last item is the current page.
 */
export function Breadcrumbs({
  children,
  className,
  'aria-label': ariaLabel = 'Breadcrumb',
  ...props
}: BreadcrumbsProps) {
  const items = Children.toArray(children).filter(isValidElement);
  return (
    <nav aria-label={ariaLabel} className={className} {...props}>
      <ol className="flex flex-wrap items-center gap-1 text-sm text-fg-muted">
        {items.map((item, i) => (
          <li key={item.key ?? i} className="inline-flex min-w-0 items-center gap-1">
            {i > 0 && <ChevronRight className="size-3.5 shrink-0" aria-hidden />}
            {item}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export interface BreadcrumbItemProps extends useRender.ComponentProps<'a'> {
  /** The current page: plain text with `aria-current="page"`, not a link. */
  current?: boolean;
}

/** One step. Pass `href`, or `render={<Link to="/farmers" />}` for your router. */
export function BreadcrumbItem({
  current = false,
  render,
  className,
  ...props
}: BreadcrumbItemProps) {
  const element = useRender({
    defaultTagName: 'a',
    render,
    props: mergeProps<'a'>(
      {
        className: cn(
          'max-w-[24ch] truncate rounded-sm hover:text-fg hover:underline',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
          typeof className === 'string' ? className : undefined
        ),
      },
      props
    ),
  });
  if (current)
    return (
      <span aria-current="page" className="max-w-[32ch] truncate font-medium text-fg">
        {props.children}
      </span>
    );
  return element;
}
