import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: { index: 'src/index.ts' },
  // One output module per source file, so apps bundle only the components they import.
  unbundle: true,
  format: 'esm',
  platform: 'browser',
  dts: true,
  clean: true,
  copy: ['src/styles.css', 'src/fonts.css'],
});
