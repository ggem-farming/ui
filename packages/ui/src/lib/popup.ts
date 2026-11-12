/** Shared look for floating lists (Select, Combobox, Menu). */
export const popupSurface = [
  'origin-(--transform-origin) rounded-lg border border-border bg-surface-raised text-fg shadow-lg outline-none',
  'transition-[scale,opacity] duration-fast ease-standard',
  'data-starting-style:scale-95 data-starting-style:opacity-0',
  'data-ending-style:scale-95 data-ending-style:opacity-0',
].join(' ');

export const popupItem = [
  'relative flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-base outline-none select-none',
  'data-highlighted:bg-surface-hover data-disabled:cursor-not-allowed data-disabled:opacity-50',
  'pointer-coarse:min-h-11 pointer-coarse:text-lg',
].join(' ');

/** Small icon button placed inside a control (clear, open). */
export const inlineIconButton = [
  'grid size-6 shrink-0 place-items-center rounded text-fg-muted',
  'hover:bg-surface-hover hover:text-fg focus-visible:outline-2 focus-visible:outline-focus',
  'pointer-coarse:size-9',
].join(' ');
