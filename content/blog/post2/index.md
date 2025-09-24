+++
date = '2025-09-24T15:17:00+02:00'
draft = false
author = "NнPro"
title = "Aurora : l’OS immuable “sous stéroïdes” pour un usage productif"
featured_image = "screenshare.png"
+++
Deuxième article de blog - On passe au Linux game !
<!--more-->

J’avais dit dans le dernier post qu’on parlerait probablement de backend.  
Désolé… mais ça ne sera pas pour aujourd’hui. 😅

## Le contexte

Comme beaucoup de débutants, j’ai mis un premier pied dans le monde Linux avec **Ubuntu**. Facile à prendre en main, mais rapidement trop chargé à mon goût : beaucoup de paquets installés par défaut, parfois inutiles. Ensuite je suis passé sur **Arch Linux**. Là, révélation : un système léger, ultra flexible, une distro qui te donne vraiment les clés en main.

Sauf qu’à force, la **maintenance** m’a rattrapé. Arch, c’est génial quand tu aimes bricoler, mais quand tu veux un poste **stable pour travailler**, tu passes plus de temps à maintenir qu’à produire. Il me fallait autre chose.

C’est là qu’un ami m’a parlé des **OS immuables** et m’a conseillé d’essayer **Aurora**.

## Le problème

Je voulais un système qui combine :

- **Stabilité** : pas de mauvaise surprise après une mise à jour
- **Simplicité** : ne pas devoir repasser 2h à configurer une lib cassée
- **Modernité** : support du gaming, du développement et des VM

Aurora m’a alors intrigué : une version “sous stéroïdes” avec des scripts intégrés qui font gagner un temps fou.

## La solution : Aurora

Aurora, c’est un OS immuable basé sur Fedora Atomic, pensé pour un usage quotidien productif.  
Quelques points qui m’ont marqué :

- Les **mises à jour atomiques** et le rollback possible si quelque chose casse
- Les applis gérées via **Flatpak** (graphique) + **Homebrew** (CLI) + **rpm-ostree** (pour l’indispensable)
- Des scripts intégrés qui installent tout seul les outils pénibles (gaming, JetBrains Toolbox, etc.)
- Le support de la virtualisation et même du **VFIO** pour le **passthrough PCI** clé en main

Bref, une expérience pensée pour être simple sans être limitée.

## Les points faibles

Bien sûr, aucun OS n’est parfait. Voici ce que j’ai remarqué :

- **Trop automatique** : si tu veux mettre les mains dans le cambouis (changer de kernel, appliquer un patch comme l’ACS Override), ça devient vite compliqué.
- **Flatpak** : les permissions sont parfois à ajuster, mais honnêtement ce n’est pas un vrai problème. Avec **Flatseal** et les configs de base déjà bien faites (ex. thèmes), ça roule.

Pour le reste (gaming, dev, VM), Aurora ne m’a pas déçu : l’outil **ujust** installe tout seul ce qu’il faut, et ça marche direct.

## Mon retour

Aurora, c’est exactement ce que je cherchais : **un OS immuable stable, moderne et utilisable au quotidien**.  
Pas besoin de repatcher tous les 3 jours, et quand je veux jouer ou coder, tout est prêt.

Seul bémol : si tu as un besoin très spécifique côté kernel, il faudra bricoler ailleurs.  
Mais sinon, Aurora tient clairement sa promesse : un Silverblue ++ pour les développeurs, gamers et power users.

---

*Deuxième post en poche ! Le prochain sera sûrement encore plus orienté technique…* 🚀
