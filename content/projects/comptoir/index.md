---
title: Comptoir
weight: 2
summary: Le système de vente que j’ai conçu pour une marque de vêtements.
status: En production depuis 2025
tile:
  image: images/screen-home-phone.webp
  alt: La boutique Bleitsan sur téléphone
facts:
- label: Pour
  value: Bleitsan (Baggydessine)
- label: Période
  value: 2025 à 2026
- label: Mon rôle
  value: Conception et développement
- label: Commandes
  value: Environ 30 par mois
shots:
- image: images/screen-home-desktop.webp
  kind: wide
  alt: La boutique Bleitsan sur ordinateur
- image: images/screen-home-phone.webp
  kind: phone
  alt: La boutique Bleitsan sur téléphone
choices:
- title: Stripe pour payer, rien d’autre
  text: Catalogue, stock et commandes vivent dans notre propre base. La boutique ne dépend plus d’un prestataire pour fonctionner.
- title: Le serveur décide des prix
  text: 'Le navigateur n’envoie que des identifiants : personne ne peut changer un prix depuis son ordinateur.'
- title: Refuser plutôt que deviner
  text: Si un transporteur ne livre pas une adresse, la commande est refusée au lieu de basculer en silence sur un autre tarif.
now: La boutique Bleitsan tourne dessus, branchée à Mondial Relay et au logisticien eKAN.
tech:
  facts:
  - label: Stack
    value: Go, PostgreSQL, sqlc, Stripe, Vue 3, Tailwind, Mondial Relay, GoReleaser
  text: 'La boutique utilisait Stripe comme catalogue. Quand les drops, les promos et la logistique sont arrivés, j’ai conçu Comptoir : catalogue, stock, commandes et remboursements dans notre propre base, et Stripe ne sert plus qu’à encaisser. Le serveur calcule tous les prix, et le navigateur n’envoie que des identifiants.'
cv:
  kind: Pro, en production depuis 2025
  text: 'Système de vente de la marque Bleitsan, en Go et PostgreSQL : stock, commandes, paiement Stripe, Mondial Relay. Environ 30 commandes par mois.'
  url: https://bleitsan.fr
---
La marque vendait via une page simple qui utilisait Stripe comme catalogue. Avec les collections limitées, les promos et l’envoi par un logisticien, ce modèle ne tenait plus.
