import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';
import frTranslations from './locales/fr.json';

// Idiomas soportados
export const SUPPORTED_LANGS = ['en', 'es', 'fr'] as const;
export type SupportedLang = (typeof SUPPORTED_LANGS)[number];

// Detección simple de idioma del navegador
function detectBrowserLang(): SupportedLang {
  if (typeof navigator === 'undefined') return 'en';

  const navLang =
    (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    'en';

  const lang = navLang.toLowerCase();

  if (lang.startsWith('es')) return 'es';
  if (lang.startsWith('fr')) return 'fr';
  return 'en';
}

// Prioridad: localStorage > navegador > 'en'
const storedLang =
  typeof window !== 'undefined'
    ? (window.localStorage.getItem('lang') as SupportedLang | null)
    : null;

const initialLang: SupportedLang = storedLang || detectBrowserLang();

const resources = {
  en: { translation: enTranslations },
  es: { translation: esTranslations },
  fr: { translation: frTranslations },
};

i18n.use(initReactI18next).init({
  resources,
  lng: initialLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

// Helper para cambiar idioma y persistirlo
export function changeLanguage(lang: SupportedLang) {
  i18n.changeLanguage(lang);
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('lang', lang);
  }
}

export default i18n;


