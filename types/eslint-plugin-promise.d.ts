// O eslint-plugin-promise ainda não publica declarações de tipo próprias.
// Sem isto ele entra como `any` e derruba as regras no-unsafe-* na config.
declare module 'eslint-plugin-promise' {
  import type { Linter } from 'eslint';

  const plugin: {
    configs: {
      recommended: Linter.Config;
      'flat/recommended': Linter.Config;
    };
  };

  export default plugin;
}
