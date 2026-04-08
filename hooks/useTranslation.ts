import { useLanguageStore } from '@/stores/languageStore';
import { i18n } from '@/i18n';

export function useTranslation() {
    const { locale, setLocale } = useLanguageStore();

    i18n.locale = locale;

    return {
        t: (key: string) => i18n.t(key),
        locale,
        changeLanguage: setLocale,
    };
}