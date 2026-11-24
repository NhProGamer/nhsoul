---
title: Clown School
weight: 1
summary: Clown Art’s video course platform, which I run on my own.
status: In production since 2024
tile:
  image: images/screen-home-desktop.webp
  alt: The Clown School home page
  zoom: true
facts:
- label: For
  value: Clown Art
- label: Period
  value: 2024 to 2026
- label: My role
  value: Sole developer, deployment included
shots:
- image: images/screen-home-desktop.webp
  kind: wide
  zoom: true
  alt: The Clown School home page on a computer
- image: images/screen-home-phone.webp
  kind: phone
  alt: The Clown School home page on a phone
choices:
- title: Rewrite at the right time
  text: By late 2025 the first version could not keep up. I rebuilt it in two parts, a server and an app, without cutting students off.
- title: Take back control of sign-in
  text: I replaced the external sign-in service with my own system, and planned for the old passwords to carry over.
- title: Protect the videos without slowing them down
  text: Videos go straight from the host to the browser, through links that expire. My server only hands out the permissions.
now: Online since 2024, three versions in two years. No student had to reset their password during the migration.
tech:
  facts:
  - label: Commits
    value: '453'
  - label: Lines
    value: 12,000
  - label: Stack
    value: Go, Gin, Vue 3, Pinia, HLS, Shaka Player, OpenStack Swift, OIDC, Docker
  text: 'Clown School sells and streams Clown Art’s video courses. I built all of it and run it alone: the API, the site, access codes, video streaming and authentication. Three versions in two years: Go templates in 2024, an API with a Vue SPA in late 2025, then the move to my own identity server in 2026, without a single student having to reset their password.'
cv:
  kind: Client work, in production since 2024
  text: 'Video course platform: Go API, Vue app, protected video, access codes.'
  url: https://clown.school
---
Clown Art sells video courses to paying students. Since 2024 I have been the only developer: I design, I ship, and I answer when it breaks.
