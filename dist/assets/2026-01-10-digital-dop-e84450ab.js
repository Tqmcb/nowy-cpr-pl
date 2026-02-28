const o=`---
title: "Digital DoP&C - Cyfrowa Deklaracja Właściwości Użytkowych i Zgodności (CPR 2024)"
date: "2026-01-10"
author: "Redakcja NowyCPR.pl | Multicert Sp. z o.o."
category: "Cyfryzacja"
tags: ["Digital DoP&C", "DoP&C", "cyfryzacja", "XML", "dokumentacja", "CPR 2024"]
excerpt: "CPR 2024/3110 zastępuje DoP cyfrową DoP&C (Deklaracją Właściwości Użytkowych i Zgodności). Format XML, QR kody, repozytoria cyfrowe. Jak się przygotować i jakie są wymagania techniczne?"
image_url: "/images/blog/srodowisko.jpg"
template: "aktualnosci"
---

# Digital DoP&C — Cyfrowa Deklaracja Właściwości Użytkowych i Zgodności

Od **8 stycznia 2026** wszystkie Deklaracje Właściwości Użytkowych i Zgodności (DoP&C) muszą być udostępniane w formie cyfrowej zgodnie z CPR 2024/3110. Nowa nazwa dokumentu — DoP&C zamiast dotychczasowej DoP — odzwierciedla rozszerzone wymogi: deklaracja musi teraz potwierdzać nie tylko właściwości użytkowe, ale też **zgodność** wyrobu z wymaganiami CPR 2024.

## Czym jest DoP&C i czym różni się od DoP?

DoP (Deklaracja Właściwości Użytkowych) to dokument z CPR 305/2011. CPR 2024/3110 zastępuje go **DoP&C** (Deklaracją Właściwości Użytkowych i Zgodności), która:

| Cechy | Stara DoP (CPR 305/2011) | Nowa DoP&C (CPR 2024/3110) |
|---|---|---|
| Format | Papier lub PDF | Papier/PDF nadal dopuszczalne; docelowo XML po aktach delegowanych KE |
| Zawartość | Właściwości użytkowe | Właściwości użytkowe + potwierdzenie zgodności |
| Dostępność | Dołączana do wyrobu | Online minimum 10 lat (od 8.01.2026); pełny XML po aktach delegowanych |
| Środowisko | Opcjonalnie | Obowiązkowo etapami — oddzielnie dla każdej grupy wyrobów |
| System | AVCP | AVS |

> **Ważne**: Od 8.01.2026 obowiązkowy jest **dostęp online** do DoP&C (min. link na stronie producenta z możliwością pobrania). Format XML oraz centralny system europejski wymagają aktów delegowanych KE — oczekiwanych nie wcześniej niż 2027.

## Wymagania techniczne (stan na luty 2026)

### Co jest wymagane już teraz (od 8.01.2026)
- DoP&C dostępna online — co najmniej bezpłatny link do pobrania na stronie producenta
- Przechowywanie przez **10 lat** od daty wprowadzenia wyrobu do obrotu
- Format PDF jest akceptowany jako forma "cyfrowej" dostępności

### Co jest planowane, ale wymaga aktów delegowanych KE
- **Format XML/JSON** — Komisja Europejska opracowuje standard techniczny; oczekiwany 2026-2027
- **Schema XSD** — zostanie dostarczona przez KE razem z aktem delegowanym
- **Centralny europejski system dostępu** (repozytorium KE) — planowany na 2027-2028
- **Unikalne identyfikatory** (np. DOI) — do określenia przez akty delegowane

> **Uwaga**: CPR 2024 **nie wskazuje żadnej istniejącej normy EN** określającej format XML dla Digital DoP&C — taki standard jest dopiero opracowywany. Wszelkie odwołania do konkretnych norm są przedwczesne.

### Oznakowanie wyrobu (stan na luty 2026)
- **Dobrowolny QR kod** na etykiecie CE prowadzący do DoP&C — dobra praktyka, ale jeszcze nie obowiązkowy
- **Numer referencyjny lub link URL** w dokumentacji — wystarczający do spełnienia wymogu dostępności online
- Obowiązkowy QR kod na etykiecie: dopiero po aktach delegowanych KE

## Harmonogram wdrożenia

| Data | Wymóg |
|------|-------|
| **7 stycznia 2025** | Wejście w życie CPR 2024/3110; możliwość dobrowolnego stosowania DoP&C |
| **8 stycznia 2026** | Obowiązek stosowania DoP&C; wymagana dostępność online (min. link/PDF na stronie producenta) |
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

- Automatyczna aktualizacja informacji (bez druku nowych dokumentów)
- Łatwiejszy dostęp dla projektantów, wykonawców i organów nadzoru
- Redukcja kosztów druku i dystrybucji
- Integracja z systemami BIM (IFC, Revit, Archicad)
- Śledzenie wyrobów w łańcuchu dostaw (blockchain, QR)
- Gotowość do Cyfrowego Paszportu Wyrobu (DPP)

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
`;export{o as default};
