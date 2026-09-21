# syntax=docker/dockerfile:1

# ---------- Estagio de build ----------
FROM node:24-alpine AS build
WORKDIR /app

# Copia apenas os manifests primeiro para aproveitar o cache de camadas:
# a reinstalacao so acontece quando as dependencias mudam.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- Estagio de producao ----------
FROM node:24-alpine AS producao
WORKDIR /app
ENV NODE_ENV=production

# O bundle do tsup ja inclui o codigo da aplicacao; restam as dependencias
# de runtime declaradas em "dependencies".
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist

USER node
EXPOSE 3000
CMD ["node", "./dist/index.js"]
