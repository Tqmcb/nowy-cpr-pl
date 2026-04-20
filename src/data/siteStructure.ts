// IA mapping: each page → section in global navigation
// Used by PageHeader (breadcrumb + section label) and RelatedPages (sibling links)

export type SectionKey = "czy-dotyczy" | "kiedy" | "jak" | "uslugi" | "aktualnosci" | "meta";

export interface PageMeta {
  path: string;
  label: string;          // short, for breadcrumb and nav
  title?: string;         // long, for <h1>
  titleAccent?: string;   // part of title rendered in italic brand-red
  description?: string;   // lede paragraph under h1
  section: SectionKey;
}

export interface SectionMeta {
  key: SectionKey;
  num: string;            // "01", "02", …
  label: string;          // kicker: "Czy mnie dotyczy?"
  intent: string;         // one-line user intent
}

export const SECTIONS: Record<SectionKey, SectionMeta> = {
  "czy-dotyczy": {
    key: "czy-dotyczy",
    num: "01",
    label: "Czy mnie dotyczy?",
    intent: "Sprawdź czy Twój produkt podlega CPR i jakich norm musi przestrzegać",
  },
  "kiedy": {
    key: "kiedy",
    num: "02",
    label: "Kiedy to wchodzi",
    intent: "Harmonogram, terminy przejściowe i status obowiązywania",
  },
  "jak": {
    key: "jak",
    num: "03",
    label: "Jak się przygotować",
    intent: "Narzędzia, dokumenty i ścieżka dojścia do zgodności",
  },
  "uslugi": {
    key: "uslugi",
    num: "04",
    label: "Usługi",
    intent: "Profesjonalne wsparcie przy certyfikacji",
  },
  "aktualnosci": {
    key: "aktualnosci",
    num: "05",
    label: "Aktualności",
    intent: "Blog ekspercki i komentarze redakcyjne",
  },
  "meta": {
    key: "meta",
    num: "·",
    label: "Informacje",
    intent: "O portalu, kontakt, polityka",
  },
};

export const PAGES: PageMeta[] = [
  // 01 · Czy mnie dotyczy?
  {
    path: "/wyszukiwarka",
    label: "Wyszukiwarka wymagań",
    title: "Wyszukiwarka",
    titleAccent: "wymagań",
    description: "Wybierz kategorię wyrobu budowlanego, aby zobaczyć wymagania, normy i obowiązki zgodne z CPR (EU) 2024/3110.",
    section: "czy-dotyczy",
  },
  {
    path: "/wyroby",
    label: "Katalog wyrobów",
    title: "Katalog",
    titleAccent: "wyrobów",
    description: "Przeglądaj wszystkie grupy wyrobów budowlanych objętych CPR — znajdź swój produkt i sprawdź status regulacyjny.",
    section: "czy-dotyczy",
  },

  // 02 · Kiedy to wchodzi
  {
    path: "/harmonogram",
    label: "Harmonogram",
    title: "Harmonogram",
    titleAccent: "CPR",
    description: "Kluczowe daty, terminy przejściowe i kamienie milowe wdrożenia rozporządzenia o wyrobach budowlanych.",
    section: "kiedy",
  },

  // 03 · Jak się przygotować
  {
    path: "/sciezka-ce",
    label: "Ścieżka do CE",
    title: "Ścieżka do",
    titleAccent: "oznakowania CE",
    description: "Krok po kroku — jak dojść do zgodności z CPR dla Twojego produktu. Interaktywna checklista.",
    section: "jak",
  },
  {
    path: "/generator-ce",
    label: "Generator etykiety CE",
    title: "Generator",
    titleAccent: "etykiety CE",
    description: "Podgląd i wydruk etykiety CE zgodnej z wymaganiami CPR 2024/3110.",
    section: "jak",
  },
  {
    path: "/documents",
    label: "Wzory dokumentów",
    title: "Wzory",
    titleAccent: "dokumentów",
    description: "DoP&C, deklaracje zgodności, dokumentacja techniczna — gotowe szablony do pobrania.",
    section: "jak",
  },
  {
    path: "/faq",
    label: "FAQ",
    title: "Pytania i",
    titleAccent: "odpowiedzi",
    description: "Najczęstsze pytania producentów, importerów i dystrybutorów w kontekście CPR 2024/3110.",
    section: "jak",
  },

  // 04 · Usługi
  {
    path: "/services",
    label: "Usługi certyfikacyjne",
    title: "Usługi",
    titleAccent: "certyfikacyjne",
    description: "Profesjonalne wsparcie w procesie certyfikacji i przygotowania dokumentacji zgodnej z CPR.",
    section: "uslugi",
  },

  // 05 · Aktualności
  {
    path: "/blog",
    label: "Blog",
    title: "Blog",
    titleAccent: "ekspercki",
    description: "Aktualności, komentarze i przewodniki dotyczące CPR 2024/3110.",
    section: "aktualnosci",
  },

  // meta
  {
    path: "/o-portalu",
    label: "O portalu",
    title: "O",
    titleAccent: "portalu",
    description: "Kim jesteśmy i dlaczego powstał NowyCPR.pl.",
    section: "meta",
  },
  {
    path: "/kontakt",
    label: "Kontakt",
    title: "Kontakt",
    description: "Napisz do redakcji.",
    section: "meta",
  },
];

export function getPageMeta(path: string): PageMeta | undefined {
  // exact match first
  const exact = PAGES.find(p => p.path === path);
  if (exact) return exact;
  // prefix match for /blog/:slug etc.
  return PAGES.find(p => path.startsWith(p.path + "/"));
}

export function getSiblingPages(path: string): PageMeta[] {
  const meta = getPageMeta(path);
  if (!meta) return [];
  return PAGES.filter(p => p.section === meta.section && p.path !== meta.path);
}

export function getSection(path: string): SectionMeta | undefined {
  const meta = getPageMeta(path);
  if (!meta) return undefined;
  return SECTIONS[meta.section];
}
