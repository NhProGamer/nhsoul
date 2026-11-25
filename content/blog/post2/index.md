+++
date = '2025-09-24T15:17:00+02:00'
draft = false
author = "Néo Huyghe"
title = "Pourquoi je développe sur Aurora, un Linux immuable"
slug = "aurora-linux-immuable"
aliases = ["/blog/aurora-los-immuable-sous-stéroïdes-pour-un-usage-productif/"]
featured_image = "screenshare.png"
+++
Après Ubuntu puis Arch Linux, je cherchais un poste qui ne casse pas après une mise à jour. Aurora, un Linux immuable basé sur Fedora, me l’a donné sans rien m’enlever.
<!--more-->

## D’Ubuntu à Arch, puis à la maintenance

Comme beaucoup, j’ai découvert Linux avec **Ubuntu** : facile à prendre en main, mais trop chargé à mon goût, avec beaucoup de paquets installés par défaut. Je suis ensuite passé sur **Arch Linux**, léger et entièrement configurable.

Avec le temps, la maintenance m’a rattrapé. Arch est idéal pour bricoler, mais sur un poste de travail, je passais plus de temps à réparer qu’à produire. Un ami m’a alors parlé des systèmes immuables et conseillé **Aurora**.

## Ce que je cherchais

- **De la stabilité** : aucune mauvaise surprise après une mise à jour.
- **De la simplicité** : ne plus passer deux heures à réparer une bibliothèque cassée.
- **Du jeu, du développement et des machines virtuelles** sur la même machine.

## Ce qu’Aurora apporte

Aurora est un système immuable basé sur Fedora Atomic, pensé pour le travail au quotidien.

- **Des mises à jour atomiques** : la mise à jour s’applique en entier ou pas du tout, et je peux revenir à la version précédente si quelque chose casse.
- **Trois sources de logiciels** : Flatpak pour les applications graphiques, Homebrew pour les outils en ligne de commande, rpm-ostree pour l’indispensable.
- **Des scripts intégrés** (`ujust`) qui installent les outils pénibles à configurer : le jeu, JetBrains Toolbox, la virtualisation.
- **La virtualisation prête à l’emploi**, jusqu’au passage d’une carte graphique à une machine virtuelle (VFIO).

## Ses limites

- **Tout est automatisé** : changer de noyau ou appliquer un correctif comme l’ACS Override devient vite compliqué.
- **Les permissions Flatpak** demandent parfois un réglage, mais Flatseal le règle en quelques clics.

## Mon bilan

Aurora est le poste que je cherchais : stable, à jour et prêt à l’emploi. Je ne répare plus rien tous les trois jours, et tout est prêt quand je veux coder ou jouer. Si vous avez un besoin très précis côté noyau, il faudra chercher ailleurs ; pour le reste, c’est un Fedora Silverblue plus complet, pensé pour les développeurs.
