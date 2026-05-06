/* ==========================================================
   MNEMO — Portal interactivity
   ========================================================== */

(() => {
'use strict';

// ============= LANGUAGE =============
const root = document.documentElement;
const langToggle = document.getElementById('langToggle');
const setLang = (lang) => {
  root.setAttribute('lang', lang);
  document.body.setAttribute('data-lang', lang);
  document.querySelectorAll('[data-pl][data-en]').forEach(el => {
    el.textContent = el.getAttribute('data-' + lang);
  });
  localStorage.setItem('mnemo-lang', lang);
  document.dispatchEvent(new CustomEvent('mnemo-lang-change', { detail: lang }));
};
const initialLang = localStorage.getItem('mnemo-lang') || 'pl';
setLang(initialLang);
langToggle.addEventListener('click', () => {
  const next = root.getAttribute('lang') === 'pl' ? 'en' : 'pl';
  setLang(next);
});

// ============= THEME =============
const themeToggle = document.getElementById('themeToggle');
const setTheme = (t) => {
  root.setAttribute('data-theme', t);
  localStorage.setItem('mnemo-theme', t);
};
setTheme(localStorage.getItem('mnemo-theme') || 'light');
themeToggle.addEventListener('click', () => {
  setTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
});

// ============= CURSOR =============
const cursor = document.querySelector('.cursor');
const trail = document.querySelector('.cursor-trail');
let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

if (window.matchMedia('(min-width: 901px)').matches) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  const animateTrail = () => {
    trailX += (mouseX - trailX) * 0.15;
    trailY += (mouseY - trailY) * 0.15;
    trail.style.left = trailX + 'px';
    trail.style.top = trailY + 'px';
    requestAnimationFrame(animateTrail);
  };
  animateTrail();

  document.querySelectorAll('a, button, .principle, .master-card, .age-card, .game-tile, .technique, .tl-event').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      trail.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      trail.classList.remove('hover');
    });
  });
}

// ============= SCROLL PROGRESS =============
const progress = document.querySelector('.progress');
const updateProgress = () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  progress.style.width = scrolled + '%';
};
window.addEventListener('scroll', updateProgress, { passive: true });

// ============= REVEAL ON SCROLL =============
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ============= STAT COUNTERS =============
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const dur = 1600;
      const start = performance.now();
      const ease = (t) => 1 - Math.pow(1 - t, 3);
      const tick = (now) => {
        const t = Math.min((now - start) / dur, 1);
        const locale = root.getAttribute('lang') === 'en' ? 'en-US' : 'pl-PL';
        el.textContent = Math.floor(target * ease(t)).toLocaleString(locale) + (t === 1 ? suffix : '');
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

// ============= MASTERS DATA =============
const MASTERS = [
  {
    name: 'Symonides z Keos',
    nameEn: 'Simonides of Ceos',
    dates: '~556 — ~468 p.n.e.',
    tag: { pl: 'Odkrywca metody loci', en: 'Discoverer of method of loci' },
    bio: {
      pl: 'Grecki poeta liryczny. Według Cycerona to on odkrył metodę loci po katastrofie sali biesiadnej u tessalskiego arystokraty Skopasa. Identyfikował zmiażdżone ciała, pamiętając, gdzie kto siedział. Z tego doświadczenia narodziła się sztuka pamięci — i dwie zasady, które do dziś stanowią rdzeń mnemoniki: lokalizacja i obrazy.',
      en: 'Greek lyric poet. According to Cicero, he discovered the method of loci after the collapse of Scopas\'s banquet hall. He identified the crushed bodies by remembering where each guest sat. From that experience the art of memory was born — and two principles still at the core of mnemonics: location and images.'
    },
    tags: { pl: ['loci', 'starożytność'], en: ['loci', 'antiquity'] }
  },
  {
    name: 'Cyceron',
    nameEn: 'Cicero',
    dates: { pl: '106 — 43 p.n.e.', en: '106 — 43 BCE' },
    tag: { pl: 'Pamięć w retoryce', en: 'Memory in rhetoric' },
    bio: {
      pl: 'Największy mówca Rzymu. W De Oratore systematycznie omawia memoria jako jeden z pięciu kanonów wymowy. Nazywał pamięć "skarbcem wszystkich rzeczy" (thesaurum rerum omnium). Dzięki niemu metoda loci stała się oficjalną dyscypliną edukacyjną świata rzymskiego.',
      en: 'Rome\'s greatest orator. In De Oratore he systematically treats memoria as one of the five canons of speech. He called memory the "treasury of all things". Thanks to him the method of loci became an official educational discipline of the Roman world.'
    },
    tags: { pl: ['retoryka', 'starożytność'], en: ['rhetoric', 'antiquity'] }
  },
  {
    name: 'Tomasz z Akwinu',
    nameEn: 'Thomas Aquinas',
    dates: { pl: '1225 — 1274', en: '1225 — 1274' },
    tag: { pl: 'Pamięć jako cnota', en: 'Memory as virtue' },
    bio: {
      pl: 'Dominikanin, teolog. W Summie teologicznej omawia pamięć jako część cnoty roztropności (prudentia). Włącza zasady Ad Herennium do kanonu nauczania klasztornego. Daje cztery zasady mnemoniki: konwersja abstraktu na obraz, porządek, skupienie, częste rozważanie.',
      en: 'Dominican, theologian. In the Summa Theologica he treats memory as part of the virtue of prudentia. Brings Ad Herennium into the canon of monastic teaching. Four principles: convert abstract to image, order, concentration, frequent meditation.'
    },
    tags: { pl: ['średniowiecze', 'cnota'], en: ['medieval', 'virtue'] }
  },
  {
    name: 'Giulio Camillo',
    nameEn: 'Giulio Camillo',
    dates: { pl: '~1480 — 1544', en: '~1480 — 1544' },
    tag: { pl: 'Teatr pamięci', en: 'Theatre of memory' },
    bio: {
      pl: 'Włoski filozof i kabalista. Stworzył L\'Idea del Teatro — fizyczną drewnianą konstrukcję w kształcie odwróconego amfiteatru. Wewnątrz, na siedmiu poziomach (planety) i siedmiu pionach (sephiroth), umieścił setki obrazów reprezentujących całość wiedzy. Pokazał konstrukcję królowi Francji Franciszkowi I.',
      en: 'Italian philosopher and Kabbalist. Created L\'Idea del Teatro — a physical wooden construction in the form of an inverted amphitheatre. On seven levels (planets) and seven verticals (sephiroth) he placed hundreds of images representing the totality of knowledge. Demonstrated it to King Francis I of France.'
    },
    tags: { pl: ['renesans', 'teatr'], en: ['renaissance', 'theatre'] }
  },
  {
    name: 'Giordano Bruno',
    nameEn: 'Giordano Bruno',
    dates: { pl: '1548 — 1600', en: '1548 — 1600' },
    tag: { pl: 'Hermetyczna sztuka pamięci', en: 'Hermetic art of memory' },
    bio: {
      pl: 'Najradykalniejsza postać w historii sztuki pamięci. Spalony żywcem na Campo de\' Fiori 17 lutego 1600 roku. Dla Bruna mnemotechnika nie była ani sportem, ani retoryką — była drogą hermetycznej transformacji. Jego koła pamięci antycypują Leibniza i współczesną kombinatorykę. Pełna monografia w sekcji 13 kompendium.',
      en: 'The most radical figure in the history of the art of memory. Burned alive on Campo de\' Fiori on 17 February 1600. For Bruno mnemonics was neither sport nor rhetoric — it was a path of hermetic transformation. His memory wheels anticipate Leibniz and modern combinatorics. Full monograph in section 13 of the compendium.'
    },
    tags: { pl: ['renesans', 'hermetyzm', 'koła pamięci'], en: ['renaissance', 'hermetic', 'wheels'] }
  },
  {
    name: 'Matteo Ricci',
    nameEn: 'Matteo Ricci',
    dates: { pl: '1552 — 1610', en: '1552 — 1610' },
    tag: { pl: 'Pałac w Chinach', en: 'Palace in China' },
    bio: {
      pl: 'Włoski jezuita-misjonarz w Chinach od 1582 roku. By zdobyć szacunek chińskich uczonych, opanował znaki konfucjańskie używając klasycznej rzymskiej metody loci. Spisał mnemoniczny podręcznik dla swoich uczniów (Xiguo jifa, 1596). Jego życie opisał Jonathan Spence w The Memory Palace of Matteo Ricci.',
      en: 'Italian Jesuit missionary in China from 1582. To win Chinese scholars\' respect he mastered Confucian characters using the Roman method of loci. Wrote a mnemonic manual for his students (Xiguo jifa, 1596). His life was described by Jonathan Spence in The Memory Palace of Matteo Ricci.'
    },
    tags: { pl: ['renesans', 'misjonarz'], en: ['renaissance', 'missionary'] }
  },
  {
    name: 'Solomon Szereszewski',
    nameEn: 'Solomon Shereshevsky',
    dates: { pl: '1886 — 1958', en: '1886 — 1958' },
    tag: { pl: 'Pamięć jako przekleństwo', en: 'Memory as curse' },
    bio: {
      pl: 'Pacjent neuropsychologa Aleksandra Łurii. Synesteta — słowa wywoływały u niego kolory, dźwięki, smaki. Pamiętał wszystko. I — paradoksalnie — z trudem funkcjonował: nie potrafił myśleć abstrakcyjnie, każde słowo wywoływało kaskadę obrazów. Łuria opisał go w Umyśle mnemonisty (1968) — klasyku pokazującym, że pamięć doskonała byłaby przekleństwem.',
      en: 'Patient of neuropsychologist Alexander Luria. Synaesthete — words triggered colours, sounds, tastes. Remembered everything. And — paradoxically — could barely function: he could not think abstractly. Luria described him in The Mind of a Mnemonist (1968) — a classic showing that perfect memory would be a curse.'
    },
    tags: { pl: ['współczesność', 'nauka'], en: ['modern', 'science'] }
  },
  {
    name: 'Akira Haraguchi',
    nameEn: 'Akira Haraguchi',
    dates: { pl: 'ur. 1946', en: 'b. 1946' },
    tag: { pl: '100 000 cyfr π', en: '100,000 digits of π' },
    bio: {
      pl: 'Japoński emerytowany inżynier. 3 października 2006 wyrecytował 100 000 cyfr π w 16 godzin. Jego metoda: zamienia każdą cyfrę na sylabę kana i z sylab tworzy historie. Cały π to dla niego epicka opowieść.',
      en: 'Japanese retired engineer. On 3 October 2006 he recited 100,000 digits of π in 16 hours. His method: converts each digit to a kana syllable and builds stories. The whole π is for him an epic narrative.'
    },
    tags: { pl: ['współczesność', 'π', 'rekordy'], en: ['modern', 'pi', 'records'] }
  },
  {
    name: 'Piotr Woźniak',
    nameEn: 'Piotr Woźniak',
    dates: { pl: 'ur. 1962', en: 'b. 1962' },
    tag: { pl: 'Twórca SuperMemo', en: 'Creator of SuperMemo' },
    bio: {
      pl: 'Polski wkład w światową naukę uczenia się. Student informatyki UAM w Poznaniu. W 1985 roku zaczął pracować nad systemem fiszek z optymalnymi odstępami. Algorytm SM-2 (1987) leży u podstaw większości aplikacji do nauki ze fiszkami — w tym Anki. Bez Woźniaka nie byłoby spaced repetition w obecnej formie.',
      en: 'Poland\'s contribution to global learning science. Computer-science student at AMU in Poznań. In 1985 began work on a flashcard system with optimal intervals. The SM-2 algorithm (1987) underlies most current spaced-repetition apps — including Anki. Without Woźniak there would be no spaced repetition as we know it.'
    },
    tags: { pl: ['współczesność', 'polski', 'powtórki rozproszone'], en: ['modern', 'polish', 'spaced repetition'] }
  },
  {
    name: 'Tony Buzan',
    nameEn: 'Tony Buzan',
    dates: { pl: '1942 — 2019', en: '1942 — 2019' },
    tag: { pl: 'Mapy myśli', en: 'Mind maps' },
    bio: {
      pl: 'Brytyjski popularyzator. Wynalazca i ewangelista map myśli. Założyciel Mistrzostw Świata Pamięci w 1991 roku. Autor ponad 80 książek (Use Your Head, The Mind Map Book). Bez Buzana nie byłoby memory sports w obecnej formie.',
      en: 'British populariser. Inventor and evangelist of mind maps. Founder of the World Memory Championships in 1991. Author of over 80 books. Without Buzan there would be no memory sport in its current form.'
    },
    tags: { pl: ['współczesność', 'mapy myśli'], en: ['modern', 'mind maps'] }
  },
  {
    name: 'Dominic O\'Brien',
    nameEn: 'Dominic O\'Brien',
    dates: { pl: 'ur. 1957', en: 'b. 1957' },
    tag: { pl: '8× mistrz świata', en: '8× world champion' },
    bio: {
      pl: 'Brytyjczyk, ośmiokrotny mistrz świata pamięci (1991—2001 z przerwami). Twórca systemu Dominic dla liczb i kart. Zapamiętał 2 808 kart (54 talie) po jednym oglądnięciu każdej (2002). Autor How to Develop a Perfect Memory.',
      en: 'British, 8-time world memory champion (1991—2001 with breaks). Creator of the Dominic system for numbers and cards. Memorized 2,808 cards (54 decks) after a single viewing of each (2002). Author of How to Develop a Perfect Memory.'
    },
    tags: { pl: ['współczesność', 'mistrz', 'rekordy'], en: ['modern', 'champion', 'records'] }
  },
  {
    name: 'Joshua Foer',
    nameEn: 'Joshua Foer',
    dates: { pl: 'ur. 1982', en: 'b. 1982' },
    tag: { pl: 'Reportaż roku 2011', en: '2011 reportage' },
    bio: {
      pl: 'Amerykański dziennikarz. Pisał reportaż o mistrzostwach pamięci — i wpadł w króliczą norę. Po roku treningu wygrał USA Memory Championship 2006. Książka Moonwalking with Einstein (2011) stała się bestsellerem i spopularyzowała mnemotechnikę dla milionów. Centralna teza: nie jesteśmy wyjątkowi, tylko wyćwiczeni.',
      en: 'American journalist. Was writing a reportage on memory championships — and fell down the rabbit hole. After a year of training he won the USA Memory Championship 2006. The book Moonwalking with Einstein (2011) became a bestseller. Central thesis: we are not exceptional, just trained.'
    },
    tags: { pl: ['współczesność', 'mistrz', 'popularyzacja'], en: ['modern', 'champion', 'popular'] }
  }
];

// Localize the first master too (Symonides)
MASTERS[0].dates = { pl: '~556 — ~468 p.n.e.', en: '~556 — ~468 BCE' };

const mastersGrid = document.getElementById('mastersGrid');
const lang = () => root.getAttribute('lang') || 'pl';

const renderMasters = () => {
  const L = lang();
  mastersGrid.innerHTML = MASTERS.map((m, i) => `
    <div class="master-card" data-idx="${i}">
      <div>
        <div class="mc-num">${String(i + 1).padStart(2, '0')}</div>
        <div class="mc-name">${L === 'pl' ? m.name : m.nameEn}</div>
        <div class="mc-dates">${typeof m.dates === 'object' ? m.dates[L] : m.dates}</div>
      </div>
      <div>
        <div class="mc-tag">${m.tag[L]}</div>
        <div class="mc-arrow">→</div>
      </div>
    </div>
  `).join('');

  mastersGrid.querySelectorAll('.master-card').forEach(card => {
    card.addEventListener('click', () => openMasterModal(parseInt(card.dataset.idx, 10)));
  });
};
renderMasters();

// ============= MODAL =============
const modal = document.getElementById('masterModal');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');
const modalBackdrop = modal.querySelector('.modal-backdrop');

const openMasterModal = (idx) => {
  const m = MASTERS[idx];
  const L = lang();
  const dates = typeof m.dates === 'object' ? m.dates[L] : m.dates;
  const tags = Array.isArray(m.tags) ? m.tags : (m.tags[L] || []);
  modalContent.innerHTML = `
    <h3>${L === 'pl' ? m.name : m.nameEn}</h3>
    <div class="modal-dates">${dates}</div>
    <p>${m.bio[L]}</p>
    <div class="modal-tags">${tags.map(t => `<span class="modal-tag">${t}</span>`).join('')}</div>
  `;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
};
const closeModal = () => {
  modal.classList.remove('open');
  document.body.style.overflow = '';
};
modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
});

// ============= TECHNIQUES =============
const LEVEL_LABEL = {
  beginner: { pl: 'początek', en: 'beginner' },
  intermediate: { pl: 'średnio', en: 'intermediate' },
  advanced: { pl: 'zaawansowane', en: 'advanced' }
};
const USE_LABEL = {
  lists: { pl: 'listy', en: 'lists' },
  numbers: { pl: 'liczby', en: 'numbers' },
  language: { pl: 'języki', en: 'languages' }
};

const TECHNIQUES = [
  { name: { pl: 'Pałac pamięci', en: 'Memory palace' }, desc: { pl: 'Umieść informacje wzdłuż ścieżki w znanej przestrzeni. Najsilniejsza klasyczna technika.', en: 'Place information along a path in a familiar space. The strongest classical technique.' }, level: 'intermediate', uses: ['lists'], time: { pl: '15 min', en: '15 min' } },
  { name: { pl: 'Łańcuch skojarzeń', en: 'Link method' }, desc: { pl: 'Zbuduj absurdalną historię łączącą kolejne elementy listy.', en: 'Build an absurd story linking the next list items.' }, level: 'beginner', uses: ['lists'], time: { pl: '5 min', en: '5 min' } },
  { name: { pl: 'Akronimy', en: 'Acronyms' }, desc: { pl: 'Słowo lub zdanie z pierwszych liter listy. NEFROZA dla trasy podróży.', en: 'A word or sentence from first letters. Simple and durable.' }, level: 'beginner', uses: ['lists'], time: { pl: '2 min', en: '2 min' } },
  { name: { pl: 'Rymy', en: 'Rhymes' }, desc: { pl: 'Rytm i rym wzmacniają zapamiętanie. Tradycja kultur bezpiśmiennych.', en: 'Rhythm and rhyme reinforce retention. Tradition of oral cultures.' }, level: 'beginner', uses: ['lists'], time: { pl: '5 min', en: '5 min' } },
  { name: { pl: 'System zakładkowy', en: 'Peg system' }, desc: { pl: 'Hak (peg) dla każdej cyfry — number-shape lub number-rhyme. Wieszasz na nim listę.', en: 'A hook for each digit — number-shape or number-rhyme. Hang lists on it.' }, level: 'intermediate', uses: ['numbers', 'lists'], time: { pl: 'tydzień', en: '1 week' } },
  { name: { pl: 'System Major', en: 'Major system' }, desc: { pl: 'Cyfra → spółgłoska → słowo → obraz. Najpotężniejsza technika dla liczb.', en: 'Digit → consonant → word → image. The most powerful for numbers.' }, level: 'advanced', uses: ['numbers'], time: { pl: 'miesiąc', en: '1 month' } },
  { name: { pl: 'System Dominic', en: 'Dominic system' }, desc: { pl: 'Cyfra → litera → osoba + akcja. Stworzony przez 8× mistrza świata.', en: 'Digit → letter → person + action. Created by an 8× world champion.' }, level: 'advanced', uses: ['numbers'], time: { pl: 'miesiąc', en: '1 month' } },
  { name: { pl: 'PAO', en: 'PAO' }, desc: { pl: 'Osoba-Akcja-Obiekt dla 00–99. Standard zawodowy memory sports.', en: 'Person-Action-Object for 00–99. Memory sport professional standard.' }, level: 'advanced', uses: ['numbers'], time: { pl: '2 miesiące', en: '2 months' } },
  { name: { pl: 'Linkword (klucz)', en: 'Linkword' }, desc: { pl: 'Klucz dźwiękowy + obraz = słowo obcojęzyczne. Metoda Gruneberga.', en: 'Sound key + image = foreign word. Gruneberg\'s method.' }, level: 'beginner', uses: ['language'], time: { pl: '10 min', en: '10 min' } },
  { name: { pl: 'Mapy myśli', en: 'Mind maps' }, desc: { pl: 'Wizualne notowanie radialne. Centralny temat, gałęzie, kolory, ikony.', en: 'Radial visual note-taking. Central topic, branches, colours, icons.' }, level: 'beginner', uses: ['lists'], time: { pl: '15 min', en: '15 min' } },
  { name: { pl: 'Powtórki rozproszone', en: 'Spaced repetition' }, desc: { pl: 'Powtórki w rosnących odstępach. Anki, SuperMemo. +30% nad wkuwaniem.', en: 'Reviews at expanding intervals. Anki, SuperMemo. +30% over cramming.' }, level: 'beginner', uses: ['language', 'numbers', 'lists'], time: { pl: '15 min / dzień', en: '15 min / day' } },
  { name: { pl: 'Aktywne odzyskiwanie', en: 'Active recall' }, desc: { pl: 'Zamknij książkę i wypisz, co pamiętasz. +50% po tygodniu.', en: 'Close the book and write what you remember. +50% after a week.' }, level: 'beginner', uses: ['language', 'lists'], time: { pl: '10 min', en: '10 min' } }
];

const techniquesGrid = document.getElementById('techniquesGrid');
const renderTechniques = (filter = 'all') => {
  const L = lang();
  const items = TECHNIQUES.filter(t =>
    filter === 'all' ||
    t.level === filter ||
    (t.uses && t.uses.includes(filter))
  );
  techniquesGrid.innerHTML = items.map(t => `
    <div class="technique" data-level="${t.level}">
      <div class="tech-eyebrow">
        <span>${LEVEL_LABEL[t.level][L]}</span>
        <span>${t.time[L]}</span>
      </div>
      <h3 class="tech-name">${t.name[L]}</h3>
      <p class="tech-desc">${t.desc[L]}</p>
      <div class="tech-meta">
        ${(t.uses || []).map(u => `<span class="tech-meta-item">${USE_LABEL[u][L]}</span>`).join('')}
      </div>
    </div>
  `).join('');
};
renderTechniques();

document.querySelectorAll('.filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderTechniques(btn.dataset.filter);
  });
});

// re-render on language change
document.addEventListener('mnemo-lang-change', () => {
  renderMasters();
  const activeFilter = document.querySelector('.filter.active');
  renderTechniques(activeFilter ? activeFilter.dataset.filter : 'all');
});

// ============= BRUNO WHEEL =============
const wheelSpin = document.getElementById('wheelSpin');
const wheelReset = document.getElementById('wheelReset');
const wheelOutput = document.getElementById('wheelOutput');
const brunoWheel = document.getElementById('brunoWheel');

const OUTER_LETTERS = ['A','B','C','D','E','F','G','H','I','L','M','N','O','P','Q','R','S','T','V','X','Y','Z','Α','Β','Γ','Δ','Ε','Ζ','Η','Θ'];
const MID_SIGNS = ['☉','☽','☿','♀','♂','♃','♄','♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','⚹','☄','★'];
const INNER_FIGURES = ['▲','▼','◆','●','■','○','△','▽','◇','□','▢','⬢'];

const FIGURE_NAMES = {
  pl: { '▲': 'Apollo (góra)', '▼': 'Diana (dół)', '◆': 'Saturn (czas)', '●': 'Słońce (jedność)', '■': 'Ziemia (substancja)', '○': 'Księżyc (zmiana)', '△': 'Ogień (ruch)', '▽': 'Woda (przepływ)', '◇': 'Powietrze (myśl)', '□': 'Materia (porządek)', '▢': 'Forma (granica)', '⬢': 'Eter (wszechświat)' },
  en: { '▲': 'Apollo (mountain)', '▼': 'Diana (depth)', '◆': 'Saturn (time)', '●': 'Sun (unity)', '■': 'Earth (substance)', '○': 'Moon (change)', '△': 'Fire (motion)', '▽': 'Water (flow)', '◇': 'Air (thought)', '□': 'Matter (order)', '▢': 'Form (limit)', '⬢': 'Aether (universe)' }
};

wheelSpin.addEventListener('click', () => {
  brunoWheel.classList.add('spinning');
  setTimeout(() => {
    brunoWheel.classList.remove('spinning');
    const letter = OUTER_LETTERS[Math.floor(Math.random() * OUTER_LETTERS.length)];
    const sign = MID_SIGNS[Math.floor(Math.random() * MID_SIGNS.length)];
    const figure = INNER_FIGURES[Math.floor(Math.random() * INNER_FIGURES.length)];
    const L = lang();
    const figName = FIGURE_NAMES[L][figure] || figure;
    wheelOutput.textContent = `${letter} · ${sign} · ${figName}`;
  }, 1600);
});

wheelReset.addEventListener('click', () => {
  wheelOutput.textContent = wheelOutput.getAttribute('data-' + lang());
});

// ============= KEYBOARD SHORTCUTS =============
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;

  const sectionMap = {
    '1': '#manifesto',
    '2': '#principles',
    '3': '#timeline',
    '4': '#masters',
    '5': '#bruno',
    '6': '#techniques',
    '7': '#ages',
    '8': '#compendium'
  };

  if (sectionMap[e.key]) {
    document.querySelector(sectionMap[e.key])?.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  if (e.key === 'l' || e.key === 'L') {
    langToggle.click();
    return;
  }
  if (e.key === 't' || e.key === 'T') {
    themeToggle.click();
    return;
  }
  if (e.key === 'g' || e.key === 'G') {
    window.location.href = 'games/';
    return;
  }
  if (e.key === 'h' || e.key === 'H') {
    document.querySelector('#hero')?.scrollIntoView({ behavior: 'smooth' });
    return;
  }
});

// ============= INIT =============
console.log('%cMNEMO', 'font-family: serif; font-size: 32px; color: #c8401f; letter-spacing: 0.1em;');
console.log('%cTeatr pamięci · Theatre of memory', 'font-style: italic; color: #b8924a;');
console.log('%cKeyboard: 1—8 sections · L lang · T theme · G game · H home · ESC close modal', 'font-family: monospace; font-size: 11px;');

})();
