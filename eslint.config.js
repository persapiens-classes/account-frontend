// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import securityPlugin from 'eslint-plugin-security';
import prettierDisableRules from 'eslint-config-prettier';
import sonarjs from 'eslint-plugin-sonarjs';

const securityPluginRecommended = securityPlugin.configs.recommended;

export default tseslint.config(
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    plugins: {
      prettier: prettierPlugin,
      security: securityPlugin,
      sonarjs,
    },
    processor: angular.processInlineTemplates,
    rules: {
      ...sonarjs.configs.recommended.rules,
      ...prettierDisableRules.rules,
      'prettier/prettier': 'error',
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@typescript-eslint/no-deprecated': 'error',
      ...securityPluginRecommended.rules,
      // General configuration: maximum 4 nesting levels
      'max-depth': ['error', 4],
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
    rules: {
      // Cypress requires namespace for custom command type definitions
      '@typescript-eslint/no-namespace': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {},
  },
);
