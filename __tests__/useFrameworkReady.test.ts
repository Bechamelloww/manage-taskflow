import { describe, it, expect, beforeEach } from '@jest/globals';
import { renderHook } from '@testing-library/react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

describe('useFrameworkReady', () => {
  beforeEach(() => {
    (window as any).frameworkReady = undefined;
  });

  it('calls window.frameworkReady when defined', () => {
    const mockFn = jest.fn();
    (window as any).frameworkReady = mockFn;

    renderHook(() => useFrameworkReady());

    expect(mockFn).toHaveBeenCalled();
  });

  it('does not throw when window.frameworkReady is undefined', () => {
    expect(() => {
      renderHook(() => useFrameworkReady());
    }).not.toThrow();
  });
});
