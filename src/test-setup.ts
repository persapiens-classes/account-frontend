import 'zone.js';
import 'zone.js/testing';
import { vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

// Initialize TestBed for Angular components
TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());

// Global configuration for Angular tests with Vitest
interface GlobalThis {
  ngDevMode?: boolean;
}

(globalThis as GlobalThis).ngDevMode = false;

// Mock for matchMedia (required for some PrimeNG components)
Object.defineProperty(globalThis, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock for ResizeObserver (used by some components)
globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock for IntersectionObserver
globalThis.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Configuration for fetch (if needed)
if (!globalThis.fetch) {
  globalThis.fetch = vi.fn();
}

// Basic mock for localStorage if needed
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
});

// Mock for sessionStorage
Object.defineProperty(globalThis, 'sessionStorage', {
  value: localStorageMock,
});
