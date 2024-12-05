import { createContext } from 'react';
import type { ColorSchemeContextType } from './types';

export const ColorSchemeContext = createContext<ColorSchemeContextType>({
  colorScheme: 'light',
  toggleColorScheme: () => {},
});