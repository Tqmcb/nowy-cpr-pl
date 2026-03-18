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
        title:
          "Inwentaryzacja Cyklu Życia (LCI) Mieszanek Mineralno-Asfaltowych (MMA) w Polsce",
        year: 2026,
        description:
          "Dataset z danymi domyślnymi (default data) zgodny z EN 15804+A2, zakres: moduły A1–A3 (cradle-to-gate). Raport opracowany zgodnie z EN 15804:2012+A2:2019 oraz c-PCR dla mieszanek bitumicznych (DN-PAV-03077, 2024). Obejmuje analizę wytwórni cyklicznych i ciągłych, wskaźniki GWP dla MMA produkowanych w Polsce.",
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
