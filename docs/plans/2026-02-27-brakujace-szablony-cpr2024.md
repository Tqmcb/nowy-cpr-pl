# Brakujące szablony CPR 2024/3110 — Plan implementacji

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Dodać 4 brakujące szablony HTML dokumentów CPR 2024/3110 (importer DoPC, plik techniczny, instrukcja użytkownika, mandat pełnomocnika) i zarejestrować je na stronie /dokumenty.

**Architecture:** Każdy dokument to samodzielny plik HTML w `/public/docs/` ze spójnym CSS print-ready. Rejestracja przez `documentHelpers.ts` (tablica `documents[]` + mapa `documentUrls`). Brak zmian w komponentach React — działają generycznie.

**Tech Stack:** HTML/CSS (standalone, print-ready), TypeScript (documentHelpers.ts), React/Vite (build), GitHub Pages (deploy)

---

## CSS bazowy (skopiować do każdego nowego pliku HTML)

```css
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: Arial, sans-serif; font-size: 10pt; color: #1a1a1a; background: #fff; padding: 20mm 20mm 20mm 20mm; }
h1 { font-size: 14pt; font-weight: bold; text-align: center; margin-bottom: 4px; }
h2 { font-size: 11pt; font-weight: bold; margin: 14px 0 6px 0; border-bottom: 1px solid #555; padding-bottom: 3px; }
.subtitle { text-align: center; font-size: 9pt; color: #555; margin-bottom: 16px; }
.eu-ref { text-align: center; font-size: 8pt; color: #888; margin-bottom: 20px; }
.section { margin-bottom: 14px; }
.field { margin: 6px 0; display: flex; align-items: baseline; gap: 6px; }
.field label { font-weight: bold; min-width: 220px; font-size: 9pt; flex-shrink: 0; }
.field-line { border-bottom: 1px solid #bbb; flex-grow: 1; min-width: 80px; height: 16px; }
table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 9pt; }
th { background: #2d3748; color: #fff; padding: 5px 8px; text-align: left; font-size: 9pt; }
td { border: 1px solid #ccc; padding: 5px 8px; vertical-align: top; }
tr:nth-child(even) td { background: #f9f9f9; }
.empty-row td { height: 24px; }
.note { font-size: 8pt; color: #555; margin-top: 6px; padding: 6px 8px; background: #f5f5f5; border-left: 3px solid #f59e0b; }
.signature-block { margin-top: 24px; display: flex; justify-content: space-between; }
.sig-field { width: 45%; }
.sig-line { border-bottom: 1px solid #555; margin-top: 30px; }
.sig-label { font-size: 8pt; color: #666; margin-top: 4px; }
.header-logo { text-align: right; font-size: 8pt; color: #aaa; margin-bottom: 12px; }
.badge { display: inline-block; background: #f59e0b; color: #000; font-weight: bold; font-size: 8pt; padding: 2px 8px; border-radius: 4px; margin-left: 6px; }
.important { background: #fff8e1; border: 1px solid #f59e0b; padding: 8px 10px; margin: 10px 0; font-size: 8.5pt; }
@media print { body { padding: 15mm; } .no-print { display: none; } }
```

## Stopka standardowa (wkleić na dole każdego pliku, przed </body>)

```html
<div class="note" style="margin-top: 24px;">
  <strong>Podstawy prawne:</strong> Rozporządzenie (UE) 2024/3110 Parlamentu Europejskiego i Rady z dnia 23 października 2024 r.
  Tekst dostępny: <strong>eur-lex.europa.eu</strong> | Dokumentację przechowywać przez 10 lat od daty dostarczenia wyrobu (art. 20 ust. 4).
  <br><br>Szablon przygotowany przez: <strong>NowyCPR.pl</strong> — www.nowycpr.pl | biuro@multicert.pl | Multicert Sp. z o.o. PCA AC 210
</div>

<div class="no-print" style="margin-top:20px; padding:10px; background:#f0f4ff; border:1px solid #aac; font-size:9pt;">
  💡 <strong>Wskazówka:</strong> Aby zapisać jako PDF, użyj opcji drukowania (Ctrl+P) i wybierz "Zapisz jako PDF".
</div>
```

---

## Task 1: importer-dopc-szablon.html (Art. 16 ust. 3-4, Art. 17)

**Plik:** `public/docs/importer-dopc-szablon.html`

**Kolor akcentu nagłówka tabeli:** `#1e40af` (niebieski — odróżnia od producenta który ma `#2d3748`)

**Weryfikacja po stworzeniu:**
```bash
open /Users/admin/Downloads/nowy-cpr-pl/public/docs/importer-dopc-szablon.html
```
Sprawdź w przeglądarce: tytuł "Deklaracja... Importera", sekcje 1-9, pola podpisu, stopka Multicert.

**Pełna treść pliku:**

```html
<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Szablon DoP&C Importera — CPR 2024/3110 Art. 16 ust. 3-4, Art. 17</title>
<style>
  /* [CSS BAZOWY — wkleić tutaj] */
  th { background: #1e40af; color: #fff; padding: 5px 8px; text-align: left; font-size: 9pt; }
</style>
</head>
<body>

<div class="header-logo">NowyCPR.pl — wzór edukacyjny <span class="badge">CPR 2024/3110 Art. 17</span></div>

<h1>DEKLARACJA WŁAŚCIWOŚCI UŻYTKOWYCH I ZGODNOŚCI — IMPORTER (DoP&C-I)</h1>
<div class="subtitle">Wzór zgodny z Art. 16 ust. 3-4 i Art. 17 Rozporządzenia (UE) 2024/3110<br>
Stosowany gdy importer wprowadza wyrób do obrotu pod własną nazwą lub marką albo modyfikuje wyrób</div>
<div class="eu-ref">Podstawa prawna: Art. 16 ust. 3-4 i Art. 17 Rozporządzenia (UE) 2024/3110 | NowyCPR.pl</div>

<div class="important">
  ⚠️ <strong>UWAGA:</strong> Ten szablon stosuje się gdy importer: (1) wprowadza wyrób pod własną nazwą/marką, lub (2) modyfikuje wyrób już wprowadzony do obrotu (art. 17 ust. 3). Importer przejmuje wtedy wszystkie obowiązki producenta (art. 17 ust. 4). Szablon edukacyjny — dostosuj do konkretnego wyrobu przed użyciem.
</div>

<div class="section">
  <h2>1. Dane importera (podmiot wydający deklarację)</h2>
  <div class="field"><label>Nazwa importera:</label><div class="field-line"></div></div>
  <div class="field"><label>Adres rejestrowy (w UE):</label><div class="field-line"></div></div>
  <div class="field"><label>Kraj siedziby:</label><div class="field-line"></div></div>
  <div class="field"><label>NIP / VAT EU:</label><div class="field-line"></div></div>
  <div class="field"><label>Osoba kontaktowa:</label><div class="field-line"></div></div>
  <div class="field"><label>Adres email / tel.:</label><div class="field-line"></div></div>
</div>

<div class="section">
  <h2>2. Dane oryginalnego producenta (spoza UE)</h2>
  <div class="field"><label>Nazwa producenta:</label><div class="field-line"></div></div>
  <div class="field"><label>Adres producenta (kraj trzeci):</label><div class="field-line"></div></div>
  <div class="field"><label>Kraj pochodzenia wyrobu:</label><div class="field-line"></div></div>
  <div class="note">Importer jest zobowiązany do podania danych oryginalnego producenta na wyrobie lub opakowaniu, chyba że ich ujawnienie naruszałoby poufność handlową (art. 17 ust. 2 CPR 2024/3110).</div>
</div>

<div class="section">
  <h2>3. Identyfikacja wyrobu budowlanego</h2>
  <div class="field"><label>Nazwa handlowa wyrobu:</label><div class="field-line"></div></div>
  <div class="field"><label>Typ / Model / Seria:</label><div class="field-line"></div></div>
  <div class="field"><label>Kod identyfikacyjny wyrobu (art. 22 ust. 5):</label><div class="field-line"></div></div>
  <div class="field"><label>Nr partii / Nr seryjny:</label><div class="field-line"></div></div>
  <div class="field"><label>Zamierzone zastosowanie:</label><div class="field-line"></div></div>
</div>

<div class="section">
  <h2>4. Podstawa deklaracji — norma / ETA</h2>
  <div class="field"><label>Norma zharmonizowana (hEN):</label><div class="field-line"></div></div>
  <div class="field"><label>lub: Europejska Ocena Techniczna (ETA) nr:</label><div class="field-line"></div></div>
  <div class="field"><label>System AVS (Zał. IX CPR 2024/3110):</label><div class="field-line"></div></div>
  <div class="field"><label>Jednostka notyfikowana (NB), nr:</label><div class="field-line"></div></div>
</div>

<div class="section">
  <h2>5. Powód wystawienia deklaracji przez importera (art. 17 ust. 3)</h2>
  <table>
    <tr><th>Przesłanka</th><th>Zaznacz</th></tr>
    <tr><td>Importer wprowadza wyrób do obrotu pod własną nazwą lub marką handlową</td><td style="text-align:center;">□</td></tr>
    <tr><td>Importer zmienił wyrób już wprowadzony do obrotu w sposób mający wpływ na właściwości użytkowe</td><td style="text-align:center;">□</td></tr>
  </table>
  <div class="note">Spełnienie co najmniej jednej przesłanki jest warunkiem zastosowania tego formularza. Importer przejmuje wówczas pełną odpowiedzialność producenta (art. 17 ust. 4).</div>
</div>

<div class="section">
  <h2>6. Deklarowane właściwości użytkowe</h2>
  <table>
    <tr><th>Zasadnicza charakterystyka</th><th>Właściwość użytkowa / Klasa / NPD</th><th>Norma badań</th></tr>
    <tr class="empty-row"><td></td><td></td><td></td></tr>
    <tr class="empty-row"><td></td><td></td><td></td></tr>
    <tr class="empty-row"><td></td><td></td><td></td></tr>
    <tr class="empty-row"><td></td><td></td><td></td></tr>
    <tr class="empty-row"><td></td><td></td><td></td></tr>
  </table>
  <div class="note">„NPD" (No Performance Determined) — brak określonej właściwości użytkowej dla danej zasadniczej charakterystyki. Dopuszczalne gdy dana charakterystyka nie ma wpływu na zamierzone zastosowanie.</div>
</div>

<div class="section">
  <h2>7. Substancje wzbudzające szczególne obawy (SVHC) — art. 15 ust. 6</h2>
  <div class="field"><label>Czy wyrób zawiera substancje SVHC (&gt;0,1% w/w):</label><div class="field-line"></div></div>
  <div class="field"><label>Nazwa substancji SVHC (jeśli tak):</label><div class="field-line"></div></div>
  <div class="field"><label>Stężenie (% w/w):</label><div class="field-line"></div></div>
  <div class="note">Lista kandydatów SVHC: <strong>echa.europa.eu</strong> (253 pozycje, aktualizacja: 4 luty 2026 r.). Obowiązek ujawnienia dotyczy substancji SVHC obecnych w stężeniu &gt;0,1% masy wyrobu.</div>
</div>

<div class="section">
  <h2>8. Dostęp cyfrowy do deklaracji (art. 16)</h2>
  <div class="field"><label>URL do cyfrowej DoP&C-I:</label><div class="field-line"></div></div>
  <div class="field"><label>Kod QR (opis/lokalizacja na wyrobie):</label><div class="field-line"></div></div>
  <div class="note">Importer jest zobowiązany do udostępnienia DoP&C-I w formie cyfrowej (art. 16 ust. 1). Kod QR umieszczony na wyrobie lub opakowaniu musi prowadzić do aktualnej deklaracji.</div>
</div>

<div class="section">
  <h2>9. Oświadczenie importera</h2>
  <p style="font-size:9pt; line-height:1.6; margin-bottom:8px;">
    Niniejsza deklaracja właściwości użytkowych i zgodności wydana zostaje na wyłączną odpowiedzialność importera. Importer oświadcza, że na podstawie art. 17 ust. 3 Rozporządzenia (UE) 2024/3110 przejmuje pełną odpowiedzialność producenta za wyrób budowlany opisany powyżej.
  </p>
  <div class="signature-block">
    <div class="sig-field">
      <div class="sig-line"></div>
      <div class="sig-label">Miejscowość i data wydania</div>
    </div>
    <div class="sig-field">
      <div class="sig-line"></div>
      <div class="sig-label">Podpis i stanowisko osoby upoważnionej przez importera</div>
    </div>
  </div>
</div>

<!-- STOPKA STANDARDOWA -->

</body>
</html>
```

**Krok 1:** Utwórz plik z powyższą treścią — zastąp `/* [CSS BAZOWY — wkleić tutaj] */` pełnym blokiem CSS bazowego (bez linii `th { background:...}` bo jest już osobno zdefiniowana niżej), a `<!-- STOPKA STANDARDOWA -->` stopką standardową.

**Krok 2:** Otwórz w przeglądarce i sprawdź wizualnie. Ctrl+P — sprawdź podgląd wydruku.

---

## Task 2: dokumentacja-techniczna-art21.html (Art. 21)

**Plik:** `public/docs/dokumentacja-techniczna-art21.html`

**Kolor akcentu:** `#5b21b6` (fioletowy)

**Treść pliku:**

```html
<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Struktura Dokumentacji Technicznej — Art. 21 CPR 2024/3110</title>
<style>
  /* [CSS BAZOWY] */
  th { background: #5b21b6; color: #fff; padding: 5px 8px; text-align: left; font-size: 9pt; }
  .checklist-item { display: flex; align-items: flex-start; gap: 8px; margin: 5px 0; font-size: 9pt; }
  .checklist-item input[type=checkbox] { margin-top: 2px; flex-shrink: 0; }
</style>
</head>
<body>

<div class="header-logo">NowyCPR.pl — wzór edukacyjny <span class="badge">CPR 2024/3110 Art. 21</span></div>

<h1>DOKUMENTACJA TECHNICZNA WYROBU BUDOWLANEGO</h1>
<div class="subtitle">Struktura pliku technicznego wymaganego przez Art. 21 Rozporządzenia (UE) 2024/3110<br>
Dokument wewnętrzny producenta — przechowywać przez 10 lat od daty dostarczenia wyrobu</div>
<div class="eu-ref">Podstawa prawna: Art. 21 Rozporządzenia (UE) 2024/3110 | NowyCPR.pl</div>

<div class="important">
  ⚠️ <strong>UWAGA:</strong> Dokumentacja techniczna (art. 21) to wewnętrzny plik producenta — nie jest publicznie udostępniany. Musi być kompletna i dostępna dla organów nadzoru rynku na żądanie. Przechowywać 10 lat od daty dostarczenia ostatniego egzemplarza wyrobu (art. 20 ust. 4).
</div>

<div class="section">
  <h2>1. Dane producenta i wyrób</h2>
  <div class="field"><label>Nazwa i adres producenta:</label><div class="field-line"></div></div>
  <div class="field"><label>Nazwa handlowa wyrobu:</label><div class="field-line"></div></div>
  <div class="field"><label>Typ / Model / Seria / Nr katalogowy:</label><div class="field-line"></div></div>
  <div class="field"><label>Zamierzone zastosowanie:</label><div class="field-line"></div></div>
  <div class="field"><label>Norma zharmonizowana (hEN) / ETA nr:</label><div class="field-line"></div></div>
  <div class="field"><label>System AVS (1+, 1, 2+, 3, 3+, 4):</label><div class="field-line"></div></div>
  <div class="field"><label>Data sporządzenia dokumentacji:</label><div class="field-line"></div></div>
  <div class="field"><label>Nr wersji / rewizji:</label><div class="field-line"></div></div>
</div>

<div class="section">
  <h2>2. Opis wyrobu i jego składniki</h2>
  <div class="field"><label>Opis ogólny wyrobu:</label><div class="field-line"></div></div>
  <table>
    <tr><th>Składnik / materiał</th><th>Specyfikacja / norma</th><th>Dostawca</th></tr>
    <tr class="empty-row"><td></td><td></td><td></td></tr>
    <tr class="empty-row"><td></td><td></td><td></td></tr>
    <tr class="empty-row"><td></td><td></td><td></td></tr>
  </table>
</div>

<div class="section">
  <h2>3. Wymagania zasadnicze i charakterystyki użytkowe</h2>
  <table>
    <tr><th>Zasadnicza charakterystyka</th><th>Metoda oceny</th><th>Deklarowana wartość / klasa</th><th>Norma badań</th></tr>
    <tr class="empty-row"><td></td><td></td><td></td><td></td></tr>
    <tr class="empty-row"><td></td><td></td><td></td><td></td></tr>
    <tr class="empty-row"><td></td><td></td><td></td><td></td></tr>
    <tr class="empty-row"><td></td><td></td><td></td><td></td></tr>
  </table>
</div>

<div class="section">
  <h2>4. Wykaz dokumentów składowych pliku technicznego</h2>
  <p style="font-size:9pt; margin-bottom:8px;">Zaznacz dokumenty zgromadzone w pliku technicznym:</p>
  <div class="checklist-item"><input type="checkbox"> <span>Rysunki techniczne wyrobu i jego składników (wymiary, tolerancje, materiały)</span></div>
  <div class="checklist-item"><input type="checkbox"> <span>Specyfikacje techniczne surowców i materiałów</span></div>
  <div class="checklist-item"><input type="checkbox"> <span>Sprawozdania z badań typu (ITT — Initial Type Testing)</span></div>
  <div class="checklist-item"><input type="checkbox"> <span>Obliczenia i analizy techniczne potwierdzające właściwości użytkowe</span></div>
  <div class="checklist-item"><input type="checkbox"> <span>Certyfikat zgodności FPC wydany przez jednostkę notyfikowaną (AVS 2+)</span></div>
  <div class="checklist-item"><input type="checkbox"> <span>Certyfikat stałości właściwości użytkowych (AVS 1+, 1) — nr: ___________</span></div>
  <div class="checklist-item"><input type="checkbox"> <span>Sprawozdanie z badań jednostki notyfikowanej (AVS 3) — nr: ___________</span></div>
  <div class="checklist-item"><input type="checkbox"> <span>Deklaracja środowiskowa produktu EPD (AVS 3+) — nr: ___________</span></div>
  <div class="checklist-item"><input type="checkbox"> <span>Europejska Ocena Techniczna ETA — nr: ___________ (jeśli brak hEN)</span></div>
  <div class="checklist-item"><input type="checkbox"> <span>Instrukcja stosowania i montażu (art. 25)</span></div>
  <div class="checklist-item"><input type="checkbox"> <span>Deklaracja właściwości użytkowych i zgodności DoP&C</span></div>
  <div class="checklist-item"><input type="checkbox"> <span>Dokumentacja systemu FPC (procedury, rejestry kontroli, wyniki badań)</span></div>
  <div class="checklist-item"><input type="checkbox"> <span>Informacje o substancjach SVHC (art. 15 ust. 6) — karta charakterystyki SDS</span></div>
  <div class="checklist-item"><input type="checkbox"> <span>Wyniki monitoringu dalszej produkcji (badania partii produkcyjnych)</span></div>
</div>

<div class="section">
  <h2>5. Dane jednostki notyfikowanej (jeśli dotyczy)</h2>
  <div class="field"><label>Nazwa jednostki notyfikowanej (NB):</label><div class="field-line"></div></div>
  <div class="field"><label>Nr identyfikacyjny NB (numer CE):</label><div class="field-line"></div></div>
  <div class="field"><label>Nr i data certyfikatu / sprawozdania:</label><div class="field-line"></div></div>
  <div class="field"><label>Zakres certyfikacji / oceny:</label><div class="field-line"></div></div>
  <div class="field"><label>Data ważności certyfikatu:</label><div class="field-line"></div></div>
</div>

<div class="section">
  <h2>6. Historia zmian dokumentacji</h2>
  <table>
    <tr><th>Nr wersji</th><th>Data</th><th>Opis zmiany</th><th>Odpowiedzialny</th></tr>
    <tr class="empty-row"><td></td><td></td><td></td><td></td></tr>
    <tr class="empty-row"><td></td><td></td><td></td><td></td></tr>
  </table>
</div>

<div class="section">
  <h2>7. Oświadczenie o kompletności</h2>
  <p style="font-size:9pt; line-height:1.6; margin-bottom:8px;">
    Potwierdzam, że dokumentacja techniczna dla wyrobu opisanego powyżej jest kompletna i odzwierciedla właściwości użytkowe wyrobu. Zobowiązuję się do przechowywania niniejszej dokumentacji przez 10 lat od daty dostarczenia ostatniego egzemplarza wyrobu do obrotu (art. 20 ust. 4 CPR 2024/3110) i udostępnienia jej organom nadzoru rynku na żądanie.
  </p>
  <div class="signature-block">
    <div class="sig-field">
      <div class="sig-line"></div>
      <div class="sig-label">Miejscowość i data</div>
    </div>
    <div class="sig-field">
      <div class="sig-line"></div>
      <div class="sig-label">Podpis osoby odpowiedzialnej za dokumentację techniczną</div>
    </div>
  </div>
</div>

<!-- STOPKA STANDARDOWA -->
</body>
</html>
```

---

## Task 3: instrukcja-uzytkownika-art25.html (Art. 25)

**Plik:** `public/docs/instrukcja-uzytkownika-art25.html`

**Kolor akcentu:** `#065f46` (ciemnozielony)

**Treść pliku:**

```html
<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Instrukcja dla Profesjonalnych Użytkowników — Art. 25 CPR 2024/3110</title>
<style>
  /* [CSS BAZOWY] */
  th { background: #065f46; color: #fff; padding: 5px 8px; text-align: left; font-size: 9pt; }
  .warning-box { background: #fef3c7; border: 1px solid #d97706; padding: 8px 10px; margin: 8px 0; font-size: 9pt; }
</style>
</head>
<body>

<div class="header-logo">NowyCPR.pl — wzór edukacyjny <span class="badge">CPR 2024/3110 Art. 25</span></div>

<h1>INSTRUKCJA DLA PROFESJONALNYCH UŻYTKOWNIKÓW</h1>
<div class="subtitle">Wzór zgodny z Art. 25 Rozporządzenia (UE) 2024/3110<br>
Informacje i instrukcje bezpiecznego stosowania wyrobu budowlanego</div>
<div class="eu-ref">Podstawa prawna: Art. 25 Rozporządzenia (UE) 2024/3110 | NowyCPR.pl</div>

<div class="important">
  ⚠️ <strong>UWAGA:</strong> Producent jest zobowiązany dostarczyć instrukcje w językach urzędowych państwa członkowskiego, w którym wyrób jest udostępniany na rynku (art. 25 ust. 2). Niniejszy szablon należy przetłumaczyć jeśli wyrób jest eksportowany. Szablon edukacyjny — dostosuj do swojego wyrobu.
</div>

<div class="section">
  <h2>1. Dane producenta i wyrób</h2>
  <div class="field"><label>Producent:</label><div class="field-line"></div></div>
  <div class="field"><label>Adres:</label><div class="field-line"></div></div>
  <div class="field"><label>Email / tel. techniczny:</label><div class="field-line"></div></div>
  <div class="field"><label>Strona www:</label><div class="field-line"></div></div>
  <div class="field"><label>Nazwa wyrobu:</label><div class="field-line"></div></div>
  <div class="field"><label>Nr katalogowy / typ:</label><div class="field-line"></div></div>
  <div class="field"><label>Norma zharmonizowana / ETA:</label><div class="field-line"></div></div>
  <div class="field"><label>DoP&C dostępna pod adresem:</label><div class="field-line"></div></div>
  <div class="field"><label>Data wydania instrukcji / wersja:</label><div class="field-line"></div></div>
</div>

<div class="section">
  <h2>2. Zamierzone zastosowanie</h2>
  <div class="field"><label>Zastosowanie wyrobu:</label><div class="field-line"></div></div>
  <div class="field"><label>Typ budynku / obiektu:</label><div class="field-line"></div></div>
  <div class="field"><label>Ograniczenia zastosowania:</label><div class="field-line"></div></div>
  <div class="note">Wyrób może być stosowany wyłącznie zgodnie z zamierzonym zastosowaniem opisanym w normie zharmonizowanej / ETA i niniejszej instrukcji.</div>
</div>

<div class="section">
  <h2>3. Właściwości użytkowe (podsumowanie)</h2>
  <table>
    <tr><th>Charakterystyka</th><th>Wartość / Klasa</th><th>Uwagi dla użytkownika</th></tr>
    <tr class="empty-row"><td></td><td></td><td></td></tr>
    <tr class="empty-row"><td></td><td></td><td></td></tr>
    <tr class="empty-row"><td></td><td></td><td></td></tr>
  </table>
</div>

<div class="section">
  <h2>4. Wymagania dotyczące podłoża i przygotowania</h2>
  <div class="field"><label>Wymagania dotyczące podłoża:</label><div class="field-line"></div></div>
  <div class="field"><label>Przygotowanie powierzchni:</label><div class="field-line"></div></div>
  <div class="field"><label>Warunki środowiskowe (temp., wilgotność):</label><div class="field-line"></div></div>
</div>

<div class="section">
  <h2>5. Instrukcja montażu / zastosowania</h2>
  <table>
    <tr><th>Krok</th><th>Czynność</th><th>Uwagi / Narzędzia</th></tr>
    <tr><td>1</td><td></td><td></td></tr>
    <tr><td>2</td><td></td><td></td></tr>
    <tr><td>3</td><td></td><td></td></tr>
    <tr><td>4</td><td></td><td></td></tr>
    <tr><td>5</td><td></td><td></td></tr>
  </table>
</div>

<div class="section">
  <h2>6. Bezpieczeństwo i higiena pracy (BHP)</h2>
  <div class="warning-box">
    ⚠️ <strong>OSTRZEŻENIE:</strong> Przed przystąpieniem do pracy zapoznaj się z kartą charakterystyki (SDS) substancji stosowanych w wyrobie.
  </div>
  <div class="field"><label>Środki ochrony osobistej (ŚOI):</label><div class="field-line"></div></div>
  <div class="field"><label>Wentylacja podczas stosowania:</label><div class="field-line"></div></div>
  <div class="field"><label>Pierwsza pomoc (kontakt ze skórą/oczami):</label><div class="field-line"></div></div>
  <div class="field"><label>Postępowanie w razie pożaru:</label><div class="field-line"></div></div>
  <div class="note">Substancje SVHC (art. 15 ust. 6 CPR 2024/3110): <div class="field-line" style="display:inline-block; width:200px;"></div>. Karta SDS dostępna na żądanie.</div>
</div>

<div class="section">
  <h2>7. Warunki przechowywania i transportu</h2>
  <div class="field"><label>Temperatura przechowywania:</label><div class="field-line"></div></div>
  <div class="field"><label>Wilgotność / warunki specjalne:</label><div class="field-line"></div></div>
  <div class="field"><label>Termin przydatności (jeśli dotyczy):</label><div class="field-line"></div></div>
  <div class="field"><label>Warunki transportu:</label><div class="field-line"></div></div>
</div>

<div class="section">
  <h2>8. Informacje środowiskowe</h2>
  <div class="field"><label>Globalny potencjał ocieplenia (GWP100):</label><div class="field-line"></div></div>
  <div class="field"><label>EPD (nr, program):</label><div class="field-line"></div></div>
  <div class="field"><label>Utylizacja / recykling:</label><div class="field-line"></div></div>
  <div class="note">Pełne dane środowiskowe dostępne w Deklaracji Środowiskowej Produktu (EPD) pod adresem: <div class="field-line" style="display:inline-block; width:180px;"></div></div>
</div>

<div class="section">
  <h2>9. Konserwacja i obsługa po montażu</h2>
  <div class="field"><label>Zalecenia konserwacyjne:</label><div class="field-line"></div></div>
  <div class="field"><label>Częstotliwość przeglądów:</label><div class="field-line"></div></div>
  <div class="field"><label>Trwałość / okres użytkowania:</label><div class="field-line"></div></div>
</div>

<!-- STOPKA STANDARDOWA -->
</body>
</html>
```

---

## Task 4: mandat-przedstawiciela-art23.html (Art. 23)

**Plik:** `public/docs/mandat-przedstawiciela-art23.html`

**Kolor akcentu:** `#92400e` (pomarańczowy/brązowy)

**Treść pliku:**

```html
<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Mandat Upoważnionego Przedstawiciela — Art. 23 CPR 2024/3110</title>
<style>
  /* [CSS BAZOWY] */
  th { background: #92400e; color: #fff; padding: 5px 8px; text-align: left; font-size: 9pt; }
</style>
</head>
<body>

<div class="header-logo">NowyCPR.pl — wzór edukacyjny <span class="badge">CPR 2024/3110 Art. 23</span></div>

<h1>MANDAT UPOWAŻNIONEGO PRZEDSTAWICIELA PRODUCENTA</h1>
<div class="subtitle">Wzór zgodny z Art. 23 Rozporządzenia (UE) 2024/3110<br>
Producent mający siedzibę poza Unią Europejską może wyznaczyć pisemnym mandatem upoważnionego przedstawiciela w UE</div>
<div class="eu-ref">Podstawa prawna: Art. 23 Rozporządzenia (UE) 2024/3110 | NowyCPR.pl</div>

<div class="important">
  ⚠️ <strong>UWAGA:</strong> Upoważniony przedstawiciel (art. 23) wykonuje obowiązki określone w mandacie. Mandatu nie można powierzyć ocenianiu właściwości użytkowych ani zakładowej kontroli produkcji (art. 23 ust. 3). Producent spoza UE musi mieć przedstawiciela lub importera dla wyrobów objętych CPR. Szablon edukacyjny — skonsultuj z prawnikiem przed podpisaniem.
</div>

<div class="section">
  <h2>1. Producent (mocodawca)</h2>
  <div class="field"><label>Nazwa producenta:</label><div class="field-line"></div></div>
  <div class="field"><label>Adres rejestrowy:</label><div class="field-line"></div></div>
  <div class="field"><label>Kraj siedziby (spoza UE):</label><div class="field-line"></div></div>
  <div class="field"><label>Nr rejestrowy / handlowy:</label><div class="field-line"></div></div>
  <div class="field"><label>Imię i nazwisko osoby upoważnionej do podpisania:</label><div class="field-line"></div></div>
  <div class="field"><label>Stanowisko:</label><div class="field-line"></div></div>
</div>

<div class="section">
  <h2>2. Upoważniony przedstawiciel (pełnomocnik)</h2>
  <div class="field"><label>Nazwa / Imię i nazwisko przedstawiciela:</label><div class="field-line"></div></div>
  <div class="field"><label>Adres rejestrowy (w UE):</label><div class="field-line"></div></div>
  <div class="field"><label>Kraj siedziby (państwo UE):</label><div class="field-line"></div></div>
  <div class="field"><label>NIP / VAT EU:</label><div class="field-line"></div></div>
  <div class="field"><label>Adres email / tel.:</label><div class="field-line"></div></div>
</div>

<div class="section">
  <h2>3. Wyrób objęty mandatem</h2>
  <div class="field"><label>Nazwa/opis wyrobu budowlanego:</label><div class="field-line"></div></div>
  <div class="field"><label>Typ / Model / Nr katalogowy:</label><div class="field-line"></div></div>
  <div class="field"><label>Norma zharmonizowana / ETA:</label><div class="field-line"></div></div>
  <div class="note">Mandat może obejmować jeden wyrób, linię produktów lub wszystkie wyroby producenta — doprecyzować poniżej.</div>
  <div class="field"><label>Zakres wyrobów objętych mandatem:</label><div class="field-line"></div></div>
</div>

<div class="section">
  <h2>4. Zakres upoważnienia (art. 23 ust. 2 CPR 2024/3110)</h2>
  <p style="font-size:9pt; margin-bottom:8px;">Producent upoważnia przedstawiciela do wykonywania następujących zadań w jego imieniu:</p>
  <table>
    <tr><th>Zadanie</th><th>Art.</th><th>Upoważnienie</th></tr>
    <tr><td>Przechowywanie DoP&C i dokumentacji technicznej do dyspozycji organów nadzoru</td><td>art. 23 ust. 2 lit. a)</td><td style="text-align:center;">□ Tak / □ Nie</td></tr>
    <tr><td>Współpraca z właściwymi organami krajowymi na ich wniosek</td><td>art. 23 ust. 2 lit. b)</td><td style="text-align:center;">□ Tak / □ Nie</td></tr>
    <tr><td>Dostarczanie organom wszelkich informacji i dokumentacji niezbędnej do wykazania zgodności wyrobu</td><td>art. 23 ust. 2 lit. c)</td><td style="text-align:center;">□ Tak / □ Nie</td></tr>
    <tr><td>Informowanie producenta o każdym ryzyku stwarzanym przez wyrób</td><td>art. 23 ust. 2 lit. d)</td><td style="text-align:center;">□ Tak / □ Nie</td></tr>
    <tr><td>Udostępnianie DoP&C w formie cyfrowej (art. 16)</td><td>art. 16</td><td style="text-align:center;">□ Tak / □ Nie</td></tr>
  </table>
  <div class="note">⛔ ZAKAZ (art. 23 ust. 3): Mandatu nie można powierzyć dokonywaniu oceny właściwości użytkowych wyrobu ani organizowaniu i nadzorowaniu zakładowej kontroli produkcji (FPC). Te zadania pozostają wyłącznie po stronie producenta.</div>
</div>

<div class="section">
  <h2>5. Czas obowiązywania mandatu</h2>
  <div class="field"><label>Data wejścia w życie mandatu:</label><div class="field-line"></div></div>
  <div class="field"><label>Data wygaśnięcia (lub: bezterminowo):</label><div class="field-line"></div></div>
  <div class="field"><label>Warunki wypowiedzenia (okres / forma):</label><div class="field-line"></div></div>
</div>

<div class="section">
  <h2>6. Prawo właściwe i jurysdykcja</h2>
  <div class="field"><label>Prawo właściwe:</label><div class="field-line"></div></div>
  <div class="field"><label>Sąd właściwy do rozstrzygania sporów:</label><div class="field-line"></div></div>
</div>

<div class="section">
  <h2>7. Podpisy stron</h2>
  <p style="font-size:9pt; margin-bottom:12px;">Strony potwierdzają zawarcie niniejszego mandatu upoważniającego, sporządzonego w dwóch jednobrzmiących egzemplarzach.</p>
  <div class="signature-block">
    <div class="sig-field">
      <div class="sig-line"></div>
      <div class="sig-label">Producent (mocodawca)<br>Imię, nazwisko, pieczęć, data</div>
    </div>
    <div class="sig-field">
      <div class="sig-line"></div>
      <div class="sig-label">Upoważniony przedstawiciel<br>Imię, nazwisko, pieczęć, data</div>
    </div>
  </div>
</div>

<!-- STOPKA STANDARDOWA -->
</body>
</html>
```

---

## Task 5: Aktualizacja documentHelpers.ts

**Plik:** `src/utils/documentHelpers.ts`

**Krok 1:** W tablicy `documents[]` dodaj 4 nowe wpisy (po ostatnim elemencie `avcp-systems`):

```typescript
  {
    id: "importer-dopc",
    title: "Szablon DoP&C dla importera (Art. 17 CPR 2024/3110)",
    description: "Wzór deklaracji właściwości użytkowych i zgodności wystawianej przez importera wprowadzającego wyrób pod własną marką lub modyfikującego wyrób (art. 16 ust. 3-4 i art. 17 CPR 2024/3110). Importer przejmuje pełną odpowiedzialność producenta.",
    icon: "🔵",
    fileType: "HTML",
    language: "PL",
    updatedAt: "02.2026"
  },
  {
    id: "tech-file",
    title: "Struktura dokumentacji technicznej (Art. 21 CPR 2024/3110)",
    description: "Szablon wewnętrznego pliku technicznego wymaganego przez art. 21 CPR 2024/3110. Zawiera listę kontrolną dokumentów, opis wyrobu, wyniki badań, certyfikaty NB i oświadczenie o kompletności. Przechowywać 10 lat od daty dostarczenia wyrobu.",
    icon: "🗂️",
    fileType: "HTML",
    language: "PL",
    updatedAt: "02.2026"
  },
  {
    id: "user-instructions",
    title: "Instrukcja dla profesjonalnych użytkowników (Art. 25 CPR 2024/3110)",
    description: "Wzór instrukcji stosowania wyrobu budowlanego zgodny z art. 25 CPR 2024/3110. Obejmuje zamierzone zastosowanie, instrukcję montażu, wymagania BHP, warunki przechowywania, informacje środowiskowe i dane kontaktowe producenta.",
    icon: "📘",
    fileType: "HTML",
    language: "PL",
    updatedAt: "02.2026"
  },
  {
    id: "auth-rep-mandate",
    title: "Mandat upoważnionego przedstawiciela (Art. 23 CPR 2024/3110)",
    description: "Wzór pisemnego mandatu upoważnionego przedstawiciela dla producentów spoza UE zgodny z art. 23 CPR 2024/3110. Zawiera zakres upoważnienia, czas obowiązywania, zakazy mandatowe (brak uprawnień do FPC i oceny właściwości).",
    icon: "📜",
    fileType: "HTML",
    language: "PL",
    updatedAt: "02.2026"
  },
```

**Krok 2:** W mapie `documentUrls` dodaj 4 nowe wpisy:

```typescript
  "importer-dopc":    "/docs/importer-dopc-szablon.html",
  "tech-file":        "/docs/dokumentacja-techniczna-art21.html",
  "user-instructions":"/docs/instrukcja-uzytkownika-art25.html",
  "auth-rep-mandate": "/docs/mandat-przedstawiciela-art23.html",
```

**Weryfikacja:**
```bash
grep -c "id:" src/utils/documentHelpers.ts
# Powinno zwrócić: 12
```

---

## Task 6: Build i deploy

**Krok 1:** Build
```bash
cd /Users/admin/Downloads/nowy-cpr-pl && npm run build 2>&1 | tail -5
# Oczekiwane: ✓ built in X.XXs (brak błędów)
```

**Krok 2:** Sprawdź dist/docs
```bash
ls /Users/admin/Downloads/nowy-cpr-pl/dist/docs/ | wc -l
# Oczekiwane: 12 (było 8, dodajemy 4)
```

**Krok 3:** Commit i push
```bash
git add public/docs/ dist/ src/utils/documentHelpers.ts
git commit -m "feat: dodaj 4 brakujące szablony CPR 2024/3110 (importer, plik tech, instrukcja, mandat)"
git push origin main
```

---

## Definicja sukcesu

- [ ] 4 pliki HTML w `public/docs/` — każdy otwiera się w przeglądarce i wygląda poprawnie
- [ ] `dist/docs/` zawiera 12 plików (były 8)
- [ ] Na stronie `/dokumenty` widać 12 kart dokumentów
- [ ] Formularz email → kliknięcie "Pobierz" → otwiera właściwy dokument w nowej karcie
- [ ] Ctrl+P → podgląd wydruku wygląda poprawnie (bez elementów `.no-print`)
- [ ] Build bez błędów TypeScript
