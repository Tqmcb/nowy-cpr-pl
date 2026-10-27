---
title: "CPR i bazy danych środowiskowych: dobór danych, EPD i EF 4.0"
reviewed: "2026-10-27"
date: "2026-10-27"
author: "Redakcja NowyCPR.pl | Multicert Sp. z o.o."
category: "Środowisko i LCA"
tags: ["CPR 2024", "bazy danych LCA", "EF 4.0", "dane tła", "ecoinvent", "Sphera", "BAFU", "EPD", "EN 15804", "EU ETS"]
excerpt: "Wyjaśniamy, jak dobierać dane do deklaracji środowiskowej wyrobu budowlanego, co CPR przewiduje dla obliczeń i dlaczego przegląd baz EF nie jest listą baz zatwierdzonych do CPR."
image_url: /images/blog/cpr-bazy-danych-ef4-okladka.webp
template: "przewodnik"
sources:
  - Rozporządzenie (UE) 2024/3110 — pełny tekst (PL)|https://eur-lex.europa.eu/eli/reg/2024/3110/oj/pol
  - Plan prac Komisji na lata 2026–2029, COM(2025) 772 (EUR-Lex)|https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52025DC0772
  - Komisja Europejska — EU ETS: monitorowanie, raportowanie i weryfikacja|https://climate.ec.europa.eu/areas-action/carbon-markets/eu-emissions-trading-system-eu-ets/monitoring-reporting-and-verification_en
  - Data for EF methods — Green Forum, Komisja Europejska|https://green-forum.ec.europa.eu/green-business/environmental-footprint-methods/data-ef-methods_en
  - Transitional guidance on the limited availability of EF-compliant datasets — Green Forum, 14.07.2026|https://green-forum.ec.europa.eu/news/transitional-guidance-limited-availability-ef-compliant-datasets-2026-07-14_en
  - EF TAB, 17.04.2026 — prezentacja Komisji, przegląd baz danych|https://ec.europa.eu/transparency/expert-groups-register/core/api/front/document/130788/download
  - BAFU — Life cycle assessment i baza BAFU:20XY|https://www.bafu.admin.ch/en/life-cycle-assessment
  - BAFU:2025 — Terms of Use|https://nexus.openlca.org/ws/files/39051
  - ecoinvent — Sectors|https://support.ecoinvent.org/sectors
  - ecoinvent — About Licenses and Pricing|https://support.ecoinvent.org/licensing
  - Sphera — Managed LCA Database|https://sphera.com/solutions/product-stewardship/life-cycle-assessment-software-and-data/managed-lca-content/
  - Carbon Minds — cm.chemicals|https://www.carbon-minds.com/products/data/carbon-footprint-and-lca-data/
  - ADEME — AGRIBALYSE v3.2 Synthèse|https://data.ademe.fr/datasets/agribalyse-31-synthese
  - PKN — PN-EN 15804+A2:2020-03, tytuł i zakres normy|https://sklep.pkn.pl/normy/pn-en-15804-a2-2020-03p.html
  - EPD Polska|https://epd.org.pl/
  - EPD Portal — wyszukiwanie opublikowanych deklaracji|https://epdportal.org/
---

Wyobraźmy sobie zakład produkujący zaprawę murarską. Zużywa cement, kruszywo i dodatki chemiczne, które przywozi z różnych miejsc. Gotowy wyrób wysyła ciężarówkami do hurtowni, a w zakładzie pracują suszarnie, młyny i mieszalniki zasilane prądem i paliwem. Zakład zna swoje faktury i wskazania liczników. Nie wie natomiast, jaki wpływ na środowisko ma wytworzenie tony cementu u dostawcy, dostarczenie kilowatogodziny energii z sieci albo przejechanie stu kilometrów przez samochód ciężarowy. Takie informacje producent bierze z baz danych. Od tego, którą bazę i który proces wybierze, zależy wynik obliczeń.

Przy przygotowaniu deklaracji środowiskowej wyrobu (EPD) dane dobiera się zgodnie z zasadami analizy i programu. Program EPD określa zasady przygotowania, weryfikacji i publikacji deklaracji. Prowadzi go operator, który udostępnia te zasady. Komisja oceniła bazy pod kątem metod śladu środowiskowego. Taki przegląd nie jest listą baz dopuszczonych do obliczeń według rozporządzenia w sprawie wyrobów budowlanych (CPR). Poniżej wyjaśniamy zasady doboru danych i ich znaczenie dla producenta.

## Po co producentowi dane środowiskowe

Ocena cyklu życia (LCA) to obliczenie wpływu wyrobu na środowisko na wszystkich etapach objętych analizą, od pozyskania surowców po produkcję i dalsze etapy życia wyrobu. W EPD przedstawia się wyniki takich obliczeń dla konkretnego wyrobu w ustalonej formie.

CPR określa oceniane cechy wyrobu jako „zasadnicze charakterystyki”. Należą do nich również cechy środowiskowe wymienione w rozporządzeniu. Sposób ich oceny określają właściwe dokumenty. Zharmonizowane specyfikacje techniczne obejmują obowiązkowe normy dotyczące właściwości użytkowych oraz określone akty Komisji. Europejski dokument oceny służy natomiast do wydawania europejskich ocen technicznych, czyli ocen właściwości konkretnych wyrobów.

W [rozporządzeniu (UE) 2024/3110 w sprawie wyrobów budowlanych](https://eur-lex.europa.eu/eli/reg/2024/3110/oj/pol) (CPR) art. 15 ust. 2 stanowi, że deklaracja właściwości użytkowych i zgodności obejmuje właściwości użytkowe w zakresie zrównoważenia środowiskowego wyrobu w całym cyklu życia. Dotyczy to z góry ustalonych zasadniczych charakterystyk środowiskowych z załącznika II, i to tych, które w danym przypadku się deklaruje. Przepis przewiduje też, że oblicza się je przy użyciu oprogramowania udostępnionego bezpłatnie na stronie Komisji. Aktualizacje tego oprogramowania stają się obowiązkowe rok po publikacji; wcześniej można stosować je dobrowolnie. Które charakterystyki producent deklaruje, wynika ze zharmonizowanej specyfikacji technicznej lub europejskiego dokumentu oceny dla jego grupy wyrobów (art. 15 ust. 1). Obowiązki dla konkretnego wyrobu trzeba ustalić z uwzględnieniem przepisów przejściowych oraz właściwej specyfikacji technicznej lub dokumentu oceny.

Omawiane przepisy i wytyczne nie określają sposobu przenoszenia danych z poszczególnych baz lub z EPD do oprogramowania Komisji. Producent powinien sprawdzić wymagania tego narzędzia oraz specyfikacji swojego wyrobu. Kryteria opisane poniżej pomagają dobrać dane do analizy, ale nie stanowią potwierdzenia spełnienia obowiązków CPR.

## Dane zakładu i dane tła

Producent zbiera dane dotyczące własnego zakładu, a w miarę dostępności również dane od konkretnych dostawców. Dane tła opisują procesy poza działalnością zakładu, na przykład produkcję kupowanego surowca, dostarczanie energii lub transport. Często pochodzą z gotowych baz. Dane dotyczące konkretnego dostawcy mogą lepiej odzwierciedlać rzeczywisty proces niż średnia branżowa; ich wykorzystanie zależy od jakości informacji i zasad analizy.

Baza jest katalogiem wielu zbiorów danych. Pojedynczy zbiór może opisywać na przykład wytworzenie tony materiału albo dostarczenie kilowatogodziny energii. Właśnie taki opis konkretnego procesu wykorzystuje się w obliczeniach. [Komisja wyjaśnia zasady doboru danych dla metod śladu środowiskowego EF](https://green-forum.ec.europa.eu/green-business/environmental-footprint-methods/data-ef-methods_en), które omawiamy dalej. Dla EPD wyrobów budowlanych reguły wyboru i jakości danych określa [PN-EN 15804+A2:2020-03](https://sklep.pkn.pl/normy/pn-en-15804-a2-2020-03p.html) oraz właściwy program.

[Plan prac Komisji do CPR, COM(2025) 772](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52025DC0772), w części 3.2.2 zapowiada europejskie zbiory danych tła dla producentów. Mają być stosowane obowiązkowo tam, gdzie dane specyficzne dla przedsiębiorstwa nie są łatwo dostępne albo ich pozyskanie jest kosztowne. Do takich danych plan zalicza także dane wysokiej jakości z unijnego systemu handlu uprawnieniami do emisji (EU ETS) dla dużych instalacji. W tym systemie instalacja [monitoruje emisje gazów cieplarnianych](https://climate.ec.europa.eu/areas-action/carbon-markets/eu-emissions-trading-system-eu-ets/monitoring-reporting-and-verification_en) według zatwierdzonego planu, a roczny raport sprawdza akredytowany weryfikator. Raport opisuje emisje instalacji, a nie ślad środowiskowy wyrobu. Jak można go wykorzystać w obliczeniach, wyjaśniamy w artykule o [danych z systemu handlu emisjami](/blog/zbiory-danych-tla-dane-ets-slad-srodowiskowy-wyrobu).

Komisja chce, aby zbiory tła miały charakter „konserwatywny”. Wiąże to określenie z zapobieganiem doborowi danych tylko dlatego, że stawiają wyrób w najkorzystniejszym świetle. Plan nie podaje definicji tego określenia ani szczegółowej metody ustalania wartości. Jest to zapowiedź w komunikacie Komisji zawierającym plan prac, a nie wykaz zatwierdzonych baz. Z planu nie wynika, że któraś z baz opisanych niżej jest już uznana do celów CPR.

## Czym jest EF 4.0

EF to skrót od ang. Environmental Footprint, czyli ślad środowiskowy. Komisja używa tej nazwy dla metod opartych na LCA: PEF dla produktów (ślad środowiskowy produktu) i OEF dla organizacji (ślad środowiskowy organizacji). Metody te mają własne wymagania wobec danych. Zbiór zgodny z EF obejmuje wszystkie kategorie oddziaływania EF, spełnia wymagania modelowania i nazewnictwa oraz został poddany przeglądowi przez ekspertów. Stosuje też format ILCD, czyli format międzynarodowego systemu danych dotyczących cyklu życia.

Oznaczenia 2.0, 3.1 i 4.0 identyfikują kolejne wersje zbiorów EF. [Dyrekcja Generalna ds. Środowiska](https://green-forum.ec.europa.eu/green-business/environmental-footprint-methods/data-ef-methods_en) wskazuje, że EF 4.0 pozostaje w opracowaniu, a przewidywany termin to 2028 r. Jest to prognoza dotycząca zbiorów EF. Sama ta informacja nie wyznacza producentom terminu nowego obowiązku w CPR.

Ze względu na ograniczoną dostępność zbiorów zgodnych z EF Komisja opublikowała [wytyczne przejściowe](https://green-forum.ec.europa.eu/news/transitional-guidance-limited-availability-ef-compliant-datasets-2026-07-14_en). W badaniach PEF i OEF pozwalają one warunkowo korzystać ze zbiorów ILCD-EL, gdy brakuje odpowiednich zbiorów zgodnych z EF. ILCD-EL (ang. Entry Level, poziom początkowy) oznacza podstawowy poziom wymagań międzynarodowego systemu danych dotyczących cyklu życia; sam zapis pliku w formacie ILCD nie dowodzi spełnienia tych wymagań. Przy doborze danych trzeba uwzględnić reguły właściwe dla danej kategorii produktów lub sektora oraz wymagania dotyczące opisania ograniczeń w raporcie.

Wytyczne dotyczą jednak studiów PEF i OEF. Nie przenoszą się automatycznie na EPD sporządzaną według normy EN 15804 ani na obliczenia na potrzeby CPR. Wymagania dla EPD i obliczeń na potrzeby CPR trzeba sprawdzić odrębnie.

## Przegląd baz przedstawiony przez Komisję

W [prezentacji przedstawionej na posiedzeniu technicznej grupy doradczej ds. śladu środowiskowego (EF TAB)](https://ec.europa.eu/transparency/expert-groups-register/core/api/front/document/130788/download) z 17 kwietnia 2026 r. Komisja przedstawiła przegląd obejmujący wówczas 37 baz, w kontekście dostępności danych do metod EF. Kryteria obejmowały m.in. zakres branż i regionów, warunki dostępu, pokrycie kategorii oddziaływania, rok odniesienia i jakość danych. Wyższą punktację uzyskały: Sphera, ecoinvent, Carbon Minds, Agri-footprint 7.0, Agribalyse v3.2, GFLI v3.0, Plastics Europe Ecoprofiles 2024, BAFU:2025 i HiQLCD. Przegląd miał być uzupełniony wynikami ankiety.

Ocena przedstawiona w tej prezentacji nie stanowi zatwierdzenia całych baz do celów CPR ani EPD. Dla producenta wyrobu budowlanego znaczenie ma zakres konkretnego zbioru i warunki jego zastosowania. Poniżej zestawiono przykłady źródeł przydatnych w analizach materiałów i procesów związanych z wyrobami budowlanymi.

| Źródło / baza | Do jakich danych może być przydatna | Dostęp i warunki |
|---|---|---|
| [ecoinvent](https://support.ecoinvent.org/sectors) | Materiały, energia, transport i inne procesy | [Licencja komercyjna](https://support.ecoinvent.org/licensing); dodatkowe warunki przy integracji z narzędziami |
| [Sphera, Managed LCA Content](https://sphera.com/solutions/product-stewardship/life-cycle-assessment-software-and-data/managed-lca-content/) | Materiały budowlane i procesy przemysłowe | Zakres pakietu i warunki użycia ustala dostawca |
| [BAFU:2025](https://www.bafu.admin.ch/en/life-cycle-assessment) | M.in. energia, transport i materiały budowlane | Bezpłatnie na własnych [warunkach](https://nexus.openlca.org/ws/files/39051), z obowiązkiem podania źródła |
| [Carbon Minds, cm.chemicals](https://www.carbon-minds.com/products/data/carbon-footprint-and-lca-data/) | Chemikalia i tworzywa stosowane jako składniki | Zakres dostępu i prawa użycia ustala się z dostawcą |

[Warunki ecoinvent](https://support.ecoinvent.org/licensing) przewidują odrębną licencję przy włączaniu danych do narzędzia, także wewnętrznego. Udostępnianie danych osobom trzecim przez narzędzie wymaga dodatkowej umowy. Z kolei warunki BAFU:2025 ograniczają odsprzedaż danych i wymagają dokumentowania ich zmian.

Zakres branżowy również ma znaczenie. Na przykład [Agribalyse](https://data.ademe.fr/datasets/agribalyse-31-synthese) zawiera według ADEME wskaźniki dla produktów rolnych wytwarzanych we Francji i żywności konsumowanej we Francji. Obecność takiej bazy w przeglądzie Komisji nie oznacza, że będzie właściwym źródłem danych dla producenta zaprawy.

Bezpłatny dostęp nie oznacza automatycznie, że dane zostaną przyjęte w danej analizie. Tak samo płatna licencja nie przesądza o dopuszczeniu danych. Ocena techniczna bazy i zgodność z zasadami programu to sprawy niezależne od warunków licencji.

## Jak dobrać proces dla swojego wyrobu

Producent wybiera zbiór opisujący konkretny proces. Dla cementu w naszej zaprawie sprawdza się:

1. **Geografię.** Czy proces opisuje produkcję w Polsce, w Europie czy na świecie? Czy dostawca rzeczywiście jest stamtąd?
2. **Technologię.** Czy opisana technologia odpowiada tej, którą stosuje dostawca?
3. **Okres.** Jaki rok odniesienia podano w opisie procesu i której wersji bazy użyto? Nowa wersja bazy nie oznacza, że każdy proces opisuje nowszy rok. Przykład polskiego profilu energii elektrycznej z rokiem odniesienia 2012 w historycznym wykazie JRC dla EF 3.1 omawiamy w artykule o [unijnych danych tła i polskim miksie energii](/blog/unijne-dane-tla-cpr-polski-miks-energii).
4. **Jednostkę.** Czy proces odnosi się do kilograma, tony, metra sześciennego czy kilowatogodziny i czy przeliczenie jest poprawne?
5. **Kompletność.** Czy zbiór zawiera wszystkie wskaźniki wymagane przez metodę, czy tylko wpływ na klimat?
6. **Zasady docelowej analizy lub programu.** Czy metoda, norma lub program EPD dopuszczają ten rodzaj danych?

W dokumentacji zapisuje się nazwę bazy, jej wersję, wybrany proces, kraj, rok odniesienia i uzasadnienie wyboru. Podaje się też licencję albo warunki użytkowania bazy. Nie wybiera się procesu wyłącznie dlatego, że daje najniższą emisję CO₂. Dane powinny odpowiadać rzeczywistej produkcji i zasadom obliczeń.

## Rejestr EPD a baza procesów

Baza procesów, na przykład ecoinvent czy BAFU:2025, zawiera opisy pojedynczych procesów, takich jak wytworzenie energii, produkcja stali czy transport. Producent wykorzystuje je jako elementy własnych obliczeń. Rejestr EPD zawiera natomiast gotowe deklaracje innych wyrobów wraz z ich wynikami. Można w nim sprawdzić, jak opisano podobny wyrób, ale deklaracja innego producenta nie zastępuje danych o własnych procesach. Opublikowane EPD można znaleźć przez [wyszukiwarkę rejestrów EPD Portal](https://epdportal.org/), która odsyła do dokumentów źródłowych. Zasady przygotowania deklaracji w programie EPD Polska opisuje serwis [epd.org.pl](https://epd.org.pl/). Operatorem obu portali jest Multicert, wydawca NowyCPR.pl.

Przed zakupem licencji lub wyborem narzędzia warto ustalić, jakie zasady obliczeń dotyczą własnego wyrobu. Następnie warto określić brakujące dane i sprawdzić, czy wybrany zbiór je uzupełnia.
