# Hugo epingle : le paquet Alpine reste bloque en 0.152.x, trop vieux pour
# les templates du theme. On recupere le binaire extended musl deja compile.
FROM hugomods/hugo:0.165.0 AS hugo

# ── Etape 1 : site Hugo + PDF du CV ──
# node 22 : Hugo >= 0.164 lance Tailwind via node avec --permission, un flag
# que node 20 rejette.
FROM node:22-alpine AS builder

COPY --from=hugo /usr/bin/hugo /usr/local/bin/hugo

# Chromium et ses polices, pour le rendu du PDF par Puppeteer.
# font-noto-emoji n'est pas installe : les pages CV, seules rendues en PDF,
# ne contiennent plus aucun emoji.
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
  && corepack enable \
  && corepack prepare pnpm@10.21.0 --activate

WORKDIR /app

# Manifestes d'abord : cette couche ne se reconstruit que si les dependances
# changent, pas a chaque edition de contenu.
# .npmrc doit etre present AVANT l'install : il porte node-linker=hoisted,
# sans quoi pnpm genere un wrapper sh pour tailwindcss que Hugo >= 0.165 refuse.
COPY package.json pnpm-lock.yaml .npmrc ./

# Defini AVANT l'install : sans SKIP_DOWNLOAD, le postinstall de puppeteer
# telecharge un second Chromium (~150 Mo) inutile dans l'image.
ENV PUPPETEER_SKIP_DOWNLOAD=1 \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

# ── Etape 2 : image finale ──
FROM nginx:alpine

LABEL authors="nhpro"

COPY --from=builder /app/public /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
