# Étape 1 : Build du site Hugo + PDF
FROM node:20-alpine AS builder

# Installer Hugo + dépendances Puppeteer
RUN apk add --no-cache hugo \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

WORKDIR /app

# Copier d’abord les fichiers de dépendances
COPY package*.json ./
RUN npm ci

# Copier tout le projet
COPY . .

# Configurer Puppeteer pour utiliser Chromium installé
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Build Hugo + PDF
RUN npm run build

# Étape 2 : Image finale (serveur web)
FROM nginx:alpine

# Ajouter un label d’auteur conforme OCI
LABEL authors="nhpro"

# Copier le site statique généré vers le dossier web de Nginx
COPY --from=builder /app/public /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Lancer Nginx en mode premier plan
CMD ["nginx", "-g", "daemon off;"]
