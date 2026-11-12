# @ggem/ui

## 0.1.0

### Minor Changes

- a1f3c73: `CommandPalette` (a ⌘K dialog: type to filter, arrow keys, Enter to run; grouped results with
  descriptions, icons and shortcut hints; client filtering or server results via `serverFiltered`),
  `useCommandShortcut` (⌘K / Ctrl+K toggle) and `Kbd` (keyboard key).
- 947fcd4: Data components: `DataTable` on TanStack Table 9 (client or server mode; sorting with
  `aria-sort`, pages of 25/50/100, row selection by ID, row click, low-priority columns, phone
  cards, loading/refetch/error/empty states; every state slice controllable for URL sync),
  `Pagination`, `FilterBar` (filters in a side panel on narrow screens), `FilterChip`,
  `SearchInput` (debounced) and `ColumnsMenu`. Build columns with `createDataTableColumnHelper`.
- b103d94: `DataTable` error states now say what failed and why: the title comes from the table label
  ("Couldn't load farmers", or "Couldn't refresh farmers" above rows still shown) and the `error`
  prop is the reason. A reason that matched ErrorState's default description no longer appears twice.
- 6930a77: Display components: `Badge` (soft or outline with dot, six tones), `Card` parts, `StatGroup` and
  `Stat` (key figures with delta direction and good/bad tone), `Tabs` (underline or segmented),
  `Avatar` (initials fallback, decorative by default), `Separator`, `Skeleton`, `EmptyState` and
  `ErrorState` (block or banner, with retry).
- c804236: Feedback, structure and input components: `Alert` (five tones, title, action, dismiss; announced
  only when `live` or `danger`), `ProgressBar` (determinate or indeterminate) and `Spinner`,
  `DateInput` and `DateRangeInput` (native date controls with ISO `YYYY-MM-DD` values),
  `MultiCombobox` (chips), static `Table` parts for small summaries, `Accordion` and `Collapsible`,
  `Breadcrumbs` (router-agnostic via `render`), and `FileInput` (drop zone over a native file
  input, checks `accept` and `maxSize`).
- 0c8a9d4: Form controls: `Form`, `Field` (label, description, error, item), `Fieldset`, `Input`, `Textarea`,
  `Select`, `Combobox`, `Checkbox`, `CheckboxGroup`, `Radio`, `RadioGroup`, `Switch` and
  `IconButton`. Select and Combobox take `options` with ID values. New `surface-hover` colour token.
- 8e024cc: First release: GGEM design tokens (Tailwind v4 theme, JSON and typed JS for React Native) and the
  UI kit foundation (`cn`, `Button`, base styles and self-hosted fonts).
- 77e4be9: Layout: `AppShell` (sidebar on the canvas, page in an inset panel, navigation drawer below
  1024px, skip link), Sidebar parts with router-friendly `SidebarLink`, `PageBar` (sets the
  top bar from any page), `Page`, `PageHeader`, `RecordLayout`, `RecordHeader` and `DetailList`.
- cd5ea08: Overlays: `Dialog` (centred, a bottom sheet on phones, or `placement="right"` as a side panel),
  `ConfirmDialog` (focus starts on Cancel, stays busy while the action runs, shows failures),
  `Popover`, `Menu` (items, danger tone, link, checkbox and radio items, groups) and `Tooltip`.
  `IconButton` now shows its label as a tooltip by default (`tooltip={false}` to turn off).
- 0ea0d7a: Add `SidebarSubmenu`: a sidebar row that shows and hides related `SidebarLink`s, so a long
  navigation stays short. It opens when the current page is one of its links and, while closed,
  marks its row so the user can still see where they are.

### Patch Changes

- 890cdb3: Fix `DataTable` types in apps: the declarations no longer inline a private copy of
  `@tanstack/table-core`, so columns from `createDataTableColumnHelper` type-check against
  `DataTable`. `@tanstack/table-core` is now a direct dependency (it is also where the `ColumnMeta`
  augmentation lives).
- a3b7661: `Select` with a plain-text `label` also names its trigger with that label, so it has an accessible
  name even where the `aria-labelledby` reference doesn't resolve. Selects and comboboxes in the
  `FilterBar` filter row keep a compact width instead of stretching to the full row.
- Updated dependencies [0c8a9d4]
- Updated dependencies [8e024cc]
  - @ggem/tokens@0.1.0
