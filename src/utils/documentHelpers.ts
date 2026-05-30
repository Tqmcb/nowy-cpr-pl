// Document download helpers

interface Document {
  id: string;
  title: string;
  description: string;
  icon: string;
  fileType: string;
  language: string;
  updatedAt: string;
}

// Dane dokumentów CPR 2024/3110
export const documents: Document[] = [
  {
    id: "dop-template",
    title: "Szablon Deklaracji Właściwości Użytkowych i Zgodności (DoP&C)",
    description: "Wzór deklaracji DoP&C zgodny z Załącznikiem V Rozporządzenia (UE) 2024/3110 (CPR). Zawiera wszystkie obowiązkowe elementy wymagane przez art. 18–19, w tym sekcję substancji SVHC i cyfrowy dostęp.",
    icon: "📄",
    fileType: "HTML",
    language: "PL",
    updatedAt: "04.2026"
  },
  {
    id: "tech-card",
    title: "Szablon karty technicznej wyrobu budowlanego",
    description: "Edytowalny szablon karty technicznej wyrobu budowlanego, zgodny z wymaganiami CPR (UE) 2024/3110. Zawiera sekcje właściwości użytkowych, warunków stosowania, BHP i historii rewizji.",
    icon: "📋",
    fileType: "HTML",
    language: "PL",
    updatedAt: "04.2026"
  },
  {
    id: "fpc-manual",
    title: "Poradnik zakładowej kontroli produkcji (FPC)",
    description: "Kompleksowy przewodnik implementacji systemu FPC zgodnego z art. 20 ust. 3 CPR (UE) 2024/3110. Obejmuje wszystkie systemy AVS (1+, 1, 2+, 3, 3+, 4) oraz uproszczenia dla mikroprzedsiębiorstw.",
    icon: "📚",
    fileType: "HTML",
    language: "PL",
    updatedAt: "04.2026"
  },
  {
    id: "ce-marking",
    title: "Wzór oznakowania CE zgodny z CPR 2024/3110",
    description: "Przewodnik i wzór oznakowania CE wg art. 18–19 CPR (UE) 2024/3110. Zawiera obowiązkowe elementy oznakowania, zasady umieszczania numeru NB dla systemów AVS 1+, 1, 2+ oraz wymagania dotyczące kodu QR i cyfrowego DoP&C.",
    icon: "🏷️",
    fileType: "HTML",
    language: "PL",
    updatedAt: "04.2026"
  },
  {
    id: "checklist",
    title: "Lista kontrolna zgodności z CPR 2024/3110",
    description: "Szczegółowa lista kontrolna pomagająca producentom w weryfikacji zgodności z wymaganiami Rozporządzenia (UE) 2024/3110. Obejmuje 7 obszarów: obowiązki producenta, DoP&C, oznakowanie CE, AVS, SVHC, wymagania cyfrowe i MŚP.",
    icon: "✅",
    fileType: "HTML",
    language: "PL",
    updatedAt: "04.2026"
  },
  {
    id: "edp-template",
    title: "Szablon deklaracji środowiskowej produktu (EPD)",
    description: "Wzór EPD zgodny z normą EN 15804+A2 i przygotowany pod przyszłe wymagania środowiskowe CPR (UE) 2024/3110. Zawiera wskaźniki środowiskowe (GWP, ODP, AP, EP, POCP i inne), które mogą być później wykorzystane przy walidacji danych środowiskowych w systemie AVS 3+.",
    icon: "🌱",
    fileType: "HTML",
    language: "PL",
    updatedAt: "04.2026"
  },
  {
    id: "dpp-guide",
    title: "Przewodnik po cyfrowym paszporcie produktu (DPP)",
    description: "Kompletny przewodnik dotyczący Cyfrowego Paszportu Produktu (art. 75–80 CPR 2024/3110). Obejmuje harmonogram wdrożenia, wymagane dane, unikalny identyfikator (art. 78), wymagania techniczne dostępu i listę kontrolną producenta.",
    icon: "💻",
    fileType: "HTML",
    language: "PL",
    updatedAt: "04.2026"
  },
  {
    id: "avcp-systems",
    title: "Przewodnik po systemach AVS (dawniej AVCP)",
    description: "Szczegółowe objaśnienie 6 systemów oceny i weryfikacji (AVS) z CPR (UE) 2024/3110: 1+, 1, 2+, 3, nowy system 3+ dla EPD oraz 4. Porównanie z dawnym AVCP (CPR 305/2011) i przykłady dla kategorii wyrobów.",
    icon: "📊",
    fileType: "HTML",
    language: "PL",
    updatedAt: "04.2026"
  },
  {
    id: "importer-dopc",
    title: "Szablon DoP&C dla importera (Art. 17 CPR 2024/3110)",
    description: "Wzór deklaracji właściwości użytkowych i zgodności wystawianej przez importera wprowadzającego wyrób pod własną marką lub modyfikującego wyrób (art. 16 ust. 3-4 i art. 17 CPR 2024/3110). Importer przejmuje pełną odpowiedzialność producenta.",
    icon: "🔵",
    fileType: "HTML",
    language: "PL",
    updatedAt: "04.2026"
  },
  {
    id: "tech-file",
    title: "Struktura dokumentacji technicznej (Art. 22 ust. 3 CPR 2024/3110)",
    description: "Szablon wewnętrznego pliku technicznego wymaganego przez art. 22 ust. 3 CPR 2024/3110. Zawiera listę kontrolną dokumentów, opis wyrobu, wyniki badań, certyfikaty NB i oświadczenie o kompletności. Przechowywać 10 lat od daty dostarczenia wyrobu.",
    icon: "🗂️",
    fileType: "HTML",
    language: "PL",
    updatedAt: "04.2026"
  },
  {
    id: "user-instructions",
    title: "Instrukcja dla profesjonalnych użytkowników (Art. 9 CPR 2024/3110)",
    description: "Wzór instrukcji stosowania wyrobu budowlanego zgodny z art. 9 CPR 2024/3110. Obejmuje zamierzone zastosowanie, instrukcję montażu, wymagania BHP, warunki przechowywania, informacje środowiskowe i dane kontaktowe producenta.",
    icon: "📘",
    fileType: "HTML",
    language: "PL",
    updatedAt: "04.2026"
  },
  {
    id: "auth-rep-mandate",
    title: "Mandat upoważnionego przedstawiciela (Art. 23 CPR 2024/3110)",
    description: "Wzór pisemnego mandatu upoważnionego przedstawiciela zgodny z art. 23 CPR 2024/3110. Dotyczy każdego producenta (w UE i spoza UE). Zawiera zakres upoważnienia, czas obowiązywania i zakazy mandatowe z art. 23 ust. 3 (zakaz sporządzania DoP&C, AVS, organizowania i nadzorowania FPC).",
    icon: "📜",
    fileType: "HTML",
    language: "PL",
    updatedAt: "04.2026"
  },
  {
    id: "commission-work-plan",
    title: "Plan Prac Komisji Europejskiej — Harmonogram norm CPR 2024/3110 na lata 2026-2029",
    description: "Przewodnik po COM(2025) 772 final — pierwszym Planie Prac KE dla CPR 2024/3110. Zawiera harmonogram 36 rodzin wyrobów (Milestones 0-IV), środki horyzontalne (ogień, środowisko, SVHC, DPP) oraz zmiany w Załączniku VII. Niezbędny dla producentów planujących dostosowanie do nowych norm zharmonizowanych do 2029.",
    icon: "📅",
    fileType: "HTML",
    language: "PL",
    updatedAt: "04.2026"
  },
  {
    id: "dopc-prefabrykaty-betonowe",
    title: "DoP&C — Prefabrykaty betonowe (EN 13225 / EN 13369)",
    description: "Wzorcowy szablon Deklaracji Właściwości Użytkowych i Zgodności dla prefabrykowanych wyrobów z betonu (słupy, belki, płyty, bloczki AAC). Zawiera pełną tabelę właściwości użytkowych (wytrzymałość, odporność ogniowa, trwałość) oraz sekcję GWP z 4 wskaźnikami środowiskowymi A1–A3 wg EN 15804+A2 — gotowy na pierwszy etap wdrożenia CPR 2024.",
    icon: "🏗️",
    fileType: "HTML",
    language: "PL",
    updatedAt: "04.2026"
  }
];

// Adresy URL dokumentów — pliki HTML do otwarcia w przeglądarce i wydruku jako PDF
const documentUrls: Record<string, string> = {
  "dop-template":  "/docs/dopc-szablon.html",
  "tech-card":     "/docs/karta-techniczna-szablon.html",
  "fpc-manual":    "/docs/fpc-poradnik.html",
  "ce-marking":    "/docs/ce-oznakowanie-wzor.html",
  "checklist":     "/docs/lista-kontrolna-cpr2024.html",
  "edp-template":  "/docs/epd-szablon.html",
  "dpp-guide":     "/docs/dpp-przewodnik.html",
  "avcp-systems":       "/docs/avs-systemy-przewodnik.html",
  "importer-dopc":      "/docs/importer-dopc-szablon.html",
  "tech-file":          "/docs/dokumentacja-techniczna-art21.html",
  "user-instructions":  "/docs/instrukcja-uzytkownika-art9.html",
  "auth-rep-mandate":   "/docs/mandat-przedstawiciela-art23.html",
  "commission-work-plan":  "/docs/plan-prac-komisji-cpr-2026-2029.html",
  "dopc-prefabrykaty-betonowe":  "/docs/dopc-prefabrykaty-betonowe.html"
};

// MailerLite group ID for document leads (group: "Pobrania dokumentów CPR")
const ML_GROUP_DOCS = "180850653059352398";

// Function to track email leads — adds to MailerLite group + note about downloaded document
export const trackLead = async (email: string, documentId: string): Promise<boolean> => {
  const documentTitle = documents.find(doc => doc.id === documentId)?.title || documentId;
  const apiKey = import.meta.env.VITE_MAILERLITE_API_KEY;
  const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "Accept": "application/json",
  };

  try {
    // 1. Dodaj subskrybenta do grupy "Pobrania dokumentow CPR"
    const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers,
      body: JSON.stringify({ email, groups: [ML_GROUP_DOCS] }),
    });

    if (res.ok) {
      const data = await res.json();
      const subscriberId: string = data?.data?.id;

      // 2. Dodaj notatkę z nazwą dokumentu i datą pobrania
      if (subscriberId) {
        const date = new Date().toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' });
        await fetch(`https://connect.mailerlite.com/api/subscribers/${subscriberId}/notes`, {
          method: "POST",
          headers,
          body: JSON.stringify({ content: `Pobrał dokument: ${documentTitle} (${date})` }),
        }).catch(() => { /* nie blokuj */ });
      }
    }
  } catch (_) { /* nie blokuj pobierania */ }

  // 3. Lokalny backup
  const leads = JSON.parse(localStorage.getItem('document_leads') || '[]');
  leads.push({ email, documentId, documentTitle, timestamp: new Date().toISOString() });
  localStorage.setItem('document_leads', JSON.stringify(leads));

  return true;
};

// Function to open a document in a new browser tab
// Documents are HTML files designed to be printed to PDF via browser print dialog (Ctrl+P)
export const downloadDocument = (documentId: string): boolean => {
  const url = documentUrls[documentId];

  if (!url) {
    console.error(`No URL found for document ID: ${documentId}`);
    return false;
  }

  const doc = documents.find(d => d.id === documentId);
  if (!doc) {
    console.error(`Document not found with ID: ${documentId}`);
    return false;
  }

  try {
    // Open the HTML document in a new tab
    // User can then use Ctrl+P → Save as PDF to get the final PDF
    window.open(url, '_blank');

    localStorage.setItem('last_document_download', JSON.stringify({
      id: documentId,
      title: doc.title,
      timestamp: new Date().toISOString(),
      url: url
    }));

    return true;
  } catch (error) {
    console.error(`Failed to open document ${documentId}:`, error);
    return false;
  }
};
