/* MNEMO Kompendium — shared interactivity */

(function() {
  const root = document.documentElement;
  const setLang = (lang) => {
    root.setAttribute('lang', lang);
    document.body.setAttribute('data-lang', lang);
    document.querySelectorAll('[data-pl][data-en]').forEach(el => {
      el.textContent = el.getAttribute('data-' + lang);
    });
    localStorage.setItem('mnemo-lang', lang);
    document.dispatchEvent(new CustomEvent('mnemo-lang-change', { detail: lang }));
  };
  const setTheme = (t) => {
    root.setAttribute('data-theme', t);
    localStorage.setItem('mnemo-theme', t);
  };

  // URL param `lang` overrides stored
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  setLang(urlLang || localStorage.getItem('mnemo-lang') || 'pl');
  setTheme(localStorage.getItem('mnemo-theme') || 'light');

  document.getElementById('langToggle')?.addEventListener('click', () => {
    setLang(root.getAttribute('lang') === 'pl' ? 'en' : 'pl');
  });
  document.getElementById('themeToggle')?.addEventListener('click', () => {
    setTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
  });

  window.MNEMO = {
    lang: () => root.getAttribute('lang') || 'pl',
    onLangChange: (cb) => document.addEventListener('mnemo-lang-change', e => cb(e.detail)),
    t: (pl, en) => root.getAttribute('lang') === 'en' ? en : pl
  };
})();
