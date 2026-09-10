# Hugo epingle : le paquet Alpine reste bloque en 0.152.x, trop vieux pour
# les templates du theme. On recupere le binaire extended musl deja compile.
FROM hugomods/hugo:0.165.0 AS hugo

# Étape 1 : Build du site Hugo + PDF
FROM node:22-alpine AS builder

COPY --from=hugo /usr/bin/hugo /usr/local/bin/hugo

# Installer les dépendances Puppeteer + pnpm
RUN apk add --no-cache chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    font-noto-emoji \
    bash \
    curl \
    git \
  && corepack enable \
  && corepack prepare pnpm@10.21.0 --activate

WORKDIR /app

# Copier les manifestes pour le cache.
# .npmrc doit etre present AVANT l'install : il porte node-linker=hoisted,
# sans quoi pnpm genere un wrapper sh pour tailwindcss que Hugo >= 0.165 refuse.
COPY package.json pnpm-lock.yaml .npmrc ./

# Configurer Puppeteer pour utiliser le Chromium d'Alpine.
# Defini AVANT l'install : sans SKIP_DOWNLOAD, le postinstall de puppeteer
# telecharge un second Chromium (~150 Mo) inutile dans l'image.
ENV PUPPETEER_SKIP_DOWNLOAD=1 \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Installer les dépendances avec pnpm
RUN pnpm install --frozen-lockfile

# Copier tout le projet (Hugo + scripts + contenu)
COPY . .

# Build du site + PDF
RUN pnpm run build

# Étape 2 : Image finale légère avec Nginx
FROM nginx:alpine

# Label auteur
LABEL authors="nhpro"

# Copier le site généré
COPY --from=builder /app/public /usr/share/nginx/html

# Exposer le port HTTP
EXPOSE 80

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]
