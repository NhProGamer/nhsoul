+++
date = '2025-09-24T15:17:00+02:00'
draft = false
author = "Néo Huyghe"
title = "Why I develop on Aurora, an immutable Linux"
slug = "aurora-immutable-linux"
aliases = ["/blog/aurora-the-immutable-os-on-steroids-for-productive-use/"]
featured_image = "screenshare.png"
+++
After Ubuntu and then Arch Linux, I wanted a workstation that does not break after an update. Aurora, an immutable Linux based on Fedora, gave me that and took nothing away.
<!--more-->

## From Ubuntu to Arch, then to maintenance

Like many people, I discovered Linux with **Ubuntu**: easy to pick up, but too heavy for my taste, with many packages installed by default. I then moved to **Arch Linux**, light and fully configurable.

Over time, maintenance caught up with me. Arch is ideal for tinkering, but on a workstation I spent more time fixing than producing. A friend then told me about immutable systems and suggested **Aurora**.

## What I was looking for

- **Stability**: no bad surprise after an update.
- **Simplicity**: no more two hours spent fixing a broken library.
- **Gaming, development and virtual machines** on the same computer.

## What Aurora brings

Aurora is an immutable system based on Fedora Atomic, designed for everyday work.

- **Atomic updates**: an update applies in full or not at all, and I can go back to the previous version if something breaks.
- **Three sources of software**: Flatpak for graphical apps, Homebrew for command-line tools, rpm-ostree for the essentials.
- **Built-in scripts** (`ujust`) that install the tools that are painful to set up: gaming, JetBrains Toolbox, virtualisation.
- **Virtualisation ready to use**, down to passing a graphics card to a virtual machine (VFIO).

## Its limits

- **Everything is automated**: changing the kernel or applying a patch such as ACS Override quickly gets complicated.
- **Flatpak permissions** sometimes need adjusting, but Flatseal handles it in a few clicks.

## My verdict

Aurora is the workstation I was looking for: stable, up to date and ready to use. I no longer fix something every three days, and everything is ready when I want to code or play. If you have a very specific kernel need, look elsewhere; for everything else, it is a more complete Fedora Silverblue, built for developers.
