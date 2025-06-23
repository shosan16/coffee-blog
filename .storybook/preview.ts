import type { Preview } from '@storybook/react';
import '../src/app/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'cafe-light',
          value: '#faf7f2',
        },
        {
          name: 'dark',
          value: '#333333',
        },
      ],
    },
  },
  tags: ['autodocs'],
};

export default preview;
