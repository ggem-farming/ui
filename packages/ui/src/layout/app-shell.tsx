import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { Menu } from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { IconButton } from '../button/icon-button.tsx';
import { overlayBackdrop } from '../dialog/dialog.tsx';
import { cn } from '../lib/cn.ts';

interface ShellContextValue {
  barNode: HTMLElement | null;
  closeNav: () => void;
}

const ShellContext = createContext<ShellContextValue | null>(null);

export interface AppShellProps {
  /** The navigation, built from Sidebar parts. Shown as a column from 1024px, a drawer below. */
  sidebar: ReactNode;
  /** The current page. Pages set the top bar with `PageBar`. */
  children: ReactNode;
  /** Name of the navigation drawer for screen readers. */
  navLabel?: string;
}

/**
 * The app frame: sidebar on the canvas, the page in an inset panel with a slim top bar.
 * Includes a "Skip to content" link and a menu button that opens the sidebar on small screens.
 */
export function AppShell({ sidebar, children, navLabel = 'Navigation' }: AppShellProps) {
  const [barNode, setBarNode] = useState<HTMLDivElement | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const closeNav = useCallback(() => {
    setNavOpen(false);
  }, []);
  const context = useMemo(() => ({ barNode, closeNav }), [barNode, closeNav]);

  return (
    <ShellContext.Provider value={context}>
      <div className="flex h-dvh bg-bg text-fg">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-(--z-tooltip) focus:rounded-md focus:bg-surface focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:shadow-md"
        >
          Skip to content
        </a>

        <div className="hidden w-60 shrink-0 lg:flex">{sidebar}</div>

        <BaseDialog.Root open={navOpen} onOpenChange={setNavOpen}>
          <BaseDialog.Portal>
            <BaseDialog.Backdrop className={cn(overlayBackdrop, 'lg:hidden')} />
            <BaseDialog.Popup
              className={cn(
                'fixed inset-y-0 left-0 z-(--z-modal) flex w-72 max-w-[85vw] bg-bg text-fg shadow-lg outline-none',
                'transition-transform duration-normal ease-standard',
                'data-starting-style:-translate-x-full data-ending-style:-translate-x-full lg:hidden'
              )}
            >
              <BaseDialog.Title className="sr-only">{navLabel}</BaseDialog.Title>
              {sidebar}
            </BaseDialog.Popup>
          </BaseDialog.Portal>
        </BaseDialog.Root>

        <div className="flex min-w-0 flex-1 flex-col lg:py-2 lg:pr-2">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-surface lg:rounded-xl lg:border lg:border-border lg:shadow-xs">
            <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3 pointer-coarse:h-14 lg:px-5">
              <IconButton
                label="Open navigation"
                tooltip={false}
                size="sm"
                className="-ml-1 lg:hidden"
                onClick={() => {
                  setNavOpen(true);
                }}
              >
                <Menu />
              </IconButton>
              <div ref={setBarNode} className="flex min-w-0 flex-1 items-center gap-2" />
            </header>
            <main
              id="main"
              tabIndex={-1}
              className="flex min-h-0 flex-1 flex-col overflow-auto focus:outline-hidden"
            >
              {children}
            </main>
          </div>
        </div>
      </div>
    </ShellContext.Provider>
  );
}

export interface PageBarProps {
  /** The page name. Rendered as the page's h1 unless `as` says otherwise. */
  title: ReactNode;
  /** Where the page sits, e.g. a link back to "Farmers" before a farmer's name. */
  breadcrumb?: ReactNode;
  /** Page actions; the main one last, e.g. Export then "Register farmer". */
  actions?: ReactNode;
  as?: 'h1' | 'h2';
}

/**
 * Sets the AppShell top bar for the current page: title on the left, actions on the right.
 * Render it once per page, anywhere inside the page. Outside an AppShell it renders in place.
 */
export function PageBar({ title, breadcrumb, actions, as: Heading = 'h1' }: PageBarProps) {
  const shell = useContext(ShellContext);
  const content = (
    <>
      {breadcrumb && (
        <div className="hidden min-w-0 items-center gap-2 text-sm text-fg-muted sm:flex">
          {breadcrumb}
          <span aria-hidden>/</span>
        </div>
      )}
      <Heading className="min-w-0 truncate text-sm font-medium">{title}</Heading>
      {actions && <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div>}
    </>
  );
  if (!shell) {
    return (
      <div className="flex h-12 items-center gap-2 border-b border-border px-4">{content}</div>
    );
  }
  return shell.barNode ? createPortal(content, shell.barNode) : null;
}

type DivProps = HTMLAttributes<HTMLDivElement>;

/** The sidebar column: SidebarHeader, SidebarNav and SidebarFooter go inside. */
export function Sidebar({ className, ...props }: DivProps) {
  return (
    <div className={cn('flex h-full w-full flex-col gap-3 px-3 pt-3 pb-2', className)} {...props} />
  );
}

/** Top of the sidebar: workspace name, logo, search button. */
export function SidebarHeader({ className, ...props }: DivProps) {
  return <div className={cn('flex flex-col gap-3', className)} {...props} />;
}

export interface SidebarNavProps extends HTMLAttributes<HTMLElement> {
  'aria-label'?: string;
}

export function SidebarNav({ className, 'aria-label': label = 'Main', ...props }: SidebarNavProps) {
  return (
    <nav
      aria-label={label}
      className={cn('-mx-1 flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-1', className)}
      {...props}
    />
  );
}

export interface SidebarSectionProps extends DivProps {
  label?: ReactNode;
}

/** A group of links with an optional small heading, e.g. "Operations". */
export function SidebarSection({ label, className, children, ...props }: SidebarSectionProps) {
  return (
    <div className={cn('flex flex-col', className)} {...props}>
      {label && <p className="mb-1 px-2 text-xs font-medium text-fg-muted">{label}</p>}
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

export interface SidebarLinkProps extends useRender.ComponentProps<'a'> {
  /** A 16px line icon. */
  icon?: ReactNode;
  /** The current page; sets `aria-current="page"`. */
  active?: boolean;
  /** A small count or status on the right, e.g. pending reviews. */
  count?: ReactNode;
}

/**
 * A navigation link. Pass `href`, or `render={<Link to="/farmers" />}` for your router.
 * Closes the navigation drawer on small screens when followed.
 */
export function SidebarLink({
  icon,
  active = false,
  count,
  render,
  className,
  children,
  ...props
}: SidebarLinkProps) {
  const shell = useContext(ShellContext);
  return useRender({
    defaultTagName: 'a',
    render,
    props: mergeProps<'a'>(
      {
        'aria-current': active ? 'page' : undefined,
        onClick: () => shell?.closeNav(),
        className: cn(
          'flex h-8 items-center gap-2.5 rounded-md border border-transparent px-2 text-sm font-medium text-fg-muted',
          'hover:bg-surface-hover hover:text-fg pointer-coarse:h-11',
          'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus',
          'aria-[current=page]:border-border aria-[current=page]:bg-surface aria-[current=page]:text-fg aria-[current=page]:shadow-xs',
          '[&_svg]:size-4 [&_svg]:shrink-0',
          typeof className === 'string' ? className : undefined
        ),
        children: (
          <>
            {icon}
            <span className="min-w-0 flex-1 truncate">{children}</span>
            {count !== undefined && (
              <span className="text-xs font-medium text-fg-muted tabular-nums">{count}</span>
            )}
          </>
        ),
      },
      props
    ),
  });
}

/** Bottom of the sidebar: settings link, signed-in user. */
export function SidebarFooter({ className, ...props }: DivProps) {
  return (
    <div
      className={cn('flex flex-col gap-0.5 border-t border-border pt-2', className)}
      {...props}
    />
  );
}
