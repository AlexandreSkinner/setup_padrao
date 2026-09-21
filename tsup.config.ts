import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'], // Ponto de entrada único da aplicação
  outDir: 'dist',
  format: ['esm'],
  target: 'node22',
  platform: 'node',
  bundle: true, // Gera um arquivo só, com os alias "@/" já resolvidos
  splitting: false,
  treeshake: true,
  sourcemap: true, // Sourcemaps para depuração
  clean: true, // Limpa o dist antes do build (dispensa o rimraf)
  dts: false // Aplicação não publica tipos; use true em bibliotecas
});
