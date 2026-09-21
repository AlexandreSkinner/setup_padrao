import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import n from 'eslint-plugin-n';
import promise from 'eslint-plugin-promise';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default defineConfig([
  globalIgnores([
    'dist/**',
    'coverage/**',
    'node_modules/**',
    '.husky/**',
    // Temporario do Code Runner, criado ao executar uma selecao de codigo.
    '**/tempCodeRunnerFile.*'
  ]),

  {
    files: ['**/*.ts'],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      n.configs['flat/recommended-module'],
      promise.configs['flat/recommended'],
      // Precisa ser o último: desliga tudo que conflita com o Prettier.
      prettier
    ],
    languageOptions: {
      globals: { ...globals.node },
      parserOptions: {
        // projectService substitui o antigo "project": descobre o tsconfig
        // sozinho e é bem mais rápido em projetos grandes.
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      // Os alias "@/..." são resolvidos por tsup/tsx/vitest, não pelo Node.
      'n/no-missing-import': 'off',
      // Interpolar número em template string é idiomático e seguro.
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true }
      ]
    }
  },

  // Arquivos de configuração da raiz importam devDependencies.
  {
    files: ['*.config.ts'],
    rules: {
      'n/no-unpublished-import': 'off'
    }
  },

  // Nos testes o uso de "!" e de dados parciais é aceitável.
  {
    files: ['test/**/*.ts'],
    rules: {
      'n/no-unpublished-import': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off'
    }
  }
]);
