# GGEM UI

Design tokens and React components for GGEM Farming's web apps, built on
[Base UI](https://base-ui.com) and [Tailwind CSS v4](https://tailwindcss.com).

| Package                            | What it is                                                                   |
| ---------------------------------- | ---------------------------------------------------------------------------- |
| [`@ggem/tokens`](packages/tokens)  | Colours, type, spacing and more as a Tailwind theme, JSON and typed JS (RN). |
| [`@ggem/ui`](packages/ui)          | Accessible React components styled with the tokens.                          |
| [`apps/storybook`](apps/storybook) | Component docs and visual checks, published to GitHub Pages.                 |

## Use in an app

```sh
npm install @ggem/ui tailwindcss @tailwindcss/vite
```

```css
/* src/main.css */
@import 'tailwindcss';
@import '@ggem/ui/styles.css';
@import '@ggem/ui/fonts.css'; /* optional: self-hosted Archivo, Source Sans 3, JetBrains Mono */
```

```tsx
import { Button } from '@ggem/ui';

<Button onClick={save}>Save</Button>;
```

Set `data-theme="dark"` (or the `dark` class) on `<html>` or any element for the dark scheme.
The theme replaces Tailwind's default palette, so use semantic utilities such as `bg-surface`,
`text-fg-muted`, `border-border`, `bg-primary text-on-primary` and `bg-danger-soft`.

## Develop

Node 24 and npm.

```sh
npm install
npm run storybook      # http://localhost:6006
npm run check          # lint, format, build, typecheck, tests, publint, size budgets
npx changeset          # describe a change for the next release
```

Releases are published from `main` by the Release workflow using changesets and npm trusted
publishing.

## License

MIT
