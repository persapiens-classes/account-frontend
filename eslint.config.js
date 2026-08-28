// @ts-check
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import securityPlugin from 'eslint-plugin-security';
import prettierDisableRules from 'eslint-config-prettier';
import sonarjs from 'eslint-plugin-sonarjs';
import eslintPluginCypress from 'eslint-plugin-cypress';

const sonarjsRecommendedRules =
  sonarjs.configs?.recommended &&
  !Array.isArray(sonarjs.configs.recommended) &&
  'rules' in sonarjs.configs.recommended &&
  sonarjs.configs.recommended.rules
    ? sonarjs.configs.recommended.rules
    : {};

export default defineConfig([
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,

  securityPlugin.configs.recommended,
  ...angular.configs.tsRecommended,

  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      prettier: prettierPlugin,
      sonarjs,
    },
    rules: {
      ...sonarjsRecommendedRules,
      'prettier/prettier': 'error',
      '@typescript-eslint/no-deprecated': 'error',
      // General configuration: maximum 4 nesting levels
      'max-depth': ['error', 4],
    },
  },
  {
    files: ['src/**/*.component.ts'],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
    },
  },
  {
    // Specific configuration for test files: maximum 5 levels
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      'max-depth': ['error', 5],
      // Allow more function nesting in tests (describe/it/etc)
      'sonarjs/no-nested-functions': 'off',
    },
  },
  {
    // Specific configuration for Cypress files
    files: ['cypress/**/*.ts'],
    plugins: {
      cypress: eslintPluginCypress,
    },
    rules: {
      // Cypress requires namespace for custom command type definitions
      '@typescript-eslint/no-namespace': 'off',
      ...eslintPluginCypress.configs.recommended.rules,
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {},
  },
  {
    files: [
      'cypress/owner/owner.cy.ts',
      'cypress/category/category.cy.ts',
      'cypress/account/account.cy.ts',
      'cypress/entry/entry.cy.ts',
    ],
    rules: {
      'sonarjs/no-empty-test-file': 'off',
    },
  },

  prettierDisableRules,
]);
