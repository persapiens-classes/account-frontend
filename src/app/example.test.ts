import { describe, it, expect, vi } from 'vitest';
import { signal } from '@angular/core';

// Simple test example for a utility function
describe('Signals Utilities', () => {
  it('should create a signal with initial value', () => {
    const count = signal(0);
    expect(count()).toBe(0);
  });

  it('should update signal value', () => {
    const count = signal(0);
    count.set(5);
    expect(count()).toBe(5);
  });

  it('should update signal using update function', () => {
    const count = signal(0);
    count.update((value) => value + 1);
    expect(count()).toBe(1);
  });
});

// Exemplo de como testar services/functions com mocks
describe('Mock Examples', () => {
  it('should mock a function', () => {
    const mockFn = vi.fn();
    mockFn.mockReturnValue('mocked value');

    expect(mockFn()).toBe('mocked value');
    expect(mockFn).toHaveBeenCalled();
  });

  it('should mock localStorage', () => {
    const setItemMock = vi.fn();
    Object.defineProperty(window, 'localStorage', {
      value: {
        setItem: setItemMock,
        getItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
    });

    localStorage.setItem('key', 'value');

    expect(setItemMock).toHaveBeenCalledWith('key', 'value');
  });
});

// Async test example
describe('Async Tests', () => {
  it('should handle async operations', async () => {
    const asyncFunction = async () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve('async result'), 100);
      });
    };

    const result = await asyncFunction();
    expect(result).toBe('async result');
  });
});
