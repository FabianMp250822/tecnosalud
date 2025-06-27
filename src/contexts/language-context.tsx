'use client';

import React, { createContext, useState, useMemo, useEffect, useCallback } from 'react';
import type { Locale } from '@/lib/types';

export type LanguageContextType = {
  language: Locale;
  setLanguage: (language: Locale) => void;
};

export const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Locale>('es');

  // On mount, check for saved language in localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Locale;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = useCallback((lang: Locale) => {
    localStorage.setItem('language', lang);
    setLanguageState(lang);
  }, []);

  // Update lang attribute on initial load and when language changes
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);


  const value = useMemo(() => ({ language, setLanguage }), [language, setLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
