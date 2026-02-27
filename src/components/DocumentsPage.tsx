import { useState } from "react";
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
  ChevronDown,
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
      return <FileText className="w-6 h-6 text-red-400" />;
    case 'docx':
      return <File className="w-6 h-6 text-blue-400" />;
    case 'xlsx':
      return <File className="w-6 h-6 text-green-400" />;
    case 'html':
      return <FileText className="w-6 h-6 text-amber-400" />;
    default:
      return <FileText className="w-6 h-6 text-slate-400" />;
  }
};

const Document = ({ document, onDownload }: { document: DocumentProps; onDownload: (id: string) => void }) => {
  return (
    <div className="glass-card p-6 flex flex-col h-full hover-lift card-border-glow group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              {getFileIcon(document.fileType)}
            </div>
            <div>
              <span className="px-2 py-1 rounded bg-amber-400/10 text-amber-400 text-xs font-medium">{document.fileType}</span>
              <span className="px-2 py-1 rounded bg-slate-700/50 text-slate-400 text-xs ml-2">{document.language}</span>
            </div>
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">{document.title}</h3>
        </div>
      </div>
      <p className="text-slate-400 text-sm mb-4 flex-grow leading-relaxed">{document.description}</p>
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock className="w-4 h-4" />
          {document.updatedAt}
        </div>
        <Button
          onClick={() => onDownload(document.id)}
          size="sm"
          className="btn-premium px-4 py-2 rounded-lg text-slate-900 font-medium text-sm"
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
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
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
                  <span className="text-amber-400 text-sm font-medium">Dokumentacja CPR</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="text-white">Szablony </span>
                  <span className="gradient-text">Dokumentów CPR</span>
                </h1>
                <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-2xl">
                  Profesjonalnie przygotowane wzory dokumentów zgodne z wymaganiami Rozporządzenia CPR (EU) 2024/3110.
                  Zaoszczędź czas i uniknij błędów korzystając z naszych szablonów.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => document.getElementById("documents-section")?.scrollIntoView({ behavior: "smooth" })}
                    className="btn-premium px-6 py-3 rounded-full text-slate-900 font-semibold"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    Przeglądaj dokumenty
                  </Button>
                  <Button
                    variant="outline"
                    className="px-6 py-3 rounded-full border-white/20 text-white bg-transparent hover:bg-white/10"
                    onClick={() => document.getElementById("faq-section")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    <HelpCircle className="w-5 h-5 mr-2" />
                    Najczęstsze pytania
                  </Button>
                </div>
              </div>
              <div className="md:w-1/3">
                <div className="glass-card p-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <FileText className="w-10 h-10 text-slate-900" />
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text mb-1">{documents.length}</div>
                    <p className="text-slate-400 text-sm">dokumentów dostępnych</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-lg font-bold text-white">HTML</div>
                      <p className="text-slate-500 text-xs">szablony</p>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white">→PDF</div>
                      <p className="text-slate-500 text-xs">wydruk</p>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white">PL</div>
                      <p className="text-slate-500 text-xs">język</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Documents Section */}
      <section id="documents-section" className="py-16 bg-gradient-to-b from-slate-900 to-slate-950">
        <Container>
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Dokumenty do <span className="gradient-text">pobrania</span>
            </h2>
            <p className="text-slate-400 mb-6">Wybierz i pobierz potrzebne szablony dokumentów</p>

            {/* Info Alert */}
            <div className="glass-card p-4 mb-8 flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-white font-medium mb-1">Jak korzystać z dokumentów?</p>
                <p className="text-sm text-slate-400">
                  Dokumenty otwierają się w przeglądarce jako strona HTML gotowa do wydruku.
                  Aby zapisać jako PDF: otwórz dokument → naciśnij <strong className="text-slate-300">Ctrl+P</strong> → wybierz <strong className="text-slate-300">„Zapisz jako PDF"</strong>.
                  Szablony są edukacyjne — dostosuj je do swojego wyrobu i normy zharmonizowanej przed użyciem.
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-grow relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Szukaj dokumentów..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all"
                />
              </div>
              <div className="md:w-48 relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="all" className="bg-slate-800">Wszystkie typy</option>
                  <option value="HTML" className="bg-slate-800">HTML (→ PDF)</option>
                  <option value="PDF" className="bg-slate-800">PDF</option>
                  <option value="DOCX" className="bg-slate-800">DOCX</option>
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
              <div className="text-center py-16 glass-card">
                <Search className="w-16 h-16 mx-auto text-slate-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Brak wyników</h3>
                <p className="text-slate-400">Nie znaleziono dokumentów spełniających kryteria wyszukiwania.</p>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section id="faq-section" className="py-24 bg-slate-950">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Najczęściej zadawane <span className="gradient-text">pytania</span>
              </h2>
              <p className="text-slate-400">Odpowiedzi na najczęstsze pytania dotyczące dokumentacji CPR</p>
            </div>

            <div className="space-y-4">
              {[
                {
                  question: "Jak wypełnić deklarację właściwości użytkowych (DoP)?",
                  answer: "Deklaracja właściwości użytkowych (DoP) powinna zawierać wszystkie istotne informacje o produkcie, w tym jego zamierzone zastosowanie, właściwości użytkowe oraz odniesienie do zharmonizowanej specyfikacji technicznej. Szczegółowe instrukcje znajdziesz w naszym szablonie DoP po pobraniu."
                },
                {
                  question: "Jakie są główne zmiany w CPR (EU) 2024/3110 w zakresie dokumentacji?",
                  answer: "Nowe rozporządzenie wprowadza cyfrowe deklaracje DoP&C (art. 16), obowiązek ujawniania substancji SVHC (art. 15 ust. 6), nowy system AVS 3+ dla weryfikacji EPD, Cyfrowy Paszport Produktu (DPP, art. 75–80) oraz unikalny identyfikator wyrobu (art. 22 ust. 5)."
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
                <div key={idx} className="glass-card p-6">
                  <h3 className="text-lg font-bold text-white mb-3 flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    {faq.question}
                  </h3>
                  <p className="text-slate-400 leading-relaxed pl-8">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-slate-400 mb-4">
                Masz więcej pytań dotyczące dokumentacji zgodnej z CPR?
              </p>
              <Button
                onClick={() => document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" })}
                variant="outline"
                className="border-white/20 text-white bg-transparent hover:bg-white/10"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Skontaktuj się z nami
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Contact CTA Section */}
      <section id="contact-section" className="py-16 bg-slate-900 border-t border-white/5">
        <Container>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 via-slate-800 to-slate-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-blue-500/10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Potrzebujesz pomocy z dokumentacją?
              </h2>
              <p className="text-slate-400 mb-8">
                Nasi eksperci są gotowi pomóc Ci w przygotowaniu dokumentacji zgodnej z CPR (EU) 2024/3110.
                Oferujemy indywidualne konsultacje oraz usługi przygotowania i weryfikacji dokumentów.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  className="btn-premium px-6 py-3 rounded-full text-slate-900 font-semibold"
                  onClick={() => window.location.href = "/services"}
                >
                  Poznaj nasze usługi
                  <ArrowRight className="w-4 h-4 ml-2" />
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card max-w-md w-full p-6 animate-fade-in">
            {!downloadSuccess ? (
              <>
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-bold text-white">Pobierz dokument</h3>
                  <button
                    onClick={closeModal}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <p className="text-slate-400 mb-6">
                  Podaj swój adres email, aby otworzyć szablon dokumentu.
                  Dokument otworzy się w nowej karcie — zapisz go jako PDF używając Ctrl+P.
                </p>

                <form onSubmit={handleEmailSubmit}>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Adres email</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all"
                      placeholder="twoj@email.pl"
                    />
                    {formError && <p className="text-red-400 text-sm mt-2">{formError}</p>}
                  </div>

                  <div className="flex items-start mb-6">
                    <input
                      id="consent"
                      name="consent"
                      type="checkbox"
                      className="h-4 w-4 mt-1 rounded border-white/20 bg-white/5 text-amber-400 focus:ring-amber-400"
                      required
                    />
                    <label htmlFor="consent" className="ml-3 block text-sm text-slate-400">
                      Wyrażam zgodę na przetwarzanie moich danych osobowych w celu otrzymania dokumentu oraz informacji o aktualizacjach.
                    </label>
                  </div>

                  <Button type="submit" className="w-full btn-premium py-3 rounded-xl text-slate-900 font-semibold">
                    <Download className="w-4 h-4 mr-2" />
                    Pobierz dokument
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Dziękujemy!</h3>
                <p className="text-slate-400 mb-6">
                  Dokument <span className="font-semibold text-white">{selectedDocument?.title}</span> otworzył się w nowej karcie.
                  Użyj <strong className="text-slate-300">Ctrl+P → Zapisz jako PDF</strong> aby zapisać.
                </p>
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={() => {
                      if (selectedDocumentId) {
                        downloadDocument(selectedDocumentId);
                      }
                    }}
                    variant="outline"
                    className="border-white/20 text-white bg-transparent hover:bg-white/10"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Pobierz ponownie
                  </Button>
                  <Button
                    onClick={closeModal}
                    className="btn-premium py-3 rounded-xl text-slate-900 font-semibold"
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