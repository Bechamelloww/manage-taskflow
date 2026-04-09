import { describe, it, expect, beforeEach } from '@jest/globals';
import { useLanguageStore } from '@/stores/languageStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('languageStore', () => {
  beforeEach(() => {
    useLanguageStore.setState({ locale: 'en' });
    jest.clearAllMocks();
  });

  it('has default locale "en"', () => {
    expect(useLanguageStore.getState().locale).toBe('en');
  });

  describe('setLocale', () => {
    it('updates the locale and persists to storage', async () => {
      await useLanguageStore.getState().setLocale('fr');

      expect(useLanguageStore.getState().locale).toBe('fr');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('app_language', 'fr');
    });
  });

  describe('loadLocale', () => {
    it('loads saved locale from storage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('fr');

      await useLanguageStore.getState().loadLocale();

      expect(useLanguageStore.getState().locale).toBe('fr');
    });

    it('keeps default when no saved locale', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      await useLanguageStore.getState().loadLocale();

      expect(useLanguageStore.getState().locale).toBe('en');
    });
  });
});
