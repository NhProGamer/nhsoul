(function () {
  var root = document.documentElement;

  // The hero entrance has played: later visits in this session skip it.
  if (document.querySelector('.hero')) { try { sessionStorage.setItem('manchette-hero', '1'); } catch (e) {} }

  var btn = document.querySelector('.theme');
  if (btn) {
    // The current theme: the stored choice, otherwise the system one.
    var current = function () { return root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); };
    var label = function () {
      var dark = current() === 'dark';
      btn.querySelector('.theme__label').textContent = btn.title = dark ? btn.dataset.light : btn.dataset.dark;
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
        .then(function () { out.textContent = copy.dataset.done; copy.classList.add('is-done'); })
        .catch(function () { out.textContent = copy.dataset.fail; });
    });
  }

  // The home index brings its rows in one after the other the first time it
  // scrolls into view; the index word strikes its pose each time it comes
  // back into view (see .index and .soft in main.css).
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var replay = e.target.classList.contains('soft');
        if (e.isIntersecting) { e.target.classList.add('in'); if (!replay) io.unobserve(e.target); }
        else if (replay) e.target.classList.remove('in');
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    document.querySelectorAll('.index, .soft').forEach(function (el) { io.observe(el); });
  }

  // Signature lines with several values type them in turn, like a terminal:
  // erase the current one, type the next, hold it. Skipped for reduced motion.
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[data-cycle]').forEach(function (el) {
      var words = JSON.parse(el.dataset.cycle), i = 0;
      if (words.length < 2) return;
      var step = function () {
        var text = el.textContent;
        if (text && text !== words[(i + 1) % words.length].slice(0, text.length)) { el.textContent = text.slice(0, -1); return setTimeout(step, 45); }
        var next = words[(i + 1) % words.length];
        if (text.length < next.length) { el.textContent = next.slice(0, text.length + 1); return setTimeout(step, 85); }
        i = (i + 1) % words.length;
        setTimeout(step, 1800);
      };
      setTimeout(step, 1800);
    });
  }

  // The small-screen menu closes after a choice, on Escape and on a click outside.
  var menu = document.querySelector('.menu');
  if (menu) {
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) menu.open = false; });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.open) { menu.open = false; menu.querySelector('summary').focus(); } });
    document.addEventListener('click', function (e) { if (menu.open && !menu.contains(e.target)) menu.open = false; });
  }

  // The CV sheet keeps its A4 layout: on a narrow screen it is scaled down
  // as a whole, like a PDF preview, instead of reflowing.
  var sheet = document.querySelector('.sheet');
  if (sheet) {
    var fit = function () {
      sheet.style.zoom = '';
      var room = document.documentElement.clientWidth - 24, width = sheet.offsetWidth;
      if (width > room) sheet.style.zoom = (room / width).toFixed(4);
    };
    fit();
    addEventListener('resize', fit);
  }

  var print = document.querySelector('[data-print]');
  if (print) print.addEventListener('click', function () { window.print(); });
})();
