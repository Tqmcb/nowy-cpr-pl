import { useState } from "react";
import { Button } from "@/extensions/shadcn/components/button";
import { Separator } from "@/extensions/shadcn/components/separator";
import { documents, trackLead, downloadDocument } from "../utils/documentHelpers";

interface DocumentProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  fileType: string;
  language: string;
  updatedAt: string;
}

const Document = ({ document, onDownload }: { document: DocumentProps; onDownload: (id: string) => void }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="text-3xl mr-2">{document.icon}</span>
            <span className="text-xs font-medium py-1 px-2 bg-gray-100 rounded text-gray-600">{document.fileType}</span>
            <span className="text-xs font-medium py-1 px-2 bg-gray-50 rounded text-gray-600 ml-2">{document.language}</span>
          </div>
          <h3 className="text-lg font-bold">{document.title}</h3>
        </div>
      </div>
      <p className="text-gray-600 mb-4 flex-grow">{document.description}</p>
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">Aktualizacja: {document.updatedAt}</div>
        <Button 
          onClick={() => onDownload(document.id)}
          size="sm"
          className="font-medium"
        >
          Pobierz
        </Button>
      </div>
    </div>
  );
};

export function DocumentsPage() {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const selectedDocument = documents.find(doc => doc.id === selectedDocumentId);

  const handleDownloadClick = (documentId: string) => {
    setSelectedDocumentId(documentId);
    setShowEmailForm(true);
    setDownloadSuccess(false);
    setFormError("");
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setFormError("Proszę podać adres email");
      return;
    }
    
    // Bardziej rygorystyczna walidacja adresu email
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(email)) {
      setFormError("Proszę podać prawidłowy adres email");
      return;
    }
    
    if (!selectedDocumentId) {
      setFormError("Wystąpił błąd. Proszę spróbować ponownie.");
      return;
    }
    
    // Track the lead (save email address)
    trackLead(email, selectedDocumentId)
      .then(success => {
        if (success) {
          // Initiate actual document download
          try {
            const downloadResult = downloadDocument(selectedDocumentId);
            
            if (downloadResult) {
              setDownloadSuccess(true);
              setFormError("");
              
              // Reset form after 3 seconds
              setTimeout(() => {
                setShowEmailForm(false);
                setEmail("");
              }, 3000);
            } else {
              setFormError("Wystąpił błąd podczas pobierania dokumentu. Proszę spróbować ponownie.");
            }
          } catch (downloadError) {
            console.error("Błąd podczas pobierania dokumentu:", downloadError);
            setFormError("Nie udało się pobrać dokumentu. Sprawdź czy dokument istnieje.");
          }
        } else {
          setFormError("Wystąpił błąd podczas zapisywania adresu email. Proszę spróbować ponownie.");
        }
      })
      .catch(error => {
        console.error("Nieoczekiwany błąd podczas przetwarzania żądania:", error);
        setFormError("Wystąpił nieoczekiwany błąd. Proszę spróbować ponownie.");
      });
  };

  const closeModal = () => {
    setShowEmailForm(false);
    setSelectedDocumentId(null);
    setEmail("");
    setFormError("");
    setDownloadSuccess(false);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
                         
    if (filterType === "all") return matchesSearch;
    return matchesSearch && doc.fileType.toLowerCase() === filterType.toLowerCase();
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Gotowe dokumenty - CPR 2024</h1>
              <p className="text-lg text-gray-600 mb-6">
                Pobierz profesjonalnie przygotowane wzory dokumentów zgodne z wymaganiami nowego rozporządzenia CPR 2024. Zaoszczędź czas i uniknij błędów korzystając z naszych szablonów.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => document.getElementById("documents-section")?.scrollIntoView({ behavior: "smooth" })}
                  className="font-medium"
                >
                  Przeglądaj dokumenty
                </Button>
                <Button 
                  variant="outline" 
                  className="font-medium"
                  onClick={() => document.getElementById("faq-section")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Najczęstsze pytania
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
                alt="Dokumenty CPR 2024"
                className="rounded-lg shadow-md max-w-full h-auto"
                style={{ maxHeight: "350px" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Documents Section */}
      <section id="documents-section" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Dokumenty do pobrania</h2>
            <p className="text-gray-600 mb-4">
              Poniżej znajdują się przykładowe dokumenty demonstrujące, jak będą wyglądać nasze szablony. 
            </p>
            <div className="bg-gray-50 border-l-4 border-gray-300 p-4 mb-8">
              <p className="text-gray-700 mb-2 font-medium">Informacja</p>
              <p className="text-gray-600">
                Obecnie prezentujemy przykładowe dokumenty. Pełne szablony dokumentów zgodne z CPR 2024 są w przygotowaniu i będą dostępne wkrótce. Dokumenty będą regularnie aktualizowane zgodnie z najnowszymi interpretacjami rozporządzenia.
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-grow">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Szukaj dokumentów..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  <option value="all">Wszystkie typy</option>
                  <option value="PDF">PDF</option>
                  <option value="DOCX">DOCX</option>
                  <option value="XLSX">XLSX</option>
                </select>
              </div>
            </div>
            
            {filteredDocuments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map((doc) => (
                  <Document 
                    key={doc.id} 
                    document={doc} 
                    onDownload={handleDownloadClick} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-bold mb-2">Brak wyników</h3>
                <p className="text-gray-600">Nie znaleziono dokumentów spełniających kryteria wyszukiwania.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Separator />

      {/* FAQ Section */}
      <section id="faq-section" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Najczęściej zadawane pytania</h2>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold mb-2">Jak wypełnić deklarację właściwości użytkowych?</h3>
                <p className="text-gray-600">
                  Deklaracja właściwości użytkowych (DoP) powinna zawierać wszystkie istotne informacje o produkcie, w tym jego zamierzone zastosowanie, właściwości użytkowe oraz odniesienie do zharmonizowanej specyfikacji technicznej. Szczegółowe instrukcje znajdziesz w naszym szablonie DoP po pobraniu.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold mb-2">Jakie są główne zmiany w CPR 2024 w zakresie dokumentacji?</h3>
                <p className="text-gray-600">
                  Nowe rozporządzenie CPR 2024 wprowadza szereg zmian w dokumentacji, w tym cyfrowe deklaracje właściwości użytkowych, rozszerzone wymagania dotyczące informacji o zrównoważonym rozwoju i właściwościach środowiskowych oraz nowe systemy oceny i weryfikacji stałości właściwości użytkowych (AVCP).
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold mb-2">Czy mogę modyfikować pobrane szablony dokumentów?</h3>
                <p className="text-gray-600">
                  Tak, wszystkie nasze szablony są edytowalne i przeznaczone do dostosowania do specyfiki Twojego produktu. Należy jednak pamiętać, aby zachować wszystkie wymagane prawnie elementy dokumentów wskazane w instrukcjach.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold mb-2">Jak często aktualizowane są szablony dokumentów?</h3>
                <p className="text-gray-600">
                  Wszystkie nasze szablony są regularnie aktualizowane, aby odzwierciedlać najnowsze interpretacje przepisów i wymagania CPR 2024. Data ostatniej aktualizacji jest zawsze widoczna przy każdym dokumencie.
                </p>
              </div>
            </div>

            <div className="mt-10 text-center">
              <p className="text-gray-600 mb-4">
                Masz więcej pytań dotyczących dokumentacji zgodnej z CPR 2024?
              </p>
              <Button 
                onClick={() => document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" })}
                variant="outline"
                className="font-medium"
              >
                Skontaktuj się z nami
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-section" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Potrzebujesz pomocy z dokumentacją?</h2>
            <p className="text-gray-600 mb-8">
              Nasi eksperci są gotowi pomóc Ci w przygotowaniu dokumentacji zgodnej z CPR 2024. Oferujemy indywidualne konsultacje oraz usługi przygotowania i weryfikacji dokumentów.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="font-medium"
                onClick={() => window.location.href = "/Services"}
              >
                Poznaj nasze usługi
              </Button>
              <Button 
                variant="outline" 
                className="font-medium"
              >
                Umów konsultację
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Email Capture Modal */}
      {showEmailForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            {!downloadSuccess ? (
              <>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">Pobierz dokument</h3>
                  <button 
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <p className="text-gray-600 mb-4">
                  Podaj swój adres email, aby otrzymać przykładowy dokument. 
                </p>
                <p className="text-gray-600 mb-6">
                  <span className="font-medium">Uwaga:</span> Obecnie udostępniamy przykładowe dokumenty, które demonstrują format i strukturę. Na podany adres wyślemy również powiadomienie, gdy dostępne będą pełne szablony dokumentów zgodne z CPR 2024.
                </p>
                
                <form onSubmit={handleEmailSubmit}>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Adres email</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                      placeholder="twoj@email.pl"
                    />
                    {formError && <p className="text-red-500 text-sm mt-1">{formError}</p>}
                  </div>
                  
                  <div className="flex items-start mb-4">
                    <input
                      id="consent"
                      name="consent"
                      type="checkbox"
                      className="h-4 w-4 text-gray-600 focus:ring-gray-400 border-gray-300 rounded mt-1"
                      required
                    />
                    <label htmlFor="consent" className="ml-2 block text-sm text-gray-600">
                      Wyrażam zgodę na przetwarzanie moich danych osobowych w celu otrzymania dokumentu oraz informacji o aktualizacjach zgodnie z Polityką Prywatności.
                    </label>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" className="w-full">
                      Pobierz dokument
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-500 mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Dziękujemy!</h3>
                <p className="text-gray-600 mb-4">
                  Przykładowy dokument <span className="font-semibold">{selectedDocument?.title}</span> ({selectedDocument?.fileType}) został wysłany do pobrania.
                </p>
                <div className="bg-gray-50 p-4 rounded-md mb-4 text-left">
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-medium">Instrukcje:</span>
                  </p>
                  <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                    <li>Dokument powinien zostać pobrany automatycznie</li>
                    <li>Dodatkowo dokument otwiera się w nowej karcie przeglądarki</li>
                    <li>Jeśli nie widzisz dokumentu, sprawdź ustawienia przeglądarki (blokowanie wyskakujących okienek)</li>
                    <li>W przypadku problemów, użyj przycisku "Pobierz ponownie"</li>
                  </ul>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button 
                    onClick={() => {
                      if (selectedDocumentId) {
                        downloadDocument(selectedDocumentId);
                      }
                    }}
                    className="mt-2"
                    variant="secondary"
                  >
                    Pobierz ponownie
                  </Button>
                  <Button 
                    onClick={closeModal}
                    className="mt-2"
                    variant="outline"
                  >
                    Zamknij
                  </Button>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    Na adres <span className="font-medium">{email}</span> prześlemy również powiadomienia o:
                  </p>
                  <ul className="text-xs text-gray-500 mt-2 space-y-1">
                    <li>• Dostępności pełnych szablonów dokumentów zgodnych z CPR</li>
                    <li>• Aktualizacjach związanych ze zmianami w przepisach</li>
                    <li>• Nowych materiałach szkoleniowych i pomocniczych</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}