import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/extensions/shadcn/components/button";
import { documents, trackLead, downloadDocument } from "../utils/documentHelpers";
import { Container } from "./Container";
import {
  Search,
  Download,
  FileText,
  Filter,
  X,
  CheckCircle2,
  HelpCircle,
  Mail,
  MessageCircle,
  ArrowRight,
  File,
  Clock,
  Info,
  RefreshCw,
  Sparkles
} from "lucide-react";

interface DocumentProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  fileType: string;
  language: string;
  updatedAt: string;
}

const getFileIcon = (fileType: string) => {
  switch (fileType.toLowerCase()) {
    case 'pdf':
      return <FileText className="w-6 h-6 text-red-500" />;
    case 'docx':
      return <File className="w-6 h-6 text-blue-500" />;
    case 'xlsx':
      return <File className="w-6 h-6 text-green-600" />;
    case 'html':
      return <FileText className="w-6 h-6 text-[#1a56a0]" />;
    default:
      return <FileText className="w-6 h-6 text-slate-400" />;
  }
};

const Document = ({ document, onDownload }: { document: DocumentProps; onDownload: (id: string) => void }) => {
  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 flex flex-col h-full hover:border-[#1a56a0]/30 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
              {getFileIcon(document.fileType)}
            </div>
            <div>
              <span className="px-2 py-1 rounded bg-[#1a56a0]/10 text-[#1a56a0] text-xs font-medium">{document.fileType}</span>
              <span className="px-2 py-1 rounded bg-slate-100 text-slate-500 text-xs ml-2">{document.language}</span>
            </div>
          </div>
          <h3 className="text-lg font-bold text-[#0d2137] group-hover:text-[#1a56a0] transition-colors">{document.title}</h3>
        </div>
      </div>
      <p className="text-slate-500 text-sm mb-4 flex-grow leading-relaxed">{document.description}</p>
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock className="w-4 h-4" />
          {document.updatedAt}
        </div>
        <Button
          onClick={() => onDownload(document.id)}
          size="sm"
          className="px-4 py-2 rounded-lg bg-[#0d2137] hover:bg-[#1a3d6b] text-white font-medium text-sm"
        >
          <Download className="w-4 h-4 mr-2" />
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
  // Honeypot — niewidoczne dla ludzi, wypełniane przez boty
  const [honeypot, setHoneypot] = useState("");

  const selectedDocument = documents.find(doc => doc.id === selectedDocumentId);

  const handleDownloadClick = (documentId: string) => {
    setSelectedDocumentId(documentId);
    setShowEmailForm(true);
    setDownloadSuccess(false);
    setFormError("");
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot — bot wypełnił ukryte pole, cicho odrzucamy
    if (honeypot) {
      setDownloadSuccess(true);
      return;
    }

    if (!email.trim()) {
      setFormError("Proszę podać adres email");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!emailRegex.test(email)) {
      setFormError("Proszę podać prawidłowy adres email");
      return;
    }

    if (!selectedDocumentId) {
      setFormError("Wystąpił błąd. Proszę spróbować ponownie.");
      return;
    }

    // Otwórz dokument SYNCHRONICZNIE — w bezpośrednim kontekście kliknięcia,
    // zanim jakikolwiek kod async zdąży przerwać "user gesture" i spowodować
    // zablokowanie window.open() przez popup blocker przeglądarki.
    try {
      const downloadResult = downloadDocument(selectedDocumentId);
      if (!downloadResult) {
        setFormError("Wystąpił błąd podczas otwierania dokumentu. Proszę spróbować ponownie.");
        return;
      }
    } catch (downloadError) {
      console.error("Błąd podczas otwierania dokumentu:", downloadError);
      setFormError("Nie udało się otworzyć dokumentu. Sprawdź czy dokument istnieje.");
      return;
    }

    setDownloadSuccess(true);
    setFormError("");

    // Zapisz lead asynchronicznie (po otwarciu dokumentu — nie blokuje UI)
    trackLead(email, selectedDocumentId).catch(err =>
      console.error("Błąd zapisu leada:", err)
    );

    setTimeout(() => {
      setShowEmailForm(false);
      setEmail("");
    }, 3000);
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
    <div className="min-h-screen section-paper">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden border-b border-slate-800">
        {/* B&W photo background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1400&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "grayscale(100%) contrast(1.1) brightness(0.75)",
          }}
        />
        {/* Navy→blue gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(13,33,55,0.88) 0%, rgba(26,86,160,0.65) 100%)" }}
        />
        {/* Bottom accent stripe */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[4px]"
          style={{ background: "linear-gradient(to right, #8b1a3c 30%, #1a56a0 100%)" }}
        />

        <Container>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="md:w-2/3">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/30 mb-6">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">Dokumentacja CPR</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Szablony Dokumentów CPR
                </h1>
                <p className="text-lg text-white/80 mb-8 leading-relaxed max-w-2xl">
                  Profesjonalnie przygotowane wzory dokumentów zgodne z wymaganiami Rozporządzenia CPR (EU) 2024/3110.
                  Zaoszczędź czas i uniknij błędów korzystając z naszych szablonów.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => document.getElementById("documents-section")?.scrollIntoView({ behavior: "smooth" })}
                    className="px-6 py-3 rounded-full bg-[#0d2137] hover:bg-[#1a3d6b] text-white font-semibold"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    Przeglądaj dokumenty
                  </Button>
                  <Button
                    variant="outline"
                    className="px-6 py-3 rounded-full border-white/30 text-white bg-white/10 hover:bg-white/20"
                    onClick={() => document.getElementById("faq-section")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    <HelpCircle className="w-5 h-5 mr-2" />
                    Najczęstsze pytania
                  </Button>
                </div>
              </div>
              <div className="md:w-1/3">
                <div className="bg-white/15 backdrop-blur-md border border-white/30 shadow-xl rounded-2xl p-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center">
                    <FileText className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">{documents.length}</div>
                    <p className="text-white/70 text-sm">dokumentów dostępnych</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-lg font-bold text-white">HTML</div>
                      <p className="text-white/60 text-xs">szablony</p>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white">→PDF</div>
                      <p className="text-white/60 text-xs">wydruk</p>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white">PL</div>
                      <p className="text-white/60 text-xs">język</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Documents Section */}
      <section id="documents-section" className="py-16 bg-white">
        <Container>
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0d2137] mb-2">
              Dokumenty do pobrania
            </h2>
            <p className="text-slate-500 mb-6">Wybierz i pobierz potrzebne szablony dokumentów</p>

            {/* Info Alert */}
            <div className="bg-[#1a56a0]/5 border border-[#1a56a0]/20 rounded-xl p-4 mb-8 flex items-start gap-3">
              <Info className="w-5 h-5 text-[#1a56a0] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-[#0d2137] font-medium mb-1">Jak korzystać z dokumentów?</p>
                <p className="text-sm text-slate-600">
                  Dokumenty otwierają się w przeglądarce jako strona HTML gotowa do wydruku.
                  Aby zapisać jako PDF: otwórz dokument → naciśnij <strong className="text-slate-800">Ctrl+P</strong> → wybierz <strong className="text-slate-800">„Zapisz jako PDF"</strong>.
                  Szablony są edukacyjne — dostosuj je do swojego wyrobu i normy zharmonizowanej przed użyciem.
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-grow relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Szukaj dokumentów..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1a56a0]/50 focus:ring-1 focus:ring-[#1a56a0]/30 transition-all"
                />
              </div>
              <div className="md:w-48 relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-[#1a56a0]/50 focus:ring-1 focus:ring-[#1a56a0]/30 transition-all appearance-none cursor-pointer"
                >
                  <option value="all">Wszystkie typy</option>
                  <option value="HTML">HTML (→ PDF)</option>
                  <option value="PDF">PDF</option>
                  <option value="DOCX">DOCX</option>
                </select>
              </div>
            </div>

            {/* Documents Grid */}
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
              <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
                <Search className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-[#0d2137] mb-2">Brak wyników</h3>
                <p className="text-slate-500">Nie znaleziono dokumentów spełniających kryteria wyszukiwania.</p>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section id="faq-section" className="py-24 bg-slate-50 border-t border-slate-200">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0d2137] mb-4">
                Najczęściej zadawane pytania
              </h2>
              <p className="text-slate-500">Odpowiedzi na najczęstsze pytania dotyczące dokumentacji CPR</p>
            </div>

            <div className="space-y-4">
              {[
                {
                  question: "Jak wypełnić deklarację właściwości użytkowych i zgodności (DoP&C)?",
                  answer: "Deklaracja właściwości użytkowych i zgodności (DoP&C) powinna zawierać wszystkie istotne informacje o produkcie, w tym jego zamierzone zastosowanie, właściwości użytkowe oraz odniesienie do zharmonizowanej specyfikacji technicznej. Szczegółowe instrukcje znajdziesz w naszym szablonie DoP&C po pobraniu."
                },
                {
                  question: "Jakie są główne zmiany w CPR (EU) 2024/3110 w zakresie dokumentacji?",
                  answer: "Nowe rozporządzenie wprowadza cyfrowe deklaracje DoP&C (art. 16 ust. 2), obowiązek ujawniania substancji SVHC, nowy system AVS 3+ dla weryfikacji EPD, Cyfrowy Paszport Produktu (DPP, art. 75–80) oraz unikalny identyfikator wyrobu."
                },
                {
                  question: "Czy mogę modyfikować pobrane szablony dokumentów?",
                  answer: "Tak, wszystkie nasze szablony są edytowalne i przeznaczone do dostosowania do specyfiki Twojego produktu. Należy jednak pamiętać, aby zachować wszystkie wymagane prawnie elementy dokumentów wskazane w instrukcjach."
                },
                {
                  question: "Jak często aktualizowane są szablony dokumentów?",
                  answer: "Wszystkie nasze szablony są regularnie aktualizowane, aby odzwierciedlać najnowsze interpretacje przepisów i wymagania CPR. Data ostatniej aktualizacji jest zawsze widoczna przy każdym dokumencie."
                }
              ].map((faq, idx) => (
                <div key={idx} className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
                  <h3 className="text-lg font-bold text-[#0d2137] mb-3 flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-[#1a56a0] flex-shrink-0 mt-0.5" />
                    {faq.question}
                  </h3>
                  <p className="text-slate-600 leading-relaxed pl-8">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-slate-500 mb-4">
                Masz więcej pytań dotyczące dokumentacji zgodnej z CPR?
              </p>
              <Button
                onClick={() => document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" })}
                variant="outline"
                className="border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:border-[#1a56a0]/40"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Skontaktuj się z nami
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Contact CTA Section */}
      <section id="contact-section" className="py-16 bg-white border-t border-slate-200">
        <Container>
          <div className="relative overflow-hidden rounded-2xl bg-[#0d2137] p-8 md:p-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Potrzebujesz pomocy z dokumentacją?
              </h2>
              <p className="text-slate-300 mb-8">
                Nasi eksperci są gotowi pomóc Ci w przygotowaniu dokumentacji zgodnej z CPR (EU) 2024/3110.
                Oferujemy usługi przygotowania i weryfikacji dokumentów oraz ocenę zgodności z wymaganiami CPR 2024/3110.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  className="px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-[#0d2137] font-semibold"
                >
                  <Link to="/services">
                    Poznaj nasze usługi
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="px-6 py-3 rounded-full border-white/20 text-white hover:bg-white/10"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Umów konsultację
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Email Capture Modal */}
      {showEmailForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 shadow-xl rounded-2xl max-w-md w-full p-6">
            {!downloadSuccess ? (
              <>
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-bold text-[#0d2137]">Pobierz dokument</h3>
                  <button
                    onClick={closeModal}
                    className="text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <p className="text-slate-600 mb-6">
                  Podaj swój adres email, aby otworzyć szablon dokumentu.
                  Dokument otworzy się w nowej karcie — zapisz go jako PDF używając Ctrl+P.
                </p>

                <form onSubmit={handleEmailSubmit}>
                  {/* Honeypot — niewidoczne dla użytkowników */}
                  <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }}>
                    <label htmlFor="doc-website">Nie wypełniaj tego pola</label>
                    <input
                      id="doc-website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Adres email</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1a56a0]/50 focus:ring-1 focus:ring-[#1a56a0]/30 transition-all"
                      placeholder="twoj@email.pl"
                    />
                    {formError && <p className="text-red-600 text-sm mt-2">{formError}</p>}
                  </div>

                  <div className="flex items-start mb-6">
                    <input
                      id="consent"
                      name="consent"
                      type="checkbox"
                      className="h-4 w-4 mt-1 rounded border-slate-300 bg-white text-[#1a56a0] focus:ring-[#1a56a0]"
                      required
                    />
                    <label htmlFor="consent" className="ml-3 block text-sm text-slate-600">
                      Wyrażam zgodę na przetwarzanie moich danych osobowych w celu otrzymania dokumentu oraz informacji o aktualizacjach.
                    </label>
                  </div>

                  <Button type="submit" className="w-full py-3 rounded-xl bg-[#0d2137] hover:bg-[#1a3d6b] text-white font-semibold">
                    <Download className="w-4 h-4 mr-2" />
                    Pobierz dokument
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-[#0d2137] mb-2">Dziękujemy!</h3>
                <p className="text-slate-600 mb-6">
                  Dokument <span className="font-semibold text-[#0d2137]">{selectedDocument?.title}</span> otworzył się w nowej karcie.
                  Użyj <strong className="text-slate-800">Ctrl+P → Zapisz jako PDF</strong> aby zapisać.
                </p>
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={() => {
                      if (selectedDocumentId) {
                        downloadDocument(selectedDocumentId);
                      }
                    }}
                    variant="outline"
                    className="border-slate-200 text-slate-700 bg-white hover:bg-slate-50"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Pobierz ponownie
                  </Button>
                  <Button
                    onClick={closeModal}
                    className="py-3 rounded-xl bg-[#0d2137] hover:bg-[#1a3d6b] text-white font-semibold"
                  >
                    Zamknij
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
