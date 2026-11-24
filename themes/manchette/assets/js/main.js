(function () {
  var root = document.documentElement;

  var btn = document.querySelector('.theme');
  if (btn) {
    // The current theme: the stored choice, otherwise the system one.
    var current = function () { return root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); };
    var label = function () {
      var dark = current() === 'dark';
      btn.textContent = dark ? btn.dataset.light : btn.dataset.dark;
      btn.setAttribute('aria-pressed', String(dark));
    };
    btn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('manchette-theme', next); } catch (e) {}
      label();
    });
    label();
  }

  var copy = document.querySelector('[data-copy]');
  if (copy && navigator.clipboard) {
    var out = copy.parentNode.querySelector('.copied');
    copy.hidden = false;
    copy.addEventListener('click', function () {
      navigator.clipboard.writeText(copy.dataset.copy)
        .then(function () { out.textContent = copy.dataset.done; })
        .catch(function () { out.textContent = copy.dataset.fail; });
    });
  }

  // Timeline: on wide screens, without reduced motion, scrolling down moves it sideways.
  var sec = document.querySelector('.path');
  if (sec) {
    var runway = sec.querySelector('.path__runway'), sticky = sec.querySelector('.path__sticky'),
        view = sec.querySelector('.path__view'), track = sec.querySelector('.track'),
        wide = matchMedia('(min-width: 60rem)'), still = matchMedia('(prefers-reduced-motion: reduce)'),
        dist = 0, ticking = false;
    var place = function () {
      ticking = false;
      if (!sec.classList.contains('is-pinned')) return;
      var p = Math.min(1, Math.max(0, -runway.getBoundingClientRect().top / dist));
      track.style.transform = 'translateX(' + (-p * dist) + 'px)';
    };
    var setup = function () {
      var pin = wide.matches && !still.matches;
      sec.classList.toggle('is-pinned', pin);
      track.style.transform = '';
      runway.style.height = '';
      if (!pin) return;
      dist = Math.max(0, track.scrollWidth - view.clientWidth);
      // The runway is as tall as the sticky block plus the sideways distance.
      runway.style.height = (sticky.offsetHeight + dist) + 'px';
      place();
    };
    setup();
    addEventListener('resize', setup);
    wide.addEventListener('change', setup);
    still.addEventListener('change', setup);
    addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(place); } }, { passive: true });
  }
})();
