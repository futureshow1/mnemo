# 05. Współczesne metody uczenia się

Klasyczne mnemotechniki dotyczą **kodowania**. Współczesne metody uczenia się — głównie **konsolidacji i odzyskiwania**. Razem tworzą kompletny system.

## Spaced Repetition (rozproszone powtarzanie)

**Czym jest.** Powtarzanie materiału w rosnących odstępach czasu, dopasowanych tak, by powtórka padała tuż przed momentem zapomnienia.

**Tło historyczne.**

- **1885** — Hermann Ebbinghaus odkrywa krzywą zapominania i postuluje rozproszone uczenie się.
- **1932** — Cecil A. Mace w *Psychology of Study* opisuje praktyczny efekt spacingu.
- **1973** — Sebastian Leitner publikuje system pudełek (**Leitner Box**) — fiszki przesuwane między pudełkami w zależności od wyniku.
- **1985** — **Piotr Woźniak**, polski student informatyki w Poznaniu, tworzy program **SuperMemo** i pierwszy algorytm SM-0. Z czasem rozwija go do SM-2 (1987), który stoi do dziś za większością aplikacji do nauki ze fiszkami. SuperMemo jest **polskim wkładem światowej klasy** w naukę uczenia się.
- **2006** — powstaje **Anki** (japońskie *zapamiętywać*), open source, oparte o SM-2.
- **2023** — Anki dodaje algorytm **FSRS** (Free Spaced Repetition Scheduler), nowoczesną alternatywę uczącą się Twojego profilu zapominania.

**Algorytm SM-2 w skrócie.**

Po każdym powtórzeniu oceniasz, jak dobrze poszło (skala 0–5):

- 5: doskonale, natychmiast
- 4: poprawnie z wahaniem
- 3: trudne, ale poprawne
- 0–2: pomyłka

Algorytm na tej podstawie wylicza nowy interwał. Jeśli było łatwo — następny interwał × 2.5. Jeśli trudno — krótszy. Jeśli pomyłka — od początku.

**Praktyka.**

- Aplikacje: **Anki** (kanon, darmowe, nauka), **SuperMemo** (klasyk), **RemNote**, **Quizlet**, **Memrise**.
- Optymalna codzienna sesja: 15–30 minut.
- Reguła: lepiej **codziennie 15 minut** niż **raz w tygodniu 2 godziny**.
- Pierwsze 2–3 tygodnie są najtrudniejsze — krzywa zapominania jest stroma. Potem stabilizuje się.

## Active Recall (aktywne odzyskiwanie)

**Czym jest.** Zamiast czytać/podkreślać/przepisywać — **wymuś wydobycie informacji z pamięci**. Każda taka próba — udana czy nie — wzmacnia ślad.

**Eksperyment Roediger & Karpicke (2006), klasyczny.**

Studenci uczyli się tekstu naukowego.
- Grupa A: czytała 4 razy.
- Grupa B: czytała 1 raz, potem 3 razy testowała się (próbowała przypomnieć).

Po 5 minutach: grupa A nieco lepsza.
Po tygodniu: grupa B pamiętała **+50%** więcej.

**Praktyczne formy active recall:**

- **Zamknij książkę po rozdziale i wypisz wszystko, co pamiętasz.** Sprawdź, czego brak.
- **Fiszki** — pytanie z jednej strony, odpowiedź z drugiej. Kluczowe: najpierw spróbuj odpowiedzieć!
- **Quizy** — własne lub wygenerowane z notatek.
- **Nauczanie kogoś** (rodzeństwo, kolega, gumowa kaczka).
- **Mind dump** — zapisz wszystko, co wiesz na temat X, bez patrzenia w notatki.

**Dlaczego nie podkreślanie.** Meta-analiza Dunlosky'ego i wsp. (2013, *Psychological Science in the Public Interest*) sklasyfikowała 10 popularnych technik uczenia się. Active recall i spaced repetition — **wysoka efektywność**. Podkreślanie, ponowne czytanie, wyjaśnianie schematów — **niska efektywność, ale wysoka popularność**. Robimy nie to, co działa, tylko to, co jest łatwe.

## Metoda Feynmana

**Stworzona przez Richarda Feynmana**, fizyka i noblistę. Cztery kroki:

1. **Wybierz koncept** — temat, który chcesz zrozumieć.
2. **Wytłumacz go prostym językiem** — tak, jakbyś wyjaśniał dziecku. Pisz lub mów na głos.
3. **Zauważ, gdzie się zacinasz** — to są twoje rzeczywiste luki w zrozumieniu.
4. **Wróć do źródła**, douczy się, uprość jeszcze raz. Powtarzaj.

**Dlaczego działa.** Mózg ma sklonność do "iluzji wiedzy" — wydaje nam się, że rozumiemy, dopóki nie próbujemy wyjaśnić. Feynman demaskuje tę iluzję natychmiast.

Dodatkowy bonus: gdy wyjaśniasz prosto, **łączysz nową wiedzę z istniejącą siatką znaczeń** (elaboracja, zasada 12) — co dramatycznie wzmacnia zapamiętanie.

## Interleaving (przeplatanie)

**Idea.** Naprzemienne uczenie różnych typów problemów lepsze niż blok jednego typu.

**Eksperyment Rohrer & Pashler (2007).** Studenci uczący się rozwiązywać zadania z geometrii (objętości czterech rodzajów brył).

- Grupa "blokowa": 12 zadań typu A, 12 typu B, 12 typu C, 12 typu D.
- Grupa "interleaved": A B C D, znowu A B C D, na przemian.

Test po tygodniu: grupa interleaved — **63% trafień**, grupa blokowa — **20%**.

**Dlaczego.** W blokach mózg "zapomina" rozróżniać typy. Wszystkie rozwiązuje tym samym schematem. Po przeplataniu uczy się **diagnostyki** — co mam za problem, jaką metodę wybrać.

**Subiektywnie:** uczniowie z grupy interleaved czuli, że im idzie **gorzej** niż blokowej. To "desirable difficulty" — pożądana trudność. Mniejsza płynność w trakcie, większa biegłość po.

**Kiedy stosować.** Matematyka, języki, sport (rzuty z różnych odległości), muzyka (różne pasaże), egzaminy z ekspertyzą.

## Elaborative Interrogation (zadawanie "dlaczego?")

Po każdym fakcie pytaj **dlaczego tak jest?**. Generowanie własnego wyjaśnienia podwaja zapamiętanie.

Przykład — uczysz się: "Wenus jest najgorętszą planetą Układu Słonecznego, mimo że nie jest najbliższa Słońcu."

- **Dlaczego?** Bo ma gęstą atmosferę z CO₂ → potężny efekt cieplarniany.
- **A dlaczego CO₂ powoduje efekt cieplarniany?** Bo molekuła CO₂ pochłania długie fale podczerwone wypromieniowywane z powierzchni planety.

Każde pytanie buduje sieć powiązań. Po roku pamiętasz nie tylko fakt, ale całe wyjaśnienie.

## Self-Explanation

Wariacja Feynmana / elaborative interrogation. Po każdym kroku rozumowania **wyjaśnij sobie**, dlaczego ten krok wygląda tak.

W matematyce: rozwiązując zadanie, po każdej linijce zapisz **co tu zrobiłem i dlaczego ten ruch**. Skutkuje znacznie lepszym transferem do nowych zadań.

## Dual Coding (kodowanie dwukanałowe)

Wprowadzone już w sekcji 03 (zasada 4). W praktyce:

- **Słowo + obraz** — fiszka z obrazem, nie tylko tłumaczeniem.
- **Tekst + diagram** — uczysz się anatomii? Rysuj struktury obok tekstu.
- **Wykład + mapa myśli** — robotę dwukanałową robisz w trakcie słuchania.
- **Wzór + wizualizacja jego działania** — sinus narysuj jako falę, nie tylko wzór.

## Pomodoro i cykle ultradian

**Pomodoro** (Francesco Cirillo, 1980) — pracujesz 25 minut, robisz przerwę 5 minut, po 4 cyklach dłuższa przerwa 15–30 min.

**Tło neurobiologiczne.** Mózg pracuje w **cyklach ultradian** ~90-minutowych. Przy zadaniach wymagających skupienia po 90 minutach poziom acetylocholiny i dopaminy spada — kontynuacja na siłę jest mniej efektywna.

Pomodoro **nie jest jedyną dobrą rytmiką**. Niektórym lepiej działa 50/10. Niektórym 90 minut głębokiej pracy + 20 minut pełnej przerwy. Zasada wspólna: **nie pracuj w nieskończoność**.

W przerwach: **odejdź od ekranu**, wyjdź na spacer, popatrz w dal, napij się wody. Bez scrollingu — to nie odpoczynek dla mózgu.

## Cornell Note-Taking

System notowania zaprojektowany w latach 50. na Uniwersytecie Cornell.

**Układ kartki:**

```
┌────────────────────────────────────┐
│         Tytuł / data               │
├──────────┬─────────────────────────┤
│          │                         │
│  Hasła,  │   Główne notatki        │
│ pytania, │   (z wykładu, lektury)  │
│ słowa    │                         │
│ klucze   │                         │
│          │                         │
├──────────┴─────────────────────────┤
│  Podsumowanie (max 3 zdania)       │
└────────────────────────────────────┘
```

- W prawej kolumnie notujesz na żywo.
- W lewej (po wykładzie) wpisujesz hasła/pytania.
- Na dole (tego samego dnia) — krótkie podsumowanie.
- Powtórki: zakrywasz prawą kolumnę, próbujesz odpowiedzieć z lewej (active recall!).

System łączy: dobrą strukturę, podsumowanie, active recall, podstawę do spaced repetition. Trzy w jednym.

## Łączenie metod — strategia kompletna

**Tygodniowy szkielet** dla studenta lub osoby uczącej się dużej dziedziny:

1. **Dzień 1 — wprowadzenie nowego materiału.** Czytaj/słuchaj. Notuj metodą Cornell albo mapą myśli (dual coding).
2. **Tego samego dnia, wieczorem — pierwsza repetycja.** 5 minut: zamknij notatki, wypisz, co pamiętasz (active recall + Feynman, jeśli możesz wyjaśnić koncept "dziecku").
3. **Dzień 2 — fiszki w Anki.** Wprowadź kluczowe pytania. Anki ułoży interwały (spaced repetition).
4. **Dzień 3–5 — interleaving.** Mieszaj nowy materiał z innymi przedmiotami. Nie ucz się 3 godzin tylko jednego.
5. **Dzień 7 — synteza.** Stwórz mapę myśli z całego tygodnia. Wytłumacz głośno, jakbyś uczył kogoś.
6. **Powtórki z Anki — codziennie 15–30 minut.** Reszta zajmuje się sobą.

Ta rutyna, prowadzona przez **6 miesięcy**, daje wyniki, których nie da żadna ilość wkuwania.
