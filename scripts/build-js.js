#!/usr/bin/env node

const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// Chemin vers le thème neoflux
const themePath = path.join(__dirname, '..', 'themes', 'neoflux');
const assetsPath = path.join(themePath, 'assets', 'js');
const outputPath = path.join(themePath, 'static', 'js');

// Vérifier que les fichiers source existent
const entryFile = path.join(assetsPath, 'particles-init.js');
const configFile = path.join(assetsPath, 'particles-config.js');

if (!fs.existsSync(entryFile)) {
  console.error('❌ Entry file not found:', entryFile);
  process.exit(1);
}

if (!fs.existsSync(configFile)) {
  console.error('❌ Config file not found:', configFile);
  process.exit(1);
}

// Créer le dossier de sortie s'il n'existe pas
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
  console.log('📁 Created output directory:', outputPath);
}

// Configuration pour esbuild
const buildOptions = {
  entryPoints: [entryFile],
  bundle: true,
  outfile: path.join(outputPath, 'particles-bundle.js'),
  minify: true,
  target: ['es2018'],
  format: 'esm',
  // Ajouter particles.js comme dépendance externe pour éviter les problèmes de bundling
  external: ['particles.js']
};

console.log('🚀 Building particles.js bundle...');
console.log('📄 Entry:', entryFile);
console.log('📦 Output:', path.join(outputPath, 'particles-bundle.js'));

esbuild.build(buildOptions)
  .then((result) => {
    if (result.errors.length > 0) {
      console.error('❌ Build completed with errors:');
      result.errors.forEach(error => console.error('  -', error.text));
      process.exit(1);
    }
    
    if (result.warnings.length > 0) {
      console.warn('⚠️  Build completed with warnings:');
      result.warnings.forEach(warning => console.warn('  -', warning.text));
    }
    
    console.log('✅ Successfully built particles.js bundle');
    console.log(`📁 Output: ${path.join(outputPath, 'particles-bundle.js')}`);
    
    // Afficher la taille du fichier généré
    const stats = fs.statSync(path.join(outputPath, 'particles-bundle.js'));
    console.log(`📊 Size: ${(stats.size / 1024).toFixed(2)} KB`);
  })
  .catch((error) => {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  });