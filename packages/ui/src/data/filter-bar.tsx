import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { Columns3, ListFilter, Search, X } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Button } from '../button/button.tsx';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../dialog/dialog.tsx';
import { cn } from '../lib/cn.ts';
import { controlFrame } from '../lib/control.ts';
import { inlineIconButton } from '../lib/popup.ts';
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuTrigger,
} from '../menu/menu.tsx';

export interface SearchInputProps {
  /** Name for screen readers, e.g. "Search farmers". */
  'aria-label': string;
  value: string;
  /** Called after typing pauses (`debounceMs`), and at once when cleared. */
  onValueChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

/** A search box that waits for typing to pause before searching, with a clear button. */
export function SearchInput({
  'aria-label': label,
  value,
  onValueChange,
  placeholder,
  debounceMs = 300,
  className,
}: SearchInputProps) {
  const [text, setText] = useState(value);
  // Follow outside changes (e.g. "Clear all" or back navigation) without an effect.
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    setText(value);
  }

  const latest = useRef(onValueChange);
  useEffect(() => {
    latest.current = onValueChange;
  });

  useEffect(() => {
    if (text === value) return undefined;
    const timer = setTimeout(() => {
      latest.current(text);
    }, debounceMs);
    return () => {
      clearTimeout(timer);
    };
  }, [text, value, debounceMs]);

  return (
    <div
      className={cn(
        controlFrame,
        'flex h-8 items-center gap-1.5 pr-1 pl-2.5 pointer-coarse:h-11',
        'focus-within:outline-2 focus-within:-outline-offset-1 focus-within:outline-focus',
        className
      )}
    >
      <Search className="size-4 shrink-0 text-fg-muted" aria-hidden />
      <input
        type="search"
        aria-label={label}
        value={text}
        placeholder={placeholder}
        onChange={(e) => {
          setText(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onValueChange(text);
        }}
        className="h-full min-w-0 flex-1 bg-transparent outline-hidden placeholder:text-fg-muted [&::-webkit-search-cancel-button]:hidden"
      />
      {text && (
        <button
          type="button"
          aria-label="Clear search"
          className={inlineIconButton}
          onClick={() => {
            setText('');
            onValueChange('');
          }}
        >
          <X className="size-3.5" aria-hidden />
        </button>
      )}
    </div>
  );
}

export interface FilterChipProps {
  /** The filter name, e.g. "Hub". */
  label: string;
  /** The applied value in words, e.g. "Chikwawa, Nsanje". */
  value: ReactNode;
  onRemove: () => void;
}

/** One applied filter, removable. */
export function FilterChip({ label, value, onRemove }: FilterChipProps) {
  return (
    <span className="inline-flex h-7 max-w-full items-center gap-1 rounded-md border border-border bg-surface-muted pr-0.5 pl-2 text-sm pointer-coarse:h-11">
      <span className="text-fg-muted">{label}</span>
      <span className="min-w-0 truncate font-medium">{value}</span>
      <button
        type="button"
        aria-label={`Remove filter: ${label}`}
        className={inlineIconButton}
        onClick={onRemove}
      >
        <X className="size-3.5" aria-hidden />
      </button>
    </span>
  );
}

export interface FilterBarProps {
  /** Usually a SearchInput. */
  search?: ReactNode;
  /** Filter controls (Selects, Comboboxes). Inline when there is room, else in a side panel. */
  filters?: ReactNode;
  /** Number of applied filters, shown on the phone "Filters" button. */
  activeCount?: number;
  /** FilterChips for applied filters. */
  chips?: ReactNode;
  /** Clears every filter and the search. Shown when chips are present. */
  onClearAll?: () => void;
  /** Right-aligned tools, e.g. a ColumnsMenu or sort menu. */
  actions?: ReactNode;
  className?: string;
}

/**
 * The toolbar above a table. Below 48rem of width, filters move into a side panel opened from a
 * "Filters" button, so the table stays on the first screen.
 */
export function FilterBar({
  search,
  filters,
  activeCount = 0,
  chips,
  onClearAll,
  actions,
  className,
}: FilterBarProps) {
  return (
    <div className={cn('@container flex flex-col gap-2 px-3 py-2.5 lg:px-5', className)}>
      <div className="flex flex-wrap items-center gap-2">
        {search && <div className="w-full @md:w-64">{search}</div>}
        {filters && (
          <>
            <div className="hidden flex-wrap items-center gap-2 @3xl:flex [&_[role=combobox]]:w-auto [&>div:has(>input[role=combobox])]:w-56 [&>button[role=combobox]]:min-w-36">
              {filters}
            </div>
            <Dialog>
              <DialogContent placement="right" size="sm">
                <DialogHeader>
                  <DialogTitle>Filters</DialogTitle>
                </DialogHeader>
                <DialogBody className="flex flex-col gap-4 [&_[role=combobox]]:w-full">
                  {filters}
                </DialogBody>
                <DialogFooter>
                  {onClearAll && (
                    <Button variant="secondary" onClick={onClearAll}>
                      Clear all
                    </Button>
                  )}
                  <DialogClose render={<Button>Show results</Button>} />
                </DialogFooter>
              </DialogContent>
              <FilterButton count={activeCount} />
            </Dialog>
          </>
        )}
        {actions && <div className="ml-auto flex items-center gap-1">{actions}</div>}
      </div>
      {chips && (
        <div className="flex flex-wrap items-center gap-2">
          {chips}
          {onClearAll && (
            <Button variant="ghost" size="sm" onClick={onClearAll}>
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function FilterButton({ count }: { count: number }) {
  return (
    <DialogTriggerButton>
      <ListFilter /> Filters
      {count > 0 && (
        <span className="rounded-full bg-primary px-1.5 text-xs font-semibold text-on-primary tabular-nums">
          {count}
        </span>
      )}
    </DialogTriggerButton>
  );
}

function DialogTriggerButton({ children }: { children: ReactNode }) {
  return (
    <BaseDialog.Trigger
      render={
        <Button variant="secondary" size="sm" className="@3xl:hidden">
          {children}
        </Button>
      }
    />
  );
}

export interface ColumnsMenuProps {
  /** Columns that can be shown or hidden, with readable names. */
  columns: readonly { id: string; label: string }[];
  /** Column ID → visible. Only `false` hides. */
  visibility: Readonly<Record<string, boolean>>;
  onVisibilityChange: (next: Record<string, boolean>) => void;
}

/** "Columns" menu to show or hide table columns; pass the same state to DataTable. */
export function ColumnsMenu({ columns, visibility, onVisibilityChange }: ColumnsMenuProps) {
  return (
    <Menu>
      <MenuTrigger
        render={
          <Button variant="ghost" size="sm">
            <Columns3 /> Columns
          </Button>
        }
      />
      <MenuContent align="end">
        <MenuGroup>
          <MenuGroupLabel>Visible columns</MenuGroupLabel>
          {columns.map((column) => (
            <MenuCheckboxItem
              key={column.id}
              checked={visibility[column.id] !== false}
              closeOnClick={false}
              onCheckedChange={(checked) => {
                onVisibilityChange({ ...visibility, [column.id]: checked });
              }}
            >
              {column.label}
            </MenuCheckboxItem>
          ))}
        </MenuGroup>
      </MenuContent>
    </Menu>
  );
}
