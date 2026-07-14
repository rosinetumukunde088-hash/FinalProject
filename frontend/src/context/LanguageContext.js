import { createContext, useState, useContext, useCallback } from 'react';
import translations from './translations';

const LanguageContext = createContext(null);

const LANG_STORAGE_KEY = 'kiramart_lang';

function loadLang() {
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    return stored && translations[stored] ? stored : 'en';
  } catch {
    return 'en';
  }
}

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'rw', label: 'Kinyarwanda', flag: '🇷🇼' },
  { code: 'sw', label: 'Kiswahili', flag: '🇰🇪' },
];

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(loadLang);

  const switchLang = useCallback((code) => {
    if (translations[code]) {
      setLang(code);
      localStorage.setItem(LANG_STORAGE_KEY, code);
    }
  }, []);

  const t = useCallback(
    (path) => {
      const keys = path.split('.');
      let result = translations[lang];
      for (const key of keys) {
        if (result && typeof result === 'object' && key in result) {
          result = result[key];
        } else {
          return path;
        }
      }
      return typeof result === 'string' ? result : path;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, switchLang, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
