import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

describe('storage', () => {
  describe('native platform', () => {
    it('getItem delegates to AsyncStorage', async () => {
      const { storage } = require('@/lib/storage');
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      AsyncStorage.getItem.mockResolvedValue('value');

      const result = await storage.getItem('key');
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('key');
      expect(result).toBe('value');
    });

    it('setItem delegates to AsyncStorage', async () => {
      const { storage } = require('@/lib/storage');
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;

      await storage.setItem('key', 'value');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('key', 'value');
    });
  });

  describe('web platform', () => {
    beforeEach(() => {
      jest.resetModules();
      jest.doMock('react-native', () => ({
        Platform: { OS: 'web' },
      }));
      (global as any).localStorage = {
        getItem: jest.fn().mockReturnValue('web-value'),
        setItem: jest.fn(),
      };
    });

    afterEach(() => {
      delete (global as any).localStorage;
      jest.resetModules();
    });

    it('getItem uses localStorage on web', async () => {
      const { storage } = require('@/lib/storage');
      const result = await storage.getItem('key');
      expect(localStorage.getItem).toHaveBeenCalledWith('key');
      expect(result).toBe('web-value');
    });

    it('setItem uses localStorage on web', async () => {
      const { storage } = require('@/lib/storage');
      await storage.setItem('key', 'value');
      expect(localStorage.setItem).toHaveBeenCalledWith('key', 'value');
    });
  });
});
