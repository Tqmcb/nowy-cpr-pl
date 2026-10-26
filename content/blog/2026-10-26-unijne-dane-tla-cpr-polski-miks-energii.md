---
# VALIDATED-CPR: 2026-10-26 (weryfikacja faktów Codex r3 APPROVED; trafienia walidatora = lata narzutu CBAM i data posiedzenia EF TAB, nie terminy rodzin wyrobów)
title: "Unijne dane tła dla CPR: kto je liczy, kiedy będą gotowe i dlaczego wartości domyślne mają być zawyżone"
reviewed: "2026-10-26"
date: "2026-10-26"
author: "Mikołaj Junosza-Szaniawski | Redakcja NowyCPR.pl | Multicert Sp. z o.o."
category: "Środowisko i LCA"
tags: ["CPR 2024", "zbiory danych tła", "energia elektryczna", "miks rezydualny", "CBAM", "EU ETS", "EN 15941", "EPD", "dane LCA"]
excerpt: "Od jednego zdania w planie prac Komisji do umowy za 199 800 euro: kto przygotowuje unijne dane tła dla CPR, w tym polski miks energii, i dlaczego wartości domyślne w CPR i CBAM mają być zawyżone."
image_url: /images/blog/unijne-dane-tla-cpr-polski-miks-energii.jpg
template: "regulacja"
sources:
  - Plan prac Komisji na lata 2026–2029, COM(2025) 772 (EUR-Lex)|https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52025DC0772
  - Przetarg EC-GROW/2025/OP/0101 — ogłoszenie i specyfikacja, portal Funding & Tenders|https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/tender-details/627f4c62-9362-4147-ab7f-29ea48624f89-CN
  - Ogłoszenie o udzieleniu zamówienia TED 26649-2026 z 14.01.2026|https://ted.europa.eu/en/notice/-/detail/26649-2026
  - GreenDelta — projekt „Life Cycle Information for CPR Compliance”|https://www.greendelta.com/project/cprcompliance/
  - Rozporządzenie (UE) 2024/3110 — pełny tekst (PL)|https://eur-lex.europa.eu/eli/reg/2024/3110/oj/pol
  - Rozporządzenie wykonawcze (UE) 2025/2621 — wartości domyślne CBAM (PL)|https://eur-lex.europa.eu/eli/reg_impl/2025/2621/oj/pol
  - Rozporządzenie wykonawcze (UE) 2026/1740 — korekta wartości domyślnych CBAM (PL)|https://eur-lex.europa.eu/eli/reg_impl/2026/1740/oj/pol
  - Rozporządzenie (UE) 2023/956 ustanawiające CBAM — pełny tekst (PL)|https://eur-lex.europa.eu/eli/reg/2023/956/oj/pol
  - Rozporządzenie (UE) 2025/2083 zmieniające rozporządzenie CBAM (PL)|https://eur-lex.europa.eu/eli/reg/2025/2083/oj/pol
  - Dyrektywa 2003/87/WE — unijny system handlu uprawnieniami do emisji (PL)|https://eur-lex.europa.eu/eli/dir/2003/87/oj/pol
  - Komisja Europejska, Green Forum — dane dla metod śladu środowiskowego (EF)|https://green-forum.ec.europa.eu/green-business/environmental-footprint-methods/data-ef-methods_en
  - Rejestr grup ekspertów Komisji — Environmental Footprint Technical Advisory Board (EF TAB), grupa E03710: dokumenty posiedzeń 35 i 37|https://ec.europa.eu/transparency/expert-groups-register/screen/expert-groups/consult?lang=en&groupId=3710
  - KOBiZE — wskaźniki emisyjności dla energii elektrycznej za rok 2024 (opublikowane w grudniu 2025 r.)|https://www.kobize.pl/pl/file/wskazniki-emisyjnosci/id/225/wskazniki-emisyjnosci-dla-energii-elektrycznej-za-rok-2024-opublikowane-w-grudniu-2025-r
  - poLCA — raport LCA energii elektrycznej dostarczonej w Polsce w 2025 r. (projekt)|https://polca.org.pl/konsultacje/energia-polska-2025-raport-lca.html
  - poLCA — profil energii Polska 2025 v4: metoda, źródła i status|https://polca.org.pl/energia-polska-2025-v4.html
  - JRC (EPLCA) — wykaz zbiorów EF 3.1 „MAPPED_EF2.0_EF3.1_datasets.xlsx”, arkusz „EF3.1 processes full list”|https://eplca.jrc.ec.europa.eu/permalink/MAPPED_EF2.0_EF3.1_datasets.xlsx
  - JRC Data Catalogue — ELCD3: Electricity Mix, consumption mix, at consumer, 1kV–60kV, PL (DOI 10.2905/JRC.G3T6BK0)|https://data.jrc.ec.europa.eu/dataset/jrc-eplca-5b0b8cd1-d964-4273-bd13-896190ec41cf
  - Komisja Europejska (DG TAXUD) — arkusz informacyjny z wartościami domyślnymi CBAM po korekcie 2026/1740|https://taxation-customs.ec.europa.eu/document/download/1c05d211-80cb-4aaa-8ef0-e08005a95d7e_en?filename=DV+correcting+act_final+update_06.08.xlsx
---

W planie prac Komisji Europejskiej do rozporządzenia (UE) 2024/3110 w sprawie wyrobów budowlanych (CPR) jest jedno zdanie, które producent powinien przeczytać dwa razy. Dane tła do obliczania właściwości środowiskowych „mają mieć charakter konserwatywny”, aby uniknąć „data shopping”, czyli wybierania danych najkorzystniejszych dla wyrobu. Od tego zdania prowadzi ślad przez unijny portal zamówień, specyfikację z wykazem dwunastu zbiorów danych dla Polski i ogłoszenie o udzieleniu zamówienia aż do strony wykonawcy.

Idziemy tym śladem krok po kroku, z datami i kwotami. Po drodze pokazujemy, że podobny mechanizm Komisja stosuje już w innym akcie: w mechanizmie dostosowywania cen na granicach z uwzględnieniem emisji CO₂ (CBAM) wartości domyślne powiększa się o narzut rosnący w latach 2026–2028. Wniosek dla producenta jest w obu przypadkach ten sam. Kto ma własne, sprawdzone dane, może na nich oprzeć obliczenia. Kto ich nie ma, korzysta z danych, które z założenia nie mają mu sprzyjać.

W lipcu opisaliśmy same zapowiedzi z planu prac: [obowiązkowe europejskie zbiory danych tła i dane z systemu handlu emisjami](/blog/zbiory-danych-tla-dane-ets-slad-srodowiskowy-wyrobu). Ten tekst idzie dalej. Pokazuje, kto, za ile i do kiedy przygotowuje te zbiory, co obejmą dla Polski i jak producent może się do nich przygotować.

## Najważniejsze w skrócie

- Plan prac Komisji na lata 2026–2029 (COM(2025) 772 z 16 grudnia 2025 r.) zapowiada, że unijne dane tła będą obowiązkowe tam, gdzie producent nie ma łatwo dostępnych danych własnych, i że będą „konserwatywne”. To zapowiedź, a nie obowiązujący przepis.
- Przetarg EC-GROW/2025/OP/0101 (ogłoszony 24 września 2025 r., wartość szacunkowa 200 000 euro bez VAT) wygrało konsorcjum GreenDelta GmbH, Ecoinnovazione Srl i EBP Schweiz AG. Umowę za 199 800 euro zawarto 23 grudnia 2025 r.; szacowany czas trwania to 10 miesięcy.
- Specyfikacja wymienia dwanaście zbiorów dla Polski, w tym miks energii elektrycznej dla sieci 1–60 kV i miks rezydualny.
- Wykonawca podaje na swojej stronie okres projektu luty–sierpień 2026. Nie wiadomo, czy zbiory dla Polski trafiły już do Komisji; terminu publikacji Komisja nie podała.
- Równolegle Komisja zmienia metodę śladu środowiskowego (EF), a to z danych EF mają powstać zbiory dla CPR. W październiku 2025 r. zaproponowała jeden miks energii dla całej Unii; wielu ekspertów rady doradczej do spraw technicznych śladu środowiskowego (EF TAB) zgłosiło zastrzeżenia. W kwietniu 2026 r. Wspólne Centrum Badawcze (JRC) pokazało nową hierarchię z krajowym średnim miksem zużycia, a Dyrekcja Generalna ds. Środowiska (DG ENV) poinformowała o rozwiązaniu umowy na zbiory danych EF 4.0. To dokumenty robocze, nie przyjęte zalecenie.
- W CBAM wartości domyślne emisji wbudowanych powiększa się o narzut: 10 % w 2026 r., 20 % w 2027 r. i 30 % od 2028 r. dla cementu, żelaza i stali, aluminium i wodoru. W CPR podobną rolę mają pełnić „konserwatywne” dane tła.
- Producent może już teraz zbierać dane o energii zakładu, sprawdzić, czy jego instalacja jest objęta unijnym systemem handlu uprawnieniami do emisji (EU ETS), i porównać swoje liczby z polskim profilem energii na poLCA.

## Ślad pierwszy: jedno zdanie w planie prac Komisji

16 grudnia 2025 r. Komisja opublikowała [plan prac do rozporządzenia CPR na lata 2026–2029, COM(2025) 772](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52025DC0772). Fragment o danych tła brzmi w naszym roboczym tłumaczeniu tak:

> „Komisja ogłosiła przetarg na dane tła do obliczania właściwości środowiskowych. Projekt ma zapewnić producentom europejskie dane tła. Rozpocznie się od danych dla pierwszych norm zharmonizowanych obejmujących zrównoważenie środowiskowe i w kolejnych latach obejmie dalsze rodziny wyrobów. Dane tła mają być stosowane obowiązkowo tam, gdzie dane specyficzne dla przedsiębiorstwa — w tym dane wysokiej jakości z unijnego systemu handlu emisjami (EU ETS) dla dużych instalacji — nie są łatwo dostępne lub są drogie w pozyskaniu. Aby uniknąć »data shopping« (tj. wyboru danych, które pokazują wyrób w najlepszym świetle), dane tła mają mieć charakter konserwatywny.”

Z tego fragmentu wynikają wprost trzy rzeczy. Po pierwsze, Komisja zamówiła dane w przetargu, a nie opracowuje ich własnymi siłami. Po drugie, obowiązek stosowania danych tła plan wiąże z sytuacją, w której danych własnych producenta nie ma albo są drogie w pozyskaniu; zakazu korzystania z danych tła przy dostępnych danych własnych plan nie formułuje. Dane z EU ETS dla dużych instalacji Komisja wprost zalicza do danych własnych. Po trzecie, „data shopping” oznacza w języku Komisji wybieranie spośród dostępnych baz tych liczb, które dają wyrobowi najlepszy wynik. Odpowiedzią ma być jeden wspólny, „konserwatywny” zbiór.

Plan nie definiuje, co znaczy „konserwatywny”. Nasza interpretacja: zbiór, który w razie wątpliwości zakłada raczej wyższy niż niższy wpływ na środowisko. Kto użyje go zamiast danych własnych, nie powinien na tym zyskać.

Dwa zastrzeżenia. Obowiązkowość i konserwatywny charakter danych tła to zapowiedź z planu prac, nie przepis. Plan nie rozstrzyga, od kiedy i w których dokumentach zbiory będą wiążące ani czy obejmą dobrowolne deklaracje środowiskowe (EPD) poza systemem CPR. W tym samym planie Komisja zapowiada też akt delegowany, który uzna dane z EU ETS za dane wejściowe do oceny zrównoważenia środowiskowego dla grup wyrobów, w których dane i metodyka ETS obejmą znaczną część emisji cyklu życia. Do tego wątku wracamy niżej.

Plan mówi o ogłoszonym przetargu, ale nie podaje jego numeru. Trzeba go znaleźć.

## Ślad drugi: numer przetargu w portalu zamówień

W unijnym portalu Funding & Tenders jest [przetarg EC-GROW/2025/OP/0101](https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/tender-details/627f4c62-9362-4147-ab7f-29ea48624f89-CN) pod tytułem „Development and adaptation of life cycle information for construction products to be used in the context of Regulation (EU) 2024/3110”. Zamawiającym jest Dyrekcja Generalna ds. Rynku Wewnętrznego, Przemysłu, Przedsiębiorczości i MŚP (DG GROW). Ogłoszenie opublikowano 24 września 2025 r. Pytania można było zadawać do 17 października, oferty składać do 27 października 2025 r. do godz. 12:00, a otwarcie ofert wyznaczono na 28 października. Szacunkowa wartość zamówienia: 200 000 euro bez VAT.

W specyfikacji jest jeszcze jeden ślad, tym razem wstecz. Komisja przypomina, że dane do metod śladu środowiskowego (Environmental Footprint, EF) zamówiła już w 2022 r., w przetargu RTD/2022/OP/0004. Tych danych nie można jednak użyć w CPR wprost: zasady obliczeń w CPR wynikają z EN 15804 i różnią się od zasad EF. Dlatego zamówienie obejmuje dwa komponenty merytoryczne (nie podzielono go na części):

1. **Zbiory zgodne z CPR na podstawie danych EF** (wykaz 7.1 specyfikacji). Istniejące dane EF wykonawca dostosowuje do wymagań EN 15804.
2. **Nowe zbiory, które nie mają podstawy w danych EF** (wykaz 7.2). Specyfikacja każe wykonawcy rozważyć opracowanie istotnej części tych zbiorów wspólnie z przemysłem i przyjmować rzetelne propozycje danych od przemysłu.

Numeracja wykazów jest w samej specyfikacji niespójna: nagłówki mają numery 7.1 i 7.2, a opisy produktów prac D.4 i D.6 odsyłają do nich jako do 6.1 i 6.2.

Wymagania wobec zbiorów: wszystkie wskaźniki EN 15804, ze szczególnym uwzględnieniem wskaźników z załącznika II do CPR; zgodność z EN 15804 i EN 15941; format wymiany danych ILCD. Prawa do nowych wyników nabywa Unia Europejska. Cel opisuje pkt 1.4.1 specyfikacji: zbiory mają być dostępne bezpłatnie, aby obniżyć koszty obliczeń, zwłaszcza dla małych i średnich przedsiębiorstw. Mają też dać wspólne dane tła, dzięki którym „tylko informacje specyficzne dla firmy lub dostawcy mają prowadzić do różnic w wynikach”. Bezpłatny dostęp jest więc założeniem zamówienia, a nie automatycznym skutkiem umowy.

Terminy ze specyfikacji liczą się od podpisania umowy: raport o różnicach między danymi EF a wymaganiami CPR po 3 miesiącach, zbiory danych po 6 miesiącach, raporty z przeglądu zbiorów miesiąc później. Termin 6 miesięcy jest terminem podstawowym; dla pierwszego komponentu zamawiający może go wydłużyć (pkt D.4 specyfikacji), gdy brakuje danych źródłowych. Czas trwania umowy podano niespójnie: specyfikacja (pkt 1.8) przewiduje najwyżej 7 miesięcy, a ogłoszenie o udzieleniu zamówienia podaje szacowany czas trwania 10 miesięcy.

Specyfikacja określa też, jak wykonawca ma postępować, gdy jakość danych budzi wątpliwości. Jeżeli eksperci podejrzewają, że dane są niedokładne, wykonawca ma rozważyć ich weryfikację we współpracy z państwami członkowskimi, organizacjami pozarządowymi i przemysłem. Jeżeli nie wykorzysta danych przekazanych przez przemysł, podaje powód. To obowiązki wykonawcy wobec zamawiającego w czasie trwania umowy. Specyfikacja nie tworzy publicznego kanału zgłaszania uwag do gotowych zbiorów. Nie ustaliliśmy też, kto i w jakim trybie przyjmuje dziś uwagi do zbiorów dla Polski.

Harmonogramu aktualizacji zbiorów przetarg nie określa. Wykonawca ma zaproponować sposób długoterminowego zarządzania danymi i udokumentować zmiany.

## Ślad trzeci: dwanaście zbiorów dla Polski

Wykaz 7.1 specyfikacji wymienia zbiory oparte na danych EF, które wykonawca ma dostosować do CPR. Dla Polski jest ich dwanaście. Dziesięć opisuje energię elektryczną z poszczególnych źródeł: biogazu, biomasy stałej, gazu węglowego (w oryginale „coal gas”), węgla kamiennego, ciężkiego oleju opałowego, energii wodnej, węgla brunatnego, gazu ziemnego, energii słonecznej i energii wiatrowej. Dwa opisują energię z sieci: „electricity grid mix 1kV–60kV PL”, czyli miks sieciowy dla napięcia 1–60 kV, oraz „electricity residual grid mix PL”, czyli miks rezydualny.

Znaczenie miksu rezydualnego dla producenta wynika z EN 15941:2024. Jej załącznik E (normatywny) opisuje dobór danych o energii elektrycznej. Załącznik rozróżnia procesy pod kontrolą producenta, na przykład energię zużywaną w jego zakładzie, od procesów wcześniejszych poza jego kontrolą, dla których stosuje się dane dostawców lub dane tła. Instrument umowny to dokument potwierdzający pochodzenie kupowanej energii. W podejściu z instrumentami umownymi dla energii z sieci zużywanej w procesach pod kontrolą producenta stosuje się dane konkretnego produktu dostawcy, jeżeli instrument umowny spełnia wymagania normy. Dla energii bez takiego instrumentu stosuje się w tym podejściu miks rezydualny, czyli miks pozostały po odjęciu energii objętej instrumentami umownymi. Norma przewiduje też wyjątki: miks fizyczny albo miks zużycia, między innymi gdy w danym kraju nie ma rejestru instrumentów albo odpowiedniego miksu rezydualnego. O tym, które podejście stosuje się w konkretnej deklaracji, rozstrzygają zasady programu EPD, w którym deklaracja powstaje. Tak oblicza się deklaracje według EN 15804 i EN 15941. Metoda EF, na której danych mają powstać zbiory, zmierza właśnie w inną stronę; piszemy o tym w śladzie szóstym.

Z tego wynika nasza interpretacja: unijny zbiór „electricity residual grid mix PL” może stać się punktem odniesienia dla tych polskich producentów, którzy liczą energię w podejściu z instrumentami umownymi, ale nie mają danych dostawcy spełniających wymagania normy. Dla wielu zakładów byłaby to po prostu „ta liczba za prąd”.

I tu pojawia się pytanie, na które specyfikacja nie odpowiada: z którego roku będą dane wejściowe? Zbiory dla energii mają powstać z istniejących danych EF, zamówionych w 2022 r. Roku danych specyfikacja nie wskazuje. Jest jednak ślad, który pokazuje skalę problemu. W [oficjalnym wykazie zbiorów EF 3.1 prowadzonym przez JRC](https://eplca.jrc.ec.europa.eu/permalink/MAPPED_EF2.0_EF3.1_datasets.xlsx) (arkusz „EF3.1 processes full list”, wiersz 2501) zbiór firmy Sphera „miks energii elektrycznej, Polska, 1–60 kV” o identyfikatorze 646d61ac-1d33-4c2c-bc11-89dd1c829d1e ma rok referencyjny 2012. Starszy zbiór z bazy ELCD3 w [katalogu danych JRC](https://data.jrc.ec.europa.eu/dataset/jrc-eplca-5b0b8cd1-d964-4273-bd13-896190ec41cf) (DOI 10.2905/JRC.G3T6BK0) obejmuje lata 2002–2010. Trzy zastrzeżenia. Wykaz JRC odzwierciedla stan do czerwca 2023 r. Rok referencyjny dotyczy tego konkretnego zbioru, nie wszystkich danych Sphera ani przyszłych zbiorów CPR. Specyfikacja mówi, że pierwszy komponent opiera się na danych EF, ale nie wiemy, czy właśnie na tym zbiorze. Nie wyciągamy z tego wniosków o wartościach liczbowych. Wniosek jest prostszy: jeżeli unijny miks dla Polski oprze się na danych z tamtych lat, może nie oddawać stanu polskiej energetyki z roku, za który producent liczy deklarację. Do tego wątku wracamy przy polskim profilu energii.

## Ślad czwarty: ogłoszenie o udzieleniu zamówienia

W TED, unijnym serwisie ogłoszeń o zamówieniach publicznych, jest [ogłoszenie o udzieleniu zamówienia 26649-2026](https://ted.europa.eu/en/notice/-/detail/26649-2026), opublikowane 14 stycznia 2026 r. Wynika z niego, że:

- wpłynęły 2 oferty;
- wykonawcę wybrano 11 grudnia 2025 r.;
- umowę zawarto 23 grudnia 2025 r.;
- wykonawcą jest konsorcjum: GreenDelta GmbH (lider), Ecoinnovazione Srl oraz EBP Schweiz AG;
- wartość umowy wynosi 199 800 euro, a szacowany czas trwania 10 miesięcy.

Trzy spostrzeżenia z zestawienia dat i kwot (nasze, nie z dokumentów). Gdy 16 grudnia 2025 r. plan prac pisał o „ogłoszonym przetargu”, wykonawca był już od pięciu dni wybrany, a tydzień później podpisano umowę. Ogłoszenie o udzieleniu zamówienia ukazało się 14 stycznia 2026 r., sześć dni po tym, jak 8 stycznia 2026 r. zaczęła obowiązywać większość przepisów CPR. Wartość umowy jest o 200 euro niższa od szacunku.

Ecoinnovazione to spółka typu spin-off włoskiej agencji ENEA, czyli agencji ds. nowych technologii, energii i zrównoważonego rozwoju gospodarczego. Chodzi o włoską agencję ENEA, nie o polską spółkę energetyczną Enea. EBP Schweiz AG to firma szwajcarska.

## Ślad piąty: strona wykonawcy

GreenDelta opisuje na [swojej stronie](https://www.greendelta.com/project/cprcompliance/) z 7 maja 2026 r. projekt „Life Cycle Information for CPR Compliance”: finansowaną przez Komisję publiczną bibliotekę zbiorów danych inwentarzowych cyklu życia (LCI) dla 34 materiałów budowlanych z ośmiu sektorów przemysłu, zgodnych z metodyką EF 4.0 i z CPR. Firma kieruje projektem, zbiera dane od przemysłu, a zatwierdzone dane przekształca w zbiory w formacie ILCD. Jako partnerów pokazuje Ecoinnovazione (z dopiskiem „spin off ENEA”) i EBP. Okres projektu według strony: luty–sierpień 2026. Jako odniesienie projektu strona podaje kartę przetargu EC-GROW/2025/OP/0101 w portalu Funding & Tenders.

To zamyka wątek tożsamości projektu. Skład konsorcjum zgadza się z ogłoszeniem o udzieleniu zamówienia, numer przetargu wskazuje sama strona wykonawcy, a format ILCD odpowiada specyfikacji. Projekt GreenDelta jest więc realizacją zamówienia udzielonego w przetargu EC-GROW/2025/OP/0101.

Jedna rozbieżność wymaga odnotowania. Strona wykonawcy mówi o zgodności z EF 4.0, a Komisja planuje EF 4.0 dopiero na 2028 r. Lata 2025–2028 Komisja nazywa okresem przejściowym, a 14 lipca 2026 r. opublikowała na [Green Forum](https://green-forum.ec.europa.eu/green-business/environmental-footprint-methods/data-ef-methods_en) wytyczne przejściowe dla badań według metod EF na wypadek braku danych EF. Ze źródeł publicznych nie wynika, jak wykonawca pogodzi zbiory tworzone w 2026 r. z metodą planowaną na 2028 r. Sam przegląd metody EF ma własny harmonogram i własne dokumenty. To szósty ślad.

## Ślad szósty: protokoły rady doradczej EF

Skoro zbiory dla CPR mają powstać z danych EF, sprawdziliśmy, co dzieje się z samą metodą EF. Komisja prowadzi jej przegląd z udziałem rady doradczej do spraw technicznych śladu środowiskowego (Environmental Footprint Technical Advisory Board, EF TAB), zarejestrowanej jako grupa E03710 w [rejestrze grup ekspertów Komisji](https://ec.europa.eu/transparency/expert-groups-register/screen/expert-groups/consult?lang=en&groupId=3710). Dokumenty z posiedzeń są publiczne; część z nich nosi oznaczenie „Draft working document”, czyli projekt dokumentu roboczego. Trzy dotyczą wprost energii elektrycznej.

Październik 2025 r.: jeden miks dla całej Unii. Na posiedzenie 6–7 października 2025 r. Dyrekcja Generalna ds. Środowiska (DG ENV) przygotowała projekt dokumentu roboczego o modelowaniu energii elektrycznej. Propozycja: użytkownicy metody EF modelowaliby zużycie energii w „podejściu opartym na lokalizacji z miksem UE dla krajów UE i miksem krajowym dla krajów trzecich”. W oryginale: „location-based approach with EU mix for EU countries and national mix for third countries”. Polska fabryka liczyłaby prąd tak samo jak francuska. Z protokołu posiedzenia, sporządzonego 20 stycznia 2026 r., wynika, że zastrzeżenia zgłosiło wielu ekspertów, między innymi przedstawiciele Austrii i Finlandii oraz Aalborg University, PRé, GHG Protocol, Recharge i Renewable Carbon Initiative. Argumenty: jeden miks dla całej Unii spłaszcza różnice między krajami, odbiera producentom możliwość wykazania zmian we własnym zaopatrzeniu w energię i zniechęca do zbierania danych od dostawców. Propozycję poparło Europejskie Stowarzyszenie Stali (EUROFER), bo odróżnia wyroby z Unii od wyrobów spoza niej. Komisja, jak zapisano w protokole, „przyjęła do wiadomości krytykę wielu ekspertów wobec użycia miksu UE” oraz ich zalecenie, by stosować bardziej szczegółowe dane, i zaznaczyła, że ten wybór ma znaczenie polityczne wykraczające poza samą metodę EF.

17 kwietnia 2026 r.: nowa hierarchia w prezentacji JRC. Na posiedzeniu 37 Wspólne Centrum Badawcze (JRC) pokazało kierunek zmian (slajdy 27–29). Obecna hierarchia EF stawia na pierwszym miejscu energię wytwarzaną na miejscu, dalej energię dostawcy z wiarygodnymi instrumentami umownymi, a potem krajowy miks rezydualny. Slajdy odnotowują, że miks UE jako wartość domyślną dyskutowano, ale według prezentacji JRC większość interesariuszy EF uznała, że zniechęca on do inwestycji niskoemisyjnych i spłaszcza różnice regionalne. Proponowana nowa hierarchia ma dwa stopnie: energia z instalacji w zakładzie, a potem krajowy średni miks zużycia (national average consumption mix). Miks rezydualny i produkty dostawcy znikają z hierarchii ogólnej. Modelowanie ma obejmować emisje bezpośrednie i pośrednie. Wyjątek: gdy prawo UE dla danego wyrobu, procesu lub sektora stanowi inaczej, na przykład nakazuje miks UE zamiast krajowego albo dopuszcza określone umowy zakupu energii (PPA). JRC zaznacza, że slajdy są zapowiedzią treści dokumentów do konsultacji publicznych, a „temat jest nadal przedmiotem dyskusji i Komisja może być zmuszona doprecyzować podejście”. To dokument roboczy, nie przyjęte zalecenie.

17 kwietnia 2026 r.: umowa na zbiory EF 4.0 rozwiązana. Na tym samym posiedzeniu DG ENV podała trzy informacje o danych. Pierwsza brzmi w oryginale: „Current contract for development of EF4.0 datasets terminated, EC keeps on working on data”, czyli obecna umowa na opracowanie zbiorów danych EF 4.0 została rozwiązana, a Komisja kontynuuje prace nad danymi. Druga: ważności zbiorów EF 3.1 nie udało się przedłużyć; Komisja zapowiedziała komunikat o stosowaniu w badaniach EF zbiorów spoza EF do czasu uruchomienia nowej bazy. Trzecia to harmonogram: konsultacje międzyresortowe w drugim i trzecim kwartale 2026 r., formalne przyjęcie zmienionego zalecenia w trzecim lub czwartym kwartale 2026 r., posiedzenie rady w sprawie ostatecznego zalecenia 3 grudnia 2026 r. Daty te dotyczą zalecenia w sprawie metod EF; terminu udostępnienia nowej bazy danych EF prezentacja nie podaje.

Z tych dokumentów nie wynika, której umowy dotyczy rozwiązanie ani czy ma ono związek ze zbiorami CPR, które DG GROW zamówiła osobną umową. Nie ma też dokumentu, który mówiłby, jak nowe zasady EF przełożą się na zbiory CPR.

Wnioski dla producenta są naszą interpretacją. Deklaracje EPD, o których tu mowa, oblicza się według EN 15804 i EN 15941, a zgodności z obiema normami specyfikacja wymaga także od zamawianych zbiorów; załącznik E z instrumentami umownymi i miksem rezydualnym pozostaje częścią EN 15941. Zasady konkretnej deklaracji w systemie CPR wynikają z właściwych przepisów i specyfikacji technicznych. EF to osobna metoda i to ją Komisja właśnie zmienia. Ponieważ jednak zbiory CPR mają powstać z danych EF, kierunek tego przeglądu ma znaczenie dla danych wejściowych. W proponowanej hierarchii EF pierwszeństwo miałby krajowy średni miks zużycia z emisjami bezpośrednimi i pośrednimi, a nie miks rezydualny. Specyfikacja przetargu wymienia tymczasem dla Polski zarówno miks sieciowy, jak i miks rezydualny. Pozostaje pytaniem otwartym, czy Komisja przyjmie nową hierarchię, czy oba zbiory powstaną i jak będą liczone.

## Oś czasu: od pierwszego zdania do dzisiaj

| Data | Zdarzenie | Źródło lub status |
|---|---|---|
| 2022 | Komisja zamawia dane do metod EF (przetarg RTD/2022/OP/0004) | specyfikacja EC-GROW/2025/OP/0101 |
| 18.12.2024 | Publikacja rozporządzenia (UE) 2024/3110 (CPR) w Dzienniku Urzędowym UE | EUR-Lex |
| 24.09.2025 | Ogłoszenie przetargu EC-GROW/2025/OP/0101; szacunek 200 000 EUR bez VAT | portal Funding & Tenders |
| 6–7.10.2025 | Posiedzenie 35 EF TAB: projekt dokumentu roboczego DG ENV z jednym miksem UE dla krajów Unii; zastrzeżenia wielu ekspertów, poparcie EUROFER | rejestr grup ekspertów KE, E03710 |
| 27.10.2025, godz. 12:00 | Koniec składania ofert; otwarcie ofert 28.10.2025 | ogłoszenie o przetargu |
| 11.12.2025 | Wybór wykonawcy; wpłynęły 2 oferty | TED 26649-2026 |
| 16.12.2025 | Plan prac COM(2025) 772: dane tła konserwatywne, „data shopping”, zapowiedź aktu delegowanego o danych ETS | EUR-Lex |
| 23.12.2025 | Umowa z konsorcjum GreenDelta, Ecoinnovazione, EBP; 199 800 EUR; szacowany czas trwania 10 miesięcy | TED 26649-2026 |
| 1.01.2026 | Wartości domyślne CBAM z narzutem w okresie definitywnym (rozporządzenie 2025/2621) | EUR-Lex |
| 8.01.2026 | Stosowanie większości przepisów CPR | rozporządzenie 2024/3110 |
| 14.01.2026 | Publikacja ogłoszenia o udzieleniu zamówienia | TED 26649-2026 |
| luty–sierpień 2026 | Okres projektu według strony wykonawcy | GreenDelta |
| 17.04.2026 | Posiedzenie 37 EF TAB: nowa hierarchia JRC (energia na miejscu, krajowy średni miks zużycia); umowa na zbiory EF 4.0 rozwiązana; przyjęcie zmienionego zalecenia planowane na III/IV kwartał 2026 | rejestr grup ekspertów KE, E03710 |
| ok. 23.06.2026 | Termin podstawowy przekazania zbiorów Komisji (6 miesięcy od umowy; możliwe wydłużenie dla komponentu 1) | nasze wyliczenie |
| 14.07.2026 | Wytyczne przejściowe Komisji na lata 2025–2028 dla badań według metod EF przy braku danych EF | Green Forum |
| 20.07.2026 | Przyjęcie rozporządzenia 2026/1740 korygującego załączniki z wartościami domyślnymi CBAM (publikacja 31.07.2026) | EUR-Lex |
| ok. 23.07.2026 | Raporty z przeglądu zbiorów (miesiąc po zbiorach) | nasze wyliczenie |
| ok. 23.10.2026 | Upływ szacowanych 10 miesięcy od zawarcia umowy; rzeczywisty termin realizacji niepotwierdzony | nasze wyliczenie |
| 3.12.2026 | Planowane posiedzenie EF TAB w sprawie ostatecznego zalecenia o metodach EF | rejestr grup ekspertów KE, E03710 |
| 1.02.2027 | Początek sprzedaży certyfikatów CBAM | rozporządzenie 2023/956 po zmianie 2025/2083, art. 20 ust. 1 |
| 30.09.2027 | Termin pierwszego umorzenia certyfikatów CBAM za 2026 r. | tamże, art. 22 ust. 1 |
| 2028 | Planowana metoda EF 4.0 | Green Forum |

Z osi czasu widać, gdzie jesteśmy. Jeżeli liczyć szacowane w ogłoszeniu 10 miesięcy od zawarcia umowy 23 grudnia 2025 r., umowa upływałaby około 23 października 2026 r. To nasze wyliczenie, nie potwierdzony termin realizacji; rzeczywistego początku i końca prac dokumenty nie podają. Wykonawca wskazuje okres projektu luty–sierpień 2026. Nie wiemy, czy zbiory, w tym dwanaście dla Polski, trafiły już do Komisji. Publikacja ma nastąpić po zatwierdzeniu przez Komisję, a jej terminu Komisja nie podała.

## Podobny mechanizm w CBAM i CPR: wartości domyślne celowo zawyżone

Konserwatywne ustalanie wartości domyślnych i doliczanie do nich narzutu Komisja stosuje już gdzie indziej. Zestawienie CBAM i CPR to nasza analogia, a nie tożsamość przepisów. CBAM nakłada na importerów obowiązek rozliczenia emisji wbudowanych w towary sprowadzane do Unii, między innymi cement, żelazo i stal, aluminium, nawozy i wodór. Od 1 stycznia 2026 r. trwa okres definitywny, w którym obowiązują [wartości domyślne z rozporządzenia wykonawczego (UE) 2025/2621](https://eur-lex.europa.eu/eli/reg_impl/2025/2621/oj/pol), skorygowane [rozporządzeniem wykonawczym (UE) 2026/1740](https://eur-lex.europa.eu/eli/reg_impl/2026/1740/oj/pol) z 20 lipca 2026 r., opublikowanym 31 lipca 2026 r. (załączniki I i IV).

Dla towarów innych niż energia elektryczna importer rozlicza emisje wbudowane na podstawie zweryfikowanych danych rzeczywistych z instalacji, która wytworzyła towar, albo na podstawie wartości domyślnych (art. 7 ust. 2 rozporządzenia 2023/956 po zmianie 2025/2083). Obie drogi są dopuszczalne; w praktyce po wartość domyślną sięga ten, kto danych rzeczywistych nie ma. Wartości domyślne powiększa się jednak o narzut. Dla cementu, żelaza i stali, aluminium i wodoru wynosi on 10 % w 2026 r., 20 % w 2027 r. i 30 % od 2028 r.; dla nawozów 1 %. Przykład z [arkusza informacyjnego Komisji z wartościami domyślnymi po korekcie 2026/1740](https://taxation-customs.ec.europa.eu/document/download/1c05d211-80cb-4aaa-8ef0-e08005a95d7e_en?filename=DV+correcting+act_final+update_06.08.xlsx): kęsisko ze stali niestopowej z Chin o kodzie CN 7207 12 10 (według Nomenklatury scalonej) ma wartość domyślną 3,169 t CO₂ równ. na tonę, a z narzutem na 2026 r. około 3,486 t CO₂ równ. na tonę. Sąsiednie podpozycje mają inne wartości, na przykład CN 7207 11 90: 3,314 t CO₂ równ. na tonę. Przy porównywalnych pozostałych założeniach i po właściwych korektach rozliczenia importer, którego zweryfikowane emisje rzeczywiste są niższe od wartości domyślnej po narzucie, umorzy za taką tonę mniej certyfikatów CBAM niż ten, kto rozlicza ją na podstawie wartości domyślnej. Przy emisjach wyższych od wartości po narzucie jest odwrotnie. Certyfikaty będą w sprzedaży od 1 lutego 2027 r., a pierwsze umorzenie, za 2026 r., importerzy wykonają do 30 września 2027 r. ([rozporządzenie (UE) 2023/956](https://eur-lex.europa.eu/eli/reg/2023/956/oj/pol) po zmianie [rozporządzeniem (UE) 2025/2083](https://eur-lex.europa.eu/eli/reg/2025/2083/oj/pol), art. 20 ust. 1 i art. 22 ust. 1).

Rozporządzenie 2025/2621 uzasadnia to w motywach: wartości domyślne mają być ostrożne i chronić przed niedoszacowaniem emisji. „Zawyżone” to nasze określenie tego skutku. Dla importera znaczy to tyle, że zdobycie i zweryfikowanie danych rzeczywistych może się opłacać, ale nie musi; rozstrzyga porównanie emisji konkretnej instalacji z wartością domyślną po narzucie. W CPR mechanizm ma być podobny, tylko bez liczbowego narzutu w planie prac: dane tła mają być „konserwatywne”, a obowiązek ich stosowania plan wiąże z brakiem lub wysokim kosztem danych własnych. Porównanie obu mechanizmów:

| Element | CBAM | CPR |
|---|---|---|
| Podstawa | rozporządzenie (UE) 2023/956 ze zmianą 2025/2083; wartości domyślne: 2025/2621 i korekta 2026/1740 | rozporządzenie (UE) 2024/3110; zapowiedź w planie prac COM(2025) 772 |
| Status | obowiązuje; okres definitywny od 1.01.2026 | zapowiedź; zbiory zamówione umową z 23.12.2025; aktualnego statusu przekazania i publikacji nie ustalono |
| Kiedy stosuje się wartość domyślną | importer wybiera między zweryfikowanymi danymi rzeczywistymi instalacji a wartością domyślną; bez danych zostaje wartość domyślna | według planu prac: gdy producent nie ma łatwo dostępnych danych specyficznych (w tym danych EU ETS dużych instalacji) albo są one drogie |
| Jak podniesiono wartość domyślną | narzut 10 % (2026), 20 % (2027), 30 % (od 2028) dla cementu, żelaza i stali, aluminium i wodoru; 1 % dla nawozów | dane „konserwatywne”; narzutu liczbowego plan nie podaje |
| Skutek dla korzystającego z wartości domyślnej | więcej certyfikatów CBAM do umorzenia (koszt w EUR), jeżeli rzeczywiste emisje instalacji są niższe od wartości domyślnej po narzucie, przy porównywalnych pozostałych założeniach | wynik wskaźników, np. w kg CO₂ równ. na jednostkę wyrobu, oparty na ostrożnym założeniu zamiast na rzeczywistym procesie |
| Co daje własna zweryfikowana wartość | rozliczenie według rzeczywistych emisji instalacji | wynik bliższy rzeczywistemu procesowi |
| Przykład | kęsisko CN 7207 12 10 z Chin: 3,169 → ok. 3,486 t CO₂ równ./t w 2026 r. | energia z sieci w podejściu z instrumentami umownymi: dane produktu dostawcy albo miks rezydualny (po publikacji może nim być unijny zbiór PL), z wyjątkami według zasad programu |

Jedna różnica ma dla producenta praktyczne znaczenie. W CBAM wartość domyślną wybiera i opłaca importer, a skutek narzutu widzi od razu w liczbie certyfikatów. W CPR wartość domyślna wchodzi do obliczenia deklarowanych właściwości środowiskowych wyrobu, a jej skutek zobaczy odbiorca, gdy porówna wyniki różnych producentów.

## Dane z EU ETS: co pokryją, a czego nie

Plan prac wymienia dane z EU ETS dwa razy. Raz wśród danych specyficznych dla przedsiębiorstwa, przy których dostępności dane tła nie miałyby być obowiązkowe. Drugi raz jako dane wejściowe, które Komisja chce uznać aktem delegowanym dla grup wyrobów, w których dane i metodyka ETS obejmą znaczną część emisji cyklu życia. Przyjętego aktu delegowanego nie odnaleźliśmy, a szczegółowych zasad nie znamy; na razie to zapowiedź, a nie uprawnienie, z którego producent mógłby skorzystać. Poniżej oddzielamy to, co wynika z działania samego systemu, od tego, co jest naszą interpretacją.

Co wiadomo o danych z EU ETS. System działa na podstawie [dyrektywy 2003/87/WE](https://eur-lex.europa.eu/eli/dir/2003/87/oj/pol). Dane ETS to roczne emisje bezpośrednie instalacji, głównie CO₂, a w niektórych rodzajach działalności także N₂O i perfluorowęglowodory (PFC). Instalacja monitoruje je według zatwierdzonego planu monitorowania, a akredytowany weryfikator sprawdza je co roku. System obejmuje między innymi produkcję klinkieru cementowego, wapna, szkła, wypalanych wyrobów ceramicznych, wełny mineralnej, żelaza i stali oraz aluminium, czyli sektory ważne dla wyrobów budowlanych. O objęciu konkretnej instalacji decydują warunki z załącznika I dyrektywy; nie każdy zakład z tych sektorów podlega ETS.

Czego raport instalacji nie obejmuje. Nie ma w nim emisji z łańcucha dostaw surowców, emisji pośrednich z energii elektrycznej kupowanej z sieci, transportu wyrobu ani etapów użytkowania i końca życia. Raport dotyczy instalacji, nie konkretnego wyrobu: jeżeli zakład wytwarza kilka wyrobów, emisje trzeba między nie rozdzielić (alokacja). Osobną kwestią jest biomasa. W ETS emisje CO₂ ze spalania biomasy spełniającej kryteria zrównoważenia i ograniczenia emisji liczą się jako zero, choć fizycznie powstają, a EN 15804 rozlicza węgiel biogeniczny osobno, we wskaźniku potencjału globalnego ocieplenia dla węgla biogenicznego (GWP-biogenic). Przy przenoszeniu danych ETS do deklaracji trzeba więc te strumienie rozdzielić. Jak dokładnie, powinien rozstrzygnąć akt delegowany.

Co to zmienia dla producenta. To już nasza interpretacja planu, nie zapis dokumentu:

- producent objęty ETS ma już zweryfikowane liczby o emisjach bezpośrednich zakładu; jeżeli Komisja wdroży zapowiedź, w tym zakresie nie będzie musiał sięgać po konserwatywne dane tła;
- te same dane mogą zasilić sprawozdawczość ETS i deklarację CPR, a u eksporterów spoza Unii, przez analogię, także rozliczenie CBAM; ogranicza to dublowanie sprawozdawczości;
- ETS daje tylko część wyniku. Przykład warunkowy: w cemencie, w którym dominują emisje z wypalania klinkieru, dane ETS mogą pokryć dużą część wskaźnika GWP, ale energia kupowana z sieci, surowce i transport nadal wymagają innych danych. I tu wracają unijne dane tła, w tym polski miks energii;
- mniejsi producenci spoza ETS, na przykład wytwórnie prefabrykatów betonowych, kopalnie kruszyw i producenci zapraw, zostaną przy danych własnych zakładu, danych dostawców i danych tła. Wynik, który odwzorowuje ich zakład, dają dane własne, reprezentatywne dane dostawców i właściwie dobrane zbiory tła; niższego wyniku żadna z tych dróg nie gwarantuje.

Cztery przykłady mechanizmu, bez liczb, bo te zależą od zakładu. To ilustracje, nie reguły:

1. **Cementownia w ETS.** Zweryfikowane emisje z wypalania klinkieru trafiają jako dane własne do modułu A3 (wytwarzanie). Energię kupowaną z sieci, w programie EPD stosującym podejście z instrumentami umownymi, zakład liczy na podstawie danych produktu dostawcy, jeżeli instrument umowny spełnia wymagania EN 15941. Bez takiego instrumentu liczy ją na podstawie miksu rezydualnego, którym po publikacji może być unijny zbiór dla Polski. Program może przewidywać wyjątki (miks fizyczny albo miks zużycia), a energia wytwarzana na miejscu podlega osobnym zasadom. Surowce i dodatki zakład liczy na podstawie danych własnych lub danych tła.
2. **Zakład wapienniczy albo huta szkła w ETS.** Mechanizm ten sam. Dochodzi przypisanie emisji instalacji do poszczególnych wyrobów, gdy jedna instalacja wytwarza kilka asortymentów.
3. **Wytwórnia prefabrykatów betonowych poza ETS.** Kupuje cement. Jeżeli dostawca cementu udostępni deklarację środowiskową (EPD), prefabrykator wykorzysta ją jako dane o cemencie. Sam raport ETS cementowni tej deklaracji nie zastąpi: obejmuje tylko emisje bezpośrednie instalacji i wymaga przetworzenia oraz uzupełnienia. Własne emisje, przede wszystkim z energii i transportu, prefabrykator liczy na podstawie danych własnych albo unijnych danych tła.
4. **Analogia z CBAM.** Importer stali z instalacji spoza Unii, która ma zweryfikowane dane emisji, może rozliczyć emisje wbudowane na podstawie tych danych rzeczywistych; wybór wartości domyślnej pozostaje dopuszczalny. Bez takich danych rozlicza emisje według wartości domyślnej, w 2026 r. z narzutem 10 %.

## Polski miks energii: liczby, których nie wolno mylić

Raport ETS zakładu, który kupuje energię elektryczną, nie obejmuje emisji pośrednich tej energii, a zakład spoza ETS liczy ten składnik w całości sam. Dlatego ma znaczenie, skąd pochodzi liczba za 1 kWh.

Na portalu [poLCA](https://polca.org.pl/) opublikowaliśmy [projekt raportu z oceny cyklu życia energii elektrycznej dostarczonej w Polsce w 2025 r.](https://polca.org.pl/konsultacje/energia-polska-2025-raport-lca.html). Model podaje 37 wskaźników EN 15804 dla 1 kWh energii dostarczonej odbiorcy; wskaźnik GWP-total wynosi 0,6473 kg CO₂ równ./kWh (po zaokrągleniu do sześciu miejsc po przecinku 0,647275). Tę liczbę trzeba czytać razem z czterema zastrzeżeniami:

- to fizyczny miks zużycia, a nie miks rezydualny, więc nie jest tym samym, co zamówiony przez Komisję zbiór „electricity residual grid mix PL”;
- rok 2025 dotyczy miksu i krajowych aktywności; część danych tła pochodzi z lat 2000–2024;
- raport jest projektem (wersja 0.4) i nie przeszedł przeglądu krytycznego. To inna liczba niż w [publicznym profilu 2025 v4](https://polca.org.pl/energia-polska-2025-v4.html), z którego korzysta [przelicznik](https://polca.org.pl/oblicz-energie-2025.html) na portalu. Profil v4 ma GWP-total 0,6445 kg CO₂ równ./kWh (po zaokrągleniu do sześciu miejsc po przecinku 0,644540); raport opisuje nowszą wersję modelu;
- danych nie przyjęto do programu EPD Polska.

Druga liczba to wskaźnik [Krajowego Ośrodka Bilansowania i Zarządzania Emisjami (KOBiZE) dla odbiorców końcowych](https://www.kobize.pl/pl/file/wskazniki-emisyjnosci/id/225/wskazniki-emisyjnosci-dla-energii-elektrycznej-za-rok-2024-opublikowane-w-grudniu-2025-r) za 2024 r., opublikowany w grudniu 2025 r.: 553 kg CO₂/MWh, czyli 0,553 kg CO₂/kWh. Obu liczb nie wolno porównywać wprost: dzieli je rok (2024 wobec 2025), zakres i sposób wyznaczenia. Wskaźnik KOBiZE obejmuje emisje CO₂ z wytwarzania energii elektrycznej, a GWP-total z modelu poLCA obejmuje cały cykl życia dostarczonej energii i wszystkie gazy cieplarniane w przeliczeniu na CO₂. Sama zamiana jednostek z MWh na kWh porównywalności nie daje.

| Wielkość | Wartość | Jednostka | Co obejmuje | Status |
|---|---|---|---|---|
| poLCA, projekt raportu 0.4, GWP-total, energia elektryczna dostarczona w Polsce, 2025 r. | 0,6473 | kg CO₂ równ./kWh | cykl życia według EN 15804; fizyczny miks zużycia; 37 wskaźników | projekt do przeglądu krytycznego, nieprzyjęty do programu EPD Polska |
| poLCA, publiczny profil 2025 v4 (przelicznik), GWP-total | 0,6445 | kg CO₂ równ./kWh | cykl życia według EN 15804; fizyczny miks zużycia; 37 wskaźników | opublikowany profil, bez przeglądu krytycznego |
| KOBiZE, odbiorcy końcowi, dane za 2024 r. | 553 (0,553) | kg CO₂/MWh (kg CO₂/kWh) | emisje CO₂ z wytwarzania energii elektrycznej | opublikowany w grudniu 2025 r. |
| EF 3.1, Sphera, miks energii elektrycznej Polska 1–60 kV (wykaz JRC, wiersz 2501) | rok referencyjny 2012 | — | miks sieciowy 1–60 kV | wykaz JRC obejmuje stan do czerwca 2023 r.; nie wiadomo, czy posłuży jako dane wejściowe zbiorów CPR |
| Unijny zbiór „electricity residual grid mix PL” | brak publikacji w zbadanych źródłach | wskaźniki EN 15804 na 1 kWh | miks rezydualny | zamówiony umową z 23.12.2025; aktualnego statusu przekazania i publikacji nie ustalono; rok danych wejściowych nieznany |

Już teraz te liczby pokazują producentowi, czego może się spodziewać. Gdy Komisja opublikuje zbiór dla Polski, producent będzie mógł porównać trzy wartości dla swojego zużycia: unijny miks rezydualny, polski profil fizyczny z poLCA i dane własnego dostawcy. Rozbieżność między nimi pokaże, ile w jego deklaracji zależy od wyboru źródła danych o energii. Uwagi do polskiego modelu można zgłaszać w [konsultacjach na poLCA](https://polca.org.pl/konsultacje/energia-polska-2025.html); rozpatrujemy je przed przygotowaniem kolejnej wersji. Konsultacje dotyczą polskiego modelu, a nie zbiorów zamówionych przez Komisję.

Jest jeszcze jedna strona tego porównania. Model poLCA to krajowy fizyczny miks zużycia z emisjami pośrednimi w całym cyklu życia, czyli ten sam rodzaj miksu, w którego kierunku idzie przegląd metod EF opisany w śladzie szóstym. W deklaracjach EPD według EN 15804 i EN 15941 o doborze miksu rozstrzygają zasady programu. W zbadanych źródłach nie odnaleźliśmy potwierdzenia przyjęcia proponowanej hierarchii EF. Nie wiemy, czy zbiory CPR będą liczone jako krajowy miks zużycia. Jeżeli tak, polski model będzie miał już gotowy punkt porównania.

## Co producent może zrobić już teraz

1. **Zebrać dane o energii zakładu.** Zużycie energii elektrycznej z liczników i faktur za okres, który obejmie deklaracja, oraz dokumenty od dostawcy: umowy i instrumenty umowne potwierdzające pochodzenie energii. Bez nich w podejściu z instrumentami umownymi zostaje zwykle miks rezydualny.
2. **Sprawdzić, czy instalacja jest objęta EU ETS.** Jeżeli tak, zweryfikowane emisje bezpośrednie są gotowymi danymi wejściowymi, które Komisja zapowiada uznać aktem delegowanym. Trzeba jednak wiedzieć, czego w raporcie instalacji nie ma (emisji pośrednich energii kupowanej z sieci, surowców i transportu wyrobu) oraz jak rozdzielić emisje między wyroby.
3. **Ustalić podejście do energii w swoim programie EPD.** Czy program stosuje podejście z instrumentami umownymi, miks rezydualny czy profil fizyczny. Od tego zależy, która liczba za 1 kWh trafi do deklaracji.
4. **Porównać swoje liczby z polskim profilem.** [Przelicznik na poLCA](https://polca.org.pl/oblicz-energie-2025.html) zamienia zużycie energii na 37 wskaźników EN 15804 według profilu v4. Wynik można zestawić z danymi dostawcy, a po publikacji także z unijnym miksem rezydualnym.
5. **Śledzić publikację unijnych zbiorów.** Po ich udostępnieniu przeliczenie deklaracji na danych unijnych pokaże różnicę wobec dotychczasowych danych tła. Harmonogramu aktualizacji zbiorów Komisja nie określiła, więc rok danych wejściowych trzeba sprawdzić w dokumentacji zbioru.
6. **Zaplanować deklarację.** Zasady opracowania deklaracji środowiskowych w programie EPD Polska opisuje serwis [epd.org.pl](https://epd.org.pl/). Weryfikację danych środowiskowych w systemie oceny 3+ omawiamy w artykule [System AVS 3+ — walidacja danych środowiskowych](/blog/avs-3plus-walidacja-epd).

Własne dane nie gwarantują niższego wyniku. Dane specyficzne lepiej odwzorowują rzeczywisty proces, ale kierunek zmiany wyniku zależy od zużycia energii i jej profilu w konkretnym zakładzie. Skoro jednak unijne dane tła mają być konserwatywne, rzetelne dane własne dają szansę na wynik bliższy rzeczywistości, a nie ostrożnemu założeniu.

## Podsumowanie

Ślad zaczął się od jednego zdania w planie prac z 16 grudnia 2025 r. Doprowadził do umowy za 199 800 euro, konsorcjum trzech firm i dwunastu zbiorów danych dla Polski. Wśród nich jest miks rezydualny, który w podejściu z instrumentami umownymi może stać się punktem odniesienia dla producentów bez danych dostawcy. Podobny wzorzec Komisja już stosuje w CBAM, gdzie do wartości domyślnej dolicza się narzut 10 % w 2026 r., 20 % w 2027 r. i 30 % od 2028 r. Równolegle Komisja zmienia metodę EF, z której danych mają powstać zbiory: proponowany kierunek to krajowy średni miks zużycia, a umowę na zbiory EF 4.0 rozwiązano. Z dokumentów nie wynika, jak to wpłynie na zbiory CPR. Dla producenta wyrobów budowlanych wynika z tego jedno zadanie na najbliższe miesiące: mieć własne, udokumentowane dane o energii i emisjach, zanim unijne zbiory staną się domyślną odpowiedzią na ich brak.

---

*Chcesz sprawdzić, jak unijne dane tła wpłyną na deklarację środowiskową Twojego wyrobu? Napisz do nas: biuro@multicert.pl*

*Fot. na okładce: [Dg-505, „High Voltage”](https://commons.wikimedia.org/wiki/File:High_Voltage_-_panoramio.jpg), Wikimedia Commons, licencja [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/deed.pl); kadr zmieniony.*
