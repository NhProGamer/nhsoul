---
title: Clown School
weight: 1
summary: La plateforme de formations vidéo de Clown Art, que je fais tourner seul.
status: En production depuis 2024
tile:
  image: images/screen-home-desktop.webp
  alt: L’accueil de Clown School
  zoom: true
facts:
- label: Pour
  value: Clown Art
- label: Période
  value: 2024 à 2026
- label: Mon rôle
  value: Seul développeur, mise en ligne comprise
- label: Utilisateurs
  value: 1 200
shots:
- image: images/screen-home-desktop.webp
  kind: wide
  zoom: true
  alt: L’accueil de Clown School sur ordinateur
- image: images/screen-home-phone.webp
  kind: phone
  alt: L’accueil de Clown School sur téléphone
choices:
- title: Réécrire au bon moment
  text: Fin 2025, la première version ne suivait plus. Je l’ai refaite en deux parties, un serveur et une application, sans couper l’accès des élèves.
- title: Reprendre la main sur la connexion
  text: J’ai remplacé le service de connexion externe par mon propre système, et prévu la reprise des anciens mots de passe.
- title: Protéger les vidéos sans ralentir
  text: Les vidéos vont directement de l’hébergeur au navigateur, par des liens qui expirent. Mon serveur ne fait que donner les autorisations.
now: En ligne depuis 2024, trois versions en deux ans. Aucun élève n’a eu à recréer son mot de passe lors de la migration.
tech:
  facts:
  - label: Stack
    value: Go, Gin, Vue 3, Pinia, HLS, Shaka Player, OpenStack Swift, OIDC, Docker
  text: 'Clown School vend et diffuse les formations vidéo de Clown Art. J’ai tout construit et je l’exploite seul : l’API, le site, les codes d’accès, la diffusion vidéo et l’authentification. Trois versions en deux ans : des templates Go en 2024, une API avec une SPA Vue fin 2025, puis la migration vers mon propre serveur d’identité en 2026, sans qu’aucun élève ait à refaire son mot de passe.'
cv:
  kind: Pro, en production depuis 2024
  text: 'Plateforme de formations vidéo, 1 200 utilisateurs : API Go, application Vue, vidéo protégée, codes d’accès.'
  url: https://clown.school
---
Clown Art vend des formations vidéo à des élèves qui paient. Depuis 2024, je suis le seul développeur : je conçois, je mets en ligne et je réponds quand ça casse.
