import 'zone.js';
import 'zone.js/testing';
import { vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

// Initialize TestBed for Angular components
TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());

// Configuração global para testes Angular com Vitest
interface GlobalThis {
  ngDevMode?: boolean;
}

(globalThis as GlobalThis).ngDevMode = false;

// Mock para matchMedia (necessário para alguns componentes PrimeNG)
Object.defineProperty(window, 'matchMedia', {
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

// Mock para ResizeObserver (usado por alguns componentes)
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock para IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Configuração para fetch (se necessário)
if (!globalThis.fetch) {
  globalThis.fetch = vi.fn();
}

// Mock básico para localStorage se necessário
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock para sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock,
});
