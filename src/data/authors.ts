export interface AuthorPublication {
  title: string;
  year: number;
  description: string;
  url?: string;
}

export interface Author {
  slug: string;
  name: string;
  shortTitle: string;
  shortBio: string;
  fullBio: string;
  roles: string[];
  expertise: string[];
  education: string[];
  awards: string[];
  publications: AuthorPublication[];
}

export const AUTHORS: Record<string, Author> = {
  "robert-dynarowski": {
    slug: "robert-dynarowski",
    name: "dr inż. Robert Andrzej Dynarowski",
    shortTitle: "Niezależny weryfikator LCA i EPD, Przewodniczący TC EPD Polska",
    shortBio:
      "Doktor nauk technicznych, Pełnomocnik ds. ZKP i Manager Jakości w firmie Wienerberger. Aktywny Członek Komitetu Technicznego 233 przy PKN, Audytor Wiodący systemów ISO oraz ZKP. Od 2024 r. niezależny weryfikator LCA i EPD oraz Przewodniczący Komitetu Technicznego EPD Polska.",
    fullBio:
      "dr inż. Robert Andrzej Dynarowski – Pełnomocnik ds. ZKP, Manager Jakości Firmy Wienerberger, aktywny Członek Komitetu Technicznego 233 przy PKN, Audytor Wiodący systemów ISO oraz ZKP szeroko rozumianej branży budowlanej. Były Członek Komitetu Technicznego przy PCA (2 kadencji) oraz Członek Zarządu Klubu Polskie Forum ISO.\n\nUkończył Politechnikę Warszawską na Wydziale Mechanicznym Technologii i Automatyzacji na kierunku: Automatyka i Robotyka. Uzyskał stopień naukowy: doktor nauk technicznych na kierunku: Budowa, eksploatacja maszyn na Wydziale Inżynierii Produkcji Politechniki Warszawskiej.\n\nUkończył liczne studia podyplomowe m.in.: w Szkole Głównej Handlowej na kierunku: Manager Jakości, a następnie na Akademii Górniczo-Hutniczej na kierunku: Współczesna ceramika budowlana wypalana oraz na Uniwersytecie Warszawskim na kierunku: Zarządzanie Projektami.\n\nW 2012 r. został finalistą III edycji konkursu Polska Nagroda Jakości otrzymując tytuł: Znakomity Pełnomocnik Systemów Zarządzania – nagrodę odebrał z rąk ówczesnego Wicepremiera, Ministra Gospodarki p. Waldemara Pawlaka.\n\nOd 2024 r. działa w organizacji EPD Polska gdzie jest niezależnym weryfikatorem LCA i EPD oraz Przewodniczącym Komitetu Technicznego (TC) EPD Polska.",
    roles: [
      "Pełnomocnik ds. ZKP, Manager Jakości – Wienerberger",
      "Członek Komitetu Technicznego 233 przy PKN",
      "Audytor Wiodący systemów ISO i ZKP",
      "Niezależny weryfikator LCA i EPD – EPD Polska",
      "Przewodniczący Komitetu Technicznego (TC) EPD Polska",
    ],
    expertise: [
      "Zakładowa Kontrola Produkcji (ZKP)",
      "Systemy zarządzania jakością ISO",
      "Ocena cyklu życia (LCA)",
      "Deklaracje środowiskowe produktów (EPD)",
      "Norma EN 15804+A2",
      "Branża materiałów budowlanych",
    ],
    education: [
      "Politechnika Warszawska – Automatyka i Robotyka (inż.)",
      "Politechnika Warszawska – Budowa i eksploatacja maszyn (dr nauk technicznych)",
      "Szkoła Główna Handlowa – Manager Jakości (studia podyplomowe)",
      "Akademia Górniczo-Hutnicza – Współczesna ceramika budowlana wypalana (studia podyplomowe)",
      "Uniwersytet Warszawski – Zarządzanie Projektami (studia podyplomowe)",
    ],
    awards: [
      "2012 – Finalista III edycji Polska Nagroda Jakości; tytuł: Znakomity Pełnomocnik Systemów Zarządzania (nagroda wręczona przez Wicepremiera, Ministra Gospodarki Waldemara Pawlaka)",
    ],
    publications: [
      {
        title: "Systemy AVS – Ocena i Weryfikacja Wyrobów Budowlanych (CPR 2024/3110)",
        year: 2025,
        description: "Kompleksowy przegląd sześciu systemów AVS — w tym nowego Systemu 3+ dla danych środowiskowych — z perspektywy audytora certyfikującego.",
        url: "/blog/systemy-avcp",
      },
      {
        title: "GWP w CPR 2024 — kiedy stanie się obowiązkowe i jak zbierać dane już teraz",
        year: 2025,
        description: "Analiza mechanizmu uruchamiania obowiązku deklarowania śladu węglowego (GWP) w kontekście harmonogramu norm zharmonizowanych.",
        url: "/blog/gwp-obowiazkowe-cpr-2024",
      },
      {
        title: "Kary za naruszenie CPR 2024 — co grozi producentowi za brak CE i DoP&C",
        year: 2025,
        description: "Przegląd sankcji art. 92 CPR 2024/3110 z komentarzem praktycznym dotyczącym najczęstszych naruszeń.",
        url: "/blog/kary-naruszenie-cpr-2024",
      },
      {
        title: "Nadzór rynku wyrobów budowlanych — GUNB i kontrole",
        year: 2025,
        description: "Praktyczny przewodnik po przebiegu kontroli GUNB z perspektywy doradcy uczestniczącego w postępowaniach nadzorczych.",
        url: "/blog/nadzor-rynku-gunb",
      },
      {
        title: "Zakładowa Kontrola Produkcji (FPC) — wymagania i wdrożenie",
        year: 2025,
        description: "Wymagania FPC według CPR 2024/3110 z analizą najczęstszych błędów stwierdzanych podczas inspekcji jednostek notyfikowanych.",
        url: "/blog/zakladowa-kontrola-produkcji-fpc",
      },
      {
        title: "Jednostki notyfikowane — jak wybrać partnera do certyfikacji?",
        year: 2025,
        description: "Kryteria oceny jednostek notyfikowanych i pułapki, których należy unikać przy wyborze partnera certyfikacyjnego.",
        url: "/blog/jednostki-notyfikowane-wybor",
      },
    ],
  },

  "mikolaj-junosza-szaniawski": {
    slug: "mikolaj-junosza-szaniawski",
    name: "Mikołaj Junosza-Szaniawski",
    shortTitle: "Zarządzający programem EPD Polska",
    shortBio:
      "Specjalista ESG i zrównoważonego rozwoju. MBA (Carlson School of Management, Univ. of Minnesota), szkolenia LCA w MIT. Przez ponad 25 lat w KPMG jako Dyrektor ds. audytów niefinansowych. Wykładowca ESG na Akademii Leona Koźmińskiego. Zarządzający programem EPD Polska.",
    fullBio:
      "Mikołaj Junosza-Szaniawski jest specjalistą w dziedzinie zrównoważonego rozwoju i ESG. Posiada tytuł MBA z Carlson School of Management (University of Minnesota) oraz ukończył specjalistyczne szkolenia z analizy cyklu życia (LCA) w Massachusetts Institute of Technology (MIT).\n\nPrzez ponad 25 lat związany z KPMG, gdzie jako Dyrektor w dziale audytów niefinansowych nadzorował kluczowe projekty z zakresu raportowania zrównoważonego rozwoju. Jest wykładowcą ESG na Akademii Leona Koźmińskiego.\n\nAktualnie zarządza programem EPD Polska — krajowym systemem weryfikacji i rejestracji Deklaracji Środowiskowych Wyrobu dla branży budowlanej.",
    roles: [
      "Zarządzający programem EPD Polska",
      "Wykładowca ESG — Akademia Leona Koźmińskiego",
      "Były Dyrektor, audyty niefinansowe — KPMG",
    ],
    expertise: [
      "Analiza cyklu życia (LCA)",
      "Deklaracje środowiskowe EPD",
      "Raportowanie ESG i zrównoważonego rozwoju",
      "Audyty niefinansowe",
      "EN 15804+A2 i normy środowiskowe",
    ],
    education: [
      "Carlson School of Management, University of Minnesota — MBA",
      "Massachusetts Institute of Technology (MIT) — szkolenia LCA",
    ],
    awards: [],
    publications: [
      {
        title: "EPD w budownictwie — Deklaracje Środowiskowe Wyrobu",
        year: 2025,
        description: "Jak działa EPD, kiedy jest wymagane i jak zbierać dane do obliczeń LCA.",
        url: "/blog/epd-w-budownictwie",
      },
      {
        title: "AVS 3+ — walidacja EPD przez jednostkę notyfikowaną",
        year: 2025,
        description: "Nowy system weryfikacji danych środowiskowych w CPR 2024/3110 — co oznacza raport walidacyjny i jak różni się od certyfikatu wyrobu.",
        url: "/blog/avs-3plus-walidacja-epd",
      },
      {
        title: "GWP w CPR 2024 — kiedy stanie się obowiązkowe i jak zbierać dane już teraz",
        year: 2025,
        description: "Mechanizm uruchamiania obowiązku deklarowania śladu węglowego w powiązaniu z harmonogramem norm zharmonizowanych.",
        url: "/blog/gwp-obowiazkowe-cpr-2024",
      },
    ],
  },

  "grzegorz-suwara": {
    slug: "grzegorz-suwara",
    name: "Grzegorz Suwara",
    shortTitle: "Prezes zarządu Multicert Sp. z o.o.",
    shortBio:
      "Ekspert w zakresie systemów zarządzania (ISO 14001, ISO 50001) i oceny zgodności wyrobów. Ukończył studia doktoranckie na Wydziale Zarządzania UW. Były dyrektor zarządzający w ECO Solution. Prezes zarządu Multicert Sp. z o.o. — akredytowanej jednostki certyfikującej wyroby budowlane.",
    fullBio:
      "Grzegorz Suwara jest ekspertem w zakresie systemów zarządzania — w tym ISO 14001 i ISO 50001 — oraz oceny zgodności wyrobów. Ukończył studia doktoranckie na Wydziale Zarządzania Uniwersytetu Warszawskiego.\n\nJako były dyrektor zarządzający w ECO Solution realizował projekty środowiskowe, w tym raporty oddziaływania na środowisko i due diligence dla kluczowych sektorów gospodarki.\n\nAktualnie pełni funkcję Prezesa zarządu Multicert Sp. z o.o. — akredytowanej jednostki certyfikującej wyroby budowlane (PCA nr AC 210), specjalizującej się w certyfikacji ZKP i EPD dla sektora budowlanego.",
    roles: [
      "Prezes zarządu — Multicert Sp. z o.o.",
      "Były dyrektor zarządzający — ECO Solution",
    ],
    expertise: [
      "Ocena zgodności wyrobów budowlanych",
      "Systemy zarządzania ISO 14001, ISO 50001",
      "Certyfikacja ZKP wyrobów budowlanych",
      "Środowiskowe due diligence",
    ],
    education: [
      "Uniwersytet Warszawski, Wydział Zarządzania — studia doktoranckie",
    ],
    awards: [],
    publications: [
      {
        title: "CPR 2024/3110 — Nowe Rozporządzenie o Wyrobach Budowlanych",
        year: 2025,
        description: "Kompletny przewodnik po CPR 2024/3110 — kluczowe zmiany, harmonogram wdrożenia, nowy system AVS i wymagania środowiskowe.",
        url: "/blog/cpr-2024-nowe-rozporzadzenie",
      },
      {
        title: "Certyfikacja wyrobów budowlanych krok po kroku",
        year: 2026,
        description: "Od badań ITT do oznakowania CE — kompletny przewodnik procesowy dla producentów.",
        url: "/blog/certyfikacja-krok-po-kroku",
      },
    ],
  },

  "izabela-sztamberek-sochan": {
    slug: "izabela-sztamberek-sochan",
    name: "Izabela Sztamberek-Sochan",
    shortTitle: "Koordynator programu EPD Polska",
    shortBio:
      "Doktor nauk środowiskowych, ekspert w dziedzinie gospodarki o obiegu zamkniętym i recyklingu. Doświadczenie z MPO Warszawa i laboratorium Elab. W EPD Polska koordynuje administrację programu i prace Komitetu Technicznego ds. weryfikacji i certyfikacji EPD.",
    fullBio:
      "dr Izabela Sztamberek-Sochan jest doktorem nauk środowiskowych i ekspertem w dziedzinie gospodarki o obiegu zamkniętym i recyklingu.\n\nDoświadczenie zawodowe zdobywała m.in. w MPO w Warszawie oraz w laboratorium badawczym Elab, gdzie realizowała projekty z zakresu środowiskowej oceny wyrobów i procesów.\n\nW programie EPD Polska odpowiada za administrację programu oraz koordynację prac Komitetu Technicznego, zapewniając sprawne funkcjonowanie procesów weryfikacji i certyfikacji Deklaracji Środowiskowych Wyrobu.",
    roles: [
      "Koordynator programu EPD Polska",
      "Ekspert ds. gospodarki o obiegu zamkniętym",
    ],
    expertise: [
      "Gospodarka o obiegu zamkniętym (GOZ)",
      "Recykling i analiza środowiskowa wyrobów",
      "Weryfikacja i certyfikacja EPD",
      "Ocena oddziaływania na środowisko",
    ],
    education: [
      "Doktor nauk środowiskowych",
    ],
    awards: [],
    publications: [
      {
        title: "EPD w budownictwie — Deklaracje Środowiskowe Wyrobu",
        year: 2025,
        description: "Jak działa EPD, kiedy jest wymagane i jak zbierać dane do obliczeń LCA.",
        url: "/blog/epd-w-budownictwie",
      },
      {
        title: "Oznakowanie ekologiczne wyrobów budowlanych w CPR 2024",
        year: 2026,
        description: "Ecodesign, etykiety energetyczne i kryteria środowiskowe w kontekście CPR 2024/3110.",
        url: "/blog/oznakowanie-ekologiczne-cpr-2024",
      },
      {
        title: "GPP — Zielone Zamówienia Publiczne a CPR 2024",
        year: 2025,
        description: "Jak CPR 2024/3110 i dane środowiskowe EPD wspierają spełnienie kryteriów zielonych zamówień publicznych.",
        url: "/blog/gpp-zielone-zamowienia-publiczne-cpr-2024",
      },
    ],
  },

  "violetta-gladysz-oczalska": {
    slug: "violetta-gladysz-oczalska",
    name: "Violetta Gładysz-Oczalska",
    shortTitle: "Niezależna audytorka i ekspert techniczny — wyroby budowlane CPR 2024",
    shortBio:
      "Mgr inż. chemik, absolwentka Akademii Górniczo-Hutniczej w Krakowie. Niezależna audytorka i ekspert techniczny z ponad dwudziestoletnim doświadczeniem w polskim i międzynarodowym sektorze certyfikacji wyrobów budowlanych. Specjalizuje się w ocenie zgodności pod CPR 2024/3110 oraz audytach Zakładowej Kontroli Produkcji (ZKP/FPC).",
    fullBio:
      "Violetta Gładysz-Oczalska — mgr inż. chemik, absolwentka Akademii Górniczo-Hutniczej w Krakowie. Niezależna audytorka i ekspert z ponad dwudziestoletnim doświadczeniem zawodowym w polskim i międzynarodowym sektorze certyfikacji.\n\nWspółpracuje jako audytor zewnętrzny i niezależny ekspert techniczny z wieloma jednostkami certyfikującymi w Polsce i za granicą — wśród nich z Multicert Sp. z o.o. (akredytowana przez PCA, AC 210) oraz w ekosystemie jednostki notyfikowanej ITC Zlín (NB 1023). Niezależny status oznacza, że nie jest związana z jednym podmiotem — jej oceny audytowe są przenoszalne i porównywalne między różnymi jednostkami w UE.\n\nSpecjalizuje się w ocenie zgodności wyrobów budowlanych pod CPR 2024/3110 oraz w audytach zakładowej kontroli produkcji (ZKP/FPC). Praktyka audytorska obejmuje wizyty na zakładach produkcyjnych w Polsce i za granicą, badania wyrobów pod kątem zasadniczych charakterystyk, weryfikację dokumentacji DoP/DoP&C oraz ocenę zgodności systemów wewnętrznej kontroli produkcji z wymaganiami norm zharmonizowanych.\n\nWykształcenie chemiczne stanowi techniczny fundament jej kompetencji audytorskich — pozwala na merytoryczną ocenę procesów produkcyjnych w branżach, w których właściwości wyrobu zależą od chemii surowców i przebiegu procesu technologicznego: cement, beton, prefabrykaty betonowe, chemia budowlana, wyroby izolacyjne, ceramika budowlana.\n\nZgodnie z ISO/IEC 17021-1 §5 i ISO/IEC 17065 §4.2 zachowuje pełną bezstronność wobec klientów audytowanych — nie świadczy usług doradczych dla podmiotów, których ocenia.",
    roles: [
      "Niezależna audytorka — wyroby budowlane CPR 2024/3110",
      "Ekspert techniczny współpracujący z jednostkami certyfikującymi w Polsce i UE",
      "Audytor zewnętrzny — Multicert Sp. z o.o. (PCA AC 210)",
      "Audytor w ekosystemie jednostki notyfikowanej ITC Zlín (NB 1023)",
    ],
    expertise: [
      "Ocena zgodności wyrobów budowlanych pod CPR 2024/3110",
      "Audyty Zakładowej Kontroli Produkcji (ZKP/FPC)",
      "Weryfikacja dokumentacji DoP/DoP&C",
      "Cement, beton i prefabrykaty betonowe",
      "Chemia budowlana i wyroby izolacyjne",
      "Ceramika budowlana",
    ],
    education: [
      "Akademia Górniczo-Hutnicza w Krakowie — mgr inż. (chemia)",
    ],
    awards: [],
    publications: [
      {
        title: "Zakładowa Kontrola Produkcji (FPC) — wymagania i wdrożenie",
        year: 2025,
        description: "Wymagania ZKP/FPC według CPR 2024/3110 z perspektywy audytora zewnętrznego prowadzącego inspekcje u producentów wyrobów budowlanych.",
        url: "/blog/zakladowa-kontrola-produkcji-fpc",
      },
      {
        title: "EN 206-1:2026 — klasy GWR dla betonu i dane GWP",
        year: 2026,
        description: "Klasy emisyjne GWR dla betonu, deklarowanie danych GWP i dokumentacja pod CPR 2024 — z perspektywy chemika i audytora.",
        url: "/blog/en-206-klasy-emisyjne-gwr-beton",
      },
      {
        title: "Dokumentacja techniczna wyrobu budowlanego w CPR 2024",
        year: 2026,
        description: "Co musi zawierać dokumentacja techniczna z perspektywy audytora prowadzącego ocenę zgodności i inspekcji jednostki certyfikującej.",
        url: "/blog/dokumentacja-techniczna-cpr-2024",
      },
      {
        title: "Jednostki notyfikowane — jak wybrać partnera do certyfikacji?",
        year: 2025,
        description: "Praktyczna perspektywa niezależnego audytora współpracującego z wieloma jednostkami notyfikowanymi w Polsce i za granicą.",
        url: "/blog/jednostki-notyfikowane-wybor",
      },
    ],
  },

  "tomasz-barto": {
    slug: "tomasz-barto",
    name: "Tomasz Barto",
    shortTitle: "Dyrektor ds. Certyfikacji wyrobów budowlanych i systemów zarządzania — Multicert",
    shortBio:
      "Członek zarządu i Dyrektor ds. Certyfikacji wyrobów budowlanych i systemów zarządzania w Multicert Sp. z o.o. — akredytowanej jednostce certyfikującej. Specjalista w zakresie oceny zgodności wyrobów budowlanych, systemów AVS/AVCP oraz wdrożeń ZKP i FPC u producentów.",
    fullBio:
      "Tomasz Barto pełni funkcję Członka zarządu oraz Dyrektora ds. Certyfikacji wyrobów budowlanych i systemów zarządzania w Multicert Sp. z o.o. (www.multicert.com.pl) — akredytowanej jednostce certyfikującej wyroby budowlane (PCA nr AC 210).\n\nJego obszar odpowiedzialności obejmuje nadzór nad procesami certyfikacji wyrobów budowlanych w systemach AVCP/AVS, audyty Zakładowej Kontroli Produkcji (ZKP/FPC) oraz certyfikację systemów zarządzania. Wieloletnia praktyka w jednostce notyfikowanej pozwala mu łączyć wiedzę regulacyjną z doświadczeniem audytorskim bezpośrednio z zakładów produkcyjnych.\n\nSpecjalizuje się w interpretacji wymagań norm zharmonizowanych, procedurach oceny zgodności CPR 2024/3110 oraz przygotowaniu producentów do inspekcji JN i nadzoru rynku.",
    roles: [
      "Członek zarządu — Multicert Sp. z o.o.",
      "Dyrektor ds. Certyfikacji wyrobów budowlanych i systemów zarządzania — Multicert Sp. z o.o.",
    ],
    expertise: [
      "Certyfikacja wyrobów budowlanych (AVS/AVCP)",
      "Zakładowa Kontrola Produkcji (ZKP/FPC)",
      "Systemy zarządzania ISO",
      "Ocena zgodności CPR 2024/3110",
      "Audyty jednostki notyfikowanej",
      "Oznakowanie CE i dokumentacja techniczna",
    ],
    education: [],
    awards: [],
    publications: [
      {
        title: "Oznakowanie CE w 2026 — co zmienia CPR 2024/3110",
        year: 2025,
        description: "Obowiązki producenta po wejściu w życie CPR 2024 — nowe wymagania dla oznakowania CE i deklaracji DoP&C.",
        url: "/blog/oznakowanie-ce-2026",
      },
      {
        title: "Dokumentacja techniczna wyrobu budowlanego w CPR 2024",
        year: 2026,
        description: "Kompletny przewodnik po wymaganiach dokumentacyjnych CPR 2024/3110 — co musi zawierać dokumentacja techniczna producenta.",
        url: "/blog/dokumentacja-techniczna-cpr-2024",
      },
      {
        title: "DoP&C — szablon i wyjaśnienia elementów deklaracji",
        year: 2026,
        description: "Jak prawidłowo wypełnić Deklarację Właściwości Użytkowych i Zgodności w świetle CPR 2024/3110.",
        url: "/blog/dopc-szablon-wyjasnienie",
      },
      {
        title: "Zakładowa Kontrola Produkcji (FPC) — wymagania CPR 2024",
        year: 2025,
        description: "Wymagania FPC w CPR 2024/3110 — co musi zawierać system ZKP i jak przebiega inspekcja JN.",
        url: "/blog/fpc-zakladowa-kontrola-produkcji",
      },
      {
        title: "Druk 3D i addytywne wytwarzanie wyrobów budowlanych — jak uzyskać CE bez normy zharmonizowanej",
        year: 2026,
        description: "Ścieżka certyfikacji ETA dla innowacyjnych wyrobów z druku 3D — betonów drukowanych, prefabrykatów i elementów addytywnych.",
        url: "/blog/druk-3d-cpr-2024",
      },
    ],
  },
};

/** Zwraca autora po slugu lub null */
export function getAuthorBySlug(slug: string): Author | null {
  return AUTHORS[slug] ?? null;
}

/** Mapuje wyświetlaną nazwę autora na slug strony bio */
const AUTHOR_NAME_TO_SLUG: Record<string, string> = {
  "dr inż. Robert Andrzej Dynarowski": "robert-dynarowski",
  "Robert Dynarowski": "robert-dynarowski",
  "dr inż. Robert, Andrzej Dynarowski": "robert-dynarowski",
  "dr inż. Robert Dynarowski": "robert-dynarowski",
  "Mikołaj Junosza-Szaniawski": "mikolaj-junosza-szaniawski",
  "Grzegorz Suwara": "grzegorz-suwara",
  "Izabela Sztamberek-Sochan": "izabela-sztamberek-sochan",
  "Tomasz Barto": "tomasz-barto",
  "Violetta Gładysz-Oczalska": "violetta-gladysz-oczalska",
  "Violetta Gładysz": "violetta-gladysz-oczalska",
  "mgr inż. Violetta Gładysz-Oczalska": "violetta-gladysz-oczalska",
};

/** Zwraca slug autora na podstawie pola `author` z frontmatter bloga */
export function getAuthorSlug(authorName: string): string | null {
  // sprawdź dokładne dopasowanie
  const direct = AUTHOR_NAME_TO_SLUG[authorName];
  if (direct) return direct;
  // sprawdź czy któryś klucz jest zawarty w nazwie
  for (const [key, slug] of Object.entries(AUTHOR_NAME_TO_SLUG)) {
    if (authorName.includes(key) || key.includes(authorName.replace(" | ", ""))) {
      return slug;
    }
  }
  return null;
}
