+++
date = '2026-09-11T16:30:00+02:00'
draft = false
author = "NнPro"
title = "OrionDrive : pourquoi j'ai fini par écrire mon propre cloud"
featured_image = "oriondrive.png"
+++
Troisième article de blog - Cette fois, c'est vraiment du backend !
<!--more-->

Deux posts que je promets de parler backend.
Cette fois, promis, on y est. 😄

## Le contexte

Pendant des années, mes fichiers dormaient chez **Google Drive**. Pratique, rapide, zéro maintenance… et zéro contrôle. Mes documents, mes photos, mes projets : tout ça vivait sur des serveurs que je ne choisis pas, sous des conditions que je ne négocie pas, avec un quota qui grimpe quand je paie.

Se **dégafamiser**, pour moi, ce n'est pas juste une posture. C'est décider **où** vivent mes données, **qui** peut les lire, et **combien** ça coûte. La réponse tenait en un mot : chez moi. J'ai un serveur, il a **10 To** de stockage. Ma limite, c'est mon disque — pas un abonnement mensuel.

Restait à choisir le logiciel. Et là, j'ai fait le tour du propriétaire.

## Le problème : aucune solution ne me convenait

### Nextcloud

Premier arrêt, le plus évident. Écosystème énorme, une application pour absolument tout… et c'est précisément le souci : c'est un **fourre-tout**. Je voulais un drive, pas une suite bureautique avec agenda, chat et réseau social intégrés.

Mais le vrai mur, c'était les **performances**. J'étais plafonné à **50 Mo/s** en transfert, là où toutes les autres solutions que j'ai testées ensuite montaient tranquillement à **100-110 Mo/s**. J'ai passé des heures à tripatouiller l'exécuteur **PHP** et l'**OPcache** pour gratter quelques pourcents. Même optimisé aux petits oignons, Nextcloud reste lent.

### Cloudreve V3

Visuellement, une claque. Interface propre, moderne, et une vraie densité de fonctionnalités. Les performances suivaient — c'est écrit en **Go**.

Sauf que ce n'étaient pas **mes** fonctionnalités. Beaucoup de choses que je n'utiliserais jamais, et l'absence de celles dont j'avais besoin.

### ownCloud Infinite Scale

Là aussi du **Go**, donc les débits étaient au rendez-vous. Mais l'écosystème d'extensions est restreint, et il manquait trop de fonctions à mon goût.

Surtout, oCIS est conçu en **microservices**. C'est parfaitement défendable à l'échelle d'une entreprise. Pour un cloud personnel, ça veut dire un déploiement disproportionné et une maintenance qui l'est tout autant. Trop de complexité pour un usage simple.

### Seafile

Le client desktop est excellent, vraiment. La synchronisation est solide et rapide.

Mais côté fonctionnalités, c'est volontairement minimaliste. Ça fait très bien une chose, et je voulais un peu plus que ça.

### Retour case départ

Je suis repassé voir **Cloudreve V4**. Sur le papier, très bien. Sauf que trop de fonctionnalités sont passées derrière un paywall.

Récapitulons ce que j'ai constaté **dans mon usage** — ce n'est pas un benchmark, juste mon retour terrain :

| Solution | Langage | Débit constaté | Ce qui a coincé |
|---|---|---|---|
| Nextcloud | PHP | ~50 Mo/s | Lent même optimisé, fourre-tout |
| Cloudreve V3 | Go | ~100-110 Mo/s | Pas les fonctionnalités que je cherchais |
| ownCloud Infinite Scale | Go | ~100-110 Mo/s | Microservices = déploiement lourd, extensions limitées |
| Seafile | C / Python | ~100-110 Mo/s | Trop minimaliste |
| Cloudreve V4 | Go | — | Trop de fonctionnalités payantes |

À ce stade, le constat était simple : soit c'est rapide mais incomplet, soit c'est complet mais lent, soit c'est bien mais payant.

Alors j'ai écrit le mien.

## La solution : OrionDrive

**OrionDrive**, c'est un drive auto-hébergé qui tient dans **un seul binaire**. Un backend **Go** qui embarque directement la SPA **Vue 3** — pas de serveur web à configurer à côté, pas de PHP-FPM à régler, pas de stack de microservices à orchestrer. Tu lances le binaire, c'est parti.

### Ce qu'il sait faire

- **Fichiers** — explorateur, upload par morceaux avec reprise, corbeille et restauration, versionnage, verrouillage de fichier, quotas par groupe
- **Stockage** — disque local, **S3** ou nœud distant, avec téléchargements directs ou présignés et limitation de débit par groupe. Chiffrement **AES-256-CTR** au repos en option
- **Partage** — liens sur fichier ou dossier, avec niveaux de permission (lecture, édition, dépôt aveugle), mot de passe, expiration et limite de téléchargements
- **Protocoles** — **WebDAV** et **SFTP**, chacun avec ses identifiants dédiés, plus des jetons d'accès personnels pour l'API
- **Aperçu et édition** — images, vidéo, audio, PDF, texte, Markdown, ePub, un éditeur d'images, et l'édition collaborative Office via **WOPI** (OnlyOffice ou Collabora)
- **Archives** — compression et extraction en tâche de fond (zip, tar, 7z)
- **Administration** — groupes à permissions fines, politiques de stockage par groupe, correspondance groupe SSO → groupe interne, maintenance planifiée

### Sous le capot

Go 1.26 avec **Gin** et **GORM**, au choix sur **SQLite**, **PostgreSQL** ou **MySQL** — en pur Go, donc le binaire reste statique. Migrations avec **goose**, CLI avec **cobra**, OIDC via **coreos/go-oidc**, S3 avec l'**AWS SDK v2**, et **Redis** en option pour le cache partagé en multi-nœuds.

Côté frontend, Vue 3, Vite, TypeScript, Pinia, PWA installable, thèmes clair et sombre, et une internationalisation complète en français et en anglais.

Petit clin d'œil au passage : l'interface utilise **Orion**, le design system que j'ai construit et qui habille aussi ce site. Mêmes tokens **oklch**, même violet. Mon drive et mon portfolio sont de la même famille.

## Les points faibles

Aucun projet n'est parfait, et le mien moins que les autres — il est jeune.

- **L'authentification est en OIDC exclusivement.** Pas de comptes locaux, pas de mot de passe stocké dans le drive. C'est un choix assumé, mais ça veut dire qu'il faut un fournisseur d'identité à côté. Moi j'ai le mien (OrionAuth), pour quelqu'un d'autre c'est une dépendance de plus à installer.
- **Pas de client de synchronisation natif.** WebDAV et SFTP couvrent l'essentiel, et j'ai écrit `kio-orion` pour l'intégration native dans KDE, mais on est loin du confort du client Seafile.
- **L'écosystème, c'est moi.** Pas de communauté, pas de marketplace d'extensions. Un bug, je ne dépends de personne pour le corriger — mais personne ne le corrigera à ma place non plus.

## Et l'IA dans tout ça ?

Comme dans mes posts précédents, je ne vais pas mentir : **Claude Opus 5** m'a beaucoup aidé à monter ce projet.

Mais soyons clairs, ce projet n'a **pas été vibecodé**. Chaque ligne commitée et poussée a été lue, comprise et réfléchie. L'architecture, le découpage en couches, les choix de stockage, le modèle de permissions : tout ça sort de mon cerveau. L'IA accélère l'écriture, elle ne décide pas à ma place.

C'est une nuance qui compte, surtout sur un projet qui gère les fichiers personnels de quelqu'un.

## Mon retour

OrionDrive fait exactement ce que je lui demandais : un drive **rapide**, avec **les** fonctionnalités dont j'ai besoin, déployable en une commande, et qui ne me facturera jamais rien.

Il est sous licence **MIT**. Gratuit, et il le restera.

Ma seule limite aujourd'hui, ce sont les **10 To** de mon serveur. Autant dire que j'ai de la marge.

Le code est ici : **[git.nhsoul.fr/nhpro/orion-drive](https://git.nhsoul.fr/nhpro/orion-drive)**

---

*Troisième post, et cette fois j'ai tenu parole sur le backend ! Le prochain parlera sûrement d'OrionAuth, parce qu'écrire son propre serveur OIDC, c'est une autre histoire…* 🚀
