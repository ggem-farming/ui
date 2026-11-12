---
'@ggem/ui': minor
---

`DataTable` error states now say what failed and why: the title comes from the table label
("Couldn't load farmers", or "Couldn't refresh farmers" above rows still shown) and the `error`
prop is the reason. A reason that matched ErrorState's default description no longer appears twice.
