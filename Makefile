# Site commands. Hugo must be on PATH, or passed in: make HUGO="mise exec hugo@0.170.1 -- hugo" build
HUGO ?= hugo

.PHONY: dev build html cv

# Local server with drafts, reloads on change.
dev:
	$(HUGO) server -D

# What the Docker image runs: the site, then the CV PDFs.
build: html cv

html:
	$(HUGO) --minify

# Prints the CVs of an existing public/ to PDF (needs Chromium).
cv:
	sh scripts/generate-pdf.sh
