# Montando o setup do zero

Este documento descreve como esta estrutura foi montada, na ordem em que as
peças se encaixam. Para usar o template no dia a dia veja o [README](./README.md).

Versões de referência: Node 24, npm 11, TypeScript 6.0, ESLint 10, Vitest 5.

---

## 1. Pasta, git e package.json

```bash
mkdir meu-projeto && cd meu-projeto
git init
npm init -y
```

No `package.json`, três campos definem o resto do comportamento:

```json
{
  "type": "module",
  "private": true,
  "engines": { "node": "^22.16.0 || >=24.0.0" }
}
```

- `type: module` — o projeto é ESM.
- `private: true` — impede publicação acidental no npm.
- `engines` — documenta e valida a versão mínima de Node. O intervalo exclui
  a linha 23.x porque `import.meta.dirname` só existe em `^22.16` e `>=24`.

Registre também a versão de trabalho em `.nvmrc`.

---

## 2. TypeScript

```bash
npm i -D typescript @types/node
```

O `tsconfig.json` deste template tem quatro decisões que valem explicação:

**Resolução de módulos: `bundler`, não `nodenext`.**

```json
"module": "preserve",
"moduleResolution": "bundler"
```

`nodenext` é o correto quando o Node resolve os imports sozinho — mas aqui quem
resolve é o esbuild (via tsup no build e tsx em desenvolvimento). Com `nodenext`
os imports precisariam de extensão explícita (`'./operacoes.js'`) e os alias
`@/...` deixam de resolver. `bundler` descreve a realidade do projeto.

**`noEmit: true`.** Quem gera o `dist/` é o tsup; o `tsc` aqui só confere tipos.

**Rigor além do `strict`.** `noUncheckedIndexedAccess` (acesso a índice passa a
ser `T | undefined` — pega a maior classe de bug que o `strict` sozinho deixa
passar), `exactOptionalPropertyTypes`, `noImplicitReturns`, `noUnusedLocals`.

**Compatibilidade com o transpiler.** `isolatedModules` e `verbatimModuleSyntax`
são obrigatórios na prática quando o build é feito por esbuild, que compila
arquivo a arquivo e não enxerga o programa inteiro.

**Alias.** `baseUrl` na raiz e `paths` mapeando `@/*` → `src/*`:

```json
"baseUrl": ".",
"paths": {
  "@/test/*": ["test/*"],
  "@/*": ["src/*"]
}
```

O padrão mais específico (`@/test/*`) precisa vir antes do genérico.

---

## 3. Build com tsup

```bash
npm i -D tsup
```

Como este é um template de **aplicação** (não de biblioteca), o build é um
bundle de entrada única:

```ts
// tsup.config.ts
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node22',
  platform: 'node',
  bundle: true,
  clean: true,
  dts: false
});
```

`clean: true` dispensa o `rimraf` no script de build.

Para uma **biblioteca**, mude para `dts: true` e declare `exports` e `files`
no `package.json`.

> O esbuild transpila sem checar tipos. Por isso `npm run typecheck` existe
> como passo separado — sem ele é possível buildar código que não compila.

---

## 4. Execução em desenvolvimento

```bash
npm i -D tsx
```

```json
"start": "tsx --env-file-if-exists=.env ./src/index.ts",
"start:dev": "tsx watch --env-file-if-exists=.env ./src/index.ts"
```

`--env-file-if-exists` é do próprio Node (20.6+): carrega o `.env` sem dotenv.

---

## 5. ESLint 10 (flat config)

```bash
npm i -D eslint @eslint/js typescript-eslint eslint-plugin-n \
         eslint-plugin-promise eslint-config-prettier globals jiti
```

O formato `.eslintrc.json` foi descontinuado: o padrão desde a v9 é o **flat
config**, e o `.eslintignore` também deixou de ser lido (os ignores vão dentro
da config). O `eslint-config-standard-with-typescript` está deprecado.

A config vive em `eslint.config.ts` — TypeScript, resolvido pelo `jiti`. Isso
faz o próprio arquivo de configuração ser checado por tipos.

Pontos de atenção:

- `projectService: true` substitui o antigo `project: ['./tsconfig.json']`:
  descobre o tsconfig sozinho e é bem mais rápido.
- `eslint-config-prettier` **por último**, desligando tudo que conflita com o
  formatador.
- `n/no-missing-import` fica desligado porque os alias `@/` não são resolvíveis
  pelo Node.
- `eslint-plugin-promise` não publica tipos; sem a declaração em
  `types/eslint-plugin-promise.d.ts` ele entra como `any` e derruba as regras
  `no-unsafe-*` dentro da própria config.

---

## 6. Prettier

```bash
npm i -D prettier
```

Divisão de responsabilidades: **Prettier formata, ESLint analisa.** As regras
de estilo do ESLint são desligadas pelo `eslint-config-prettier`, evitando que
as duas ferramentas briguem pelo mesmo arquivo.

Configuração em `.prettierrc.json`, exclusões em `.prettierignore`.

---

## 7. Vitest

```bash
npm i -D vitest @vitest/coverage-v8
```

O `vitest.config.ts` repete os alias do `tsconfig.json` (o Vitest não lê
`paths` sozinho) e define a cobertura:

```ts
coverage: {
  provider: 'v8',
  reporter: ['text', 'html', 'lcov'],
  include: ['src/**/*.ts'],
  exclude: ['src/**/*.d.ts', 'src/index.ts'],
  thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 }
}
```

Sem `thresholds` o relatório é apenas informativo e nada reprova.

Para depurar: `npm run test:debug` (usa `--no-file-parallelism`; a antiga
flag `--threads=false` foi removida no Vitest 2).

---

## 8. Husky 9 e lint-staged

```bash
npm i -D husky lint-staged
npm pkg set scripts.prepare="husky"
npm run prepare
```

Na v9 o arquivo de hook é só o comando — as duas linhas de shebang do husky 8
foram removidas, e `husky install`/`husky add` deram lugar a `husky init`.

```sh
# .husky/pre-commit
npx lint-staged
```

No `.lintstagedrc.json`, **não** repita o glob nos comandos: o lint-staged já
passa a lista de arquivos em stage como argumento.

```json
{
  "*.ts": [
    "prettier --write",
    "eslint --fix",
    "vitest related --run --passWithNoTests"
  ],
  "*.{json,md,yml,yaml}": ["prettier --write"]
}
```

`vitest related` recebe **arquivos-fonte** e descobre sozinho quais testes
dependem deles.

---

## 9. Validação da mensagem de commit

```bash
npm i -D git-commit-msg-linter
```

**Atenção:** o pacote instala o hook em `.git/hooks/commit-msg`, que o Git
**ignora** quando o husky aponta `core.hooksPath` para `.husky`. Sem a ponte
abaixo, a validação simplesmente nunca roda:

```sh
# .husky/commit-msg
node ./node_modules/commit-msg-linter/commit-msg-linter.js
```

---

## 10. Variáveis de ambiente

```bash
npm i zod
```

`src/config/env.ts` valida `process.env` contra um esquema e falha no boot com
mensagem clara. Tudo que vem do ambiente é string, por isso os campos numéricos
usam `z.coerce`.

Versione o `.env.example`; mantenha o `.env` fora do repositório.

---

## 11. Integração contínua

`.github/workflows/ci.yml` roda, em Node 22 e 24, exatamente o que o
desenvolvedor roda localmente: `format:check`, `typecheck`, `lint`,
`test:coverage` e `build`.

O hook de pre-commit é local e pode ser contornado com `--no-verify`; a CI é
a rede de segurança real.

---

## 12. Docker

`docker-compose.yml` sobe um PostgreSQL 18 para desenvolvimento, com
healthcheck e credenciais vindas do `.env`. A chave `version:` não existe mais
no Compose V2.

O `Dockerfile` é multi-stage: um estágio compila, outro carrega só o `dist/` e
as dependências de produção, rodando como usuário `node`.

---

## Versao do TypeScript

O projeto usa **TypeScript 6.0.3**, fixado como `~6.0.3`.

O range e `~` e nao `^` de proposito: o peer do `typescript-eslint` e
`>=4.8.4 <6.1.0`, entao um `^6.0.3` deixaria entrar uma futura 6.1 que
quebraria o lint com reconhecimento de tipos.

O **TypeScript 7** (compilador reescrito em Go) ja esta publicado como
`latest`, mas ainda nao e utilizavel aqui: o `typescript-eslint` recusa a
versao de forma explicita.

```
Error: typescript-eslint does not support TS 7.0.
```

O suporte e rastreado em
[typescript-eslint#10940](https://github.com/typescript-eslint/typescript-eslint/issues/10940).

Fora o lint, o restante ja funciona com o TS 7: testado nesta base, `typecheck`,
`build` e testes passam. O `tsconfig.json` tambem ja esta preparado — nao usa
mais `baseUrl` (removido no TS 7) e os `paths` sao relativos, como o TS 7 exige.

Quando o `typescript-eslint` liberar a versao, o upgrade e apenas:

```bash
npm i -D typescript@latest
```
