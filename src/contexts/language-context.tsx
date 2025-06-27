'use client';

import React, { createContext, useState, useMemo, useEffect } from 'react';
import type { Locale } from '@/lib/types';

export type LanguageContextType = {
  language: Locale;
  setLanguage: (language: Locale) => void;
};

export const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Locale>('es');

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
