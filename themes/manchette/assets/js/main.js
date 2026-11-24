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
})();
