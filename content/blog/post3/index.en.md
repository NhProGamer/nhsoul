+++
date = '2026-09-11T16:30:00+02:00'
draft = false
author = "NнPro"
title = "OrionDrive: why I ended up writing my own cloud"
featured_image = "oriondrive.png"
+++
Third blog post - This time, it really is backend!
<!--more-->

Two posts that I promised to talk about backend.
This time, I swear, here we are. 😄

## The Context

For years, my files lived on **Google Drive**. Convenient, fast, zero maintenance… and zero control. My documents, my photos, my projects: all of it sitting on servers I don't choose, under terms I don't negotiate, with a quota that grows when I pay.

Getting off the **GAFAM** track isn't just a stance for me. It's deciding **where** my data lives, **who** can read it, and **how much** it costs. The answer came down to one word: at home. I have a server, it has **10 TB** of storage. My limit is my disk — not a monthly subscription.

That left the software to pick. And that's where I went shopping.

## The Problem: nothing fit

### Nextcloud

First stop, the obvious one. Huge ecosystem, an app for absolutely everything… and that's exactly the issue: it's a **catch-all**. I wanted a drive, not an office suite with a calendar, a chat and a social network bolted on.

But the real wall was **performance**. I was capped at **50 MB/s** on transfers, where every other solution I tested afterwards comfortably hit **100-110 MB/s**. I spent hours fiddling with the **PHP** executor and **OPcache** to claw back a few percent. Even tuned to death, Nextcloud stays slow.

### Cloudreve V3

Visually, a punch in the face — in a good way. Clean, modern interface, and real feature density. Performance kept up too, since it's written in **Go**.

Except those weren't **my** features. Plenty of things I'd never use, and none of the ones I actually needed.

### ownCloud Infinite Scale

**Go** again, so the throughput was there. But the extension ecosystem is narrow, and too many functions were missing for my taste.

More importantly, oCIS is built as **microservices**. That's perfectly defensible at company scale. For a personal cloud, it means a deployment that's out of proportion and maintenance that matches. Too much complexity for a simple use case.

### Seafile

The desktop client is genuinely excellent. Sync is solid and fast.

But on the feature side it's deliberately minimal. It does one thing very well, and I wanted a bit more than that.

### Back to square one

I went back to look at **Cloudreve V4**. On paper, very good. Except too many features had moved behind a paywall.

Here's what I observed **in my own usage** — this isn't a benchmark, just field notes:

| Solution | Language | Observed throughput | What blocked me |
|---|---|---|---|
| Nextcloud | PHP | ~50 MB/s | Slow even when tuned, catch-all |
| Cloudreve V3 | Go | ~100-110 MB/s | Not the features I was after |
| ownCloud Infinite Scale | Go | ~100-110 MB/s | Microservices = heavy deployment, limited extensions |
| Seafile | C / Python | ~100-110 MB/s | Too minimal |
| Cloudreve V4 | Go | — | Too many paid features |

At that point the picture was simple: either it's fast but incomplete, or complete but slow, or good but paid.

So I wrote my own.

## The Solution: OrionDrive

**OrionDrive** is a self-hosted drive that fits in **a single binary**. A **Go** backend that embeds the **Vue 3** SPA directly — no web server to configure alongside, no PHP-FPM to tune, no microservice stack to orchestrate. You run the binary, you're done.

### What it does

- **Files** — explorer, resumable chunked upload, trash and restore, versioning, file locking, per-group quotas
- **Storage** — local disk, **S3** or a remote node, with direct or presigned downloads and per-group speed limits. Optional **AES-256-CTR** encryption at rest
- **Sharing** — file and folder links with permission levels (view, edit, blind deposit), passwords, expiry and download limits
- **Protocols** — **WebDAV** and **SFTP**, each with dedicated credentials, plus personal access tokens for the API
- **Preview and editing** — images, video, audio, PDF, text, Markdown, ePub, an image editor, and collaborative Office editing over **WOPI** (OnlyOffice or Collabora)
- **Archives** — background compression and extraction (zip, tar, 7z)
- **Administration** — groups with granular permissions, per-group storage policies, SSO group to internal group mapping, scheduled maintenance

### Under the hood

Go 1.26 with **Gin** and **GORM**, on **SQLite**, **PostgreSQL** or **MySQL** as you like — pure Go, so the binary stays static. Migrations with **goose**, CLI with **cobra**, OIDC through **coreos/go-oidc**, S3 with the **AWS SDK v2**, and optional **Redis** for a shared cache in multi-node setups.

On the frontend: Vue 3, Vite, TypeScript, Pinia, an installable PWA, light and dark themes, and full internationalisation in French and English.

A small nod along the way: the interface uses **Nebula**, the design system I built, which also dresses this very site. Same **oklch** tokens, same violet. My drive and my portfolio are family.

## The Weak Points

No project is perfect, and mine less than most — it's young.

- **Authentication is OIDC only.** No local accounts, no password stored in the drive. It's a deliberate choice, but it means you need an identity provider alongside. I have my own (OrionAuth); for anyone else that's one more dependency to install.
- **No native sync client.** WebDAV and SFTP cover the essentials, and I wrote `kio-orion` for native KDE integration, but we're far from the comfort of the Seafile client.
- **The ecosystem is me.** No community, no extension marketplace. A bug means I don't depend on anyone to fix it — but nobody will fix it for me either.

## What About AI?

Like in my previous posts, I won't lie: **Claude Opus 5** helped me a lot in building this project.

But let's be clear, this project was **not vibe-coded**. Every line committed and pushed was read, understood and thought through. The architecture, the layering, the storage choices, the permission model: all of that came out of my own head. AI speeds up the writing, it doesn't decide for me.

That distinction matters, especially on a project that handles someone's personal files.

## My Take

OrionDrive does exactly what I asked of it: a **fast** drive, with **the** features I need, deployable in one command, and one that will never bill me a thing.

It's licensed under **MIT**. Free, and it will stay that way.

My only limit today is the **10 TB** on my server. Safe to say I have room.

---

*Third post, and this time I kept my word on the backend! The next one will probably be about OrionAuth, because writing your own OIDC server is a whole other story…* 🚀
