# @ggem/tokens

GGEM design tokens from one source (`src/tokens.ts`):

- `@ggem/tokens/theme.css`: a Tailwind CSS v4 theme with light and dark semantic colours;
- `@ggem/tokens`: typed JS with pixel numbers, usable from React Native;
- `@ggem/tokens/tokens.json`: the same values as JSON.

```ts
import { colors, radius, space } from '@ggem/tokens';

const styles = {
  backgroundColor: colors.light.surface,
  borderRadius: radius.lg,
  padding: space[4],
};
```

Every text and control colour pair is tested for WCAG AA contrast in both schemes. MIT licensed.
