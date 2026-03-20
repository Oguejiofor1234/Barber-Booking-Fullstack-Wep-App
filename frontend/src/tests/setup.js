import '@testing-library/jest-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en/translation.json';
import fr from '../locales/fr/translation.json';

// Initialise i18n once for all tests so t() calls resolve to real strings
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    interpolation: { escapeValue: false },
  });
}

// Mock react-hot-toast globally so it doesn't complain about missing Toaster
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error:   vi.fn(),
    loading: vi.fn(),
  },
  Toaster: () => null,
}));

// Mock axios api utility
vi.mock('../utils/api', () => ({
  default: {
    get:      vi.fn(),
    post:     vi.fn(),
    patch:    vi.fn(),
    delete:   vi.fn(),
    defaults: { headers: { common: {} } },
    interceptors: {
      response: { use: vi.fn() },
    },
  },
}));
