import * as React from 'react';

type Themes = 'system' | 'dark' | 'light';

interface ThemeProviderProps {
  defaultTheme?: Themes;
  storageKey?: string;
  children?: React.ReactNode;
}

export interface InitialContextProps {
  theme: Themes;
  setTheme: (theme: Themes) => void;
}

const initialState: InitialContextProps = {
  theme: 'system',
  setTheme: () => null,
};

export const ThemeProviderContext =
  React.createContext<InitialContextProps>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'triplog-theme',
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Themes>(
    () => (localStorage.getItem(storageKey) as Themes) || defaultTheme,
  );

  React.useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Themes) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
