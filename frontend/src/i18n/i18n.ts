import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import hi from './locales/hi.json';
import mr from './locales/mr.json';
import gu from './locales/gu.json';

// Supported language codes
export const SUPPORTED_LANGUAGES = ['en', 'hi', 'mr', 'gu'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
    en: 'English',
    hi: 'हिन्दी',
    mr: 'मराठी',
    gu: 'ગુજરાતી',
};

i18n
    // Auto-detect browser / localStorage language
    .use(LanguageDetector)
    // Pass react-i18next to i18next
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            hi: { translation: hi },
            mr: { translation: mr },
            gu: { translation: gu },
        },

        // Fallback when a key is missing in the current language
        fallbackLng: 'en',

        // Only allow the four languages we translate
        supportedLngs: SUPPORTED_LANGUAGES,

        // Don't add country suffix (e.g. en-US → en)
        load: 'languageOnly',

        interpolation: {
            // React already escapes values
            escapeValue: false,
        },

        detection: {
            // Priority order: localStorage → navigator language → HTML lang attr
            order: ['localStorage', 'navigator', 'htmlTag'],
            // Key used in localStorage
            lookupLocalStorage: 'grihvo_lang',
            // Persist detected / selected language
            caches: ['localStorage'],
        },
    });

export default i18n;
