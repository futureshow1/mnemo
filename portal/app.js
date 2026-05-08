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
  {
    icon: '⌂',
    name: { pl: 'Pałac pamięci', en: 'Memory palace' },
    desc: { pl: 'Umieść informacje wzdłuż ścieżki w znanej przestrzeni. Najsilniejsza klasyczna technika.', en: 'Place information along a path in a familiar space. The strongest classical technique.' },
    principle: { pl: 'Lokalizacja jest najmocniejszym mnemonicznym katalizatorem — pamięć przestrzenna ewoluowała 200 mln lat, pamięć symboliczna kilkadziesiąt tysięcy.', en: 'Location is the strongest mnemonic catalyst — spatial memory evolved 200 million years; symbolic memory only tens of thousands.' },
    howTo: {
      pl: ['Wybierz znaną przestrzeń (mieszkanie, droga do pracy, szkoła z dzieciństwa).', 'Określ stałą trasę: 10–20 punktów (loci) w niezmiennej kolejności.', 'Dla każdego elementu do zapamiętania stwórz żywy, absurdalny obraz mentalny.', 'Umieść każdy obraz w kolejnym locusie wzdłuż trasy.', 'Przy odzyskiwaniu — przejdź mentalnie po trasie i odczytaj obrazy.'],
      en: ['Choose a familiar space (home, commute, childhood school).', 'Define a fixed route: 10–20 stations (loci) in invariable order.', 'For each item to memorize create a vivid, absurd mental image.', 'Place each image at the next locus along the route.', 'To recall — walk the route mentally and read off the images.']
    },
    example: { pl: 'Lista 10 zakupów: wchodzisz do mieszkania, na półce na buty siedzi gigantyczna pomarańcza grająca na tubie (mleko); na lampie wisi bekon obwiązany sznurkiem (szynka); na fotelu rozparła się głowa kapusty czytająca gazetę (kapusta) — i tak dalej, aż do dziesiątego loci.', en: 'A 10-item shopping list: you enter the flat, on the shoe rack sits a giant orange playing a tuba (milk); on the lamp hangs bacon tied with twine (ham); in the armchair sprawls a cabbage head reading the paper (cabbage) — and so on, through ten loci.' },
    whenToUse: { pl: 'Dłuższe listy (10+ pozycji), wystąpienia publiczne (wzór cyceroński), egzaminy z dużą ilością pojęć, sekwencje wymagające trzymania kolejności.', en: 'Longer lists (10+ items), public speeches (Cicero\'s original use), exams with many concepts, sequences requiring strict order.' },
    origin: { pl: 'Symonides z Keos (~500 p.n.e.) — odkrył metodę po katastrofie sali biesiadnej u Skopasa. Rhetorica ad Herennium (~90 p.n.e.) — pierwszy traktat techniczny. Cyceron, Kwintylian, Tomasz z Akwinu, Camillo, Bruno — kanon dwóch i pół tysiąca lat.', en: 'Simonides of Ceos (~500 BCE) — discovered the method after the collapse of Scopas\'s banquet hall. Rhetorica ad Herennium (~90 BCE) — first technical treatise. Cicero, Quintilian, Aquinas, Camillo, Bruno — a canon two and a half thousand years long.' },
    pitfalls: { pl: 'Zbyt podobne loci się mieszają. Obrazy zbyt subtelne giną. Używanie tej samej trasy do różnych list — interferencja (potrzebujesz minimum 3–5 osobnych pałaców).', en: 'Loci too similar blur into each other. Images too subtle vanish. Reusing the same route for different lists causes interference — you need at least 3–5 separate palaces.' },
    level: 'intermediate', uses: ['lists'], time: { pl: '15 min', en: '15 min' }
  },
  {
    icon: '∞',
    name: { pl: 'Łańcuch skojarzeń', en: 'Link method' },
    desc: { pl: 'Zbuduj absurdalną historię łączącą kolejne elementy listy.', en: 'Build an absurd story linking the next list items.' },
    principle: { pl: 'Narracja przekształca odizolowane fakty w sieć zależności — a sieć trudniej zapomnieć niż węzeł.', en: 'Narrative turns isolated facts into a network of dependencies — and networks are harder to forget than nodes.' },
    howTo: {
      pl: ['Pierwszy element wyobraź sobie jako żywy obraz.', 'Połącz go akcją z drugim elementem (interakcja, kolizja, transformacja).', 'Drugi z trzecim — kontynuuj łańcuch.', 'Zasada żelazna: ruch + emocja + absurd. Statyczne obrazy nie chwytają.', 'Przy odzyskiwaniu — odtwórz pierwszy obraz, łańcuch sam się ciągnie.'],
      en: ['Picture the first item as a vivid image.', 'Link it through action to the second item (interaction, collision, transformation).', 'Second to third — continue the chain.', 'Iron rule: motion + emotion + absurdity. Static images do not stick.', 'To recall — summon the first image, the chain pulls itself along.']
    },
    example: { pl: 'Zapamiętaj: chleb, rower, pomidor, kapelusz. Bochenek chleba PEDAŁUJE na rowerze. Rower przebił kołem GIGANTYCZNEGO pomidora. Pomidor założył KAPELUSZ z plasterka. Cztery elementy w jednej krótkiej historii.', en: 'Memorize: bread, bicycle, tomato, hat. A loaf of bread PEDALS on a bicycle. The bicycle\'s wheel pierces a GIANT tomato. The tomato puts on a HAT made of a slice of itself. Four items in one short story.' },
    whenToUse: { pl: 'Krótkie listy (do 7–10 elementów), szybkie zapamiętanie bez trasy, pierwsza technika dla dzieci, opowiadanie żartów i anegdot.', en: 'Short lists (up to 7–10 items), quick memorization without a route, first technique for children, telling jokes and anecdotes.' },
    origin: { pl: 'Tradycja ustna starożytna — szamani, bardowie, gawędziarze. Spopularyzowana w XX wieku przez Harry\'ego Lorayne\'a (The Memory Book, 1974).', en: 'Ancient oral tradition — shamans, bards, storytellers. Popularized in the 20th century by Harry Lorayne (The Memory Book, 1974).' },
    pitfalls: { pl: 'Zerwanie ogniwa = zerwanie reszty łańcucha. Słabsze niż pałac dla list 15+. Wymaga praktyki w generowaniu absurdalnych obrazów na żądanie.', en: 'A broken link breaks the rest of the chain. Weaker than the palace for lists of 15+. Requires practice generating absurd images on demand.' },
    level: 'beginner', uses: ['lists'], time: { pl: '5 min', en: '5 min' }
  },
  {
    icon: 'A',
    name: { pl: 'Akronimy', en: 'Acronyms' },
    desc: { pl: 'Słowo lub zdanie z pierwszych liter listy. NEFROZA dla trasy podróży.', en: 'A word or sentence from first letters. Simple and durable.' },
    principle: { pl: 'Jeden krótki znak (słowo lub zdanie) staje się indeksem wielu — kompresja informacji bez utraty kolejności.', en: 'One short token (word or sentence) becomes an index to many — information compression without loss of order.' },
    howTo: {
      pl: ['Weź pierwsze litery elementów listy w odpowiedniej kolejności.', 'Ułóż z nich słowo (akronim) lub zdanie (akrostych).', 'Zapamiętaj samo słowo / zdanie — jest twardym kotwiczeniem.', 'Każda litera odsyła do oryginalnego elementu listy.', 'Ćwicz w obie strony: lista → akronim → lista.'],
      en: ['Take the first letters of the list items in proper order.', 'Form a word (acronym) or sentence (acrostic) from them.', 'Memorize the word / sentence — it is a hard anchor.', 'Each letter points back to the original list item.', 'Practice both directions: list → acronym → list.']
    },
    example: { pl: 'Kolejność planet od Słońca: Merkury, Wenus, Ziemia, Mars, Jowisz, Saturn, Uran, Neptun → „MoJa Wesoła Ziemia Mama Jest Świetną Uroczą Niewiastą". Kolory tęczy: ROYGBIV (Red, Orange, Yellow, Green, Blue, Indigo, Violet). Podział królestw biologii: KFGHRGS (Królestwo, Filum, Gromada, Hipertyp, Rząd, Gatunek, Szczep).', en: 'Order of planets from the Sun: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune → „My Very Educated Mother Just Served Us Noodles". Colors of the rainbow: ROYGBIV (Red, Orange, Yellow, Green, Blue, Indigo, Violet).' },
    whenToUse: { pl: 'Krótkie sekwencje 4–10 elementów, terminologia techniczna, klucze diagnostyczne (medycyna ABCDE), procedury awaryjne.', en: 'Short sequences of 4–10 items, technical terminology, diagnostic keys (medical ABCDE), emergency procedures.' },
    origin: { pl: 'Tradycja retoryczna od starożytności (Cyceron stosował akrostychy w mowach). W średniowieczu — łacińskie wierszyki mnemoniczne dla studentów uniwersyteckich. W XX wieku eksplozja w branżach wojskowych i medycznych.', en: 'Rhetorical tradition since antiquity (Cicero used acrostics in speeches). In the Middle Ages — Latin mnemonic verses for university students. In the 20th century, an explosion in military and medical fields.' },
    pitfalls: { pl: 'Trudno zbudować akronim z 15+ liter. Kolejność musi być stała — jeśli się zmienia, akronim staje się bezużyteczny. Niektóre kombinacje liter nie tworzą zapadających słów.', en: 'Hard to build an acronym from 15+ letters. Order must be fixed — if it shifts, the acronym becomes useless. Some letter combinations form no memorable word.' },
    level: 'beginner', uses: ['lists'], time: { pl: '2 min', en: '2 min' }
  },
  {
    icon: '♪',
    name: { pl: 'Rymy', en: 'Rhymes' },
    desc: { pl: 'Rytm i rym wzmacniają zapamiętanie. Tradycja kultur bezpiśmiennych.', en: 'Rhythm and rhyme reinforce retention. Tradition of oral cultures.' },
    principle: { pl: 'Mózg traktuje rytmiczny tekst inaczej niż prozę: aktywuje korę słuchową, przedczołową i ośrodki nagrody. Stąd 50 000 lat skuteczności pieśni epickich.', en: 'The brain processes rhythmic text differently from prose: it activates auditory cortex, prefrontal cortex, and reward centers. Hence 50,000 years of effective epic song.' },
    howTo: {
      pl: ['Wpleć dane w rymowany dwuwiersz lub czterowiersz.', 'Im prostszy rytm (jamb, trochej), tym łatwiej.', 'Recytuj na głos — udział mięśni krtani wzmacnia ślad.', 'Przyjmij rymowanie nawet niedoskonałe: brzmienie ważniejsze niż czystość rymu.', 'Wracaj do wierszyka co kilka dni — tak jak do piosenki.'],
      en: ['Weave the data into a rhymed couplet or quatrain.', 'The simpler the rhythm (iamb, trochee), the easier.', 'Recite aloud — engaging the larynx muscles deepens the trace.', 'Accept imperfect rhymes — sound matters more than purity.', 'Return to the verse every few days — like to a song.']
    },
    example: { pl: '„Pamiętaj chemiku młody, wlewaj zawsze kwas do wody". W historii: „Bitwa pod Grunwaldem? Lipiec, czternaście-dziesięć". W ortografii: „Może, że, ale i również — pisz oddzielnie konsekwentnie". Najsłynniejsza polska mnemonika: dni miesiąca w „Trzydzieści dni ma listopad…".', en: '„Thirty days hath September, April, June, and November". For chemistry: „Always do as you oughta, add the acid to the water". For history: „In fourteen hundred ninety-two, Columbus sailed the ocean blue".' },
    whenToUse: { pl: 'Dzieci uczące się dat, zasad, list. Reguły gramatyczne, ortograficzne, matematyczne. Kluczowe daty historyczne. Pierwsze dziesięć cyfr jakiegoś ciągu.', en: 'Children learning dates, rules, lists. Grammar, spelling, math rules. Key historical dates. The first ten digits of some sequence.' },
    origin: { pl: 'Najstarsza technika ludzkości — Iliada, Odyseja, polska Bogurodzica, indyjska Mahabharata przekazywano ustnie przez stulecia dzięki rytmowi i rymowi. Średniowieczne wierszyki łacińskie dla studentów. Tony Buzan przywrócił rangę w XX w.', en: 'Humanity\'s oldest technique — the Iliad, Odyssey, Mahabharata were transmitted orally for centuries thanks to rhythm and rhyme. Medieval Latin verses for students. Tony Buzan restored its standing in the 20th century.' },
    pitfalls: { pl: 'Nie każdy materiał daje się zrymować. Rymy zbyt prostackie wiotczeją; zbyt finezyjne — trudne do zapamiętania. Mogą wprowadzać nieścisłości w treści (rym wymusza słowo).', en: 'Not all material rhymes well. Too crude rhymes wilt; too elegant ones are hard to memorize. They may introduce inaccuracies (the rhyme forces the word).' },
    level: 'beginner', uses: ['lists'], time: { pl: '5 min', en: '5 min' }
  },
  {
    icon: '№',
    name: { pl: 'System zakładkowy', en: 'Peg system' },
    desc: { pl: 'Hak (peg) dla każdej cyfry — number-shape lub number-rhyme. Wieszasz na nim listę.', en: 'A hook for each digit — number-shape or number-rhyme. Hang lists on it.' },
    principle: { pl: 'Stała tablica 10 (lub 100) obrazów-haków stanowi „mentalny szkielet": każda nowa lista zostaje na nim zawieszona w stałej kolejności numerycznej.', en: 'A fixed table of 10 (or 100) image-hooks is a „mental skeleton": every new list hangs on it in fixed numeric order.' },
    howTo: {
      pl: ['Wybierz typ haka. Number-shape: 1=świeca, 2=łabędź, 3=serce, 4=żaglówka, 5=hak, 6=słoń (trąba), 7=topór, 8=bałwan, 9=balon, 10=kij i piłka. Albo number-rhyme: 1=bun, 2=shoe, 3=tree.', 'Naucz się 10 haków na pamięć — automat w 2–3 dni.', 'Dla każdego elementu listy stwórz obraz łączący peg z elementem.', 'Łącz peg z treścią przez akcję, nie samym sąsiedztwem.', 'Przy odzyskiwaniu: mów „jeden, dwa, trzy…" — peg wywoła obraz.'],
      en: ['Choose hook type. Number-shape: 1=candle, 2=swan, 3=heart, 4=sailboat, 5=hook, 6=elephant (trunk), 7=axe, 8=snowman, 9=balloon, 10=bat and ball. Or number-rhyme: 1=bun, 2=shoe, 3=tree.', 'Memorize 10 hooks — auto in 2–3 days.', 'For each list item create an image linking peg + item.', 'Link peg to content through action, not mere adjacency.', 'To recall: count „one, two, three…" — the peg fires the image.']
    },
    example: { pl: 'Lista zakupów (number-shape): 1=świeca w mleku (świeca topi się w kubku mleka). 2=łabędź gryzie chleb. 3=serce z sera (zamiast podarunku — serek-serce). Zaleta: wiesz, że to czwarty element jest „ser" — bo 3=serce.', en: 'Shopping list (number-shape): 1=candle melting in milk. 2=swan biting bread. 3=cheese-heart (instead of a gift — cheese shaped like a heart). The benefit: you know which item is „third" — because 3=heart.' },
    whenToUse: { pl: 'Listy gdzie trzeba odpowiedzieć na pytanie „co jest siódme na liście?". Codzienne plany dnia (1–10 zadań). Pierwszy krok przed pałacem.', en: 'Lists where you must answer „what is item seven?". Daily to-do plans (1–10 tasks). A first step before the palace.' },
    origin: { pl: 'Henry Herdson (Anglia, XVII w.) — number-rhyme. Stanislaus Mink von Wennsshein (1648) — wczesny number-shape. Spopularyzował Tony Buzan w latach 70. XX w.', en: 'Henry Herdson (England, 17th c.) — number-rhyme. Stanislaus Mink von Wennsshein (1648) — early number-shape. Popularized by Tony Buzan in the 1970s.' },
    pitfalls: { pl: 'Ograniczenie do 10 (lub 100) haków. Te same haki dla różnych list — interferencja, dlatego potrzebujesz osobnych zestawów. Wymaga 2–3 dni inwestycji startowej.', en: '10-hook (or 100-hook) ceiling. Same hooks for different lists cause interference, so you need separate sets. Requires 2–3 days of startup investment.' },
    level: 'intermediate', uses: ['numbers', 'lists'], time: { pl: 'tydzień', en: '1 week' }
  },
  {
    icon: 'M',
    name: { pl: 'System Major', en: 'Major system' },
    desc: { pl: 'Cyfra → spółgłoska → słowo → obraz. Najpotężniejsza technika dla liczb.', en: 'Digit → consonant → word → image. The most powerful for numbers.' },
    principle: { pl: 'Cyfry są abstrakcyjne i pozbawione obrazu. Major przekształca je w spółgłoski, z których powstają konkretne słowa — a słowa to już obrazy do umieszczania w pałacu.', en: 'Digits are abstract and image-less. Major converts them to consonants, which yield concrete words — and words are images ready for the palace.' },
    howTo: {
      pl: ['Naucz się tabeli: 0=s/z, 1=t/d, 2=n, 3=m, 4=r, 5=l, 6=cz/sz/ż/dż, 7=k/g, 8=f/w, 9=p/b. (Samogłoski są wolne — to materiał wypełniający.)', 'Liczbę dziel na pary cyfr.', 'Każdej parze przypisz słowo zaczynające się tymi spółgłoskami w kolejności.', 'Przekuj słowo w żywy obraz.', 'Sklejaj obrazy w łańcuch lub pałac.'],
      en: ['Learn the table: 0=s/z, 1=t/d, 2=n, 3=m, 4=r, 5=l, 6=ch/sh/zh/j, 7=k/g, 8=f/v, 9=p/b. (Vowels are free — filler material.)', 'Split numbers into pairs of digits.', 'Assign each pair a word starting with those consonants in order.', 'Forge the word into a vivid image.', 'Glue images into a chain or palace.']
    },
    example: { pl: 'Liczba 1492 (odkrycie Ameryki) → 14-92 → TR-PN → „TRePaN" (instrument chirurgiczny) i „PoNcz" → trepan wbity w ponczową miseczkę. Π = 3,14159265 → MoTŁaSiNDŁaNoCa — kompletna sekwencja w jednej krótkiej historii.', en: 'Number 1492 (discovery of America) → 14-92 → TR-PN → „TRePaN" (surgical instrument) and „PuNCH" → trepan stuck in a punch bowl. Π = 3.14159265 → MeTeoR-LaNDeR-NoCe — a complete sequence in one short story.' },
    whenToUse: { pl: 'Numery telefonów, daty historyczne, PIN-y, wzory matematyczne, długie ciągi cyfr (π, e, Fibonacci), liczba talii w memory sports.', en: 'Phone numbers, historical dates, PINs, mathematical formulas, long digit strings (π, e, Fibonacci), card counts in memory sports.' },
    origin: { pl: 'Stanislaus Mink von Wennsshein (1648) — pierwsza wersja. Pierre Hérigone (1634) — wariant francuski. Aimé Paris (XIX w.) — finalna postać używana do dziś. Dominic O\'Brien używał Major przed wynalezieniem własnego systemu.', en: 'Stanislaus Mink von Wennsshein (1648) — first version. Pierre Hérigone (1634) — French variant. Aimé Paris (19th c.) — final form still in use. Dominic O\'Brien used Major before inventing his own system.' },
    pitfalls: { pl: 'Pierwsze 1–2 miesięce wolne i frustrujące — mózg musi nauczyć się automatu cyfra→spółgłoska. Wymaga listy 100 obrazów (00–99) na pamięć. Bez praktyki wieczornej — zanika.', en: 'First 1–2 months are slow and frustrating — the brain must build the digit→consonant reflex. Requires memorizing a 100-image table (00–99). Without daily practice — it fades.' },
    level: 'advanced', uses: ['numbers'], time: { pl: 'miesiąc', en: '1 month' }
  },
  {
    icon: 'D',
    name: { pl: 'System Dominic', en: 'Dominic system' },
    desc: { pl: 'Cyfra → litera → osoba + akcja. Stworzony przez 8× mistrza świata.', en: 'Digit → letter → person + action. Created by an 8× world champion.' },
    principle: { pl: 'Ludzie są zapamiętywani lepiej niż obiekty (wbudowana sieć neuronów rozpoznawania twarzy w korze skroniowej). Dominic wykorzystuje tę przewagę.', en: 'People are remembered better than objects (the built-in face-recognition network in temporal cortex). Dominic exploits that advantage.' },
    howTo: {
      pl: ['Każda cyfra ma literę: 1=A, 2=B, 3=C, 4=D, 5=E, 6=S, 7=G, 8=H, 9=N, 0=O.', 'Pary cyfr → dwie litery → inicjały znanej osoby (np. 23 = BC = Bill Clinton).', 'Każda osoba ma charakterystyczną akcję (Bill Clinton: gra na saksofonie).', 'Dla 4-cyfrowej liczby: pierwsza para to osoba, druga to akcja. 6-cyfrowa: + obiekt z trzeciej pary.', 'Buduj zawsze w panteonie 100 osób (00–99).'],
      en: ['Each digit has a letter: 1=A, 2=B, 3=C, 4=D, 5=E, 6=S, 7=G, 8=H, 9=N, 0=O.', 'Pairs of digits → two letters → initials of a famous person (e.g. 23 = BC = Bill Clinton).', 'Each person has a characteristic action (Bill Clinton: plays sax).', 'For a 4-digit number: first pair is the person, second is the action. 6-digit: + object from third pair.', 'Always build a pantheon of 100 people (00–99).']
    },
    example: { pl: '1066 (bitwa pod Hastings): 10-66 → AO-SS → Albert Einstein (10) wygłasza wykład (akcja AS) z saksofonem (66=SS). Albo bardziej polsko: 19-89 (upadek komunizmu): 19=AN=Andrzej Niemczyk, 89=HN=Hanka Niemcewicz — Andrzej Niemczyk pisze powieść (akcja Hanki) na maszynie.', en: '1066 (Battle of Hastings): 10-66 → AO-SS → Albert Einstein (10) lectures (action AS) holding a saxophone (66=SS).' },
    whenToUse: { pl: 'Memory sports — talie kart (każda karta = osoba + akcja), długie liczby. Świetny dla osób, które „wzrokowo" widzą znanych ludzi w głowie.', en: 'Memory sports — decks of cards (each card = person + action), long numbers. Excellent for people who „see" famous figures vividly in their mind.' },
    origin: { pl: 'Dominic O\'Brien — Brytyjczyk, ośmiokrotny mistrz świata pamięci (1991–2001). Wymyślił system w połowie lat 80. XX w. Książka „How to Develop a Perfect Memory" (1993) — biblijna pozycja.', en: 'Dominic O\'Brien — British, eight-time world memory champion (1991–2001). Invented the system in the mid-1980s. „How to Develop a Perfect Memory" (1993) is the canonical text.' },
    pitfalls: { pl: 'Wymaga panteonu 100 czytelnych osób — dla niezainteresowanych celebrytami trudniejsze. Polski panteon trzeba zbudować samodzielnie. Akcje muszą być wyraziste i NIETYPOWE dla osoby.', en: 'Requires a pantheon of 100 legible people — harder for those uninterested in celebrities. Actions must be vivid and ATYPICAL for the person.' },
    level: 'advanced', uses: ['numbers'], time: { pl: 'miesiąc', en: '1 month' }
  },
  {
    icon: '◆',
    name: { pl: 'PAO', en: 'PAO' },
    desc: { pl: 'Osoba-Akcja-Obiekt dla 00–99. Standard zawodowy memory sports.', en: 'Person-Action-Object for 00–99. Memory sport professional standard.' },
    principle: { pl: 'Trzy informacje w jednym obrazie = trzykrotna kompresja. PAO osiąga 6 cyfr w jednym kadrze, co przekłada się na zawrotne tempo zapamiętywania liczb.', en: 'Three pieces of information in one image = threefold compression. PAO packs 6 digits in one frame, yielding dizzying memorization speeds.' },
    howTo: {
      pl: ['Stwórz tabelę 100 wpisów (00–99). Każdy: osoba + akcja + obiekt (np. 07 = James Bond + strzela + martini).', 'Dla 6-cyfrowej liczby weź: osobę pierwszej pary + akcję drugiej + obiekt trzeciej.', 'Z trzech par powstaje JEDEN obraz: kto, co robi, z czym.', 'Sklejaj te obrazy łańcuchem lub w pałacu.', 'Ćwiczenie: 100 par × 3 elementy = 300 ćwiczeń startowych. Po 2–3 miesiącach — automat.'],
      en: ['Build a 100-entry table (00–99). Each: person + action + object (e.g. 07 = James Bond + shoots + martini).', 'For a 6-digit number take: first pair\'s person + second pair\'s action + third pair\'s object.', 'Three pairs become ONE image: who, doing what, with what.', 'Chain these images or place them in a palace.', 'Drill: 100 entries × 3 elements = 300 starter exercises. After 2–3 months — auto.']
    },
    example: { pl: '32-89-77 → Marlon Brando (32) odpala (89 = akcja od „Doc Brown") DeLorean (77 = obiekt od „Han Solo"). Sześć cyfr w jednym kadrze. Dla talii 52 kart: każda karta = jedna pozycja w 52-elementowej tabeli PAO.', en: '32-89-77 → Marlon Brando (32) launches (89 = action from „Doc Brown") DeLorean (77 = object from „Han Solo"). Six digits in one frame. For a 52-card deck: each card = one position in a 52-entry PAO table.' },
    whenToUse: { pl: 'Mistrzostwa pamięci — talie kart, długie ciągi cyfr (Speed Numbers, Hour Numbers). Każdy zawodnik PAO. Naukowo zweryfikowane: trening PAO zmienia strukturę funkcjonalną mózgu (Maguire et al., 2003).', en: 'Memory championships — card decks, long digit strings (Speed Numbers, Hour Numbers). Every competitor uses PAO. Scientifically verified: PAO training reshapes brain function (Maguire et al., 2003).' },
    origin: { pl: 'Andi Bell, Ben Pridmore (Wielka Brytania, lata 90.) — pierwsi zawodnicy. Spopularyzował Joshua Foer w „Moonwalking with Einstein" (2011). Alex Mullen używa PAO do swoich rekordów świata.', en: 'Andi Bell, Ben Pridmore (UK, 1990s) — first competitive users. Popularized by Joshua Foer in „Moonwalking with Einstein" (2011). Alex Mullen uses PAO for his world records.' },
    pitfalls: { pl: 'Bardzo wysoka inwestycja startowa: 2–3 miesiące na zbudowanie tabeli 100 PAO. Wymaga osobnego pałacu (ogromnego). Bez codziennej praktyki — zanika w 2 tygodnie.', en: 'Very high startup investment: 2–3 months to build a 100-entry PAO table. Needs a separate (large) palace. Without daily practice — fades in 2 weeks.' },
    level: 'advanced', uses: ['numbers'], time: { pl: '2 miesiące', en: '2 months' }
  },
  {
    icon: '⌗',
    name: { pl: 'Linkword (klucz)', en: 'Linkword' },
    desc: { pl: 'Klucz dźwiękowy + obraz = słowo obcojęzyczne. Metoda Gruneberga.', en: 'Sound key + image = foreign word. Gruneberg\'s method.' },
    principle: { pl: 'Słowo obce jest niezakorzenione w sieci semantycznej. Kotwica dźwiękowa w języku ojczystym + absurdalny obraz = natychmiastowe zakorzenienie.', en: 'A foreign word has no anchor in the semantic network. A sound anchor in the mother tongue + an absurd image = instant rooting.' },
    howTo: {
      pl: ['Słowo obcojęzyczne — np. niem. „Hund" (pies).', 'Znajdź polskie słowo brzmieniowo podobne — „hunt" (myśliwy).', 'Stwórz absurdalny obraz łączący polski klucz ze znaczeniem słowa obcego — „hunt poluje na psa", „pies w stroju huntmana".', 'Przemyśl obraz przez 5 sekund — to wystarczy.', 'Po 1, 3, 7 dniach — krótka powtórka. Po dwóch tygodniach klucz się rozpływa, słowo zostaje.'],
      en: ['Foreign word — e.g. German „Hund" (dog).', 'Find a similar-sounding native-language word — „hound".', 'Create an absurd image linking the native key to the foreign meaning — „a hound dressed as a hunter".', 'Visualize for 5 seconds — that\'s enough.', 'Review at 1, 3, 7 days. After two weeks the key dissolves, the word remains.']
    },
    example: { pl: 'Hiszp. „mariposa" (motyl) → „Mary-pasja" → motyl Mary z gorącą pasją lata. Niem. „Schmetterling" (motyl) → „szmetter-ling" → szmaty fruwają jak motyle. Pol. „książka" dla obcokrajowca → „k-shounsh-ka" → „a knight\'s shoe in a kayak".', en: 'Spanish „mariposa" (butterfly) → „Mary-pause" → butterfly Mary pauses in flight. German „Schmetterling" (butterfly) → „smatter-ling" → rags fluttering like butterflies. French „chien" (dog) → „shi-yen" → a dog wearing a Chinese hat.' },
    whenToUse: { pl: 'Pierwsze 500–1000 słówek obcojęzycznych. Najskuteczniejsza dla języków odległych etymologicznie (japoński, fiński, węgierski). Mniej potrzebna dla bliskich (czeski, słowacki).', en: 'First 500–1000 foreign vocabulary words. Most effective for etymologically distant languages (Japanese, Finnish, Hungarian). Less needed for close ones.' },
    origin: { pl: 'Atkinson & Raugh (Stanford, 1975) — pierwszy eksperyment naukowy. Michael Gruneberg (Uniwersytet w Walii, lata 80.) — wydał serię „Linkword" dla 16 języków. Skuteczność potwierdzona dziesiątkami badań.', en: 'Atkinson & Raugh (Stanford, 1975) — first scientific experiment. Michael Gruneberg (Wales, 1980s) — published the „Linkword" series for 16 languages. Effectiveness confirmed by dozens of studies.' },
    pitfalls: { pl: 'Niektóre słowa nie mają polskiego brzmieniowego ekwiwalentu. Działa najlepiej na poziomie A1–B1; w wyższych poziomach zastępują ją skojarzenia etymologiczne. Klucz dźwiękowy może wprowadzić błędną wymowę.', en: 'Some words have no native-language sound equivalent. Works best at A1–B1 level; at higher levels etymological associations replace it. The sound key may introduce wrong pronunciation.' },
    level: 'beginner', uses: ['language'], time: { pl: '10 min', en: '10 min' }
  },
  {
    icon: '✦',
    name: { pl: 'Mapy myśli', en: 'Mind maps' },
    desc: { pl: 'Wizualne notowanie radialne. Centralny temat, gałęzie, kolory, ikony.', en: 'Radial visual note-taking. Central topic, branches, colours, icons.' },
    principle: { pl: 'Linearne notatki ignorują 90% pojemności mózgu wzrokowego. Mapa myśli aktywuje obie półkule jednocześnie: lewą (słowo) i prawą (kolor, kształt, przestrzeń).', en: 'Linear notes ignore 90% of the brain\'s visual capacity. A mind map activates both hemispheres at once: left (word) and right (color, shape, space).' },
    howTo: {
      pl: ['Centralny temat zawsze jako OBRAZ, nigdy słowo same — w środku kartki.', 'Główne gałęzie radialnie — pojedyncze SŁOWA-KLUCZE drukowanymi literami wzdłuż linii.', 'Drugorzędne gałęzie odchodzące od głównych — coraz cieńsze.', 'Kolory = kategorie (np. niebieski = przyczyny, czerwony = skutki).', 'Ikony i strzałki = relacje między gałęziami.'],
      en: ['Central topic always as an IMAGE, never a word alone — in the middle of the page.', 'Main branches radially — single KEYWORDS in capitals along the line.', 'Secondary branches off the main ones — progressively thinner.', 'Colors = categories (e.g. blue = causes, red = effects).', 'Icons and arrows = relations between branches.']
    },
    example: { pl: 'Notatka z wykładu o pamięci → centrum: rysunek mózgu z podpisem PAMIĘĆ → gałęzie: SENSORYCZNA (niebieska, ikona oka), KRÓTKOTRWAŁA (zielona, ikona zegara), DŁUGOTRWAŁA (czerwona, ikona archiwum), ROBOCZA (żółta, ikona stołu) → każda z dalszymi rozgałęzieniami.', en: 'Lecture on memory → center: brain drawing labeled MEMORY → branches: SENSORY (blue, eye icon), SHORT-TERM (green, clock icon), LONG-TERM (red, archive icon), WORKING (yellow, desk icon) → each with sub-branches.' },
    whenToUse: { pl: 'Notowanie wykładów, planowanie wystąpień, brainstorming, powtórki przed egzaminem, struktura artykułu, mapa projektu, konflikt rodzinny do rozwiązania.', en: 'Lecture notes, speech planning, brainstorming, exam revision, article outlines, project mapping, mapping a family conflict to solve.' },
    origin: { pl: 'Tony Buzan (Wielka Brytania, lata 70.) wykorzystał badania nad asymetrią półkul mózgu (Sperry, Nobel 1981). Książka „The Mind Map Book" (1996). Założenia: Buzan World Memory Championships (1991).', en: 'Tony Buzan (UK, 1970s) drew on research into hemispheric asymmetry (Sperry, Nobel 1981). „The Mind Map Book" (1996). Founder of the World Memory Championships (1991).' },
    pitfalls: { pl: 'Pisanie ręczne jest istotne — aplikacje (XMind, MindMeister) tracą efekt motoryczny. Nie wszystkie tematy są radialne — historia jako linia czasowa jest słabo mapowana. Krytycy (Farrand et al., 2002): efekt jest umiarkowany, nie cudowny.', en: 'Handwriting matters — apps (XMind, MindMeister) lose the motor effect. Not all topics are radial — history as a timeline maps poorly. Critics (Farrand et al., 2002): the effect is moderate, not miraculous.' },
    level: 'beginner', uses: ['lists'], time: { pl: '15 min', en: '15 min' }
  },
  {
    icon: '↻',
    name: { pl: 'Powtórki rozproszone', en: 'Spaced repetition' },
    desc: { pl: 'Powtórki w rosnących odstępach. Anki, SuperMemo. +30% nad wkuwaniem.', en: 'Reviews at expanding intervals. Anki, SuperMemo. +30% over cramming.' },
    principle: { pl: 'Krzywa zapominania Ebbinghausa (1885) pokazuje że tracimy 50% w ciągu godziny. Powtórki tuż przed momentem zapomnienia tworzą wykładniczo dłuższe ślady pamięciowe.', en: 'Ebbinghaus\'s forgetting curve (1885) shows we lose 50% within an hour. Reviews just before the moment of forgetting create exponentially longer memory traces.' },
    howTo: {
      pl: ['Stwórz fiszki: pytanie z jednej strony, odpowiedź z drugiej. Reguła „atomic": jedna fiszka = jeden fakt.', 'System (Anki, SuperMemo, RemNote) zarządza odstępami: 1 dzień, 3 dni, 7, 14, 30, 90, 180...', 'Trafiona = długi odstęp do następnej powtórki. Zapomniane = restart cyklu.', '15–30 minut dziennie — codziennie, bez przerw.', 'Po roku — tysiące fiszek w aktywnej, długoterminowej pamięci.'],
      en: ['Build cards: question on one side, answer on the other. „Atomic" rule: one card = one fact.', 'System (Anki, SuperMemo, RemNote) manages intervals: 1 day, 3 days, 7, 14, 30, 90, 180...', 'Hit = long interval to next review. Forgotten = cycle restart.', '15–30 minutes daily — every day, no breaks.', 'After a year — thousands of cards in active, long-term memory.']
    },
    example: { pl: 'Lekarz rezydent: 8000 fiszek z farmakologii i protokołów klinicznych, 20 minut/dzień, 3 lata → wszystkie protokoły w głowie do końca życia. Student języków: japoński Kanji 2000 znaków w 18 miesięcy. Naukowiec: Kluczowe wzory z dziedziny → swobodny dostęp w trakcie pisania artykułów.', en: 'Medical resident: 8,000 cards on pharmacology and protocols, 20 min/day, 3 years → all protocols held for life. Language student: 2,000 Japanese Kanji in 18 months. Scientist: key formulas from the field → ready access while writing papers.' },
    whenToUse: { pl: 'Każdy materiał wymagający długoterminowego utrzymania — słowa, daty, wzory, terminologia, definicje, przepisy. Codzienna praktyka aktywnego utrzymania wiedzy. Egzaminy LEK / matura.', en: 'Any material requiring long-term retention — vocabulary, dates, formulas, terminology, definitions, recipes. Daily practice for keeping knowledge active. Medical board exams.' },
    origin: { pl: 'Hermann Ebbinghaus (1885) — krzywa zapominania, narodziny dyscypliny. Sebastian Leitner (1972) — system pudełek (papierowy Spaced Repetition). PIOTR WOŹNIAK (Polska, 1985) — algorytm SM-2 i program SuperMemo z UAM Poznań — fundament wszystkich nowoczesnych aplikacji. Anki (Damien Elmes, 2006) — implementacja open source. FSRS (2023) — najnowszy algorytm, lepszy od SM-2.', en: 'Hermann Ebbinghaus (1885) — forgetting curve, birth of the discipline. Sebastian Leitner (1972) — box system (paper Spaced Repetition). PIOTR WOŹNIAK (Poland, 1985) — SM-2 algorithm and SuperMemo at AMU Poznań — foundation of all modern apps. Anki (Damien Elmes, 2006) — open-source implementation. FSRS (2023) — newest algorithm, beats SM-2.' },
    pitfalls: { pl: 'Nie zastępuje rozumienia — fiszki na sucho uczą papugowania. Karty źle sformułowane uczą błędów (atomic rule jest kluczowy). Nudzi po miesiącu, jeśli za sucho — używaj obrazów i kontekstu. Jeśli przerwiesz na 2 tygodnie — kolejka eksploduje.', en: 'Does not replace understanding — dry cards train parroting. Badly formed cards teach errors (the atomic rule is essential). Boring after a month if too dry — use images and context. Skip 2 weeks and the queue explodes.' },
    level: 'beginner', uses: ['language', 'numbers', 'lists'], time: { pl: '15 min / dzień', en: '15 min / day' }
  },
  {
    icon: '◯',
    name: { pl: 'Aktywne odzyskiwanie', en: 'Active recall' },
    desc: { pl: 'Zamknij książkę i wypisz, co pamiętasz. +50% po tygodniu.', en: 'Close the book and write what you remember. +50% after a week.' },
    principle: { pl: 'Wysiłek odzyskiwania jest sygnałem dla mózgu „to jest ważne". Bierne czytanie tworzy tylko iluzję wiedzy (familiarity illusion). Test = uczenie.', en: 'The effort of retrieval signals to the brain „this is important". Passive reading produces only the illusion of knowledge (familiarity illusion). Testing = learning.' },
    howTo: {
      pl: ['Po sesji nauki — zamknij notatki, książkę, ekran.', 'Na czystej kartce wypisz wszystko, co pamiętasz z materiału.', 'Dopiero potem porównaj z notatkami — zobacz luki.', 'Skup następną sesję na lukach. Powtórz aktywne odzyskiwanie po 24h, 3 dniach, tygodniu.', 'Wariant: opowiadaj komuś materiał na głos (Feynman: jeśli nie umiesz wytłumaczyć, nie rozumiesz).'],
      en: ['After a study session — close notes, book, screen.', 'On a blank page write down everything you remember.', 'Only then compare to notes — see the gaps.', 'Focus next session on gaps. Repeat active recall at 24h, 3 days, 1 week.', 'Variant: explain the material aloud to someone (Feynman: if you can\'t explain, you don\'t understand).']
    },
    example: { pl: 'Po przeczytaniu rozdziału o II RP → zamknij książkę → opowiedz na głos: 1918, Piłsudski, granice, traktat ryski, sanacja → otwórz, zobacz braki. Studenci medycyny: zamiast czytania Robbinsa po raz piąty, robią self-quiz po pierwszym czytaniu — 50–80% lepsze wyniki na egzaminie (Karpicke 2008).', en: 'After reading a chapter on the Second Republic → close the book → recite aloud: 1918, Piłsudski, borders, Treaty of Riga, Sanacja → open, see gaps. Medical students: instead of reading Robbins for the fifth time, self-quiz after the first read — 50–80% better exam scores (Karpicke 2008).' },
    whenToUse: { pl: 'Po każdym czytaniu, wykładzie, filmie. Przed egzaminem — zamiast biernego wkuwania. W trakcie wykładu — na bieżąco zadawaj sobie pytania „co właśnie usłyszałem?". Złoty standard nauki w XXI w.', en: 'After every reading, lecture, video. Before exams — instead of passive cramming. During lectures — keep asking „what just was said?". 21st century\'s gold standard of learning.' },
    origin: { pl: 'Henry L. Roediger III i Jeffrey D. Karpicke (Washington University w St. Louis, 2006) — efekt testowania (testing effect). Książka „Make It Stick" (Brown, Roediger, McDaniel, 2014) — najlepsza synteza. Metoda Feynmana (Richard Feynman, lata 60.) jest jej wariantem.', en: 'Henry L. Roediger III and Jeffrey D. Karpicke (Washington University in St. Louis, 2006) — the testing effect. „Make It Stick" (Brown, Roediger, McDaniel, 2014) — best synthesis. The Feynman method (Richard Feynman, 1960s) is a variant.' },
    pitfalls: { pl: 'Na początku boli — wydaje się, że niczego nie pamiętasz. Bólność = znak że metoda działa (mniej illusion of knowing). Bez powtórek po 24h efekt zanika. Pisanie jest skuteczniejsze niż samo myślenie.', en: 'At first it hurts — feels like you remember nothing. The pain = sign the method works (less illusion of knowing). Without 24h reviews the effect fades. Writing beats mere thinking.' },
    level: 'beginner', uses: ['language', 'lists'], time: { pl: '10 min', en: '10 min' }
  }
];

const techniquesGrid = document.getElementById('techniquesGrid');
const renderTechniques = (filter = 'all') => {
  const L = lang();
  const items = TECHNIQUES.map((t, i) => ({ t, i })).filter(({t}) =>
    filter === 'all' ||
    t.level === filter ||
    (t.uses && t.uses.includes(filter))
  );
  techniquesGrid.innerHTML = items.map(({t, i}) => `
    <div class="technique" data-level="${t.level}" data-tech-idx="${i}">
      <div class="tech-icon">${t.icon || '◇'}</div>
      <div class="tech-eyebrow">
        <span>${LEVEL_LABEL[t.level][L]}</span>
        <span>${t.time[L]}</span>
      </div>
      <h3 class="tech-name">${t.name[L]}</h3>
      <p class="tech-desc">${t.desc[L]}</p>
      <div class="tech-meta">
        <div class="tech-uses">${(t.uses || []).map(u => `<span class="tech-meta-item">${USE_LABEL[u][L]}</span>`).join('')}</div>
        <div class="tech-arrow">→</div>
      </div>
    </div>
  `).join('');
  techniquesGrid.querySelectorAll('.technique').forEach(card => {
    card.addEventListener('click', () => openTechniqueModal(parseInt(card.dataset.techIdx, 10)));
  });
};
renderTechniques();

// ============= TECHNIQUE MODAL =============
const techModal = document.getElementById('techniqueModal');
const techModalContent = document.getElementById('techniqueModalContent');
const techModalClose = document.getElementById('techniqueModalClose');
const techModalBackdrop = techModal?.querySelector('.modal-backdrop');

const t9n = (pl, en) => lang() === 'en' ? en : pl;

const openTechniqueModal = (idx) => {
  const t = TECHNIQUES[idx];
  if (!t) return;
  const L = lang();
  const stepsList = (t.howTo[L] || []).map((s, i) => `<li><span class="step-num">${i + 1}</span><span class="step-body">${s}</span></li>`).join('');
  techModalContent.innerHTML = `
    <div class="tm-header">
      <div class="tm-icon">${t.icon || '◇'}</div>
      <div>
        <div class="tm-eyebrow">
          <span>${LEVEL_LABEL[t.level][L]}</span>
          <span class="tm-eyebrow-dot">·</span>
          <span>${t.time[L]}</span>
          <span class="tm-eyebrow-dot">·</span>
          <span>${(t.uses || []).map(u => USE_LABEL[u][L]).join(' / ')}</span>
        </div>
        <h3 class="tm-title">${t.name[L]}</h3>
      </div>
    </div>
    <p class="tm-principle">${t.principle[L]}</p>
    <section class="tm-section">
      <h4>${t9n('Krok po kroku', 'Step by step')}</h4>
      <ol class="tm-steps">${stepsList}</ol>
    </section>
    <section class="tm-section">
      <h4>${t9n('Przykład', 'Example')}</h4>
      <p class="tm-example">${t.example[L]}</p>
    </section>
    <section class="tm-section">
      <h4>${t9n('Kiedy używać', 'When to use')}</h4>
      <p>${t.whenToUse[L]}</p>
    </section>
    <section class="tm-section">
      <h4>${t9n('Pochodzenie', 'Origin')}</h4>
      <p>${t.origin[L]}</p>
    </section>
    <section class="tm-section tm-pitfalls">
      <h4>${t9n('Pułapki', 'Pitfalls')}</h4>
      <p>${t.pitfalls[L]}</p>
    </section>
  `;
  techModal.classList.add('open');
  document.body.style.overflow = 'hidden';
};
const closeTechniqueModal = () => {
  techModal?.classList.remove('open');
  document.body.style.overflow = '';
};
techModalClose?.addEventListener('click', closeTechniqueModal);
techModalBackdrop?.addEventListener('click', closeTechniqueModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && techModal?.classList.contains('open')) closeTechniqueModal();
});

document.querySelectorAll('.filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderTechniques(btn.dataset.filter);
  });
});

// ============= AGES =============
const AGES = [
  {
    icon: '✦',
    range: '6—12',
    name: { pl: 'Dzieci', en: 'Children' },
    blurb: { pl: 'Wyobraźnia jest gotową mnemoniką. Multisensoryczność, gry, rymowanki, mini-pałac w pokoju zabaw.', en: 'Imagination is mnemonics ready-made. Multisensory play, games, rhymes, mini-palace in the playroom.' },
    characteristics: { pl: 'Mózg w fazie najbardziej intensywnej mielinizacji — synapsy mnożą się w tempie niedostępnym dorosłym. Pamięć epizodyczna tworzy się szybko, semantyczna chłonie nieograniczenie. Naturalna skłonność do absurdalnych obrazów i narracji to gotowy materiał mnemoniczny — Tomasz z Akwinu nazywał to „dziecięcym darem oglądu". Kora przedczołowa wciąż dojrzewa do około 25 r.ż., dlatego abstrakcja jest trudna, ale obraz, ruch, dźwięk i emocja działają niemal magicznie.', en: 'Brain in the most intense myelination phase — synapses proliferate at a rate inaccessible to adults. Episodic memory forms quickly, semantic memory is limitless. The natural pull to absurd images and narrative is ready-made mnemonic material — Aquinas called it the „child\'s gift of seeing". The prefrontal cortex is still maturing until ~25, so abstraction is hard, but image, motion, sound and emotion work almost magically.' },
    challenges: { pl: 'Krótka uwaga (15–25 minut na sesję), trudność z abstrakcją i hierarchią, łatwo się nudzą, frustracja zabija motywację w 5 minut. Ekrany przed snem niszczą konsolidację REM. Karanie za błędy zabija ciekawość — najgorsza rzecz dla 8-latka.', en: 'Short attention (15–25 min sessions), difficulty with abstraction and hierarchy, boredom kicks in fast, frustration kills motivation in 5 minutes. Screens before sleep destroy REM consolidation. Punishing mistakes kills curiosity — the worst thing for an 8-year-old.' },
    goals: { pl: 'Polubienie nauki na całe życie. Pierwsze działające narzędzie pamięciowe (najczęściej łańcuch skojarzeń). Podstawy uważności — siadanie do nauki bez płaczu. Rytm: codziennie po 15 min, lepiej krótko a regularnie.', en: 'Lifelong love of learning. A first working memory tool (usually the link method). Basic mindfulness — sitting down to study without tears. Rhythm: 15 min daily, better short and regular.' },
    techniques: { pl: ['Łańcuch skojarzeń — chwytliwy, narracyjny, zabawowy', 'Rymy i piosenki — tabliczka mnożenia, listy królów, daty', 'Mini-pałac — jeden pokój, 5–10 loci, najpierw wspólnie z rodzicem', 'Akronimy do prostych list', 'Memory Match — klasyczna gra w pary'], en: ['Link method — catchy, narrative, playful', 'Rhymes and songs — multiplication tables, kings\' lists, dates', 'Mini-palace — one room, 5–10 loci, first together with a parent', 'Acronyms for simple lists', 'Memory Match — the classic pairs game'] },
    dailyPlan: { pl: '2× dziennie po 15 min: rano lekka rozgrzewka pamięciowa (jedna gra, jedna rymowanka), po południu nauka właściwa (zadania szkolne metodą łańcucha lub mini-pałacu). Codziennie min. 60 min ruchu — bieg, taniec, jazda na rowerze. Sen: 9–11 godzin.', en: '2× daily for 15 min: morning warm-up (one game, one rhyme), afternoon proper study (school tasks via link or mini-palace). At least 60 min of movement daily — running, dancing, cycling. Sleep: 9–11 hours.' },
    example: { pl: 'Zosia (8 lat, Warszawa) uczy się tabliczki mnożenia przez rymowanki: „Pięć razy sześć — to trzydzieści, kicia łapie myszkę w gęstwinie". Po dwóch tygodniach — opanowane bez wkuwania. Tomek (10 lat) zapamiętał wszystkich 16 polskich królów Piastów łańcuchem absurdalnych obrazów: Mieszko I tańczy z Bolesławem Chrobrym na lodowisku, Bolesław jeździ na nim Mieszka II… Mama nie zna ich wszystkich.', en: 'Zosia (8, Warsaw) learns multiplication via rhymes: „Five times six — thirty marches, kitten catches mouse in arches". Two weeks — mastered without cramming. Tomek (10) memorized all 16 Polish Piast kings via a chain of absurd images: Mieszko I dances with Bolesław Chrobry on an ice rink, Bolesław rides Mieszko II… His mother doesn\'t know them all.' },
    pitfalls: { pl: 'Forsowanie skomplikowanych systemów (Major, PAO) zniechęca i osłabia samoocenę. Aplikacje bez nadzoru zamieniają się w grę. Ekran 1h przed snem = 30% mniej snu REM = mniejsza konsolidacja. Karanie za błędy buduje lęk przed nauką, który zostaje na 20 lat.', en: 'Forcing complex systems (Major, PAO) discourages and damages self-esteem. Unsupervised apps become games. Screen 1h before sleep = 30% less REM = poorer consolidation. Punishing mistakes builds fear of learning that lasts 20 years.' },
    advice: { pl: 'Dla rodziców: graj WSPÓLNIE w gry pamięciowe (modelowanie), chwal proces nie wynik („widzę że ćwiczyłeś" — nie „jesteś mądry"). Trzymaj sen 9–11 godzin jako nienaruszalny rytuał. Czytajcie wieczorem na głos — to fundament wszystkich późniejszych mnemonik. Pamiętaj: dziecko, które polubiło naukę w wieku 8 lat, nie potrzebuje dyscypliny w wieku 18.', en: 'For parents: play memory games TOGETHER (modeling), praise the process not the outcome („I see you practiced" — not „you\'re smart"). Keep 9–11h sleep as an inviolable ritual. Read aloud in the evening — it\'s the foundation of all later mnemonics. Remember: a child who loves learning at 8 doesn\'t need discipline at 18.' }
  },
  {
    icon: '✎',
    range: '13—18',
    name: { pl: 'Uczniowie', en: 'Pupils' },
    blurb: { pl: 'Szczyt potencjału hipokampu, ale też social media i presja egzaminów. Active recall i Anki to dwa najlepsze przyjaciele.', en: 'Peak hippocampal potential, but also social media and exam pressure. Active recall and Anki are the two best friends.' },
    characteristics: { pl: 'Szczyt potencjału hipokampu w życiu — neurogeneza najsilniejsza, dziesiątki tysięcy nowych neuronów dziennie. Pamięć semantyczna gotowa na duże ilości materiału. Kora przedczołowa wciąż się rozwija (impulsywność, słabe planowanie), zmiany hormonalne destabilizują uwagę. To paradoks: największa zdolność, ale najsłabsza dyscyplina.', en: 'The hippocampal peak of life — neurogenesis at maximum, tens of thousands of new neurons daily. Semantic memory ready for vast quantities. The prefrontal cortex still developing (impulsivity, weak planning), hormonal shifts destabilize attention. The paradox: maximum capacity, minimum discipline.' },
    challenges: { pl: 'Matura, egzaminy ósmoklasisty, testy kompetencji — ogromne ilości materiału w krótkim czasie. Social media obniżają focus o 40%, multitasking zabija efektywność. Większość uczniów nie zna żadnej strategii nauki innej niż wkuwanie i podświetlanie. Presja rodziców i porównań rówieśniczych — chroniczny stres podnosi kortyzol, ten niszczy hipokamp.', en: 'Matriculation, eighth-grade exams, competency tests — vast material in short time. Social media drops focus by 40%, multitasking kills effectiveness. Most pupils know no study strategy beyond cramming and highlighting. Parental pressure and peer comparison — chronic stress raises cortisol, which destroys the hippocampus.' },
    goals: { pl: 'Opanowanie active recall jako codziennej rutyny. Zbudowanie pierwszej talii Anki na 6–12 miesięcy przed maturą. Jeden działający pałac (zwykle dom rodzinny) z 20 loci. Świadomość, że nauka to umiejętność, nie talent.', en: 'Active recall as a daily routine. Building a first Anki deck 6–12 months before matriculation. One working palace (usually the family home) with 20 loci. Awareness that learning is a skill, not a talent.' },
    techniques: { pl: ['Active recall (#1 priorytet) — po każdym wykładzie zamknij notatki, wypisz wszystko z pamięci', 'Spaced repetition Anki — matura ≈ 3000–5000 fiszek przy systematycznej pracy', 'Mapy myśli — notowanie wykładów i powtórek', 'Pałac dla dat historycznych, wzorów, listy państw', 'Akronimy dla list (np. NEFROZA — kolejność rzek)', 'Cornell notes — system 2-kolumnowy zamiast linearnych zapisków'], en: ['Active recall (top priority) — after every lecture close notes, write everything from memory', 'Spaced repetition with Anki — matriculation ≈ 3,000–5,000 cards with steady work', 'Mind maps — for lecture notes and revision', 'Palace for historical dates, formulas, country lists', 'Acronyms for lists', 'Cornell notes — two-column system instead of linear scribbling'] },
    dailyPlan: { pl: '4 cykle Pomodoro (4×25 min focus + 5 min przerwa) = 2h codziennie głębokiej nauki. Anki rano 15 min (powtórki) + 10 min wieczorem (nowe karty). Po każdym wykładzie 10-minutowy recall pisemny. Sen 8–10 godzin (chronoterapia: początek nauki nie wcześniej niż godzinę po przebudzeniu). Telefon w innym pokoju podczas nauki.', en: '4 Pomodoro cycles (4×25 min focus + 5 min break) = 2h of deep study daily. Anki: 15 min morning (reviews) + 10 min evening (new cards). After every lecture, 10-min written recall. Sleep 8–10h (chronotherapy: start studying no earlier than 1h after waking). Phone in another room during study.' },
    example: { pl: 'Maciek (17 lat, Kraków) zaczął używać Anki + pałac na 6 miesięcy przed maturą rozszerzoną. Wynik: biologia 87%, polski 92%, matematyka 78% — dostał się na medycynę UJ. Wcześniej rówieśnicy z lepszych ocen w szkole nie zdali biologii. Klucz: nie liczba godzin (5–6 dziennie wystarczy), ale technika. Maciek robił aktywne odzyskiwanie po każdej lekcji — większość kolegów tylko czytała ponownie.', en: 'Maciek (17, Kraków) started Anki + palace 6 months before extended matriculation. Result: biology 87%, Polish 92%, maths 78% — admitted to Jagiellonian medical school. Peers with better school grades failed biology. The key: not hours (5–6 daily suffices) but technique. Maciek did active recall after every class — most peers only re-read.' },
    pitfalls: { pl: '„Wszystko-na-jeden-raz" przed egzaminem (cramming) — krótki efekt, zerowa retencja po roku. Podświetlanie tekstu = iluzja nauki, jeden z najmniej skutecznych sposobów. Multitasking podczas nauki obniża efektywność o 40%. Telefon na biurku = średnio 3 minuty głębokiej koncentracji między rozpraszaczami. Spanie 5h przed egzaminem = ocena niższa o jeden stopień.', en: '„Last-minute cramming" — short-lived, zero retention after a year. Highlighting = illusion of learning, one of the least effective methods. Multitasking drops effectiveness by 40%. Phone on desk = ~3 minutes of deep focus between distractions. 5h sleep before an exam = grade drops by one level.' },
    advice: { pl: 'Dla uczniów: jedna technika, 90 dni, dopiero potem dokładaj. Anki + active recall + sen — to wystarczy do matury z najlepszymi wynikami. Dla rodziców: nie kupować „magicznych" tabletek na pamięć (placebo), nie naciskać na dłuższe wkuwanie (gorsze niż krótsze + lepsze techniki). Dla nauczycieli: zamiast zadawać czytanie, zadawajcie self-test — uczeń sam sobie zadaje 10 pytań do rozdziału.', en: 'For pupils: one technique, 90 days, then add another. Anki + active recall + sleep — enough for top matriculation results. For parents: don\'t buy „magic" memory pills (placebo), don\'t push for longer cramming (worse than shorter + better technique). For teachers: instead of assigning reading, assign self-tests — pupil asks himself 10 questions per chapter.' }
  },
  {
    icon: '▣',
    range: '18—25',
    name: { pl: 'Studenci', en: 'Students' },
    blurb: { pl: 'Szczyt sprawności poznawczej, ale gigantyczne ilości materiału. Czas zbudować trwały, osobisty system na życie.', en: 'Peak cognitive sharpness, but vast quantities of material. Time to build a durable, personal system for life.' },
    characteristics: { pl: 'Szczyt sprawności intelektualnej. Mielinizacja kończy się ~25 r.ż. — od tego momentu kora przedczołowa pracuje na pełnych obrotach. Pamięć robocza, uwaga selektywna, zdolność do złożonej abstrakcji — wszystko maksymalne. Materiał akademicki dramatycznie skomplikowany: medycyna 5 000 stron rocznie, prawo dziesiątki ustaw i komentarzy, języki obce na poziomie C, programowanie z setkami API. Bez systemu to się nie da.', en: 'Peak intellectual capacity. Myelination ends around 25 — from that moment the prefrontal cortex runs at full power. Working memory, selective attention, complex abstraction — all maximal. Academic material drastically complex: medicine 5,000 pages a year, law dozens of statutes and commentaries, languages at C level, programming with hundreds of APIs. Without a system, it\'s impossible.' },
    challenges: { pl: 'Sesje 4× w roku (lub 2 dłuższe). Prokrastynacja chroniczna — 60% studentów funkcjonuje w trybie „wszystko ostatniej nocy". Alkohol i imprezy — alkohol zabija konsolidację REM przez 3 dni po jednej imprezie. Brak rutyny, brak struktury dnia, samotność (zwłaszcza pierwszy rok). Prawie nikt nie uczy się jak się uczyć — semestry tracone na nieefektywne metody.', en: 'Sessions 4× per year (or 2 longer). Chronic procrastination — 60% of students operate in „everything last night" mode. Alcohol and parties — alcohol kills REM consolidation for 3 days after one party. No routine, no day structure, loneliness (especially first year). Almost nobody learns how to learn — semesters lost on inefficient methods.' },
    goals: { pl: 'Zbudować trwały system osobisty na życie — fiszki, pałace, technika notowania, rytm tygodnia. Te techniki opanowane na studiach służą przez kolejne 40 lat. Pierwszy język obcy na C1. Jedna domena, w której czujesz się ekspertem (nie przedmiot z planu — pasja). Sprawność prezentacji bez kartki.', en: 'Build a durable personal system — flashcards, palaces, note-taking, weekly rhythm. These techniques mastered now serve for the next 40 years. First foreign language at C1. One domain where you feel expert (not a curriculum subject — a passion). Presentation skill without notes.' },
    techniques: { pl: ['Pełen stack Anki/SuperMemo — 1000+ aktywnych fiszek', '3–5 pałaców tematycznych (anatomia, prawo karne, struktury danych)', 'Major lub PAO dla dużych liczb i statystyk', 'Linkword dla języków obcych', 'Cornell notes na wykładach', 'Metoda Feynmana przed egzaminem (wytłumacz prosto = rozumiesz)', 'Pomodoro 4× dziennie z prawdziwym focusem'], en: ['Full Anki/SuperMemo stack — 1,000+ active cards', '3–5 thematic palaces (anatomy, criminal law, data structures)', 'Major or PAO for large numbers and statistics', 'Linkword for foreign languages', 'Cornell notes during lectures', 'Feynman technique before exams (explain simply = you understand)', 'Pomodoro 4× daily with real focus'] },
    dailyPlan: { pl: '6–7h focused work codziennie (3 sesje pomodoro × 2h, oddzielone 30-min ruchem). Anki rano + przed snem (15+15 min). 1 nowy rozdział + 1 powtórka + 1 self-test dziennie. Tydzień: poniedziałek-piątek pełen rytm, sobota bilans + lekka praca, niedziela odpoczynek (nie nauka — neurony muszą skonsolidować). Sport min. 3× w tygodniu po 45 min.', en: '6–7h focused work daily (3 pomodoro sessions × 2h, separated by 30-min movement). Anki morning + before sleep (15+15 min). 1 new chapter + 1 review + 1 self-test daily. Week: Mon-Fri full rhythm, Sat balance + light work, Sun rest (not study — neurons must consolidate). Sport min. 3× weekly for 45 min.' },
    example: { pl: 'Anna (studia farmacji, UMP Poznań). Pierwszy rok — wkuwa, średnia 3.7. Drugi rok — przeskakuje na Anki + pałac dla nazw leków (struktura chemiczna jako loci): średnia 4.8. Egzamin państwowy (LEK farmaceutyczny) — wynik w top 5%. Klucz: pałac „Klatka schodowa wydziału farmacji" — każde piętro = jedna grupa leków. Kuba (informatyka UJ) ułożył 50-stronicowe opracowanie na egzamin z baz danych w ciągu 4 dni przez aktywne odzyskiwanie + jeden pałac, zamiast tygodnia czytania ponownego.', en: 'Anna (pharmacy, AMU Poznań). First year — cramming, GPA 3.7. Second year — switches to Anki + palace for drug names (chemical structure as loci): GPA 4.8. State exam (pharmaceutical board) — top 5% nationally. The key: palace „Faculty of Pharmacy stairwell" — each floor = one drug class.' },
    pitfalls: { pl: '„To działa wszystko" — próba 5 narzędzi naraz daje chaos i porzucenie wszystkich. Rezygnacja z Anki podczas sesji = po 2 tygodniach traci się 1500 fiszek (tygodnie pracy w błoto). Brak snu w sesji = krótkotrwałe oblanie egzaminu i długie zmęczenie. Cytat Cycerona „bez ruchu nie ma pamięci" jest dosłowny — neurogeneza wymaga aerobowego ruchu. Energetyki + brak snu + 18 godzin nauki dziennie = wypalenie w 2 tygodnie.', en: '„Everything works" — trying 5 tools at once creates chaos and abandonment. Quitting Anki during exam season = losing 1,500 cards in 2 weeks. No sleep during exams = short-term failure and long fatigue. Cicero\'s „no memory without motion" is literal — neurogenesis requires aerobic movement. Energy drinks + no sleep + 18h study daily = burnout in 2 weeks.' },
    advice: { pl: 'Wybierz JEDNĄ podstawową technikę (zwykle Anki), trzymaj się jej 90 dni, dopiero wtedy dokładaj kolejne. Inwestuj w ergonomię biurka (drugi monitor, dobre krzesło) — dziesiątki godzin tygodniowo, opłaca się. Znajdź jednego partnera do nauki — wzajemne self-testing podwaja efektywność. Po sesji — zostaw materiał na 3 dni. Mózg konsoliduje. Po roku zobaczysz, że to nie była strata.', en: 'Choose ONE primary technique (usually Anki), stick to it for 90 days, only then add others. Invest in desk ergonomics (second monitor, good chair) — dozens of hours weekly, pays off. Find one study partner — mutual self-testing doubles effectiveness. After exams — leave the material for 3 days. The brain consolidates. After a year you\'ll see it wasn\'t wasted.' }
  },
  {
    icon: '⬢',
    range: '25—50',
    name: { pl: 'Dorośli pracujący', en: 'Working adults' },
    blurb: { pl: 'Brak czasu, ale dojrzała kora i jasny cel. Mikro-sesje 10 min utylitarnej nauki — języki, prezentacje, imiona klientów.', en: 'No time, but mature cortex and clear goals. Micro-sessions of 10 min utility learning — languages, presentations, client names.' },
    characteristics: { pl: 'Mózg dojrzały, mielinizacja zakończona, ale plastyczność wciąż wysoka — neurogeneza w hipokampie do końca życia (Boldrini et al., 2018). Doświadczenie życiowe i zawodowe daje gęstą sieć skojarzeń — to przewaga nad młodszymi. Pamięć robocza nieco wolniejsza niż w 20 latach, ale za to lepsza kontrola uwagi i strategie.', en: 'Mature brain, myelination complete, but plasticity still high — neurogenesis in the hippocampus throughout life (Boldrini et al., 2018). Life and professional experience gives a dense network of associations — an advantage over younger learners. Working memory slightly slower than at 20, but better attention control and strategies.' },
    challenges: { pl: 'Praca na pełen etat + rodzina = 1–2 godziny dziennie wolnego, jeśli wolnego. Wysokie tempo zawodowe, stres podwyższa kortyzol, kortyzol osłabia hipokamp. Nowe wyzwania: język na awans, certyfikaty, zmiana branży, nowe technologie. Wieczorna konsola/Netflix po pracy obniża focus i jakość snu. Mit „za stary na naukę" — szkodliwy, statystycznie nieprawdziwy.', en: 'Full-time work + family = 1–2 hours daily of free time, if any. High professional pace, stress raises cortisol, cortisol weakens the hippocampus. New challenges: language for promotion, certifications, career change, new technologies. Evening console/Netflix lowers focus and sleep quality. The myth „too old to learn" — harmful and statistically false.' },
    goals: { pl: 'Mikro-sesje 10–15 min wkomponowane w dzień (commute, kawa, kolejka). Nauka utylitarna — to, co przekłada się na pracę i życie. Świadoma profilaktyka kognitywna — ruch + nauka nowego języka co rok = chroni przed dementią. Pamięć imion i twarzy na konferencjach (przewaga zawodowa).', en: 'Micro-sessions of 10–15 min built into the day (commute, coffee, queue). Utility learning — what translates to work and life. Conscious cognitive prevention — movement + learning a new language each year = protection against dementia. Names and faces memory at conferences (a professional edge).' },
    techniques: { pl: ['Anki micro-sessions — 5 min trzy razy dziennie (commute, lunch, przed snem)', 'Linkword dla języka biznesowego', 'Pałac dla wystąpień (TED-style — Cyceron miał rację)', 'Face-Feature-Link dla imion klientów i partnerów', 'Active recall po szkoleniach i kursach online', 'Mapa myśli przed prezentacją — całość projektu na jednej kartce'], en: ['Anki micro-sessions — 5 min three times daily (commute, lunch, before sleep)', 'Linkword for business language', 'Palace for talks (TED-style — Cicero was right)', 'Face-Feature-Link for client and partner names', 'Active recall after training and online courses', 'Mind map before presentations — whole project on one page'] },
    dailyPlan: { pl: '3× dziennie po 5–10 min Anki: commute do pracy (telefon), w przerwie obiadowej, przed snem. 1 wystąpienie / spotkanie tygodniowo z pełnym przygotowaniem przez pałac. Sport 3× w tygodniu po 30 min (HIIT lub bieg). Sobotnia 1-godzinna sesja głębokiej nauki (jeden rozdział + recall). Sen 7–8 godzin, telefon poza sypialnią.', en: '3× daily for 5–10 min Anki: commute (phone), lunch break, before sleep. 1 talk / meeting weekly with full palace preparation. Sport 3× weekly for 30 min (HIIT or run). Saturday 1-hour deep study session (one chapter + recall). Sleep 7–8h, phone outside the bedroom.' },
    example: { pl: 'Tomek (37, project manager IT, Warszawa) — TED-style prezentacja na 250 osób bez kartki. Tydzień przygotowania: pałac w starym mieszkaniu rodziców, 15 loci, każdy = jedna myśl + jeden konkret. Zero zająknięć, 8.4/10 oceny publiczności, awans w 3 miesiące później. Magdalena (42, dyrektor HR) zapamiętuje imiona 80 nowych pracowników w roku przez Face-Feature-Link, co buduje jej reputację „szefowej, która zna wszystkich". Marek (45, lekarz rodzinny) używa Anki dla nowych protokołów EBM — 200 fiszek, 10 minut dziennie, mniej błędów diagnostycznych.', en: 'Tomek (37, IT project manager, Warsaw) — TED-style talk to 250 people without notes. A week of prep: palace in his parents\' old flat, 15 loci, each = one thought + one concrete fact. Zero stumbles, 8.4/10 audience rating, promotion three months later.' },
    pitfalls: { pl: '„Zajmę się tym w weekend" = nigdy. Duolingo bez Anki = 80% zapomniane w 3 miesiące. Nauka wieczorna po 23:00 = 50% efektywności i niszczy sen. Próba szkoły wieczorowej + 10h pracy + dziecko = wypalenie w semestr. Bez ruchu hipokamp się kurczy o 1–2% rocznie po 40-tce — to mierzalne na MRI.', en: '„I\'ll do it this weekend" = never. Duolingo without Anki = 80% forgotten in 3 months. Studying after 11 PM = 50% effectiveness and ruins sleep. Evening school + 10h work + a child = burnout in one semester. Without movement, the hippocampus shrinks 1–2% per year after 40 — measurable on MRI.' },
    advice: { pl: 'Pierwsze 30 dni jednej techniki (zwykle Anki). Pamiętaj że 10 min dziennie > 2h raz w tygodniu (mózg konsoliduje przez sen, nie przez czas). Język obcy raz w roku — nie żeby być fluent, ale żeby utrzymać sieć. Imiona ludzi to twoja waluta zawodowa — inwestuj. Jeśli masz rodzinę, włącz dzieci w naukę: 15 min wspólnego Anki to genialny czas razem.', en: 'First 30 days, one technique (usually Anki). Remember 10 min daily > 2h weekly (the brain consolidates through sleep, not time). One new language a year — not to be fluent, but to maintain the network. People\'s names are your professional currency — invest. If you have family, include children: 15 min joint Anki is brilliant time together.' }
  },
  {
    icon: '⊙',
    range: '50+',
    name: { pl: 'Seniorzy', en: 'Seniors' },
    blurb: { pl: 'Plastyczność jest do końca życia. Ruch, nauka nowej umiejętności i grupa to trzy filary ochrony pamięci.', en: 'Plasticity is lifelong. Movement, learning a new skill, and a community are the three pillars of memory protection.' },
    characteristics: { pl: 'Spowolnienie pamięci roboczej i szybkości przetwarzania, ale pamięć semantyczna i autobiograficzna stabilna lub nawet bogatsza niż w młodości. **Mózg wciąż plastyczny** — neurogeneza w hipokampie do końca życia (Boldrini et al., 2018, Cell). Doświadczenie życiowe daje gęstą sieć skojarzeń — to przewaga nad młodymi: nowe informacje mają się gdzie zakorzenić.', en: 'Slower working memory and processing speed, but semantic and autobiographical memory stable or even richer than in youth. **The brain remains plastic** — hippocampal neurogenesis throughout life (Boldrini et al., 2018, Cell). Life experience gives a dense network — an advantage over the young: new information has a place to take root.' },
    challenges: { pl: 'Spowolnienie kodowania nowego materiału, więcej momentów „na końcu języka", lęk przed demencją (często przesadny, ale realny). Izolacja społeczna po emeryturze — czynnik ryzyka demencji większy niż palenie (Holt-Lunstad 2015). Mniej wyzwań intelektualnych po opuszczeniu pracy. Powolny ubytek hipokampu (~1% rocznie bez interwencji), ale RUCH I NAUKA TO ODWRACAJĄ.', en: 'Slower encoding of new material, more „tip of tongue" moments, fear of dementia (often overstated, but real). Social isolation after retirement — a dementia risk factor greater than smoking (Holt-Lunstad 2015). Fewer intellectual challenges after leaving work. Slow hippocampal loss (~1% yearly without intervention), but MOVEMENT AND LEARNING REVERSE THIS.' },
    goals: { pl: 'Utrzymanie sprawności kognitywnej. Poszerzenie sieci neuronowych przez NOWE domeny (taniec, instrument, język obcy, malowanie). Ochrona przed atrofią hipokampu — udokumentowane: bilingwizm daje +4–5 lat ochrony przed demencją (Bialystok et al., 2007). Kontakt z grupą kilka razy w tygodniu. Jakość snu (po 65-tce sen głęboki spada o 75% — trzeba o niego zadbać).', en: 'Maintain cognitive sharpness. Extend neural networks through NEW domains (dance, instrument, foreign language, painting). Protect against hippocampal atrophy — documented: bilingualism gives +4–5 years of dementia protection (Bialystok et al., 2007). Contact with a group several times weekly. Sleep quality (after 65, deep sleep drops 75% — actively tend it).' },
    techniques: { pl: ['Łańcuch skojarzeń — najprostszy i najbardziej naturalny, korzysta z bogatej autobiograficznej pamięci', 'Mapa myśli — notowanie życia, wspomnień, projektów', 'Anki dla ulubionej dziedziny (poezja, historia, ornitologia, wnuki w fotografiach)', 'Pałac dla codziennych zadań („dziś: apteka, urząd, telefon do córki")', 'Jeden nowy język obcy — 15 min/dzień przez 5 lat = poziom B1', 'Taniec / tai chi / instrument — angażują pamięć motoryczną i przestrzenną'], en: ['Link method — simplest and most natural, uses the rich autobiographical memory', 'Mind map — for life notes, memories, projects', 'Anki for a beloved domain (poetry, history, birding, grandchildren in photos)', 'Palace for daily tasks („today: pharmacy, office, call to daughter")', 'One new foreign language — 15 min/day for 5 years = B1 level', 'Dance / tai chi / instrument — engage motor and spatial memory'] },
    dailyPlan: { pl: '30–45 min ruchu aerobowego CODZIENNIE (BDNF, neurogeneza) — najważniejsze ze wszystkiego. 20 min nauki nowej umiejętności. Kontakt z grupą min. 3× w tygodniu (UTW, klub książki, chór, partia szachów). Sen 7–8 godzin, regularne pory (rano światło słoneczne 10 min — synchronizacja rytmu okołodobowego). Drobny stres (zimna woda, krótki post) raz na 2 tygodnie — hormeza.', en: '30–45 min aerobic movement DAILY (BDNF, neurogenesis) — the most important of all. 20 min learning a new skill. Group contact at least 3× weekly (third-age university, book club, choir, chess club). Sleep 7–8h, regular times (morning sunlight 10 min — circadian sync). Minor stress (cold water, brief fasting) every 2 weeks — hormesis.' },
    example: { pl: '73-letnia Wanda z Lublina — emerytowana nauczycielka. Po wstąpieniu do UTW (Uniwersytet Trzeciego Wieku) zaczęła hiszpański przez Linkword + Anki, codziennie 20 min. 4 lata: poziom B1, samodzielna podróż do Madrytu, korespondencja z hiszpańską przyjaciółką. Test pamięci roboczej powyżej średniej dla 50-latków. Edward (68, Łódź) — nauczył się gry na harmonijce ustnej zaczynając od zera, gra w lokalnym zespole bluesowym; jego MRI hipokampu po 3 latach wskazuje WZROST objętości — zjawisko opisane w literaturze (Reuter-Lorenz 2015).', en: 'Wanda (73, Lublin) — retired teacher. After joining the Third-Age University she started Spanish via Linkword + Anki, 20 min daily. 4 years: B1 level, solo trip to Madrid, correspondence with a Spanish friend. Working memory test above average for 50-year-olds.' },
    pitfalls: { pl: 'Rezygnacja na zasadzie „już za późno" — najgorsza decyzja kognitywna w życiu. Bierne TV >3h dziennie skraca kognitywne życie o 5–10 lat (Hamer & Stamatakis 2014). Izolacja społeczna jest neurotoksyczna — większy czynnik ryzyka niż palenie. Suplementy „na pamięć" (ginkgo, omega bez kontekstu, lecytyna) bez ruchu i nauki = placebo + strata pieniędzy. Alkohol >7 jednostek/tydzień przyspiesza atrofię hipokampu.', en: 'Quitting because „it\'s too late" — the worst cognitive decision of a lifetime. Passive TV >3h daily shortens cognitive life by 5–10 years (Hamer & Stamatakis 2014). Social isolation is neurotoxic — a greater risk factor than smoking. Memory supplements (ginkgo, isolated omega, lecithin) without movement and learning = placebo + lost money. Alcohol >7 units/week accelerates hippocampal atrophy.' },
    advice: { pl: 'Dla siebie i bliskich: ruch jest #1 lekiem na pamięć — lepszy niż jakikolwiek dostępny lek (efekt udokumentowany w setkach badań). Nauka NOWEGO języka daje +4–5 lat ochrony przed demencją; nie musisz być fluent, sam proces wystarczy. Samotność jest neurotoksyczna — dzwoń do dzieci, dołącz do grupy, weź psa. „Use it or lose it" jest dosłowne na poziomie neuronalnym. Plastyczność istnieje do ostatniego dnia życia — pytanie tylko czy ją wykorzystasz.', en: 'For yourself and loved ones: movement is the #1 memory medicine — better than any available drug (effect documented in hundreds of studies). Learning a NEW language gives +4–5 years of dementia protection; you don\'t need fluency, the process is enough. Loneliness is neurotoxic — call your children, join a group, get a dog. „Use it or lose it" is literal at the neural level. Plasticity exists until the last day of life — the only question is whether you use it.' }
  }
];

const agesGrid = document.getElementById('agesGrid');
const renderAges = () => {
  const L = lang();
  agesGrid.innerHTML = AGES.map((a, i) => `
    <div class="age-card" data-age-idx="${i}">
      <div class="age-icon">${a.icon}</div>
      <div class="age-range">${a.range}</div>
      <h3>${a.name[L]}</h3>
      <p>${a.blurb[L]}</p>
      <div class="age-arrow">→</div>
    </div>
  `).join('');
  agesGrid.querySelectorAll('.age-card').forEach(card => {
    card.addEventListener('click', () => openAgeModal(parseInt(card.dataset.ageIdx, 10)));
  });
};
renderAges();

// ============= AGE MODAL =============
const ageModal = document.getElementById('ageModal');
const ageModalContent = document.getElementById('ageModalContent');
const ageModalClose = document.getElementById('ageModalClose');
const ageModalBackdrop = ageModal?.querySelector('.modal-backdrop');

const openAgeModal = (idx) => {
  const a = AGES[idx];
  if (!a) return;
  const L = lang();
  const techList = (a.techniques[L] || []).map(t => `<li>${t}</li>`).join('');
  ageModalContent.innerHTML = `
    <div class="am-header">
      <div class="am-icon">${a.icon}</div>
      <div>
        <div class="am-range">${a.range}</div>
        <h3 class="am-title">${a.name[L]}</h3>
        <p class="am-blurb">${a.blurb[L]}</p>
      </div>
    </div>
    <section class="am-section">
      <h4>${t9n('Charakterystyka', 'Characteristics')}</h4>
      <p>${a.characteristics[L]}</p>
    </section>
    <section class="am-section">
      <h4>${t9n('Wyzwania', 'Challenges')}</h4>
      <p>${a.challenges[L]}</p>
    </section>
    <section class="am-section">
      <h4>${t9n('Cele', 'Goals')}</h4>
      <p>${a.goals[L]}</p>
    </section>
    <section class="am-section">
      <h4>${t9n('Rekomendowane techniki', 'Recommended techniques')}</h4>
      <ul class="am-techniques">${techList}</ul>
    </section>
    <section class="am-section">
      <h4>${t9n('Plan dnia', 'Daily plan')}</h4>
      <p>${a.dailyPlan[L]}</p>
    </section>
    <section class="am-section">
      <h4>${t9n('Przykład', 'Example')}</h4>
      <p class="am-example">${a.example[L]}</p>
    </section>
    <section class="am-section am-pitfalls">
      <h4>${t9n('Pułapki', 'Pitfalls')}</h4>
      <p>${a.pitfalls[L]}</p>
    </section>
    <section class="am-section am-advice">
      <h4>${t9n('Rada', 'Advice')}</h4>
      <p>${a.advice[L]}</p>
    </section>
  `;
  ageModal.classList.add('open');
  document.body.style.overflow = 'hidden';
};
const closeAgeModal = () => {
  ageModal?.classList.remove('open');
  document.body.style.overflow = '';
};
ageModalClose?.addEventListener('click', closeAgeModal);
ageModalBackdrop?.addEventListener('click', closeAgeModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && ageModal?.classList.contains('open')) closeAgeModal();
});

// re-render on language change
document.addEventListener('mnemo-lang-change', () => {
  renderMasters();
  const activeFilter = document.querySelector('.filter.active');
  renderTechniques(activeFilter ? activeFilter.dataset.filter : 'all');
  renderAges();
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
