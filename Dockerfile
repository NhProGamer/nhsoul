# Hugo epingle, depuis l'image officielle du projet. Son binaire est
# statique : seul lui est copie dans l'etape de build, pas les 465 Mo
# d'outils que l'image embarque.
FROM ghcr.io/gohugoio/hugo:v0.170.1 AS hugo

# ── Etape 1 : site Hugo + PDF du CV ──
# Alpine nu : le PDF du CV est produit par un script shell, sans Node.
FROM alpine:3 AS builder

COPY --from=hugo /usr/bin/hugo /usr/local/bin/hugo

# Chromium et ses polices, pour le rendu du PDF du CV (scripts/generate-pdf.sh).
# busybox-extras fournit le serveur HTTP local qui lui sert public/.
# font-noto-emoji n'est pas installe : les pages CV, seules rendues en PDF,
# ne contiennent plus aucun emoji.
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      busybox-extras

# Chemin du navigateur lu par scripts/generate-pdf.sh.
ENV CHROMIUM_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY . .

RUN hugo --minify && sh scripts/generate-pdf.sh

# ── Etape 2 : image finale ──
FROM nginx:alpine

LABEL authors="nhpro"

COPY --from=builder /app/public /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
