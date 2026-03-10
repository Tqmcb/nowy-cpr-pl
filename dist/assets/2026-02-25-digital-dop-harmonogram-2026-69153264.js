const o=`---
title: "Digital DoP&C — aktualny harmonogram i co producenci muszą zrobić już teraz"
date: "2026-02-25"
author: "Redakcja NowyCPR.pl | Multicert Sp. z o.o."
category: "Cyfryzacja"
tags: ["Digital DoP", "DoP&C", "cyfryzacja", "2026", "QR kod"]
excerpt: "Co w zakresie Digital DoP&C jest już obowiązkowe od 8 stycznia 2026, a co czeka na akty delegowane KE? Wyjaśniamy podział i jakie kroki warto podjąć już teraz."
image_url: /images/blog/digital-dop-harmonogram-2026.jpg
template: "techniczny"
---

# Digital DoP&C w 2026 — co już wiesz, a co musisz wdrożyć?

Cyfrowa Deklaracja Właściwości Użytkowych i Zgodności (Digital DoP&C) to jeden z najbardziej dyskutowanych elementów CPR 2024/3110. W 2026 roku sytuacja zaczyna się krystalizować — wyjaśniamy, co jest już pewne, a na co jeszcze czekamy.

## Aktualny stan na luty 2026

### Co już obowiązuje?

CPR 2024/3110 przewiduje, że DoP&C powinna być **dostępna online**. Od 8 stycznia 2026 r. (pełne stosowanie CPR 2024) każdy producent jest zobowiązany do:

- Udostępnienia DoP&C na swojej stronie internetowej w sposób umożliwiający bezpłatny dostęp
- Przechowywania DoP&C przez 10 lat od daty wprowadzenia wyrobu do obrotu
- Umożliwienia pobrania DoP&C (format PDF jest akceptowany)

### Co jeszcze nie jest obowiązkowe?

**Ustandaryzowany format XML / JSON** — Komisja Europejska pracuje nad aktami delegowanymi definiującymi techniczny format Digital DoP&C. Oczekiwane przyjęcie: **II połowa 2026 lub 2027**.

**Centralne repozytorium EU** — Komisja planuje stworzenie platformy cyfrowej (lub zestandaryzowanego protokołu dla krajowych i prywatnych repozytoriów). Termin: **2027–2028**.

**Obowiązkowy QR kod na etykiecie CE** — powiązany z przyjęciem aktów delegowanych. Aktualnie: dobrowolny (choć CPR 2024 przewiduje go jako docelowy element etykiety).

## Co warto zrobić już teraz — bez czekania na akty delegowane?

### Krok 1: Opublikuj DoP&C na stronie internetowej

To wymagane już teraz. Utwórz dedykowaną podstronę (np. \`/dokumenty\` lub \`/certyfikaty\`) z listą swoich wyrobów i linkami do PDF-ów DoP&C. Każda deklaracja powinna być dostępna pod stałym, bezpośrednim URL.

### Krok 2: Wdróż własny QR kod dobrowolnie

Nie musisz czekać na standardy UE. Możesz już teraz dodać do swoich etykiet QR kod prowadzący do DoP&C na Twojej stronie. Korzyści:
- Demonstracja gotowości na CPR 2024 klientom i organom nadzoru
- Łatwa aktualizacja (gdy zmieni się treść DoP&C, wystarczy zaktualizować plik — QR kod pozostaje ten sam)
- Przewaga w przetargach publicznych wymagających Digital DoP&C

### Krok 3: Przyjmij ustrukturyzowany format danych

Choć format XML dla Digital DoP&C nie jest jeszcze obowiązkowy, warto już teraz przygotowywać dane DoP&C w sposób ustrukturyzowany (np. w arkuszu danych produktu z oznaczonymi polami). Ułatwi to przyszłą migrację do formatu wymaganego przez KE.

## Porównanie: DoP&C papierowe vs. cyfrowe w 2026

| Cecha | DoP&C PDF na stronie | Digital DoP&C (docelowa) |
|-------|---------------------|--------------------------|
| Wymagane od 8.01.2026 | Tak (dostępność online) | Nie (wymaga aktów delegowanych) |
| Format | PDF / HTML | XML / JSON (standard UE) |
| QR kod | Dobrowolny | Docelowo obowiązkowy |
| Centralne repozytorium | Brak | 2027–2028 |
| Integracja z BIM | Brak / ograniczona | Docelowa |

## Jakie branże powinny się przygotować szybciej?

Producenci wyrobów stosowanych w budownictwie publicznym (zamówienia publiczne) powinni priorytetowo potraktować cyfryzację DoP&C, ponieważ:

- Specyfikacje techniczne przetargów coraz częściej wymagają DoP&C w formie cyfrowej
- Certyfikacje LEED i BREEAM premiują dostępność danych w formatach cyfrowych
- Inwestorzy infrastrukturalni (GDDKiA, PKP PLK) coraz częściej wymagają danych BIM — a DoP&C jest elementem modelu BIM

## Multicert pomaga w cyfryzacji DoP&C

Oferujemy:

- Audyt obecnej dokumentacji DoP/DoP&C pod kątem gotowości cyfrowej
- Przygotowanie struktury danych DoP&C kompatybilnej z przyszłym formatem UE
- Wdrożenie systemu zarządzania DoP&C na stronie producenta (z linkami i QR kodami)
- Monitoring zmian w aktach delegowanych KE i aktualizacja dokumentacji

---

*Chcesz wiedzieć, jak przygotować Digital DoP&C dla swoich wyrobów? Napisz do nas: biuro@multicert.pl*
`;export{o as default};
