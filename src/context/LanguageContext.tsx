import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { I18nManager } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Language, getTranslation } from '../utils/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string) => string;
  loading: boolean;
  isRTL: boolean;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const savedLanguage = await SecureStore.getItemAsync('language') as Language | null;
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
          setLanguageState(savedLanguage);
          applyLanguageDirection(savedLanguage);
        }
      } catch (e) {
        console.warn('Failed to load language preference', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const applyLanguageDirection = (lang: Language) => {
    const isRTL = lang === 'ar';
    I18nManager.forceRTL(isRTL);
  };

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    applyLanguageDirection(lang);
    try {
      await SecureStore.setItemAsync('language', lang);
    } catch (e) {
      console.warn('Failed to save language preference', e);
    }
  };

  const t = (key: string): string => {
    return getTranslation(key, language);
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, loading, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};
