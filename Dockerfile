# Hugo epingle. hugomods ne publie plus d'image au-dela de 0.165, et le
# paquet Alpine est en retard : on prend le binaire officiel. L'edition
# standard est un binaire Go statique (pas besoin de glibc) et encode deja
# le WebP dont le theme a besoin. La somme de controle publiee avec la
# release est verifiee avant usage.
FROM alpine:3 AS hugo
ARG HUGO_VERSION=0.170.1
ARG TARGETARCH
RUN wget -q https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_linux-${TARGETARCH}.tar.gz \
         https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_checksums.txt \
  && grep " hugo_${HUGO_VERSION}_linux-${TARGETARCH}.tar.gz$" hugo_${HUGO_VERSION}_checksums.txt | sha256sum -c - \
  && tar -xzf hugo_${HUGO_VERSION}_linux-${TARGETARCH}.tar.gz -C /usr/local/bin hugo

# ── Etape 1 : site Hugo + PDF du CV ──
# Alpine nu : le PDF du CV est produit par un script shell, sans Node.
FROM alpine:3 AS builder

COPY --from=hugo /usr/local/bin/hugo /usr/local/bin/hugo

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
