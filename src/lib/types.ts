export type Locale = 'en' | 'es';

export type NestedTranslations = {
  [key: string]: string | NestedTranslations;
};

export type Dictionary = {
  en: NestedTranslations;
  es: NestedTranslations;
};
