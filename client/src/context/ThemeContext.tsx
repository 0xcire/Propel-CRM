import { createContext, useContext, useLayoutEffect } from 'react';
import { useLocalStorage } from '@uidotdev/usehooks';

import type { PropsWithChildren, Dispatch, SetStateAction } from 'react';

type Theme = [string, Dispatch<SetStateAction<string>>];

type ThemeProviderProps = PropsWithChildren;

const taskContext = createContext<Theme | undefined>(undefined);

export function ThemeProvider({ children }: ThemeProviderProps): JSX.Element {
  const [theme, saveTheme] = useLocalStorage('theme', 'light');

  useLayoutEffect(() => {
    const html = document.getElementsByTagName('html')[0];
    if (theme === 'dark') {
      html?.classList.add('dark');
    }
    if (theme === 'light') {
      html?.classList.remove('dark');
    }
  }, [theme]);

  const value: Theme = [theme, saveTheme];
  return <taskContext.Provider value={value}>{children}</taskContext.Provider>;
}

export function useThemeContext(): Theme {
  const context = useContext(taskContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }

  return context;
}
