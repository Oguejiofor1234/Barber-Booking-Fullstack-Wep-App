import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language?.startsWith('fr') ? 'fr' : 'en';

  const toggle = () => {
    i18n.changeLanguage(current === 'en' ? 'fr' : 'en');
  };

  return (
    <button
      onClick={toggle}
      aria-label="Switch language"
      className="flex items-center gap-1 text-sm font-semibold border border-gray-200 rounded-lg px-3 py-1.5 hover:border-primary-400 transition-colors"
    >
      <span className={current === 'en' ? 'text-primary-500' : 'text-gray-400'}>EN</span>
      <span className="text-gray-300">|</span>
      <span className={current === 'fr' ? 'text-primary-500' : 'text-gray-400'}>FR</span>
    </button>
  );
}
