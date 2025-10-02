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
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
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
      // Configuração geral: máximo 4 níveis de aninhamento
      'max-depth': ['error', 4],
    },
  },
  {
    // Configuração específica para arquivos de teste: máximo 5 níveis
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      'max-depth': ['error', 5],
      // Permitir mais aninhamento de funções em testes (describe/it/etc)
      'sonarjs/no-nested-functions': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {},
  },
);
