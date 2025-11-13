/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          content: 'var(--color-primary-content)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          content: 'var(--color-secondary-content)',
        },
        tertiary: {
          DEFAULT: 'var(--color-tertiary)',
          content: 'var(--color-tertiary-content)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          content: 'var(--color-success-content)',
        },
        queued: {
          DEFAULT: 'var(--color-queued)',
          content: 'var(--color-queued-content)',
        },
      },
    },
  },
  plugins: [],
};
