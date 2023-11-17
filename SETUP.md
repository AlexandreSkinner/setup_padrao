# Criar a pasta da aplicação.
  Cria a pasta do Projeto como uma subpasta de **projeto**.

```
~/projeto
» mkdir vitest-template
» cd vitest-template
vitest-tamplate on  master [?]
```
# Inicializar o GIT.
  Este comando inicia o controle de versão do código fonte em repositório local.

```
~/projeto/vitest-template
» git init
```
# Inicializar o projeto.
  Este comando cria um arquivo do projeto denominado **package.json** que
  controla as dependências das bibliotecas utilizadas no projeto.

```
~/projeto/vitest-template
» npm init -y
```
# Instalar biblioteca git-commit-msg-linter.
  Esta biblioteca é responsavel por padronizar as mensagens dos nossos commit. Segue o padrão do conventional commit, bloqueando commit que não estiverem em conformidade com este padrão.
 _"Conventional Commit"_.
  [Site conventional commit](https://www.conventionalcommits.org/en/v1.0.0/)

```
~/projeto/vitest-template
» npm i -D git-commit-msg-linter
```
# Cria arquivo .gitignore
Este arquivo serve para informamos as pastas / arquivos para os quais não desejamos controlar versão.
```
node_modules
coverage
dist
.env
VSCode.md
```

# Instalar o Typescript
Instala o compilador da linguagem de programação Typescript e os types do *node* que adicina tipagem ao mesmo, ajudando no intellisence dos comandos.

```
~/projeto/vitest-template
» npm i -D typescript @types/node
```
# Inicializando projeto Typescript.
  Cria o arquivo de configuração do compilador typescript (tsconfig.json).
```
  ~/projeto/vitest-template
  » npx tsc --init
```
Como o typescript foi instalado como dependencia de desenvolvimento temos que utilizar o comando **npx** para executar o compilador **tsc**

## Arquivo de configuração do Typescript (tsconfig.json).

Este arquivo que é inspecionado pelo typescript no momento da compilação.
```
{
  "compilerOptions": {
    "incremental": true,
    "target": "es2022",
    "module": "ESNext",
    "sourceMap": true,
    "removeComments": true,
    "esModuleInterop": true,
    "rootDirs": ["src","test"],
    "outDir": "./dist",
    "moduleResolution": "node",
    "strict": true,
    "noEmitOnError": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "paths": {
      "@/*": ["*"],
      "@/test/*": ["../test/*"]
    },
    "baseUrl": "src"
  },
  "include": ["src", "test", "vitest.config.ts", "tsup.config.ts"],
  "exclude": ["dist", "node_modules"]
}
```
# Instalando o ESLINT.
Realiza a instalação do eslint, bem como configura o padrão da sintaxe do typescript tendo por base as regras definidas no style standard-with-typescript.
```
  ~/projeto/vitest-template
  » npm i --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint eslint-plugin-node

```
Importante que sejam nas versões abaixo:
```
    "@typescript-eslint/eslint-plugin": "^5.59.2",
    "@typescript-eslint/parser": "^5.59.2",
    "eslint": "^8.44.0",
    "eslint-config-standard-with-typescript": "^34.0.1",
    "eslint-plugin-import": "^2.27.5",
    "eslint-plugin-n": "^15.7.0",
    "eslint-plugin-node": "^11.1.0",
    "eslint-plugin-promise": "^6.1.1",
```
  ## Inicializando o eslint.
  O eslint serve para pontuar erros de sintaxe e formatar o código fonte que estiver fora da especificação standard javascript style.
```
  ~/projeto/vitest-template
  » npm init @eslint/config
```
O processo de configuração apresentará um quiz que deverá ter as respostas abaixo:

✅ How would you like to use ESLint? · **style**

✅ What type of modules does your project use? · **esm**

✅ Which framework does your project use? ·**none**

✅ Does your project use TypeScript? · No / **Yes**

✅ Where does your code run? · No items were selected

✅ How would you like to define a style for your project? · **guide**

✅ Which style guide do you want to follow? · **standard-with-typescript**

✅ What format do you want your config file to be in? · **JSON**
<p>Checking peerDependencies of eslint-config-standard-with-typescript@latest</p>
The config that you've selected requires the following dependencies:

eslint-config-standard-with-typescript@latest @typescript-eslint/eslint-plugin@^5.50.0 eslint@^8.0.1 eslint-plugin-import@^2.25.2 eslint-plugin-n@^15.0.0 eslint-plugin-promise@^6.0.0 typescript@*

✅ Would you like to install them now? · No / **Yes**

✅ Which package manager do you want to use? · **npm**

## Arquivo de configuração do lint (.eslintrc.json).
Abaixo temos um exemplo do arquivo de configuração do eslint **.eslintrc.json**
```
{
  "env": {
      "es2021": true,
      "node": true,
      "jest": true
  },
  "extends": "standard-with-typescript",
  "overrides": [
  ],
  "parserOptions": {
      "ecmaVersion": "latest",
      "sourceType": "module",
      "project": ["./tsconfig.json"]
  },
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
      "@typescript-eslint/strict-boolean-expressions": "off",
      "@typescript-eslint/consistent-type-imports": "off",
      "@typescript-eslint/semi": "off",
      "semi": [2, "always"]
  }
}
```
# Instalando o husky.
  Permite utilizarmos os hook do git para garantir que não iremos commitar código fora das
  diretrizes parametrizadas no eslint e que não estiverem passando no teste de unit do vitest.
```
    ~/projeto/vitest-template
    » npm install husky -D
    » npm install -D lint-staged
```
  A biblioteca lint-stage determina que o lint e vitest atuem apenas nos arquivos que se encontram na staged area do git.

  O primeiro comando instala o husky, criando a pasta de mesmo nome.
  O segundo comando cria arquivo de pre-commit com o comando que está entre aspas dentro dele.
  Fazendo com que um commit que não passe no teste realizado pelo Vitest não seja efetivado.
```
    ~/projeto/compras
    » npx husky install
    » npx husky add .husky/pre-commit "npx lint-staged"
```
## Arquivo do lintstaged (lintstagedrc.json).
Este arquivo define os comandos que atuaram nos arquivos na stage area disparado pelo hook do pre-commit.
São executados o eslint para fixar os possiveis erros e o teste através do script**test:staged**
```
{
  "*.ts": [
    "eslint 'src/**' --fix",
    "npm run test:staged"
  ]
}
```
# Instalando o Vitest.
  O comando abaixo instala o Vitest, a biblioteca de teste para o Typescript ou Javascript.

```
  ~/projeto/vitest-template
  » npm install -D vitest
```
Por padrão, o Vitest usa o pacote c8 para executar relatórios de cobertura. Entretanto, ele está sendo substituido pelo pacote v8, para instalá-lo use o comando:
```
  ~/projeto/vitest-template
  » npm install -D @vitest/coverage-v8
```

Abaixo temos um exemplo de arquivo de configuração do Vitest.

## Arquivo de configuração do Vitest (vitest.config.js)
Este arquivo configura o vitest, dentre outras coisas, para reconhecer os alias _"@/*"_ e _"@/test/*"_
```
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/test": path.resolve(__dirname, "./test"),
    },
  },
});
```
## Arquivo do Projeto - packge.json
 Este arquivo do projeto contém detre outras informações as dependencias que foram instaladas, os scripts e type module.
```
{
  "name": "setup_padrao",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "build": "tsup src",
    "start": "tsx ./src/index.ts",
    "start:dev": "tsx watch ./src/index.ts",
    "test": "vitest --passWithNoTests --run",
    "test:unit": "vitest --passWithNoTests -w",
    "test:staged": "vitest related ./test/*.spec.ts --passWithNoTests --run",
    "test:coverage": "vitest run --coverage"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@types/node": "^20.9.0",
    "@typescript-eslint/eslint-plugin": "^6.11.0",
    "@typescript-eslint/parser": "^6.11.0",
    "@vitest/coverage-v8": "^0.34.6",
    "eslint": "^8.53.0",
    "eslint-config-standard-with-typescript": "^39.1.1",
    "eslint-plugin-import": "^2.29.0",
    "eslint-plugin-n": "^16.3.1",
    "eslint-plugin-promise": "^6.1.1",
    "git-commit-msg-linter": "^5.0.4",
    "husky": "^8.0.3",
    "lint-staged": "^15.1.0",
    "tsup": "^7.2.0",
    "tsx": "^4.1.2",
    "typescript": "^5.2.2",
    "vitest": "^0.34.6"
  }
}

```

## Cria script para execução dos diversos testes.
No script **test:staged** abaixo a opção --run informa ao vitest nao entre eno modo watch.
```
  "scripts": {
    "build": "tsc -p tsconfig-build.json && tsc-alias",
    "test": "vitest --passWithNoTests --run",
    "test:unit": "vitest --passWithNoTests -w",
    "test:staged": "vitest related ./test/*.spec.ts --passWithNoTests --run",
    "test:coverage": "vitest run --coverage"
  },
```
  ## Executando os teste.
  Para executar o vitest direto ou através de um script
```
  ~/projeto/vitest-template
  » npx vitest
  » npm run <script>
```

  ## Snippet para Vitest.
  Abaixo temos um snippet para evitarmos digitar código repetido toda vez
  que formos elaborar um teste. O texto do prefixo é chave para "buscar" o snippet.
```
{
  "Jest Test": {
    "prefix": ["test"],
      "body": [
        "describe('$1', () => {",
        "  test('$2', () => {",
        "$3",
        "  });",
        "});",
        ""
      ],
    "description": "A describe block for Jest"
  }
}
```
## Crie arquivo .eslintignore
Criar o arquivo abaixo para evitar a atuação do eslint sobre eles
```
.husky
.vscode
coverage
dist
node_modules
public
./data
vitest.config.ts
```
# Prepara o buid.
Para que o código javascript gerado na compilação tenha a capacidade de resolver os import do tipo '@/index'
é necessário instalar uma biblioteca para isso

```
  ~/projeto/compras
  » npm i tsup -D
```
Além disso precisamos editar uma arquivo de configuração denominado tsup.config.ts

```
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  clean: true
});
```

Para o build faz-se necessário criar script build no arquivo package.json

```
"scripts": {
  "build": "tsup src"
}
```

## Arquivo tsconfig-build.
Este arquivo tem por objetivo impedir que os códigos
da pasta **test** sejam buildados (transpilados para javascript).

```
{
  "extends": "./tsconfig.json",
  "exclude": ["test"]
}
```

Para isso temos que passar o parâmetro abaixo, no script de buid.

```
tsc -p tsconfig-build.json
```




» npm init @eslint/config
? How would you like to use ESLint? …
  To check syntax only
  To check syntax and find problems
▸ To check syntax, find problems, and enforce code style

✔ How would you like to use ESLint? · style
? What type of modules does your project use? …
▸ JavaScript modules (import/export)
  CommonJS (require/exports)
  None of these

✔ How would you like to use ESLint? · style
✔ What type of modules does your project use? · esm
? Which framework does your project use? …
  React
  Vue.js
▸ None of these

✔ How would you like to use ESLint? · style
✔ What type of modules does your project use? · esm
✔ Which framework does your project use? · none
? Does your project use TypeScript? ‣ No / Yes

✔ How would you like to use ESLint? · style
✔ What type of modules does your project use? · esm
✔ Which framework does your project use? · none
✔ Does your project use TypeScript? · No / Yes
? Where does your code run? …  (Press <space> to select, <a> to toggle all, <i> to invert selection)
✔ Browser
✔ Node

✔ How would you like to use ESLint? · style
✔ What type of modules does your project use? · esm
✔ Which framework does your project use? · none
✔ Does your project use TypeScript? · No / Yes
✔ Where does your code run? · node
? How would you like to define a style for your project? …
▸ Use a popular style guide
  Answer questions about your style

✔ How would you like to use ESLint? · style
✔ What type of modules does your project use? · esm
✔ Which framework does your project use? · none
✔ Does your project use TypeScript? · No / Yes
✔ Where does your code run? · node
✔ How would you like to define a style for your project? · guide
? Which style guide do you want to follow? …
▸ Standard: https://github.com/standard/eslint-config-standard-with-typescript
  XO: https://github.com/xojs/eslint-config-xo-typescript

✔ How would you like to use ESLint? · style
✔ What type of modules does your project use? · esm
✔ Which framework does your project use? · none
✔ Does your project use TypeScript? · No / Yes
✔ Where does your code run? · node
✔ How would you like to define a style for your project? · guide
✔ Which style guide do you want to follow? · standard-with-typescript
? What format do you want your config file to be in? …
  JavaScript
  YAML
▸ JSON

Checking peerDependencies of eslint-config-standard-with-typescript@latest
The config that you've selected requires the following dependencies:

eslint-config-standard-with-typescript@latest @typescript-eslint/eslint-plugin@^6.4.0 eslint@^8.0.1 eslint-plugin-import@^2.25.2 eslint-plugin-n@^15.0.0 || ^16.0.0  eslint-plugin-promise@^6.0.0 typescript@*
? Would you like to install them now? ‣ No / Yes

✔ Would you like to install them now? · No / Yes
? Which package manager do you want to use? …
▸ npm
  yarn
  pnpm
