import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/extensions/shadcn/components/button";
import { Badge } from "@/extensions/shadcn/components/badge";
import { Skeleton } from "@/extensions/shadcn/components/skeleton";
import { subscribeToNewsletter, validateEmail } from "utils/newsletterHelpers";
import { toast } from "sonner";
import { Container } from "./Container";
import {
  Search,
  Clock,
  User,
  ChevronRight,
  BookOpen,
  Send,
  Mail,
  Filter,
  RefreshCw,
  FileText,
  Calendar,
  ArrowRight,
  Sparkles
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  published_at: string;
  updated_at?: string;
  is_published: boolean;
  category: string;
  image_url: string;
  tags?: string[];
}

// Komponent dla pustego stanu
const EmptyState = () => (
  <div className="text-center py-16 glass-card">
    <BookOpen className="h-16 w-16 mx-auto text-slate-500 mb-4" />
    <h3 className="text-lg font-medium text-white mb-2">Brak artykułów</h3>
    <p className="text-slate-400">Nie znaleziono artykułów spełniających kryteria wyszukiwania.</p>
  </div>
);

// Komponent wyświetlający stan ładowania
const LoadingState = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="glass-card overflow-hidden animate-pulse">
        <div className="h-48 bg-slate-700/50"></div>
        <div className="p-6 space-y-4">
          <div className="flex justify-between">
            <div className="h-6 w-24 bg-slate-700/50 rounded"></div>
            <div className="h-5 w-32 bg-slate-700/50 rounded"></div>
          </div>
          <div className="h-8 w-full bg-slate-700/50 rounded"></div>
          <div className="h-20 w-full bg-slate-700/50 rounded"></div>
          <div className="flex justify-between items-center">
            <div className="h-6 w-32 bg-slate-700/50 rounded"></div>
            <div className="h-8 w-28 bg-slate-700/50 rounded"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Funkcja do formatowania daty
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};

// Funkcja obliczająca czas czytania
const calculateReadingTime = (text: string) => {
  const wordsPerMinute = 200;
  const wordCount = text?.split(/\s+/)?.length || 0;
  return Math.ceil(wordCount / wordsPerMinute) || 1;
};

// Komponent pojedynczego artykułu dla widoku skróconego (karta)
const BlogPostCard = ({ post, onClick }: { post: BlogPost; onClick: () => void }) => {
  const readingTime = calculateReadingTime(post.excerpt + post.content);

  return (
    <div
      className="glass-card overflow-hidden hover-lift card-border-glow group cursor-pointer"
      onClick={onClick}
    >
      {post.image_url && (
        <div className="h-48 overflow-hidden relative">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 text-xs font-medium">
            {post.category}
          </span>
          <div className="flex items-center text-sm text-slate-400 gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {readingTime} min
            </span>
          </div>
        </div>
        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-amber-400 transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>
        <div className="flex justify-between items-center pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <User className="w-4 h-4 text-slate-900" />
            </div>
            <div>
              <span className="text-sm text-white">{post.author}</span>
              <p className="text-xs text-slate-500">{formatDate(post.published_at)}</p>
            </div>
          </div>
          <div className="flex items-center text-amber-400 text-sm font-medium group-hover:gap-2 transition-all">
            <span>Czytaj</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Fallback blog posts when API is unavailable - comprehensive CPR 2024 content
const fallbackPosts: BlogPost[] = [
  {
    id: "1",
    title: "Rozporządzenie CPR (EU) 2024/3110 - Kompletny przewodnik dla producentów",
    slug: "cpr-2024-przewodnik",
    excerpt: "Wszystko co musisz wiedzieć o nowym rozporządzeniu w sprawie wyrobów budowlanych. Kluczowe zmiany, terminy wejścia w życie od 8 stycznia 2025 i obowiązki producentów.",
    content: `# Rozporządzenie CPR (EU) 2024/3110 - Kompletny przewodnik

## Wprowadzenie
Rozporządzenie Parlamentu Europejskiego i Rady (UE) 2024/3110 z dnia 13 grudnia 2024 r. ustanawia zharmonizowane warunki wprowadzania do obrotu wyrobów budowlanych. Weszło w życie **8 stycznia 2025 roku**.

## Kluczowe zmiany
1. **Cyfrowa Deklaracja Właściwości Użytkowych (Digital DoP)** - obowiązkowa od 2027
2. **Paszport produktu budowlanego** - nowe wymagania środowiskowe
3. **Rozszerzone wymagania AVCP** - zaostrzone kontrole
4. **Sustainability requirements** - informacje o zrównoważonym rozwoju

## Terminy wdrożenia
- 8 stycznia 2025 - wejście w życie
- 2026 - okres przejściowy
- 2027 - pełne wdrożenie Digital DoP

## Obowiązki producentów
Producenci muszą zapewnić:
- Zgodność z normami zharmonizowanymi
- Prawidłową dokumentację techniczną
- Oznakowanie CE ze wszystkimi wymaganymi informacjami
- Deklarację właściwości użytkowych (DoP)`,
    author: "dr inż. Jan Kowalski",
    published_at: "2026-01-08",
    is_published: true,
    category: "Przewodniki",
    image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
    tags: ["CPR 2024", "przepisy", "wyroby budowlane", "EU"]
  },
  {
    id: "2",
    title: "Cyfrowa Deklaracja Właściwości Użytkowych (Digital DoP) - Praktyczny poradnik",
    slug: "cyfrowa-dop",
    excerpt: "Jak przygotować się do obowiązkowej cyfryzacji dokumentacji produktów budowlanych zgodnie z CPR 2024. Format danych, wymagania techniczne i harmonogram wdrożenia.",
    content: `# Cyfrowa Deklaracja Właściwości Użytkowych (Digital DoP)

## Czym jest Digital DoP?
Digital DoP to elektroniczna forma deklaracji właściwości użytkowych, która zastąpi tradycyjne dokumenty papierowe. Format oparty na standardach XML/JSON umożliwi automatyczne przetwarzanie danych.

## Wymagania techniczne
- Format: strukturyzowany XML lub JSON
- Podpis elektroniczny: kwalifikowany lub zaawansowany
- Repozytorium: dostęp przez unikalny identyfikator (QR kod)
- Archiwizacja: minimum 10 lat

## Harmonogram wdrożenia
- 2025: Przygotowanie infrastruktury
- 2026: Testy pilotażowe
- 2027: Obowiązkowe stosowanie

## Korzyści
1. Automatyzacja procesów weryfikacji
2. Łatwiejszy dostęp do informacji
3. Redukcja kosztów administracyjnych
4. Lepsza identyfikowalność produktów`,
    author: "mgr inż. Anna Nowak",
    published_at: "2026-01-05",
    is_published: true,
    category: "Digital DoP",
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    tags: ["Digital DoP", "cyfryzacja", "dokumentacja", "XML"]
  },
  {
    id: "3",
    title: "Oznakowanie CE wyrobów budowlanych - nowe wymagania 2026",
    slug: "oznakowanie-ce-2026",
    excerpt: "Zmiany w oznakowaniu CE dla producentów wyrobów budowlanych. Praktyczne wskazówki, nowe elementy etykiety i przykłady zgodne z CPR (EU) 2024/3110.",
    content: `# Oznakowanie CE wyrobów budowlanych - 2026

## Nowe wymagania
CPR 2024/3110 wprowadza rozszerzone wymagania dotyczące oznakowania CE:

1. **Numer referencyjny Digital DoP** - obowiązkowy QR kod
2. **Informacje środowiskowe** - klasa zrównoważoności
3. **Dane producenta** - rozszerzone informacje kontaktowe

## Elementy etykiety CE
- Symbol CE (min. 5mm wysokości)
- Numer jednostki notyfikowanej (jeśli dotyczy)
- Nazwa/znak producenta
- Adres producenta
- Kod identyfikacyjny produktu
- Nr Digital DoP / link do repozytorium
- Zamierzone zastosowanie
- Deklarowane właściwości użytkowe

## Sankcje
Nieprawidłowe oznakowanie CE może skutkować:
- Wycofaniem produktu z rynku
- Karami finansowymi
- Odpowiedzialnością cywilną`,
    author: "dr inż. Piotr Wiśniewski",
    published_at: "2026-01-02",
    is_published: true,
    category: "Certyfikacja",
    image_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800",
    tags: ["CE", "oznakowanie", "certyfikacja", "etykieta"]
  },
  {
    id: "4",
    title: "System AVCP - Ocena i weryfikacja stałości właściwości użytkowych",
    slug: "system-avcp",
    excerpt: "Kompletny przegląd systemów oceny AVCP 1+, 1, 2+, 3 i 4. Który system dotyczy Twojego produktu, jakie są wymagania i koszty certyfikacji?",
    content: `# Systemy AVCP w CPR 2024

## Przegląd systemów

### System 1+ (najwyższy poziom)
- Pełna certyfikacja przez jednostkę notyfikowaną
- Ciągły nadzór nad produkcją
- Badania próbek z rynku
- Produkty: konstrukcyjne elementy stalowe, cement

### System 1
- Certyfikacja wstępna
- Ciągły nadzór nad FPC
- Produkty: drzwi przeciwpożarowe, okna

### System 2+
- Certyfikacja zakładowej kontroli produkcji
- Badania typu przez producenta
- Produkty: prefabrykaty betonowe, kruszywa

### System 3
- Badania typu przez jednostkę notyfikowaną
- FPC przez producenta
- Produkty: wyroby izolacyjne

### System 4
- Samodzielna deklaracja producenta
- Produkty: armatura sanitarna

## Koszty typowej certyfikacji
- System 1+: 15 000 - 50 000 PLN rocznie
- System 2+: 5 000 - 15 000 PLN rocznie`,
    author: "dr hab. Marek Zieliński",
    published_at: "2025-12-20",
    is_published: true,
    category: "Certyfikacja",
    image_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
    tags: ["AVCP", "systemy oceny", "certyfikacja", "jednostki notyfikowane"]
  },
  {
    id: "5",
    title: "Zharmonizowane normy europejskie (hEN) - aktualizacje 2026",
    slug: "normy-zharmonizowane-2026",
    excerpt: "Aktualna lista norm zharmonizowanych dla wyrobów budowlanych. Co nowego w 2026 roku, które normy uległy zmianie i jak się przygotować?",
    content: `# Normy zharmonizowane 2026

## Nowe i zaktualizowane normy

### Wyroby konstrukcyjne
- EN 1090-1:2024 - Konstrukcje stalowe i aluminiowe
- EN 1992-1-1:2025 - Projektowanie konstrukcji betonowych (Eurokod 2)
- EN 13369:2024 - Wyroby prefabrykowane z betonu

### Wyroby izolacyjne
- EN 13162:2024 - Wyroby z wełny mineralnej
- EN 13163:2024 - Wyroby z EPS
- EN 13164:2024 - Wyroby z XPS

### Okna i drzwi
- EN 14351-1:2024 - Okna i drzwi zewnętrzne
- EN 16034:2024 - Wyroby drzwiowe do ochrony przeciwpożarowej

## Jak śledzić zmiany?
1. Dziennik Urzędowy UE - oficjalne publikacje
2. CEN/CENELEC - komitety normalizacyjne
3. PKN - Polski Komitet Normalizacyjny
4. NowyCPR.pl - bieżące informacje`,
    author: "mgr inż. Katarzyna Dąbrowska",
    published_at: "2025-12-15",
    is_published: true,
    category: "Normy",
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
    tags: ["normy", "hEN", "standardy", "EN"]
  },
  {
    id: "6",
    title: "Paszport produktu budowlanego - nowy wymóg CPR",
    slug: "paszport-produktu",
    excerpt: "Czym jest paszport produktu budowlanego i jak go przygotować? Wymagania dotyczące informacji o zrównoważonym rozwoju, cyklu życia produktu i gospodarki o obiegu zamkniętym.",
    content: `# Paszport produktu budowlanego

## Definicja
Paszport produktu to cyfrowy dokument zawierający kompleksowe informacje o produkcie budowlanym przez cały jego cykl życia - od produkcji przez użytkowanie po recykling.

## Wymagane informacje

### Dane podstawowe
- Identyfikator produktu
- Producent i łańcuch dostaw
- Skład materiałowy

### Informacje środowiskowe
- Ślad węglowy (GWP)
- Zużycie energii w produkcji
- Potencjał recyklingu
- Klasa cyrkularna

### Cykl życia
- Przewidywana trwałość
- Instrukcje konserwacji
- Wskazówki demontażu
- Opcje ponownego użycia

## Powiązanie z EPD
Paszport produktu będzie bazował na danych z Deklaracji Środowiskowej Produktu (EPD) zgodnej z EN 15804+A2.`,
    author: "dr inż. Tomasz Kamiński",
    published_at: "2025-12-10",
    is_published: true,
    category: "Przepisy",
    image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    tags: ["paszport produktu", "zrównoważoność", "ESG", "cyrkularność"]
  },
  {
    id: "7",
    title: "EPD - Deklaracja Środowiskowa Produktu dla wyrobów budowlanych",
    slug: "epd-deklaracja-srodowiskowa",
    excerpt: "Jak przygotować EPD zgodnie z EN 15804+A2? Wymagania, proces weryfikacji, koszty i korzyści dla producentów wyrobów budowlanych.",
    content: `# EPD - Deklaracja Środowiskowa Produktu

## Czym jest EPD?
Environmental Product Declaration (EPD) to znormalizowany dokument prezentujący dane środowiskowe produktu przez cały cykl życia.

## Norma EN 15804+A2
Kluczowe wymagania:
- Etapy A1-A3: Produkcja
- Etapy A4-A5: Transport i montaż
- Etapy B1-B7: Użytkowanie
- Etapy C1-C4: Koniec życia
- Etap D: Korzyści poza systemem

## Proces przygotowania EPD
1. Analiza LCA (Life Cycle Assessment)
2. Przygotowanie raportu środowiskowego
3. Weryfikacja przez niezależną stronę trzecią
4. Rejestracja w programie EPD (np. IBU, EPD Norway)

## Koszty
- LCA: 10 000 - 30 000 PLN
- Weryfikacja: 5 000 - 15 000 PLN
- Rejestracja: 2 000 - 5 000 PLN

## Ważność
EPD jest ważna przez 5 lat od daty weryfikacji.`,
    author: "dr Magdalena Lewandowska",
    published_at: "2025-12-05",
    is_published: true,
    category: "Środowisko",
    image_url: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800",
    tags: ["EPD", "LCA", "środowisko", "EN 15804"]
  },
  {
    id: "8",
    title: "Zakładowa Kontrola Produkcji (FPC) - wymagania i wdrożenie",
    slug: "zakładowa-kontrola-produkcji-fpc",
    excerpt: "Jak wdrożyć i utrzymać system Zakładowej Kontroli Produkcji zgodny z CPR 2024? Dokumentacja, procedury, audyty i najczęstsze błędy.",
    content: `# Zakładowa Kontrola Produkcji (FPC)

## Definicja
Factory Production Control (FPC) to udokumentowany, stały i wewnętrzny system kontroli produkcji prowadzony przez producenta.

## Wymagania
1. Dokumentacja systemu
2. Kontrola surowców
3. Kontrola procesu produkcji
4. Badania wyrobu gotowego
5. Postępowanie z wyrobem niezgodnym
6. Działania korygujące

## Kluczowe elementy
- Księga FPC
- Procedury operacyjne
- Instrukcje stanowiskowe
- Zapisy i rejestry
- Plan badań i kontroli

## Audyty
- Wewnętrzne: minimum raz w roku
- Zewnętrzne (dla systemów 1+, 1, 2+): zgodnie z harmonogramem jednostki

## Najczęstsze błędy
1. Brak aktualizacji dokumentacji
2. Nieprawidłowe kalibracje sprzętu
3. Niekompletne zapisy badań
4. Brak szkoleń personelu`,
    author: "mgr inż. Robert Wójcik",
    published_at: "2025-11-28",
    is_published: true,
    category: "Produkcja",
    image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800",
    tags: ["FPC", "kontrola produkcji", "jakość", "audyt"]
  },
  {
    id: "9",
    title: "Jednostki notyfikowane - jak wybrać partnera do certyfikacji?",
    slug: "jednostki-notyfikowane-wybor",
    excerpt: "Kryteria wyboru jednostki notyfikowanej dla certyfikacji wyrobów budowlanych. Lista jednostek w Polsce, zakres akredytacji i koszty współpracy.",
    content: `# Jednostki notyfikowane w Polsce

## Czym są jednostki notyfikowane?
Jednostki notyfikowane (Notified Bodies) to organizacje wyznaczone przez państwa członkowskie do przeprowadzania oceny zgodności wyrobów budowlanych.

## Jednostki w Polsce
1. **ITB** - Instytut Techniki Budowlanej (NB 1488)
2. **ICiMB** - Instytut Ceramiki i Materiałów Budowlanych (NB 1454)
3. **CNBOP-PIB** - Centrum Naukowo-Badawcze Ochrony Przeciwpożarowej (NB 1438)
4. **IGNiG-PIB** - Instytut Nafty i Gazu (NB 1453)

## Kryteria wyboru
- Zakres notyfikacji (normy, produkty)
- Doświadczenie w branży
- Terminy realizacji
- Koszty certyfikacji
- Lokalizacja i dostępność

## Baza NANDO
Oficjalna baza jednostek notyfikowanych UE: ec.europa.eu/growth/tools-databases/nando/

## Typowe koszty (rocznie)
- Certyfikacja wstępna: 8 000 - 25 000 PLN
- Nadzór roczny: 4 000 - 12 000 PLN`,
    author: "mgr Agnieszka Kowalczyk",
    published_at: "2025-11-20",
    is_published: true,
    category: "Certyfikacja",
    image_url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800",
    tags: ["jednostki notyfikowane", "certyfikacja", "ITB", "NANDO"]
  },
  {
    id: "10",
    title: "Nadzór rynku wyrobów budowlanych - GUNB i kontrole",
    slug: "nadzor-rynku-gunb",
    excerpt: "Jak działa nadzór rynku wyrobów budowlanych w Polsce? Rola GUNB, procedury kontrolne, najczęstsze nieprawidłowości i sankcje.",
    content: `# Nadzór rynku wyrobów budowlanych

## Główny Urząd Nadzoru Budowlanego (GUNB)
GUNB jest organem odpowiedzialnym za nadzór rynku wyrobów budowlanych w Polsce.

## Zakres kontroli
1. Dokumentacja techniczna
2. Deklaracja właściwości użytkowych
3. Oznakowanie CE
4. Zgodność z normami zharmonizowanymi

## Procedura kontrolna
1. Wszczęcie kontroli (planowa lub na wniosek)
2. Pobranie próbek
3. Badania laboratoryjne
4. Protokół kontroli
5. Decyzja administracyjna

## Najczęstsze nieprawidłowości
- Brak DoP lub nieprawidłowa treść
- Niewłaściwe oznakowanie CE
- Niezgodność deklarowanych właściwości
- Brak wymaganej dokumentacji

## Sankcje
- Nakaz wycofania z rynku
- Zakaz wprowadzania do obrotu
- Kary pieniężne do 100 000 PLN
- Odpowiedzialność karna`,
    author: "mec. Paweł Szczepański",
    published_at: "2025-11-15",
    is_published: true,
    category: "Prawo",
    image_url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800",
    tags: ["GUNB", "nadzór rynku", "kontrola", "sankcje"]
  },
  {
    id: "11",
    title: "Wyroby nieobjęte normami zharmonizowanymi - ETA i krajowe oceny techniczne",
    slug: "eta-krajowe-oceny-techniczne",
    excerpt: "Co zrobić gdy produkt nie jest objęty normą zharmonizowaną? Europejska Ocena Techniczna (ETA), krajowe oceny techniczne i ścieżka do oznakowania CE.",
    content: `# ETA i krajowe oceny techniczne

## Kiedy potrzebna ETA?
Europejska Ocena Techniczna (ETA) jest wymagana gdy:
- Brak normy zharmonizowanej (hEN)
- Produkt znacząco odbiega od normy
- Innowacyjny wyrób budowlany

## Proces uzyskania ETA
1. Wniosek do jednostki TAB (Technical Assessment Body)
2. Opracowanie EAD (European Assessment Document)
3. Ocena i badania produktu
4. Wydanie ETA
5. Certyfikacja zgodnie z systemem AVCP

## Jednostki TAB w Polsce
- ITB (Instytut Techniki Budowlanej)

## Krajowe Oceny Techniczne
Dla produktów wprowadzanych wyłącznie na rynek polski, gdy nie ma hEN ani ETA.

## Koszty i czas
- ETA: 50 000 - 200 000 PLN, 6-18 miesięcy
- Krajowa ocena: 20 000 - 80 000 PLN, 3-6 miesięcy`,
    author: "dr inż. Krzysztof Adamski",
    published_at: "2025-11-10",
    is_published: true,
    category: "Certyfikacja",
    image_url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800",
    tags: ["ETA", "ocena techniczna", "TAB", "ITB"]
  },
  {
    id: "12",
    title: "Import wyrobów budowlanych spoza UE - wymagania CPR",
    slug: "import-wyrobow-spoza-ue",
    excerpt: "Jak legalnie importować wyroby budowlane z Chin, Turcji czy USA? Obowiązki importera, wymagana dokumentacja i procedury celne.",
    content: `# Import wyrobów budowlanych spoza UE

## Obowiązki importera
Zgodnie z CPR 2024, importer musi:
1. Upewnić się, że producent przeprowadził ocenę zgodności
2. Sprawdzić dokumentację techniczną
3. Weryfikować oznakowanie CE i DoP
4. Przechowywać dokumentację przez 10 lat
5. Współpracować z organami nadzoru

## Wymagana dokumentacja
- Deklaracja właściwości użytkowych (DoP)
- Raporty z badań
- Certyfikaty zgodności (jeśli wymagane)
- Dokumentacja zakładowej kontroli produkcji

## Procedury celne
1. Zgłoszenie celne z kodem CN produktu
2. Kontrola dokumentacji przez celników
3. Możliwa kontrola fizyczna i pobranie próbek
4. Dopuszczenie do obrotu

## Ryzyko
- Produkty niezgodne - koszty utylizacji
- Kary za wprowadzenie niezgodnych wyrobów
- Odpowiedzialność za wady produktu`,
    author: "mgr Joanna Wrońska",
    published_at: "2025-11-05",
    is_published: true,
    category: "Handel",
    image_url: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800",
    tags: ["import", "handel", "cło", "dokumentacja"]
  },
  {
    id: "13",
    title: "Beton i prefabrykaty betonowe - specyficzne wymagania CPR",
    slug: "beton-prefabrykaty-wymagania",
    excerpt: "Certyfikacja betonu towarowego i prefabrykatów betonowych według CPR 2024. System 2+, normy EN 206 i EN 13369, zakładowa kontrola produkcji.",
    content: `# Beton i prefabrykaty betonowe - CPR 2024

## Beton towarowy
### Norma: EN 206:2024
- System AVCP: 2+
- Wymagana certyfikacja FPC przez jednostkę notyfikowaną

### Kluczowe właściwości
- Klasa wytrzymałości (np. C25/30)
- Klasa konsystencji
- Klasa ekspozycji
- Maksymalny wymiar kruszywa

## Prefabrykaty betonowe
### Normy produktowe
- EN 13369 - Wymagania ogólne
- EN 13225 - Elementy liniowe
- EN 13224 - Płyty żebrowe
- EN 1168 - Płyty kanałowe

### System AVCP
- System 2+ dla większości prefabrykatów
- System 4 dla niektórych elementów wykończeniowych

## Badania
- Wytrzymałość na ściskanie
- Wodoszczelność
- Mrozoodporność
- Geometria i tolerancje`,
    author: "prof. dr hab. inż. Michał Górski",
    published_at: "2025-10-25",
    is_published: true,
    category: "Materiały",
    image_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800",
    tags: ["beton", "prefabrykaty", "EN 206", "konstrukcje"]
  },
  {
    id: "14",
    title: "Okna i drzwi - certyfikacja według EN 14351-1",
    slug: "okna-drzwi-certyfikacja",
    excerpt: "Pełny proces certyfikacji okien i drzwi zewnętrznych zgodnie z EN 14351-1:2024. Badania ITT, klasyfikacje, oznakowanie CE i Digital DoP.",
    content: `# Okna i drzwi - certyfikacja EN 14351-1

## Zakres normy EN 14351-1:2024
Okna i drzwi zewnętrzne do budynków mieszkalnych i niemieszkalnych.

## System AVCP: 3
- Badania typu (ITT) przez jednostkę notyfikowaną
- Zakładowa kontrola produkcji przez producenta

## Badane właściwości
1. **Przepuszczalność powietrza** (klasa 1-4)
2. **Wodoszczelność** (klasa 1A-9A)
3. **Odporność na obciążenie wiatrem** (klasa 1-5)
4. **Współczynnik przenikania ciepła Uw**
5. **Izolacyjność akustyczna Rw**
6. **Promieniowanie słoneczne g**

## Proces certyfikacji
1. Przygotowanie próbek reprezentatywnych
2. Badania w laboratorium notyfikowanym
3. Raport z badań typu (ITT report)
4. Opracowanie DoP
5. Oznakowanie CE

## Koszty badań
- Pełny zakres badań: 15 000 - 40 000 PLN
- Badania pojedyncze: 3 000 - 8 000 PLN`,
    author: "mgr inż. Andrzej Maj",
    published_at: "2025-10-18",
    is_published: true,
    category: "Materiały",
    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    tags: ["okna", "drzwi", "EN 14351", "ITT"]
  },
  {
    id: "15",
    title: "Wyroby izolacyjne - przegląd norm i wymagań CPR",
    slug: "wyroby-izolacyjne-normy",
    excerpt: "Kompleksowy przegląd wymagań dla materiałów izolacyjnych: wełna mineralna, EPS, XPS, PIR. Normy, właściwości deklarowane i system AVCP.",
    content: `# Wyroby izolacyjne - wymagania CPR

## Główne normy zharmonizowane

### Wełna mineralna - EN 13162
- System AVCP: 3 (1 dla reakcji na ogień)
- Właściwości termiczne, akustyczne, ogniowe

### Styropian EPS - EN 13163
- System AVCP: 3 (1 dla ETICS)
- Klasy lambda: od 030 do 045

### Styrodur XPS - EN 13164
- System AVCP: 3
- Zastosowanie: fundamenty, dachy odwrócone

### Pianka PIR/PUR - EN 13165
- System AVCP: 3
- Najlepsze parametry termiczne

## Kluczowe właściwości
1. Deklarowana wartość lambda λD
2. Reakcja na ogień (Euroklasy A1-F)
3. Wytrzymałość na ściskanie
4. Absorpcja wody
5. Przepuszczalność pary wodnej

## Oznakowanie
- Symbol λD na etykiecie
- Klasa reakcji na ogień
- Wymiary i tolerancje
- Nr DoP`,
    author: "dr inż. Barbara Sikora",
    published_at: "2025-10-10",
    is_published: true,
    category: "Materiały",
    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    tags: ["izolacja", "EPS", "wełna", "termoizolacja"]
  }
];

// Główny komponent strony bloga
export function BlogPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(fallbackPosts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Pobieranie wpisów bloga z plików markdown
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);

        // Importuj i użyj blogLoader
        const { getAllPosts } = await import('../utils/blogLoader');
        const posts = await getAllPosts();

        console.log('✅ Załadowano artykuły z markdown:', posts.length);
        setBlogPosts(posts);
        setLastUpdate(new Date());
        setError(null);

      } catch (error) {
        console.error("Błąd ładowania artykułów z markdown:", error);
        // Fallback do lokalnych postów jeśli markdown nie zadziała
        setBlogPosts(fallbackPosts);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // Przekierowanie do strony szczegółów posta
  const navigateToPost = (slug: string) => {
    navigate(`/blog-post?slug=${slug}`);
  };

  // Filtrowanie artykułów
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch && (selectedCategory === "all" || post.category === selectedCategory);
  });

  // Lista kategorii z wpisów
  const categories = blogPosts.length > 0 ?
    [...new Set(blogPosts.map(post => post.category))].sort() : [];

  // Obsługa newslettera
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Proszę podać poprawny adres e-mail");
      return;
    }

    subscribeToNewsletter(email);
    toast.success("Dziękujemy za zapisanie się do newslettera!");
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <Container>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="md:w-2/3">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/20 mb-6">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400 text-sm font-medium">Blog CPR</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="text-white">Aktualności i </span>
                  <span className="gradient-text">Wiedza CPR</span>
                </h1>
                <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-2xl">
                  Najnowsze informacje, interpretacje i poradniki dotyczące Rozporządzenia CPR (EU) 2024/3110.
                  Bądź na bieżąco ze wszystkimi zmianami prawnymi i najlepszymi praktykami w branży.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => document.getElementById("blog-list")?.scrollIntoView({ behavior: "smooth" })}
                    className="btn-premium px-6 py-3 rounded-full text-slate-900 font-semibold"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Przeglądaj artykuły
                  </Button>
                  <Button
                    variant="outline"
                    className="px-6 py-3 rounded-full border-white/20 text-white bg-transparent hover:bg-white/10"
                    onClick={() => document.getElementById("newsletter-section")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Newsletter
                  </Button>
                </div>
              </div>
              <div className="md:w-1/3">
                <div className="glass-card p-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <FileText className="w-10 h-10 text-slate-900" />
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text mb-1">{blogPosts.length}</div>
                    <p className="text-slate-400 text-sm">artykułów dostępnych</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold text-white">{categories.length}</div>
                      <p className="text-slate-500 text-xs">kategorii</p>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white">2026</div>
                      <p className="text-slate-500 text-xs">aktualny rok</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Blog List Section */}
      <section id="blog-list" className="py-16 bg-gradient-to-b from-slate-900 to-slate-950">
        <Container>
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Najnowsze <span className="gradient-text">artykuły</span>
            </h2>
            <p className="text-slate-400">Wybierz kategorię lub wyszukaj interesujący Cię temat</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-grow relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Szukaj artykułów..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all"
              />
            </div>
            <div className="md:w-64 relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
              >
                <option value="all" className="bg-slate-800">Wszystkie kategorie</option>
                {categories.map(category => (
                  <option key={category} value={category} className="bg-slate-800">{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Posts Grid */}
          <div id="blog-posts-grid">
            {loading ? (
              <LoadingState />
            ) : error ? (
              <div className="text-center py-12 glass-card">
                <h3 className="text-xl font-medium text-white mb-2">{error}</h3>
                <p className="text-slate-400 mb-4">Spróbuj odświeżyć stronę</p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="border-white/20 text-white bg-transparent hover:bg-white/10"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Odśwież stronę
                </Button>
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map(post => (
                  <BlogPostCard
                    key={post.id}
                    post={post}
                    onClick={() => navigateToPost(post.slug)}
                  />
                ))}
              </div>
            ) : (
              <div>
                <EmptyState />
                {selectedCategory !== "all" && (
                  <div className="text-center mt-6">
                    <Button
                      onClick={() => setSelectedCategory("all")}
                      variant="outline"
                      className="border-white/20 text-white bg-transparent hover:bg-white/10"
                    >
                      Pokaż wszystkie kategorie
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter-section" className="py-24 bg-slate-950">
        <Container>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 via-slate-800 to-slate-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-blue-500/10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-2/3">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Bądź na bieżąco z <span className="gradient-text">CPR</span>
                </h2>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Zapisz się do naszego newslettera i otrzymuj najnowsze informacje,
                  interpretacje przepisów i praktyczne porady dotyczące Rozporządzenia CPR.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Twój adres e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-grow px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all"
                    required
                  />
                  <button
                    type="submit"
                    className="btn-premium px-6 py-3 rounded-xl text-slate-900 font-semibold flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Zapisz się
                  </button>
                </form>
                <p className="text-xs text-slate-500 mt-3">
                  Zapisując się, zgadzasz się na naszą politykę prywatności. W każdej chwili możesz zrezygnować z subskrypcji.
                </p>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Mail className="w-16 h-16 text-slate-900" />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-slate-900 border-t border-white/5">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                O blogu
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Dostarczamy ekspercką wiedzę i praktyczne informacje dla producentów wyrobów budowlanych
                dotyczące Rozporządzenia CPR (EU) 2024/3110.
              </p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-400" />
                Kategorie
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 6).map(category => (
                  <button
                    key={category}
                    className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-sm hover:text-amber-400 hover:border-amber-400/30 transition-all"
                    onClick={() => {
                      setSelectedCategory(category);
                      document.getElementById("blog-list")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-400" />
                Kontakt
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                Masz pytania dotyczące CPR? Skontaktuj się z naszymi ekspertami.
              </p>
              <Button
                variant="outline"
                className="border-white/20 text-white bg-transparent hover:bg-white/10"
                onClick={() => navigate("/services")}
              >
                Skontaktuj się
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
