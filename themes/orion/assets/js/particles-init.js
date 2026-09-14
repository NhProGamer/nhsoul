// Initialisation du ciel étoilé Orion.
//
// Trois choses que fait ce module et que la version d'origine ne faisait pas :
//   1. les étoiles prennent la couleur du thème actif (--or-particle) ;
//   2. l'animation est reconstruite à chaque bascule clair / sombre, en
//      détruisant l'instance précédente (sinon les canvas s'empilent) ;
//   3. les réglages de params.animation (nombre, vitesse) sont réellement lus.
import { particlesConfig } from './particles-config.js';

const CONTAINER_ID = 'particles-js';
const FALLBACK_COLOR = '#c4b2fb';

function particleColor() {
  const c = getComputedStyle(document.documentElement)
    .getPropertyValue('--or-particle')
    .trim();
  return c || FALLBACK_COLOR;
}

function isLight() {
  return document.documentElement.getAttribute('data-theme') === 'light';
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function destroyExisting() {
  if (window.pJSDom && window.pJSDom.length) {
    window.pJSDom.forEach((dom) => {
      try { dom.pJS.fn.vendors.destroypJS(); } catch (e) { /* instance déjà morte */ }
    });
    window.pJSDom = [];
  }
  const container = document.getElementById(CONTAINER_ID);
  if (container) container.innerHTML = '';
}

function buildParticles() {
  if (typeof particlesJS === 'undefined') {
    console.error('particlesJS is not defined — particles.js must load first');
    return;
  }
  const container = document.getElementById(CONTAINER_ID);
  if (!container) return;

  destroyExisting();

  const settings = window.orionParticles || {};
  const cfg = structuredClone
    ? structuredClone(particlesConfig)
    : JSON.parse(JSON.stringify(particlesConfig));

  cfg.particles.color.value = particleColor();
  // Les étoiles violettes sont un peu moins opaques sur fond clair.
  cfg.particles.opacity.value = isLight() ? 0.5 : 0.6;

  if (Number.isFinite(settings.count)) cfg.particles.number.value = settings.count;
  if (Number.isFinite(settings.speed)) cfg.particles.move.speed = settings.speed;

  // Mouvement réduit : on garde le ciel, on coupe l'animation.
  if (prefersReducedMotion()) {
    cfg.particles.move.enable = false;
    cfg.particles.opacity.anim.enable = false;
    cfg.particles.size.anim.enable = false;
    cfg.interactivity.events.onhover.enable = false;
  }

  particlesJS(CONTAINER_ID, cfg);

  Object.assign(container.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    zIndex: '-10',
    pointerEvents: 'none'
  });
}

document.addEventListener('DOMContentLoaded', buildParticles);

// Reconstruit les étoiles quand l'utilisateur bascule le thème.
// Court délai pour laisser la variable CSS se mettre à jour avant lecture.
document.addEventListener('orion:theme', () => setTimeout(buildParticles, 60));
