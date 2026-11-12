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
        },
      },
    ],
  },
});
