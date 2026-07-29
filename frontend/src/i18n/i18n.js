import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation JSON resources for 23 Indian languages
import en from '../locales/en/translation.json';
import hi from '../locales/hi/translation.json';
import mr from '../locales/mr/translation.json';
import bn from '../locales/bn/translation.json';
import te from '../locales/te/translation.json';
import ta from '../locales/ta/translation.json';
import gu from '../locales/gu/translation.json';
import kn from '../locales/kn/translation.json';
import ml from '../locales/ml/translation.json';
import pa from '../locales/pa/translation.json';
import or from '../locales/or/translation.json';
import as from '../locales/as/translation.json';
import ur from '../locales/ur/translation.json';
import sa from '../locales/sa/translation.json';
import kok from '../locales/kok/translation.json';
import ne from '../locales/ne/translation.json';
import doi from '../locales/doi/translation.json';
import mai from '../locales/mai/translation.json';
import sat from '../locales/sat/translation.json';
import ks from '../locales/ks/translation.json';
import sd from '../locales/sd/translation.json';
import mni from '../locales/mni/translation.json';
import brx from '../locales/brx/translation.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  mr: { translation: mr },
  bn: { translation: bn },
  te: { translation: te },
  ta: { translation: ta },
  gu: { translation: gu },
  kn: { translation: kn },
  ml: { translation: ml },
  pa: { translation: pa },
  or: { translation: or },
  as: { translation: as },
  ur: { translation: ur },
  sa: { translation: sa },
  kok: { translation: kok },
  ne: { translation: ne },
  doi: { translation: doi },
  mai: { translation: mai },
  sat: { translation: sat },
  ks: { translation: ks },
  sd: { translation: sd },
  mni: { translation: mni },
  brx: { translation: brx }
};

// Retrieve stored language from localStorage or default to 'en'
const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem('app_language') || 'en' : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values safely
    },
    react: {
      useSuspense: false
    }
  });

// Keep localStorage in sync whenever the language changes
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('app_language', lng);
  }
});

export default i18n;
