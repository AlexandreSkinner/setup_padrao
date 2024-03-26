import { defineConfig } from 'tsup';

export default defineConfig({
  target: 'es2022',
  entry: ['src/**/*.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true
});
