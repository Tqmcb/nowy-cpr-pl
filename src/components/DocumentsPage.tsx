import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/extensions/shadcn/components/button";
import { documents, trackLead, downloadDocument } from "../utils/documentHelpers";
import { Container } from "./Container";
import { PageHeader } from "./PageHeader";
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
      return <FileText className="w-6 h-6 text-[oklch(55% .22 27)]" />;
    default:
      return <FileText className="w-6 h-6 text-slate-400" />;
  }
};

const Document = ({ document, onDownload }: { document: DocumentProps; onDownload: (id: string) => void }) => {
  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 flex flex-col h-full hover:border-[oklch(55% .22 27)]/30 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
              {getFileIcon(document.fileType)}
            </div>
            <div>
              <span className="px-2 py-1 rounded bg-[oklch(55% .22 27)]/10 text-[oklch(55% .22 27)] text-xs font-medium">{document.fileType}</span>
              <span className="px-2 py-1 rounded bg-slate-100 text-slate-500 text-xs ml-2">{document.language}</span>
            </div>
          </div>
          <h3 className="text-lg font-bold text-[oklch(20% .03 264)] group-hover:text-[oklch(55% .22 27)] transition-colors">{document.title}</h3>
        </div>
      </div>
      <p className="text-slate-500 text-sm mb-4 flex-grow leading-relaxed">{document.description}</p>
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock className="w-4 h-4" />
          <span>Aktualizacja: {document.updatedAt}</span>
        </div>
        <Button
          onClick={() => onDownload(document.id)}
          size="sm"
          className="px-4 py-2 rounded-lg border-0 text-white font-medium text-sm shadow-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: "oklch(55% .22 27)" }}
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
    <div className="min-h-screen bg-white">
      <PageHeader>
        <div className="flex flex-wrap items-baseline gap-8">
          <div>
            <span className="editorial-numeral text-4xl" style={{ color: "oklch(55% .22 27)", fontWeight: 300 }}>{documents.length}</span>
            <span className="editorial-kicker ml-3" style={{ color: "oklch(60% .015 264)" }}>dokumentów dostępnych</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              onClick={() => document.getElementById("documents-section")?.scrollIntoView({ behavior: "smooth" })}
              className="w-full sm:w-auto justify-center text-white font-semibold px-6 py-3 transition-all whitespace-nowrap"
              style={{ backgroundColor: "oklch(20% .03 264)", borderRadius: "2px" }}
            >
              <FileText className="w-4 h-4 mr-2 shrink-0" />
              Przeglądaj dokumenty
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto justify-center font-semibold px-6 py-3 transition-all whitespace-nowrap"
              style={{ border: "1px solid oklch(20% .03 264)", color: "oklch(20% .03 264)", borderRadius: "2px" }}
              onClick={() => document.getElementById("faq-section")?.scrollIntoView({ behavior: "smooth" })}
            >
              <HelpCircle className="w-4 h-4 mr-2 shrink-0" />
              Najczęstsze pytania
            </Button>
          </div>
        </div>
      </PageHeader>

      {/* Documents Section — editorial */}
      <section id="documents-section" className="py-20 md:py-24 bg-white">
        <Container>
          <div className="max-w-6xl mx-auto">
            {/* Info note */}
            <div className="mb-12 p-6" style={{ borderLeft: "2px solid oklch(55% .22 27)", backgroundColor: "oklch(98% .005 264)" }}>
              <div className="editorial-kicker mb-2" style={{ color: "oklch(55% .22 27)" }}>Jak korzystać</div>
              <p className="text-sm leading-[1.65]" style={{ color: "oklch(42% .02 264)" }}>
                Dokumenty otwierają się w przeglądarce jako strona HTML gotowa do wydruku.
                Aby zapisać jako PDF: <strong style={{ color: "oklch(20% .03 264)", fontWeight: 600 }}>Ctrl+P</strong> → <strong style={{ color: "oklch(20% .03 264)", fontWeight: 600 }}>Zapisz jako PDF</strong>.
                Szablony są edukacyjne — dostosuj do swojego wyrobu i normy zharmonizowanej przed użyciem.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-10 pb-8" style={{ borderBottom: "1px solid oklch(92% .008 264)" }}>
              <div className="flex-grow relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "oklch(60% .015 264)" }} />
                <input
                  type="text"
                  placeholder="Szukaj dokumentów..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white focus:outline-none transition-all font-serif"
                  style={{ border: "1px solid oklch(86% .012 264)", borderRadius: "2px", color: "oklch(20% .03 264)" }}
                />
              </div>
              <div className="md:w-48 relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "oklch(60% .015 264)" }} />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white focus:outline-none transition-all appearance-none cursor-pointer font-serif"
                  style={{ border: "1px solid oklch(86% .012 264)", borderRadius: "2px", color: "oklch(20% .03 264)" }}
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
              <div className="py-16 text-center" style={{ borderTop: "1px solid oklch(92% .008 264)" }}>
                <h3 className="font-serif text-2xl mb-2" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>Brak wyników</h3>
                <p style={{ color: "oklch(42% .02 264)" }}>Nie znaleziono dokumentów spełniających kryteria.</p>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* FAQ Section — editorial */}
      <section id="faq-section" className="py-20 md:py-24" style={{ backgroundColor: "oklch(98% .005 264)" }}>
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="flex items-baseline gap-6 mb-12">
              <span className="editorial-numeral text-6xl md:text-7xl" style={{ color: "oklch(55% .22 27)", fontWeight: 300 }}>—</span>
              <div className="flex items-center gap-3 pt-4">
                <div className="h-[2px] w-10" style={{ backgroundColor: "oklch(55% .22 27)" }} />
                <span className="editorial-kicker">FAQ</span>
              </div>
            </div>
            <h2 className="font-serif text-[2.5rem] md:text-[3.5rem] leading-[1] mb-16" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>
              Najczęściej<br/>
              <span className="italic" style={{ color: "oklch(55% .22 27)", fontWeight: 500 }}>zadawane pytania</span>
            </h2>

            <div className="space-y-0" style={{ borderTop: "2px solid oklch(20% .03 264)" }}>
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
                <div key={idx} className="grid grid-cols-12 gap-6 py-8" style={{ borderBottom: "1px solid oklch(92% .008 264)" }}>
                  <span className="col-span-1 editorial-numeral text-3xl" style={{ color: "oklch(55% .22 27)", fontWeight: 300 }}>
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="col-span-11">
                    <h3 className="font-serif text-xl md:text-2xl mb-3 leading-[1.25]" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>
                      {faq.question}
                    </h3>
                    <p className="text-base leading-[1.65]" style={{ color: "oklch(42% .02 264)" }}>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <p className="text-sm mb-4" style={{ color: "oklch(42% .02 264)" }}>
                Masz więcej pytań dotyczące dokumentacji zgodnej z CPR?
              </p>
              <Button
                onClick={() => document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" })}
                variant="outline"
                className="font-semibold px-6 py-3 transition-all"
                style={{ border: "1px solid oklch(20% .03 264)", color: "oklch(20% .03 264)", borderRadius: "2px" }}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Skontaktuj się z nami
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Contact CTA — editorial dark banner */}
      <section id="contact-section" className="py-20 md:py-24 bg-white">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="relative py-12 md:py-16 px-8 md:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8" style={{ backgroundColor: "oklch(20% .03 264)" }}>
              <div className="absolute top-0 left-0 h-[5px] w-24" style={{ backgroundColor: "oklch(55% .22 27)" }} />

              <div className="max-w-2xl">
                <div className="editorial-kicker mb-4" style={{ color: "oklch(55% .22 27)" }}>Potrzebujesz pomocy</div>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.05] text-white mb-4" style={{ fontWeight: 500 }}>
                  Dokumentacja CPR —<br/>
                  <span className="italic" style={{ color: "oklch(75% .15 27)", fontWeight: 500 }}>pomożemy ją przygotować.</span>
                </h2>
                <p className="text-white/70 leading-[1.6]">
                  Audytorzy Multicert weryfikują i przygotowują dokumenty zgodne z CPR (EU) 2024/3110.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <Button asChild className="bg-white font-semibold px-6 py-3 transition-all hover:bg-slate-100"
                  style={{ color: "oklch(20% .03 264)", borderRadius: "2px" }}>
                  <Link to="/services">
                    Poznaj usługi
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline"
                  className="font-semibold px-6 py-3 transition-all hover:bg-white/10"
                  style={{ border: "1px solid rgba(255,255,255,0.3)", color: "white", backgroundColor: "transparent", borderRadius: "2px" }}>
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
                  <h3 className="text-xl font-bold text-[oklch(20% .03 264)]">Pobierz dokument</h3>
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
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[oklch(55% .22 27)]/50 focus:ring-1 focus:ring-[oklch(55% .22 27)]/30 transition-all"
                      placeholder="twoj@email.pl"
                    />
                    {formError && <p className="text-red-600 text-sm mt-2">{formError}</p>}
                  </div>

                  <div className="flex items-start mb-6">
                    <input
                      id="consent"
                      name="consent"
                      type="checkbox"
                      className="h-4 w-4 mt-1 rounded border-slate-300 bg-white text-[oklch(55% .22 27)] focus:ring-[oklch(55% .22 27)]"
                      required
                    />
                    <label htmlFor="consent" className="ml-3 block text-sm text-slate-600">
                      Wyrażam zgodę na przetwarzanie moich danych osobowych w celu otrzymania dokumentu oraz informacji o aktualizacjach.
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-3 rounded-xl border-0 text-white font-semibold shadow-sm transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "oklch(55% .22 27)" }}
                  >
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
                <h3 className="text-xl font-bold text-[oklch(20% .03 264)] mb-2">Dziękujemy!</h3>
                <p className="text-slate-600 mb-6">
                  Dokument <span className="font-semibold text-[oklch(20% .03 264)]">{selectedDocument?.title}</span> otworzył się w nowej karcie.
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
                    className="border-[oklch(55%_.22_27/0.25)] text-[oklch(55%_.22_27)] bg-white hover:bg-[oklch(55%_.22_27/0.06)]"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Pobierz ponownie
                  </Button>
                  <Button
                    onClick={closeModal}
                    className="py-3 rounded-xl bg-[oklch(20% .03 264)] hover:bg-[#1a3d6b] text-white font-semibold"
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
