import type { Decorator, Preview } from '@storybook/react-vite';
import './preview.css';

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
  return <Story />;
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: 'Colour scheme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  parameters: {
    layout: 'centered',
    a11y: { test: 'error' },
    viewport: {
      options: {
        desktop: { name: 'Desktop 1440', styles: { width: '1440px', height: '900px' } },
        tablet: { name: 'Tablet 768', styles: { width: '768px', height: '1024px' } },
        phone: { name: 'Phone 375', styles: { width: '375px', height: '812px' } },
      },
    },
  },
};

export default preview;
