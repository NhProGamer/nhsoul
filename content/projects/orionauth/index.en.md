---
title: OrionAuth
weight: 3
summary: The sign-in system behind my clients’ products.
status: In production since 2026
tile:
  image: images/login-clown-school.webp
  alt: The OrionAuth sign-in screen in Clown School colours
facts:
- label: For
  value: Clown School and my own tools
- label: Period
  value: '2026'
- label: My role
  value: Design and development
shots:
- image: images/login-clown-school.webp
  kind: half
  alt: The OrionAuth sign-in screen in Clown School colours
  caption: In Clown School colours
- image: images/login-oriondrive.webp
  kind: half
  alt: The OrionAuth sign-in screen in OrionDrive colours
  caption: In OrionDrive colours
choices:
- title: Follow the standards to the letter
  text: 'OAuth 2.1 and OpenID Connect: any standard application plugs in, with no custom code.'
- title: An invisible migration
  text: Old passwords are accepted, then strengthened at the next sign-in.
- title: Attack my own system
  text: Two security audit passes, to find the holes before an attacker does.
now: In production for Clown School, with a sign-in screen in each product’s colours.
tech:
  facts:
  - label: Commits
    value: '698'
  - label: Lines
    value: 68,000
  - label: Stack
    value: Go, PostgreSQL, OIDC, WebAuthn, OPA / Rego, Prometheus, Vue 3
  text: My first encounter with OAuth was the Microsoft sign-in of my Minecraft launcher. A year later, I wrote my own identity provider to replace Logto, with two SDKs (TypeScript and Go).
cv:
  kind: Personal, in production
  text: 'OAuth 2.0 / OpenID Connect server in Go: MFA, passkeys, identity federation, RBAC, audit log, TypeScript and Go SDKs.'
---
Clown School depended on an external sign-in service. I chose to write my own, for my clients and for my own tools.
