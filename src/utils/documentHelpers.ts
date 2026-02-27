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
    description: "Wzór deklaracji DoP&C zgodny z Załącznikiem V Rozporządzenia (UE) 2024/3110 (CPR). Zawiera wszystkie obowiązkowe elementy wymagane przez art. 15–16, w tym sekcję substancji SVHC i cyfrowy dostęp.",
    icon: "📄",
    fileType: "HTML",
    language: "PL",
    updatedAt: "02.2026"
  },
  {
    id: "tech-card",
    title: "Szablon karty technicznej wyrobu budowlanego",
    description: "Edytowalny szablon karty technicznej wyrobu budowlanego, zgodny z wymaganiami CPR (UE) 2024/3110. Zawiera sekcje właściwości użytkowych, warunków stosowania, BHP i historii rewizji.",
    icon: "📋",
    fileType: "HTML",
    language: "PL",
    updatedAt: "02.2026"
  },
  {
    id: "fpc-manual",
    title: "Poradnik zakładowej kontroli produkcji (FPC)",
    description: "Kompleksowy przewodnik implementacji systemu FPC zgodnego z art. 20 ust. 3 CPR (UE) 2024/3110. Obejmuje wszystkie systemy AVS (1+, 1, 2+, 3, 3+, 4) oraz uproszczenia dla mikroprzedsiębiorstw.",
    icon: "📚",
    fileType: "HTML",
    language: "PL",
    updatedAt: "02.2026"
  },
  {
    id: "ce-marking",
    title: "Wzór oznakowania CE zgodny z CPR 2024/3110",
    description: "Przewodnik i wzór oznakowania CE wg art. 18–19 CPR (UE) 2024/3110. Zawiera obowiązkowe elementy oznakowania, zasady umieszczania numeru NB dla systemów AVS 1+, 1, 2+ oraz wymagania dotyczące kodu QR i cyfrowego DoP&C.",
    icon: "🏷️",
    fileType: "HTML",
    language: "PL",
    updatedAt: "02.2026"
  },
  {
    id: "checklist",
    title: "Lista kontrolna zgodności z CPR 2024/3110",
    description: "Szczegółowa lista kontrolna pomagająca producentom w weryfikacji zgodności z wymaganiami Rozporządzenia (UE) 2024/3110. Obejmuje 7 obszarów: obowiązki producenta, DoP&C, oznakowanie CE, AVS, SVHC, wymagania cyfrowe i MŚP.",
    icon: "✅",
    fileType: "HTML",
    language: "PL",
    updatedAt: "02.2026"
  },
  {
    id: "edp-template",
    title: "Szablon deklaracji środowiskowej produktu (EPD)",
    description: "Wzór EPD zgodny z normą EN 15804+A2 i wymaganiami CPR (UE) 2024/3110. Zawiera wszystkie wskaźniki środowiskowe (GWP, ODP, AP, EP, POCP i inne) wymagane w systemie AVS 3+ z weryfikacją przez notyfikowane laboratorium.",
    icon: "🌱",
    fileType: "HTML",
    language: "PL",
    updatedAt: "02.2026"
  },
  {
    id: "dpp-guide",
    title: "Przewodnik po cyfrowym paszporcie produktu (DPP)",
    description: "Kompletny przewodnik dotyczący Cyfrowego Paszportu Produktu (art. 75–80 CPR 2024/3110). Obejmuje harmonogram wdrożenia, wymagane dane, unikalny identyfikator (art. 22 ust. 5), wymagania techniczne dostępu i listę kontrolną producenta.",
    icon: "💻",
    fileType: "HTML",
    language: "PL",
    updatedAt: "02.2026"
  },
  {
    id: "avcp-systems",
    title: "Przewodnik po systemach AVS (dawniej AVCP)",
    description: "Szczegółowe objaśnienie 6 systemów oceny i weryfikacji (AVS) z CPR (UE) 2024/3110: 1+, 1, 2+, 3, nowy system 3+ dla EPD oraz 4. Porównanie z dawnym AVCP (CPR 305/2011) i przykłady dla kategorii wyrobów.",
    icon: "📊",
    fileType: "HTML",
    language: "PL",
    updatedAt: "02.2026"
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
  "avcp-systems":  "/docs/avs-systemy-przewodnik.html"
};

// Function to track email leads with improved error handling
export const trackLead = async (email: string, documentId: string): Promise<boolean> => {
  try {
    // In a real application, you would send this data to your backend
    console.log(`Tracking lead: ${email} downloaded document ${documentId}`);

    // Get the document title
    const documentTitle = documents.find(doc => doc.id === documentId)?.title || 'Unknown document';

    // Store email in localStorage for demonstration
    const leads = JSON.parse(localStorage.getItem('document_leads') || '[]');
    leads.push({
      email,
      documentId,
      documentTitle,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('document_leads', JSON.stringify(leads));

    console.log(`Lead stored: ${email} - ${documentTitle} at ${new Date().toLocaleString()}`);

    await new Promise(resolve => setTimeout(resolve, 300));

    return true;
  } catch (error) {
    console.error('Error tracking lead:', error);
    return true;
  }
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

    console.log(`Opened document: ${documentId} - ${doc.title}`);

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
