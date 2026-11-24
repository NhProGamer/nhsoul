---
title: OrionDrive
weight: 4
summary: Mon Google Drive auto-hébergé
year: '2026'
facts:
- label: Pour
  value: Projet personnel
- label: Période
  value: '2026'
- label: Mon rôle
  value: Conception et développement
choices:
- title: Un seul programme
  text: Le serveur et son interface s’installent en un seul fichier.
- title: Branché sur tout
  text: Le navigateur, l’explorateur de fichiers, le téléphone, et l’édition de documents Office à plusieurs.
- title: Sûr par défaut
  text: Il refuse de démarrer si sa configuration n’est pas sûre, et un partage retiré l’est tout de suite.
now: Connexion par OrionAuth, comme mes autres outils.
tech:
  facts:
  - label: Commits
    value: '240'
  - label: Lignes
    value: 37 000
  - label: Stack
    value: Go, Vue 3, WebDAV, SFTP, WOPI, S3
  text: Partages, WebDAV avec synchronisation incrémentale (RFC 6578), SFTP, édition Office collaborative, miniatures RAW et PSD, déduplication par contenu, avec connexion uniquement par SSO.
cv:
  kind: Perso
  text: 'Drive auto-hébergé en un binaire Go unique avec son application Vue 3 : partage, WebDAV et SFTP, stockage local, S3 ou nœud distant.'
---
Je voulais mon propre Google Drive, hébergé chez moi, sans dépendre d’un service externe.
