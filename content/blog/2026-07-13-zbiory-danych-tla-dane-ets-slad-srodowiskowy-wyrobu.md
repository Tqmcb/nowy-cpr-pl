---
title: "Dane z unijnego systemu handlu emisjami a ślad środowiskowy wyrobu budowlanego"
reviewed: "2026-10-27"
date: "2026-07-13"
author: "Mikołaj Junosza-Szaniawski | Redakcja NowyCPR.pl | Multicert Sp. z o.o."
category: "Środowisko i LCA"
tags: ["CPR 2024", "zbiory danych tła", "system handlu emisjami", "EU ETS", "ślad środowiskowy", "EPD", "dane LCA"]
excerpt: "Zakład objęty unijnym systemem handlu emisjami co roku raportuje emisje swojej instalacji. Wyjaśniamy na przykładzie, czego te dane nie obejmują w obliczeniach dla wyrobu i co w tej sprawie zapowiada Komisja."
image_url: /images/blog/zbiory-danych-tla-dane-ets-slad-srodowiskowy-wyrobu.jpg
template: "regulacja"
sources:
  - Rozporządzenie (UE) 2024/3110 — pełny tekst (PL)|https://eur-lex.europa.eu/eli/reg/2024/3110/oj/pol
  - Plan prac Komisji na lata 2026–2029, COM(2025) 772 (EUR-Lex)|https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52025DC0772
  - Komisja Europejska — EU ETS: monitorowanie, raportowanie i weryfikacja|https://climate.ec.europa.eu/areas-action/carbon-markets/eu-emissions-trading-system-eu-ets/monitoring-reporting-and-verification_en
  - Rozporządzenie wykonawcze Komisji (UE) 2018/2066 (EUR-Lex)|https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:32018R2066
---

Część zakładów produkujących wyroby budowlane ma instalacje objęte unijnym systemem handlu uprawnieniami do emisji (EU ETS). Takie zakłady co roku raportują emisje gazów cieplarnianych. Komisja zapowiada akt delegowany uznający wykorzystanie tych danych w ocenie środowiskowej wybranych grup wyrobów według [rozporządzenia (UE) 2024/3110 w sprawie wyrobów budowlanych](https://eur-lex.europa.eu/eli/reg/2024/3110/oj/pol) (CPR). Chodzi o grupy, w których dane ETS mogą objąć znaczną część emisji w cyklu życia. Na przykładzie wyjaśniamy, co raport ETS już zawiera i czego brakuje do wyniku dla wyrobu.

## Przykład: zakład produkujący pustaki ceramiczne

Przyjmijmy, że zakład wypala pustaki ceramiczne w piecu opalanym gazem ziemnym, a jego instalacja jest objęta EU ETS. Według [opisu Komisji](https://climate.ec.europa.eu/areas-action/carbon-markets/eu-emissions-trading-system-eu-ets/monitoring-reporting-and-verification_en) prowadzący instalację monitoruje emisje zgodnie z planem monitorowania zatwierdzonym przez właściwy organ. Co roku sporządza raport o emisjach, który sprawdza akredytowany weryfikator.

Monitorowanie nie oznacza wyłącznie pomiarów w kominie. [Rozporządzenie (UE) 2018/2066](https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:32018R2066) w art. 21 przewiduje metodyki oparte na obliczeniach albo na pomiarach. W metodyce obliczeniowej wykorzystuje się dane o działalności, np. ilość zużytego gazu, oraz parametry z analiz laboratoryjnych lub wartości domyślne. Na potrzeby przykładu przyjmijmy, że z raportu wykorzystujemy dane o emisjach ze spalania gazu w piecu.

Takie dane zebrano według ustalonych zasad i sprawdził je niezależny weryfikator. Opisują jednak emisje instalacji w danym roku, a nie ślad środowiskowy pustaka.

## Czego brakuje do wyniku dla wyrobu

Aby wykorzystać raport w obliczeniach dla wyrobu, trzeba wykonać kilka dodatkowych kroków. Wynikają one z zasad oceny cyklu życia (LCA), a nie z treści przyszłego aktu Komisji.

1. **Okres i granice.** Trzeba sprawdzić, czy okres raportu i granice instalacji odpowiadają okresowi i zakresowi obliczeń dla wyrobu.
2. **Przypisanie emisji.** Jeżeli piec wypala kilka rodzajów wyrobów albo powstają współprodukty, emisje dzieli się między nie zgodnie z przyjętą metodą.
3. **Jednostka deklarowana.** Wynik przelicza się na jednostkę, do której odnosi się deklaracja, np. tonę albo metr sześcienny wyrobu.
4. **Procesy poza raportem.** Raport nie obejmuje m.in. wydobycia i dowozu surowców, wytworzenia kupowanej energii elektrycznej, opakowań ani transportu wyrobu. Zależnie od zakresu obliczeń dochodzą też dalsze etapy cyklu życia. Opisuje się je danymi zakładu, dostawców albo danymi tła.
5. **Pozostałe wskaźniki.** Raport ETS dotyczy gazów cieplarnianych. [Norma EN 15804](https://sklep.pkn.pl/normy/pn-en-15804-a2-2020-03p.html) przewiduje też inne wskaźniki, np. zakwaszenie oraz zużycie zasobów i wody.
6. **Podwójne liczenie.** Jeżeli emisję ze spalania gazu wzięto z raportu ETS, nie można ponownie doliczyć spalania ujętego w zbiorze tła dla gazu. Potrzebny jest zbiór opisujący dostarczenie paliwa bez jego spalania albo odpowiednie rozdzielenie tych procesów w modelu.

Weryfikacja raportu ETS nie zastępuje weryfikacji deklaracji środowiskowej wyrobu (EPD) ani oceny wymaganej przez CPR. Weryfikator raportu sprawdza emisje instalacji, a nie obliczenia dla wyrobu.

## Co zapowiada Komisja

W [planie prac do CPR na lata 2026–2029, COM(2025) 772](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52025DC0772), w części 3.2.2, Komisja zapowiada dwa rozwiązania.

Pierwsze to europejskie zbiory danych tła dla producentów. Mają być stosowane obowiązkowo wtedy, gdy dane specyficzne dla przedsiębiorstwa nie są łatwo dostępne albo ich pozyskanie jest kosztowne. Plan zalicza do danych specyficznych również dane wysokiej jakości z ETS dużych instalacji. Zbiory tła mają mieć charakter „konserwatywny”. Komisja wiąże to określenie z ograniczeniem wybierania danych tylko dlatego, że stawiają wyrób w najlepszym świetle. Plan nie podaje jednak definicji ani szczegółowej metody ustalania takich wartości. Osobno trzeba sprawdzić rok odniesienia i zakres zbioru. Przykład takiej kontroli dla energii elektrycznej w Polsce opisujemy w artykule o [unijnych danych tła i polskim miksie energii](/blog/unijne-dane-tla-cpr-polski-miks-energii).

Drugie to akt delegowany uznający wykorzystanie danych ETS w ocenie zrównoważenia środowiskowego. Ma dotyczyć grup wyrobów, w których dane i metodyka ETS pozwalają objąć znaczną część emisji w cyklu życia. Komisja chce w ten sposób ujednolicić podejście w przepisach UE i zmniejszyć obciążenia administracyjne producentów.

Plan jest zapowiedzią Komisji. Sam nie ustanawia obowiązków producenta i nie określa szczegółowych warunków przyszłego aktu. Przed wykorzystaniem danych ETS w obliczeniach na potrzeby CPR trzeba sprawdzić, czy akt przyjęto, których grup wyrobów dotyczy i jakie stawia warunki.

## Co z tego wynika dla producenta

Dane własne nie gwarantują niższego wyniku. Mogą dać wynik niższy albo wyższy niż dane tła; ich zaletą jest to, że opisują rzeczywisty proces. Wspólne dane tła mają ograniczyć różnice wynikające z wyboru bazy. Wyniki dwóch wyrobów można jednak porównywać tylko wtedy, gdy obliczono je według tych samych zasad, dla tej samej jednostki i w tym samym zakresie.

Trzeba też odróżnić zastosowania. Dobrowolną EPD sporządza się według normy EN 15804 i zasad programu deklaracji. Obowiązki z art. 15 CPR dotyczą deklaracji właściwości użytkowych i zgodności, a ich zakres dla konkretnego wyrobu wynika z właściwej specyfikacji technicznej i przepisów przejściowych. Omawiamy je w artykule o [śladzie węglowym w CPR](/blog/gwp-obowiazkowe-cpr-2024). Ślad środowiskowy wyrobu to także co innego niż emisje budynku, o czym piszemy w artykule o [śladzie węglowym wyrobu a emisjach budynku](/blog/gwp-wyrobu-cpr-a-gwp-budynku-epbd).

Zakład objęty ETS może już teraz porównać granice swojej instalacji z procesami potrzebnymi do obliczeń dla wyrobu. Warto też zapisać, które zużycia paliw i emisje da się przypisać do poszczególnych wyrobów, a których procesów raport nie obejmuje.

Multicert weryfikuje deklaracje środowiskowe wyrobów. Weryfikator sprawdza m.in., czy dane zakładu i zbiory tła dobrano zgodnie z metodą i czy odpowiadają stanowi faktycznemu. Nie przygotowuje danych za producenta. W osobnym artykule opisujemy [zasady oceny danych środowiskowych według CPR](/blog/avs-3plus-walidacja-epd).

---

*Pytania o przebieg weryfikacji deklaracji środowiskowej wyrobu można kierować na adres: biuro@multicert.pl*
