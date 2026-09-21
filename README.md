# setup_padrao

Estrutura padrão para projetos **backend em TypeScript**: build, testes,
lint, formatação, validação de ambiente e hooks de commit já configurados.

O passo a passo de como cada peça foi montada está em [SETUP.md](./SETUP.md).

## Requisitos

- Node `^22.16.0 || >=24` (a versão usada no dia a dia está em `.nvmrc`)
- npm 10+
- Docker (opcional, para o PostgreSQL do `docker-compose.yml`)

## Começando

```bash
npm install          # instala e registra os hooks do husky (script "prepare")
cp .env.example .env # ajuste os valores
npm start
```

## Scripts

| Script                  | O que faz                                             |
| ----------------------- | ----------------------------------------------------- |
| `npm start`             | Roda `src/index.ts` direto com tsx                    |
| `npm run start:dev`     | Igual ao anterior, com recarga automática             |
| `npm run build`         | Gera o bundle de produção em `dist/` (tsup)           |
| `npm run start:prod`    | Executa o bundle já compilado                         |
| `npm run typecheck`     | Confere tipos com `tsc --noEmit`                      |
| `npm run lint`          | ESLint (`lint:fix` corrige o que dá)                  |
| `npm run format`        | Prettier (`format:check` só verifica)                 |
| `npm test`              | Vitest, execução única                                |
| `npm run test:unit`     | Vitest em modo watch                                  |
| `npm run test:coverage` | Testes com relatório de cobertura                     |
| `npm run test:debug`    | Vitest com o inspetor do Node, sem paralelismo        |
| `npm run check`         | `typecheck` + `lint` + `test` — o mesmo que a CI roda |

> O build usa esbuild (via tsup), que **não** confere tipos. Por isso
> `typecheck` é um passo separado, presente no pre-commit e na CI.

## Estrutura

```
.github/workflows/ci.yml   Pipeline: format, typecheck, lint, testes, build
.husky/                    Hooks de git (pre-commit e commit-msg)
src/config/env.ts          Validação das variáveis de ambiente (zod)
src/index.ts               Ponto de entrada; única entry do bundle
test/                      Testes *.spec.ts
types/                     Declarações para pacotes sem tipos próprios
eslint.config.ts           Configuração do ESLint (flat config)
```

## Alias de importação

`@/` aponta para `src/` e `@/test/` para `test/`:

```ts
import { soma } from '@/one/two/operacoes';
```

Os alias são declarados em **dois** lugares e precisam ser mantidos em sincronia:
`paths` no `tsconfig.json` e `resolve.alias` no `vitest.config.ts`.

## Variáveis de ambiente

`src/config/env.ts` valida `process.env` com zod no boot: se faltar variável ou
o formato estiver errado, a aplicação falha imediatamente com mensagem clara,
em vez de quebrar mais tarde. Ao adicionar uma variável, atualize o esquema
**e** o `.env.example`.

O `.env` é carregado pelo próprio Node (`--env-file-if-exists`), sem dotenv.

## Banco de dados

```bash
docker compose up -d
```

Sobe um PostgreSQL 18 na porta `DATABASE_PORT` (5433 por padrão), com
healthcheck e volume nomeado. As credenciais vêm do `.env`.

## Hooks de git

- **pre-commit** — roda `lint-staged`: Prettier, ESLint e os testes
  relacionados, apenas sobre os arquivos em stage.
- **commit-msg** — valida a mensagem no padrão
  [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
