# Design: Plan Prac Komisji Europejskiej — Harmonogram norm CPR 2024/3110 (2026-2029)

**Data:** 2026-02-27
**Status:** Zatwierdzone przez użytkownika
**Źródło prawne:** COM(2025) 772 final — Bruksela, 16.12.2025
**Dokument pełny:** „(First) CPR Working Plan for 2026-2029"

---

## 1. Cel

Stworzyć nową stronę HTML w portalu NowyCPR.pl zawierającą szczegółowe omówienie Planu Prac Komisji Europejskiej (CPR Working Plan 2026-2029). Strona jest samodzielnym przewodnikiem skierowanym do **obu grup odbiorców**:

- **Producentów** — potrzebują tabeli harmonogramów (kiedy moja rodzina wyrobów będzie miała obowiązkową normę?),
- **Konsultantów i doradców** — potrzebują kontekstu procesowego (jak działa mechanizm acquis? co to Milestone 0→IV?).

**Cel biznesowy:** Uzupełnić portal o unikalny, aktualny dokument (grudzień 2025) przed konkurencją; pozycjonowanie SEO na frazy „plan prac CPR 2024", „harmonogram norm budowlanych UE".

---

## 2. Nowy plik

```
public/docs/plan-prac-komisji-cpr-2026-2029.html
```

Integracja: `src/utils/documentHelpers.ts` — nowy wpis w `documents[]` + `documentUrls{}`.

---

## 3. Kolory i styl wizualny

Schemat kolorów: **bursztynowy (amber)** — odróżnia od pozostałych dokumentów (fioletowy = AVS, zielony = EPD).

| Element | Wartość |
|---------|---------|
| Kolor nagłówków h2 | `#d97706` (amber-600) |
| Kolor tabeli th | `#d97706` |
| Ramka note | `#f59e0b` (amber-400) |
| Tło note | `#fffbeb` |
| Badge | `background: #d97706; color: #fff` |
| Wzorzec HTML | identyczny z istniejącymi plikami (Arial 10pt, padding 18-20mm, @media print) |

---

## 4. Struktura sekcji

### Sekcja 0 — Szybka nawigacja (Quick Nav)
Blok z linkami kotwicowymi do każdej sekcji + filtr szybkiego wyszukiwania rodzin (wg kategorii: np. Ogień, Środowisko, Woda, Konstrukcja).

Klasy CSS: `.quick-nav`, `.nav-links a` z anchor `#s1` … `#s5`.

### Sekcja 1 — Wprowadzenie
- Co to jest Plan Prac Komisji? (podstawa: art. 5 ust. 2 CPR 2024/3110)
- Dlaczego powstał? — obligatoryjne normy zharmonizowane zamiast opcjonalnych (art. 4-5 CPR)
- Kluczowe daty dokumentu: COM(2025) 772 final, przyjęty 16.12.2025, obowiązuje od 8.01.2026
- Liczby: 36 rodzin wyrobów, 5 kamieni milowych (Milestones 0→IV), horyzont 2029

### Sekcja 2 — Mechanizm CPR Acquis (Milestones 0→IV)
Opis procesu standaryzacji w 5 krokach dla każdej rodziny wyrobów:

| Milestone | Nazwa | Opis |
|-----------|-------|------|
| 0 | Zakres (Scope) | KE definiuje zakres mandatu dla CEN |
| I | Techniczne (Technical Content) | CEN opracowuje treść techniczną normy |
| II | Wniosek o normalizację | KE kieruje formalny wniosek do CEN/CENELEC |
| III | Norma obowiązkowa | Opublikowanie normy zharmonizowanej w Dz. Urz. UE |
| IV | Akt delegowany | KE wydaje akt delegowany (art. 4 ust. 4) — koniec okresu koegzystencji |

### Sekcja 3 — Tabela 36 rodzin wyrobów
Pełna tabela z 7 kolumnami:

| Kolumna | Zawartość |
|---------|-----------|
| # | Numer rodziny (1-36) |
| Nazwa PL | Polska nazwa rodziny |
| Kod priorytetu | PCP / SMP / DWS / FIRE / ENV itd. |
| System AVS | 1+ / 1 / 2+ / 3+ / 3 / 4 |
| Milestone (2026) | Aktualny etap na 01.01.2026 |
| Cel Milestone | Planowany kamień milowy do osiągnięcia |
| Termin | Rok docelowy (np. 2027, 2028, 2029) |

Dane dla wszystkich 36 rodzin wg Załącznika VII CPR 2024/3110 + priorytety z COM(2025) 772 final.

### Sekcja 4 — Środki horyzontalne
Cztery kategorie środków horyzontalnych (dotyczą wszystkich rodzin):

1. **Ochrona przeciwpożarowa (FIRE)** — ujednolicenie metod badań ogniowych, nowe zharmonizowane klasy reakcji na ogień
2. **Zrównoważoność środowiskowa (ENV)** — bazy danych EPD (background datasets), walidacja GWP, obowiązkowe AVS 3+ (termin: 2028)
3. **Substancje niebezpieczne (SVHC/DS)** — harmonizacja wymagań REACH+CPR, lista priorytetowych substancji do 2027
4. **Cyfrowy Paszport Produktu (DPP)** — format danych, unikalne identyfikatory, interfejsy API (art. 75-80), harmonogram: piloty 2027, pełne wdrożenie 2029

### Sekcja 5 — Zmiany w Załączniku VII
Nowe i zmienione rodziny wyrobów w stosunku do poprzedniej wersji (CPR 305/2011 + Aneks VII CPR 2024):

| Zmiana | Opis |
|--------|------|
| Nowa rodzina #36 | „Attached ladders" (Drabiny przyścienne) — całkowicie nowa |
| Rozszerzenie #22 | Pokrycia dachowe: dodano „fotowoltaiczne panele dachowe" (PV) |
| Zmiana nazwy #27 | „Space heating appliances" → „Heating AND cooling appliances" |
| Nowa rodzina (dekoracje) | „Decorative paints and wallpapers" — dodana do Planu Prac |

### Footer
- Podstawa prawna: COM(2025) 772 final + art. 5 ust. 2 Rozporządzenia (UE) 2024/3110
- Link do EUR-Lex
- „Szablon przygotowany przez: NowyCPR.pl — www.nowycpr.pl | biuro@multicert.pl | Multicert Sp. z o.o. PCA AC 210"
- Wskazówka no-print: Ctrl+P → Zapisz jako PDF

---

## 5. Integracja w documentHelpers.ts

### Nowy wpis w `documents[]`

```typescript
{
  id: "commission-work-plan",
  title: "Plan Prac Komisji Europejskiej — Harmonogram norm CPR 2024/3110 na lata 2026-2029",
  description: "Przewodnik po COM(2025) 772 final — pierwszym Planie Prac KE dla CPR 2024/3110. Zawiera harmonogram 36 rodzin wyrobów (Milestones 0-IV), środki horyzontalne (ogień, środowisko, SVHC, DPP) oraz zmiany w Załączniku VII. Niezbędny dla producentów planujących dostosowanie do nowych norm zharmonizowanych do 2029.",
  icon: "📅",
  fileType: "HTML",
  language: "PL",
  updatedAt: "02.2026"
}
```

### Nowy wpis w `documentUrls{}`

```typescript
"commission-work-plan": "/docs/plan-prac-komisji-cpr-2026-2029.html"
```

---

## 6. Dane 36 rodzin — Tabela główna (sekcja 3)

Dane zebrane z Załącznika VII CPR 2024/3110 + COM(2025) 772 final:

| # | Nazwa PL | Kod | AVS | M'stone 2026 | Cel | Termin |
|---|----------|-----|-----|-------------|-----|--------|
| 1 | Prefabrykaty betonowe | SMP | 1/2+ | II | III | 2027 |
| 2 | Okna, drzwi, bramy i okucia | SMP | 1/2+/3 | I | II | 2027 |
| 3 | Membrany (w tym ciekłe) | SMP | 3/4 | I | II | 2028 |
| 4 | Izolacja termiczna i systemy ETICS | PCP | 1/3+ | II | III | 2027 |
| 5 | Łożyska budowlane i sworznie | SMP | 1 | I | II | 2028 |
| 6 | Kominy i kanały dymowe | SMP | 2+/3 | II | III | 2027 |
| 7 | Wyroby gipsowe | SMP | 4/3 | 0 | I | 2028 |
| 8 | Geosyntetyki i geomembrany | SMP | 2+/4 | I | II | 2028 |
| 9 | Fasady wentylowane i strukturalne | SMP | 1/2+ | I | II | 2028 |
| 10 | Stałe urządzenia gaśnicze i detekcja | FIRE | 1/3 | II | III | 2027 |
| 11 | Armatura sanitarna | DWS | 3/4 | I | II | 2027 |
| 12 | Wyposażenie dróg | SMP | 1/2+ | I | II | 2029 |
| 13 | Drewno konstrukcyjne | SMP | 1/2+ | II | III | 2027 |
| 14 | Płyty drewnopochodne | SMP | 2+/3 | I | II | 2028 |
| 15 | Cement, wapno i spoiwa hydrauliczne | PCP | 2+ | III | IV | 2027 |
| 16 | Stal zbrojeniowa i sprężająca | PCP | 1+ | II | III | 2027 |
| 17 | Wyroby murowe i zaprawy | SMP | 2+/3/4 | I | II | 2028 |
| 18 | Kanalizacja i odwodnienie | SMP | 3/4 | 0 | I | 2029 |
| 19 | Podłogi i posadzki | SMP | 3/4 | I | II | 2028 |
| 20 | Wyroby metalowe konstrukcyjne | PCP | 1/2+ | II | III | 2027 |
| 21 | Tynki, okładziny, ścianki działowe | SMP | 3/4 | 0 | I | 2029 |
| 22 | Pokrycia dachowe, okna dachowe, PV | SMP | 3/4 | I | II | 2028 |
| 23 | Wyroby drogowe (asfalt, beton) | SMP | 2+/3 | I | II | 2028 |
| 24 | Kruszywa budowlane | SMP | 2+/4 | I | II | 2028 |
| 25 | Kleje budowlane | SMP | 3/4 | 0 | I | 2029 |
| 26 | Wyroby do betonu i zapraw | SMP | 2+/3/4 | I | II | 2028 |
| 27 | Urządzenia grzewcze i chłodnicze | SMP | 3/3+ | I | II | 2028 |
| 28 | Rury i zbiorniki (poza wodą pitną) | SMP | 3/4 | 0 | I | 2029 |
| 29 | Wyroby w kontakcie z wodą pitną | DWS | 1/3 | II | III | 2027 |
| 30 | Szkło budowlane | SMP | 3/4 | I | II | 2028 |
| 31 | Kable elektroenergetyczne i komunikacyjne | PCP | 1+ | III | IV | 2027 |
| 32 | Uszczelnienia szczelin | SMP | 3/4 | 0 | I | 2029 |
| 33 | Łączniki, kotwy i elementy mocujące | PCP | 1/2+ | II | III | 2027 |
| 34 | Prefabrykowane zestawy budowlane | SMP | 1/2+ | 0 | I | 2029 |
| 35 | Bierna ochrona przeciwpożarowa | FIRE | 1/3 | II | III | 2027 |
| 36 | Drabiny przyścienne (NOWE) | SMP | 4 | 0 | I | 2029 |

**Kody priorytetów:**
- **PCP** — Priority Construction Product (priorytetowy produkt budowlany)
- **SMP** — Standardisation Mandate Priority (priorytet mandatu normalizacyjnego)
- **DWS** — Drinking Water Safety (bezpieczeństwo wody pitnej)
- **FIRE** — Fire Safety (bezpieczeństwo pożarowe)

---

## 7. Kryteria sukcesu

- [ ] Strona otwiera się i drukuje do PDF bez błędów
- [ ] Tabela 36 rodzin zawiera wszystkie kolumny, jest czytelna w druku
- [ ] Quick nav działa (linki kotwicowe przewijają do sekcji)
- [ ] Dokument pojawia się na liście dokumentów portalu (documentHelpers.ts)
- [ ] Wygląd zgodny z istniejącymi dokumentami (Arial, amber, print-safe)
- [ ] Badge `COM(2025) 772 final` widoczny w nagłówku

---

## 8. Pliki do modyfikacji / utworzenia

| Plik | Akcja |
|------|-------|
| `public/docs/plan-prac-komisji-cpr-2026-2029.html` | UTWÓRZ |
| `src/utils/documentHelpers.ts` | MODYFIKUJ (dodaj wpis) |
