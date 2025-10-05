# Étape 1 : Build du site Hugo + PDF
FROM node:20-alpine AS builder

# Installer Hugo + dépendances Puppeteer + pnpm
RUN apk add --no-cache hugo \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    bash \
    curl \
    git \
  && corepack enable \
  && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copier uniquement package.json pour le cache
COPY package.json ./

# Installer les dépendances avec pnpm
RUN pnpm install

# Copier tout le projet (Hugo + scripts + contenu)
COPY . .

# Configurer Puppeteer pour utiliser Chromium installé
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

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
