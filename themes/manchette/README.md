# Manchette

Thème Hugo de portfolio éditorial : typo d'affiche, études de cas pour les
projets, CV imprimable sur une page A4, clair et sombre, multilingue.

Une manchette, c'est le gros titre en une d'un journal. Le thème part de
là : le nom de l'auteur en très grand, sa photo dans la ligne du nom, et
des projets présentés comme des produits en production plutôt qu'une
liste de technologies.

- Aucune dépendance Node, aucun framework CSS : du CSS et du JS servis par
  les pipes de Hugo, minifiés et fingerprintés en production.
- Polices auto-hébergées (Apfel Grotezk de Collletttivo et Inter, licence
  OFL) : aucune requête vers Google Fonts, donc pas d'IP de visiteur
  envoyée à un tiers.
- Toute la palette dérive d'une seule teinte, réglable.

Hugo 0.146 ou plus récent (structure de layouts `_partials/`, `home.html`,
`page.html`).

## Configuration

```yaml
theme: manchette

params:
  author:
    first_name: "Néo"
    last_name: "Huyghe"
    email: "contact@nhsoul.fr"    # pied de page, avec un bouton « copier »
    location: "Lens"              # mention en bas de page
    birthdate: "2006-02-05"       # âges calculés au build, jamais périmés
    coding_since: 2017            # « {since} » dans le texte du hero
    photo: "images/pfp-min.jpg"   # chemin sous assets/, redimensionné par Hugo
  favicon: "/favicon.svg"         # optionnel
  manchette:
    hue: 292                      # teinte OKLCH de toute la palette

languages:
  fr:
    title: "Néo Huyghe, développeur à Lens"
    params:
      description: "…"            # meta description par défaut
      footer:
        closing: "Un logiciel à faire tourner ? Écrivez-moi."
    menus:
      main:
        - { name: "Projets", pageRef: "/projects" }
        - { name: "Ma stack", pageRef: "/tools", params: { side: "end" } }
      footer:
        - { name: "GitHub", url: "https://github.com/…" }
```

Menu `main` : les entrées avec `params.side: end` se placent à droite du
nom, les autres à gauche. Sous 70rem, tous les liens passent dans un bouton
« Menu » (un `<details>`, qui marche sans JavaScript). Le menu `footer`
donne les liens du pied de page.

Toutes les clés sont optionnelles : sans `author`, le thème affiche le
titre du site ; sans `email`, le bloc contact disparaît.

## Contenu

### Accueil : `content/_index.md`

Le hero puis une liste de sections, rendues dans l'ordre. Chaque `type`
correspond à un partial de `layouts/_partials/sections/`. Un type inconnu
est signalé au build.

```yaml
hero:
  hello: "Bonjour, je suis"
  lead: "Développeur de {age} ans à Lens, je code depuis mes {since} ans."
  actions:
    - { label: "Voir les projets", url: "#projets" }
    - { label: "Mon CV", url: "/cv/", style: "quiet" }
sections:
  - type: work                     # projets : tuiles + index
    id: projets
    title: "Des logiciels qui tournent pour de vrai."
    index_title: "Mes propres"
    index_word: "soft"             # mot animé au survol
  - type: statement                # grande phrase sur fond teinté
    text: "…"
    note: "…"
  - type: steps                    # verbes géants et leur phrase
    title: "…"
    items: [{ title: "Comprendre", text: "…" }]
  - type: timeline                 # frise horizontale, âge calculé par année
    id: parcours
    title: "…"
    items: [{ year: 2017, text: "…" }]
```

Pour ajouter un type de section, créer `layouts/_partials/sections/<type>.html`
dans le site : il reçoit `page`, `s` (la section) et `i` (son rang).

### Projets : `content/projects/<slug>/index.md`

Un bundle par projet, captures comprises. `hugo new content projects/mon-projet/index.md`
crée le fichier depuis l'archétype, qui documente chaque champ. En bref :

| Champ | Rôle |
|---|---|
| `weight` | ordre sur l'accueil, la page projets et le CV |
| `summary`, `status` | texte et légende de la tuile |
| `tile` | `image`, `alt`, `zoom`, `size` : sans `tile`, le projet va dans l'index |
| `year` | colonne de droite de l'index |
| `link` + `build.render: never` | projet sans page, qui pointe ailleurs |
| `facts` | liste `label` / `value` en tête de page |
| `shots` | captures : `image`, `kind` (`wide`, `phone`, `half`), `alt`, `caption` |
| `choices` | décisions et leur raison |
| `now` | où en est le projet |
| `tech` | `facts` et `text` pour les développeurs |
| `cv` | `kind`, `text`, `url`, `title` : présence sur le CV |

Le corps de la page est le paragraphe de contexte.

### Stack : `content/tools.md`

```yaml
title: "Mes outils"
description: "…"
categories:
  - name: "Logiciels"
    tools:
      - { name: "GoLand", icon: "/icons/goland.svg", desc: "…" }
      - { name: "HTTPie", icon: "/icons/httpie.svg", desc: "…", plate: true }
```

`plate: true` pose un fond sombre derrière un logo dessiné en blanc.

### CV : `content/cv.md`

Une feuille A4 autonome, toujours claire (c'est un document imprimé). Le
corps de la page est le profil.

```yaml
hello: "Bonjour, je suis"
role: "Développeur backend"
role_note: "en alternance chez Elosi"
pdf: "/images/cv.pdf"             # sinon, le bouton ouvre l'impression
contacts: [{ label: "…", url: "…" }]
motto: "…"
experience: [{ title, when, where, text }]
skills: ["…"]
technologies: [{ label: "Backend", items: ["…"] }]
education: [{ title, when, where }]
soft_skills: ["…"]
```

Les projets du CV viennent des pages projet qui ont un bloc `cv`.

### Blog : `content/blog/`

Liste paginée, puis articles avec date, temps de lecture et couverture
(`featured_image`, une ressource du bundle).

## Icônes

Icônes SVG inline dans `assets/icons/`, insérées par
`{{ partial "icon.html" (dict "name" "mail") }}`. Elles prennent la couleur du
texte et sont décoratives (`aria-hidden`) : le texte voisin porte le sens.
Pour en ajouter une, déposer son SVG dans `assets/icons/` du site.

- Menus : `params: { icon: "github" }` sur une entrée du menu `footer`.
- CV : `icon: "mail"` sur une ligne de `contacts`.
- Le thème les pose seul sur la bascule clair/sombre, le bouton « copier »,
  le téléchargement du CV et les projets qui pointent hors du site.

Fournies : `mail`, `map-pin`, `globe`, `copy`, `check`, `download`, `sun`,
`moon`, `arrow-up-right` (Lucide 1.79, ISC) et `github`, `forgejo`
(Simple Icons 16.38, CC0). `linkedin` vient de Simple Icons 13.21 : le logo
a été retiré des versions suivantes.

## Traductions

Les textes du thème sont dans `i18n/fr.yaml` et `i18n/en.yaml`. Le site
peut surcharger n'importe quelle clé dans son propre `i18n/`.

## Accessibilité et mouvement

Focus visible sur tous les contrôles, lien d'évitement, contrastes AA en
clair et en sombre. Toutes les animations ont un repli
`prefers-reduced-motion`, et le contenu reste lisible sans JavaScript : la
frise redevient un simple défilement horizontal.

Trois mouvements donnent vie au site :

- **Entrée du hero** : les lettres du nom, découpées par Hugo au build,
  tombent inclinées puis se posent. Le titre garde son texte entier en
  `aria-label`.
- **Index de l'accueil** : ses lignes entrent l'une après l'autre au premier
  passage à l'écran.
- **Transitions de page** (`@view-transition`) : la capture et le titre d'un
  projet passent de sa tuile, de sa ligne d'index ou de la page Projets à
  l'en-tête de sa page. Les éléments sont appariés par
  `partials/vt.html`. Les navigateurs sans View Transitions changent
  simplement de page.

## Licence

GPL-3.0. Apfel Grotezk et Inter : SIL Open Font License. Icônes Lucide :
ISC. Logos Simple Icons : CC0.
