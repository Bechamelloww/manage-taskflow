import { create } from 'zustand';
import { storage } from '@/lib/storage';

type LanguageState = {
    locale: string;
    setLocale: (lang: string) => void;
    loadLocale: () => Promise<void>;
};

export const useLanguageStore = create<LanguageState>((set) => ({
    locale: 'en',

    setLocale: async (lang) => {
        await storage.setItem('app_language', lang);
        set({ locale: lang });
    },

    loadLocale: async () => {
        const saved = await storage.getItem('app_language');
        if (saved) {
            set({ locale: saved });
        }
    },
}));