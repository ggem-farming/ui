# GGEM UI conventions

Public, MIT-licensed npm workspaces repo: `@ggem/tokens` (packages/tokens), `@ggem/ui`
(packages/ui) and Storybook (apps/storybook). Node 24, npm only. Do not commit, push, publish or
open PRs unless requested. One branch per reviewable step.

## Rules

- Public code only: no GGEM business logic, API types, endpoints, credentials, personal data or
  real farmer/staff records. Story data is synthetic.
- Tokens are the single source of design values. Edit `packages/tokens/src/tokens.ts`; never
  hand-edit generated `dist/`. New colour pairs must pass the contrast tests.
- Components wrap Base UI (`@base-ui/react/<part>`), style with Tailwind semantic utilities and
  merge caller classes with `cn`. No hex colours, arbitrary colour values or Tailwind default palette
  names in components.
- Router- and data-agnostic: no react-router, TanStack Query, fetch clients, MUI or Emotion.
  Navigation uses plain `<a>` or a `render` prop supplied by the app.
- Accessibility: complete keyboard and screen-reader support; icon-only controls require a label;
  coarse-pointer touch targets are at least 44 px (`pointer-coarse:` variants).
- Build a component when an app screen needs it. Each one gets: a story (all variants, light and
  dark), a Testing Library test with an axe check, and a changeset.
- Stories live in apps/storybook/stories; the package source stays free of Storybook.

Before finishing: `npm run check`, `git diff --check`, and a Storybook check of affected stories at
1440, 768 and 375 widths in light and dark.
