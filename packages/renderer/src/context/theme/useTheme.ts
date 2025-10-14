import { use } from 'react';
import { ThemeContext } from './ThemeContext';
import type { Theme } from './types';

export function useTheme(): Theme {
  const context = use(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context.theme;
}
