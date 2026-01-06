// Product category data structure for CPR 2024 regulations

export interface ProductRequirement {
  id: string;
  title: string;
  description: string;
  mandatoryTests: string[];
  documentationRequired: string[];
  cprChanges: string[];
  certificationSystems: string[];
}

export interface ProductCategory {
  id: string;
  name: string;
  code: string;
  description: string;
  requirements: ProductRequirement;
}

// Basic placeholder requirements for categories without detailed information yet
const placeholderRequirements: ProductRequirement = {
  id: "placeholder-req",
  title: "Wymagania podstawowe",
  description: "Szczegółowe wymagania dla tej kategorii produktów są obecnie opracowywane. Skontaktuj się z Multicert, aby uzyskać szczegółowe informacje.",
  mandatoryTests: [
    "Badania wstępne typu",
    "Ocena zgodności z normami zharmonizowanymi",
    "Raportowanie środowiskowe (nowe z CPR 2024)"
  ],
  documentationRequired: [
    "Deklaracja właściwości użytkowych (DoP)",
    "Oznakowanie CE",
    "Dokumentacja zakładowej kontroli produkcji",
    "Cyfrowy paszport produktu (nowy z CPR 2024)"
  ],
  cprChanges: [
    "Cyfryzacja dokumentacji i oznaczeń",
    "Zwiększone wymagania środowiskowe",
    "Nowe systemy oceny i weryfikacji stałości właściwości użytkowych"
  ],
  certificationSystems: ["System 2+", "System 3"]
};

// Detailed requirements for plumbing products
const plumbingRequirement: ProductRequirement = {
  id: "plumbing-req",
  title: "Wymagania dla wyrobów instalacyjnych",
  description: "Wyroby instalacyjne, w tym rury, złączki, zawory, armatura sanitarna i inne elementy systemów instalacji wodno-kanalizacyjnych, muszą spełniać wymagania dotyczące szczelności, trwałości i bezpieczeństwa w kontakcie z wodą pitną. Rozporządzenie CPR 2024 wprowadza dodatkowe wymagania środowiskowe i zdrowotne.",
  mandatoryTests: [
    "Szczelność pod ciśnieniem wg EN ISO 1167, EN 12266",
    "Odporność na ciśnienie wewnętrzne wg EN ISO 1167, EN 13618",
    "Odporność na naprężenia wg EN ISO 6259, EN 12294",
    "Trwałość długoterminowa wg EN ISO 9080, EN 12201-2, EN 1401",
    "Zjawiska korozyjne/zgodność metalurgiczna wg EN 248, EN ISO 6509, EN 12502",
    "Odporność termiczna wg EN ISO 580, EN 1254-3",
    "Emisja substancji do wody pitnej wg EN 15664, EN 16421, EN 12873",
    "Wytrzymałość mechaniczna wg EN 12380, EN 13618, EN 1453",
    "Hałas hydrauliczny (dla armatury) wg EN ISO 3822",
    "Przepustowość i straty ciśnienia wg EN 12627, EN 1267"
  ],
  documentationRequired: [
    "Deklaracja właściwości użytkowych (DoP)",
    "Oznakowanie CE",
    "Dokumentacja zakładowej kontroli produkcji",
    "Raport z badań typu",
    "Certyfikat higieny/atesty PZH do kontaktu z wodą pitną",
    "Karta techniczna produktu",
    "Instrukcja montażu i eksploatacji",
    "Deklaracja środowiskowa produktu (EPD) wg EN 15804+A2",
    "Cyfrowy paszport produktu (wymagany od 2025 w ramach CPR 2024)",
    "Certyfikat systemu oceny dla wyrobów mających kontakt z wodą pitną (EAS)"
  ],
  cprChanges: [
    "Wprowadzenie obowiązkowego cyfrowego paszportu produktu",
    "Obowiązkowa ocena cyklu życia (LCA) i deklaracja środowiskowa produktu (EPD)",
    "Zharmonizowane europejskie standardy dla wyrobów kontaktujących się z wodą pitną (schemat EAS)",
    "Standardy dotyczące zawartości materiałów z recyklingu (min. 25% dla tworzyw sztucznych do 2030)",
    "Ograniczenie stosowania ołowiu i innych metali ciężkich w armaturze i rurociągach",
    "Nowe przepisy dotyczące mikroplastików uwalnianych z instalacji z tworzyw sztucznych",
    "Wymogi dotyczące oszczędności wody i efektywności energetycznej armatury",
    "Zaostrzenie testów migracji substancji z wyrobów kontaktujących się z wodą pitną"
  ],
  certificationSystems: ["System 1+", "System 3", "System 4" ]
};

// Detailed requirements for ceiling products
const ceilingRequirement: ProductRequirement = {
  id: "ceiling-req",
  title: "Wymagania dla sufitów podwieszanych",
  description: "Sufity podwieszane, panele sufitowe, konstrukcje nośne i systemy sufitowe muszą spełniać wymagania dotyczące bezpieczeństwa użytkowania, akustyki, odporności ogniowej i emisji substancji niebezpiecznych. Rozporządzenie CPR 2024 wprowadza dodatkowe wymagania środowiskowe i zdrowotne.",
  mandatoryTests: [
    "Odporność ogniowa wg EN 13501-1, EN 13501-2",
    "Odporność na uderzenia wg EN 13964, EN 13084",
    "Właściwości akustyczne (pochłanianie dźwięku) wg EN ISO 354, EN ISO 11654",
    "Izolacyjność akustyczna wg EN ISO 10140-2, EN ISO 717-1",
    "Emisja substancji niebezpiecznych wg EN 16516",
    "Wytrzymałość mechaniczna elementów wg EN 13964, EN 13964 załącznik D, F",
    "Odporność na wilgoć i ugięcie wg EN 13964 załącznik E",
    "Przewodnictwo cieplne wg EN 12667",
    "Odporność na korozję elementów metalowych wg EN ISO 9227",
    "Odbicie światła wg EN 410"
  ],
  documentationRequired: [
    "Deklaracja właściwości użytkowych (DoP)",
    "Oznakowanie CE",
    "Dokumentacja zakładowej kontroli produkcji",
    "Raport z badań typu",
    "Karta techniczna produktu",
    "Instrukcja montażu i konserwacji",
    "Raporty z badań ogniowych",
    "Deklaracja środowiskowa produktu (EPD) wg EN 15804+A2",
    "Cyfrowy paszport produktu (wymagany od 2025 w ramach CPR 2024)",
    "Certyfikaty jakości powietrza wewnętrznego (np. Eurofins, Indoor Air Comfort)"
  ],
  cprChanges: [
    "Wprowadzenie obowiązkowego cyfrowego paszportu produktu",
    "Obowiązkowa ocena cyklu życia (LCA) i deklaracja środowiskowa produktu (EPD)",
    "Zaostrzenie wymogów emisji lotnych związków organicznych (LZO)",
    "Standardy dotyczące zawartości materiałów z recyklingu (min. 20% do 2030)",
    "Wymogi dotyczące możliwości rozbioru systemu i recyclingu po zakończeniu użytkowania",
    "Nowe przepisy dotyczące bakterio- i grzybobójczych dodatków w panelach sufitowych",
    "Ograniczenia dla substancji wzbudzających szczególnie duże obawy (SVHC)",
    "Wymogi etykietowania dla zawartości materiałów biobased i pochodzących ze zrównoważonych źródeł"
  ],
  certificationSystems: ["System 1", "System 3", "System 4" ]
};

// Detailed requirements for steel products
const steelRequirement: ProductRequirement = {
  id: "steel-req",
  title: "Wymagania dla wyrobów stalowych",
  description: "Wyroby stalowe do zastoasowania w budownictwie, w tym elementy konstrukcyjne, zbrojeniowe, stalowe wyroby budowlane, elementy złączne i spawalnicze, muszą spełniać wymagania dotyczące właściwości mechanicznych, wykonania i trwałości. Rozporządzenie CPR 2024 wprowadza dodatkowe wymagania środowiskowe i certyfikacyjne.",
  mandatoryTests: [
    "Właściwości wytrzymałościowe (granica plastyczności, wytrzymałość na rozciąganie) wg EN ISO 6892-1",
    "Udarność wg EN ISO 148-1",
    "Spajalnąść wg EN ISO 15614 (seria)",
    "Ciągliwąść (wydłużenie przy zerwaniu) wg EN ISO 6892-1",
    "Analiza chemiczna wg EN 10204",
    "Odporność na korozję wg EN ISO 9227, EN ISO 12944-6",
    "Odporność ogniowa konstrukcji stalowych wg EN 13501-2",
    "Tolerancje wymiarowe wg EN 10051, EN 10056-2, EN 10034",
    "Badania nieniszczące (UT, MT, PT) wg EN ISO 17640, EN ISO 17638, EN ISO 3452",
    "Ocena spawów wg EN ISO 5817, EN ISO 10042"
  ],
  documentationRequired: [
    "Deklaracja właściwości użytkowych (DoP)",
    "Oznakowanie CE",
    "Certyfikat kontroli zgodny z EN 10204 (2.1, 2.2, 3.1 lub 3.2)",
    "Dokumentacja zakładowej kontroli produkcji",
    "Certyfikat stałości właściwości użytkowych",
    "Certyfikaty spawaczy i procedury spawalnicze (WPQR, WPS)",
    "Plan kontroli jakości",
    "Deklaracja środowiskowa produktu (EPD) wg EN 15804+A2",
    "Cyfrowy paszport produktu (wymagany od 2025 w ramach CPR 2024)",
    "Ślad węglowy dla wyrobów stalowych wg ISO 14067"
  ],
  cprChanges: [
    "Wprowadzenie obowiązkowego cyfrowego paszportu produktu",
    "Obowiązkowa ocena cyklu życia (LCA) i deklaracja środowiskowa produktu (EPD)",
    "Wymogi dotyczące śladu węglowego i raportowania emisji CO2",
    "Standardy produkcji stali niskoemisyjnej (zielona stal)",
    "Wymagania dotyczące recyklingu i zawartości złomu stalowego",
    "Ograniczenie stosowania powłok antykorozyjnych zawierających substancje niebezpieczne",
    "Zaostrzenie wymogów identyfikowalności materiałów (pełna ścieżka surowcowa)",
    "Normy dotyczące możliwości demontażu i ponownego wykorzystania elementów stalowych"
  ],
  certificationSystems: ["System 1+", "System 2+", "System 3" ]
};

// Detailed requirements for concrete and mortar products
const concreteMortarRequirement: ProductRequirement = {
  id: "concrete-mortar-req",
  title: "Wymagania dla betonów i zapraw",
  description: "Betony, zaprawy murarskie, tynkarskie i posadzkowe, jastrychy i domieszki do betonów muszą spełniać wymagania dotyczące wytrzymałości mechanicznej, trwałości, odporności na oddziaływanie środowiska i bezpieczeństwa. Rozporządzenie CPR 2024 wprowadza dodatkowe wymogi środowiskowe.",
  mandatoryTests: [
    "Wytrzymałość na ściskanie wg EN 12390-3 (beton), EN 1015-11 (zaprawy)",
    "Wytrzymałość na zginanie wg EN 12390-5 (beton), EN 1015-11 (zaprawy)",
    "Odporność na zamrażanie i rozmrażanie wg EN 12390-9, EN 1015-21",
    "Odporność na czynniki środowiskowe (karbonatyzacja, korozja) wg EN 13295, EN 1015-17",
    "Skład chemiczny betonu (zawartość chlorków) wg EN 196-2, EN 1015-17",
    "Wodoprzepuszczalność wg EN 12390-8, EN 1015-18",
    "Zawartość powietrza wg EN 12350-7, EN 1015-7",
    "Konsystencja mieszanki wg EN 12350-2, EN 1015-3",
    "Przyczepność wg EN 1542, EN 1015-12",
    "Emisja substancji niebezpiecznych wg EN 16516"
  ],
  documentationRequired: [
    "Deklaracja właściwości użytkowych (DoP)",
    "Oznakowanie CE",
    "Dokumentacja zakładowej kontroli produkcji",
    "Raport z badań typu",
    "Karta techniczna produktu",
    "Instrukcja stosowania i przechowywania",
    "Karta charakterystyki (dla domieszek chemicznych) zgodna z REACH",
    "Deklaracja środowiskowa produktu (EPD) wg EN 15804+A2",
    "Cyfrowy paszport produktu (wymagany od 2025 w ramach CPR 2024)",
    "Raporty z badań emisji substancji niebezpiecznych"
  ],
  cprChanges: [
    "Wprowadzenie obowiązkowego cyfrowego paszportu produktu",
    "Obowiązkowa ocena cyklu życia (LCA) i deklaracja środowiskowa produktu (EPD)",
    "Wymogi dotyczące zawartości materiałów z recyklingu (min. 15% do 2030)",
    "Ograniczenie stosowania cementów wysokoemisyjnych (CEM I)",
    "Wymogi dotyczące stosowania spoiw niskoemisyjnych i geopolimerów",
    "Standardy dotyczące zawartości węgla biogenicznego",
    "Zaostrzenie norm dotyczących emisji CO2 w procesie produkcji",
    "Ograniczenia stosowania domieszek i dodatków zawierających substancje niebezpieczne"
  ],
  certificationSystems: ["System 1+", "System 2+", "System 4" ]
};

// Detailed requirements for doors and windows
const doorsWindowsRequirement: ProductRequirement = {
  id: "doors-windows-req",
  title: "Wymagania dla drzwi i okien",
  description: "Drzwi, okna, bramy, żaluzje, rolety i inne wyroby otworowe muszą spełniać wymagania dotyczące izolacyjności termicznej, akustycznej, bezpieczeństwa użytkowania, wytrzymałości mechanicznej i odporności na włamanie. Rozporządzenie CPR 2024 wprowadza dodatkowe wymagania efektywności energetycznej.",
  mandatoryTests: [
    "Współczynnik przenikania ciepła wg EN ISO 10077-1, EN ISO 10077-2, EN ISO 12567",
    "Przepuszczalność powietrza wg EN 1026, EN 12207",
    "Wodoszczelność wg EN 1027, EN 12208",
    "Odporność na obciążenie wiatrem wg EN 12211, EN 12210",
    "Izolacyjność akustyczna wg EN ISO 10140, EN ISO 717-1",
    "Odporność na włamanie (dla wyrobów antywłamaniowych) wg EN 1627",
    "Siły operacyjne (dla drzwi z samozamykaczami) wg EN 12046, EN 12217",
    "Odporność ogniowa i dymoszczelność (dla drzwi przeciwpożarowych) wg EN 1634, EN 13501",
    "Trwałość mechaniczna wg EN 1191, EN 12400, EN 12605",
    "Właściwości promieniowania słonecznego (dla okien) wg EN 410"
  ],
  documentationRequired: [
    "Deklaracja właściwości użytkowych (DoP)",
    "Oznakowanie CE",
    "Etykieta energetyczna zgodna z dyrektywą 2010/30/UE",
    "Certyfikat stałości właściwości użytkowych",
    "Dokumentacja zakładowej kontroli produkcji",
    "Raport z badań typu",
    "Dokumentacja gwarancyjna i serwisowa",
    "Instrukcja montażu, obsługi i konserwacji",
    "Deklaracja środowiskowa produktu (EPD) wg EN 15804+A2",
    "Cyfrowy paszport produktu (wymagany od 2025 w ramach CPR 2024)"
  ],
  cprChanges: [
    "Zaostrzenie wymogów izolacyjności termicznej (docelowy Uw ≤ 0,8 W/m²K do 2030)",
    "Wprowadzenie obowiązkowego cyfrowego paszportu produktu",
    "Obowiązkowa ocena cyklu życia (LCA) i deklaracja środowiskowa produktu (EPD)",
    "Wymogi dotyczące możliwości naprawy i wymiany komponentów",
    "Standardy dotyczące trwałości i gwarancji (min. 10 lat)",
    "Wytyczne dla zrównoważonego pozyskiwania surowców i możliwości recyklingu",
    "Ograniczenia stosowania substancji niebezpiecznych w uszczelkach i okuciach",
    "Nowe wymogi dla systemu zarządzania środowiskowego w procesie produkcji"
  ],
  certificationSystems: ["System 1", "System 3", "System 4" ]
};

// Detailed requirements for road construction products
const roadConstructionRequirement: ProductRequirement = {
  id: "road-construction-req",
  title: "Wymagania dla wyrobów do budowy dróg",
  description: "Wyroby stosowane w budowie dróg, w tym mieszanki mineralno-asfaltowe, kruszywa drogowe, materiały do oznakowania dróg, bariery drogowe i elementy odwodnienia, muszą spełniać wymagania dotyczące trwałości, bezpieczeństwa, odporności na czynniki środowiskowe i efektywności. Rozporządzenie CPR 2024 wprowadza dodatkowe wymagania środowiskowe.",
  mandatoryTests: [
    "Właściwości fizyczne mieszanek mineralno-asfaltowych wg EN 12697 (seria)",
    "Odporność na deformacje trwałe wg EN 12697-22, EN 12697-25",
    "Odporność na spękania i zmęczenie wg EN 12697-24, EN 12697-44",
    "Właściwości kruszywa wg EN 13043, EN 13242",
    "Odporność na działanie mrozu wg EN 1367-1",
    "Współczynnik luminancji i trwałość oznakowania wg EN 1436",
    "Odporność na uderzenie i obciążenia dla barier ochronnych wg EN 1317",
    "Właściwości hydrauliczne elementów odwodnienia wg EN 1433",
    "Badania zmian klimatycznych wg EN 12607-1, EN 12607-2, EN 12607-3",
    "Emisja substancji niebezpiecznych wg EN 16516"
  ],
  documentationRequired: [
    "Deklaracja właściwości użytkowych (DoP)",
    "Oznakowanie CE",
    "Certyfikat stałości właściwości użytkowych",
    "Dokumentacja zakładowej kontroli produkcji",
    "Raport z badań typu",
    "Karta techniczna produktu",
    "Dokumentacja gwarancyjna",
    "Deklaracja środowiskowa produktu (EPD) wg EN 15804+A2",
    "Cyfrowy paszport produktu (wymagany od 2025 w ramach CPR 2024)",
    "Plan jakości dla kontraktu drogowego"
  ],
  cprChanges: [
    "Wprowadzenie obowiązkowego cyfrowego paszportu produktu",
    "Obowiązkowa ocena cyklu życia (LCA) i deklaracja środowiskowa produktu (EPD)",
    "Wymogi redukcji emisji CO2 w procesie produkcji mieszanek asfaltowych",
    "Promowanie asfaltów niskotemperaturowych i na zimno",
    "Standardy dotyczące stosowania materiałów z recyklingu (w tym destruktu asfaltowego)",
    "Nowe wymagania dotyczące odporności na ekstremalne warunki klimatyczne",
    "Zaostrzenie norm dotyczących emisji lotnych związków organicznych (LZO)",
    "Wymogi dotyczące przepuszczalności wody dla nawierzchni (retencja i gospodarka wodną)"
  ],
  certificationSystems: ["System 2+", "System 3", "System 4" ]
};

// Detailed requirements for flooring products
const flooringRequirement: ProductRequirement = {
  id: "flooring-req",
  title: "Wymagania dla wyrobów podłogowych",
  description: "Wyroby podłogowe, w tym panele laminowane, podłogi drewniane, płytki ceramiczne, wykładziny, podłogi winylowe (LVT/SPC) i linoleum, muszą spełniać wymagania dotyczące trwałości, bezpieczeństwa użytkowania, odporności ogniowej oraz wpływu na środowisko. Rozporządzenie CPR 2024 wprowadza dodatkowe wymagania zdrowotne i środowiskowe.",
  mandatoryTests: [
    "Odporność na ścieranie wg EN 13329 (dla laminatów), EN 660 (dla podłóg elastycznych)",
    "Odporność na poślizg wg EN 13893",
    "Odporność ogniowa wg EN 13501-1",
    "Emisja substancji niebezpiecznych wg EN 16516",
    "Przewodnictwo cieplne wg EN ISO 10456 (dla ogrzewania podłogowego)",
    "Odporność na zaplamienie i substancje chemiczne wg EN 13442, EN 423",
    "Stabilność wymiarowa wg EN 434, EN 669",
    "Odporność na wgniecenie wg EN 433",
    "Tłumienie dźwięków wg EN ISO 10140, EN ISO 717-2",
    "Wodoszczelność wg EN 13553 (dla podłóg wodoodpornych)"
  ],
  documentationRequired: [
    "Deklaracja właściwości użytkowych (DoP)",
    "Oznakowanie CE",
    "Certyfikat stałości właściwości użytkowych",
    "Dokumentacja zakładowej kontroli produkcji",
    "Raport z badań typu",
    "Karta techniczna produktu",
    "Instrukcja montażu i konserwacji",
    "Deklaracja środowiskowa produktu (EPD) wg EN 15804+A2",
    "Cyfrowy paszport produktu (wymagany od 2025 w ramach CPR 2024)",
    "Klasyfikacja użytkowa wg EN ISO 10874 (dawniej EN 685)"
  ],
  cprChanges: [
    "Wprowadzenie obowiązkowego cyfrowego paszportu produktu",
    "Obowiązkowa ocena cyklu życia (LCA) i deklaracja środowiskowa produktu (EPD)",
    "Zaostrzenie wymogów emisji lotnych związków organicznych (LZO) i formaldehydu",
    "Ograniczenia dla stosowania ftalanowów w podłogach elastycznych",
    "Wymogi dotyczące zawartości materiałów z recyklingu",
    "Obowiązkowe informacje o możliwości recyklingu po zakończeniu cyklu życia",
    "Nowe regulacje dotyczące substancji PFAS i mikroplastików w podłogach",
    "Specjalne wymagania higieniczne dla podłóg w obiektach publicznych"
  ],
  certificationSystems: ["System 1", "System 3", "System 4" ]
};

// Detailed requirements for structural timber products
const structuralTimberRequirement: ProductRequirement = {
  id: "structural-timber-req",
  title: "Wymagania dla wyrobów konstrukcyjnych z drewna",
  description: "Wyroby konstrukcyjne z drewna, w tym drewno konstrukcyjne lite, drewno klejone warstwowo (GLT, CLT), LVL, belki dwuteowe i inne elementy z drewna konstrukcyjnego, muszą spełniać wymagania dotyczące wytrzymałości, trwałości, odporności ogniowej oraz bezpieczeństwa. Rozporządzenie CPR 2024 wprowadza dodatkowe wymagania środowiskowe i dotyczące zrównoważonego rozwoju.",
  mandatoryTests: [
    "Klasyfikacja wytrzymałościowa drewna wg EN 14081-1 (dla drewna litego)",
    "Wytrzymałość na zginanie i moduł sprężystości wg EN 408",
    "Odporność ogniowa wg EN 13501-1, EN 13501-2",
    "Badania połączeń klejowych wg EN 14080 (dla drewna klejonego)",
    "Trwałość naturalna wg EN 350",
    "Impregnacja ochronna wg EN 351-1 (gdy wymagana)",
    "Wilgotność materiału wg EN 13183-1, EN 13183-2",
    "Wymiary i tolerancje wg EN 336 (dla drewna litego)",
    "Emisja formaldehydu wg EN 717-1 (dla wyrobów klejonych)",
    "Odporność na działanie mikroorganizmów wg EN 335"
  ],
  documentationRequired: [
    "Deklaracja właściwości użytkowych (DoP)",
    "Oznakowanie CE",
    "Certyfikat stałości właściwości użytkowych",
    "Dokumentacja zakładowej kontroli produkcji",
    "Raport z badań typu",
    "Karta techniczna produktu",
    "Dokumentacja obliczeń konstrukcyjnych",
    "Deklaracja środowiskowa produktu (EPD) wg EN 15804+A2",
    "Cyfrowy paszport produktu (wymagany od 2025 w ramach CPR 2024)",
    "Certyfikat legalnego pochodzenia drewna (PEFC, FSC lub równoważny)"
  ],
  cprChanges: [
    "Wprowadzenie obowiązkowego cyfrowego paszportu produktu",
    "Obowiązkowa ocena cyklu życia (LCA) i deklaracja środowiskowa produktu (EPD)",
    "Obowiązkowa certyfikacja zrównoważonego gospodarowania leśnego (PEFC, FSC)",
    "Nowe wymagania dotyczące trwałości konstrukcyjnej w kontekście zmian klimatu",
    "Nowe wymagania dla środków ochrony drewna (ograniczenie substancji biobójczych)",
    "Wymogi śladowania węglowego i sekwestracji węgla w wyrobach drewnianych",
    "Wymogi dotyczące przystosowania do ponownego użycia po zakończeniu cyklu życia",
    "Specjalne oznaczenia dla drewna pozyskiwanego lokalnie (w odległości < 500 km)"
  ],
  certificationSystems: ["System 1", "System 2+" ]
};

// Detailed requirements for wood-based panels
const woodPanelsRequirement: ProductRequirement = {
  id: "wood-panels-req",
  title: "Wymagania dla płyt drewnopochodnych",
  description: "Płyty drewnopochodne, w tym sklejka, płyty OSB, płyty wiórowe, płyty MDF/HDF i inne płyty lignocelulozowe, muszą spełniać wymagania dotyczące wytrzymałości, trwałości, odporności ogniowej oraz bezpieczeństwa (emisje). Rozporządzenie CPR 2024 wprowadza dodatkowe wymagania środowiskowe i zdrowotne.",
  mandatoryTests: [
    "Wytrzymałość na zginanie i moduł sprężystości wg EN 310",
    "Odporność ogniowa wg EN 13501-1",
    "Emisja formaldehydu wg EN 717-1 oraz EN 16516",
    "Wytrzymałość przy rozciąganiu prostopadłym do płaszczyzn płyty wg EN 319",
    "Spęcznienie po moczeniu w wodzie wg EN 317",
    "Odporność na wilgoć wg EN 321 (dla płyt typu P3, P5, P7)",
    "Odporność na działanie mikroorganizmów wg EN ISO 846 (dla zastosowań zewnętrznych)",
    "Gęstość wg EN 323",
    "Stabilność wymiarowa wg EN 318",
    "Zawartość pentachlorofenolu (PCP) wg CEN/TR 14823"
  ],
  documentationRequired: [
    "Deklaracja właściwości użytkowych (DoP)",
    "Oznakowanie CE",
    "Certyfikat stałości właściwości użytkowych",
    "Dokumentacja zakładowej kontroli produkcji",
    "Raport z badań typu",
    "Karta techniczna produktu",
    "Klasyfikacja emisji formaldehydu (E1, E0.5, E0, NAF)",
    "Deklaracja środowiskowa produktu (EPD) wg EN 15804+A2",
    "Cyfrowy paszport produktu (wymagany od 2025 w ramach CPR 2024)",
    "Certyfikat legalnego pochodzenia drewna (PEFC, FSC lub równoważny)"
  ],
  cprChanges: [
    "Wprowadzenie obowiązkowego cyfrowego paszportu produktu",
    "Obowiązkowa ocena cyklu życia (LCA) i deklaracja środowiskowa produktu (EPD)",
    "Dalsze zaostrzenie wymogów dotyczących emisji formaldehydu (klasa emisji E0 lub NAF)",
    "Wymogi dotyczące zrównoważonego pozyskiwania drewna (obowiązkowa certyfikacja)",
    "Standardy dotyczące zawartości materiałów z recyklingu (min. 30% do 2030 r.)",
    "Obowiązkowe informacje o możliwości recyklingu po zakończeniu cyklu życia",
    "Ograniczenia stosowania żywic na bazie formaldehydu (perspektywa 2030)",
    "Wymogi śladowania węglowego i sekwestracji węgla w wyrobach drewnopochodnych"
  ],
  certificationSystems: ["System 1", "System 2+" ]
};

// Detailed requirements for thermal insulation products
const thermalInsulationRequirement: ProductRequirement = {
  id: "thermal-insulation-req",
  title: "Wymagania dla wyrobów do izolacji cieplnej",
  description: "Wyroby do izolacji cieplnej budynków, w tym wełna mineralna, styropian, poliuretan, pianki fenolowe, wełna drzewna i materiały pochodzenia naturalnego, muszą spełniać wymagania dotyczące izolacyjności cieplnej, odporności ogniowej, trwałości i odporności na czynniki biologiczne. Rozporządzenie CPR 2024 wprowadza dodatkowe wymagania środowiskowe i bezpieczeństwa.",
  mandatoryTests: [
    "Współczynnik przewodzenia ciepła λ wg EN 12667, EN 12939",
    "Odporność ogniowa wg EN 13501-1",
    "Nasiąkliwość wodą wg EN 1609, EN 12087",
    "Wytrzymałość na ściskanie wg EN 826",
    "Stabilność wymiarowa wg EN 1604",
    "Oporność cieplna długotrwała wg EN 12667, EN 12939",
    "Napięcie ściskające lub wytrzymałość na zginanie wg EN 826, EN 12089",
    "Odporność na działanie mikroorganizmów wg EN ISO 846",
    "Przepuszczalność pary wodnej wg EN 12086",
    "Emisja substancji niebezpiecznych wg EN 16516 (szczególnie formaldehyd i LZO)"
  ],
  documentationRequired: [
    "Deklaracja właściwości użytkowych (DoP)",
    "Oznakowanie CE",
    "Certyfikat stałości właściwości użytkowych",
    "Dokumentacja zakładowej kontroli produkcji",
    "Raport z badań typu",
    "Karta techniczna produktu",
    "Instrukcja montażu i stosowania",
    "Deklaracja środowiskowa produktu (EPD) wg EN 15804+A2",
    "Cyfrowy paszport produktu (wymagany od 2025 w ramach CPR 2024)",
    "Karta charakterystyki wg rozporządzenia REACH (dla produktów zawierających substancje niebezpieczne)"
  ],
  cprChanges: [
    "Wprowadzenie obowiązkowego cyfrowego paszportu produktu",
    "Obowiązkowa ocena cyklu życia (LCA) i deklaracja środowiskowa produktu (EPD)",
    "Zaostrzenie wymogów dotyczących emisji formaldehydów i innych LZO",
    "Nowe wymagania dotyczące bezhalogenowych środków ognioodpornych",
    "Standardy dotyczące zawartości materiałów z recyklingu lub pochodzenia naturalnego",
    "Obowiązkowe informacje o możliwości recyklingu po zakończeniu cyklu życia",
    "Wymogi minimalnej efektywności cieplnej dla różnych stref klimatycznych",
    "Ograniczenia dla stosowania pochodnych ropy naftowej w izolacjach (perspektywa 2030)"
  ],
  certificationSystems: ["System 1", "System 3" ]
};

// Detailed requirements for membranes and geosynthetic barriers
const membranesRequirement: ProductRequirement = {
  id: "membranes-req",
  title: "Wymagania dla membran i barier geosyntetycznych",
  description: "Membrany hydroizolacyjne, paroszczelne i bariery geosyntetyczne, w tym izolacje przeciwwodne, przeciwwilgociowe i przeciwgazowe, muszą spełniać wymagania dotyczące szczelności, trwałości, odporności chemicznej i mechanicznej. Rozporządzenie CPR 2024 wprowadza dodatkowe wymagania środowiskowe.",
  mandatoryTests: [
    "Wodoszczelność wg EN 1928 (dla hydroizolacji)",
    "Wodochłonność wg EN 1849-1,2",
    "Odporność na rozdzieranie wg EN 12310-1,2",
    "Wytrzymałość na rozciąganie wg EN 12311-1,2",
    "Elastyczność w niskiej temperaturze wg EN 1109 (dla materiałów bitumicznych)",
    "Przepuszczalność pary wodnej wg EN 1931",
    "Odporność na starzenie UV wg EN 1297",
    "Odporność na działanie ozonu wg EN 1844 (dla membran EPDM)",
    "Odporność na przerastanie korzeni wg EN 13948 (dla hydroizolacji dachów zielonych)",
    "Ocena cyklu życia (LCA) zgodnie z EN 15804+A2 (nowy wymóg CPR 2024)"
  ],
  documentationRequired: [
    "Deklaracja właściwości użytkowych (DoP)",
    "Oznakowanie CE",
    "Certyfikat stałości właściwości użytkowych",
    "Dokumentacja zakładowej kontroli produkcji",
    "Raport z badań typu",
    "Karta techniczna produktu",
    "Instrukcja układania i łączenia",
    "Deklaracja środowiskowa produktu (EPD) wg EN 15804+A2",
    "Cyfrowy paszport produktu (wymagany od 2025 w ramach CPR 2024)",
    "Karta charakterystyki wg rozporządzenia REACH"
  ],
  cprChanges: [
    "Wprowadzenie obowiązkowego cyfrowego paszportu produktu",
    "Obowiązkowa ocena cyklu życia (LCA) i deklaracja środowiskowa produktu (EPD)",
    "Limit emisji lotnych związków organicznych (LZO) podczas produkcji i instalacji",
    "Nowe wymagania dotyczące bezhalogenowych składników ognioodpornych",
    "Wymogi dotyczące minimalizacji mikroplastików i substancji PFAS",
    "Standardy dotyczące możliwości recyklingu i biodegradowalności",
    "Obowiązkowe testy wymywania substancji szkodliwych",
    "Nowe wymagania dla materiałów stosowanych w kontakcie z wodą pitną"
  ],
  certificationSystems: ["System 1+", "System 2+", "System 3" ]
};

// Detailed requirements for precast concrete products
const precastConcreteRequirement: ProductRequirement = {
  id: "precast-concrete-req",
  title: "Wymagania dla prefabrykatów betonowych",
  description: "Prefabrykaty betonowe, żelbetowe i sprężone, w tym elementy konstrukcyjne, płyty, ściany, schody i elementy infrastruktury, muszą spełniać wymagania dotyczące wytrzymałości, trwałości, odporności ogniowej oraz bezpieczeństwa użytkowania. Rozporządzenie CPR 2024 wprowadza dodatkowe wymagania środowiskowe.",
  mandatoryTests: [
    "Wytrzymałość na ściskanie betonu wg EN 12390-3",
    "Wytrzymałość na rozciąganie stali zbrojeniowej wg EN ISO 15630",
    "Odporność ogniowa wg EN 13501-2 (dla elementów konstrukcyjnych)",
    "Geometria i tolerancje wymiarowe wg EN 13369",
    "Naprężenie w elementach sprężonych wg EN 13369",
    "Trwałość - odporność na korozję stali wg EN 13369",
    "Nasiąkliwość i mrozoodporność wg EN 13369",
    "Odporność na ścieranie wg EN 13369 (dla elementów nawierzchniowych)",
    "Odporność chemiczna wg EN 13369",
    "Ocena cyklu życia (LCA) zgodnie z EN 15804+A2 (nowy wymóg CPR 2024)"
  ],
  documentationRequired: [
    "Deklaracja właściwości użytkowych (DoP)",
    "Oznakowanie CE",
    "Certyfikat stałości właściwości użytkowych",
    "Dokumentacja zakładowej kontroli produkcji",
    "Raport z badań typu",
    "Dokumentacja obliczeń konstrukcyjnych",
    "Karta techniczna produktu",
    "Deklaracja środowiskowa produktu (EPD) wg EN 15804+A2",
    "Cyfrowy paszport produktu (wymagany od 2025 w ramach CPR 2024)",
    "Instrukcje transportu, składowania i montażu"
  ],
  cprChanges: [
    "Wprowadzenie obowiązkowego cyfrowego paszportu produktu",
    "Obowiązkowa ocena cyklu życia (LCA) i deklaracja środowiskowa produktu (EPD)",
    "Wymogi dotyczące minimalnej zawartości materiałów z recyklingu",
    "Raportowanie śladu węglowego w całym cyklu produkcyjnym",
    "Limity zawartości cementów wysokoemisyjnych",
    "Nowe standardy dotyczące wykorzystania kruszywa z recyklingu",
    "Odporność na ekstremalne warunki pogodowe (związane ze zmianą klimatu)",
    "Wymogi dotyczące zużycia wody w procesie produkcji"
  ],
  certificationSystems: ["System 1+", "System 2+" ]
};

// Detailed requirements for masonry units
const masonryRequirement: ProductRequirement = {
  id: "masonry-req",
  title: "Wymagania dla elementów murowych",
  description: "Elementy murowe i produkty pokrewne, w tym cegły, bloczki, pustaki oraz elementy z kamienia naturalnego, muszą spełniać wymagania dotyczące wytrzymałości, trwałości, izolacyjności i bezpieczeństwa. Rozporządzenie CPR 2024 wprowadza nowe wymagania środowiskowe.",
  mandatoryTests: [
    "Wytrzymałość na ściskanie wg EN 772-1",
    "Gęstość i gęstość brutto wg EN 772-13",
    "Wymiary i odchylenia wymiarowe wg EN 772-16, EN 772-20",
    "Zawartość aktywnych soli rozpuszczalnych wg EN 772-5",
    "Absorpcja wody wg EN 772-21 (dla elementów ceramicznych), EN 772-11 (dla elementów betonowych)",
    "Odporność na zamrażanie/rozmrażanie wg EN 772-22",
    "Izolacyjność termiczna wg EN 1745",
    "Reakcja na ogień wg EN 13501-1",
    "Przepuszczalność pary wodnej wg EN 1745",
    "Ocena cyklu życia (LCA) zgodnie z EN 15804+A2 (nowy wymóg CPR 2024)"
  ],
  documentationRequired: [
    "Deklaracja właściwości użytkowych (DoP)",
    "Oznakowanie CE",
    "Certyfikat stałości właściwości użytkowych",
    "Dokumentacja zakładowej kontroli produkcji",
    "Raport z badań typu",
    "Karta techniczna produktu",
    "Deklaracja środowiskowa produktu (EPD) wg EN 15804+A2",
    "Cyfrowy paszport produktu (wymagany od 2025 w ramach CPR 2024)",
    "Informacja o zawartości substancji niebezpiecznych",
    "Procedura utylizacji, ponownego użycia lub recyklingu"
  ],
  cprChanges: [
    "Wprowadzenie obowiązkowego cyfrowego paszportu produktu",
    "Obowiązkowa ocena cyklu życia (LCA) i deklaracja środowiskowa produktu (EPD)",
    "Nowe standardy dotyczące recyklingu i ponownego użycia elementów murowych",
    "Limity emisji CO2 podczas produkcji",
    "Wymogi dotyczące współczynnika przewodzenia ciepła (lambda)",
    "Ograniczenie zawartości pierwiastków promieniotwórczych",
    "Wymogi dotyczące zrównoważonego pozyskiwania surowców",
    "Obowiązkowe raportowanie zużycia energii w procesie produkcji"
  ],
  certificationSystems: ["System 2+", "System 4" ]
};

// Detailed requirements for glass products
// Detailed requirements for doors and windows
// Detailed requirements for insulation materials
// Detailed requirements for roofing products
// Detailed requirements for construction adhesives
// Detailed requirements for structural timber products
// Detailed requirements for cement and building limes
// Detailed requirements for concrete products
// Detailed requirements for steel products
// Detailed requirements for asphalt/bituminous products
// Detailed requirements for clay/ceramic products
// Detailed requirements for glass products
const glassRequirement: ProductRequirement = {
  id: "glass-req",
  title: "Wymagania dla wyrobów szklanych",
  description: "Wyroby szklane dla budownictwa, w tym szyby zespolone, szkło hartowane, szkło laminowane i szkło float, muszą spełniać wymagania dotyczące wytrzymałości, bezpieczeństwa, izolacyjności termicznej i akustycznej. Rozporządzenie CPR 2024 wprowadza dodatkowe wymagania środowiskowe.",
  mandatoryTests: [
    "Wytrzymałość mechaniczna wg EN 1288 (dla szkła)",
    "Odporność na uderzenie wg EN 12600 (dla szkła bezpiecznego)",
    "Izolacyjność termiczna wg EN 673 (współczynnik U)",
    "Izolacyjność akustyczna wg EN ISO 10140",
    "Przepuszczalność światła i promieniowania słonecznego wg EN 410",
    "Odporność na ogień wg EN 13501-1 i EN 13501-2",
    "Wodoszczelność wg EN 1027 (dla zespoleń okiennych)",
    "Trwałość wg EN 1096-2 (dla szkła powlekanego)",
    "Emisja substancji niebezpiecznych wg rozporządzenia REACH",
    "Ocena cyklu życia (LCA) zgodnie z EN 15804+A2 (nowy wymóg CPR 2024)"
  ],
  documentationRequired: [
    "Deklaracja właściwości użytkowych (DoP)",
    "Oznakowanie CE",
    "Certyfikat stałości właściwości użytkowych",
    "Dokumentacja zakładowej kontroli produkcji",
    "Raport z badań typu",
    "Karta techniczna produktu",
    "Deklaracja środowiskowa produktu (EPD) wg EN 15804+A2",
    "Cyfrowy paszport produktu (wymagany od 2025 w ramach CPR 2024)",
    "Instrukcja montażu, użytkowania i konserwacji",
    "Raport emisji w procesie produkcji"
  ],
  cprChanges: [
    "Wprowadzenie obowiązkowego cyfrowego paszportu produktu",
    "Obowiązkowa ocena cyklu życia (LCA) i deklaracja środowiskowa produktu (EPD)",
    "Zaostrzone wymagania dla szkła bezpiecznego w zastosowaniach publicznych",
    "Nowe standardy dotyczące recyklingu odpadów szklanych",
    "Wymogi dotyczące minimalnej energooszczędności (współczynnik U)",
    "Limity emisji CO2 podczas produkcji",
    "Wymogi dotyczące inteligentnego szkła (np. fotochromowego, termochromowego)",
    "Obowiązkowe oznaczenia dot. rozprysku przy pęknięciu"
  ],
  certificationSystems: ["System 1", "System 3", "System 4" ]
};

// Detailed requirements for gypsum products
const gypsumRequirement: ProductRequirement = {
  id: "gypsum-req",
  title: "Wymagania dla wyrobów gipsowych",
  description: "Wyroby gipsowe dla budownictwa, w tym płyty gipsowo-kartonowe, tynki gipsowe i elementy sufitowe, muszą spełniać wymagania dotyczące wytrzymałości, odporności ogniowej, izolacyjności akustycznej oraz bezpieczeństwa. Rozporządzenie CPR 2024 wprowadza dodatkowe wymagania środowiskowe.",
  mandatoryTests: [
    "Wytrzymałość na zginanie wg EN 520 (dla płyt g-k)",
    "Reakcja na ogień wg EN 13501-1",
    "Odporność ogniowa wg EN 13501-2 (dla systemów przeciwpożarowych)",
    "Izolacyjność akustyczna wg EN ISO 10140",
    "Współczynnik przewodzenia ciepła wg EN 12664",
    "Odporność na uderzenia wg EN 1128 (dla płyt g-k)",
    "Poziom pH i zawartość substancji niebezpiecznych wg EN 13279-1 (dla tynków)",
    "Emisja substancji niebezpiecznych wg rozporządzenia REACH",
    "Odporność na działanie wilgoci wg EN ISO 12572",
    "Ocena cyklu życia (LCA) zgodnie z EN 15804+A2 (nowy wymóg CPR 2024)"
  ],
  documentationRequired: [
    "Deklaracja właściwości użytkowych (DoP)",
    "Oznakowanie CE",
    "Certyfikat stałości właściwości użytkowych",
    "Dokumentacja zakładowej kontroli produkcji",
    "Raport z badań typu",
    "Karta techniczna produktu",
    "Deklaracja środowiskowa produktu (EPD) wg EN 15804+A2",
    "Cyfrowy paszport produktu (wymagany od 2025 w ramach CPR 2024)",
    "Instrukcja montażu i użytkowania",
    "Karta charakterystyki wg rozporządzenia REACH"
  ],
  cprChanges: [
    "Wprowadzenie obowiązkowego cyfrowego paszportu produktu",
    "Obowiązkowa ocena cyklu życia (LCA) i deklaracja środowiskowa produktu (EPD)",
    "Zaostrzone wymagania dotyczące odporności ogniowej systemów gipsowych",
    "Nowe standardy dotyczące recyklingu odpadów gipsowych",
    "Wymogi dotyczące minimalnego udziału gipsu z recyklingu",
    "Limity emisji podczas produkcji i stosowania",
    "Minimalne wymagania odnośnie jakości powietrza wewnętrznego",
    "Obowiązkowe informacje o możliwości recyklingu i ponownego użycia"
  ],
  certificationSystems: ["System 3", "System 4" ]
};

const ceramicRequirement: ProductRequirement = {
  id: "ceramic-req",
  title: "Wymagania dla wyrobów ceramicznych",
  description: "Wyroby ceramiczne dla budownictwa, w tym ceramika budowlana, cegły, dachówki i płytki ceramiczne, muszą spełniać wymagania dotyczące wytrzymałości, trwałości, mrozoodporności oraz izolacyjności. Rozporządzenie CPR 2024 wprowadza dodatkowe wymagania środowiskowe.",
  mandatoryTests: [
    "Wytrzymałość na ściskanie wg EN 772-1 (dla cegieł)",
    "Odporność na zamrażanie/rozmrażanie wg EN 772-22 (dla wyrobów zewnętrznych)",
    "Nasiąkliwość wg EN 772-21 (dla cegieł), EN 539-2 (dla dachówek)",
    "Rozszerzalność pod wpływem wilgoci wg EN 772-19",
    "Reakcja na ogień wg EN 13501-1",
    "Odporność na poślizg/poślizgnięcie wg EN 1339 (dla płytek)",
    "Współczynnik przewodzenia ciepła wg EN 1745",
    "Odporność na ścieranie wg EN ISO 10545-6 (dla płytek)",
    "Izolacyjność akustyczna wg EN ISO 10140",
    "Emisja substancji niebezpiecznych wg rozporządzenia REACH",
    "Ocena cyklu życia (LCA) zgodnie z EN 15804+A2 (nowy wymóg CPR 2024)"
  ],
  documentationRequired: [
    "Deklaracja właściwości użytkowych (DoP)",
    "Oznakowanie CE",
    "Certyfikat stałości właściwości użytkowych",
    "Dokumentacja zakładowej kontroli produkcji",
    "Raport z badań typu",
    "Karta techniczna produktu",
    "Deklaracja środowiskowa produktu (EPD) wg EN 15804+A2",
    "Cyfrowy paszport produktu (wymagany od 2025 w ramach CPR 2024)",
    "Instrukcja montażu i użytkowania",
    "Raport emisji w procesie produkcji i wypalania"
  ],
  cprChanges: [
    "Wprowadzenie obowiązkowego cyfrowego paszportu produktu",
    "Obowiązkowa ocena cyklu życia (LCA) i deklaracja środowiskowa produktu (EPD)",
    "Wymogi dotyczące raportowania zużycia energii podczas procesu wypalania",
    "Limity emisji CO2 podczas produkcji",
    "Nowe standardy dotyczące recyklingu odpadów ceramicznych",
    "Wymogi dotyczące ograniczenia zawartości pierwiastków promieniotwórczych",
    "Obowiązkowe informacje o możliwości recyklingu i ponownego użycia",
    "Standardy zrównoważonego pozyskiwania surowców"
  ],
  certificationSystems: ["System 2+", "System 3", "System 4" ]
};

const asphaltRequirement: ProductRequirement = {
  id: "asphalt-req",
  title: "Wymagania dla wyrobów asfaltowych i bitumicznych",
  description: "Wyroby asfaltowe i bitumiczne do drogownictwa i pokryć dachowych muszą spełniać wymagania dotyczące wodoszczelności, trwałości, odporności termicznej oraz wytrzymałości. Rozporządzenie CPR 2024 wprowadza dodatkowe wymagania środowiskowe.",
  mandatoryTests: [
    "Temperatura mięknienia metodą pierścienia i kuli wg EN 1427",
    "Penetracja wg EN 1426",
    "Odporność na starzenie termiczne wg EN 12607-1",
    "Wodoszczelność wg EN 1928 (dla pap i membran)",
    "Stabilność wymiarowa przy podwyższonej temperaturze wg EN 1107-1",
    "Elastyczność w niskiej temperaturze wg EN 1109",
    "Odporność na spływanie w podwyższonej temperaturze wg EN 1110",
    "Właściwości mechaniczne przy rozciąganiu wg EN 12311-1",
    "Odporność na starzenie UV wg EN 1297 (dla wyrobów zewnętrznych)",
    "Emisja substancji niebezpiecznych wg rozporządzenia REACH",
    "Ocena cyklu życia (LCA) zgodnie z EN 15804+A2 (nowy wymóg CPR 2024)"
  ],
  documentationRequired: [
    "Deklaracja właściwości użytkowych (DoP)",
    "Oznakowanie CE",
    "Certyfikat stałości właściwości użytkowych",
    "Dokumentacja zakładowej kontroli produkcji",
    "Raport z badań typu",
    "Karta charakterystyki wg rozporządzenia REACH",
    "Karta techniczna produktu",
    "Deklaracja środowiskowa produktu (EPD) wg EN 15804+A2",
    "Cyfrowy paszport produktu (wymagany od 2025 w ramach CPR 2024)",
    "Raport emisji LZO (lotnych związków organicznych)"
  ],
  cprChanges: [
    "Wprowadzenie obowiązkowego cyfrowego paszportu produktu",
    "Obowiązkowa ocena cyklu życia (LCA) i deklaracja środowiskowa produktu (EPD)",
    "Zaostrzone limity emisji LZO podczas produkcji i stosowania",
    "Wymogi dotyczące recyklingu i ponownego wykorzystania materiałów asfaltowych",
    "Ograniczenie zawartości wielopierścieniowych węglowodorów aromatycznych (WWA)",
    "Nowe standardy dotyczące minimalizacji wpływu na jakość wód gruntowych",
    "Wymogi dotyczące stosowania alternatywnych materiałów o niższym śladzie węglowym",
    "Obowiązkowe informacje o temperaturze przetwarzania i układania (oszczędność energii)"
  ],
  certificationSystems: ["System 2+", "System 3", "System 4" ]
};

const steelRequirement: ProductRequirement = {
  id: "steel-req",
  title: "Wymagania dla wyrobów stalowych konstrukcyjnych",
  description: "Wyroby stalowe konstrukcyjne i metalowe dla budownictwa muszą spełniać wymagania dotyczące wytrzymałości, trwałości, odporności ogniowej oraz odporności na korozję. Rozporządzenie CPR 2024 wprowadza dodatkowe wymagania dotyczące śladu węglowego i recyklingu stalów.",
  mandatoryTests: [
    "Właściwości wytrzymałościowe (granica plastyczności, wytrzymałość na rozciąganie) wg EN 10002-1",
    "Udarność wg EN 10045",
    "Skład chemiczny wg EN 10204",
    "Spęcznianie wg EN 10164 (dla stalów konstrukcyjnych)",
    "Reakcja na ogień wg EN 13501-1",
    "Odporność na korozję wg EN ISO 9227 (dla stalów nierdzewnych)",
    "Grubość i jakość powłoki cynkowej wg EN ISO 1461 (dla stalów ocynkowanych)",
    "Tolerancje wymiarowe wg EN 10034, EN 10056, EN 10162 (zależnie od produktu)",
    "Właściwości zmęczeniowe wg EN 1993-1-9 (dla elementów poddawanych obciążeniom cyklicznym)",
    "Ocena cyklu życia (LCA) zgodnie z EN 15804+A2 (nowy wymóg CPR 2024)"
  ],
  documentationRequired: [
    "Deklaracja właściwości użytkowych (DoP)",
    "Oznakowanie CE",
    "Certyfikat stałości właściwości użytkowych",
    "Dokumentacja zakładowej kontroli produkcji",
    "Atest materiałowy wg EN 10204",
    "Certyfikat spawalniczy wg EN 1090 (dla konstrukcji spawanych)",
    "Karta techniczna produktu",
    "Deklaracja środowiskowa produktu (EPD) wg EN 15804+A2",
    "Cyfrowy paszport produktu (wymagany od 2025 w ramach CPR 2024)",
    "Certyfikat pochodzenia materiału (nowy wymóg CPR 2024)"
  ],
  cprChanges: [
    "Wprowadzenie obowiązkowego cyfrowego paszportu produktu",
    "Obowiązkowa ocena cyklu życia (LCA) i deklaracja środowiskowa produktu (EPD)",
    "Obowiązkowy raport emisji CO2 w całym cyklu produkcyjnym",
    "Wymogi dotyczące minimalnego udziału materiałów z recyklingu",
    "Certyfikacja niskoemisyjnych procesów produkcji stali",
    "Wymogi dotyczące śledzenia źródła surowców (traceability)",
    "Zaostrzenie wymogów dla powłok antykorozyjnych (ograniczenie substancji niebezpiecznych)",
    "Nowe standardy oznakowania produktu i identyfikowalności"
  ],
  certificationSystems: ["System 2+", "System 3" ]
};

const concreteRequirement: ProductRequirement = {
  id: "concrete-req",
  title: "Wymagania dla wyrobów betonowych",
  description: "Wyroby betonowe prefabrykowane muszą spełniać wymagania dotyczące wytrzymałości, trwałości, odporności ogniowej oraz bezpieczeństwa użytkowania. Rozporządzenie CPR 2024 wprowadza dodatkowe wymagania środowiskowe i dotyczące zużycia zasobów.",
  mandatoryTests: [
    "Wytrzymałość na ściskanie wg EN 12390-3",
    "Wytrzymałość na zginanie wg EN 12390-5",
    "Nasiąkliwość i mrozoodporność wg EN 13369",
    "Odporność na ścieranie wg EN 13892-3 (dla posadzek)",
    "Współczynnik przewodzenia ciepła wg EN 12664 (dla wyrobów o funkcji izolacyjnej)",
    "Reakcja na ogień wg EN 13501-1",
    "Szczelność i przepuszczalność wody wg EN 1339 (dla wyrobów zewnętrznych)",
    "Odporność na poślizg/poślizgnięcie wg EN 13036-4 (dla nawierzchni)",
    "Emisja substancji niebezpiecznych wg rozporządzenia REACH",
    "Karbonatyzacja i odporność na korozję wg EN 13295",
    "Ocena cyklu życia (LCA) zgodnie z EN 15804+A2 (nowy wymóg CPR 2024)"
  ],
  documentationRequired: [
    "Deklaracja właściwości użytkowych (DoP)",
    "Oznakowanie CE",
    "Certyfikat stałości właściwości użytkowych",
    "Dokumentacja zakładowej kontroli produkcji",
    "Raport z badań typu",
    "Karta techniczna produktu",
    "Deklaracja środowiskowa produktu (EPD) wg EN 15804+A2",
    "Cyfrowy paszport produktu (wymagany od 2025 w ramach CPR 2024)",
    "Instrukcja montażu i użytkowania",
    "Raport emisji CO2 w cyklu produkcyjnym"
  ],
  cprChanges: [
    "Wprowadzenie obowiązkowego cyfrowego paszportu produktu",
    "Obowiązkowa ocena cyklu życia (LCA) i deklaracja środowiskowa produktu (EPD)",
    "Obowiązkowy raport emisji CO2 w całym cyklu produkcyjnym",
    "Wymogi dotyczące minimalnego udziału materiałów z recyklingu",
    "Limity zawartości cementów wysokoemisyjnych",
    "Nowe standardy dotyczące wykorzystania kruszywa z recyklingu",
    "Wymogi dotyczące zużycia wody w procesie produkcji",
    "Obowiązkowe informacje o możliwości recyklingu i ponownego użycia"
  ],
  certificationSystems: ["System 1+", "System 2+", "System 4" ]
};

const cementRequirement: ProductRequirement = {
  id: "cement-req",
  title: "Wymagania dla cementów i spoiw budowlanych",
  description: "Cementy, wapna budowlane i inne spoiwa hydrauliczne muszą spełniać wymagania dotyczące wytrzymałości, trędnienia, stałości objętości i składu chemicznego. Rozporządzenie CPR 2024 wprowadza nowe wymagania dotyczące emisji CO2 i zrównoważonego rozwoju.",
  mandatoryTests: [
    "Wytrzymałość na ściskanie wg EN 196-1",
    "Czas wiązania wg EN 196-3",
    "Stałość objętości wg EN 196-3",
    "Zawartość chlorków wg EN 196-2",
    "Zawartość siarczanu wg EN 196-2",
    "Zawartość alkaliów wg EN 196-2",
    "Zawartość dodatków (popioły lotne, żużel, pyl krzemionkowy) wg EN 196-2",
    "Ciepło hydratacji wg EN 196-8 lub EN 196-9",
    "Emisja substancji niebezpiecznych wg rozporządzenia REACH",
    "Szlam różnicowy (dla wapna) wg EN 459-2",
    "Ślad węglowy i wydajność produkcji wg ISO 14067 (nowy wymóg CPR 2024)"
  ],
  documentationRequired: [
    "Deklaracja właściwości użytkowych (DoP)",
    "Oznakowanie CE",
    "Certyfikat stałości właściwości użytkowych",
    "Dokumentacja zakładowej kontroli produkcji",
    "Raport z badań typu",
    "Karta techniczna produktu",
    "Karta charakterystyki substancji chemicznej (SDS)",
    "Deklaracja środowiskowa produktu (EPD) wg EN 15804+A2",
    "Cyfrowy paszport produktu (wymagany od 2025 w ramach CPR 2024)",
    "Raport emisji CO2 w cyklu produkcyjnym"
  ],
  cprChanges: [
    "Wprowadzenie obowiązkowego cyfrowego paszportu produktu",
    "Obowiązkowa ocena cyklu życia (LCA) i deklaracja środowiskowa produktu (EPD)",
    "Obowiązkowy raport emisji CO2 w całym cyklu produkcyjnym",
    "Limity emisji CO2 dla poszczególnych typów cementów",
    "Wymogi dotyczące minimalnego udziału materiałów z recyklingu",
    "Nowe standardy dotyczące wykorzystania alternatywnych surowców",
    "Zaostrzenie limitów zawartości substancji niebezpiecznych",
    "Wymogi dotyczące zużycia energii w procesie produkcji"
  ],
  certificationSystems: ["System 1+", "System 2+" ]
};

const timberRequirement: ProductRequirement = {
  id: "timber-req",
  title: "Wymagania dla wyrobów konstrukcyjnych z drewna",
  description: "Produkty z drewna konstrukcyjnego, w tym elementy nośne, belki i słupy, muszą spełniać wymagania dotyczące wytrzymałości mechanicznej, stabilności wymiarowej, odporności ogniowej i trwałości. Rozporządzenie CPR 2024 wprowadza nowe wymogi środowiskowe dla produktów drewnianych.",
  mandatoryTests: [
    "Właściwości mechaniczne (wytrzymałość na zginanie, ściskanie, rozciąganie) wg EN 408",
    "Gęstość i wilgotność wg EN 13183-1,2",
    "Klasyfikacja wytrzymałościowa drewna konstrukcyjnego wg EN 14081-1",
    "Stabilność wymiarowa wg EN 1910",
    "Trwałość naturalna wg EN 350",
    "Skuteczność ochrony (dla drewna impregnowanego) wg EN 15228 lub EN 351-1",
    "Reakcja na ogień wg EN 13501-1",
    "Emisja formaldehydów wg EN 717-1 (dla produktów z klejami)",
    "Zawartość substancji niebezpiecznych (w tym środki ochrony drewna) wg EN 335",
    "Ocena cyklu życia (LCA) zgodnie z EN 15804+A2 (nowy wymóg CPR 2024)"
  ],
  documentationRequired: [
    "Deklaracja właściwości użytkowych (DoP)",
    "Oznakowanie CE",
    "Certyfikat stałości właściwości użytkowych",
    "Dokumentacja zakładowej kontroli produkcji",
    "Raport z badań typu",
    "Certyfikat legalności pochodzenia drewna (PEFC lub FSC)",
    "Instrukcje dotyczące montażu, użytkowania i konserwacji",
    "Cyfrowy paszport produktu (wymagany od 2025 w ramach CPR 2024)",
    "Deklaracja środowiskowa produktu (EPD) wg EN 15804+A2"
  ],
  cprChanges: [
    "Wprowadzenie obowiązkowego cyfrowego paszportu produktu",
    "Obowiązkowa ocena cyklu życia (LCA) i deklaracja środowiskowa produktu (EPD)",
    "Wprowadzenie obowiązkowego certyfikatu legalności pochodzenia drewna (EUTR)",
    "Zaostrzenie limitów emisji formaldehydów z produktów drewnianych",
    "Obowiązkowe informacje o środkach ochrony drewna i ich wpływie na środowisko",
    "Wymogi dotyczące minimalnego udziału drewna z lasów zarządzanych w sposób zrównoważony",
    "Nowe standardy dotyczące przechowywania i transportu drewna konstrukcyjnego"
  ],
  certificationSystems: ["System 1", "System 2+" ]
};

const adhesivesRequirement: ProductRequirement = {
  id: "adhesives-req",
  title: "Wymagania dla klejów budowlanych",
  description: "Kleje budowlane, w tym zaprawy klejowe, kleje do płytek i systemów ociepleń, muszą spełniać wymagania dotyczące przyczepności, wytrzymałości, trwałości i bezpieczeństwa. Rozporządzenie CPR 2024 wprowadza nowe obowiązki w zakresie emisji substancji szkodliwych i ekologiczności.",
  mandatoryTests: [
    "Przyczepność początkowa wg EN 1348 lub EN 12004-2",
    "Przyczepność po zanurzeniu w wodzie wg EN 1348 lub EN 12004-2",
    "Przyczepność po starzeniu termicznym wg EN 1348 lub EN 12004-2",
    "Przyczepność po cyklach zamrażania i rozmrażania wg EN 1348 lub EN 12004-2",
    "Odporność na ścinanie wg EN 12003 (dla klejów reaktywnych)",
    "Czas otwarty wg EN 1346 lub EN 12004-2",
    "Odporność na spływanie wg EN 1308 lub EN 12004-2",
    "Emisja substancji lotnych (VOC) wg EN 16516 (nowy wymóg CPR 2024)",
    "Zawartość substancji niebezpiecznych wg Rozporządzenia REACH"
  ],
  documentationRequired: [
    "Deklaracja właściwości użytkowych (DoP)",
    "Oznakowanie CE",
    "Karta charakterystyki substancji chemicznej (SDS)",
    "Karta techniczna produktu",
    "Raport z badań typu",
    "Dokumentacja zakładowej kontroli produkcji",
    "Cyfrowy paszport produktu (wymagany od 2025 w ramach CPR 2024)",
    "Deklaracja środowiskowa produktu (EPD) wg EN 15804+A2",
    "Instrukcja stosowania z informacją o ograniczeniach użytkowania"
  ],
  cprChanges: [
    "Wprowadzenie obowiązkowego cyfrowego paszportu produktu",
    "Obowiązkowa ocena cyklu życia (LCA) i deklaracja środowiskowa produktu (EPD)",
    "Zaostrzenie limitów emisji VOC i innych substancji szkodliwych",
    "Wymogi dotyczące biodegradowalności i zawartości surowców z recyklingu",
    "Nowe standardy oznakowania bezpieczeństwa i informacji dla użytkownika",
    "Obowiązkowa informacja o rekomendowanych metodach utylizacji i recyklingu",
    "Nowe limity zawartości formaldehydów i izocyjanianów"
  ],
  certificationSystems: ["System 1", "System 3" ]
};

const roofingRequirement: ProductRequirement = {
  id: "roofing-req",
  title: "Wymagania dla wyrobów do pokryć dachowych",
  description: "Pokrycia dachowe i akcesoria muszą spełniać wymagania dotyczące wodoszczelności, odporności ogniowej, wytrzymałości mechanicznej i trwałości. Rozporządzenie CPR 2024 wprowadza dodatkowe wymagania środowiskowe i dotyczące bezpieczeństwa budowlanego.",
  mandatoryTests: [
    "Wodoszczelność wg EN 1928 lub EN 13111",
    "Odporność na ogień zewnętrzny wg EN 13501-5 (klasyfikacja BROOF)",
    "Reakcja na ogień wg EN 13501-1",
    "Odporność na promieniowanie UV i starzenie wg EN 1297 lub EN 13859-1,2",
    "Odporność na rozdzieranie wg EN 12310-1 lub EN 13859-1,2",
    "Odporność na wiatr wg EN 14509 (dla panelów dachowych)",
    "Odporność na uderzenia wg EN 13583 (dla blachodachówki)",
    "Odporność na grad wg EN 13583 (dla dachówek ceramicznych i betonowych)",
    "Odporność termiczna wg EN 6946 (dla dachów o funkcji izolacyjnej)",
    "Ocena cyklu życia (LCA) zgodnie z EN 15804+A2 (nowy wymóg CPR 2024)"
  ],
  documentationRequired: [
    "Deklaracja właściwości użytkowych (DoP)",
    "Oznakowanie CE",
    "Certyfikat stałości właściwości użytkowych",
    "Dokumentacja zakładowej kontroli produkcji",
    "Raport z badań typu",
    "Instrukcja montażu zgodna z wymaganiami producenta",
    "Raport odporności ogniowej i klasyfikacji",
    "Deklaracja środowiskowa produktu (EPD) zgodna z EN 15804+A2",
    "Cyfrowy paszport produktu (wymagany od 2025 w ramach CPR 2024)"
  ],
  cprChanges: [
    "Wprowadzenie obowiązkowego cyfrowego paszportu produktu",
    "Obowiązkowa ocena cyklu życia (LCA) i deklaracja środowiskowa produktu (EPD)",
    "Zaostrzenie wymogów odporności ogniowej dla materiałów dachowych",
    "Nowe kryteria dotyczące emisji substancji niebezpiecznych",
    "Obowiązkowe informacje o możliwości recyklingu i ponownego użycia",
    "Raportowanie odporności na ekstremalne zjawiska pogodowe (nowe wymogi związane ze zmianą klimatu)",
    "Wytyczne dotyczące minimalnej trwałości w okresie użytkowania"
  ],
  certificationSystems: ["System 1", "System 3", "System 4" ]
};

const insulationRequirement: ProductRequirement = {
  id: "insulation-req",
  title: "Wymagania dla wyrobów do izolacji cieplnej",
  description: "Wyroby do izolacji cieplnej budynków muszą spełniać wymagania dotyczące izolacyjności termicznej, odporności ogniowej, przepuszczalności pary wodnej oraz trwałości. Nowe rozporządzenie CPR 2024 wprowadza dodatkowe wymagania związane z biodegradowalnością i śladem węglowym.",
  mandatoryTests: [
    "Współczynnik przewodzenia ciepła (λ) wg EN 12667 lub EN 12939",
    "Klasa reakcji na ogień wg EN 13501-1",
    "Nasiąkliwość wodą wg EN 1609 (krótkotrwała) i EN 12087 (długotrwała)",
    "Współczynnik oporu dyfuzyjnego pary wodnej (µ) wg EN 12086",
    "Odporność na ściskanie lub naprężenie ściskające wg EN 826",
    "Pomiędzy 5000-7000 testów wytrzymałościowych w cyklu życia produktu",
    "Stabilność wymiarowa w określonych warunkach wg EN 1604",
    "Emisja substancji szkodliwych do powietrza wewnętrznego wg EN 16516 (nowy wymóg CPR 2024)",
    "Ocena cyklu życia (LCA) zgodnie z EN 15804+A2 (nowy wymóg CPR 2024)"
  ],
  documentationRequired: [
    "Deklaracja właściwości użytkowych (DoP)",
    "Oznakowanie CE",
    "Certyfikat stałości właściwości użytkowych",
    "Dokumentacja zakładowej kontroli produkcji",
    "Raport z badań typu",
    "Karta techniczna produktu",
    "Cyfrowy paszport produktu (wymagany od 2025 w ramach CPR 2024)",
    "Deklaracja środowiskowa produktu (EPD) zgodna z EN 15804+A2",
    "Raport o zawartości substancji niebezpiecznych (SVHC) wg rozporządzenia REACH"
  ],
  cprChanges: [
    "Wprowadzenie obowiązkowego cyfrowego paszportu produktu",
    "Obowiązkowa ocena cyklu życia (LCA) i deklaracja środowiskowa produktu (EPD)",
    "Nowe, bardziej rygorystyczne klasy efektywności energetycznej",
    "Wprowadzenie kryteriów oceny emisji LZO, formaldehydu i innych substancji do powietrza wewnętrznego",
    "Obowiązkowa informacja o możliwości recyklingu i biodegradowalności",
    "Wytyczne dotyczące wytwarzania z surowców odnawialnych lub z recyklingu",
    "Obligatoryjne raportowanie śladu węglowego i zużycia wody w procesie produkcji"
  ],
  certificationSystems: ["System 1+", "System 3", "System 4" ]
};

const doorsWindowsRequirement: ProductRequirement = {
  id: "doors-windows-req",
  title: "Wymagania dla drzwi, okien i okiennic",
  description: "Drzwi, okna, okiennice, bramy i powiązane z nimi okucia budowlane muszą spełniać restrykcyjne wymagania dotyczące izolacyjności cieplnej, szczelności, bezpieczeństwa i trwałości. Rozporządzenie CPR 2024 wprowadza dodatkowe obowiązki w zakresie deklarowania parametrów środowiskowych.",
  mandatoryTests: [
    "Przepuszczalność cieplna - współczynnik U wg EN ISO 10077-1 i 10077-2",
    "Wodoszczelność - badanie wg EN 1027 i klasyfikacja wg EN 12208",
    "Przepuszczalność powietrza - badanie wg EN 1026 i klasyfikacja wg EN 12207",
    "Odporność na obciążenie wiatrem - badanie wg EN 12211 i klasyfikacja wg EN 12210",
    "Właściwości akustyczne - izolacyjność akustyczna wg EN ISO 10140 i EN ISO 717-1",
    "Siły operacyjne - badanie wg EN 12046 i klasyfikacja wg EN 13115",
    "Odporność na włamanie dla okien i drzwi z podwyższoną odpornością na włamanie wg EN 1627",
    "Trwałość mechaniczna - cykle otwierania/zamykania wg EN 1191 i EN 12400",
    "Emisja substancji niebezpiecznych - badanie obecności związków VOC i formaldehydu (nowy wymóg CPR 2024)"
  ],
  documentationRequired: [
    "Deklaracja właściwości użytkowych (DoP)",
    "Oznakowanie CE",
    "Etykieta energetyczna okna/drzwi zgodna z dyrektywą o efektywności energetycznej",
    "Dokumentacja zakładowej kontroli produkcji",
    "Raport z badań typu",
    "Instrukcja montażu zgodna z wymaganiami producenta",
    "Cyfrowy paszport produktu (wymagany od 2025 w ramach CPR 2024)",
    "Deklaracja środowiskowa produktu (EPD) - nowy obowiązkowy element wg CPR 2024"
  ],
  cprChanges: [
    "Wprowadzenie obowiązkowego cyfrowego paszportu produktu z pełną historią wyrobów",
    "Obowiązkowa ocena cyklu życia (LCA) i deklaracja środowiskowa produktów (EPD)",
    "Nowe zharmonizowane wskaźniki efektywności energetycznej",
    "Rozszerzone wymagania dotyczące informacji o zawartości substancji niebezpiecznych",
    "Wprowadzenie kryteriów oceny emisji VOC i innych substancji do powietrza wewnętrznego",
    "Obowiązkowa informacja o możliwości recyklingu lub ponownego użycia komponentów"
  ],
  certificationSystems: ["System 3", "System 1" ]
};

const glassProductsRequirement: ProductRequirement = {
  id: "glass-req",
  title: "Wymagania dla wyrobów ze szkła",
  description: "Wyroby ze szkła płaskiego, profilowanego i bloków szklanych muszą spełniać wymagania bezpieczeństwa, izolacyjności cieplnej i akustycznej oraz przejrzystości. Nowe rozporządzenie CPR 2024 wprowadza dodatkowe wymagania dotyczące śladu węglowego i recyklingu.",
  mandatoryTests: [
    "Odporność na uderzenia zgodnie z normą EN 12600",
    "Izolacyjność cieplna - współczynnik U wg EN 673",
    "Izolacyjność akustyczna - wskaźnik tłumienia dźwięku Rw",
    "Przepuszczalność światła i promieniowania słonecznego wg EN 410",
    "Odporność ogniowa dla szkła przeciwpożarowego",
    "Ocena cyklu życia (LCA) - nowy wymóg CPR 2024"
  ],
  documentationRequired: [
    "Deklaracja właściwości użytkowych (DoP)",
    "Oznakowanie CE",
    "Dokumentacja zakładowej kontroli produkcji",
    "Raport z badań typu",
    "Cyfrowy paszport produktu (CPR 2024)",
    "Karta charakterystyki środowiskowej (CPR 2024)"
  ],
  cprChanges: [
    "Wprowadzenie cyfrowego paszportu produktu dla wyrobów szklanych",
    "Obowiązkowa ocena cyklu życia (LCA)",
    "Określenie minimalnej zawartości surowców z recyklingu",
    "Raportowanie śladu węglowego w procesie produkcji",
    "Rozszerzone wymagania bezpieczeństwa dla szkła w zastosowaniach specjalnych"
  ],
  certificationSystems: ["System 1+", "System 3"]
};

const placeholderRequirements: ProductRequirement = {
  id: "placeholder-req",
  title: "Wymagania podstawowe",
  description: "Szczegółowe wymagania dla tej kategorii produktów są obecnie opracowywane. Skontaktuj się z Multicert, aby uzyskać szczegółowe informacje.",
  mandatoryTests: [
    "Badania wstępne typu",
    "Ocena zgodności z normami zharmonizowanymi",
    "Raportowanie środowiskowe (nowe z CPR 2024)"
  ],
  documentationRequired: [
    "Deklaracja właściwości użytkowych (DoP)",
    "Dokumentacja zakładowej kontroli produkcji",
    "Cyfrowy paszport produktu (nowy z CPR 2024)"
  ],
  cprChanges: [
    "Cyfryzacja dokumentacji i oznaczeń",
    "Zwiększone wymagania środowiskowe",
    "Nowe systemy oceny i weryfikacji stałości właściwości użytkowych"
  ],
  certificationSystems: ["System 2+", "System 3"]
};

// Basic placeholder requirement for categories without detailed information
const placeholderRequirement: ProductRequirement = {
  id: "placeholder-req",
  title: "Ogólne wymagania CPR 2024",
  description: "Ogólne wymagania dla wyrobów budowlanych zgodnie z nowym rozporządzeniem CPR 2024. Szczegółowe wymagania są w trakcie opracowywania.",
  mandatoryTests: [
    "Badania właściwości mechanicznych zgodnie z odpowiednimi normami EN",
    "Badania trwałości i odporności na czynniki środowiskowe",
    "Badania reakcji na ogień wg EN 13501-1",
    "Badania emisji substancji niebezpiecznych wg EN 16516",
    "Badania zgodności z wymogami podstawowymi CPR 2024"
  ],
  documentationRequired: [
    "Deklaracja właściwości użytkowych (DoP)",
    "Oznakowanie CE",
    "Dokumentacja zakładowej kontroli produkcji",
    "Raport z badań typu",
    "Deklaracja środowiskowa produktu (EPD) wg EN 15804+A2",
    "Cyfrowy paszport produktu (wymagany od 2025 w ramach CPR 2024)"
  ],
  cprChanges: [
    "Wprowadzenie obowiązkowego cyfrowego paszportu produktu",
    "Obowiązkowa ocena cyklu życia (LCA) i deklaracja środowiskowa produktu (EPD)",
    "Nowe wymagania dotyczące zawartości materiałów z recyklingu",
    "Zaostrzenie wymogów emisji substancji niebezpiecznych",
    "Wymogi dotyczące możliwości ponownego wykorzystania po zakończeniu cyklu życia"
  ],
  certificationSystems: ["System 1+", "System 1", "System 2+", "System 3", "System 4"]
};

export const productCategories: ProductCategory[] = [
  // Plumbing products category with detailed requirements
  {
    id: "plumbing-products",
    name: "Wyroby instalacyjne",
    code: "21",
    description: "Rury, złączki, zawory, armatura sanitarna, systemy wodno-kanalizacyjne",
    requirements: plumbingRequirement
  },
  // Ceiling products category with detailed requirements
  {
    id: "ceiling-products",
    name: "Sufity podwieszane",
    code: "22",
    description: "Panele sufitowe, konstrukcje nośne, systemy sufitowe",
    requirements: ceilingRequirement
  },
  // Steel products category with detailed requirements
  {
    id: "steel-products",
    name: "Wyroby stalowe",
    code: "30",
    description: "Stal konstrukcyjna, zbrojeniowa, elementy złączne, wyroby spawalnicze",
    requirements: steelRequirement
  },
  // Concrete and mortar products category with detailed requirements
  {
    id: "concrete-mortar-products",
    name: "Betony i zaprawy",
    code: "26",
    description: "Beton towarowy, zaprawy murarskie, tynkarskie, jastrychy i domieszki",
    requirements: concreteMortarRequirement
  },
  // Doors and windows category with detailed requirements
  {
    id: "doors-windows-products",
    name: "Drzwi i okna",
    code: "16",
    description: "Okna, drzwi, bramy garażowe, rolety, żaluzje i okucia",
    requirements: doorsWindowsRequirement
  },
  // Road construction products category with detailed requirements
  {
    id: "road-construction-products",
    name: "Wyroby do budowy dróg",
    code: "24",
    description: "Mieszanki mineralno-asfaltowe, kruszywa drogowe, oznakowanie, bariery",
    requirements: roadConstructionRequirement
  },
  // Flooring products category with detailed requirements
  {
    id: "flooring-products",
    name: "Wyroby podłogowe",
    code: "17",
    description: "Podłogi drewniane, laminowane, ceramiczne, winylowe, wykładziny",
    requirements: flooringRequirement
  },
  // Structural timber products category with detailed requirements
  {
    id: "structural-timber-products",
    name: "Wyroby konstrukcyjne z drewna",
    code: "36",
    description: "Drewno konstrukcyjne lite, klejone warstwowo (GLT, CLT), LVL i inne",
    requirements: structuralTimberRequirement
  },
  // Wood-based panels category with detailed requirements
  {
    id: "wood-based-panels",
    name: "Płyty drewnopochodne",
    code: "34",
    description: "Płyty drewnopochodne, w tym sklejka, OSB, płyty wiórowe, MDF/HDF",
    requirements: woodPanelsRequirement
  },
  // Thermal insulation products category with detailed requirements
  {
    id: "thermal-insulation-products",
    name: "Wyroby do izolacji cieplnej",
    code: "35",
    description: "Materiały termoizolacyjne, w tym wełna mineralna, styropian, XPS, PIR, PUR",
    requirements: thermalInsulationRequirement
  },
  // Membranes and geosynthetic barriers category with detailed requirements
  {
    id: "membranes-barriers",
    name: "Membrany i bariery geosyntetyczne",
    code: "28",
    description: "Membrany hydroizolacyjne, paroszczelne i bariery geosyntetyczne",
    requirements: membranesRequirement
  },
  // Precast concrete products category with detailed requirements
  {
    id: "precast-concrete-products",
    name: "Prefabrykaty betonowe",
    code: "31",
    description: "Prefabrykowane elementy betonowe, żelbetowe i sprężone",
    requirements: precastConcreteRequirement
  },
  // Masonry units category with detailed requirements
  {
    id: "masonry-units",
    name: "Elementy murowe",
    code: "27",
    description: "Cegły, bloczki, pustaki i elementy z kamienia naturalnego",
    requirements: masonryRequirement
  },
  // Geotextiles and related products category with detailed requirements
  {
    id: "geotextile-products",
    name: "Geotekstylia i wyroby pokrewne",
    code: "18",
    description: "Geotekstylia, membrany, geosiatki i geosyntetyki",
    requirements: geotextileRequirement
  },
  // Glass products category with detailed requirements
  {
    id: "glass-products",
    name: "Wyroby szklane",
    code: "14",
    description: "Szkło budowlane, szyby zespolone, szkło hartowane i laminowane",
    requirements: glassRequirement
  },
  // Gypsum products category with detailed requirements
  {
    id: "gypsum-products",
    name: "Wyroby gipsowe",
    code: "15",
    description: "Płyty gipsowo-kartonowe, tynki gipsowe i elementy sufitowe",
    requirements: gypsumRequirement
  },
  // Clay/ceramic products category with detailed requirements
  {
    id: "ceramic-products",
    name: "Wyroby ceramiczne",
    code: "13",
    description: "Ceramika budowlana, cegły, dachówki i płytki ceramiczne",
    requirements: ceramicRequirement
  },
  // Asphalt/bituminous products category with detailed requirements
  {
    id: "asphalt-products",
    name: "Wyroby asfaltowe i bitumiczne",
    code: "03",
    description: "Wyroby asfaltowe i bitumiczne do budownictwa drogowego i pokryć dachowych",
    requirements: asphaltRequirement
  },
  // Steel products category with detailed requirements
  {
    id: "steel-products",
    name: "Wyroby stalowe konstrukcyjne",
    code: "33",
    description: "Wyroby stalowe konstrukcyjne i metalowe dla budownictwa",
    requirements: steelRequirement
  },
  // Concrete products category with detailed requirements
  {
    id: "concrete-products",
    name: "Wyroby betonowe",
    code: "05",
    description: "Prefabrykowane wyroby z betonu zwykłego, lekkiego i autoklawizowanego",
    requirements: concreteRequirement
  },
  // Cement and building limes category with detailed requirements
  {
    id: "cement-limes",
    name: "Cementy i wapna budowlane",
    code: "12",
    description: "Cementy, wapna budowlane i inne spoiwa hydrauliczne",
    requirements: cementRequirement
  },
  // Structural timber products category with detailed requirements
  {
    id: "timber-products",
    name: "Konstrukcyjne wyroby z drewna",
    code: "35",
    description: "Konstrukcyjne wyroby z drewna i wyroby pomocnicze",
    requirements: timberRequirement
  },
  // Construction adhesives category with detailed requirements
  {
    id: "adhesives",
    name: "Kleje budowlane",
    code: "25",
    description: "Kleje konstrukcyjne, zaprawy klejowe i produkty do mocowania wyrobów budowlanych",
    requirements: adhesivesRequirement
  },
  // Roofing products category with detailed requirements
  {
    id: "roofing-products",
    name: "Pokrycia dachowe",
    code: "22",
    description: "Pokrycia dachowe, świetliki, okna dachowe i wyroby dodatkowe",
    requirements: roofingRequirement
  },
  // Insulation materials category with detailed requirements
  {
    id: "insulation-materials",
    name: "Materiały izolacyjne",
    code: "04",
    description: "Wyroby do izolacji cieplnej, akustycznej i przeciwpożarowej",
    requirements: insulationRequirement
  },
  // Doors and windows category with detailed requirements
  {
    id: "doors-windows",
    name: "Drzwi, okna i okucia",
    code: "02",
    description: "Drzwi, okna, okiennice, bramy i powiązane z nimi okucia budowlane",
    requirements: doorsWindowsRequirement
  },
  {
    id: "concrete",
    name: "Beton i wyroby betonowe",
    code: "33",
    description: "Beton i wyroby z betonu, np. prefabrykowane elementy betonowe, płyty, rury",
    requirements: {
      id: "req-concrete",
      title: "Wymagania dla betonu i wyrobów betonowych",
      description: "Nowe rozporządzenie CPR 2024 wprowadza dodatkowe wymagania dla wyrobów betonowych, szczególnie w zakresie emisji substancji niebezpiecznych i zrównoważonego wykorzystania zasobów naturalnych.",
      mandatoryTests: [
        "Wytrzymałość na ściskanie",
        "Wodoszczelność",
        "Odporność na zamrażanie/rozmrażanie",
        "Emisja substancji niebezpiecznych (nowe z CPR 2024)",
        "Analiza cyklu życia produktu (nowe z CPR 2024)"
      ],
      documentationRequired: [
        "Deklaracja właściwości użytkowych (DoP)",
        "Dokumentacja zakładowej kontroli produkcji (ZKP)",
        "Ocena emisji substancji niebezpiecznych",
        "Deklaracja środowiskowa produktu (EPD)",
        "Plan zarządzania odpadami (nowy z CPR 2024)"
      ],
      cprChanges: [
        "Dodatkowa ocena emisji CO2 podczas produkcji",
        "Analiza możliwości recyklingu i ponownego wykorzystania",
        "Ocena wpływu na środowisko przez cały cykl życia produktu",
        "Cyfryzacja deklaracji właściwości użytkowych",
        "Obowiązkowa obecność kart charakterystyki dla substancji niebezpiecznych"
      ],
      certificationSystems: ["System 1+", "System 1", "System 2+"]
    }
  },
  {
    id: "steel",
    name: "Stal konstrukcyjna",
    code: "20",
    description: "Wyroby stalowe do zastosowan konstrukcyjnych, np. belki, profile, blachy",
    requirements: {
      id: "req-steel",
      title: "Wymagania dla stali konstrukcyjnej",
      description: "Stal konstrukcyjna według CPR 2024 musi spełniać szereg nowych wymagań związanych z możliwością recyklingu oraz emisją dwutlenku węgla podczas produkcji.",
      mandatoryTests: [
        "Wytrzymałość na rozciąganie",
        "Ciągliwość i plastyczność",
        "Odporność na zmęczenie",
        "Udział materiałów z recyklingu (nowe z CPR 2024)",
        "Emisja CO2 podczas produkcji (nowe z CPR 2024)"
      ],
      documentationRequired: [
        "Deklaracja właściwości użytkowych (DoP)",
        "Certyfikat zakładowej kontroli produkcji",
        "Ślad węglowy produktu",
        "Raport z oceny możliwości recyklingu",
        "Karta charakterystyki substancji niebezpiecznych"
      ],
      cprChanges: [
        "Dodatkowe informacje o możliwości recyklingu w DoP",
        "Obowiązkowa deklaracja emisji CO2",
        "Wymagania dotyczące minimalnego udziału materiałów z recyklingu",
        "Raportowanie o trwałości produktu",
        "System śledzenia pochodzenia surowców"
      ],
      certificationSystems: ["System 2+", "System 1+"]
    }
  },
  {
    id: "insulation",
    name: "Materiały izolacyjne",
    code: "04",
    description: "Materiały izolacyjne termiczne i akustyczne, np. wełna mineralna, styropian, pianka PUR",
    requirements: {
      id: "req-insulation",
      title: "Wymagania dla materiałów izolacyjnych",
      description: "Materiały izolacyjne podlegają szczególnie restrykcyjnym wymaganiom w zakresie bezpieczeństwa pożarowego oraz emisji substancji niebezpiecznych, co zostało wzmocnione w CPR 2024.",
      mandatoryTests: [
        "Współczynnik przewodzenia ciepła",
        "Reakcja na ogień",
        "Chłonność wody",
        "Emisja substancji niebezpiecznych",
        "Trwałość właściwości termoizolacyjnych"
      ],
      documentationRequired: [
        "Deklaracja właściwości użytkowych (DoP)",
        "Raporty klasyfikacji ogniowej",
        "Deklaracja środowiskowa produktu (EPD)",
        "Certyfikat zakładowej kontroli produkcji",
        "Dokumentacja materiałów bazowych"
      ],
      cprChanges: [
        "Zaostrzenie kryteriów bezpieczeństwa pożarowego",
        "Wymogi dotyczące biodegradowalności i recyklingu",
        "Obowiązkowa analiza cyklu życia produktu (LCA)",
        "Raportowanie śladu węglowego",
        "Ograniczenia stosowania substancji szkodliwych"
      ],
      certificationSystems: ["System 1", "System 3", "System 4"]
    }
  },
  {
    id: "windows",
    name: "Okna i drzwi",
    code: "16",
    description: "Okna, drzwi zewnętrzne i wewnętrzne, drzwi garażowe i przemysłowe",
    requirements: {
      id: "req-windows",
      title: "Wymagania dla okien i drzwi",
      description: "CPR 2024 rozszerza wymagania dla okien i drzwi w zakresie efektywności energetycznej, izolacyjności akustycznej oraz bezpieczeństwa użytkowania.",
      mandatoryTests: [
        "Współczynnik przenikania ciepła",
        "Izolacyjność akustyczna",
        "Przepuszczalność powietrza",
        "Odporność na włamanie",
        "Trwałość mechaniczna i funkcjonalna"
      ],
      documentationRequired: [
        "Deklaracja właściwości użytkowych (DoP)",
        "Etykieta energetyczna",
        "Dokumentacja techniczna",
        "Instrukcja montażu zgodna z nowymi wytycznymi",
        "Ocena cyklu życia produktu"
      ],
      cprChanges: [
        "Zaostrzenie wymagań dotyczących efektywności energetycznej",
        "Wymagania w zakresie łatwości demontażu i recyklingu",
        "Cyfrowy paszport produktu",
        "Ocena wpływu na środowisko w całym cyklu życia",
        "Nowe wytyczne dotyczące bezpieczeństwa użytkowania"
      ],
      certificationSystems: ["System 3", "System 1"]
    }
  },
  {
    id: "cement",
    name: "Cement i spoiwa",
    code: "15",
    description: "Cement, spoiwa hydrauliczne, zaprawy murarskie i tynkarskie",
    requirements: {
      id: "req-cement",
      title: "Wymagania dla cementu i spoiw",
      description: "Cement i spoiwa w ramach CPR 2024 podlegają nowym regulacjom dotyczącym redukcji emisji CO2 oraz wykorzystania materiałów alternatywnych i z recyklingu.",
      mandatoryTests: [
        "Wytrzymałość na ściskanie",
        "Czas wiązania",
        "Stałość objętości",
        "Zawartość chlorków, siarczków i alkaliów",
        "Emisja CO2 w procesie produkcji (nowe z CPR 2024)"
      ],
      documentationRequired: [
        "Deklaracja właściwości użytkowych (DoP)",
        "Certyfikat stałości właściwości użytkowych",
        "Raport emisji gazow cieplarnianych",
        "Dokumentacja materiałów z recyklingu",
        "Deklaracja środowiskowa produktu (EPD)"
      ],
      cprChanges: [
        "Wymagania dotyczące obniżenia śladu węglowego",
        "Wprowadzenie limitu emisji CO2 na tonę produktu",
        "Wymogi dotyczące stosowania materiałów alternatywnych",
        "Cyfryzacja dokumentów zakładowej kontroli produkcji",
        "Nowe kategorie cementu niskoemiłs  innego"
      ],
      certificationSystems: ["System 1+", "System 1"]
    }
  },
  {
    id: "bricks",
    name: "Cegły i bloczki",
    code: "01",
    description: "Wyroby murowe, bloczki konstrukcyjne, pustaki ceramiczne i betonowe",
    requirements: {
      id: "req-bricks",
      title: "Wymagania dla cegieł i bloczków",
      description: "Wyroby murowe w świetle CPR 2024 muszą spełniać nowe wymagania dotyczące trwałości, efektywności energetycznej i możliwości ponownego wykorzystania.",
      mandatoryTests: [
        "Wytrzymałość na ściskanie",
        "Odporność na zamrażanie/rozmrażanie",
        "Absorpcja wody",
        "Współczynnik przewodzenia ciepła",
        "Trwałość (nowe kryteria z CPR 2024)"
      ],
      documentationRequired: [
        "Deklaracja właściwości użytkowych (DoP)",
        "Dokumentacja zakładowej kontroli produkcji",
        "Raport z testow efektywności energetycznej",
        "Deklaracja środowiskowa produktu (EPD)",
        "Plan zarządzania odpadami i recyklingu"
      ],
      cprChanges: [
        "Wprowadzenie kryteriów oceny trwałości w cyklu życia",
        "Wymagania dotyczące zawartości materiałów z recyklingu",
        "Nowe standardy izolacyjności termicznej",
        "Cyfryzacja dokumentacji technicznej",
        "Raportowanie śladu węglowego"
      ],
      certificationSystems: ["System 2+", "System 4"]
    }
  },
  {
    id: "roofing",
    name: "Pokrycia dachowe",
    code: "25",
    description: "Pokrycia dachowe, dachowki, blachodachówki, membrany i akcesoria dachowe",
    requirements: {
      id: "req-roofing",
      title: "Wymagania dla pokryć dachowych",
      description: "CPR 2024 wprowadza dla pokryć dachowych dodatkowe wymagania w zakresie odporności na ekstremalne warunki pogodowe, izolacyjności termicznej oraz zrównoważonego rozwoju.",
      mandatoryTests: [
        "Wodoszczelność",
        "Reakcja na ogień",
        "Odporność na ekstremalne warunki pogodowe",
        "Trwałość (nowe zaaostrzone kryteria)",
        "Odporność na promieniowanie UV"
      ],
      documentationRequired: [
        "Deklaracja właściwości użytkowych (DoP)",
        "Certyfikat odporności ogniowej",
        "Raport z testów odporności na warunki pogodowe",
        "Ocena cyklu życia produktu",
        "Certyfikat zakładowej kontroli produkcji"
      ],
      cprChanges: [
        "Dodatkowe testy odporności na ekstremalne zjawiska pogodowe",
        "Wymogi dotyczące trwałości i zdolności do recyklingu",
        "Standardy w zakresie emisji substancji niebezpiecznych",
        "Nowe wytyczne dotyczące izolacyjności termicznej",
        "Cyfrowy paszport produktu wymagany od 2026 roku"
      ],
      certificationSystems: ["System 3", "System 4", "System 1"]
    }
  },
  {
    id: "pipes",
    name: "Rury i systemy rurowe",
    code: "14",
    description: "Rury i kształtki do różnych zastosowan, systemy kanalizacyjne i wodociągowe",
    requirements: {
      id: "req-pipes",
      title: "Wymagania dla rur i systemów rurowych",
      description: "Rury i systemy rurowe według CPR 2024 podlegają nowym wymaganiom w zakresie bezpieczeństwa użytkowania, higieniczności oraz wpływu na środowisko.",
      mandatoryTests: [
        "Szczelność",
        "Wytrzymałość na ciśnienie wewnętrzne",
        "Odporność na czynniki chemiczne",
        "Higieniczność (kontakt z wodą pitną)",
        "Emisja substancji niebezpiecznych"
      ],
      documentationRequired: [
        "Deklaracja właściwości użytkowych (DoP)",
        "Dokumentacja zakładowej kontroli produkcji",
        "Certyfikaty higieniczne dla kontaktu z wodą pitną",
        "Ocena wpływu na środowisko",
        "Dokumentacja techniczna systemu"
      ],
      cprChanges: [
        "Rozszerzone wymagania dotyczące kontaktu z wodą pitną",
        "Zaostrzenie norm emisji zanieczyszczeń",
        "Wymogi dotyczące łatwości recyklingu",
        "Cyfrowa dokumentacja techniczna i znakowanie",
        "Testy odporności na długotrwałe użytkowanie"
      ],
      certificationSystems: ["System 1+", "System 3", "System 4"]
    }
  }
];

// Get a list of all product categories for dropdown selection
// Complete list of all 36 product families
const allProductFamilies = [
  { id: "concrete-prefab", name: "Wyroby prefabrykowane z betonu", code: "01", description: "Wyroby prefabrykowane z betonu zwykłego/lekkiego/autoklawizowanego napowietrzonego" },
  { id: "doors-windows", name: "Drzwi, okna i okucia", code: "02", description: "Drzwi, okna, okiennice, bramy i powiązane z nimi okucia budowlane" },
  { id: "membranes", name: "Membrany izolacyjne", code: "03", description: "Membrany, w tym stosowane w postaci płynnej i zestawy (izolujące przed wodą lub parą wodną)" },
  { id: "insulation", name: "Materiały termoizolacyjne", code: "04", description: "Materiały termoizolacyjne złożone zestawy/systemy izolacyjne" },
  { id: "structural-bearings", name: "Łożyska konstrukcyjne", code: "05", description: "Łożyska konstrukcyjne trzpienie do złączy konstrukcyjnych" },
  { id: "chimneys", name: "Kominy i przewody", code: "06", description: "Kominy, przewody kominowe i wyroby specjalne" },
  { id: "gypsum-products", name: "Wyroby gipsowe", code: "07", description: "Wyroby gipsowe" },
  { id: "geotextiles", name: "Geowłókniny i geomembrany", code: "08", description: "Geowłókniny, geomembrany i wyroby związane" },
  { id: "curtain-walls", name: "Ściany osłonowe", code: "09", description: "Ściany osłonowe/okładziny ścian zewnętrznych/oszklenie ze spoiwem konstrukcyjnym" },
  { id: "fire-equipment", name: "Urządzenia przeciwpożarowe", code: "10", description: "Stałe urządzenia gaśnicze (wyroby do wykrywania i sygnalizacji pożaru, stałe urządzenia gaśnicze)" },
  { id: "sanitary-ware", name: "Urządzenia sanitarne", code: "11", description: "Urządzenia sanitarne" },
  { id: "road-equipment", name: "Urządzenia drogowe", code: "12", description: "Urządzenia bezpieczeństwa ruchu drogowego: wyposażenie dróg" },
  { id: "timber-structural", name: "Konstrukcje drewniane", code: "13", description: "Konstrukcyjne wyroby/elementy drewniane i wyroby pomocnicze" },
  { id: "wood-panels", name: "Płyty drewnopochodne", code: "14", description: "Płyty i elementy drewnopochodne" },
  { id: "cement", name: "Cement i spoiwa", code: "15", description: "Cementy, wapna budowlane i inne spoiwa hydrauliczne" },
  { id: "steel", name: "Stal zbrojeniowa", code: "16", description: "Stal zbrojeniowa i sprężająca do betonu (i wyroby pomocnicze) zestawy zakotwień i cięgien" },
  { id: "bricks", name: "Wyroby murarskie", code: "17", description: "Wyroby murarskie i wyroby pokrewne elementy murowe, zaprawy i wyroby pomocnicze" },
  { id: "sewage-products", name: "Oczyszczanie ścieków", code: "18", description: "Wyroby do usuwania i oczyszczania ścieków" },
  { id: "flooring", name: "Wyroby podłogowe", code: "19", description: "Wyroby podłogowe i posadzkowe" },
  { id: "metal-structural", name: "Konstrukcje metalowe", code: "20", description: "Konstrukcyjne wyroby metalowe i wyroby pomocnicze" },
  { id: "wall-finishes", name: "Wykończenia ścian", code: "21", description: "Wykończenie ścian wewnętrznych, zewnętrznych i sufitów. Zestawy wyrobów do wykonywania ścian działowych" },
  { id: "roofing", name: "Pokrycia dachowe", code: "22", description: "Pokrycia dachowe, świetliki, okna dachowe i wyroby pomocnicze, zestawy dachowe" },
  { id: "road-construction", name: "Budowa dróg", code: "23", description: "Wyroby do budowy dróg" },
  { id: "aggregates", name: "Kruszywa", code: "24", description: "Kruszywa" },
  { id: "construction-adhesives", name: "Kleje budowlane", code: "25", description: "Kleje budowlane" },
  { id: "concrete-related", name: "Wyroby betonowe", code: "26", description: "Wyroby związane z betonem, zaprawą i zaczynem" },
  { id: "heating-devices", name: "Urządzenia grzewcze", code: "27", description: "Urządzenia do ogrzewania pomieszczeń" },
  { id: "pipes-nondrinking", name: "Rury i zbiorniki", code: "28", description: "Rury, zbiorniki i wyroby pomocnicze niestykające się z wodą przeznaczoną do spożycia przez ludzi" },
  { id: "pipes-drinking", name: "Wyroby do wody pitnej", code: "29", description: "Wyroby budowlane stykające się z wodą przeznaczoną do spożycia przez ludzi" },
  { id: "glass-products", name: "Wyroby szklane", code: "30", description: "Wyroby ze szkła płaskiego, profilowanego i bloków szklanych" },
  { id: "cables", name: "Kable i przewody", code: "31", description: "Kable zasilania, sterujące i komunikacyjne" },
  { id: "joint-sealants", name: "Uszczelniacze", code: "32", description: "Wyroby do uszczelniania złączy" },
  { id: "fixings", name: "Mocowania i łączniki", code: "33", description: "Mocowania/łączniki" },
  { id: "building-kits", name: "Zestawy budowlane", code: "34", description: "Zestawy budowlane, komponenty budowlane, prefabrykaty" },
  { id: "fire-stopping", name: "Ochrona przeciwpożarowa", code: "35", description: "Wyroby do zatrzymywania ognia, uszczelniające i ochrony ogniowej wyroby hamujące palność" },
  { id: "fixed-ladders", name: "Drabiny stałe", code: "36", description: "Drabiny mocowane na stałe" }
];

// Helper function to build the full product category list with existing detailed data or placeholder
const buildFullProductCategoryList = () => {
  return allProductFamilies.map(family => {
    // Check if we have detailed requirements for this category
    const existingCategory = productCategories.find(cat => cat.id === family.id);
    
    if (existingCategory) {
      return existingCategory;
    } else {
      // Return a new category with placeholder requirements
      return {
        id: family.id,
        name: family.name,
        code: family.code,
        description: family.description,
        requirements: {
          ...placeholderRequirements,
          id: `req-${family.id}`,
          title: `Wymagania dla kategorii: ${family.name}`
        }
      };
    }
  });
};

// Get all product categories with detailed or placeholder data
export const getAllProductCategories = () => buildFullProductCategoryList();

export const getProductCategoryOptions = () => {
  return getAllProductCategories().map(category => ({
    value: category.id,
    label: `${category.name} (${category.code})`,
  }));
};

// Find a product category by ID
export const findProductCategoryById = (categoryId: string): ProductCategory | undefined => {
  return getAllProductCategories().find(category => category.id === categoryId);
};
