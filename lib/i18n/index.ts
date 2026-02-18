// import { getLocales } from 'expo-localization';
import { I18nManager } from 'react-native';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { ar } from './locales/ar';
import { en } from './locales/en';

// const deviceLanguage = getLocales()[0]?.languageCode ?? 'sa';
const initialLang = I18nManager.isRTL ? 'ar' : 'en';
i18n.use(initReactI18next).init({
  resources: {
    ar: ar,
    en: en,
  },
  lng: initialLang,
  fallbackLng: 'sa',
  interpolation: {
    escapeValue: false, // Required for React / React Native
  },
  react: {
    useSuspense: false,
  },
});
export default i18n;
