---
title: "EN 206-1:2026 — klasy GWR dla betonu i dane GWP. Co wpisywać w dokumentacji?"
reviewed: "2026-04-29"
date: "2026-04-14"
author: "Mikołaj Junosza-Szaniawski | Redakcja NowyCPR.pl | Multicert Sp. z o.o."
category: "Normy i przepisy"
tags: ["EN 206", "GWR", "klasy emisyjne", "beton", "CPR 2024", "EPD", "EN 15804", "EN 16757", "ślad węglowy", "DoP&C"]
excerpt: "EN 206-1:2026 wprowadza klasy GWR (Global Warming Reduction) dla betonu, oparte na redukcji GWP względem wartości referencyjnej. Wyjaśniamy, co można już przygotować i czego nie wolno mylić z formalnym obowiązkiem hTS pod CPR 2024/3110."
image_url: /images/blog/en-206-klasy-emisyjne-gwr-beton-v2.jpg
template: "przewodnik"
sources:
  - EN 206-1:2026 — Beton. Wymagania, właściwości użytkowe, produkcja i zgodność|https://www.pkn.pl
  - BS EN 206-1:2026 — Concrete. Specification, performance, production and conformity|https://knowledge.bsigroup.com
  - Rozporządzenie (UE) 2024/3110 — nowe CPR|https://eur-lex.europa.eu/eli/reg/2024/3110/oj
  - EN 15804+A2 — norma EPD dla wyrobów budowlanych|https://www.pkn.pl
  - EN 16757:2022 — PCR dla betonu i elementów betonowych|https://www.pkn.pl
  - Multicert — omówienie EN 206-1:2026 i klas GWR|https://multicert.pl/blog/nowa-norma-en-206-2026-beton-gwr-klasy-co2
  - Program EPD Polska — Multicert|https://www.epd.org.pl
---

## Beton dostaje swój „paszport emisyjny" — klasy GWR w EN 206-1:2026

Norma EN 206-1:2026 wprowadza do specyfikacji betonu nowy element: **klasy GWR (Global Warming Reduction — redukcja potencjału globalnego ocieplenia)**. Chodzi o klasyfikację betonu według redukcji emisji względem betonu referencyjnego opartego na cemencie CEM I.

To jest istotna zmiana rynkowa, bo GWR daje prosty język do opisu śladu węglowego receptury. Obok klasy wytrzymałości, klasy ekspozycji i konsystencji pojawia się parametr, który inwestor może wpisać do specyfikacji: np. beton C30/37 w określonej klasie GWR.

**Ważne rozróżnienie prawne:** sama publikacja EN 206-1:2026 nie oznacza jeszcze, że norma jest już zharmonizowaną specyfikacją techniczną (hTS — harmonized Technical Specification, czyli zharmonizowana specyfikacja techniczna) cytowaną w Dzienniku Urzędowym UE pod CPR 2024/3110. Obowiązek użycia nowych danych środowiskowych w DoP&C aktywuje się dopiero po publikacji właściwego odniesienia w OJEU i po zakończeniu okresu koegzystencji. Do tego czasu GWR jest jednak bardzo ważnym sygnałem przygotowawczym i praktycznym narzędziem dla EPD, przetargów oraz specyfikacji inwestorskich.

---

## Czym są klasy GWR i jak działają?

System GWR opiera się na prostej logice: **ile CO2 emituje metr sześcienny betonu w porównaniu do betonu referencyjnego wykonanego z czystego cementu CEM I?**

Wartość referencyjna to emisja betonu o tej samej klasie wytrzymałości, wyprodukowanego wyłącznie z cementu portlandzkiego CEM I, bez żadnych zamienników cementowych (popiół lotny, żużel, krzemionka). Dla klasy C30/37 wartość referencyjna wynosi około **312 kg CO2/m3**.

Klasy GWR są wyrażane jako poziomy redukcji względem wartości referencyjnej:

| Klasa GWR | Redukcja CO2 vs CEM I | Opis |
|---|---|---|
| **GWR 0** | < 5% | Brak istotnej redukcji względem betonu referencyjnego |
| **GWR 1** | 5–15% | Niewielka redukcja emisji |
| **GWR 2** | 15–25% | Umiarkowana optymalizacja spoiwa |
| **GWR 3** | 25–35% | Widoczna redukcja dzięki recepturze i składnikom |
| **GWR 4** | 35–45% | Znacząca redukcja emisji |
| **GWR 5** | 45–55% | Beton niskoemisyjny względem receptury referencyjnej |
| **GWR 6** | 55–65% | Bardzo niska emisja, np. ok. 138 kg CO2/m3 dla C30/37 przy referencji 312 kg CO2/m3 |
| **GWR 7** | 65–75% | Bardzo zaawansowana redukcja emisji |
| **GWR 8** | 75–85% | Ekstremalnie niska emisja w porównaniu z CEM I |
| **GWR 9** | > 85% | Najwyższa klasa redukcji |

Weźmy przykład z kalkulatora: beton C30/37 o emisji **138 kg CO2/m3** przy wartości referencyjnej **312 kg CO2/m3** oznacza redukcję ok. **56%**. Taka receptura mieści się w klasie **GWR 6**.

---

## Co właściwie trzeba „wpisać"?

Najważniejsze są dwie informacje, których nie należy mylić:

| Informacja | Co oznacza | Przykład |
|---|---|---|
| **GWP-total A1–A3** | liczbowy ślad węglowy receptury, liczony metodą LCA | `138 kg CO2 eq./m3` |
| **Klasa GWR** | klasa redukcji GWP względem betonu referencyjnego | `GWR 6` |

Dla producenta praktyczny kierunek jest następujący: najpierw trzeba mieć wiarygodne dane LCA dla receptury, potem wartość GWP-total w modułach A1–A3, a dopiero na tej podstawie wyznaczyć klasę GWR.

W dokumentacji technicznej lub w specyfikacji dostawy nie wystarczy samo hasło „beton niskoemisyjny". Trzeba umieć pokazać:

- metodę obliczenia,
- jednostkę deklaracji, np. `kg CO2 eq./m3`,
- zakres modułów cyklu życia, najczęściej A1–A3,
- wartość referencyjną dla danej klasy betonu,
- wyliczoną redukcję,
- przypisaną klasę GWR.

---

## Powiązanie z CPR 2024/3110 — GWR w Deklaracji Właściwości Użytkowych i Zgodności

Tu zaczyna się najbardziej praktyczna część dla producentów. Klasy GWR nie funkcjonują w izolacji normy EN 206. Łączą się bezpośrednio z **nowym rozporządzeniem CPR 2024/3110** i jego wymaganiem dotyczącym **Deklaracji Właściwości Użytkowych i Zgodności (DoP&C — Declaration of Performance and Conformity)**.

W starym CPR 305/2011 producent wystawiał DoP — deklarację obejmującą właściwości użytkowe wskazane przez właściwą normę zharmonizowaną. Nowy CPR 2024/3110 rozszerza model deklaracji o dane zgodności i właściwości środowiskowe, ale dla konkretnej rodziny wyrobów obowiązek działa dopiero wtedy, gdy właściwa hTS zostanie opublikowana i zakończy się okres koegzystencji.

Dlatego poprawne sformułowanie brzmi:

1. **EN 206-1:2026 pokazuje, jakie dane środowiskowe dla betonu trzeba przygotować** — przede wszystkim GWP-total i klasę GWR.
2. **Nie oznacza to jeszcze automatycznie powszechnego obowiązku DoP&C dla betonu na podstawie nowej hTS**, jeżeli odniesienie do tej hTS nie zostało jeszcze opublikowane w OJEU.
3. **Producent, który zacznie liczyć GWP teraz, będzie gotowy**, gdy wymagania środowiskowe zostaną formalnie aktywowane przez CPR 2024/3110.

Innymi słowy: klasa GWR to „skrót" — łatwy do odczytania wynik tego, co w tle jest pełną analizą cyklu życia betonu. W przyszłej DoP&C najważniejsza będzie jednak wartość GWP i podstawa jej obliczenia, a nie samo marketingowe oznaczenie klasy.

---

## EPD jako fundament — EN 15804+A2 i EN 16757:2022

Żeby obliczyć klasę GWR, producent potrzebuje danych o emisjach CO2 swojego betonu. Skąd je wziąć?

Odpowiedź: z **EPD (Environmental Product Declaration)** — Deklaracji Środowiskowej Wyrobu, sporządzonej zgodnie z:

- **EN 15804+A2** — norma bazowa (core rules) dla EPD wyrobów budowlanych, definiująca jakie wskaźniki środowiskowe trzeba podać (GWP, ODP, AP, EP itd.) i jakie moduły cyklu życia uwzględnić (A1–A3: produkcja, A4–A5: transport i montaż, B: użytkowanie, C: koniec życia, D: recykling),
- **EN 16757:2022** — norma PCR (Product Category Rules) specyficznie dla betonu i elementów betonowych, precyzująca wymagania EN 15804 dla kategorii wyrobów betonowych.

EPD to dokument, w którym producent (lub grupa producentów) prezentuje wyniki LCA swojego wyrobu. Dla potrzeb klasy GWR kluczowy jest wskaźnik **GWP-total** w modułach **A1–A3** (od kołyski do bramy fabryki) wyrażony w **kg CO2-eq/m3**.

### Czy każda wytwórnia musi mieć własne EPD?

Niekoniecznie — ale praktycznie będzie to coraz trudniejsze do pominięcia. Na etapie przejściowym producent może korzystać z danych sektorowych lub ogólnych, jeżeli są dopuszczone przez właściwy program i metodykę, ale dla rzetelnego przypisania klasy GWR najbezpieczniejsza jest EPD oparta na danych konkretnej receptury lub zakładu.

- **EPD branżowego (sektorowego)** — opracowanego przez stowarzyszenie producentów dla typowych receptur regionalnych,
- **EPD indywidualnego** — sporządzonego dla konkretnej wytwórni i jej faktycznych receptur, surowców i procesów.

EPD indywidualne daje wyższą precyzję i często lepszą klasę GWR, bo uwzględnia faktyczny miks spoiwa, lokalne kruszywo i efektywność energetyczną zakładu. Dane sektorowe są zwykle bardziej konserwatywne, więc mogą nie pokazać rzeczywistej przewagi receptury producenta.

---

## Program EPD Polska i certyfikacja Multicert

Operatorem programu **EPD Polska** jest **Multicert Sp. z o.o.** ([www.epd.org.pl](https://www.epd.org.pl)). Program działa zgodnie z EN 15804+A2 i ISO 14025, a deklaracje publikowane w tym systemie mogą stanowić praktyczną bazę do przyszłego wykorzystania danych środowiskowych w modelu CPR 2024/3110. Deklaracje wystawiane w programie noszą markę **EPD+** i są publikowane na portalu [www.epdbeton.pl](https://www.epdbeton.pl).

Producent betonu, który chce uzyskać EPD, musi:

1. **Przeprowadzić analizę LCA** swoich receptur — zebrać dane o emisjach z cementu, kruszyw, dodatków, wody, transportu i energii zużywanej w wytwórni.
2. **Sporządzić raport LCA** zgodnie z EN 15804+A2 i EN 16757:2022.
3. **Poddać EPD weryfikacji** przez niezależnego weryfikatora programu EPD; odrębnie CPR 2024 przewiduje przyszłą walidację danych środowiskowych w systemie AVS 3+.
4. **Zarejestrować EPD** w programie EPD Polska lub innym uznanym programie europejskim.

**Multicert** jako jednostka certyfikująca wspiera producentów betonu w przygotowaniu danych do LCA, opracowaniu raportu oraz przygotowaniu do weryfikacji i rejestracji EPD.

---

## Co producent betonu powinien zrobić TERAZ?

Nie czekaj na ostatni moment. Klasy GWR są już elementem nowej EN 206-1:2026, a formalne wymagania CPR będą uruchamiane przez publikację właściwych hTS i okresy koegzystencji. Oto konkretne kroki:

### 1. Zinwentaryzuj swoje receptury pod kątem emisji CO2

Dla każdej receptury w zakładowej kontroli produkcji (FPC) oblicz emisję CO2 w kg/m3. Potrzebujesz do tego:

- **danych o emisjach cementu** (powinny być dostępne od dostawcy lub z karty EPD cementu),
- **danych o emisjach kruszyw** (transport jest często kluczowy),
- **zużycia energii** w wytwórni (prąd, gaz, paliwa),
- **danych o dodatkach i domieszkach** (popioły lotne, żużle, krzemionka, plastyfikatory).

### 2. Porównaj emisje z wartościami referencyjnymi

Dla każdej klasy wytrzymałości (C20/25, C25/30, C30/37 itd.) porównaj swoje emisje z referencją CEM I. Sprawdź, w jakiej klasie GWR plasuje się każda receptura. Przykład:

- Receptura C30/37, emisja 285 kg CO2/m3 → redukcja 9% → **GWR 1**
- Receptura C30/37, emisja 210 kg CO2/m3 → redukcja 33% → **GWR 3**
- Receptura C30/37, emisja 138 kg CO2/m3 → redukcja 56% → **GWR 6**

### 3. Zidentyfikuj receptury wymagające optymalizacji

Jeśli większość Twoich receptur plasuje się w GWR 1 lub GWR 2, rozważ optymalizację:

- zwiększenie udziału **cementów wieloskładnikowych** (CEM II, CEM III, CEM IV, CEM V),
- zastosowanie **popiołów lotnych**, **żużla wielkopiecowego** lub **pyłu krzemionkowego** jako częściowego zamiennika cementu,
- optymalizacja **krzywej uziarnienia kruszywa** (lepsza urabialność przy niższej zawartości cementu),
- stosowanie **efektywnych plastyfikatorów i superplastyfikatorów** umożliwiających redukcję wody i cementu.

### 4. Rozpocznij proces EPD

Nawet jeśli EN 206-1:2026 dopuszcza tymczasowe korzystanie z EPD sektorowych, **EPD indywidualne jest inwestycją**, która się zwraca:

- daje lepszą (niższą) wartość emisji niż konserwatywne EPD sektorowe,
- jest wymagane przez coraz więcej inwestorów i generalnych wykonawców,
- stanowi fundament pod przyszłe dane środowiskowe w DoP&C wymagane przez CPR 2024/3110 po wejściu właściwej hTS,
- jest ważne przez 5 lat — im wcześniej je uzyskasz, tym szybciej budujesz przewagę konkurencyjną.

### 5. Przygotuj system FPC do śledzenia emisji

Twój system zakładowej kontroli produkcji (FPC) musi być zdolny do:

- rejestrowania danych o emisjach surowców w kartotekach materiałowych,
- obliczania GWP dla każdej partii betonu (lub przynajmniej dla każdej receptury),
- przypisywania wartości GWP i klasy GWR do specyfikacji, ofert, dokumentów dostawy lub dokumentacji projektowej, jeżeli wymaga tego kontrakt,
- archiwizowania danych na potrzeby audytów i weryfikacji.

To nie musi być od razu zaawansowany software — na początek wystarczy dobrze zaprojektowany arkusz kalkulacyjny zintegrowany z dokumentacją FPC.

---

## Dlaczego GWR to szansa, nie tylko obowiązek?

Wielu producentów betonu postrzega kolejne regulacje środowiskowe jako obciążenie. Klasy GWR można jednak traktować jako **narzędzie marketingowe i handlowe**.

W przetargach publicznych (GPP — Green Public Procurement) i w certyfikacjach budynków (LEED, BREEAM, DGNB) coraz częściej wymagany jest beton o niskim śladzie węglowym. Klasa GWR daje **prosty, porównywalny wskaźnik**, który inwestor może wpisać wprost do specyfikacji przetargowej: „Wymagany beton klasy GWR 4 lub wyższej".

Dla producenta, który już teraz oferuje beton z cementy wieloskładnikowymi i optymalizowanymi recepturami, klasa GWR 4 lub GWR 5 to **wymierna przewaga konkurencyjna** — widoczna w jednej cyfrze, bez konieczności przekazywania inwestorowi dziesiątek stron raportu LCA.

Producenci, którzy przygotują się wcześnie, będą mieli:

- gotowe EPD i zweryfikowane dane emisyjne,
- receptury dostosowane do wyższych klas GWR,
- system FPC zdolny do raportowania emisji,
- przewagę w przetargach z kryteriami środowiskowymi.

Ci, którzy będą czekać do ostatniej chwili, będą musieli to wszystko nadrobić pod presją czasu — i prawdopodobnie z wyższymi kosztami przygotowania dokumentacji oraz certyfikacji.

---

## Podsumowanie: klasy GWR w pigułce

| Pytanie | Odpowiedź |
|---|---|
| Co to jest GWR? | Klasyfikacja redukcji GWP betonu względem betonu referencyjnego, w klasach GWR 0–9 |
| Gdzie jest zdefiniowany? | EN 206-1:2026, §5.4 |
| Jaka jest referencyjna emisja? | Beton CEM I o tej samej klasie wytrzymałości (~312 kg CO2/m3 dla C30/37) |
| Co oznacza przykład 138 kg CO2/m3 dla C30/37? | Przy referencji 312 kg CO2/m3 daje ok. 56% redukcji, czyli GWR 6 |
| Jak się łączy z CPR? | GWP i GWR przygotowują dane do przyszłej sekcji środowiskowej DoP&C, ale obowiązek formalny zależy od hTS i okresu koegzystencji |
| Skąd dane do GWR? | Z EPD sporządzonego wg EN 15804+A2 i EN 16757:2022 |
| Kto weryfikuje dane? | Dziś weryfikator EPD w programie środowiskowym; docelowo, jeżeli hTS tego wymaga, NTL w systemie AVS 3+ |
| Co robić teraz? | Inwentaryzacja emisji, obliczenie GWR, rozpoczęcie EPD |

---

*Potrzebujesz wsparcia w obliczeniu klas GWR dla swoich receptur lub w przygotowaniu EPD? Multicert pomaga producentom betonu na każdym etapie — od zbierania danych LCA po rejestrację EPD w programie EPD Polska. Kontakt: biuro@multicert.pl*
