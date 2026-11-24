---
title: mx4
weight: 5
summary: Ma souris Logitech sous Linux
year: '2026'
facts:
- label: Pour
  value: Projet personnel
- label: Période
  value: '2026'
- label: Mon rôle
  value: Conception et développement
choices:
- title: Le matériel comme juge
  text: Chaque fonction est testée sur la vraie souris. Celles que Logitech ne documente pas, je les ai sondées sur l’appareil.
- title: La légèreté d’abord
  text: 'Le menu circulaire est dessiné sans carte graphique : de 157 Mo à 12,5 Mo de mémoire.'
- title: Rien à créer, rien à envoyer
  text: Une configuration dans un simple fichier texte, sans compte et sans télémétrie.
now: Boutons, gestes, profils par application et retour haptique fonctionnent sous KDE Plasma.
tech:
  facts:
  - label: Commits
    value: '61'
  - label: Lignes
    value: 26 000
  - label: Stack
    value: Rust, HID++, uinput, Wayland, KDE Plasma, systemd
  text: Remappage, gestes, profils par application, un cercle d’actions avec retour haptique, une vibration dans la main à chaque notification. Le tout avec une configuration en TOML, sans compte et sans télémétrie.
cv:
  kind: Perso
  text: 'Logiciel Rust pour la souris Logitech MX Master 4 sous Linux : gestes, profils par application, retour haptique.'
---
Logitech ne propose rien pour sa souris MX Master 4 sous Linux. J’ai écrit l’équivalent de son logiciel officiel pour KDE.
