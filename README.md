# MNEMO

> **Bilingwalny portal + gra solo do doskonalenia pamięci.**
> *Bilingual portal + solo game for memory improvement.*
> Od Symonidesa do mistrzostw świata XXI wieku · od Cycerona do SuperMemo · od Bruna do Anki.

---

## 🎯 Czym jest projekt

**MNEMO** to trzyczęściowa publikacja webowa (jednorazowo statyczna, bez backendu):

| Część | Co to jest | Pliki |
|---|---|---|
| **Portal** | Główna strona — manifest, zasady, historia, mistrzowie, Bruno, techniki, wiek, kompendium, gra | `portal/index.html` + `portal/styles.css` + `portal/app.js` |
| **Kompendium** | 14 rozdziałów PL + 9 EN — pełne kompendium w MD, czytelnik HTML, specjalna monografia Bruno | `kompendium/` (MD pliki + viewer + bruno) |
| **Gra solo** | 9 ćwiczeń z mnemotechniki — od match po koło Bruna | `portal/games/*.html` |

Oraz: pełna lokalizacja **PL ↔ EN**, light/dark theme, persistencja w `localStorage`, brak trackerów, brak loginu, brak buildu.

---

## 🚀 Szybki start

**Wymagania:** dowolny serwer statyczny. Najprościej:

```bash
cd /ścieżka/do/MNEMO
python3 -m http.server 5731
# otwórz http://localhost:5731/
```

Strona startowa (`/index.html`) przekierowuje do `/portal/`. Możesz też wejść bezpośrednio na `/portal/`, `/kompendium/`, `/portal/games/`.

**Deployment:** GitHub Pages, Netlify, Cloudflare Pages, jakikolwiek hosting plików statycznych. Nic do zbudowania, nic do skompilowania.

---

## 🧱 Stack

- **HTML / CSS / Vanilla JS** (zero buildu, zero zależności npm)
- **marked.js** (CDN, tylko w `kompendium/viewer.html` do parsowania MD)
- **Google Fonts**: Cormorant Garamond (serif display), Inter (sans), JetBrains Mono (mono)
- Wszystko działa offline po pierwszym załadowaniu fontów

**Decyzja architektoniczna:** żadnego frameworka, żadnego transpilera, żadnego node_modules. Każdy plik HTML samodzielnie się otwiera w przeglądarce. Najdłużej żyjąca opcja, najprostsza do utrzymania, najbardziej przyjazna dla LLM-ów do edycji.

---

## 📁 Pełna struktura

```
MNEMO/
├── index.html                  # Redirect do /portal/
├── README.md                   # Ten plik
├── .gitignore
│
├── portal/                     # GŁÓWNA STRONA
│   ├── index.html              # Wszystkie sekcje portalu
│   ├── styles.css              # Pełen stylesheet portalu
│   ├── app.js                  # Logika: lang, theme, masters, techniques, koło Bruna
│   │
│   └── games/                  # 9 GIER
│       ├── index.html          # Menu gier
│       ├── games.css           # Wspólne style gier
│       ├── games.js            # Wspólne utilities (MNEMO.lang, MNEMO.t, scoring)
│       ├── match.html          # 01 Memory Match
│       ├── palace.html         # 02 Pałac pamięci
│       ├── numbers.html        # 03 Number-Shape
│       ├── major.html          # 04 System Major
│       ├── chain.html          # 05 Łańcuch skojarzeń
│       ├── wheel.html          # 06 Koło Bruna (rozbudowane)
│       ├── pao.html            # 07 System PAO
│       ├── pi.html             # 08 Cyfry π
│       └── faces.html          # 09 Imiona i twarze
│
└── kompendium/                 # KOMPENDIUM
    ├── index.html              # Spis treści (5 części, 23 rozdziały)
    ├── viewer.html             # Czytelnik MD (marked.js, ToC, scrollspy)
    ├── bruno.html              # SPECJALNA monografia Bruno (12 sekcji custom)
    ├── kompendium.css          # Style indexu i viewera
    ├── kompendium.js           # Wspólne utilities (MNEMO.lang, MNEMO.t)
    ├── bruno.css               # Style monografii Bruno
    │
    ├── pl/                     # 14 rozdziałów PL (.md)
    │   ├── 00-wprowadzenie.md
    │   ├── 01-historia.md
    │   ├── 02-nauka-o-pamieci.md
    │   ├── 03-zasady.md
    │   ├── 04-techniki-klasyczne.md
    │   ├── 05-metody-wspolczesne.md
    │   ├── 06-mistrzowie.md
    │   ├── 07-styl-zycia.md
    │   ├── 08-aplikacja-wiekowa.md
    │   ├── 09-pulapki-mity.md
    │   ├── 10-cwiczenia.md
    │   ├── 11-narzedzia.md
    │   ├── 12-sciezka-osobista.md
    │   └── 13-giordano-bruno.md      # ← treść użyta przez bruno.html
    │
    └── en/                     # 9 rozdziałów EN (.md)
        ├── 00-introduction.md
        ├── 01-history.md
        ├── 02-science.md
        ├── 03-principles.md
        ├── 04-techniques.md
        ├── 05-masters.md
        ├── 06-lifestyle-age-pitfalls.md
        ├── 07-exercises-tools-path.md
        └── 13-giordano-bruno.md
```

---

## 🌍 Lokalizacja PL ↔ EN

Każda strona implementuje **ten sam wzorzec**:

### 1. Markup z `data-pl` i `data-en`

```html
<a href="#x" data-pl="Uwertura" data-en="Overture">Uwertura</a>
```

Element wyświetla domyślnie tekst PL; po toggle języka JS podmienia `textContent` na właściwy atrybut.

### 2. Setter w JS

```js
const setLang = (lang) => {
  root.setAttribute('lang', lang);
  document.body.setAttribute('data-lang', lang);
  document.querySelectorAll('[data-pl][data-en]').forEach(el => {
    el.textContent = el.getAttribute('data-' + lang);
  });
  localStorage.setItem('mnemo-lang', lang);
  document.dispatchEvent(new CustomEvent('mnemo-lang-change', { detail: lang }));
};
```

### 3. Helper dla dynamicznych części

W `kompendium/kompendium.js` i `portal/games/games.js`:

```js
window.MNEMO = {
  lang: () => root.getAttribute('lang') || 'pl',
  onLangChange: (cb) => document.addEventListener('mnemo-lang-change', e => cb(e.detail)),
  t: (pl, en) => root.getAttribute('lang') === 'en' ? en : pl
};
```

Używaj `MNEMO.t('foo', 'bar')` lub `MNEMO.onLangChange(() => rerender())` w grach i viewerze.

### 4. Re-render kart przy zmianie języka

W `portal/app.js` mistrzowie i techniki są renderowane dynamicznie z tablic w stylu:

```js
{
  name: 'Cyceron',
  nameEn: 'Cicero',
  dates: { pl: '106 — 43 p.n.e.', en: '106 — 43 BCE' },
  tag: { pl: 'Pamięć w retoryce', en: 'Memory in rhetoric' },
  bio: { pl: '...', en: '...' },
  tags: { pl: ['retoryka', 'starożytność'], en: ['rhetoric', 'antiquity'] }
}
```

Po `mnemo-lang-change` wywoływane są `renderMasters()` i `renderTechniques(activeFilter)`.

**ZASADA NACZELNA:** żadnych mieszanych języków. Jeśli dodajesz nowe pole tekstowe — zawsze para `{ pl, en }` lub atrybuty `data-pl`/`data-en`.

---

## 🎨 Design system

### Kolory (CSS variables)

```css
--paper:        #f5f1e8   /* tło — papierowy off-white */
--paper-deep:   #ece6d6   /* tło ciemniejsze (akcent) */
--paper-page:   #faf6ec   /* karty */
--ink:          #0e0e0d   /* tekst, krawędzie */
--ink-soft:     #2a2825   /* body text */
--ink-mute:     #6b6b6b   /* meta, etykiety */
--vermillion:   #c8401f   /* akcent renesansowy — używać OSZCZĘDNIE */
--gold:         #b8924a   /* drugi akcent — daty, eyebrows */
```

W dark mode wszystko się odwraca (`[data-theme="dark"]`). Light jest defaultem.

### Typografia

```css
--serif: 'Cormorant Garamond';   /* display, tytuły, cytaty, italic */
--sans:  'Inter';                 /* body */
--mono:  'JetBrains Mono';        /* eyebrows, daty, kod */
```

**Konwencja:** serif dla wszystkiego co "literackie" (tytuły, cytaty, italic emfazy), sans dla treści, mono tylko dla małych etykiet i numeracji.

### Easing

```css
--ease:     cubic-bezier(0.65, 0, 0.35, 1);   /* in-out, dla większości */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);    /* dla wejść/spinów */
```

### Inspiracje wizualne

- **Huncwot, MamaStudio** — modułowa siatka, kontrast typo, czerń
- **Webby Awards winners** — drop caps, asymetryczne layouty, hover transitions
- **Renesansowe traktaty** — proporcje, ozdobniki (✦), seriffy

---

## ✏️ Gdzie co edytować — szybki przewodnik

| Chcesz zmienić | Edytuj |
|---|---|
| **Tekst sekcji portalu** (manifest, zasady, etc.) | `portal/index.html` — zawsze zachowaj `data-pl` + `data-en` |
| **Listę mistrzów / dodać nowego** | `portal/app.js` → tablica `MASTERS` (struktura: name, nameEn, dates, tag, bio, tags) |
| **Listę technik / dodać nową** | `portal/app.js` → tablica `TECHNIQUES` |
| **Etykiety poziomów / kategorii technik** | `portal/app.js` → `LEVEL_LABEL`, `USE_LABEL` |
| **Wydarzenia linii czasu** | `portal/index.html` → sekcja `#timeline` (statyczne markupy) |
| **Treść kompendium** | `kompendium/pl/*.md` lub `kompendium/en/*.md` (czysty Markdown) |
| **Layout monografii Bruno** | `kompendium/bruno.html` + `kompendium/bruno.css` (NIE viewer — to custom) |
| **Spis kompendium** | `kompendium/index.html` |
| **Logikę gry** | `portal/games/<nazwa>.html` (każda gra to samodzielny HTML z osadzonym JS) |
| **Wspólne style portalu** | `portal/styles.css` |
| **Wspólne style gier** | `portal/games/games.css` |
| **Wspólne style kompendium** | `kompendium/kompendium.css` |
| **Color/font tokens** | wszystkie 3 pliki CSS — *tej samej palety używamy wszędzie* |

### Dodawanie nowego rozdziału kompendium

1. Utwórz `kompendium/pl/14-nowa-nazwa.md` (czysty MD)
2. Dodaj wpis do `kompendium/index.html` w odpowiedniej części `<section class="part">`
3. Dodaj wpis do listy `CHAPTERS_PL` w `kompendium/viewer.html` (dla nawigacji prev/next)
4. Opcjonalnie: dodaj wersję EN i wpis do `CHAPTERS_EN`

### Dodawanie nowej gry

1. Skopiuj `portal/games/match.html` jako wzorzec
2. Zmień `<title>`, `game-eyebrow`, `game-title`, `game-instructions`
3. Napisz logikę w `<script>` na dole — używaj `MNEMO.t()`, `MNEMO.lang()`, `MNEMO.onLangChange()`
4. Wykorzystaj `MNEMO.saveScore('nazwagry', value)` i `MNEMO.getBestScore('nazwagry')` z `games.js`
5. Dodaj kafel do `portal/games/index.html` z numerem 10+
6. Dodaj kafel do `portal/index.html` w sekcji `#game-cta` (`.game-tiles`)

---

## 🧠 Konwencje kodu

- **IIFE** dla każdego skryptu osadzonego w HTML — żadnych wycieków do globalu
- **Vanilla DOM API** — żadnego jQuery, React, Vue
- **Fetch zamiast XHR**, async/await zamiast callbacks
- **Małe funkcje, duże struktury danych** — łatwiej dodawać nowe wpisy w tablicach niż refaktorować logikę
- **Nazwy klas po angielsku** (BEM-ish: `.master-card`, `.tech-eyebrow`)
- **Nazwy plików kompendium** — slug po polsku w `pl/`, po angielsku w `en/`
- **Komentarze w CSS** dzielą sekcje (`/* ===== HERO ===== */`)

---

## 🚧 Możliwe rozszerzenia

Pomysły, które nie zostały (jeszcze) zrealizowane:

- **Multiplayer** w Memory League stylu (WebSocket lub Firebase)
- **Konto użytkownika** z synchronizacją wyników (na razie tylko `localStorage`)
- **Spaced repetition własne** — implementacja SM-2 jako 10. gra
- **Audio mode** — czytanie cytatów Bruna (Web Speech API)
- **Mobile app** — wrap w PWA (manifest.json + SW), gotowy do instalacji
- **PDF export** kompendium (poprzez Print CSS lub puppeteer)
- **Analityka** (Plausible / Umami — bez ciasteczek)
- **Więcej języków** (DE, FR, IT) — system już wspiera, wystarczy dorzucić atrybuty `data-de`, `data-fr` i opcję w setLang

---

## 🤖 Notka dla AI (vibe coding)

Jeśli przejmujesz projekt z innym LLM:

1. **Trzymaj się trzech plików stylów** (portal/styles.css, kompendium/kompendium.css, portal/games/games.css). Jedna paleta. Nie wymyślaj nowych kolorów; jeśli musisz — dodaj zmienną do `:root`.
2. **Lokalizacja jest święta** — każdy nowy tekst dostaje `{ pl, en }` lub `data-pl`/`data-en`. Nigdy mieszanki.
3. **Bruno ma własne reguły** — `bruno.html` jest custom, nie używa viewera. Nie próbuj go "ujednolicać" z resztą kompendium; jego waga wizualna jest celowa (jest patronem osobnym).
4. **Vermillion (cynober) tylko jako akcent** — nie używaj go jako tła całych sekcji (oprócz hero Bruno i lessons w Bruno).
5. **Bez frameworka** — nie sięgaj po Reacta/Vue. Vanilla działa, jest szybkie, nie wymaga buildu, AI łatwo edytuje.
6. **Bez trackerów** — manifest projektu mówi "bez logowania, bez śledzenia, bez reklam". Nie dodawaj GA/FB pixel.
7. **Jeśli dodajesz npm packages** — przemyśl. Ten projekt celowo nie ma `node_modules`. Jeśli koniecznie — udokumentuj w README.
8. **Twórz feature branche** dla większych zmian. Małe poprawki na main.

### Polecenia weryfikacji po zmianach

```bash
# Sprawdź czy nie ma battle .md linków (powinny być .html)
grep -rn "kompendium/.*\.md\"" portal/

# Sprawdź czy każdy nowy element ma para data-pl/data-en
grep -E "data-(pl|en)=" portal/index.html | wc -l

# Lokalny serwer
python3 -m http.server 5731
```

---

## 📜 Filozofia projektu

- **Pamięć jest fundamentem** wszystkiego. Bez pamięci nie ma tożsamości, kreatywności, krytycznego myślenia.
- **Sztuka pamięci** ma 2 500+ lat tradycji. Dziś, gdy outsourcujemy ją smartfonom, warto ją odzyskać — nie po to, by konkurować z chmurą, ale by mieć wewnętrzny instrument myślenia.
- **Joshua Foer:** "Nie jesteśmy wyjątkowi, tylko wyćwiczeni." — to jest teza projektu.
- **Bruno** jest patronem nie dlatego, że jego mnemotechnika jest najpraktyczniejsza (PAO Mullena jest skuteczniejszy do mistrzostw). Jest patronem, bo *najradykalniej pokazał, że pamięć to droga* — kosmiczna, hermetyczna, transformująca.

---

## 📖 Główne źródła

- Frances A. Yates · *The Art of Memory* (1966)
- Joshua Foer · *Moonwalking with Einstein* (2011)
- Hilary Gatti · *Giordano Bruno and Renaissance Science* (1999)
- Peter C. Brown, Henry L. Roediger III, Mark A. McDaniel · *Make It Stick* (2014)
- Hermann Ebbinghaus · *Über das Gedächtnis* (1885)
- Piotr Woźniak — algorytmy SuperMemo (1985–dziś)

---

## 🏛 Autor

Projekt zainicjowany przez [futureshow1](https://github.com/futureshow1).
Kompendium napisane na bazie własnych notatek (NotebookLM "theater of memory") + szerokiego researchu (Yates, Foer, badania PMC/NCBI, Stanford Encyclopedia of Philosophy, World Memory Championships, polskie ORE).
Code generated assist: Claude (Anthropic).

## 📝 Licencja

CC BY-NC-SA 4.0 dla treści kompendium · MIT dla kodu portalu i gier.

---

> **„Si vere et ad plenum scientiam habere desideramus, oportet ut ipsam transeamus realiter et per umbras."**
> — Giordano Bruno, *De umbris idearum*, 1582
