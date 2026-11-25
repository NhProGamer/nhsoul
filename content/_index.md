---
title: "Accueil"
# L’ancienne page À propos redirige ici : son contenu vit dans l’accueil et le CV.
aliases: ["/about/"]
hero:
  hello: "Bonjour, je suis"
  # {age} et {since} sont calculés depuis params.author.
  lead: "Développeur de {age} ans à Lens, je code depuis mes {since} ans."
  actions:
    - { label: "Voir les projets", url: "#projets" }
    - { label: "Mon CV", url: "/cv/", style: "quiet" }
sections:
  - type: work
    id: projets
    title: "Des logiciels qui tournent pour de vrai."
    index_title: "Mes propres"
    index_word: "soft"
  - type: statement
    text: "Je conçois, je livre, et je réponds quand ça casse."
    note: "Des agents IA écrivent une partie du code, comme une équipe : je fixe l’architecture, je relis et je valide sur le vrai produit."
  - type: timeline
    id: parcours
    title: "Neuf ans de pratique"
    items:
      - { year: 2017, text: "Premiers montages Arduino, fin du CM2" }
      - { year: 2020, text: "Mon réseau Minecraft et ses bots Discord" }
      - { year: 2023, text: "Des serveurs qui se déclarent seuls" }
      - { year: 2024, text: "[Clown School](/projects/clown-school/), mon premier client" }
      - { year: 2025, text: "Ma première brique open source" }
      - { year: 2026, text: "[OrionAuth](/projects/orionauth/), et [Comptoir](/projects/comptoir/) pour Bleitsan" }
---
