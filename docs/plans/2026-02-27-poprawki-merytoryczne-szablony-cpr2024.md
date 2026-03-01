# Poprawki merytoryczne szablonów CPR 2024/3110 — Plan implementacji

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Naprawić błędy merytoryczne wykryte w audycie zgodności z CPR 2024/3110 — 2 krytyczne + 3 istotne + 3 drobne, rozkład na 4 pliki HTML.

**Architecture:** Edycje in-place istniejących plików HTML w `/public/docs/`. Brak zmian w TypeScript/React. Po wszystkich edycjach: 1 build + 1 commit + push.

**Tech Stack:** HTML/CSS (standalone print-ready), npm run build (Vite), GitHub Pages

---

## Priorytety zmian (z audytu)

| # | Plik | Problem | Waga |
|---|---|---|---|
| 1 | mandat-art23 | Brak zakazu "sporządzania DoP&C" w sekcji zakazów | 🔴 Krytyczne |
| 2 | mandat-art23 | Subtitle i UWAGA box sugerują tylko producenta spoza UE | 🔴 Błąd |
| 3 | importer-dopc | Brak sekcji "Zgodność" (C z DoP&C) — całe drugie człony deklaracji | 🟡 Istotne |
| 4 | importer-dopc | NB section zbyt skrótowa — nie rozróżnia AVS 1+/1/2+/3/3+ | 🟡 Istotne |
| 5 | dok-techniczna | Brak osobnego pola "Opis procedury AVS" (wymaga art. 21) | 🟡 Istotne |
| 6 | dok-techniczna | Checklist nie rozróżnia dokumentów wg AVS — brak adnotacji | 🟠 Drobne |
| 7 | instrukcja-art25 | Sekcja 2 nie ma "zastosowań niedopuszczalnych" | 🟠 Drobne |
| 8 | instrukcja-art25 | GWP100 bez adnotacji "dotyczy AVS 3+" | 🟠 Drobne |

---

## Task 1: mandat-przedstawiciela-art23.html — poprawki krytyczne (2 błędy)

**Plik:** `public/docs/mandat-przedstawiciela-art23.html`

### Krok 1: Napraw subtitle (błąd zakresu — nie tylko spoza UE)

**STARE (linia ~40):**
```html
<div class="subtitle">Wzór zgodny z Art. 23 Rozporządzenia (UE) 2024/3110<br>
Producent mający siedzibę poza Unią Europejską może wyznaczyć pisemnym mandatem upoważnionego przedstawiciela w UE</div>
```

**NOWE:**
```html
<div class="subtitle">Wzór zgodny z Art. 23 Rozporządzenia (UE) 2024/3110<br>
Każdy producent (w UE i spoza UE) może wyznaczyć pisemnym mandatem upoważnionego przedstawiciela — art. 23 ust. 1</div>
```

### Krok 2: Napraw UWAGA box (usunąć "spoza UE" zawężenie)

**STARE:**
```html
  ⚠️ <strong>UWAGA:</strong> Upoważniony przedstawiciel (art. 23) wykonuje obowiązki określone w mandacie. Mandatu nie można powierzyć ocenianiu właściwości użytkowych ani zakładowej kontroli produkcji (art. 23 ust. 3). Producent spoza UE musi mieć przedstawiciela lub importera dla wyrobów objętych CPR. Szablon edukacyjny — skonsultuj z prawnikiem przed podpisaniem.
```

**NOWE:**
```html
  ⚠️ <strong>UWAGA:</strong> Upoważniony przedstawiciel (art. 23) wykonuje wyłącznie obowiązki określone pisemnym mandatem. Art. 23 ust. 3 zakazuje powierzenia: (1) sporządzania DoP&amp;C, (2) przeprowadzania procedury AVS, (3) organizowania FPC. Producent spoza UE musi mieć AR lub importera — bez tego nie może wprowadzać wyrobów na rynek UE. Szablon edukacyjny — skonsultuj z prawnikiem przed podpisaniem.
```

### Krok 3: Napraw sekcję zakazów w section 4 — dodać brakujący zakaz sporządzania DoP&C

**STARE (note w section 4):**
```html
  <div class="note">⛔ ZAKAZ (art. 23 ust. 3): Mandatu nie można powierzyć dokonywaniu oceny właściwości użytkowych wyrobu ani organizowaniu i nadzorowaniu zakładowej kontroli produkcji (FPC). Te zadania pozostają wyłącznie po stronie producenta.</div>
```

**NOWE:**
```html
  <div class="note">⛔ ZAKAZ (art. 23 ust. 3) — mandatu <strong>nie można powierzyć</strong>:<br>
  (1) <strong>Sporządzania DoP&amp;C</strong> — deklarację wystawia wyłącznie producent lub importer (art. 17 ust. 3)<br>
  (2) <strong>Przeprowadzania procedury AVS</strong> — ocena właściwości użytkowych leży po stronie producenta<br>
  (3) <strong>Organizowania i nadzorowania FPC</strong> (zakładowej kontroli produkcji)<br>
  Naruszenie tych zakazów skutkuje nieważnością mandatu w zakresie zakazanych zadań.</div>
```

### Krok 4: Napraw sekcję 1 — usunąć zawężenie "spoza UE" z etykiety

**STARE:**
```html
  <div class="field"><label>Kraj siedziby (spoza UE):</label><div class="field-line"></div></div>
```

**NOWE:**
```html
  <div class="field"><label>Kraj siedziby producenta:</label><div class="field-line"></div></div>
```

### Weryfikacja Task 1
Otwórz w przeglądarce:
```bash
open /Users/admin/Downloads/nowy-cpr-pl/public/docs/mandat-przedstawiciela-art23.html
```
Sprawdź: subtitle bez "spoza UE" ✓ | UWAGA box z 3 zakazami ✓ | sekcja 4 z (1)(2)(3) w notatce ✓

---

## Task 2: importer-dopc-szablon.html — brakująca sekcja "Zgodność" (C z DoP&C)

**Plik:** `public/docs/importer-dopc-szablon.html`

### Krok 1: Rozszerzyć sekcję NB (sekcja 4) o rozróżnienie typów dokumentów NB wg AVS

**STARE (sekcja 4):**
```html
<div class="section">
  <h2>4. Podstawa deklaracji — norma / ETA</h2>
  <div class="field"><label>Norma zharmonizowana (hEN):</label><div class="field-line"></div></div>
  <div class="field"><label>lub: Europejska Ocena Techniczna (ETA) nr:</label><div class="field-line"></div></div>
  <div class="field"><label>System AVS (Zał. IX CPR 2024/3110):</label><div class="field-line"></div></div>
  <div class="field"><label>Jednostka notyfikowana (NB), nr:</label><div class="field-line"></div></div>
</div>
```

**NOWE:**
```html
<div class="section">
  <h2>4. Podstawa deklaracji — norma / ETA / system AVS</h2>
  <div class="field"><label>Norma zharmonizowana (hEN):</label><div class="field-line"></div></div>
  <div class="field"><label>lub: Europejska Ocena Techniczna (ETA) nr:</label><div class="field-line"></div></div>
  <div class="field"><label>System AVS (Zał. IX CPR 2024/3110):</label><div class="field-line"></div></div>
  <div class="field"><label>Nazwa jednostki notyfikowanej (NB):</label><div class="field-line"></div></div>
  <div class="field"><label>Nr identyfikacyjny NB:</label><div class="field-line"></div></div>
  <div class="field"><label>Rodzaj dokumentu NB (zakreślić):</label>
    <span style="font-size:9pt;">□ Certyfikat stałości właściwości (AVS 1+/1) &nbsp; □ Certyfikat zgodności FPC (AVS 2+) &nbsp; □ Sprawozdanie z badań (AVS 3) &nbsp; □ Walidacja EPD (AVS 3+)</span>
  </div>
  <div class="field"><label>Nr certyfikatu / sprawozdania NB:</label><div class="field-line"></div></div>
  <div class="note">Dla AVS 4 — brak udziału jednostki notyfikowanej; pola NB pozostawić puste. Dla AVS 1+/1 certyfikat NB jest warunkiem koniecznym DoP&amp;C.</div>
</div>
```

### Krok 2: Dodać sekcję "Zgodność (C)" między sekcją 6 (właściwości) a sekcją 7 (SVHC)

Nowa sekcja 7 — wstawiamy PRZED istniejącą `<h2>7. Substancje...`:

**STARE:**
```html
<div class="section">
  <h2>7. Substancje wzbudzające szczególne obawy (SVHC) — art. 15 ust. 6</h2>
```

**NOWE — wstawić nową sekcję 7 i zmienić numery następnych (SVHC → 8, Cyfrowy → 9, Oświadczenie → 10):**
```html
<div class="section">
  <h2>7. Zgodność z innymi wymaganiami UE (część „C" deklaracji)</h2>
  <p style="font-size:9pt; margin-bottom:8px;">
    DoP&amp;C obejmuje nie tylko właściwości użytkowe (część P), lecz również oświadczenie o zgodności wyrobu z innymi wymaganiami unijnego prawa harmonizacyjnego mającymi zastosowanie do tego wyrobu.
  </p>
  <table>
    <tr><th>Akt prawny UE</th><th>Dotyczy wyrobu</th><th>Status zgodności</th></tr>
    <tr><td>Rozporządzenie REACH (WE) nr 1907/2006</td><td style="text-align:center;">□ Tak / □ Nie</td><td></td></tr>
    <tr><td>Dyrektywa RoHS 2011/65/UE (jeśli dotyczy)</td><td style="text-align:center;">□ Tak / □ Nie</td><td></td></tr>
    <tr><td>Rozporządzenie o wyrobach budowlanych CPR 2024/3110</td><td style="text-align:center;">□ Tak</td><td>Niniejsza DoP&amp;C</td></tr>
    <tr><td>Inne (podać):</td><td style="text-align:center;">□ Tak / □ Nie</td><td></td></tr>
  </table>
  <div class="note">Część „C" (Conformity) jest nowym elementem CPR 2024/3110 (vs. stary DoP z CPR 305/2011). Potwierdza zgodność z całym mającym zastosowanie prawem harmonizacyjnym UE, nie tylko z CPR.</div>
</div>

<div class="section">
  <h2>8. Substancje wzbudzające szczególne obawy (SVHC) — art. 15 ust. 6</h2>
```

### Krok 3: Zmienić numery sekcji 7→8 (SVHC), 8→9 (Cyfrowy), 9→10 (Oświadczenie)

**STARE:**
```html
  <h2>8. Dostęp cyfrowy do deklaracji (art. 16)</h2>
```
**NOWE:**
```html
  <h2>9. Dostęp cyfrowy do deklaracji (art. 16)</h2>
```

**STARE:**
```html
  <h2>9. Oświadczenie importera</h2>
```
**NOWE:**
```html
  <h2>10. Oświadczenie importera</h2>
```

### Weryfikacja Task 2
```bash
open /Users/admin/Downloads/nowy-cpr-pl/public/docs/importer-dopc-szablon.html
```
Sprawdź: sekcja 7 "Zgodność" istnieje ✓ | tabela z REACH/RoHS/CPR ✓ | sekcja NB ma pola na rodzaj dokumentu ✓ | sekcje 8/9/10 poprawnie ponumerowane ✓

---

## Task 3: dokumentacja-techniczna-art21.html — opis procedury AVS + adnotacje AVS w checkliście

**Plik:** `public/docs/dokumentacja-techniczna-art21.html`

### Krok 1: Dodać osobne pole "Opis procedury AVS" w sekcji 1

**STARE:**
```html
  <div class="field"><label>System AVS (1+, 1, 2+, 3, 3+, 4):</label><div class="field-line"></div></div>
  <div class="field"><label>Data sporządzenia dokumentacji:</label><div class="field-line"></div></div>
```

**NOWE:**
```html
  <div class="field"><label>System AVS (1+, 1, 2+, 3, 3+, 4):</label><div class="field-line"></div></div>
  <div class="field"><label>Opis przeprowadzonej procedury AVS:</label><div class="field-line"></div></div>
  <div class="field"><label>(kto wykonał badania ITT, kto nadzorował FPC, wynik):</label><div class="field-line"></div></div>
  <div class="field"><label>Data sporządzenia dokumentacji:</label><div class="field-line"></div></div>
```

### Krok 2: Dodać adnotacje AVS do kluczowych pozycji checklisty (sekcja 4)

**STARE:**
```html
  <div class="checklist-item"><input type="checkbox"> <span>Certyfikat zgodności FPC wydany przez jednostkę notyfikowaną (AVS 2+)</span></div>
  <div class="checklist-item"><input type="checkbox"> <span>Certyfikat stałości właściwości użytkowych (AVS 1+, 1) — nr: ___________</span></div>
  <div class="checklist-item"><input type="checkbox"> <span>Sprawozdanie z badań jednostki notyfikowanej (AVS 3) — nr: ___________</span></div>
  <div class="checklist-item"><input type="checkbox"> <span>Deklaracja środowiskowa produktu EPD (AVS 3+) — nr: ___________</span></div>
```

**NOWE (dodać tylko notkę po checkliście NB/EPD — po ostatniej pozycji EPD):**
```html
  <div class="checklist-item"><input type="checkbox"> <span>Certyfikat zgodności FPC wydany przez jednostkę notyfikowaną (AVS 2+)</span></div>
  <div class="checklist-item"><input type="checkbox"> <span>Certyfikat stałości właściwości użytkowych (AVS 1+, 1) — nr: ___________</span></div>
  <div class="checklist-item"><input type="checkbox"> <span>Sprawozdanie z badań jednostki notyfikowanej (AVS 3) — nr: ___________</span></div>
  <div class="checklist-item"><input type="checkbox"> <span>Deklaracja środowiskowa produktu EPD (AVS 3+) — nr: ___________</span></div>
  <div class="note" style="margin-top:8px;">ℹ️ <strong>Uwaga do dokumentów NB:</strong> Dla AVS 4 — brak dokumentów NB (producent ocenia samodzielnie). Dla AVS 3 — sprawozdanie NB, brak certyfikatu. Dla AVS 2+ — certyfikat FPC od NB. Dla AVS 1/1+ — certyfikat stałości właściwości od NB. EPD jest wymagana wyłącznie dla AVS 3+.</div>
```

### Weryfikacja Task 3
```bash
open /Users/admin/Downloads/nowy-cpr-pl/public/docs/dokumentacja-techniczna-art21.html
```
Sprawdź: dwa pola "Opis procedury AVS" w sekcji 1 ✓ | nota AVS po checkliście NB/EPD ✓

---

## Task 4: instrukcja-uzytkownika-art25.html — zastosowania niedopuszczalne + GWP nota

**Plik:** `public/docs/instrukcja-uzytkownika-art25.html`

### Krok 1: Rozszerzyć sekcję 2 o "zastosowania niedopuszczalne"

**STARE:**
```html
  <div class="field"><label>Ograniczenia zastosowania:</label><div class="field-line"></div></div>
  <div class="note">Wyrób może być stosowany wyłącznie zgodnie z zamierzonym zastosowaniem opisanym w normie zharmonizowanej / ETA i niniejszej instrukcji.</div>
```

**NOWE:**
```html
  <div class="field"><label>Ograniczenia zastosowania:</label><div class="field-line"></div></div>
  <div class="field"><label>Zastosowania <strong>niedopuszczalne</strong> (czego nie wolno):</label><div class="field-line"></div></div>
  <div class="field"><label>Zastosowania nieznane producentowi:</label><div class="field-line"></div></div>
  <div class="note">Wyrób może być stosowany wyłącznie zgodnie z zamierzonym zastosowaniem opisanym w normie zharmonizowanej / ETA i niniejszej instrukcji. Art. 25 CPR 2024/3110 wymaga wskazania zastosowań niedopuszczalnych i nieznanych producentowi — to chroni producenta przed odpowiedzialnością za nieprzewidziane użycia.</div>
```

### Krok 2: Dodać adnotację AVS 3+ przy polu GWP100

**STARE:**
```html
  <div class="field"><label>Globalny potencjał ocieplenia (GWP100):</label><div class="field-line"></div></div>
```

**NOWE:**
```html
  <div class="field"><label>Globalny potencjał ocieplenia (GWP100) <em style="font-size:8pt; color:#666;">[obowiązkowe dla AVS 3+]</em>:</label><div class="field-line"></div></div>
```

### Weryfikacja Task 4
```bash
open /Users/admin/Downloads/nowy-cpr-pl/public/docs/instrukcja-uzytkownika-art25.html
```
Sprawdź: sekcja 2 ma 3 pola (ograniczenia + niedopuszczalne + nieznane) ✓ | nota o art. 25 jest ✓ | GWP100 ma adnotację AVS 3+ ✓

---

## Task 5: Build + weryfikacja + commit + push

### Krok 1: Build
```bash
cd /Users/admin/Downloads/nowy-cpr-pl && npm run build 2>&1 | tail -5
# Oczekiwane: ✓ built in X.XXs
```

### Krok 2: Sprawdź liczbę plików w dist/docs
```bash
ls /Users/admin/Downloads/nowy-cpr-pl/dist/docs/ | wc -l
# Oczekiwane: 12
```

### Krok 3: Commit i push
```bash
git add public/docs/mandat-przedstawiciela-art23.html \
        public/docs/importer-dopc-szablon.html \
        public/docs/dokumentacja-techniczna-art21.html \
        public/docs/instrukcja-uzytkownika-art25.html \
        dist/
git commit -m "fix: poprawki merytoryczne szablonów CPR 2024/3110 — zgodność z art. 21/23/25 i Annex V"
git push origin main
```

---

## Definicja sukcesu
- [ ] Mandat art. 23: 3 zakazy (DoP&C + AVS + FPC) widoczne w notatce sekcji 4
- [ ] Mandat art. 23: subtitle bez "spoza UE" — każdy producent
- [ ] Importer DoP&C: sekcja 7 "Zgodność (C)" z tabelą REACH/RoHS/CPR
- [ ] Importer DoP&C: sekcja 4 NB z rozróżnieniem typów dokumentów wg AVS
- [ ] Dok. techniczna: dwa pola "Opis procedury AVS" w sekcji 1
- [ ] Dok. techniczna: nota AVS po checkliście NB/EPD
- [ ] Instrukcja: pola "zastosowania niedopuszczalne" i "nieznane" w sekcji 2
- [ ] Instrukcja: GWP100 z adnotacją AVS 3+
- [ ] Build ✓ bez błędów TypeScript
- [ ] dist/docs/ = 12 plików
