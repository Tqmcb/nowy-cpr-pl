---
title: "Digital DoP&C - Cyfrowa Deklaracja Właściwości Użytkowych i Zgodności (CPR 2024)"
date: "2026-01-10"
author: "mgr inż. Anna Nowak"
category: "Digital DoP"
tags: ["Digital DoP&C", "DoP&C", "cyfryzacja", "XML", "dokumentacja", "CPR 2024"]
excerpt: "CPR 2024/3110 zastępuje DoP cyfrową DoP&C (Deklaracją Właściwości Użytkowych i Zgodności). Format XML, QR kody, repozytoria cyfrowe. Jak się przygotować i jakie są wymagania techniczne?"
image_url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800"
template: "aktualnosci"
---

# Digital DoP&C — Cyfrowa Deklaracja Właściwości Użytkowych i Zgodności

Od **8 stycznia 2026** wszystkie Deklaracje Właściwości Użytkowych i Zgodności (DoP&C) muszą być udostępniane w formie cyfrowej zgodnie z CPR 2024/3110. Nowa nazwa dokumentu — DoP&C zamiast dotychczasowej DoP — odzwierciedla rozszerzone wymogi: deklaracja musi teraz potwierdzać nie tylko właściwości użytkowe, ale też **zgodność** wyrobu z wymaganiami CPR 2024.

## Czym jest DoP&C i czym różni się od DoP?

DoP (Deklaracja Właściwości Użytkowych) to dokument z CPR 305/2011. CPR 2024/3110 zastępuje go **DoP&C** (Deklaracją Właściwości Użytkowych i Zgodności), która:

| Cechy | Stara DoP (CPR 305/2011) | Nowa DoP&C (CPR 2024/3110) |
|---|---|---|
| Format | Papier lub PDF | Wyłącznie cyfrowy (XML) |
| Zawartość | Właściwości użytkowe | Właściwości użytkowe + potwierdzenie zgodności |
| Dostępność | Dołączana do wyrobu | Online minimum 10 lat |
| Środowisko | Opcjonalnie | Obowiązkowo (etapami) |
| System | AVCP | AVS |

**Digital DoP&C** to elektroniczna wersja DoP&C w ustrukturyzowanym formacie XML, dostępna online przez co najmniej **10 lat**.

## Wymagania techniczne

### Format danych
- **XML** zgodny z normą EN 16214
- Schema XSD dostarczona przez Komisję Europejską
- Cyfrowy podpis producenta
- Unikalne DOI (Digital Object Identifier)
- Pełna wielojęzyczność (minimum: EN + język kraju docelowego)

### Repozytorium
- Centralny europejski system dostępu (prowadzony przez Komisję Europejską)
- Możliwość własnego repozytorium producenta (z kopiami zapasowymi)
- API dla systemów zewnętrznych (BIM, zarządzanie łańcuchem dostaw)
- Dostępność 24/7 z SLA 99.5%

### Oznakowanie wyrobu
- **QR kod** na etykiecie CE prowadzący do Digital DoP&C
- Alternatywnie: link URL lub numer referencyjny
- QR kod: minimum 15×15 mm, kontrast 70%, błąd korekcji Level M

## Harmonogram wdrożenia

| Data | Wymóg |
|------|-------|
| **7 stycznia 2025** | Wejście w życie CPR 2024/3110; możliwość dobrowolnego stosowania DoP&C |
| **8 stycznia 2026** | Obowiązek stosowania DoP&C i udostępniania w formie cyfrowej |
| **8 stycznia 2027** | Sankcje za naruszenia (Art. 92 CPR 2024) |
| **~2027** | Oczekiwane akty delegowane z obowiązkiem deklarowania GWP w DoP&C |

## Dane środowiskowe w DoP&C

Nowością w DoP&C jest konieczność uwzględnienia **danych środowiskowych** (etapami, poprzez akty delegowane Komisji). Producent będzie musiał deklarować:
- **GWP** (Global Warming Potential) — kg CO₂ eq na jednostkę wyrobu
- Wskaźniki ODP, AP, EP, POCP, ADP, WDP
- Zawartość materiałów z recyklingu
- Trwałość wyrobu

Dane te będą weryfikowane przez System AVS 3+ (nowy system dla oceny środowiskowej w CPR 2024) — jednostka notyfikowana wydaje raport walidacyjny EPD.

## Koszty implementacji

- **Oprogramowanie** do generowania XML DoP&C: 3 000 - 8 000 PLN (jednorazowo)
- **Hosting repozytorium** i API: 1 000 - 3 000 PLN/rok
- **QR kody** na etykietach: 0,10 - 0,50 PLN/szt.
- **Szkolenia** zespołu: 2 000 - 5 000 PLN
- **Migracja** istniejących DoP do formatu DoP&C: 3 000 - 15 000 PLN

## Dostawcy rozwiązań Digital DoP&C

Europejskie platformy DoP&C:
- **CSTB** (Francja) — Construction Digital Hub
- **IBU** (Niemcy) — Digital Product Passport (z EPD)
- **ITB** (Polska) — System ITB-DoP&C (w przygotowaniu)
- **Multicert** — wsparcie we wdrożeniu dokumentacji i platformy cyfrowej DoP&C

## Korzyści Digital DoP&C

✅ Automatyczna aktualizacja informacji (bez druku nowych dokumentów)
✅ Łatwiejszy dostęp dla projektantów, wykonawców i organów nadzoru
✅ Redukcja kosztów druku i dystrybucji
✅ Integracja z systemami BIM (IFC, Revit, Archicad)
✅ Śledzenie wyrobów w łańcuchu dostaw (blockchain, QR)
✅ Gotowość do Cyfrowego Paszportu Wyrobu (DPP)

## Jak się przygotować?

1. **Zaktualizuj terminologię** — zmień "DoP" na "DoP&C" we wszystkich dokumentach, na stronie internetowej i w materiałach handlowych
2. **Wybierz dostawcę platformy** Digital DoP&C lub zbuduj własne repozytorium XML
3. **Przeszkol zespół** w zakresie XML, nowej terminologii i systemów cyfrowych
4. **Zaktualizuj etykiety CE** — dodaj QR kody prowadzące do DoP&C online
5. **Zmigruj dokumentację** istniejących wyrobów (stare DoP → nowe DoP&C)
6. **Zbierz dane środowiskowe** od dostawców (pod kątem przyszłego obowiązku GWP)
7. **Przetestuj system** przed 8 stycznia 2026

---

**Digital DoP&C to przyszłość dokumentacji budowlanej** — przygotuj się już dziś! Wsparcie w wdrożeniu DoP&C i systemów AVS oferuje [Multicert](https://www.multicert.pl). W zakresie badań laboratoryjnych i EPD — [epd.org.pl](https://www.epd.org.pl).
