import { useEffect, useState } from 'react';
import { ColorSchemeContext } from './ColorSchemeContext';

type ColorScheme = 'light' | 'dark';

export function ColorSchemeProvider({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    const stored = localStorage.getItem('color-scheme');
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('color-scheme', colorScheme);
    if (colorScheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [colorScheme]);

  const toggleColorScheme = () => {
    setColorScheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ColorSchemeContext.Provider value={{ colorScheme, toggleColorScheme }}>
      {children}
    </ColorSchemeContext.Provider>
  );
} 