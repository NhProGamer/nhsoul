---
title: Comptoir
weight: 2
summary: The sales system I designed for a clothing brand.
status: In production since 2025
tile:
  image: images/screen-home-phone.webp
  alt: The Bleitsan shop on a phone
facts:
- label: For
  value: Bleitsan (Baggydessine)
- label: Period
  value: 2025 to 2026
- label: My role
  value: Design and development
shots:
- image: images/screen-home-desktop.webp
  kind: wide
  alt: The Bleitsan shop on a computer
- image: images/screen-home-phone.webp
  kind: phone
  alt: The Bleitsan shop on a phone
choices:
- title: Stripe to pay, nothing else
  text: Catalogue, stock and orders live in our own database. The shop no longer depends on a provider to work.
- title: The server sets the prices
  text: 'The browser only sends identifiers: nobody can change a price from their computer.'
- title: Refuse rather than guess
  text: If a carrier does not deliver to an address, the order is refused instead of silently switching to another rate.
now: The Bleitsan shop runs on it, connected to Mondial Relay and to the eKAN logistics provider.
tech:
  facts:
  - label: Stack
    value: Go, PostgreSQL, sqlc, Stripe, Vue 3, Tailwind, Mondial Relay, GoReleaser
  text: 'The shop used Stripe as its catalogue. When drops, promotions and logistics arrived, I designed Comptoir: catalogue, stock, orders and refunds in our own database, with Stripe only taking payments. The server computes every price, and the browser only sends identifiers.'
cv:
  kind: Client work, in production since 2025
  text: 'Sales system of the Bleitsan brand, in Go and PostgreSQL: stock, orders, Stripe payment, Mondial Relay.'
  url: https://bleitsan.fr
---
The brand sold through a simple page that used Stripe as its catalogue. With limited collections, promotions and shipping through a logistics provider, that model no longer held up.
