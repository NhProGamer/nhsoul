// Ciel étoilé Orion — configuration de base pour particles.js.
// Le nombre d'étoiles et leur vitesse viennent du site (window.orionParticles,
// alimenté par params.animation) ; la couleur vient du thème actif (--or-particle).
// Cette configuration ne touche jamais au background : le halo est peint en CSS.
export const particlesConfig = {
  particles: {
    number: {
      value: 120,
      density: { enable: true, value_area: 800 }
    },
    color: {
      value: '#c4b2fb' // lavande Orion — surchargée au runtime
    },
    shape: {
      type: 'circle',
      stroke: { width: 0, color: '#000000' },
      polygon: { nb_sides: 5 }
    },
    opacity: {
      value: 0.6,
      random: true,
      anim: { enable: true, speed: 0.3, opacity_min: 0.1, sync: false }
    },
    size: {
      value: 1.5,
      random: true,
      anim: { enable: true, speed: 1.5, size_min: 0.1, sync: false }
    },
    line_linked: { enable: false },
    move: {
      enable: true,
      speed: 0.15,
      direction: 'none',
      random: true,
      straight: false,
      out_mode: 'out',
      bounce: false,
      attract: { enable: false, rotateX: 600, rotateY: 1200 }
    }
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: { enable: true, mode: 'bubble' },
      onclick: { enable: false },
      resize: true
    },
    modes: {
      bubble: { distance: 80, size: 4, duration: 1.5, opacity: 0.7, speed: 2 },
      repulse: { distance: 200, duration: 0.4 },
      push: { particles_nb: 4 },
      remove: { particles_nb: 2 }
    }
  },
  retina_detect: true
};
