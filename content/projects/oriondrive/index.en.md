---
title: OrionDrive
weight: 4
summary: My self-hosted Google Drive
year: '2026'
facts:
- label: For
  value: Personal project
- label: Period
  value: '2026'
- label: My role
  value: Design and development
shots:
- image: images/screen-drive.png
  kind: wide
  alt: The OrionDrive file explorer, with its folders, files and the action menu of an archive open
  caption: A file's menu, from sharing to extracting
choices:
- title: One program
  text: The server and its interface install as a single file.
- title: Plugged into everything
  text: The browser, the file explorer, the phone, and collaborative editing of Office documents.
- title: Safe by default
  text: It refuses to start if its configuration is unsafe, and a revoked share is revoked at once.
now: Sign-in through OrionAuth, like my other tools.
tech:
  facts:
  - label: Code
    value: '[GitHub](https://github.com/NhProGamer/orion-drive)'
  - label: Stack
    value: Go, Vue 3, WebDAV, SFTP, WOPI, S3
  text: Shares, WebDAV with incremental sync (RFC 6578), SFTP, collaborative Office editing, RAW and PSD thumbnails, content-based deduplication, with sign-in through SSO only.
cv:
  kind: Personal
  text: 'Self-hosted drive as a single Go binary with its Vue 3 app: sharing, WebDAV and SFTP, local, S3 or remote-node storage.'
---
I wanted my own Google Drive, hosted at home, without depending on an outside service.
