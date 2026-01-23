// vite.config.ts
import { defineConfig } from 'vite';
import analog from '@analogjs/platform';
import istanbul from 'vite-plugin-istanbul';

console.log('--- DEBUG ---');
console.log('VITE_COVERAGE:', process.env['VITE_COVERAGE']);
console.log('--- DEBUG ---');

export default defineConfig(({ mode }) => {
  const isCoverage = process.env['VITE_COVERAGE'] === 'true';

  return {
    plugins: [
      analog({
        ssr: false, // Force SPA mode (Client-only)
        static: false, // Ensure it does not try to pre-render static pages
      }),
      isCoverage
        ? istanbul({
            include: 'src/*',
            exclude: [
              'node_modules',
              'test/',
              'cypress/',
              'vite.config.ts',
              'cypress.config.ts',
              '**/*.spec.ts',
              'src/main.ts',
              'src/app/shared/test-utils.ts',
            ],
            extension: ['.js', '.ts', '.html'],
            requireEnv: false,
            forceBuildInstrument: true,
            cypress: true,
          })
        : [],
    ],
    server: {
      port: 5173,
      watch: {
        ignored: [
          '**/node_modules/**',
          '**/dist/**',
          '**/.angular/**',
          '**/coverage/**',
          '**/.nyc_output/**',
        ],
      },
    },
    build: {
      sourcemap: true,
    },
  };
});
