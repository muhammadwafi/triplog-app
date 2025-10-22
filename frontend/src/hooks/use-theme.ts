import { useContext } from 'react';

import type { InitialContextProps } from '@/lib/theme-provider';
import { ThemeProviderContext } from '@/lib/theme-provider';

export const useTheme = (): InitialContextProps => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
