/** Shared look for text-entry controls (Input, Textarea, Select trigger, Combobox group). */
export const controlFrame = [
  'w-full rounded-md border border-input bg-surface text-base text-fg shadow-xs',
  'transition-colors duration-fast ease-standard',
  'data-invalid:border-danger',
  'data-disabled:cursor-not-allowed data-disabled:opacity-50',
  'pointer-coarse:text-lg',
].join(' ');

/** Focus ring for a control that is itself focusable. */
export const controlFocus =
  'outline-none focus:outline-2 focus:-outline-offset-1 focus:outline-focus data-invalid:focus:outline-danger';

/** Single-line height: 32px, 44px on touch screens. */
export const controlHeight = 'h-8 pointer-coarse:h-11';
