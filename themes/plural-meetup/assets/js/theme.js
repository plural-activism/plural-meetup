/* Theme switcher.
   Precedence: dropdown choice > OS preference > dark default.
   The stored choice lives in localStorage under "plural-meetup-theme";
   "system" means "no stored choice" and hands control back to the OS. */
(function () {
  var KEY = 'plural-meetup-theme';
  var root = document.documentElement;
  var select = document.querySelector('[data-theme-select]');
  var meta = document.querySelector('meta[name="theme-color"]');
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;

  function systemTheme() {
    return media && media.matches ? 'light' : 'dark';
  }

  function storedPreference() {
    try {
      return window.localStorage.getItem(KEY);
    } catch (error) {
      return null;
    }
  }

  function apply(preference) {
    var theme = !preference || preference === 'system' ? systemTheme() : preference;
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-theme-pref', preference || 'system');
    if (select && select.value !== (preference || 'system')) {
      select.value = preference || 'system';
    }
    if (meta) {
      meta.setAttribute('content', theme === 'light' ? '#ffffff' : '#000000');
    }
  }

  apply(storedPreference());

  if (media) {
    var onSystemChange = function () {
      if (!storedPreference()) {
        apply('system');
      }
    };
    if (media.addEventListener) {
      media.addEventListener('change', onSystemChange);
    } else if (media.addListener) {
      media.addListener(onSystemChange);
    }
  }

  if (select) {
    select.addEventListener('change', function () {
      var value = select.value;
      try {
        if (value === 'system') {
          window.localStorage.removeItem(KEY);
        } else {
          window.localStorage.setItem(KEY, value);
        }
      } catch (error) {
        /* Storage unavailable: the choice still applies for this page view. */
      }
      apply(value);
    });
  }
})();
