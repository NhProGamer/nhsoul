# Hugo epingle : le paquet Alpine reste bloque en 0.152.x, trop vieux pour
# les templates du theme. On recupere le binaire extended musl deja compile.
FROM hugomods/hugo:0.165.0 AS hugo

# ── Etape 1 : site Hugo + PDF du CV ──
# Node ne sert qu'a scripts/generate-pdf.js, qui n'a aucune dependance :
# pas de gestionnaire de paquets ni d'etape d'installation.
FROM node:22-alpine AS builder

COPY --from=hugo /usr/bin/hugo /usr/local/bin/hugo

# Chromium et ses polices, pour le rendu du PDF du CV (scripts/generate-pdf.js).
# font-noto-emoji n'est pas installe : les pages CV, seules rendues en PDF,
# ne contiennent plus aucun emoji.
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont

# Chemin du navigateur lu par scripts/generate-pdf.js.
ENV CHROMIUM_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY . .

RUN hugo --minify && node scripts/generate-pdf.js

# ── Etape 2 : image finale ──
FROM nginx:alpine

LABEL authors="nhpro"

COPY --from=builder /app/public /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
