import { SupportedLang, SUPPORTED_LANGS, changeLanguage } from '../i18n';
import { useTranslation } from 'react-i18next';

const LANG_LABEL: Record<SupportedLang, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
};

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const currentLang = (i18n.language || 'en').substring(0, 2) as SupportedLang;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = event.target.value as SupportedLang;
    changeLanguage(lang);
  };

  return (
    <div className="flex items-center gap-2 text-xs text-[#2D2F34]/70">
      <span>{t('language_label')}</span>
      <select
        value={currentLang}
        onChange={handleChange}
        className="border border-[#E0E2E7] rounded-md px-2 py-1 bg-white text-xs"
      >
        {SUPPORTED_LANGS.map((lang) => (
          <option key={lang} value={lang}>
            {LANG_LABEL[lang]}
          </option>
        ))}
      </select>
    </div>
  );
}


