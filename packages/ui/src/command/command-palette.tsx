import { Autocomplete } from '@base-ui/react/autocomplete';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { CornerDownLeft, LoaderCircle, Search } from 'lucide-react';
import { useEffect, useId, type ReactNode } from 'react';
import { overlayBackdrop } from '../dialog/dialog.tsx';
import { cn } from '../lib/cn.ts';
import { Kbd } from './kbd.tsx';

export interface CommandItem {
  /** Unique within the palette, e.g. a route or a farmer ID. */
  value: string;
  /** What is shown and searched. */
  label: string;
  /** Secondary text, e.g. a phone number or the section a page is in. */
  description?: ReactNode;
  icon?: ReactNode;
  /** A shortcut hint shown on the right, e.g. "G F". */
  shortcut?: string;
  disabled?: boolean;
}

export interface CommandGroup {
  label: string;
  items: readonly CommandItem[];
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: readonly CommandGroup[];
  /** Runs the chosen command; the palette then closes. */
  onSelect: (item: CommandItem) => void;
  /** Accessible name of the dialog. Default "Command palette". */
  label?: string;
  placeholder?: string;
  /** Typed text (controlled), e.g. for a server search. */
  query?: string;
  onQueryChange?: (query: string) => void;
  /**
   * `true` when `groups` already hold server results for `query`: the palette shows them as they
   * are instead of filtering them again.
   */
  serverFiltered?: boolean;
  /** Results are loading for the current query. */
  loading?: boolean;
  /** Shown when nothing matches. */
  emptyText?: ReactNode;
}

/**
 * A keyboard-first launcher: type to filter, arrow keys to move, Enter to run, Escape to close.
 * Open it with `useCommandShortcut` (⌘K / Ctrl+K). Works for navigation, actions and record
 * search (pass `serverFiltered` with results from your API).
 */
export function CommandPalette({
  open,
  onOpenChange,
  groups,
  onSelect,
  label = 'Command palette',
  placeholder = 'Search…',
  query,
  onQueryChange,
  serverFiltered = false,
  loading = false,
  emptyText = 'No results',
}: CommandPaletteProps) {
  const hintId = useId();
  const items = groups
    .filter((group) => group.items.length > 0)
    .map((group) => ({ value: group.label, items: group.items }));

  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className={overlayBackdrop} />
        <BaseDialog.Viewport className="fixed inset-0 z-(--z-modal) flex items-start justify-center px-2 pt-[12vh] pb-2">
          <BaseDialog.Popup
            aria-label={label}
            className={cn(
              'flex max-h-[min(34rem,calc(100dvh-5rem))] w-full max-w-xl flex-col overflow-hidden',
              'rounded-xl border border-border bg-surface-raised text-fg shadow-lg outline-none',
              'transition-[translate,scale,opacity] duration-fast ease-standard',
              'data-starting-style:-translate-y-2 data-starting-style:scale-[0.98] data-starting-style:opacity-0',
              'data-ending-style:-translate-y-2 data-ending-style:scale-[0.98] data-ending-style:opacity-0'
            )}
          >
            <Autocomplete.Root
              open
              inline
              items={items}
              itemToStringValue={(item: CommandItem) => item.label}
              autoHighlight="always"
              keepHighlight
              filter={serverFiltered ? null : undefined}
              value={query}
              onValueChange={onQueryChange}
            >
              <Autocomplete.InputGroup className="flex items-center gap-2 border-b border-border px-3">
                <Search className="size-4 shrink-0 text-fg-muted" aria-hidden />
                <Autocomplete.Input
                  aria-label={placeholder.replace(/…$/, '')}
                  aria-describedby={hintId}
                  placeholder={placeholder}
                  className="h-12 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-fg-muted"
                />
                {loading && (
                  <LoaderCircle
                    className="size-4 shrink-0 animate-spin text-fg-muted motion-reduce:animate-none"
                    aria-hidden
                  />
                )}
                <BaseDialog.Close className="sr-only">Close {label.toLowerCase()}</BaseDialog.Close>
              </Autocomplete.InputGroup>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                <Autocomplete.Status className="sr-only">
                  {loading ? 'Searching…' : undefined}
                </Autocomplete.Status>
                <Autocomplete.Empty>
                  <div className="px-4 py-10 text-center text-sm text-fg-muted">
                    {loading ? 'Searching…' : emptyText}
                  </div>
                </Autocomplete.Empty>
                <Autocomplete.List className="p-1.5 data-empty:p-0">
                  {(group: { value: string; items: CommandItem[] }) => (
                    <Autocomplete.Group
                      key={group.value}
                      items={group.items}
                      className="not-last:mb-1"
                    >
                      <Autocomplete.GroupLabel className="px-2 pt-2 pb-1 text-xs font-medium text-fg-muted">
                        {group.value}
                      </Autocomplete.GroupLabel>
                      <Autocomplete.Collection>
                        {(item: CommandItem) => (
                          <Autocomplete.Item
                            key={item.value}
                            value={item}
                            disabled={item.disabled ?? false}
                            onClick={() => {
                              onSelect(item);
                              onOpenChange(false);
                            }}
                            className={cn(
                              'group flex min-h-10 cursor-default items-center gap-3 rounded-md px-2 py-1.5 text-sm outline-none select-none [scroll-margin-block:0.375rem]',
                              'data-highlighted:bg-surface-hover data-disabled:opacity-50 pointer-coarse:min-h-12',
                              '[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-fg-muted'
                            )}
                          >
                            {item.icon}
                            <span className="min-w-0 flex-1">
                              <span className="block truncate">{item.label}</span>
                              {item.description && (
                                <span className="block truncate text-xs text-fg-muted">
                                  {item.description}
                                </span>
                              )}
                            </span>
                            {item.shortcut && (
                              <span className="hidden gap-1 sm:flex" aria-hidden>
                                {item.shortcut.split(' ').map((key) => (
                                  <Kbd key={key}>{key}</Kbd>
                                ))}
                              </span>
                            )}
                            <CornerDownLeft
                              className="hidden group-data-highlighted:block"
                              aria-hidden
                            />
                          </Autocomplete.Item>
                        )}
                      </Autocomplete.Collection>
                    </Autocomplete.Group>
                  )}
                </Autocomplete.List>
              </div>

              <div className="flex items-center gap-4 border-t border-border bg-surface-muted px-3 py-2 text-xs text-fg-muted">
                <span id={hintId} className="sr-only">
                  Use the arrow keys to move and Enter to choose.
                </span>
                <span className="flex items-center gap-1" aria-hidden>
                  <Kbd>↑</Kbd>
                  <Kbd>↓</Kbd> move
                </span>
                <span className="flex items-center gap-1" aria-hidden>
                  <Kbd>Enter</Kbd> choose
                </span>
                <span className="ml-auto flex items-center gap-1" aria-hidden>
                  <Kbd>Esc</Kbd> close
                </span>
              </div>
            </Autocomplete.Root>
          </BaseDialog.Popup>
        </BaseDialog.Viewport>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

/**
 * Toggles a palette with ⌘K (macOS) or Ctrl+K (elsewhere), from anywhere on the page. Mount it
 * once, next to the palette.
 */
export function useCommandShortcut(onToggle: () => void, key = 'k') {
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === key && (event.metaKey || event.ctrlKey) && !event.altKey) {
        event.preventDefault();
        onToggle();
      }
    };
    window.addEventListener('keydown', listener);
    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [onToggle, key]);
}
