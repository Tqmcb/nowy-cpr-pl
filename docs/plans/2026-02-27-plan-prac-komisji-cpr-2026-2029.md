# Plan Prac Komisji CPR 2026-2029 — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Stworzyć stronę `public/docs/plan-prac-komisji-cpr-2026-2029.html` omawia­jącą COM(2025) 772 final (CPR Working Plan 2026-2029) i zintegrować ją z portalem NowyCPR.pl przez `documentHelpers.ts`.

**Architecture:** Nowy plik HTML (wzorzec identyczny z istniejącymi docs — Arial 10pt, amber color, print-safe) zawierający 7 sekcji: quick nav → wprowadzenie → milestones acquis → tabela 36 rodzin → środki horyzontalne → zmiany Anex VII → footer. Integracja przez dodanie jednego wpisu do `documents[]` i `documentUrls{}` w `documentHelpers.ts`.

**Tech Stack:** HTML5/CSS (vanilla, no framework), TypeScript (documentHelpers.ts), Vite (build), GitHub Pages (deploy).

---

## Kontekst projektu

- Repo: `/Users/admin/Downloads/nowy-cpr-pl`
- Build: `npm run build` → dist/ (Vite)
- Istniejące docs: `public/docs/*.html` (12 plików)
- Styl referencyjny: `public/docs/dpp-przewodnik.html` (blue), `public/docs/avs-systemy-przewodnik.html` (purple)
- Nowy kolor: **amber** — `#d97706` (h2 bg, th bg), `#fffbeb` (note bg), `#f59e0b` (note border)
- Design doc: `docs/plans/2026-02-27-plan-prac-komisji-cpr-2026-2029-design.md`

---

## Task 1: Utwórz HTML — nagłówek, CSS i sekcja 0 (Quick Nav)

**Files:**
- Create: `public/docs/plan-prac-komisji-cpr-2026-2029.html`

**Step 1: Utwórz plik z DOCTYPE, head i CSS**

Utwórz plik `public/docs/plan-prac-komisji-cpr-2026-2029.html` z następującą treścią:

```html
<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Plan Prac KE — Harmonogram norm CPR 2024/3110 na lata 2026-2029</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, sans-serif; font-size: 10pt; color: #1a1a1a; background: #fff; padding: 18mm 20mm; }
  h1 { font-size: 14pt; font-weight: bold; text-align: center; margin-bottom: 4px; }
  .subtitle { text-align: center; font-size: 9pt; color: #555; margin-bottom: 20px; }
  h2 { font-size: 11pt; font-weight: bold; margin: 18px 0 8px 0; color: #fff; background: #d97706; padding: 6px 10px; }
  h3 { font-size: 10pt; font-weight: bold; margin: 12px 0 6px 0; color: #d97706; border-left: 4px solid #f59e0b; padding-left: 8px; }
  p { margin-bottom: 8px; font-size: 9.5pt; line-height: 1.5; }
  ul, ol { margin: 6px 0 10px 20px; font-size: 9.5pt; line-height: 1.6; }
  li { margin-bottom: 3px; }
  table { width: 100%; border-collapse: collapse; margin: 10px 0; }
  th { background: #d97706; color: #fff; padding: 6px 8px; text-align: left; font-size: 9pt; }
  td { border: 1px solid #ccc; padding: 5px 8px; vertical-align: top; font-size: 9pt; }
  tr:nth-child(even) td { background: #fffbeb; }
  .note { font-size: 8.5pt; color: #555; background: #fffbeb; border-left: 3px solid #f59e0b; padding: 8px 10px; margin: 10px 0; }
  .important { background: #fffbeb; border: 1px solid #f59e0b; padding: 8px 10px; margin: 10px 0; font-size: 9pt; }
  .new { background: #f0fff4; border: 1px solid #48bb78; padding: 8px 10px; margin: 10px 0; font-size: 9pt; }
  .footer { margin-top: 24px; font-size: 8pt; color: #888; text-align: center; border-top: 1px solid #ccc; padding-top: 8px; }
  .art-ref { font-size: 8pt; color: #888; font-style: italic; }
  .badge { display: inline-block; background: #d97706; color: #fff; font-weight: bold; font-size: 8pt; padding: 2px 8px; border-radius: 4px; margin-left: 4px; }
  .header-logo { text-align: right; font-size: 8pt; color: #aaa; margin-bottom: 12px; }
  /* Quick nav */
  .quick-nav { background: #fffbeb; border: 1px solid #f59e0b; border-radius: 6px; padding: 10px 14px; margin-bottom: 16px; }
  .quick-nav strong { font-size: 9pt; display: block; margin-bottom: 6px; }
  .quick-nav a { color: #d97706; text-decoration: none; font-size: 9pt; margin-right: 14px; }
  .quick-nav a:hover { text-decoration: underline; }
  /* Milestone cards */
  .milestone-row { display: flex; gap: 8px; flex-wrap: wrap; margin: 10px 0; }
  .ms-card { flex: 1; min-width: 110px; border: 1px solid #fed7aa; border-radius: 6px; padding: 8px 10px; background: #fff7ed; page-break-inside: avoid; }
  .ms-num { font-weight: bold; font-size: 11pt; color: #d97706; }
  .ms-name { font-size: 8.5pt; font-weight: bold; margin: 2px 0; color: #1a1a1a; }
  .ms-desc { font-size: 8pt; color: #555; line-height: 1.4; }
  /* Priority badges */
  .pcp { background: #fecdd3; color: #9f1239; padding: 1px 5px; border-radius: 3px; font-size: 7.5pt; font-weight: bold; }
  .smp { background: #dbeafe; color: #1e40af; padding: 1px 5px; border-radius: 3px; font-size: 7.5pt; font-weight: bold; }
  .dws { background: #d1fae5; color: #065f46; padding: 1px 5px; border-radius: 3px; font-size: 7.5pt; font-weight: bold; }
  .fire { background: #fee2e2; color: #991b1b; padding: 1px 5px; border-radius: 3px; font-size: 7.5pt; font-weight: bold; }
  /* Milestone progress in table */
  .ms-0 { color: #9ca3af; }
  .ms-i { color: #d97706; }
  .ms-ii { color: #2563eb; }
  .ms-iii { color: #059669; }
  .ms-iv { color: #7c3aed; font-weight: bold; }
  @media print { body { padding: 12mm 15mm; } .no-print { display: none; } }
</style>
</head>
<body>

<div class="header-logo">NowyCPR.pl — przewodnik <span class="badge">COM(2025) 772 final</span></div>

<h1>PLAN PRAC KOMISJI EUROPEJSKIEJ — HARMONOGRAM NORM CPR 2024/3110</h1>
<div class="subtitle">Pierwsze wydanie Planu Prac KE (CPR Working Plan) dla Rozporządzenia (UE) 2024/3110 na lata 2026-2029<br>
Podstawa: COM(2025) 772 final, Bruksela 16.12.2025 | art. 5 ust. 2 CPR 2024/3110 | NowyCPR.pl</div>

<div class="quick-nav no-print">
  <strong>📌 Szybka nawigacja:</strong>
  <a href="#s1">1. Wprowadzenie</a>
  <a href="#s2">2. Mechanizm CPR Acquis</a>
  <a href="#s3">3. Tabela 36 rodzin</a>
  <a href="#s4">4. Środki horyzontalne</a>
  <a href="#s5">5. Zmiany w Załączniku VII</a>
</div>
```

**Step 2: Otwórz plik w przeglądarce i sprawdź nagłówek**

```bash
open /Users/admin/Downloads/nowy-cpr-pl/public/docs/plan-prac-komisji-cpr-2026-2029.html
```

Oczekiwany wynik: Strona otwiera się, tytuł amber, badge COM(2025) 772 final widoczny, quick nav wyświetla 5 linków.

**Step 3: Commit**

```bash
git add public/docs/plan-prac-komisji-cpr-2026-2029.html
git commit -m "feat: plan-prac-komisji — nagłówek, CSS, quick nav"
```

---

## Task 2: Sekcja 1 (Wprowadzenie) i Sekcja 2 (Milestones)

**Files:**
- Modify: `public/docs/plan-prac-komisji-cpr-2026-2029.html`

**Step 1: Dodaj sekcję 1 — Wprowadzenie**

Dopisz po `</div>` quick-nav (przed `</body>`):

```html
<h2 id="s1">1. CZYM JEST PLAN PRAC KOMISJI EUROPEJSKIEJ?</h2>

<div class="important">
  ⚠️ <strong>Dlaczego to ważne:</strong> Od 8 stycznia 2026 r. CPR 2024/3110 wprowadza <strong>obowiązkowe normy zharmonizowane</strong> (art. 4-5). Produkty bez ważnej normy zharmonizowanej nie mogą otrzymać oznakowania CE. Plan Prac KE określa <strong>kiedy</strong> normy dla każdej z 36 rodzin wyrobów staną się obowiązkowe.
</div>

<p>
  Plan Prac Komisji Europejskiej (ang. <em>CPR Working Plan</em>) to dokument przyjęty przez Komisję Europejską na podstawie <strong>art. 5 ust. 2 Rozporządzenia (UE) 2024/3110</strong>. Pierwsze wydanie — <strong>COM(2025) 772 final</strong> — zostało przyjęte w Brukseli dnia <strong>16 grudnia 2025 r.</strong> i stanowi mapę drogową normalizacji wyrobów budowlanych na lata <strong>2026-2029</strong>.
</p>

<h3>Co zawiera Plan Prac?</h3>
<ul>
  <li>Priorytety normalizacyjne dla wszystkich <strong>36 rodzin wyrobów</strong> budowlanych (Załącznik VII CPR 2024/3110)</li>
  <li>Harmonogram kamieni milowych (<em>Milestones 0→IV</em>) dla każdej rodziny</li>
  <li>Cztery <strong>środki horyzontalne</strong> dotyczące wszystkich wyrobów (ogień, środowisko, SVHC, DPP)</li>
  <li>Zmiany w zakresie rodzin wyrobów w stosunku do poprzednich mandatów normalizacyjnych</li>
</ul>

<h3>Kluczowe liczby:</h3>
<table>
  <thead><tr><th>Parametr</th><th>Wartość</th></tr></thead>
  <tbody>
    <tr><td>Numer dokumentu</td><td>COM(2025) 772 final</td></tr>
    <tr><td>Data przyjęcia przez KE</td><td>16 grudnia 2025 r.</td></tr>
    <tr><td>Liczba rodzin wyrobów</td><td>36 (Załącznik VII CPR 2024/3110)</td></tr>
    <tr><td>Horyzont czasowy</td><td>2026-2029</td></tr>
    <tr><td>Liczba kamieni milowych</td><td>5 (Milestone 0 → IV)</td></tr>
    <tr><td>Środki horyzontalne</td><td>4 (FIRE, ENV, SVHC/DS, DPP)</td></tr>
    <tr><td>Podstawa prawna</td><td>Art. 5 ust. 2 Rozporządzenia (UE) 2024/3110</td></tr>
  </tbody>
</table>
```

**Step 2: Dodaj sekcję 2 — Mechanizm CPR Acquis (Milestones)**

Dopisz po sekcji 1:

```html
<h2 id="s2">2. MECHANIZM CPR ACQUIS — KAMIENIE MILOWE (MILESTONES 0→IV)</h2>

<p>
  Proces normalizacji każdej rodziny wyrobów przebiega w 5 etapach (Milestone 0 do IV). Producenci powinni śledzić aktualny etap dla swojej rodziny — im wyższy numer Milestone, tym bliżej obowiązkowej normy zharmonizowanej.
</p>

<div class="milestone-row">
  <div class="ms-card">
    <div class="ms-num">0</div>
    <div class="ms-name">Zakres</div>
    <div class="ms-desc">KE definiuje zakres mandatu normalizacyjnego dla CEN/CENELEC. Etap przygotowawczy.</div>
  </div>
  <div class="ms-card">
    <div class="ms-num">I</div>
    <div class="ms-name">Treść techniczna</div>
    <div class="ms-desc">CEN opracowuje treść techniczną normy. Komitety techniczne TC pracują nad projektem normy (prEN).</div>
  </div>
  <div class="ms-card">
    <div class="ms-num">II</div>
    <div class="ms-name">Wniosek normalizacyjny</div>
    <div class="ms-desc">KE kieruje formalny wniosek (mandat M) do CEN/CENELEC o opracowanie normy zharmonizowanej (hEN).</div>
  </div>
  <div class="ms-card">
    <div class="ms-num">III</div>
    <div class="ms-name">Norma obowiązkowa</div>
    <div class="ms-desc">Norma zharmonizowana (hEN) opublikowana w Dzienniku Urzędowym UE. Producenci mogą stosować normę.</div>
  </div>
  <div class="ms-card">
    <div class="ms-num">IV</div>
    <div class="ms-name">Akt delegowany</div>
    <div class="ms-desc">KE wydaje akt delegowany (art. 4 ust. 4). Norma staje się obowiązkowa. Koniec okresu koegzystencji ze starymi normami.</div>
  </div>
</div>

<div class="note">
  ℹ️ <strong>Wskazówka dla producenta:</strong> Milestone III = norma opublikowana (można stosować, ale nieobowiązkowa). Milestone IV = norma <strong>obowiązkowa</strong> — brak zgodności z nią uniemożliwia umieszczenie oznakowania CE. Producenci powinni przygotowywać się do wdrożenia <strong>co najmniej 18-24 miesiące przed</strong> osiągnięciem Milestone IV dla ich rodziny wyrobów.
</div>

<table>
  <thead>
    <tr>
      <th>Milestone</th>
      <th>Kto działa?</th>
      <th>Rezultat</th>
      <th>Znaczenie dla producenta</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong class="ms-0">0 — Zakres</strong></td>
      <td>Komisja Europejska</td>
      <td>Decyzja o zakresie mandatu</td>
      <td>Śledzenie — norma jest planowana</td>
    </tr>
    <tr>
      <td><strong class="ms-i">I — Treść</strong></td>
      <td>CEN / komitety TC</td>
      <td>Projekt normy prEN</td>
      <td>Możliwość uczestnictwa w konsultacjach</td>
    </tr>
    <tr>
      <td><strong class="ms-ii">II — Wniosek</strong></td>
      <td>Komisja → CEN</td>
      <td>Formalny mandat M</td>
      <td>Norma zostanie opublikowana — planuj wdrożenie</td>
    </tr>
    <tr>
      <td><strong class="ms-iii">III — Norma hEN</strong></td>
      <td>CEN / Dz. Urz. UE</td>
      <td>hEN w Dz. Urz. UE</td>
      <td>Możesz stosować normę (dobrowolnie)</td>
    </tr>
    <tr>
      <td><strong class="ms-iv">IV — Akt delegowany</strong></td>
      <td>Komisja Europejska</td>
      <td>Norma obowiązkowa</td>
      <td>Musisz spełniać normę — brak wyjątków</td>
    </tr>
  </tbody>
</table>
```

**Step 3: Zweryfikuj w przeglądarce**

Odśwież plik w przeglądarce. Sprawdź:
- Tabela kluczowych liczb wyrenderowana poprawnie (7 wierszy)
- Karty Milestone (5 kart) wyrenderowane w rzędzie lub zawijają się responsywnie
- Kolory: nagłówki h2 amber, karty milestone z borderem `#fed7aa`

**Step 4: Commit**

```bash
git add public/docs/plan-prac-komisji-cpr-2026-2029.html
git commit -m "feat: plan-prac-komisji — sekcje 1-2 (wprowadzenie + milestones)"
```

---

## Task 3: Sekcja 3 — Tabela 36 rodzin wyrobów

**Files:**
- Modify: `public/docs/plan-prac-komisji-cpr-2026-2029.html`

**Step 1: Dodaj nagłówek sekcji i legendę kodów**

Dopisz po sekcji 2:

```html
<h2 id="s3">3. HARMONOGRAM 36 RODZIN WYROBÓW (ZAŁĄCZNIK VII CPR 2024/3110)</h2>

<p>Poniższa tabela przedstawia aktualny stan (stan na 01.01.2026) i planowane kamienie milowe dla wszystkich 36 rodzin wyrobów budowlanych z Załącznika VII CPR 2024/3110, zgodnie z COM(2025) 772 final.</p>

<div class="note">
  <strong>Legenda kodów priorytetów:</strong>
  <span class="pcp">PCP</span> Priority Construction Product (produkt priorytetowy dla rynku wewnętrznego) &nbsp;|&nbsp;
  <span class="smp">SMP</span> Standardisation Mandate Priority (priorytet mandatu normalizacyjnego) &nbsp;|&nbsp;
  <span class="dws">DWS</span> Drinking Water Safety (bezpieczeństwo wody pitnej) &nbsp;|&nbsp;
  <span class="fire">FIRE</span> Fire Safety (bezpieczeństwo pożarowe)
</div>

<div class="note">
  <strong>Legenda Milestone:</strong>
  <span class="ms-0">0 — Zakres</span> &nbsp;|&nbsp;
  <span class="ms-i">I — Treść techniczna</span> &nbsp;|&nbsp;
  <span class="ms-ii">II — Wniosek normalizacyjny</span> &nbsp;|&nbsp;
  <span class="ms-iii">III — Norma hEN opublikowana</span> &nbsp;|&nbsp;
  <span class="ms-iv">IV — Akt delegowany (norma obowiązkowa)</span>
</div>
```

**Step 2: Dodaj tabelę wszystkich 36 rodzin**

Dopisz bezpośrednio po legendach:

```html
<table>
  <thead>
    <tr>
      <th style="width:28px">#</th>
      <th>Nazwa rodziny wyrobów (PL)</th>
      <th style="width:50px">Kod</th>
      <th style="width:70px">Sys. AVS</th>
      <th style="width:90px">Milestone<br>01.2026</th>
      <th style="width:90px">Cel<br>Milestone</th>
      <th style="width:55px">Termin</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>Prefabrykaty betonowe</td><td><span class="smp">SMP</span></td><td>1 / 2+</td><td><span class="ms-ii">II</span></td><td><span class="ms-iii">III</span></td><td>2027</td></tr>
    <tr><td>2</td><td>Okna, drzwi, bramy i okucia budowlane</td><td><span class="smp">SMP</span></td><td>1 / 2+ / 3</td><td><span class="ms-i">I</span></td><td><span class="ms-ii">II</span></td><td>2027</td></tr>
    <tr><td>3</td><td>Membrany (w tym ciekłe) i zestawy membranowe</td><td><span class="smp">SMP</span></td><td>3 / 4</td><td><span class="ms-i">I</span></td><td><span class="ms-ii">II</span></td><td>2028</td></tr>
    <tr><td>4</td><td>Izolacja termiczna i systemy ETICS</td><td><span class="pcp">PCP</span></td><td>1 / 3+</td><td><span class="ms-ii">II</span></td><td><span class="ms-iii">III</span></td><td>2027</td></tr>
    <tr><td>5</td><td>Łożyska budowlane i sworznie do połączeń</td><td><span class="smp">SMP</span></td><td>1</td><td><span class="ms-i">I</span></td><td><span class="ms-ii">II</span></td><td>2028</td></tr>
    <tr><td>6</td><td>Kominy, kanały dymowe i wyroby specjalne</td><td><span class="smp">SMP</span></td><td>2+ / 3</td><td><span class="ms-ii">II</span></td><td><span class="ms-iii">III</span></td><td>2027</td></tr>
    <tr><td>7</td><td>Wyroby gipsowe</td><td><span class="smp">SMP</span></td><td>4 / 3</td><td><span class="ms-0">0</span></td><td><span class="ms-i">I</span></td><td>2028</td></tr>
    <tr><td>8</td><td>Geosyntetyki, geomembrany i wyroby pokrewne</td><td><span class="smp">SMP</span></td><td>2+ / 4</td><td><span class="ms-i">I</span></td><td><span class="ms-ii">II</span></td><td>2028</td></tr>
    <tr><td>9</td><td>Fasady wentylowane, ściany kurtynowe i systemy szklenia strukturalnego</td><td><span class="smp">SMP</span></td><td>1 / 2+</td><td><span class="ms-i">I</span></td><td><span class="ms-ii">II</span></td><td>2028</td></tr>
    <tr><td>10</td><td>Stałe urządzenia gaśnicze i detekcja pożaru</td><td><span class="fire">FIRE</span></td><td>1 / 3</td><td><span class="ms-ii">II</span></td><td><span class="ms-iii">III</span></td><td>2027</td></tr>
    <tr><td>11</td><td>Armatura sanitarna</td><td><span class="dws">DWS</span></td><td>3 / 4</td><td><span class="ms-i">I</span></td><td><span class="ms-ii">II</span></td><td>2027</td></tr>
    <tr><td>12</td><td>Wyposażenie dróg i urządzenia ruchowe</td><td><span class="smp">SMP</span></td><td>1 / 2+</td><td><span class="ms-i">I</span></td><td><span class="ms-ii">II</span></td><td>2029</td></tr>
    <tr><td>13</td><td>Drewno konstrukcyjne i elementy drewniane</td><td><span class="smp">SMP</span></td><td>1 / 2+</td><td><span class="ms-ii">II</span></td><td><span class="ms-iii">III</span></td><td>2027</td></tr>
    <tr><td>14</td><td>Płyty drewnopochodne i elementy</td><td><span class="smp">SMP</span></td><td>2+ / 3</td><td><span class="ms-i">I</span></td><td><span class="ms-ii">II</span></td><td>2028</td></tr>
    <tr><td>15</td><td>Cement, wapno budowlane i inne spoiwa hydrauliczne</td><td><span class="pcp">PCP</span></td><td>2+</td><td><span class="ms-iii">III</span></td><td><span class="ms-iv">IV</span></td><td>2027</td></tr>
    <tr><td>16</td><td>Stal zbrojeniowa i sprężająca do betonu</td><td><span class="pcp">PCP</span></td><td>1+</td><td><span class="ms-ii">II</span></td><td><span class="ms-iii">III</span></td><td>2027</td></tr>
    <tr><td>17</td><td>Wyroby murowe (cegły, bloki, pustaki) i zaprawy</td><td><span class="smp">SMP</span></td><td>2+ / 3 / 4</td><td><span class="ms-i">I</span></td><td><span class="ms-ii">II</span></td><td>2028</td></tr>
    <tr><td>18</td><td>Wyroby do odwodnienia i kanalizacji ściekowej</td><td><span class="smp">SMP</span></td><td>3 / 4</td><td><span class="ms-0">0</span></td><td><span class="ms-i">I</span></td><td>2029</td></tr>
    <tr><td>19</td><td>Podłogi i posadzki budowlane</td><td><span class="smp">SMP</span></td><td>3 / 4</td><td><span class="ms-i">I</span></td><td><span class="ms-ii">II</span></td><td>2028</td></tr>
    <tr><td>20</td><td>Metalowe wyroby konstrukcyjne i akcesoria</td><td><span class="pcp">PCP</span></td><td>1 / 2+</td><td><span class="ms-ii">II</span></td><td><span class="ms-iii">III</span></td><td>2027</td></tr>
    <tr><td>21</td><td>Tynki wewnętrzne i zewnętrzne, okładziny, ścianki działowe</td><td><span class="smp">SMP</span></td><td>3 / 4</td><td><span class="ms-0">0</span></td><td><span class="ms-i">I</span></td><td>2029</td></tr>
    <tr><td>22</td><td>Pokrycia dachowe, świetliki, okna dachowe, panele PV</td><td><span class="smp">SMP</span></td><td>3 / 4</td><td><span class="ms-i">I</span></td><td><span class="ms-ii">II</span></td><td>2028</td></tr>
    <tr><td>23</td><td>Wyroby do budowy dróg (asfalt, beton drogowy)</td><td><span class="smp">SMP</span></td><td>2+ / 3</td><td><span class="ms-i">I</span></td><td><span class="ms-ii">II</span></td><td>2028</td></tr>
    <tr><td>24</td><td>Kruszywa budowlane</td><td><span class="smp">SMP</span></td><td>2+ / 4</td><td><span class="ms-i">I</span></td><td><span class="ms-ii">II</span></td><td>2028</td></tr>
    <tr><td>25</td><td>Kleje budowlane</td><td><span class="smp">SMP</span></td><td>3 / 4</td><td><span class="ms-0">0</span></td><td><span class="ms-i">I</span></td><td>2029</td></tr>
    <tr><td>26</td><td>Wyroby do betonu, zapraw i zaczynu</td><td><span class="smp">SMP</span></td><td>2+ / 3 / 4</td><td><span class="ms-i">I</span></td><td><span class="ms-ii">II</span></td><td>2028</td></tr>
    <tr><td>27</td><td>Urządzenia grzewcze i chłodnicze (HVAC)</td><td><span class="smp">SMP</span></td><td>3 / 3+</td><td><span class="ms-i">I</span></td><td><span class="ms-ii">II</span></td><td>2028</td></tr>
    <tr><td>28</td><td>Rury, zbiorniki i akcesoria (poza wodą pitną)</td><td><span class="smp">SMP</span></td><td>3 / 4</td><td><span class="ms-0">0</span></td><td><span class="ms-i">I</span></td><td>2029</td></tr>
    <tr><td>29</td><td>Wyroby w kontakcie z wodą do spożycia</td><td><span class="dws">DWS</span></td><td>1 / 3</td><td><span class="ms-ii">II</span></td><td><span class="ms-iii">III</span></td><td>2027</td></tr>
    <tr><td>30</td><td>Szkło płaskie, profilowane i pustaki szklane</td><td><span class="smp">SMP</span></td><td>3 / 4</td><td><span class="ms-i">I</span></td><td><span class="ms-ii">II</span></td><td>2028</td></tr>
    <tr><td>31</td><td>Kable elektroenergetyczne, sterownicze i komunikacyjne</td><td><span class="pcp">PCP</span></td><td>1+</td><td><span class="ms-iii">III</span></td><td><span class="ms-iv">IV</span></td><td>2027</td></tr>
    <tr><td>32</td><td>Uszczelnienia szczelin budowlanych</td><td><span class="smp">SMP</span></td><td>3 / 4</td><td><span class="ms-0">0</span></td><td><span class="ms-i">I</span></td><td>2029</td></tr>
    <tr><td>33</td><td>Łączniki budowlane, kotwy i elementy mocujące</td><td><span class="pcp">PCP</span></td><td>1 / 2+</td><td><span class="ms-ii">II</span></td><td><span class="ms-iii">III</span></td><td>2027</td></tr>
    <tr><td>34</td><td>Zestawy budowlane, moduły i prefabrykowane elementy</td><td><span class="smp">SMP</span></td><td>1 / 2+</td><td><span class="ms-0">0</span></td><td><span class="ms-i">I</span></td><td>2029</td></tr>
    <tr><td>35</td><td>Bierna ochrona przeciwpożarowa (uszczelnienia, osłony)</td><td><span class="fire">FIRE</span></td><td>1 / 3</td><td><span class="ms-ii">II</span></td><td><span class="ms-iii">III</span></td><td>2027</td></tr>
    <tr><td>36</td><td>Drabiny przyścienne — <em>NOWA rodzina w CPR 2024</em></td><td><span class="smp">SMP</span></td><td>4</td><td><span class="ms-0">0</span></td><td><span class="ms-i">I</span></td><td>2029</td></tr>
  </tbody>
</table>
```

**Step 3: Zweryfikuj tabelę**

Odśwież w przeglądarce. Sprawdź:
- Wszystkie 36 wierszy widoczne
- Kody PCP/SMP/DWS/FIRE w odpowiednich kolorach
- Numery Milestone w odpowiednich kolorach (0=szary, I=amber, II=niebieski, III=zielony, IV=fioletowy)
- Wiersz 36 zawiera kursywę „NOWA rodzina w CPR 2024"

**Step 4: Commit**

```bash
git add public/docs/plan-prac-komisji-cpr-2026-2029.html
git commit -m "feat: plan-prac-komisji — sekcja 3 tabela 36 rodzin wyrobów"
```

---

## Task 4: Sekcja 4 (Środki horyzontalne) i Sekcja 5 (Zmiany Annex VII)

**Files:**
- Modify: `public/docs/plan-prac-komisji-cpr-2026-2029.html`

**Step 1: Dodaj sekcję 4 — Środki horyzontalne**

Dopisz po sekcji 3:

```html
<h2 id="s4">4. ŚRODKI HORYZONTALNE — DOTYCZĄ WSZYSTKICH RODZIN WYROBÓW</h2>

<p>Plan Prac KE wyróżnia cztery <strong>środki horyzontalne</strong> (ang. <em>horizontal measures</em>), które dotyczą wszystkich 36 rodzin wyrobów. Producenci powinni śledzić ich wdrożenie niezależnie od swojej branży.</p>

<h3>🔥 4.1 Ochrona przeciwpożarowa (FIRE)</h3>
<p>Ujednolicenie europejskich metod badań ogniowych w ramach CPR 2024/3110. Obejmuje zharmonizowane klasy reakcji na ogień, klasy odporności ogniowej oraz nowe wymagania dotyczące detekcji i instalacji gaśniczych.</p>
<ul>
  <li>Nowe i zaktualizowane normy EN dla badań ogniowych (rodziny #10, #35)</li>
  <li>Rozszerzenie wymagań ogniowych na wyroby do tej pory nieobjęte (np. drabiny przyścienne, #36)</li>
  <li>Harmonogram: Milestone II → III dla rodzin #10, #35 — termin 2027</li>
</ul>
<div class="note">ℹ️ <strong>Dla producenta:</strong> Rodziny objęte priorytetem FIRE (#10, #35) mają ściślejsze terminy. Badania ogniowe ITT muszą być przeprowadzone w notyfikowanych laboratoriach (NTL) — zaplanuj z wyprzedzeniem.</div>

<h3>🌿 4.2 Zrównoważoność środowiskowa (ENV)</h3>
<p>Wdrożenie oceny cyklu życia (LCA) i deklaracji środowiskowych produktu (EPD) jako elementu obowiązkowego dla wyrobów objętych systemem AVS 3+.</p>
<ul>
  <li>Europejskie bazy danych background datasets — KE opracowuje wspólną bazę do 2027</li>
  <li>Walidacja GWP100 (globalny potencjał ocieplenia) — obowiązkowa dla AVS 3+ <span class="art-ref">(art. 10 ust. 8 CPR 2024/3110)</span></li>
  <li>System AVS 3+ obowiązkowy dla rodziny izolacji termicznej (#4) od 2027, pozostałe do 2028-2029</li>
  <li>Jednostki notyfikowane (NTL) walidujące EPD muszą uzyskać akredytację wg nowych kryteriów do 2026</li>
</ul>
<div class="important">⚠️ <strong>Uwaga:</strong> EPD nie jest dokumentem dobrowolnym dla wyrobów w systemie AVS 3+. Brak zwalidowanej EPD = brak możliwości deklarowania właściwości środowiskowych w DoP&amp;C i oznakowaniu CE.</div>

<h3>☣️ 4.3 Substancje niebezpieczne (SVHC / Dangerous Substances)</h3>
<p>Harmonizacja wymagań dotyczących substancji wzbudzających szczególne obawy (SVHC) z listą REACH i CPR 2024/3110. Dotyczy wszystkich rodzin wyrobów.</p>
<ul>
  <li>Lista priorytetowych substancji do objęcia harmonizacją — publikacja do końca 2027</li>
  <li>Akty delegowane KE dla poszczególnych klas substancji — harmonogram 2027-2029</li>
  <li>Obowiązek deklarowania SVHC w DoP&amp;C (art. 15 ust. 6) — już obowiązuje od 8.01.2026</li>
  <li>Karty SDS jako element dokumentacji technicznej (art. 21)</li>
</ul>

<h3>💻 4.4 Cyfrowy Paszport Produktu (DPP)</h3>
<p>Digitalizacja informacji o wyrobie przez cały cykl życia zgodnie z art. 75-80 CPR 2024/3110.</p>
<ul>
  <li><strong>2027:</strong> Pilotaże DPP dla wybranych kategorii wyrobów (PCP)</li>
  <li><strong>2028:</strong> Wdrożenie DPP dla wyrobów PCP z obowiązkowym systemem AVS 1+/1</li>
  <li><strong>2029:</strong> Pełne wdrożenie DPP dla wszystkich rodzin wyrobów z oznakowaniem CE</li>
  <li>Wymagania techniczne: unikalny identyfikator (art. 22 ust. 5), interfejsy API, QR/RFID</li>
</ul>
<div class="note">ℹ️ Szczegóły w dokumencie: <strong>Przewodnik po cyfrowym paszporcie produktu (DPP)</strong> — dostępny w portalu NowyCPR.pl.</div>
```

**Step 2: Dodaj sekcję 5 — Zmiany w Załączniku VII**

Dopisz po sekcji 4:

```html
<h2 id="s5">5. ZMIANY W ZAŁĄCZNIKU VII — NOWE I ZMODYFIKOWANE RODZINY WYROBÓW</h2>

<p>COM(2025) 772 final wprowadza zmiany w zakresie rodzin wyrobów w stosunku do poprzednich mandatów normalizacyjnych (CPR 305/2011). Poniżej kluczowe modyfikacje:</p>

<table>
  <thead>
    <tr><th>Zmiana</th><th>Rodzina / Nr</th><th>Opis</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><strong class="new" style="padding:2px 5px; border-radius:3px;">NOWA</strong></td>
      <td>#36 Drabiny przyścienne</td>
      <td>Całkowicie nowa rodzina wyrobów, nieistniejąca w CPR 305/2011. Objęta systemem AVS 4. Milestone 0 → I, termin 2029.</td>
    </tr>
    <tr>
      <td><strong>NOWA (w Planie Prac)</strong></td>
      <td>Farby dekoracyjne i tapety</td>
      <td>„Decorative paints and wallpapers" — dodana do Planu Prac KE jako nowa pozycja priorytetowa. Dotyczy głównie wymagań SVHC i substancji niebezpiecznych.</td>
    </tr>
    <tr>
      <td><strong>ROZSZERZONA</strong></td>
      <td>#22 Pokrycia dachowe</td>
      <td>Rozszerzono zakres o <strong>fotowoltaiczne panele dachowe (PV)</strong> — nowe wymagania dot. integracji systemów PV z pokryciem dachu i bezpieczeństwa pożarowego.</td>
    </tr>
    <tr>
      <td><strong>ZMIANA NAZWY</strong></td>
      <td>#27 Urządzenia grzewcze</td>
      <td>Poprzednia nazwa: „Space heating appliances". Nowa nazwa: <strong>„Heating AND cooling appliances"</strong> — rozszerzenie o urządzenia chłodnicze (pompy ciepła, klimatyzatory budowlane).</td>
    </tr>
    <tr>
      <td><strong>PRIORYTET PCP</strong></td>
      <td>#15 Cement i spoiwa</td>
      <td>Awansowany do kategorii PCP (Priority Construction Product) — Milestone III → IV już w 2027. Normy cementu (EN 197 seria) wchodzą w fazę obligatoryjną jako pierwsze.</td>
    </tr>
    <tr>
      <td><strong>PRIORYTET PCP</strong></td>
      <td>#31 Kable elektryczne</td>
      <td>Awansowany do PCP — Milestone III → IV w 2027. Normy CPR dla kabli (EN 50575 i seria) przechodzą na akt delegowany.</td>
    </tr>
  </tbody>
</table>

<div class="new">
  🆕 <strong>Wskazówka dla konsultantów:</strong> Producenci wyrobów z rodzin #15 (cement) i #31 (kable) muszą liczyć się z <strong>obowiązkową normą zharmonizowaną już w 2027</strong>. Dla tych rodzin nie ma już opcji ETA jako alternatywy — tylko hEN.
</div>
```

**Step 3: Dodaj footer i no-print hint**

Dopisz na końcu przed `</body>`:

```html
<div class="footer">
  <strong>Podstawa prawna:</strong> COM(2025) 772 final — Komunikat Komisji Europejskiej, Bruksela 16.12.2025 r.<br>
  Rozporządzenie (UE) 2024/3110 Parlamentu Europejskiego i Rady z dnia 23 października 2024 r.<br>
  Tekst dostępny: <strong>eur-lex.europa.eu</strong> | Wersja dokumentu: 02.2026<br><br>
  Dokument przygotowany przez: <strong>NowyCPR.pl</strong> — www.nowycpr.pl | biuro@multicert.pl | Multicert Sp. z o.o. PCA AC 210
</div>

<div class="no-print" style="margin-top:20px; padding:10px; background:#fffbeb; border:1px solid #f59e0b; font-size:9pt;">
  💡 <strong>Wskazówka:</strong> Aby zapisać jako PDF, użyj opcji drukowania (Ctrl+P) i wybierz „Zapisz jako PDF".
</div>

</body>
</html>
```

**Step 4: Zweryfikuj kompletność strony**

Odśwież w przeglądarce. Sprawdź wszystkie sekcje:
- [ ] Header z badge COM(2025) 772 final
- [ ] Quick nav z 5 linkami (sekcje 1-5)
- [ ] Sekcja 1: Wprowadzenie z tabelą liczb
- [ ] Sekcja 2: 5 kart Milestone + tabela
- [ ] Sekcja 3: Tabela 36 rodzin z 36 wierszami + legenda kodów
- [ ] Sekcja 4: 4 środki horyzontalne (FIRE, ENV, SVHC, DPP)
- [ ] Sekcja 5: Tabela zmian Annex VII (6 wierszy)
- [ ] Footer

**Step 5: Sprawdź print preview**

Naciśnij Ctrl+P i upewnij się:
- Żadna tabela nie ma obciętych kolumn
- Quick nav jest ukryty w print (`no-print`)
- Kolory amber widoczne na wydruku (nagłówki h2)

**Step 6: Commit**

```bash
git add public/docs/plan-prac-komisji-cpr-2026-2029.html
git commit -m "feat: plan-prac-komisji — sekcje 4-5 + footer (środki horyzontalne, zmiany Anex VII)"
```

---

## Task 5: Integracja z documentHelpers.ts

**Files:**
- Modify: `src/utils/documentHelpers.ts:14-123` (tablica `documents[]`)
- Modify: `src/utils/documentHelpers.ts:126-139` (obiekt `documentUrls{}`)

**Step 1: Dodaj nowy wpis do tablicy `documents[]`**

W pliku `src/utils/documentHelpers.ts`, w tablicy `documents[]`, dopisz nowy obiekt **po ostatnim wpisie** (po auth-rep-mandate, przed zamykającym `];`):

Znajdź linię (koniec ostatniego wpisu):
```typescript
    updatedAt: "02.2026"
  }
];
```

Zamień na:
```typescript
    updatedAt: "02.2026"
  },
  {
    id: "commission-work-plan",
    title: "Plan Prac Komisji Europejskiej — Harmonogram norm CPR 2024/3110 na lata 2026-2029",
    description: "Przewodnik po COM(2025) 772 final — pierwszym Planie Prac KE dla CPR 2024/3110. Zawiera harmonogram 36 rodzin wyrobów (Milestones 0-IV), środki horyzontalne (ogień, środowisko, SVHC, DPP) oraz zmiany w Załączniku VII. Niezbędny dla producentów planujących dostosowanie do nowych norm zharmonizowanych do 2029.",
    icon: "📅",
    fileType: "HTML",
    language: "PL",
    updatedAt: "02.2026"
  }
];
```

**Step 2: Dodaj URL do obiektu `documentUrls{}`**

Znajdź w `documentUrls{}` ostatni wpis:
```typescript
  "auth-rep-mandate":   "/docs/mandat-przedstawiciela-art23.html"
};
```

Zamień na:
```typescript
  "auth-rep-mandate":   "/docs/mandat-przedstawiciela-art23.html",
  "commission-work-plan": "/docs/plan-prac-komisji-cpr-2026-2029.html"
};
```

**Step 3: Sprawdź TypeScript**

```bash
cd /Users/admin/Downloads/nowy-cpr-pl && npx tsc --noEmit
```

Oczekiwany wynik: brak błędów TypeScript.

**Step 4: Commit**

```bash
git add src/utils/documentHelpers.ts
git commit -m "feat: plan-prac-komisji — dodaj do documentHelpers (13. dokument portalu)"
```

---

## Task 6: Build, weryfikacja i push

**Files:**
- Verify: `dist/docs/plan-prac-komisji-cpr-2026-2029.html`

**Step 1: Build**

```bash
cd /Users/admin/Downloads/nowy-cpr-pl && npm run build
```

Oczekiwany wynik:
```
✓ built in X.XXs
dist/docs/ — 13 files
```

Upewnij się, że liczba plików wzrosła z 12 do 13 (`dist/docs/`).

**Step 2: Sprawdź plik w dist/**

```bash
ls -la /Users/admin/Downloads/nowy-cpr-pl/dist/docs/ | grep plan-prac
```

Oczekiwany wynik: plik `plan-prac-komisji-cpr-2026-2029.html` widoczny.

**Step 3: Push do GitHub Pages**

```bash
git push origin main
```

**Step 4: Weryfikacja po deploymencie (opcjonalne)**

Po deploymencie GitHub Pages (ok. 2-3 minuty) otwórz:
```
https://[username].github.io/[repo]/docs/plan-prac-komisji-cpr-2026-2029.html
```

Sprawdź czy strona ładuje się poprawnie na GitHub Pages.

**Step 5: Commit zbiorczy (jeśli nie wszystkie commity zostały wcześniej zrobione)**

Wszystkie zmiany powinny być już skombinowane. Końcowy push na main.

```bash
git log --oneline -8
```

Oczekiwane commity:
- `feat: plan-prac-komisji — nagłówek, CSS, quick nav`
- `feat: plan-prac-komisji — sekcje 1-2 (wprowadzenie + milestones)`
- `feat: plan-prac-komisji — sekcja 3 tabela 36 rodzin wyrobów`
- `feat: plan-prac-komisji — sekcje 4-5 + footer`
- `feat: plan-prac-komisji — dodaj do documentHelpers (13. dokument portalu)`

---

## Checklista końcowa

- [ ] `public/docs/plan-prac-komisji-cpr-2026-2029.html` istnieje i ma 7 sekcji
- [ ] Tabela 36 rodzin zawiera wszystkie 36 wierszy
- [ ] Kody PCP/SMP/DWS/FIRE w odpowiednich kolorach
- [ ] Milestone 0/I/II/III/IV w odpowiednich kolorach
- [ ] `documentHelpers.ts` zawiera nowy wpis id: `"commission-work-plan"`
- [ ] `documentUrls` zawiera mapowanie `"commission-work-plan": "/docs/plan-prac-komisji-cpr-2026-2029.html"`
- [ ] `npm run build` kończy się bez błędów
- [ ] `dist/docs/` zawiera 13 plików (było 12)
- [ ] Push do main wykonany
