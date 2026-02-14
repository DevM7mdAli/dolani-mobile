import { I18nManager } from 'react-native';

import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

/* ── Translation Resources ── */

const resources = {
  en: {
    translation: {
      common: {
        appName: 'Dolani',
        loading: 'Loading…',
        error: 'Something went wrong',
        retry: 'Retry',
        cancel: 'Cancel',
        confirm: 'Confirm',
        search: 'Search',
        back: 'Back',
      },
      navigation: {
        startNavigation: 'Start Navigation',
        arrived: 'You have arrived!',
        recalculating: 'Recalculating route…',
      },
      emergency: {
        title: 'Emergency',
        evacuate: 'Follow the path to the nearest exit',
      },
    },
  },
  ar: {
    translation: {
      common: {
        appName: 'دُلَّني',
        loading: 'جارٍ التحميل…',
        error: 'حدث خطأ ما',
        retry: 'إعادة المحاولة',
        cancel: 'إلغاء',
        confirm: 'تأكيد',
        search: 'بحث',
        back: 'رجوع',
      },
      navigation: {
        startNavigation: 'ابدأ التنقل',
        arrived: 'لقد وصلت!',
        recalculating: 'جارٍ إعادة حساب المسار…',
      },
      emergency: {
        title: 'طوارئ',
        evacuate: 'اتبع المسار إلى أقرب مخرج',
      },
    },
  },
} as const;

/* ── RTL Support ── */

const deviceLanguage = getLocales()[0]?.languageCode ?? 'en';
const isRTL = deviceLanguage === 'ar';

I18nManager.allowRTL(true);
I18nManager.forceRTL(isRTL);

/* ── i18next Initialization ── */

i18n.use(initReactI18next).init({
  resources,
  lng: deviceLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already escapes by default
  },
  react: {
    useSuspense: false, // Avoid suspense boundary issues on native
  },
});

export default i18n;
