com#!/usr/bin/env node

const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// Chemin vers le thème neoflux
const themePath = path.join(__dirname, '..', 'themes', 'neoflux');
const assetsPath = path.join(themePath, 'assets', 'js');
const outputPath = path.join(themePath, 'static', 'js');

// Créer le dossier de sortie s'il n'existe pas
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });le
}

// Configuration pour esbuild
const buildOptions = {
  entryPoints: [
    path.join(assetsPath, 'particles-init.js')
  ],
  bundle: true,
  outfile: path.join(outputPath, 'particles-bundle.js'),
  minify: true,
  target: ['es2018'],
  format: 'esm',
  // Ajouter particles.js comme dépendance externe pour éviter les problèmes de bundling
  external: ['particles.js']
};

console.log('🚀 Building particles.js bundle...');

esbuild.build(buildOptions)
  .then(() => {
    console.log('✅ Successfully built particles.js bundle');
    console.log(`📁 Output: ${path.join(outputPath, 'particles-bundle.js')}`);
  })
  .catch((error) => {
    console.error('❌ Build failed:', error);
    process.exit(1);
  });