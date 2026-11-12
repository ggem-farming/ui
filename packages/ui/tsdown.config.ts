import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: { index: 'src/index.ts' },
  // One output module per source file, so apps bundle only the components they import.
  unbundle: true,
  format: 'esm',
  platform: 'browser',
  dts: true,
  // Keep TanStack external in the JS and the .d.ts files. Inlining table-core's declarations made
  // apps see two unrelated ColumnDef types (the app's and the kit's copy).
  deps: { neverBundle: [/^@tanstack\//] },
  clean: true,
  copy: ['src/styles.css', 'src/fonts.css'],
});
