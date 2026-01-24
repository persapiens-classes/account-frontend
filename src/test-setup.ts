import { vi } from 'vitest';
import { getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

// Initialize TestBed for Angular components
// Note: Even with zoneless change detection, we still need to initialize the test environment
// Initialize TestBed for Angular components
// Note: Even with zoneless change detection, we still need to initialize the test environment
// The zoneless provider will be added in each test's configureTestingModule call
getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting(), {
  teardown: { destroyAfterEach: true },
});
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

if (globalThis.window != undefined) {
  Object.defineProperty(globalThis.window, 'matchMedia', {
    writable: true,
    value: globalThis.matchMedia,
  });
}

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
