import { createTheme, DEFAULT_THEME } from '@mantine/core';

export const theme = createTheme({
  fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  fontFamilyMonospace:
    'Monaco, Consolas, "Liberation Mono", "Courier New", monospace',

  primaryColor: 'blue',

  colors: {
    // Custom gold color for XAU/USD branding
    gold: [
      '#fff8e1',
      '#ffecb3',
      '#ffe082',
      '#ffd54f',
      '#ffca28',
      '#ffc107',
      '#ffb300',
      '#ffa000',
      '#ff8f00',
      '#ff6f00',
    ],
  },

  headings: {
    fontFamily: `Inter, ${DEFAULT_THEME.fontFamily}`,
    sizes: {
      h1: { fontSize: '2rem', lineHeight: '1.2' },
      h2: { fontSize: '1.5rem', lineHeight: '1.3' },
      h3: { fontSize: '1.25rem', lineHeight: '1.4' },
    },
  },

  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },

  radius: {
    xs: '0.25rem',
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },

  shadows: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },

  components: {
    Container: {
      defaultProps: {
        size: 'lg',
      },
    },

    Card: {
      defaultProps: {
        radius: 'md',
        shadow: 'sm',
        withBorder: true,
      },
    },

    Button: {
      defaultProps: {
        radius: 'md',
      },
    },

    TextInput: {
      defaultProps: {
        radius: 'md',
      },
    },

    NumberInput: {
      defaultProps: {
        radius: 'md',
      },
    },

    Select: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
});
