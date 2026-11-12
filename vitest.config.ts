import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        test: { name: 'tokens', root: 'packages/tokens', environment: 'node' },
      },
      {
        test: {
          name: 'ui',
          root: 'packages/ui',
          environment: 'jsdom',
          setupFiles: ['./test/setup.ts'],
          // axe scans of whole components are slow on a busy machine; the default 5s is too tight.
          testTimeout: 15000,
        },
      },
    ],
  },
});
