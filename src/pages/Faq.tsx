import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PageHeader, RelatedPages } from "../components/PageHeader";
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
  ogolne: { label: "Ogólne", icon: HelpCircle, color: "text-[oklch(55% .22 27)]" },
  producent: { label: "Producent", icon: Building2, color: "text-[oklch(55% .22 27)]" },
  certyfikacja: { label: "Certyfikacja i AVS", icon: Shield, color: "text-[oklch(55% .22 27)]" },
  dokumentacja: { label: "Dokumentacja", icon: FileText, color: "text-[oklch(55% .22 27)]" },
  "eta-normy": { label: "ETA i normy", icon: Scale, color: "text-[oklch(55% .22 27)]" },
  srodowisko: { label: "Środowisko / GWP", icon: Leaf, color: "text-[oklch(55% .22 27)]" },
  import: { label: "Import i eksport", icon: Globe, color: "text-[oklch(55% .22 27)]" },
  sankcje: { label: "Sankcje i nadzór", icon: AlertTriangle, color: "text-[oklch(55% .22 27)]" },
};

const FAQ_DATA: FaqItem[] = [
  // ── OGÓLNE ──
  {
    question: "Co to jest CPR 2024/3110 i czym różni się od CPR 305/2011?",
    answer:
      "Rozporządzenie (UE) 2024/3110 (CPR 2024) to nowe rozporządzenie o wyrobach budowlanych, które docelowo zastąpi Rozporządzenie 305/2011. Kluczowe zmiany, wchodzące w życie stopniowo po publikacji nowych zharmonizowanych specyfikacji technicznych (hTS), to: zastąpienie Deklaracji Właściwości Użytkowych (DoP) nową Deklaracją Właściwości Użytkowych i Zgodności (DoP&C), nowy system oceny AVS zamiast AVCP, obowiązkowe deklarowanie GWP (potencjału globalnego ocieplenia), wprowadzenie Cyfrowego Paszportu Produktu (DPP) oraz rozszerzone obowiązki dla importerów i dystrybutorów. **Uwaga**: Dopóki nie zostaną opublikowane hTS dla danej rodziny wyrobów, producenci nadal stosują dotychczasowe normy hEN i systemy AVCP.",
    category: "ogolne",
    keywords: ["CPR", "305/2011", "2024/3110", "zmiana", "nowe rozporządzenie"],
  },
  {
    question: "Kiedy nowe przepisy CPR 2024 zaczęły obowiązywać?",
    answer:
      "CPR 2024 wszedł w życie 7 stycznia 2025 r. (20 dni po publikacji w Dz.U. UE). Od 8 stycznia 2026 r. stosuje się przepisy ramowe: definicje, ramy instytucjonalne oraz zasady nadzoru rynku. **Jednak konkretne obowiązki produktowe** — wystawianie DoP&C zamiast DoP, stosowanie systemu AVS i nowe oznakowanie CE — wchodzą w życie **dopiero po opublikowaniu nowych zharmonizowanych specyfikacji technicznych (hTS)** dla danej rodziny wyrobów. Do tego czasu producenci stosują dotychczasowe normy hEN i wystawiają DoP na starych zasadach. Sankcje za naruszenia obowiązują od 8 stycznia 2027 r. Okres przejściowy kończy się 7 stycznia 2040 r.",
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
      "To zależy od systemu oceny przypisanego do Twojego wyrobu. **Uwaga**: Nowy system AVS (z CPR 2024) zacznie obowiązywać dla danego wyrobu dopiero po publikacji odpowiedniej hTS. Do tego czasu obowiązuje dotychczasowy system AVCP z CPR 305/2011. Docelowo w systemie **AVS 1+** i **AVS 1** — tak, potrzebujesz certyfikatu wydanego przez jednostkę notyfikowaną (JN). W systemie **AVS 3** — JN wykonuje badania typu (ITT). W systemie **AVS 4** — producent samodzielnie deklaruje właściwości. System AVCP/AVS danego wyrobu znajdziesz w obowiązującej normie hEN lub w Załączniku V do CPR 2024.",
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
      "System AVS (Assessment and Verification of Constancy of Performance) **docelowo zastąpi** stary AVCP z CPR 305/2011, ale dopiero po publikacji nowych hTS dla danej rodziny wyrobów. Do tego czasu obowiązują dotychczasowe systemy AVCP. Główne różnice między AVS a AVCP są następujące: **Nowe nazewnictwo**: AVS 1+, 1, 2, 3, 4 zamiast 1+, 1, 2+, 3, 4. **Stary system 2+ znika** — zostaje zastąpiony przez AVS 2. **Rozszerzony zakres JN**: w AVS 1+ JN certyfikuje wyrób i nadzoruje ZKP, a w AVS 1 certyfikuje wyrób. **AVS 3**: JN wykonuje ITT, a nie tylko badania próbek. **AVS 4**: producent odpowiada za wszystko sam.",
    category: "certyfikacja",
    keywords: ["AVS", "AVCP", "system oceny", "1+", "2+", "2", "zmiana"],
  },
  {
    question: "Jak wybrać właściwą jednostkę notyfikowaną (JN)?",
    answer:
      "Przy wyborze JN sprawdź: **1. Zakres notyfikacji** — JN musi być notyfikowana dla Twojej normy/rodziny wyrobów (sprawdź w bazie NANDO). **2. Akredytacja** — JN powinna być akredytowana przez krajowe ciało akredytacyjne (w PL — PCA). **3. Doświadczenie** — preferuj JN z doświadczeniem w Twojej branży. **4. Czas realizacji** — zapytaj o terminy (audyt, badania, certyfikat). **5. Koszty** — porównaj oferty kilku JN. **6. Język** — komunikacja i dokumentacja w języku zrozumiałym. W Polsce działa kilkanaście JN dla wyrobów budowlanych — pełną listę znajdziesz w bazie NANDO prowadzonej przez Komisję Europejską.",
    category: "certyfikacja",
    keywords: ["wybór JN", "NANDO", "akredytacja", "PCA", "notyfikacja"],
  },
  {
    question: "Co to jest ZKP (Zakładowa Kontrola Produkcji / FPC)?",
    answer:
      "ZKP (FPC — Factory Production Control) to stały, wewnętrzny system kontroli produkcji prowadzony przez producenta, zgodny z wymaganiami odpowiedniej normy zharmonizowanej. Obejmuje: kontrolę surowców, monitorowanie procesu produkcji, badania wyrobu gotowego, kalibrację sprzętu, zarządzanie reklamacjami i działania korygujące. Obecnie, według AVCP z CPR 305/2011, w systemie 1+ i 1 ZKP jest poddawany inspekcji przez JN. Docelowo, według AVS z CPR 2024, po publikacji hTS zasady pozostaną podobne, ale zmieni się numeracja systemów. Dokumentacja ZKP musi być przechowywana przez co najmniej 10 lat.",
    category: "certyfikacja",
    keywords: ["ZKP", "FPC", "kontrola produkcji", "inspekcja", "audyt"],
  },

  // ── DOKUMENTACJA ──
  {
    question: "Co to jest DoP&C i czym różni się od starego DoP?",
    answer:
      "DoP&C (Deklaracja Właściwości Użytkowych i Zgodności) to nowy dokument wprowadzony przez CPR 2024, który **docelowo zastąpi** dotychczasową Deklarację Właściwości Użytkowych (DoP). **Ważne**: Obowiązek wystawiania DoP&C zamiast DoP wchodzi w życie dopiero po opublikowaniu nowej zharmonizowanej specyfikacji technicznej (hTS) dla danej rodziny wyrobów. Do tego czasu producenci wystawiają DoP na dotychczasowych zasadach. **Kluczowe różnice między DoP&C a DoP**: DoP&C łączy deklarację właściwości użytkowych z deklaracją zgodności. Zawiera dodatkowe informacje o substancjach niebezpiecznych (SVHC), danych środowiskowych (GWP — po wejściu w życie hTS) oraz danych do DPP. Format DoP&C jest ustandaryzowany w Załączniku III CPR 2024.",
    category: "dokumentacja",
    keywords: ["DoP&C", "DoP", "deklaracja", "deklaracja zgodności", "wzór"],
  },
  {
    question: "Jak prawidłowo oznaczyć wyrób znakiem CE?",
    answer:
      "Oznakowanie CE na wyrobie budowlanym musi zawierać (Art. 20 CPR 2024): **1.** Litery \u201ECE\u201D w odpowiedniej proporcji (min. 5 mm). **2.** Numer identyfikacyjny JN (dla AVS 1+, 1, 2). **3.** Nazwę i adres producenta. **4.** Ostatnie dwie cyfry roku, w którym oznakowanie zostało po raz pierwszy umieszczone. **5.** Numer referencyjny DoP&C. **6.** Numer normy zharmonizowanej lub EAD. **7.** Deklarowane właściwości użytkowe. **8.** Odniesienie do DoP&C (np. link, QR kod). Oznakowanie umieszcza się na wyrobie, opakowaniu lub dokumentach towarzyszących.",
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
      "CPR 2024 znacznie rozszerza obowiązki importerów (Art. 24). Importer musi: **1.** Upewnić się, że producent przeprowadził prawidłową ocenę AVS. **2.** Zweryfikować, że wyrób posiada DoP&C i oznakowanie CE. **3.** Umieścić na wyrobie swoją nazwę i adres. **4.** Zapewnić, że wyrób jest transportowany i przechowywany prawidłowo. **5.** Prowadzić rejestr reklamacji i wycofań. **6.** Przechowywać kopię DoP&C przez 10 lat. **7.** Na żądanie organów — udostępnić całą dokumentację. Importer ponosi odpowiedzialność za zgodność wyrobu z CPR tak jak producent.",
    category: "import",
    keywords: ["importer", "import", "obowiązki", "Art. 24", "spoza UE"],
  },
  {
    question: "Jakie obowiązki ma dystrybutor wyrobów budowlanych?",
    answer:
      "Dystrybutor (Art. 25 CPR 2024) musi: **1.** Sprawdzić, że wyrób posiada oznakowanie CE i DoP&C. **2.** Upewnić się, że producent/importer podał swoją nazwę i adres. **3.** Nie wprowadzać do obrotu wyrobu, co do którego ma wątpliwości o zgodności. **4.** Zapewnić prawidłowe warunki przechowywania i transportu. **5.** Prowadzić ewidencję dostawców i odbiorców (umożliwiającą śledzenie). **6.** Współpracować z organami nadzoru rynku. Dystrybutor nie musi sam wystawiać DoP&C, ale odpowiada za to, aby dokumenty producenta/importera były dostępne.",
    category: "import",
    keywords: ["dystrybutor", "sprzedawca", "obowiązki", "Art. 25", "hurtownia"],
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

      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <main id="main-content" className="flex-grow">
          <PageHeader>
            <span className="editorial-kicker" style={{ color: "oklch(55% .22 27)" }}>{FAQ_DATA.length} pytań w bazie</span>
          </PageHeader>

          {/* ── SEARCH BAR ── */}
          <section className="py-12 md:py-16 bg-white">
            <Container>
              <div className="max-w-6xl mx-auto">
                <div className="relative mb-8">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "oklch(60% .015 264)" }} />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Szukaj pytania — np. &quot;DoP&C&quot;, &quot;koszt certyfikacji&quot;, &quot;ETA&quot;..."
                    className="w-full pl-12 pr-4 py-4 bg-white focus:outline-none transition-all text-sm font-serif"
                    style={{ border: "1px solid oklch(86% .012 264)", borderRadius: "2px", color: "oklch(20% .03 264)" }}
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 editorial-kicker transition-colors hover:text-black"
                      style={{ color: "oklch(60% .015 264)" }}
                    >
                      Wyczyść
                    </button>
                  )}
                </div>

                {/* ── CATEGORY FILTERS ── */}
                <div className="flex flex-wrap gap-2 mb-10 pb-8" style={{ borderBottom: "1px solid oklch(92% .008 264)" }}>
                  <button
                    onClick={() => setActiveCategory("all")}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all"
                    style={{
                      backgroundColor: activeCategory === "all" ? "oklch(20% .03 264)" : "white",
                      color: activeCategory === "all" ? "white" : "oklch(42% .02 264)",
                      border: "1px solid " + (activeCategory === "all" ? "oklch(20% .03 264)" : "oklch(86% .012 264)"),
                      borderRadius: "2px",
                    }}
                  >
                    Wszystkie
                    <span className="opacity-60">({categoryCounts.all})</span>
                  </button>
                  {(Object.entries(CATEGORY_CONFIG) as [FaqCategory, typeof CATEGORY_CONFIG.ogolne][]).map(
                    ([cat, config]) => {
                      const Icon = config.icon;
                      const isActive = activeCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all"
                          style={{
                            backgroundColor: isActive ? "oklch(20% .03 264)" : "white",
                            color: isActive ? "white" : "oklch(42% .02 264)",
                            border: "1px solid " + (isActive ? "oklch(20% .03 264)" : "oklch(86% .012 264)"),
                            borderRadius: "2px",
                          }}
                        >
                          <Icon className="w-3 h-3" />
                          {config.label}
                          <span className="opacity-60">({categoryCounts[cat]})</span>
                        </button>
                      );
                    }
                  )}
                </div>

                {/* ── FAQ ACCORDION — editorial ── */}
                {filtered.length === 0 ? (
                  <div className="py-16 text-center">
                    <h3 className="font-serif text-2xl mb-2" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>Brak wyników</h3>
                    <p className="text-sm" style={{ color: "oklch(42% .02 264)" }}>
                      Nie znaleziono pytań pasujących do „{search}".{" "}
                      <button onClick={() => { setSearch(""); setActiveCategory("all"); }} className="underline" style={{ color: "oklch(55% .22 27)" }}>
                        Wyczyść filtry
                      </button>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-0" style={{ borderTop: "2px solid oklch(20% .03 264)" }}>
                    {filtered.map((item, index) => {
                      const globalIndex = FAQ_DATA.indexOf(item);
                      const isOpen = openItems.has(globalIndex);
                      const catConfig = CATEGORY_CONFIG[item.category];

                      return (
                        <div key={globalIndex} style={{ borderBottom: "1px solid oklch(92% .008 264)" }}>
                          <button
                            onClick={() => toggleItem(globalIndex)}
                            className="w-full grid grid-cols-12 gap-4 py-6 text-left group"
                            aria-expanded={isOpen}
                          >
                            <span className="col-span-1 editorial-numeral text-3xl" style={{ color: "oklch(55% .22 27)", fontWeight: 300 }}>
                              {String(globalIndex + 1).padStart(2, "0")}
                            </span>
                            <div className="col-span-10">
                              <div className="editorial-kicker mb-2" style={{ color: "oklch(55% .22 27)" }}>
                                {catConfig.label}
                              </div>
                              <h3 className="font-serif text-lg md:text-xl leading-[1.25] transition-all group-hover:italic" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>
                                {item.question}
                              </h3>
                            </div>
                            <ChevronDown
                              className="col-span-1 justify-self-end shrink-0 w-5 h-5 mt-1 transition-transform duration-300"
                              style={{
                                transform: isOpen ? "rotate(180deg)" : "none",
                                color: isOpen ? "oklch(55% .22 27)" : "oklch(60% .015 264)",
                              }}
                            />
                          </button>
                          <div
                            className="overflow-hidden transition-all duration-300"
                            style={{ maxHeight: isOpen ? "800px" : "0", opacity: isOpen ? 1 : 0 }}
                          >
                            <div className="grid grid-cols-12 gap-4 pb-6">
                              <div className="col-span-1" />
                              <div className="col-span-11 text-base leading-[1.7] whitespace-pre-line" style={{ color: "oklch(42% .02 264)" }}>
                                {item.answer.split(/(\*\*.*?\*\*)/).map((part, i) => {
                                  if (part.startsWith("**") && part.endsWith("**")) {
                                    return (
                                      <strong key={i} style={{ color: "oklch(20% .03 264)", fontWeight: 600 }}>
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
              </div>
            </Container>
          </section>

          {/* ── CTA — editorial dark ── */}
          <section className="py-20 md:py-24 bg-white">
            <Container>
              <div className="max-w-6xl mx-auto">
                <div className="relative py-12 md:py-16 px-8 md:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8" style={{ backgroundColor: "oklch(20% .03 264)" }}>
                  <div className="absolute top-0 left-0 h-[5px] w-24" style={{ backgroundColor: "oklch(55% .22 27)" }} />

                  <div className="max-w-2xl">
                    <div className="editorial-kicker mb-4" style={{ color: "oklch(55% .22 27)" }}>Nie znalazłeś odpowiedzi?</div>
                    <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.05] text-white" style={{ fontWeight: 500 }}>
                      Zadaj pytanie<br/>
                      <span className="italic" style={{ color: "oklch(75% .15 27)", fontWeight: 500 }}>naszym ekspertom.</span>
                    </h2>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                    <button
                      onClick={() => navigate("/kontakt")}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-white font-semibold whitespace-nowrap transition-all hover:bg-slate-100"
                      style={{ color: "oklch(20% .03 264)", borderRadius: "2px" }}
                    >
                      Zadaj pytanie <ChevronRight className="w-4 h-4 shrink-0" />
                    </button>
                    <button
                      onClick={() => navigate("/services")}
                      className="flex items-center justify-center gap-2 px-6 py-3 font-semibold whitespace-nowrap transition-all hover:bg-white/10"
                      style={{ border: "1px solid rgba(255,255,255,0.3)", color: "white", backgroundColor: "transparent", borderRadius: "2px" }}
                    >
                      Usługi certyfikacyjne <Shield className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        </main>
        <RelatedPages />
        <Footer />
      </div>
    </>
  );
}
