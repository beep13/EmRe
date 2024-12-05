export type ColorScheme = 'light' | 'dark';

export interface ColorSchemeContextType {
  colorScheme: ColorScheme;
  toggleColorScheme: () => void;
} 