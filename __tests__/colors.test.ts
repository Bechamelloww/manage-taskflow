import { describe, it, expect } from '@jest/globals';
import { TASK_COLORS, DEFAULT_COLOR, getTint, theme } from '@/lib/colors';

describe('colors', () => {
  describe('TASK_COLORS', () => {
    it('contains 8 colors', () => {
      expect(TASK_COLORS).toHaveLength(8);
    });

    it('each color has name, hex, and tint', () => {
      TASK_COLORS.forEach(color => {
        expect(color).toHaveProperty('name');
        expect(color).toHaveProperty('hex');
        expect(color).toHaveProperty('tint');
      });
    });
  });

  describe('DEFAULT_COLOR', () => {
    it('is the hex of the first color', () => {
      expect(DEFAULT_COLOR).toBe(TASK_COLORS[0].hex);
    });
  });

  describe('getTint', () => {
    it('returns the tint for a known color', () => {
      expect(getTint('#007AFF')).toBe('#E5F1FF');
    });

    it('is case-insensitive', () => {
      expect(getTint('#007aff')).toBe('#E5F1FF');
    });

    it('returns fallback for unknown color', () => {
      expect(getTint('#123456')).toBe('#F2F2F7');
    });

    it('returns fallback for null', () => {
      expect(getTint(null)).toBe('#F2F2F7');
    });

    it('returns fallback for undefined', () => {
      expect(getTint(undefined)).toBe('#F2F2F7');
    });
  });

  describe('theme', () => {
    it('has expected properties', () => {
      expect(theme.bg).toBeDefined();
      expect(theme.surface).toBeDefined();
      expect(theme.text).toBeDefined();
      expect(theme.primary).toBeDefined();
      expect(theme.danger).toBeDefined();
    });
  });
});
