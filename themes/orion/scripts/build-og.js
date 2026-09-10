#!/usr/bin/env node

// Rend la banniere de partage (og:image) et les icones PNG depuis le SVG de la marque.
// Ne tourne pas au build du site : lance-le a la main quand la marque ou le
// texte de la banniere change, puis commite les PNG.
//
//   node scripts/build-og.js
//   ORION_OG_NAME="Néo Huyghe" ORION_OG_DOMAIN="nhsoul.fr" node scripts/build-og.js
//
// Requiert puppeteer, resolu depuis le node_modules du site.

const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');

const themeRoot = path.join(__dirname, '..');
const outDir = path.join(themeRoot, 'static', 'images');
const bannerSrc = path.join(__dirname, 'og-banner.html');
const markSrc = path.join(themeRoot, 'static', 'mark-dark.svg');

const text = {
  word: process.env.ORION_OG_WORD,
  eyebrow: process.env.ORION_OG_ROLE,
  name: process.env.ORION_OG_NAME,
  domain: process.env.ORION_OG_DOMAIN,
  tagline: process.env.ORION_OG_TAGLINE
};

const ICONS = [180, 512];

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

  // ── Banniere 1200x630 ──
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  const query = Object.entries(text)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');
  await page.goto(`file://${bannerSrc}${query ? '?' + query : ''}`, { waitUntil: 'networkidle2' });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 400));
  const banner = path.join(outDir, 'og-orion.png');
  await page.screenshot({ path: banner });
  console.log(`built ${path.relative(themeRoot, banner)} (1200x630)`);

  // ── Icones PNG, fond transparent ──
  const svg = fs.readFileSync(markSrc, 'utf8');
  for (const size of ICONS) {
    const icon = await browser.newPage();
    await icon.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
    await icon.setContent(
      `<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`
    );
    await new Promise((r) => setTimeout(r, 120));
    const file = path.join(outDir, `mark-${size}.png`);
    await icon.screenshot({ path: file, omitBackground: true });
    await icon.close();
    console.log(`built ${path.relative(themeRoot, file)} (${size}x${size})`);
  }

  await browser.close();
})().catch((e) => {
  console.error(`build failed: ${e.message}`);
  process.exit(1);
});
