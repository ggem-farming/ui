import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../stories/**/*.@(mdx|stories.tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  core: { disableTelemetry: true },
  viteFinal(viteConfig) {
    viteConfig.plugins = [...(viteConfig.plugins ?? []), tailwindcss()];
    // Stories use the kit's source so edits reload without rebuilding the package.
    viteConfig.resolve = {
      ...viteConfig.resolve,
      alias: { '@ggem/ui': new URL('../../../packages/ui/src/index.ts', import.meta.url).pathname },
    };
    // GitHub Pages serves the project under /ui/.
    if (process.env.STORYBOOK_BASE) viteConfig.base = process.env.STORYBOOK_BASE;
    return viteConfig;
  },
};

export default config;
