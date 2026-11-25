---
title: mx4
weight: 5
summary: My Logitech mouse on Linux
year: '2026'
facts:
- label: For
  value: Personal project
- label: Period
  value: '2026'
- label: My role
  value: Design and development
choices:
- title: The hardware as judge
  text: Every feature is tested on the real mouse. The ones Logitech does not document, I probed on the device.
- title: Lightness first
  text: 'The radial menu is drawn without the graphics card: from 157 MB down to 12.5 MB of memory.'
- title: Nothing to create, nothing sent
  text: Configuration in a plain text file, with no account and no telemetry.
now: Buttons, gestures, per-app profiles and haptic feedback work on KDE Plasma.
tech:
  facts:
  - label: Stack
    value: Rust, HID++, uinput, Wayland, KDE Plasma, systemd
  text: Remapping, gestures, per-app profiles, a ring of actions with haptic feedback, a buzz in the hand on every notification. All with a TOML configuration, no account and no telemetry.
cv:
  kind: Personal
  text: 'Rust software for the Logitech MX Master 4 mouse on Linux: gestures, per-app profiles, haptic feedback.'
---
Logitech offers nothing for its MX Master 4 mouse on Linux. I wrote the equivalent of its official software for KDE.
