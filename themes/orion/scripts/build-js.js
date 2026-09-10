#!/usr/bin/env node

// Bundle le ciel étoilé (assets/js/*) vers static/js/particles-bundle.js.
// Lancé par `npm run build:js` avant le build Hugo.

const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const themeRoot = path.join(__dirname, '..');
const assetsPath = path.join(themeRoot, 'assets', 'js');
const outputPath = path.join(themeRoot, 'static', 'js');

const entryFile = path.join(assetsPath, 'particles-init.js');
const configFile = path.join(assetsPath, 'particles-config.js');

for (const file of [entryFile, configFile]) {
  if (!fs.existsSync(file)) {
    console.error(`Source file not found: ${file}`);
    process.exit(1);
  }
}

fs.mkdirSync(outputPath, { recursive: true });

const outfile = path.join(outputPath, 'particles-bundle.js');

esbuild
  .build({
    entryPoints: [entryFile],
    bundle: true,
    outfile,
    minify: true,
    target: ['es2020'],
    format: 'esm',
    external: ['particles.js']
  })
  .then((result) => {
    result.warnings.forEach((w) => console.warn(`warning: ${w.text}`));
    const { size } = fs.statSync(outfile);
    console.log(`built ${path.relative(themeRoot, outfile)} (${(size / 1024).toFixed(2)} KB)`);
  })
  .catch((error) => {
    console.error(`build failed: ${error.message}`);
    process.exit(1);
  });
