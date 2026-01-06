+++
date = '2025-09-24T15:17:00+02:00'
draft = false
author = "NнPro"
title = "Aurora: The immutable OS “on steroids” for productive use"
featured_image = "screenshare.png"
+++
Second blog post - Let's get into the Linux game!
<!--more-->

I said in the last post that we would probably talk about backend.
Sorry… but that won’t be for today. 😅

## The Context

Like many beginners, I stepped into the Linux world with **Ubuntu**. Easy to pick up, but quickly too bloated for my taste: many packages installed by default, sometimes useless. Then I switched to **Arch Linux**. There, revelation: a lightweight, ultra-flexible system, a distro that really gives you the keys.

Except that eventually, **maintenance** caught up with me. Arch is great when you like tinkering, but when you want a **stable workstation**, you spend more time maintaining than producing. I needed something else.

That's when a friend told me about **immutable OSs** and advised me to try **Aurora**.

## The Problem

I wanted a system that combines:

- **Stability**: no bad surprises after an update
- **Simplicity**: no need to spend 2h configuring a broken lib
- **Modernity**: support for gaming, development and VMs

Aurora then intrigued me: a version “on steroids” with integrated scripts that save crazy time.

## The Solution: Aurora

Aurora is an immutable OS based on Fedora Atomic, designed for productive daily use.
A few points that stood out to me:

- **Atomic updates** and possible rollback if something breaks
- Apps managed via **Flatpak** (GUI) + **Homebrew** (CLI) + **rpm-ostree** (for essentials)
- Integrated scripts that automatically install painful tools (gaming, JetBrains Toolbox, etc.)
- Support for virtualization and even **VFIO** for turnkey **PCI passthrough**

In short, an experience designed to be simple without being limited.

## The Weak Points

Of course, no OS is perfect. Here is what I noticed:

- **Too automatic**: if you want to get your hands dirty (change kernel, apply a patch like ACS Override), it quickly becomes complicated.
- **Flatpak**: permissions sometimes need adjustment, but honestly it's not a real problem. With **Flatseal** and already well-made base configs (e.g. themes), it rolls.

For the rest (gaming, dev, VM), Aurora didn't disappoint me: the **ujust** tool installs what's needed by itself, and it works straight away.

## My Feedback

Aurora is exactly what I was looking for: **a stable, modern and usable immutable OS for daily use**.
No need to repatch every 3 days, and when I want to play or code, everything is ready.

Only downside: if you have a very specific kernel need, you will have to tinker elsewhere.
But otherwise, Aurora clearly keeps its promise: a Silverblue ++ for developers, gamers and power users.

---

*Second post in the pocket! The next one will surely be even more technical oriented…* 🚀
