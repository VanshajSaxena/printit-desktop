import { useMemo, useState } from 'react';
import type { Theme } from './types.ts';
import { lightTheme } from './themes.ts';
import { ThemeContext } from './ThemeContext.tsx';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(lightTheme);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return <ThemeContext value={value}>{children}</ThemeContext>;
}
