/* MNEMO games - shared library */

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
  setLang(localStorage.getItem('mnemo-lang') || 'pl');
  setTheme(localStorage.getItem('mnemo-theme') || 'light');

  const langToggle = document.getElementById('langToggle');
  const themeToggle = document.getElementById('themeToggle');
  langToggle?.addEventListener('click', () => {
    setLang(root.getAttribute('lang') === 'pl' ? 'en' : 'pl');
  });
  themeToggle?.addEventListener('click', () => {
    setTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
  });

  // expose
  window.MNEMO = {
    lang: () => root.getAttribute('lang') || 'pl',
    onLangChange: (cb) => document.addEventListener('mnemo-lang-change', e => cb(e.detail)),
    t: (pl, en) => root.getAttribute('lang') === 'en' ? en : pl,
    shuffle: (arr) => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    saveScore: (game, score) => {
      const all = JSON.parse(localStorage.getItem('mnemo-scores') || '{}');
      all[game] = all[game] || [];
      all[game].push({ score, ts: Date.now() });
      all[game] = all[game].slice(-20);
      localStorage.setItem('mnemo-scores', JSON.stringify(all));
    },
    getBestScore: (game) => {
      const all = JSON.parse(localStorage.getItem('mnemo-scores') || '{}');
      const arr = all[game] || [];
      if (!arr.length) return null;
      return Math.max(...arr.map(s => s.score));
    }
  };
})();
