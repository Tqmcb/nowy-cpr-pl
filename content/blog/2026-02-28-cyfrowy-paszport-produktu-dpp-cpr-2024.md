---
title: "Cyfrowy Paszport Produktu (DPP) w CPR 2024 — co to jest, kiedy obowiązkowy i dla których wyrobów"
date: "2026-02-28"
author: "Redakcja NowyCPR.pl | Multicert Sp. z o.o."
category: "Cyfryzacja"
tags: ["DPP", "cyfrowy paszport produktu", "CPR 2024", "cyfryzacja", "QR kod", "traceability"]
excerpt: "Cyfrowy Paszport Produktu (DPP) to jedno z kluczowych narzędzi CPR 2024/3110. Wyjaśniamy czym jest, kiedy stanie się obowiązkowy dla wyrobów budowlanych i jak techniczny wygląda jego wdrożenie."
image_url: /images/blog/cyfrowy-paszport-produktu-dpp-.jpg
template: "analiza"
---

# Cyfrowy Paszport Produktu w CPR 2024 — kompletne wyjaśnienie

Cyfrowy Paszport Produktu (DPP, ang. Digital Product Passport) jest jedną z najbardziej przełomowych nowości wprowadzonych przez rozporządzenie CPR (UE) 2024/3110. Dla producentów wyrobów budowlanych przyzwyczajonych do papierowej dokumentacji to znacząca zmiana sposobu myślenia o identyfikowalności i transparentności produktu.

Ten artykuł wyjaśnia czym jest DPP, kiedy stanie się obowiązkowy dla wyrobów budowlanych, co musi zawierać i jak można się do niego przygotować już teraz.

## Czym jest Cyfrowy Paszport Produktu?

DPP to **cyfrowy zbiór danych o wyrobie**, dostępny przez internet i powiązany z konkretnym egzemplarzem lub partią produktu za pomocą unikalnego identyfikatora (np. QR kodu, kodu GS1 lub cyfrowego linku GS1). Paszport zawiera wszystkie kluczowe informacje o wyrobie — techniczne, środowiskowe i administracyjne — w formie ustrukturyzowanej i czytelnej maszynowo.

Wyobraź sobie DPP jako „dowód osobisty wyrobu" — każda rolka membrany dachowej, każda płyta izolacyjna, każdy profil stalowy będzie miał swój unikalny identyfikator prowadzący do pełnego zestawu danych o tym konkretnym wyrobie.

## Co mówi CPR 2024/3110 o DPP?

Rozporządzenie CPR 2024/3110 wprowadza DPP w art. 75–80. Kluczowe postanowienia:

1. **KE stworzy europejski system DPP dla wyrobów budowlanych** — centralny rejestr dostępny dla wszystkich uczestników rynku (art. 75)
2. **DPP będzie obowiązkowy dla kategorii priorytetowych** — wskazanych przez KE w aktach delegowanych (art. 76)
3. **Termin obowiązku: 18 miesięcy po uruchomieniu systemu** — co oznacza, że data obowiązku zależy od KE, nie od kalendarza (art. 77)
4. **DPP ma być przechowywany co najmniej przez czas życia wyrobu + 10 lat** — nawet po likwidacji firmy (art. 79)

## Kiedy DPP stanie się obowiązkowy?

To pytanie, które zadają wszyscy producenci. Odpowiedź jest złożona:

| Etap | Termin | Co się dzieje |
|---|---|---|
| Uruchomienie systemu przez KE | Planowane 2026–2027 | KE buduje europejski rejestr DPP |
| Pierwsze akty delegowane KE wskazujące kategorie | 2027 | KE ogłasza które rodziny wyrobów pierwsze |
| DPP obowiązkowy dla rodzin priorytetowych | 18 miesięcy po ogłoszeniu | Pierwsze wyroby: ok. 2028–2029 |
| Plan wdrożenia 2026–2029 (Working Plan KE) | Grudzień 2025 opublikowany | Harmonogram widoczny w dokumencie |

**Wniosek praktyczny:** w 2026 roku DPP **nie jest jeszcze obowiązkowy** dla żadnego wyrobu budowlanego. Ale architektura systemu, dane, które będzie trzeba dostarczyć, oraz techniczny format są już określone. Przygotowanie danych teraz to inwestycja, nie strata czasu.

## Co DPP będzie zawierał?

Na podstawie CPR 2024/3110 i projektów aktów delegowanych DPP dla wyrobu budowlanego będzie zawierał:

### Identyfikacja wyrobu
- Unikalny identyfikator produktu (GTIN lub inny globalny standard)
- Nazwa handlowa, opis, numer modelu
- Data produkcji / numer partii
- Dane producenta (nazwa, adres, kontakt)

### Właściwości techniczne
- Wszystkie deklarowane właściwości z DoP&C
- Powiązanie z normą zharmonizowaną lub ETA
- System AVS i wyniki oceny zgodności

### Właściwości środowiskowe
- GWP (Globalny Potencjał Ocieplenia)
- Inne wskaźniki EN 15804 (gdy obowiązkowe)
- Zawartość materiałów z recyklingu
- Informacje o możliwości recyklingu po zakończeniu użytkowania

### Dokumentacja
- Link do aktualnego DoP&C (cyfrowa wersja)
- Instrukcja montażu i użytkowania
- Karta charakterystyki (jeśli dotyczy)
- Certyfikaty i raporty z badań (opcjonalnie)

### Informacje o łańcuchu dostaw
- Kraj produkcji
- Dane importera (jeśli dotyczy)
- Informacje o kluczowych komponentach (dla zestawów)

## Jak technicznie działa DPP?

DPP opiera się na **cyfrowym linku** — standardzie GS1 Digital Link lub podobnym. Fizycznie na wyrobie lub opakowaniu znajduje się kod QR lub kod kreskowy 2D. Zeskanowanie kodu prowadzi do strony internetowej lub API, które zwracają dane paszportu w ustrukturyzowanym formacie (JSON-LD, XML lub podobny).

Europejski system DPP dla wyrobów budowlanych będzie obejmował:
- **Centralny rejestr** prowadzony przez KE
- **API** dla uczestników rynku (producenci, projektanci, organy nadzoru)
- **Interfejs publiczny** dostępny dla wszystkich (np. dla inspektorów budowlanych na placu budowy)

Ważne: producent **nie musi sam budować serwera** dla swojego DPP. Będzie mógł korzystać z platform certyfikowanych przez KE lub z usług oferowanych przez jednostki notyfikowane i laboratoria.

## Co CPR 2024 mówi o QR kodzie już dziś?

Choć DPP nie jest jeszcze obowiązkowy, CPR 2024/3110 już teraz (od 8 stycznia 2026) wymaga, by **DoP&C była dostępna cyfrowo** — przez URL lub QR kod na wyrobie/opakowaniu (art. 7 ust. 3).

To jest **poprzedniczka DPP** — jeśli teraz wdrożysz cyfrową dostępność DoP&C przez QR kod, zbudujesz fundament pod przyszły DPP. Techniczne przygotowanie jest bardzo podobne.

## Różnica między DoP&C a DPP

Wielu producentów myli te dwa pojęcia. Oto kluczowe różnice:

| Cecha | DoP&C | DPP |
|---|---|---|
| Co to jest | Deklaracja producenta | Cyfrowy zbiór danych wyrobu |
| Format | Dokument (PDF + link) | Dane ustrukturyzowane (API/JSON) |
| Kto prowadzi | Producent | Producent + centralny rejestr KE |
| Obowiązkowość | Od 8.01.2026 | Od ok. 2028–2029 (kategorie priorytetowe) |
| Zakres danych | Właściwości użytkowe + środowiskowe | Wszystkie dane + historia zmian |
| Odbiorca | Klient, organ nadzoru | Maszyny, BIM, rynek wtórny |

DoP&C to **deklaracja**, DPP to **repozytorium danych**. DPP będzie zawierało DoP&C jako jeden z elementów.

## Jak przygotować się na DPP już teraz?

Nie czekając na obowiązek, możesz zrobić trzy rzeczy:

**1. Ustandaryzuj dane produktów**
Zadbaj o to, by każdy wyrób miał jednoznaczny identyfikator (GTIN z GS1, własny numer katalogowy z logiką), a dane techniczne były przechowywane w formie ustrukturyzowanej (baza danych, a nie tylko PDF).

**2. Wdróż cyfrową dostępność DoP&C**
Umieść DoP&C online i dodaj QR kod na etykietach — to już jest wymagane od 2026, a jednocześnie test gotowości technicznej na DPP.

**3. Zbierz dane środowiskowe**
GWP i inne wskaźniki środowiskowe będą centralnym elementem DPP. Zacznij obliczenia LCA teraz — wówczas gdy DPP stanie się obowiązkowy, będziesz miał dane gotowe.

## DPP a branża budowlana — co zmienia w praktyce?

DPP zmienia sposób w jaki informacje o wyrobach budowlanych przepływają przez łańcuch wartości:

- **Projektant/architekt** pobiera dane techniczne i środowiskowe bezpośrednio do modelu BIM
- **Wykonawca** weryfikuje na placu budowy (skan QR) czy zamontowany wyrób jest tym samym co w projekcie
- **Inwestor/właściciel budynku** ma pełną dokumentację wbudowanych materiałów do przyszłego remontu lub wyburzenia
- **Organ nadzoru (GUNB)** sprawdza DPP zdalnie zamiast żądać papierowych dokumentów
- **Recykler** wie co jest w budynku i jak odzyskać materiały

## Podsumowanie

Cyfrowy Paszport Produktu nie jest obowiązkowy w 2026 roku, ale jego wdrożenie to kwestia 2–3 lat. Europejski system DPP jest budowany przez KE, pierwsze akty delegowane wskazujące kategorie priorytetowe oczekiwane są w 2027. Producenci, którzy teraz ustandaryzują swoje dane i wdrożą cyfrową dostępność DoP&C, będą gotowi na DPP bez rewolucji w ostatniej chwili.

---

**Źródła:**
- Rozporządzenie (UE) 2024/3110 art. 75–80 — [EUR-Lex](https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=OJ:L_202403110)
- Studium wykonalności KE dot. DPP w budownictwie — [Publications Office of the EU](https://op.europa.eu/en/publication-detail/-/publication/cf329d5e-3464-11f0-8a44-01aa75ed71a1/language-en)
- Cobuilder — DPP dla wyrobów budowlanych — [cobuilder.com](https://cobuilder.com/en/digital-product-passport-dpp/)
- GS1 Digital Link — standard identyfikacji — [gs1.org](https://www.gs1.org/standards/gs1-digital-link)
