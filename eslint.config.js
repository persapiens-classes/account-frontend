// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const prettierPlugin = require('eslint-plugin-prettier');
const securityPlugin = require('eslint-plugin-security');
const prettierDisableRules = require('eslint-config-prettier');
const securityPluginRecommended = require('eslint-plugin-security').configs.recommended;
const sonarjs = require('eslint-plugin-sonarjs');

module.exports = tseslint.config(
  {
    ignores: ['node_modules/**/*'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: __dirname,
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
    files: ['**/*.test.ts', '**/*.spec.ts', 'cypress/**/*.ts'],
    rules: {
      'max-depth': ['error', 5],
      // Allow more function nesting in tests (describe/it/etc)
      'sonarjs/no-nested-functions': 'off',
      // Allow namespaces in Cypress commands definition
      '@typescript-eslint/no-namespace': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {},
  },
);
