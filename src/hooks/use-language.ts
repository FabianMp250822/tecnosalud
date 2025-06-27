import { useContext } from 'react';
import { LanguageContext, LanguageContextType } from '@/contexts/language-context';
import { dictionary } from '@/lib/i18n';

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  const { language, setLanguage } = context;
  const t = dictionary[language];

  return { language, setLanguage, t };
};
