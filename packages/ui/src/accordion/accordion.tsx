import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.ts';

const panelMotion =
  'overflow-hidden transition-[height] duration-normal ease-standard data-starting-style:h-0 data-ending-style:h-0 motion-reduce:transition-none';

const triggerClass = [
  'group flex w-full items-center gap-2 py-3 text-left text-sm font-medium',
  'hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
  'pointer-coarse:min-h-11',
].join(' ');

export interface AccordionProps extends Omit<BaseAccordion.Root.Props, 'className'> {
  className?: string;
}

/**
 * Sections that expand one at a time (or several with `multiple`). Use for secondary detail such
 * as per-item breakdowns, never to hide a page's main content.
 */
export function Accordion({ className, ...props }: AccordionProps) {
  return (
    <BaseAccordion.Root
      className={cn('divide-y divide-border border-y border-border', className)}
      {...props}
    />
  );
}

export interface AccordionItemProps extends Omit<BaseAccordion.Item.Props, 'className'> {
  className?: string;
}

export function AccordionItem({ className, ...props }: AccordionItemProps) {
  return <BaseAccordion.Item className={cn(className)} {...props} />;
}

export interface AccordionTriggerProps {
  children: ReactNode;
  /** Extra content on the right of the heading, e.g. a count or status badge. */
  meta?: ReactNode;
  className?: string;
}

/** The heading button of an item. Rendered inside an `h3`. */
export function AccordionTrigger({ children, meta, className }: AccordionTriggerProps) {
  return (
    <BaseAccordion.Header className="m-0">
      <BaseAccordion.Trigger className={cn(triggerClass, className)}>
        <span className="min-w-0 flex-1">{children}</span>
        {meta && <span className="shrink-0 text-fg-muted">{meta}</span>}
        <ChevronDown
          className="size-4 shrink-0 text-fg-muted transition-transform duration-fast group-data-panel-open:rotate-180"
          aria-hidden
        />
      </BaseAccordion.Trigger>
    </BaseAccordion.Header>
  );
}

export interface AccordionPanelProps extends Omit<BaseAccordion.Panel.Props, 'className'> {
  className?: string;
}

export function AccordionPanel({ className, children, ...props }: AccordionPanelProps) {
  return (
    <BaseAccordion.Panel className={cn('h-(--accordion-panel-height)', panelMotion)} {...props}>
      <div className={cn('pb-4 text-sm', className)}>{children}</div>
    </BaseAccordion.Panel>
  );
}

export interface CollapsibleProps extends Omit<BaseCollapsible.Root.Props, 'className'> {
  className?: string;
}

/** One section that shows and hides, e.g. "Show advanced filters". */
export function Collapsible({ className, ...props }: CollapsibleProps) {
  return <BaseCollapsible.Root className={cn(className)} {...props} />;
}

export interface CollapsibleTriggerProps extends Omit<
  BaseCollapsible.Trigger.Props,
  'className' | 'children'
> {
  children: ReactNode;
  className?: string;
}

export function CollapsibleTrigger({ children, className, ...props }: CollapsibleTriggerProps) {
  return (
    <BaseCollapsible.Trigger
      className={cn(
        'group inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-fg-muted hover:text-fg',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus pointer-coarse:min-h-11',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown
        className="size-4 transition-transform duration-fast group-data-panel-open:rotate-180"
        aria-hidden
      />
    </BaseCollapsible.Trigger>
  );
}

export interface CollapsiblePanelProps extends Omit<BaseCollapsible.Panel.Props, 'className'> {
  className?: string;
}

export function CollapsiblePanel({ className, children, ...props }: CollapsiblePanelProps) {
  return (
    <BaseCollapsible.Panel className={cn('h-(--collapsible-panel-height)', panelMotion)} {...props}>
      <div className={cn('pt-3', className)}>{children}</div>
    </BaseCollapsible.Panel>
  );
}
