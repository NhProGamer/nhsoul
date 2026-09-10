# orion

Thème Hugo bâti sur le design system **Nebula** (OrionAuth) : violet cosmique,
dark-first, décliné en clair et en sombre.

Successeur de `neoflux`. Même modèle de données (`params`, front matter, `i18n`),
donc aucun contenu à réécrire pour passer de l'un à l'autre.

## Identité

| Axe | Choix |
|---|---|
| Accent | violet Nebula — `oklch(0.70 0.20 295)`, < 10 % de la surface |
| Surfaces | `--or-bg-0 → bg-3`, plus `--or-bg-inset` à part pour champs et code |
| Texte | 4 niveaux, tous ≥ WCAG AA sur le fond de page |
| Typo | Inter (UI) · JetBrains Mono (tout identifiant technique) · Fraunces (display ≥ 20 px, variable : opsz · SOFT · WONK) |
| Marque | étoile cardinale à 4 branches, dégradé `accent-hi → accent-lo` + lueur |
| Motion | `cubic-bezier(0.2, 0, 0, 1)`, jamais de rebond |

Source de vérité des tokens : `assets/css/main.css`, sections 1 à 4.
La charte complète vit dans le projet Claude Design (`BRAND-GUIDELINES.md`).

## La marque

L'**étoile cardinale** — étoile à 4 branches concaves — est la signature du thème.
La charte définit le marqueur comme « une étoile cardinale (référence à Orion),
un bouclier stylisé, un point d'ancrage sur une grille » ; c'est cette forme, déjà
présente dans `orion-dark.svg` du design system.

Elle remplace le `◆` que le thème utilisait comme **caractère texte**. Un glyphe
texte dépend de la police installée chez le visiteur, ne peut pas porter le dégradé
officiel, et n'existe pas en favicon. La marque est désormais un SVG.

### Rendu

```go-html-template
{{ partial "mark.html" (dict "size" 22) }}
{{ partial "mark.html" (dict "size" 64 "variant" "grad" "glow" true) }}
{{ partial "wordmark.html" (dict "ctx" . "size" 22) }}
{{ partial "wordmark.html" (dict "ctx" . "serif" "Orion" "sans" "Drive") }}
```

| Paramètre de `mark.html` | Défaut | Rôle |
|---|---|---|
| `size` | `20` | px, appliqué en largeur **et** hauteur — proportions jamais étirées |
| `variant` | `flat` | `flat` suit `currentColor` ; `grad` applique le dégradé officiel |
| `glow` | `false` | lueur — réservée aux usages signature ≥ 20 px |
| `class` | — | classes CSS supplémentaires |
| `title` | — | texte accessible ; sans lui la marque est `aria-hidden` |

`partials/mark-defs.html` déclare le dégradé et le filtre **une seule fois par page**
(inclus par `baseof.html`) : dix étoiles sur une page, un seul `id`.

### Tailles en usage

| Contexte | Taille | Variante |
|---|---|---|
| Eyebrow de section | 9 px | flat |
| Footer | 18 px | grad |
| Header (wordmark) | 22 px | grad + lueur |
| Repli d'icône d'outil | 18 px | grad |
| 404 | 64 px | grad + lueur |
| Favicon | 32 px (vectoriel) | dégradé, thème système |
| Bannière de partage | 60 px | grad + lueur |

Le survol du wordmark fait tourner la marque de **45°**, pas 90° : une étoile à
4 branches est invariante par quart de tour, la rotation ne se verrait pas.

### Assets statiques

| Fichier | Usage |
|---|---|
| `static/favicon.svg` | onglet — embarque une media query `prefers-color-scheme` |
| `static/mark-dark.svg` · `mark-light.svg` | marque isolée, 512 px |
| `static/images/mark-180.png` · `mark-512.png` | `apple-touch-icon`, PWA |
| `static/images/og-orion.png` | bannière `og:image` 1200×630 |

Les PNG et la bannière se régénèrent avec `npm run build:og`
(source : `scripts/og-banner.html`). Ce script ne tourne **pas** au build du site :
lance-le à la main quand la marque change, puis commite les PNG. Le texte de la
bannière s'injecte par variables d'environnement :

```sh
ORION_OG_NAME="Néo Huyghe" ORION_OG_DOMAIN="nhsoul.fr" npm run build:og
```

### Teintes en dur

Les assets statiques ne peuvent pas lire les variables CSS : ils portent les
teintes en hexadécimal. Ces valeurs sont la **résolution exacte** des tokens OKLCH
par le moteur de rendu, pas les hex documentés dans `BRAND-GUIDELINES.md` — qui
sont approximatifs et divergent (la charte annonce `#A78BFA` pour l'accent, la
valeur réellement rendue par `oklch(0.70 0.20 295)` est `#AA7EFF`).

| Token | Sombre | Clair |
|---|---|---|
| `accent` | `#AA7EFF` | `#8047E1` |
| `accent-hi` | `#C6A7FF` | `#6E21D2` |
| `accent-lo` | `#8851EB` | `#9265EF` |
| `bg-0` | `#0F0F16` | `#FAFAFD` |

## Thème clair / sombre

Piloté par `<html data-theme="dark|light">`.

- Le sombre est l'identité par défaut ; le clair est une variante de service.
- `partials/head.html` pose l'attribut **avant le premier paint** (anti-FOUC) :
  choix mémorisé (`localStorage` clé `orion-theme`), sinon `prefers-color-scheme`,
  sinon sombre.
- Le toggle du header persiste le choix et émet l'événement `orion:theme`.

## Classes réutilisables

| Classe | Rôle |
|---|---|
| `.or-mark` | la marque SVG (rendue par `mark.html`) |
| `.or-wordmark` | marque + nom, glyphe toujours en tête |
| `.or-diamond` | alias historique du `◆` texte, pour du contenu markdown |
| `.or-eyebrow` | surtitre mono en capitales espacées (remplace les badges emoji) |
| `.or-avail` | ligne de disponibilité : étoile scintillante + libellé mono + filet |
| `.or-card` | carte : bord subtil au repos, bord accent + élévation au survol |
| `.or-badge` / `.or-badge-accent` | badge technique mono |
| `.or-cta` | CTA primaire accent avec lueur — **un seul par vue** |
| `.or-display` | titre en Fraunces |
| `.site-header` | header sticky glassmorphique |
| `.web-button` | bouton rétro 88×31, version Nebula |

Les utilitaires Tailwind (`bg-surface`, `text-text-muted`, `border-border`…)
pointent tous vers les tokens via `@theme`, donc ils suivent la bascule de thème.

## Paramètres

Voir `config.toml` pour un exemple complet. Points notables :

- `params.experience_years` — chiffre affiché dans le hero (défaut `7`).
- `params.term.user` / `.host` — prompt de la carte terminal. Le layout les
  injecte dans `--or-term-prompt` ; rien n'est codé en dur en CSS.
- `params.animation.particle_count` / `.particle_speed` — réellement lus par le
  bundle (via `window.orionParticles`), plus seulement déclarés.
- `params.contact.action` — laisser vide affiche un lien mail direct plutôt
  qu'un formulaire qui n'irait nulle part.
- Tous ces groupes sont optionnels : une clé absente ne casse pas le build.

## Layouts

```
_default/baseof.html   squelette + injection du prompt terminal
_default/single.html   repli pour toute page hors section connue
_default/list.html     repli pour toute section sans layout dédié
404.html
index.html             hero + expertise + blog
blog/{list,single}.html
about/single.html
tools/single.html
projects/{list,single}.html
cv/single.html         page A4 imprimable, palier indigo repeint en violet
```

`projects.html` s'alimente sur la section de contenu `projects` et ne rend rien
si elle est vide : pas de projets de démonstration codés en dur.

## Traductions

Le thème embarque ses propres défauts dans `i18n/fr.yaml` et `i18n/en.yaml`.
Le site peut surcharger n'importe quelle clé dans son propre `i18n/`.
Aucune chaîne visible n'est codée en dur dans les layouts.

## Build

```sh
npm run build:js   # bundle les particules vers static/js/particles-bundle.js
hugo --minify      # le CSS passe par le pipeline Tailwind v4 de Hugo
```

Le site racine enchaîne les deux via son propre `npm run build`.

## Impression

`.no-print` masque header, footer, particules et boutons. La page CV sort
seule sur son A4 (`@page { size: A4; margin: 0 }`).

## Accessibilité

- Focus ring jamais désactivé : `2px solid var(--or-accent)`, offset 2 px.
- Sémantique toujours doublée d'un label ou d'une icône, jamais la couleur seule.
- `prefers-reduced-motion` coupe animations, transitions et mouvement des étoiles.
