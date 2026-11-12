---
'@ggem/ui': patch
---

Fix `DataTable` types in apps: the declarations no longer inline a private copy of
`@tanstack/table-core`, so columns from `createDataTableColumnHelper` type-check against
`DataTable`. `@tanstack/table-core` is now a direct dependency (it is also where the `ColumnMeta`
augmentation lives).
