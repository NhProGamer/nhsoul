---
title: OrionAuth
weight: 3
summary: Le système de connexion de mes clients.
status: En production depuis 2026
tile:
  image: images/login-clown-school.webp
  alt: L’écran de connexion OrionAuth aux couleurs de Clown School
facts:
- label: Pour
  value: Clown School et mes outils
- label: Période
  value: '2026'
- label: Mon rôle
  value: Conception et développement
shots:
- image: images/login-clown-school.webp
  kind: half
  alt: L’écran de connexion OrionAuth aux couleurs de Clown School
  caption: Aux couleurs de Clown School
- image: images/login-oriondrive.webp
  kind: half
  alt: L’écran de connexion OrionAuth aux couleurs d’OrionDrive
  caption: Aux couleurs d’OrionDrive
choices:
- title: Suivre les normes à la lettre
  text: 'OAuth 2.1 et OpenID Connect : n’importe quelle application standard s’y branche, sans code sur mesure.'
- title: Une migration invisible
  text: Les anciens mots de passe sont acceptés, puis renforcés à la connexion suivante.
- title: Attaquer mon propre système
  text: Deux passes d’audit de sécurité, pour trouver les failles avant un attaquant.
now: En production pour Clown School, avec un écran de connexion aux couleurs de chaque produit.
tech:
  facts:
  - label: Commits
    value: '698'
  - label: Lignes
    value: 68 000
  - label: Stack
    value: Go, PostgreSQL, OIDC, WebAuthn, OPA / Rego, Prometheus, Vue 3
  text: Ma première rencontre avec OAuth, c’était la connexion Microsoft de mon launcher Minecraft. Un an plus tard, j’ai écrit mon propre fournisseur d’identité pour remplacer Logto, avec deux SDK (TypeScript et Go).
cv:
  kind: Perso, en production
  text: 'Serveur OAuth 2.0 / OpenID Connect en Go : MFA, passkeys, fédération d’identité, RBAC, journal d’audit, SDK TypeScript et Go.'
---
Clown School dépendait d’un service de connexion externe. J’ai choisi d’écrire le mien, pour mes clients et pour mes propres outils.
