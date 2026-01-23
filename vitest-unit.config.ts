/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.angular', 'coverage', '**/*.e2e.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['html', 'lcov', 'text', 'text-summary', 'json'],
      reportsDirectory: './coverage/unit',
      include: ['src/**/*.{js,ts,jsx,tsx}'],
      exclude: [
        'node_modules/',
        'src/test-setup.ts',
        'src/main.ts',
        'src/environments/',
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/*.config.ts',
        '**/*.config.js',
        '**/*.d.ts',
        'src/**/*.routes.ts',
        'src/app/app.config.ts',
        'src/app/shared/test-utils.ts',
        'coverage/',
        'dist/',
        '.angular/',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
    // Para melhor compatibilidade com Angular
    // testTransformMode: {
    //  web: ['**/*.ts', '**/*.tsx'],
    // },
  },
  resolve: {
    alias: {
      // Mapeamento de paths do Angular
      '@': '/src',
      '@app': '/src/app',
      '@environments': '/src/environments',
    },
  },
  // Configurações para lidar com módulos Angular
  define: {
    'import.meta.vitest': undefined,
  },
  optimizeDeps: {
    include: ['@angular/core', '@angular/common', '@angular/router'],
  },
});
