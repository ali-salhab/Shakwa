import React, { createContext, useEffect, useState, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { getTheme } from '../../theme/themes';
import { ThemeType } from '../../theme/colors';

interface ThemeContextType {
  theme: ReturnType<typeof getTheme>;
  themeType: ThemeType;
  setThemeType: (type: ThemeType) => Promise<void>;
  toggleTheme: () => Promise<void>;
  loading: boolean;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeType, setThemeTypeState] = useState<ThemeType>('light');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const savedTheme = await SecureStore.getItemAsync('theme') as ThemeType | null;
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
          setThemeTypeState(savedTheme);
        }
      } catch (e) {
        console.warn('Failed to load theme preference', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const setThemeType = async (type: ThemeType) => {
    setThemeTypeState(type);
    try {
      await SecureStore.setItemAsync('theme', type);
    } catch (e) {
      console.warn('Failed to save theme preference', e);
    }
  };

  const toggleTheme = async () => {
    const newType = themeType === 'light' ? 'dark' : 'light';
    await setThemeType(newType);
  };

  const theme = getTheme(themeType);

  return (
    <ThemeContext.Provider value={{ theme, themeType, setThemeType, toggleTheme, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};
