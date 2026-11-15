---
title: "PN-EN 206-1:2026-09: jak obliczyć klasę GWR betonu i co podać w dokumentacji"
reviewed: "2026-11-15"
updated: "2026-11-15"
date: "2026-04-14"
author: "Mikołaj Junosza-Szaniawski | Redakcja NowyCPR.pl | Multicert Sp. z o.o."
category: "Normy i przepisy"
tags: ["EN 206", "GWR", "klasy emisyjne", "beton", "CPR 2024", "EPD", "EN 15804", "EN 16757", "ślad węglowy", "DoP&C"]
excerpt: "PKN opublikował 15 września 2026 r. PN-EN 206-1:2026-09 i PN-EN 206-2:2026-09. Podajemy progi klas GWR, wzór na redukcję X oraz dane, które zalecamy zachować przy obliczeniu."
image_url: /images/blog/en-206-klasy-emisyjne-gwr-beton-v2.jpg
template: "przewodnik"
sources:
  - PKN, karta normy PN-EN 206-1:2026-09, wersja angielska|https://sklep.pkn.pl/pn-en-206-1-2026-09e.html
  - PKN, karta normy PN-EN 206-2:2026-09, wersja angielska|https://sklep.pkn.pl/pn-en-206-2-2026-09e.html
  - Rozporządzenie (UE) 2024/3110, art. 13, EUR-Lex|https://eur-lex.europa.eu/eli/reg/2024/3110/oj/pol
  - Multicert, PN-EN 206-1:2026-09 i PN-EN 206-2:2026-09, normy wycofane i okres przejściowy|https://multicert.pl/blog/nowa-norma-en-206-2026-beton-gwr-klasy-co2
  - Program EPD Polska|https://epd.org.pl/
  - EPD Portal, wyszukiwanie opublikowanych deklaracji|https://epdportal.org/
---

Stan na 15 listopada 2026 r.

## Które Polskie Normy opublikował PKN

Polski Komitet Normalizacyjny (PKN) opublikował 15 września 2026 r. [PN-EN 206-1:2026-09](https://sklep.pkn.pl/pn-en-206-1-2026-09e.html) i [PN-EN 206-2:2026-09](https://sklep.pkn.pl/pn-en-206-2-2026-09e.html). Obie są Polskimi Normami w wersji angielskiej, a nie polskimi tłumaczeniami. Część 1 zawiera wymagania dotyczące betonu, jego specyfikacji i dostawy, zakładowej kontroli produkcji (ZKP) oraz kryteriów oceny poszczególnych wartości. Część 2 dotyczy oceny zgodności i certyfikacji.

Część 1 zastępuje PN-EN 206+A2:2021-08 oraz krajowe uzupełnienie PN-B-06265:2022-08 ze zmianą Az1:2025-08. PKN wycofał te normy 15 września 2026 r. Zasady stosowania norm wycofanych w krajowym systemie oceny omawia [wpis Multicert](https://multicert.pl/blog/nowa-norma-en-206-2026-beton-gwr-klasy-co2/). Sposób i termin przejścia dla konkretnego zakładu warto uzgodnić z jednostką, która wydała certyfikat ZKP.

Część 1 zawiera załączniki krajowe od NA do NG, a część 2 normatywny załącznik krajowy NA. Karta PKN opisuje załącznik NA części 1 ogólnie, jako wymagania dodatkowe aktualne w miejscu stosowania. Czy postanowienia krajowe dotyczą klas GWR, producent sprawdza w pełnym tekście normy.

## Czym są klasy GWR i kiedy się je stosuje

GWR (Global warming reduction) to klasy redukcji opisane w punkcie 5.4 normy EN 206-1:2026, którą wprowadza PN-EN 206-1:2026-09. Beton przypisuje się do klasy GWR na podstawie obliczonej redukcji X i progów z tablicy 13. GWPtotal (Global Warming Potential) to całkowity potencjał globalnego ocieplenia według EN 15804, wyrażany w kilogramach ekwiwalentu CO₂ (kg CO₂e). Nie jest więc masą samego dwutlenku węgla.

Punkt 5.4.1 zaczyna się od warunku: metodę obliczeń stosuje się wtedy, gdy beton jest klasyfikowany pod względem emisji CO₂. Z tego sformułowania nie wynika obowiązek nadania klasy GWR każdemu betonowi. Przepisy aktualne w miejscu stosowania betonu mogą ustanowić inne klasy redukcji. Norma wymaga wtedy akronimu innego niż GWR.

Betonem odniesienia jest co do zasady beton z cementem CEM I bez dodatków, ustalony na podstawie doświadczeń krajowych. Musi mieć takie same właściwości użytkowe jak beton oceniany, na przykład klasę wytrzymałości i trwałość, chyba że przepisy aktualne w miejscu stosowania definiują go inaczej. Sama zgodność klasy wytrzymałości nie wystarcza więc do porównania.

Informacyjny załącznik G podaje wskazówki, jak zdefiniować krajowy beton odniesienia: dla każdej klasy wytrzymałości, z cementem CEM I, reprezentatywny dla przeciętnego krajowego betonu z CEM I w tej klasie. Przykładowe tablice w załączniku G pokazują tylko układ zestawienia, bez wartości GWPtotal. Wartości odniesienia mogą podawać przepisy aktualne w miejscu stosowania.

## Jak obliczyć redukcję X

Według punktu 5.4.2 wskaźnik obu betonów oblicza się zgodnie z EN 15804 i dodatkowymi regułami EN 16757, dla modułów A1–A3. Moduły te obejmują pozyskanie surowców, ich transport do zakładu i wytwarzanie wyrobu, a nie cały cykl życia. Wynik odnosi się do 1 m³ betonu i ma jednostkę kg CO₂e/m³.

Redukcję oblicza się ze wzoru podanego w punkcie 5.4.3:

X = 100 · (1 − Ga / Gr)

Ga oznacza GWPtotal betonu ocenianego, obliczony dla docelowego składu. Gr oznacza GWPtotal betonu odniesienia o tych samych właściwościach użytkowych. X jest redukcją wyrażoną w procentach.

Norma dopuszcza użycie klasy w specyfikacji betonu. W uwadze do punktu 5.4.1 zastrzega jednak, że porównanie ma sens dopiero na poziomie jednostki funkcjonalnej według EN 16757. Dla elementów betonowych taka jednostka uwzględnia ich funkcję w obiekcie, właściwości użytkowe i przyjęty okres użytkowania (EN 16757, punkt 6.3.2).

## Jakie progi podaje tablica 13

Tablica 13 przypisuje klasom od GWR 1 do GWR 9 wyłącznie progi minimalne. Górnych granic klas nie podaje.

| Klasa redukcji | Wartość X [%] |
|---|---|
| GWR 0 | X < 10 |
| GWR 1 | 10 ≤ X |
| GWR 2 | 20 ≤ X |
| GWR 3 | 30 ≤ X |
| GWR 4 | 40 ≤ X |
| GWR 5 | 50 ≤ X |
| GWR 6 | 60 ≤ X |
| GWR 7 | 70 ≤ X |
| GWR 8 | 80 ≤ X |
| GWR 9 | 90 ≤ X |

Ujemne wartości X klasyfikuje się jako GWR 0.

## Jak odczytać przykład rachunkowy

Przyjmijmy do rachunku dwie wartości: Ga = 138 kg CO₂e/m³ i Gr = 312 kg CO₂e/m³. Obie są założeniami. Wartość 312 nie pochodzi z normy i nie należy jej traktować jako krajowej wartości odniesienia.

X = 100 · (1 − 138 / 312) ≈ 55,8%

Taki wynik spełnia próg klasy GWR 5 (50 ≤ X) i nie spełnia progu klasy GWR 6 (60 ≤ X). Przy innym betonie odniesienia ta sama wartość Ga da inny wynik. Dlatego przy klasie warto wskazać, jak ustalono beton odniesienia.

## Skąd wziąć dane do obliczenia

Dane pochodzą z oceny cyklu życia (LCA, Life Cycle Assessment) wykonanej według EN 15804 i EN 16757. Wyniki LCA można przedstawić w deklaracji środowiskowej produktu (EPD, Environmental Product Declaration). Punkt 5.4 nie uzależnia jednak obliczenia od posiadania EPD.

Reguły programu EPD Polska, którego jesteśmy operatorem, publikujemy na [epd.org.pl](https://epd.org.pl/). Opublikowane deklaracje można wyszukać w [EPD Portal](https://epdportal.org/epd-search/). Przed użyciem danych z deklaracji warto sprawdzić jej zakres, jednostkę i moduły.

## Co zachować w dokumentacji obliczenia

- docelowy skład betonu ocenianego (recepturę);
- właściwości użytkowe, na podstawie których dobrano beton odniesienia;
- pochodzenie danych wejściowych i wersję metody obliczeń;
- jednostkę (kg CO₂e/m³) i zakres modułów (A1–A3);
- podstawę ustalenia betonu odniesienia;
- wartości Ga, Gr i X oraz próg klasy, który wynik spełnia.

Zestawienie to jest naszym zaleceniem, a nie obowiązkiem raportowania każdej partii betonu.

## Czego wydanie Polskich Norm nie zmienia w deklaracji według CPR

CPR to rozporządzenie (UE) 2024/3110 w sprawie wyrobów budowlanych. Zgodnie z [art. 13 ust. 1](https://eur-lex.europa.eu/eli/reg/2024/3110/oj/pol) producent sporządza deklarację właściwości użytkowych i zgodności, jeżeli wyrób jest objęty zharmonizowaną specyfikacją techniczną przyjętą na podstawie art. 5 lub 6 tego rozporządzenia. Producent wyrobu, który nie jest objęty żadną zharmonizowaną specyfikacją techniczną, może wydać taką deklarację zgodnie z europejskim dokumentem oceny i europejską oceną techniczną.

Samo wydanie Polskiej Normy nie potwierdza przyjęcia zharmonizowanej specyfikacji technicznej w trybie art. 5 lub 6 tego rozporządzenia. Wydanie PN-EN 206-1:2026-09 i PN-EN 206-2:2026-09 ani przypisanie klasy GWR nie tworzy więc automatycznie obowiązku sporządzenia deklaracji właściwości użytkowych i zgodności według rozporządzenia (UE) 2024/3110. Z punktu 5.4.1 nie wynika powszechny obowiązek podawania klasy GWR; ewentualne postanowienia krajowe producent sprawdza w pełnym tekście normy.

Pytania o reguły programu EPD Polska przyjmujemy pod adresem biuro@multicert.pl.
