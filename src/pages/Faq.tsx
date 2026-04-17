import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Container } from "../components/Container";
import {
  Search,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  Scale,
  Building2,
  FileText,
  Shield,
  Clock,
  Leaf,
  Globe,
  AlertTriangle,
} from "lucide-react";

// ────────────────────────────────────────────────────────────────────────────
// DATA
// ────────────────────────────────────────────────────────────────────────────

type FaqCategory =
  | "ogolne"
  | "producent"
  | "certyfikacja"
  | "dokumentacja"
  | "eta-normy"
  | "srodowisko"
  | "import"
  | "sankcje";

interface FaqItem {
  question: string;
  answer: string;
  category: FaqCategory;
  keywords: string[]; // extra keywords for search
}

const CATEGORY_CONFIG: Record<FaqCategory, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  ogolne: { label: "Ogólne", icon: HelpCircle, color: "text-amber-400" },
  producent: { label: "Producent", icon: Building2, color: "text-sky-400" },
  certyfikacja: { label: "Certyfikacja i AVS", icon: Shield, color: "text-emerald-400" },
  dokumentacja: { label: "Dokumentacja", icon: FileText, color: "text-orange-400" },
  "eta-normy": { label: "ETA i normy", icon: Scale, color: "text-violet-400" },
  srodowisko: { label: "Środowisko / GWP", icon: Leaf, color: "text-green-400" },
  import: { label: "Import i eksport", icon: Globe, color: "text-cyan-400" },
  sankcje: { label: "Sankcje i nadzór", icon: AlertTriangle, color: "text-rose-400" },
};

const FAQ_DATA: FaqItem[] = [
  // ── OGÓLNE ──
  {
    question: "Co to jest CPR 2024/3110 i czym różni się od CPR 305/2011?",
    answer:
      "Rozporządzenie (UE) 2024/3110 (CPR 2024) to nowe rozporządzenie o wyrobach budowlanych, które docelowo zastapi Rozporządzenie 305/2011. Kluczowe zmiany (wchodzace w zycie stopniowo, po publikacji nowych zharmonizowanych specyfikacji technicznych — hTS): zastapienie Deklaracji Wlasciwosci Uzytkowych (DoP) nowa Deklaracja Wlasciwosci Uzytkowych i Zgodnosci (DoP&C), nowy system oceny AVS zamiast AVCP, obowiazkowe deklarowanie GWP (potencjalu globalnego ocieplenia), wprowadzenie Cyfrowego Paszportu Produktu (DPP) oraz rozszerzone obowiazki dla importerow i dystrybutorow. **Uwaga**: Dopoki nie zostana opublikowane hTS dla danej rodziny wyrobow, producenci nadal stosuja dotychczasowe normy hEN i systemy AVCP.",
    category: "ogolne",
    keywords: ["CPR", "305/2011", "2024/3110", "zmiana", "nowe rozporządzenie"],
  },
  {
    question: "Kiedy nowe przepisy CPR 2024 zaczęły obowiązywać?",
    answer:
      "CPR 2024 weszlo w zycie 7 stycznia 2025 r. (20 dni po publikacji w Dz.U. UE). Od 8 stycznia 2026 r. stosuja sie przepisy ramowe (definicje, ramy instytucjonalne, nadzor rynku). **Jednak konkretne obowiazki produktowe** — wystawianie DoP&C zamiast DoP, stosowanie systemu AVS, nowe oznakowanie CE — wchodza w zycie **dopiero po opublikowaniu nowych zharmonizowanych specyfikacji technicznych (hTS)** dla danej rodziny wyrobow. Do tego czasu producenci stosuja dotychczasowe normy hEN i wystawiaja DoP na starych zasadach. Sankcje za naruszenia obowiazuja od 8 stycznia 2027 r. Okres przejsciowy konczy sie 7 stycznia 2040 r.",
    category: "ogolne",
    keywords: ["termin", "data", "wejście w życie", "okres przejściowy", "2025", "2026"],
  },
  {
    question: "Jakie wyroby budowlane podlegają CPR 2024?",
    answer:
      "CPR 2024 obejmuje wszystkie wyroby budowlane w rozumieniu Art. 2 — tj. każdy wyrób lub zestaw produkowany i wprowadzany do obrotu w celu trwałego wbudowania w obiekty budowlane, którego właściwości użytkowe wpływają na spełnienie podstawowych wymagań dotyczących obiektów budowlanych. Dotyczy to m.in.: cementu, okien, izolacji, stali zbrojeniowej, wyrobów betonowych, pokryć dachowych, rur, kabli i wielu innych rodzin wyrobów wymienionych w Załączniku VII.",
    category: "ogolne",
    keywords: ["wyrób budowlany", "zakres", "definicja", "załącznik VII"],
  },

  // ── PRODUCENT ──
  {
    question: "Czy potrzebuję jednostki notyfikowanej (JN) do certyfikacji?",
    answer:
      "To zalezy od systemu oceny przypisanego do Twojego wyrobu. **Uwaga**: Nowy system AVS (z CPR 2024) zacznie obowiazywac dla danego wyrobu dopiero po publikacji odpowiedniej hTS. Do tego czasu obowiazuje dotychczasowy system AVCP z CPR 305/2011. Docelowo w systemie **AVS 1+** i **AVS 1** — tak, potrzebujesz certyfikatu wydanego przez jednostke notyfikowana (JN). W systemie **AVS 3** — NTL wykonuje badania typu (ITT), a JN wydaje certyfikat. W systemie **AVS 4** — producent samodzielnie deklaruje wlasciwosci. System AVCP/AVS danego wyrobu znajdziesz w obowiazujacej normie hEN lub w Zalaczniku V do CPR 2024.",
    category: "producent",
    keywords: ["jednostka notyfikowana", "JN", "certyfikat", "AVS 1+", "AVS 1", "AVS 3", "AVS 4"],
  },
  {
    question: "Ile trwa certyfikacja wyrobu budowlanego?",
    answer:
      "Czas certyfikacji zależy od wielu czynników: rodzaju wyrobu, systemu AVS, dostępności JN i kompletności dokumentacji. Orientacyjne terminy: **Badania typu (ITT)**: 4–12 tygodni (zależnie od normy). **Audyt ZKP (FPC)**: 2–4 tygodnie od zgłoszenia. **Wydanie certyfikatu**: 2–4 tygodnie po pozytywnym audycie. Łącznie, od złożenia wniosku do uzyskania certyfikatu, typowy proces trwa **3–6 miesięcy**. Przy dobrze przygotowanej dokumentacji i funkcjonującym systemie ZKP czas może być krótszy.",
    category: "producent",
    keywords: ["czas", "ile trwa", "termin", "miesiące", "ITT", "audyt"],
  },
  {
    question: "Ile kosztuje certyfikacja CPR?",
    answer:
      "Koszty certyfikacji zależą od systemu AVS, liczby norm, zakresu badań i wybranej JN. Szacunkowo: **Badania laboratoryjne (ITT)**: 3 000–20 000 PLN (zależnie od wyrobu i normy). **Audyt ZKP + certyfikat**: 5 000–15 000 PLN (jednorazowo). **Nadzór roczny**: 3 000–8 000 PLN. **Dokumentacja (DoP&C, instrukcje)**: od 2 000 PLN. Dla małych firm z jednym wyrobem łączny koszt to ok. 15 000–40 000 PLN, dla dużych producentów z wieloma wyrobami — proporcjonalnie więcej. Skontaktuj się z nami po indywidualną wycenę.",
    category: "producent",
    keywords: ["koszt", "cena", "ile kosztuje", "PLN", "wycena", "budżet"],
  },
  {
    question: "Czy mała firma / mikroprzedsiębiorstwo ma ułatwienia w CPR 2024?",
    answer:
      "Tak, CPR 2024 przewiduje pewne uproszczenia dla mikroprzedsiębiorstw (Art. 8). Mikroprzedsiębiorstwa mogą: stosować uproszczone procedury oceny w systemie AVS 4 (samodeklaracja), korzystać z uproszczonej dokumentacji technicznej oraz w niektórych przypadkach zastąpić badania typu (ITT) obliczeniami lub dokumentacją opartą na właściwych specyfikacjach technicznych. Ułatwienia NIE zwalniają z obowiązku wystawienia DoP&C i oznakowania CE.",
    category: "producent",
    keywords: ["mała firma", "mikro", "uproszczenia", "MSP", "Art. 8"],
  },

  // ── CERTYFIKACJA I AVS ──
  {
    question: "Czym system AVS różni się od starego AVCP?",
    answer:
      "System AVS (Assessment and Verification System) **docelowo zastapi** stary AVCP z CPR 305/2011 — ale dopiero po publikacji nowych hTS dla danej rodziny wyrobow. Do tego czasu obowiazuja dotychczasowe systemy AVCP. **Roznice miedzy AVS (CPR 2024) a AVCP (CPR 305/2011)**: AVCP mial 5 systemow: 1+, 1, 2+, 3, 4. AVS ma 6 systemow: **1+, 1, 2+, 3, 3+, 4** — system 3+ jest zupelnie nowy i dotyczy walidacji danych srodowiskowych (EPD/LCA). **System 2+** — zostaje, ale zmienia sie zakres obowiazkow JN. **AVS 3** — JN potwierdza okreslenie typu produktu przez producenta (zmiana wzgledem AVCP 3). **AVS 3+** (nowy) — NTL waliduje dane srodowiskowe (LCA/EPD). **AVS 4** — producent odpowiada za wszystko samodzielnie.",
    category: "certyfikacja",
    keywords: ["AVS", "AVCP", "system oceny", "1+", "2+", "2", "zmiana"],
  },
  {
    question: "Jak wybrać właściwą jednostkę notyfikowaną (JN)?",
    answer:
      "Przy wyborze JN sprawdź: **1. Zakres notyfikacji** — JN musi być notyfikowana dla Twojej normy/rodziny wyrobów (sprawdź w bazie NANDO). **2. Akredytacja** — JN powinna być akredytowana przez krajowe ciało akredytacyjne (w PL — PCA). **3. Doświadczenie** — preferuj JN z doświadczeniem w Twojej branży. **4. Czas realizacji** — zapytaj o terminy (audyt, badania, certyfikat). **5. Koszty** — porównaj oferty kilku JN. **6. Język** — komunikacja i dokumentacja w języku zrozumiałym. W Polsce działa kilkanaście JN dla wyrobów budowlanych, m.in. ITB, IMBiGS, Multicert.",
    category: "certyfikacja",
    keywords: ["wybór JN", "NANDO", "akredytacja", "PCA", "notyfikacja"],
  },
  {
    question: "Co to jest ZKP (Zakładowa Kontrola Produkcji / FPC)?",
    answer:
      "ZKP (FPC — Factory Production Control) to staly, wewnetrzny system kontroli produkcji prowadzony przez producenta, zgodny z wymaganiami odpowiedniej normy zharmonizowanej. Obejmuje: kontrole surowcow, monitorowanie procesu produkcji, badania wyrobu gotowego, kalibracje sprzetu, zarzadzanie reklamacjami i dzialania korygujace. Obecnie (wg AVCP z CPR 305/2011): w systemie 1+ i 1 ZKP jest poddawany inspekcji przez JN. Docelowo (wg AVS z CPR 2024, po publikacji hTS): zasady pozostaja podobne, ale zmienia sie numeracja systemow. Dokumentacja ZKP musi byc przechowywana przez min. 10 lat.",
    category: "certyfikacja",
    keywords: ["ZKP", "FPC", "kontrola produkcji", "inspekcja", "audyt"],
  },

  // ── DOKUMENTACJA ──
  {
    question: "Co to jest DoP&C i czym różni się od starego DoP?",
    answer:
      "DoP&C (Deklaracja Wlasciwosci Uzytkowych i Zgodnosci) to nowy dokument wprowadzony przez CPR 2024, ktory **docelowo zastapi** dotychczasowa Deklaracje Wlasciwosci Uzytkowych (DoP). **Wazne**: Obowiazek wystawiania DoP&C zamiast DoP wchodzi w zycie dopiero po opublikowaniu nowej zharmonizowanej specyfikacji technicznej (hTS) dla danej rodziny wyrobow. Do tego czasu producenci wystawiaja DoP na dotychczasowych zasadach. **Kluczowe roznice DoP&C vs DoP**: DoP&C laczy deklaracje wlasciwosci uzytkowych z deklaracja zgodnosci. Zawiera dodatkowe informacje o: substancjach niebezpiecznych (SVHC), danych srodowiskowych (GWP — po wejsciu w zycie hTS), danych do DPP. Format DoP&C jest ustandaryzowany w Zalaczniku III CPR 2024.",
    category: "dokumentacja",
    keywords: ["DoP&C", "DoP", "deklaracja", "deklaracja zgodności", "wzór"],
  },
  {
    question: "Jak prawidłowo oznaczyć wyrób znakiem CE?",
    answer:
      "Oznakowanie CE na wyrobie budowlanym musi zawierać (Art. 20 CPR 2024): **1.** Litery \u201ECE\u201D w odpowiedniej proporcji (min. 5 mm). **2.** Numer identyfikacyjny JN (dla AVS 1+, 1, 2+, 3). **3.** Nazwę i adres producenta. **4.** Ostatnie dwie cyfry roku, w którym oznakowanie zostało po raz pierwszy umieszczone. **5.** Numer referencyjny DoP&C. **6.** Numer normy zharmonizowanej lub EAD. **7.** Deklarowane właściwości użytkowe. **8.** Odniesienie do DoP&C (np. link, QR kod). Oznakowanie umieszcza się na wyrobie, opakowaniu lub dokumentach towarzyszących.",
    category: "dokumentacja",
    keywords: ["CE", "oznakowanie", "etykieta", "symbol", "znak"],
  },
  {
    question: "Co to jest Cyfrowy Paszport Produktu (DPP)?",
    answer:
      "Cyfrowy Paszport Produktu (DPP — Digital Product Passport) to elektroniczny dokument przypisany do wyrobu, umożliwiający cyfrowe śledzenie jego cech w całym cyklu życia. DPP będzie zawierał: identyfikację wyrobu i producenta, DoP&C, dane środowiskowe (GWP, LCA), informacje o substancjach niebezpiecznych, instrukcje dotyczące ponownego użycia i recyklingu. DPP będzie obowiązkowy po opublikowaniu odpowiednich zharmonizowanych specyfikacji technicznych (hTS). Przewidywany termin: **2028+** dla pierwszych rodzin wyrobów. Dostęp przez QR kod lub unikalny identyfikator wyrobu.",
    category: "dokumentacja",
    keywords: ["DPP", "paszport", "cyfrowy", "QR", "digital product passport"],
  },
  {
    question: "Jak długo muszę przechowywać dokumentację techniczną?",
    answer:
      "Zgodnie z CPR 2024, dokumentację techniczną (w tym DoP&C, raporty z badań, certyfikaty, dokumentację ZKP) należy przechowywać przez **10 lat** od daty wprowadzenia wyrobu do obrotu. Dotyczy to zarówno producenta, jak i importera. Dokumentacja musi być udostępniona na żądanie organów nadzoru rynku. Od 2027 r. DoP&C będzie mogła być przechowywana cyfrowo w systemie informatycznym Komisji Europejskiej.",
    category: "dokumentacja",
    keywords: ["przechowywanie", "10 lat", "archiwizacja", "dokumentacja techniczna"],
  },

  // ── ETA I NORMY ──
  {
    question: "Co z wyrobami z ETA? Czy moja ETA nadal jest ważna?",
    answer:
      "Europejskie Oceny Techniczne (ETA) wydane na podstawie CPR 305/2011 pozostają ważne w okresie przejściowym. **Kluczowe terminy**: Istniejące ETA wydane przed 8 stycznia 2026 r. mogą być stosowane do zakończenia ich ważności lub do **9 stycznia 2031 r.** (co nastąpi wcześniej). Po tej dacie ETA oparte na starych EAD tracą moc i producent musi uzyskać nową ETA lub przejść na normę zharmonizowaną. Nowe ETA będą wydawane na podstawie Europejskich Dokumentów Oceny (EAD) zgodnych z CPR 2024.",
    category: "eta-normy",
    keywords: ["ETA", "EAD", "ocena techniczna", "ważność", "2031"],
  },
  {
    question: "Czym jest norma zharmonizowana (hEN) i jak ją czytać?",
    answer:
      "Norma zharmonizowana (hEN) to norma europejska opracowana przez CEN/CENELEC na podstawie mandatu Komisji Europejskiej. Norma hEN określa metody badań i wymagania dla danej rodziny wyrobów. **Kluczowe elementy**: Załącznik ZA — obowiązkowa część normy, określa właściwości do zadeklarowania, system AVS i treść DoP&C. Tekst główny — metody badań, klasyfikacje, wymagania ogólne. Normy przywołane — inne EN, do których się odwołuje. Aktualne normy zharmonizowane publikowane są w Dzienniku Urzędowym UE. Sprawdź w naszym katalogu wyrobów, które normy dotyczą Twojego wyrobu.",
    category: "eta-normy",
    keywords: ["norma zharmonizowana", "hEN", "CEN", "Załącznik ZA", "metody badań"],
  },
  {
    question: "Kiedy pojawią się nowe normy zharmonizowane (hTS)?",
    answer:
      "CPR 2024 wprowadza pojęcie zharmonizowanych specyfikacji technicznych (hTS) zamiast dotychczasowych norm zharmonizowanych. Komisja Europejska będzie stopniowo zlecać opracowanie nowych hTS organizacjom normalizacyjnym. **Harmonogram**: Pierwsze hTS mogą pojawić się w **2027–2028**. Do tego czasu obowiązują istniejące hEN (normy zharmonizowane). Przejście na nowe hTS będzie stopniowe — z okresami przejściowymi dla każdej normy. Proces ten może potrwać do 2035–2040 r. dla pełnego pokrycia wszystkich rodzin wyrobów.",
    category: "eta-normy",
    keywords: ["hTS", "nowe normy", "specyfikacja techniczna", "harmonogram", "CEN"],
  },

  // ── ŚRODOWISKO ──
  {
    question: "Czy deklarowanie GWP jest już obowiązkowe?",
    answer:
      "**Jeszcze nie** — ale będzie. Obowiązkowe deklarowanie potencjału globalnego ocieplenia (GWP) wyrobu wejdzie w życie po opublikowaniu odpowiednich hTS (zharmonizowanych specyfikacji technicznych) dla danej rodziny wyrobów. Przewidywany termin: **2028+** dla pierwszych rodzin. Producenci powinni już teraz przygotowywać dane LCA (Life Cycle Assessment) i EPD (Environmental Product Declaration) zgodnie z EN 15804+A2. Metodyka obliczania GWP musi być zgodna z normami ISO 14040/44 i EN 15804.",
    category: "srodowisko",
    keywords: ["GWP", "ocieplenie", "globalny", "CO2", "deklaracja środowiskowa", "LCA"],
  },
  {
    question: "Co to jest EPD i czy jest obowiązkowa?",
    answer:
      "EPD (Environmental Product Declaration / Deklaracja Środowiskowa Produktu) to standardowy dokument opisujący wpływ wyrobu na środowisko w całym cyklu życia. Opracowywana wg EN 15804+A2. **Obecnie**: EPD nie jest obowiązkowa na mocy CPR, ale jest coraz częściej wymagana w przetargach publicznych (GPP — Green Public Procurement) i certyfikacji budynków (BREEAM, LEED). **W przyszłości**: CPR 2024 uczyni dane środowiskowe (w tym GWP z EPD) obowiązkowymi po wejściu w życie nowych hTS. Warto przygotować EPD już teraz.",
    category: "srodowisko",
    keywords: ["EPD", "deklaracja środowiskowa", "EN 15804", "BREEAM", "LEED", "przetarg"],
  },
  {
    question: "Czy muszę deklarować substancje niebezpieczne (SVHC)?",
    answer:
      "Tak. CPR 2024 (Art. 22) wymaga, aby producenci informowali o obecności substancji wzbudzających szczególnie duże obawy (SVHC z listy kandydackiej REACH) w stężeniu powyżej 0,1% masy wyrobu. Informacja ta musi się znaleźć w DoP&C. Producent musi: zidentyfikować SVHC obecne w wyrobie, podać ich nazwy i numery CAS w DoP&C, informować o bezpiecznym obchodzeniu się z wyrobem. Lista SVHC jest aktualizowana przez ECHA — sprawdzaj regularnie.",
    category: "srodowisko",
    keywords: ["SVHC", "REACH", "substancje niebezpieczne", "ECHA", "0,1%"],
  },

  // ── IMPORT ──
  {
    question: "Jakie obowiązki ma importer wyrobów budowlanych?",
    answer:
      "CPR 2024 znacznie rozszerza obowiązki importerów (Art. 22). Importer musi: **1.** Upewnić się, że producent przeprowadził prawidłową ocenę AVS. **2.** Zweryfikować, że wyrób posiada DoP&C i oznakowanie CE. **3.** Umieścić na wyrobie swoją nazwę i adres. **4.** Zapewnić, że wyrób jest transportowany i przechowywany prawidłowo. **5.** Prowadzić rejestr reklamacji i wycofań. **6.** Przechowywać kopię DoP&C przez 10 lat. **7.** Na żądanie organów — udostępnić całą dokumentację. Importer ponosi odpowiedzialność za zgodność wyrobu z CPR tak jak producent.",
    category: "import",
    keywords: ["importer", "import", "obowiązki", "Art. 22", "spoza UE"],
  },
  {
    question: "Jakie obowiązki ma dystrybutor wyrobów budowlanych?",
    answer:
      "Dystrybutor (Art. 23 CPR 2024) musi: **1.** Sprawdzić, że wyrób posiada oznakowanie CE i DoP&C. **2.** Upewnić się, że producent/importer podał swoją nazwę i adres. **3.** Nie wprowadzać do obrotu wyrobu, co do którego ma wątpliwości o zgodności. **4.** Zapewnić prawidłowe warunki przechowywania i transportu. **5.** Prowadzić ewidencję dostawców i odbiorców (umożliwiającą śledzenie). **6.** Współpracować z organami nadzoru rynku. Dystrybutor nie musi sam wystawiać DoP&C, ale odpowiada za to, aby dokumenty producenta/importera były dostępne.",
    category: "import",
    keywords: ["dystrybutor", "sprzedawca", "obowiązki", "Art. 23", "hurtownia"],
  },
  {
    question: "Czy mogę sprzedawać wyroby budowlane online?",
    answer:
      "Tak, ale CPR 2024 wprowadza specjalne wymagania dla sprzedaży online (Art. 25). Przy sprzedaży na odległość: DoP&C musi być udostępniona przed zakupem (np. na stronie produktu). Oznakowanie CE i wszystkie wymagane informacje muszą być widoczne w ofercie. Platformy handlowe (marketplace) mają obowiązek współpracować z organami nadzoru w usuwaniu ofert niespełniających wymagań. Sprzedaż online nie zwalnia z żadnych obowiązków dotyczących dokumentacji i oznakowania.",
    category: "import",
    keywords: ["online", "e-commerce", "internet", "marketplace", "sprzedaż na odległość"],
  },

  // ── SANKCJE ──
  {
    question: "Jakie kary grożą za naruszenie CPR 2024?",
    answer:
      "Od **8 stycznia 2027 r.** państwa członkowskie muszą ustanowić system sankcji (Art. 92). Kary obejmują: **Brak DoP&C lub fałszywa deklaracja** — grzywna administracyjna. **Brak oznakowania CE** — zakaz wprowadzania do obrotu + grzywna. **Niespełnienie wymagań ZKP** — cofnięcie certyfikatu przez JN. **Odmowa współpracy z nadzorem** — kary pieniężne. Wysokość kar ustala każde państwo członkowskie — w Polsce szczegóły określi nowelizacja ustawy o wyrobach budowlanych. Kary muszą być skuteczne, proporcjonalne i odstraszające.",
    category: "sankcje",
    keywords: ["kary", "sankcje", "grzywna", "Art. 92", "2027"],
  },
  {
    question: "Jak działa nadzór rynku (GUNB) w Polsce?",
    answer:
      "W Polsce nadzór rynku wyrobów budowlanych sprawuje GUNB (Główny Urząd Nadzoru Budowlanego) i WINB (wojewódzcy inspektorzy). Kontrole obejmują: **Wyrywkowe badania** wyrobów pobranych z rynku. **Kontrole dokumentacji** — DoP&C, certyfikaty, ZKP. **Kontrole oznakowania CE**. **Działania następcze**: nakaz wycofania z obrotu, zakaz udostępniania, kary pieniężne. CPR 2024 wzmacnia współpracę między organami nadzoru krajów UE (system RAPEX/Safety Gate, sieć ADCO). Producent ma obowiązek współpracować z organami nadzoru.",
    category: "sankcje",
    keywords: ["GUNB", "WINB", "nadzór", "kontrola", "RAPEX", "inspekcja"],
  },
  {
    question: "Co zrobić, gdy mój wyrób nie spełnia wymagań?",
    answer:
      "Jeśli stwierdzisz, że Twój wyrób nie spełnia wymagań CPR: **1.** Natychmiast podejmij działania korygujące (modyfikacja procesu, dodatkowe badania). **2.** Poinformuj JN (jeśli dotyczy systemu AVS 1+/1). **3.** Poinformuj organy nadzoru (GUNB/WINB) w krajach, gdzie wyrób został wprowadzony. **4.** Powiadom dystrybutorów i importerów. **5.** W razie potrzeby — wycofaj wyrób z obrotu lub od użytkowników. **6.** Udokumentuj podjęte działania. Brak działań korygujących po stwierdzeniu niezgodności skutkuje surowszymi sankcjami.",
    category: "sankcje",
    keywords: ["niezgodność", "wycofanie", "działania korygujące", "recall"],
  },
];

// ────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ────────────────────────────────────────────────────────────────────────────

export default function FaqPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<FaqCategory | "all">("all");
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return FAQ_DATA.filter((item) => {
      const matchesCategory = activeCategory === "all" || item.category === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [search, activeCategory]);

  // Count per category
  const categoryCounts = useMemo(() => {
    const q = search.toLowerCase().trim();
    const counts: Record<string, number> = { all: 0 };
    for (const cat of Object.keys(CATEGORY_CONFIG)) counts[cat] = 0;
    for (const item of FAQ_DATA) {
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.toLowerCase().includes(q));
      if (matchesSearch) {
        counts.all++;
        counts[item.category]++;
      }
    }
    return counts;
  }, [search]);

  const canonicalUrl = "https://www.nowycpr.pl/faq";
  const pageTitle = "FAQ — Najczęstsze pytania o CPR 2024/3110 | NowyCPR.pl";
  const pageDesc =
    "Odpowiedzi na najczęstsze pytania producentów o CPR 2024/3110: certyfikacja, DoP&C, AVS, koszty, ETA, GWP i więcej.";

  // FAQ Schema.org
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_DATA.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer.replace(/\*\*/g, ""),
      },
    })),
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <Header />
        <main id="main-content" className="flex-grow pt-24 pb-20">
          {/* ── HERO ── */}
          <section className="relative overflow-hidden pb-8">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-transparent" />
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-20 left-1/4 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl" />
              <div className="absolute top-40 right-1/3 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl" />
            </div>
            <Container>
              <div className="relative pt-8">
                <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
                  <button onClick={() => navigate("/")} className="hover:text-amber-400 transition-colors">
                    Strona główna
                  </button>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-white">FAQ</span>
                </nav>

                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400/15 border border-amber-400/30 text-amber-400">
                    <HelpCircle className="w-3 h-3" /> FAQ
                  </span>
                  <span className="text-xs text-slate-500">{FAQ_DATA.length} pytań</span>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl mb-4">
                  Najczęstsze pytania o CPR 2024
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl">
                  Odpowiedzi na pytania producentów, importerów i dystrybutorów wyrobów budowlanych.
                </p>
              </div>
            </Container>
          </section>

          {/* ── SEARCH BAR ── */}
          <Container>
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Szukaj pytania, np. &quot;DoP&C&quot;, &quot;koszt certyfikacji&quot;, &quot;ETA&quot;..."
                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/40 focus:ring-2 focus:ring-amber-400/10 transition-all text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors text-xs"
                >
                  Wyczyść
                </button>
              )}
            </div>
          </Container>

          {/* ── CATEGORY FILTERS ── */}
          <Container>
            <div className="flex flex-wrap gap-2 mb-8">
              <button
                onClick={() => setActiveCategory("all")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                  activeCategory === "all"
                    ? "bg-amber-400/20 border-amber-400/40 text-amber-400"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                }`}
              >
                Wszystkie
                <span className="text-[10px] opacity-60">({categoryCounts.all})</span>
              </button>
              {(Object.entries(CATEGORY_CONFIG) as [FaqCategory, typeof CATEGORY_CONFIG.ogolne][]).map(
                ([cat, config]) => {
                  const Icon = config.icon;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                        activeCategory === cat
                          ? "bg-amber-400/20 border-amber-400/40 text-amber-400"
                          : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      {config.label}
                      <span className="text-[10px] opacity-60">({categoryCounts[cat]})</span>
                    </button>
                  );
                }
              )}
            </div>
          </Container>

          {/* ── FAQ ACCORDION ── */}
          <Container>
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <HelpCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Brak wyników</h3>
                <p className="text-slate-400 text-sm">
                  Nie znaleziono pytań pasujących do &bdquo;{search}&rdquo;.{" "}
                  <button onClick={() => { setSearch(""); setActiveCategory("all"); }} className="text-amber-400 hover:underline">
                    Wyczyść filtry
                  </button>
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((item, index) => {
                  const globalIndex = FAQ_DATA.indexOf(item);
                  const isOpen = openItems.has(globalIndex);
                  const catConfig = CATEGORY_CONFIG[item.category];
                  const CatIcon = catConfig.icon;

                  return (
                    <div
                      key={globalIndex}
                      className={`border rounded-2xl transition-all duration-300 ${
                        isOpen
                          ? "bg-slate-800/60 border-amber-400/20 shadow-lg shadow-amber-400/5"
                          : "bg-slate-800/30 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <button
                        onClick={() => toggleItem(globalIndex)}
                        className="w-full flex items-start gap-4 p-5 text-left"
                        aria-expanded={isOpen}
                      >
                        <div className={`shrink-0 mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center ${isOpen ? "bg-amber-400/15" : "bg-white/5"}`}>
                          <CatIcon className={`w-4 h-4 ${isOpen ? "text-amber-400" : catConfig.color}`} />
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${isOpen ? "bg-amber-400/10 border-amber-400/20 text-amber-400" : "bg-white/5 border-white/10 text-slate-500"}`}>
                              {catConfig.label}
                            </span>
                          </div>
                          <h3
                            className={`font-semibold text-[15px] leading-snug transition-colors ${
                              isOpen ? "text-white" : "text-slate-200"
                            }`}
                          >
                            {item.question}
                          </h3>
                        </div>
                        <ChevronDown
                          className={`shrink-0 w-5 h-5 mt-1 transition-transform duration-300 ${
                            isOpen ? "rotate-180 text-amber-400" : "text-slate-500"
                          }`}
                        />
                      </button>

                      {/* Answer */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="px-5 pb-5 pl-[4.25rem]">
                          <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                            {item.answer.split(/(\*\*.*?\*\*)/).map((part, i) => {
                              if (part.startsWith("**") && part.endsWith("**")) {
                                return (
                                  <strong key={i} className="text-white font-semibold">
                                    {part.slice(2, -2)}
                                  </strong>
                                );
                              }
                              return <span key={i}>{part}</span>;
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Container>

          {/* ── CTA ── */}
          <section className="mt-16">
            <Container>
              <div className="bg-gradient-to-br from-amber-400/10 to-orange-500/10 border border-amber-400/20 rounded-2xl p-8 md:p-12 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Nie znalazłeś odpowiedzi?
                </h2>
                <p className="text-slate-400 max-w-xl mx-auto mb-6">
                  Skontaktuj się z naszymi ekspertami — pomożemy rozwiązać każdy problem związany z CPR 2024.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => navigate("/kontakt")}
                    className="flex items-center gap-2 px-6 py-3 bg-amber-400 text-slate-900 font-semibold rounded-xl hover:bg-amber-300 transition-colors"
                  >
                    Zadaj pytanie <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate("/services")}
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
                  >
                    Usługi certyfikacyjne <Shield className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Container>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
