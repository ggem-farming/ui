---
'@ggem/ui': patch
---

`Select` with a plain-text `label` also names its trigger with that label, so it has an accessible
name even where the `aria-labelledby` reference doesn't resolve. Selects and comboboxes in the
`FilterBar` filter row keep a compact width instead of stretching to the full row.
