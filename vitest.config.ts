import { defineConfig } from 'vitest/config';
import path from 'node:path';

const raiz = import.meta.dirname;

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.d.ts', 'src/index.ts'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    }
  },
  resolve: {
    // Precisa espelhar o "paths" do tsconfig.json.
    alias: {
      '@/test': path.resolve(raiz, './test'),
      '@': path.resolve(raiz, './src')
    }
  }
});
