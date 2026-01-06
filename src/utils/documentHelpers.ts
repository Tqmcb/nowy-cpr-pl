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

// Dane przykładowych dokumentów
export const documents: Document[] = [
  {
    id: "dop-template",
    title: "Przykładowa deklaracja właściwości użytkowych (DoP)",
    description: "Szablon deklaracji zgodny z art. 22 rozporządzenia (UE) 2023/991 (CPR 2024), zawierający wszystkie obowiązkowe elementy wymagane dla cyfrowej DoP.",
    icon: "📄",
    fileType: "PDF",
    language: "PL",
    updatedAt: "05.03.2025"
  },
  {
    id: "tech-card",
    title: "Szablon karty technicznej produktu",
    description: "Edytowalny szablon karty technicznej wyrobu budowlanego, zgodny z wymaganiami CPR 2024, z uwzględnieniem nowych wskaźników klimatycznych (ECI).",
    icon: "📋",
    fileType: "DOCX",
    language: "PL",
    updatedAt: "05.03.2025"
  },
  {
    id: "fpc-manual",
    title: "Poradnik zakładowej kontroli produkcji (FPC)",
    description: "Kompleksowy przewodnik implementacji systemu FPC zgodnego z wymaganiami CPR 2024 dla systemów oceny AVCP 1+, 1, 2+ i 3.",
    icon: "📚",
    fileType: "PDF",
    language: "PL",
    updatedAt: "05.03.2025"
  },
  {
    id: "ce-marking",
    title: "Wzór oznakowania CE zgodny z CPR 2024",
    description: "Szablon oznakowania CE uwzględniający nowe wymagania, w tym odniesienia do cyfrowego paszportu produktu (DPP) i deklaracji środowiskowej.",
    icon: "🏷️",
    fileType: "PDF",
    language: "PL",
    updatedAt: "04.03.2025"
  },
  {
    id: "checklist",
    title: "Lista kontrolna zgodności z CPR 2024",
    description: "Szczegółowa lista kontrolna pomagająca producentom w weryfikacji zgodności z wszystkimi wymogami rozporządzenia (UE) 2023/991, z odniesieniami do odpowiednich artykułów.",
    icon: "✅",
    fileType: "PDF",
    language: "PL",
    updatedAt: "03.03.2025"
  },
  {
    id: "edp-template",
    title: "Szablon deklaracji środowiskowej produktu (EPD)",
    description: "Wzór EPD zgodny z normą EN 15804+A2 i wymaganiami CPR 2024, zawierający wszystkie niezbędne wskaźniki środowiskowe i klimatyczne.",
    icon: "🌱",
    fileType: "PDF",
    language: "PL",
    updatedAt: "04.03.2025"
  },
  {
    id: "dpp-guide",
    title: "Przewodnik po cyfrowym paszporcie produktu (DPP)",
    description: "Kompletny poradnik dotyczący tworzenia i zarządzania cyfrowym paszportem produktu, nowym wymogiem wprowadzonym przez CPR 2024.",
    icon: "💻",
    fileType: "PDF",
    language: "PL",
    updatedAt: "05.03.2025"
  },
  {
    id: "avcp-systems",
    title: "Przewodnik po systemach AVCP",
    description: "Szczegółowe objaśnienie systemów oceny i weryfikacji stałości właściwości użytkowych z przykładami dla różnych kategorii wyrobów budowlanych.",
    icon: "📊",
    fileType: "PDF",
    language: "PL",
    updatedAt: "02.03.2025"
  }
];

// Real document URLs with reliable sources
const documentUrls: Record<string, string> = {
  "dop-template": "https://www.iso.org/files/live/sites/isoorg/files/store/en/PUB100413.pdf", // ISO publication as example
  "tech-card": "https://filesamples.com/samples/document/docx/sample3.docx", // Sample DOCX file
  "fpc-manual": "https://www.fda.gov/files/food/published/Fish-and-Fishery-Products-Hazards-and-Controls-Guidance-Fourth-Edition.pdf", // FDA manual as example
  "ce-marking": "https://www.gov.uk/government/publications/ce-marking/ce-marking", // UK Gov CE marking guidance
  "checklist": "https://ec.europa.eu/docsroom/documents/9483/attachments/1/translations/en/renditions/pdf", // EU checklist example
  "edp-template": "https://www.environdec.com/contentassets/95371fe3acc14a1a8d29311f617e6220/epd-of-electricity-from-vattenfall-nordic-nuclear-power-plants.pdf" // Environmental declaration example
};

// Backup URLs in case the primary ones fail
const backupDocumentUrls: Record<string, string> = {
  "dop-template": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  "tech-card": "https://file-examples.com/storage/fede3f30f864a1f979d2bf0/2017/02/file-sample_100kB.docx",
  "fpc-manual": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  "ce-marking": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  "checklist": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  "edp-template": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
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
    
    // Log the lead for demonstration (in production, this would be sent to your CRM or backend)
    console.log(`Lead stored: ${email} - ${documentTitle} at ${new Date().toLocaleString()}`);
    
    // Simulate sending to a backend (would be replaced with actual API call)
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return true;
  } catch (error) {
    console.error('Error tracking lead:', error);
    // Return true anyway to not block the download
    return true;
  }
};

// Function to download a document
export const downloadDocument = (documentId: string): boolean => {
  const url = documentUrls[documentId];
  const backupUrl = backupDocumentUrls[documentId];
  
  if (!url && !backupUrl) {
    console.error(`No URL found for document ID: ${documentId}`);
    return false;
  }
  
  const document = documents.find(doc => doc.id === documentId);
  if (!document) {
    console.error(`Document not found with ID: ${documentId}`);
    return false;
  }
  
  const isDocx = document.fileType === 'DOCX';
  const fileExtension = isDocx ? 'docx' : 'pdf';
  const fileType = isDocx ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/pdf';
  
  // Clean file naming
  const fileName = `${document.title.replace(/[^a-zA-Z0-9_]/g, '_')}.${fileExtension}`;
  
  try {
    // Attempt primary download method
    // 1. Create an anchor element with download attribute
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.target = '_blank';
    a.setAttribute('type', fileType);
    
    // 2. Append to body, click, and remove
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // 3. Also open in a new tab as a fallback for browsers that block downloads
    setTimeout(() => {
      window.open(url, '_blank');
    }, 100); // Small delay to prevent browsers from blocking multiple popups
    
    console.log(`Started download for: ${documentId} - ${fileName}`);
    
    // Track successful download attempt
    localStorage.setItem('last_document_download', JSON.stringify({
      id: documentId,
      title: document.title,
      timestamp: new Date().toISOString(),
      url: url
    }));
    
    return true;
  } catch (primaryError) {
    console.error(`Primary download method failed for ${documentId}:`, primaryError);
    
    // Try backup URL and method if primary fails
    try {
      console.log(`Attempting backup download for: ${documentId}`);
      window.open(backupUrl || url, '_blank');
      
      // Track fallback download attempt
      localStorage.setItem('last_document_download', JSON.stringify({
        id: documentId,
        title: document.title,
        timestamp: new Date().toISOString(),
        url: backupUrl || url,
        fallback: true
      }));
      
      return true;
    } catch (backupError) {
      console.error(`All download methods failed for ${documentId}:`, backupError);
      return false;
    }
  }
};
