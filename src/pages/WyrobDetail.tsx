import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Container } from "../components/Container";
import { Building2, ChevronRight, Calendar, ArrowLeft, FileText, HelpCircle } from "lucide-react";
import type { ProductFamily } from "../utils/wyrobLoader";

const KEY_DATES = [
  { date: "8 sty 2026", label: "Pełne stosowanie CPR 2024" },
  { date: "8 sty 2027", label: "Sankcje za naruszenia" },
  { date: "9 sty 2031", label: "Wygasają stare EAD" },
  { date: "7 sty 2040", label: "Koniec okresu przejściowego" },
];

function markdownToHtml(markdown: string): string {
  if (!markdown) return "";
  let html = markdown;
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold text-white my-6">$1</h1>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-semibold text-white my-5">$1</h2>');
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold text-amber-400 my-4">$1</h3>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em class="text-slate-300">$1</em>');
  html = html.replace(/^- (.+)$/gm, '<li class="ml-6 list-disc text-slate-300 my-1">$1</li>');
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-6 list-decimal text-slate-300 my-1">$1</li>');
  html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-amber-400/50 pl-4 italic text-slate-400 my-4">$1</blockquote>');
  html = html.replace(/\n\n([^#<\n].+?)\n\n/gs, '<p class="text-slate-300 leading-relaxed my-4">$1</p>');
  html = html.replace(/\n\n([^#<\n].+?)$/gs, '<p class="text-slate-300 leading-relaxed my-4">$1</p>');
  return html;
}

export default function WyrobDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const slug = searchParams.get("slug");
  const [wyrob, setWyrob] = useState<ProductFamily | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) {
        setError("Brak parametru slug w URL");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const { getWyrob } = await import("../utils/wyrobLoader");
        const found = await getWyrob(slug);
        if (found) {
          setWyrob(found);
          setError(null);
        } else {
          setError("Nie znaleziono rodziny wyrobów");
        }
      } catch (err) {
        console.error("Error loading wyrob:", err);
        setError("Błąd podczas ładowania danych");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <Header />
      <main className="flex-grow pt-24 pb-20">
        <Container>
          <button
            onClick={() => navigate("/wyroby")}
            className="flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Wszystkie wyroby
          </button>
          {loading && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 w-1/3 bg-slate-800 rounded" />
                <div className="h-10 w-3/4 bg-slate-800 rounded" />
                <div className="h-4 w-full bg-slate-800 rounded" />
                <div className="h-4 w-5/6 bg-slate-800 rounded" />
              </div>
              <div className="space-y-4">
                <div className="h-48 bg-slate-800 rounded-2xl" />
                <div className="h-48 bg-slate-800 rounded-2xl" />
              </div>
            </div>
          )}
          {!loading && error && (
            <div className="text-center py-20">
              <Building2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{error}</h3>
              <button
                onClick={() => navigate("/wyroby")}
                className="mt-4 px-6 py-3 bg-amber-400 text-slate-900 font-semibold rounded-xl hover:bg-amber-300 transition-colors"
              >
                Wróć do katalogu
              </button>
            </div>
          )}
          {!loading && wyrob && (
            <>
              <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
                <button onClick={() => navigate("/")} className="hover:text-amber-400 transition-colors">
                  Strona główna
                </button>
                <ChevronRight className="w-3 h-3" />
                <button onClick={() => navigate("/wyroby")} className="hover:text-amber-400 transition-colors">
                  Wyroby
                </button>
                <ChevronRight className="w-3 h-3" />
                <span className="text-white">{wyrob.title}</span>
              </nav>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <article className="lg:col-span-2">
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-400 text-sm font-bold">
                        Rodzina #{wyrob.family_number}
                      </span>
                      {wyrob.category && (
                        <span className="text-xs text-slate-400 bg-slate-800/60 px-3 py-1 rounded-full">
                          {wyrob.category}
                        </span>
                      )}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                      {wyrob.title}
                    </h1>
                    {wyrob.family_name_en && (
                      <p className="text-slate-400 italic">{wyrob.family_name_en}</p>
                    )}
                  </div>
                  <div
                    className="prose-dark"
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(wyrob.content) }}
                  />
                </article>
                <aside className="space-y-6">
                  <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-amber-400" />
                      Informacje
                    </h3>
                    <dl className="space-y-4">
                      <div>
                        <dt className="text-slate-500 text-xs uppercase tracking-wide mb-1">Numer rodziny</dt>
                        <dd className="text-white font-semibold">#{wyrob.family_number}</dd>
                      </div>
                      {wyrob.normy && wyrob.normy.length > 0 && (
                        <div>
                          <dt className="text-slate-500 text-xs uppercase tracking-wide mb-1">Normy</dt>
                          <dd className="space-y-1">
                            {wyrob.normy.map((norma) => (
                              <span key={norma} className="block text-slate-300 text-sm font-mono bg-slate-700/50 px-2 py-1 rounded">
                                {norma}
                              </span>
                            ))}
                          </dd>
                        </div>
                      )}
                      {wyrob.avs_system && (
                        <div>
                          <dt className="text-slate-500 text-xs uppercase tracking-wide mb-1">System AVS</dt>
                          <dd className="text-white font-semibold">{wyrob.avs_system}</dd>
                        </div>
                      )}
                      {wyrob.category && (
                        <div>
                          <dt className="text-slate-500 text-xs uppercase tracking-wide mb-1">Kategoria</dt>
                          <dd className="text-slate-300">{wyrob.category}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                  <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-amber-400" />
                      Kluczowe daty
                    </h3>
                    <ul className="space-y-3">
                      {KEY_DATES.map((item) => (
                        <li key={item.date} className="flex items-start gap-3">
                          <span className="text-amber-400 font-mono text-xs font-bold mt-0.5 whitespace-nowrap">
                            {item.date}
                          </span>
                          <span className="text-slate-400 text-sm">{item.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-amber-400/10 to-orange-500/10 border border-amber-400/20 rounded-2xl p-6">
                    <h3 className="text-white font-semibold text-lg mb-2 flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-amber-400" />
                      Potrzebujesz pomocy?
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">
                      Nasi eksperci pomogą Ci w certyfikacji i spełnieniu wymagań CPR 2024/3110.
                    </p>
                    <button
                      onClick={() => navigate("/services")}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-400 text-slate-900 font-semibold rounded-xl hover:bg-amber-300 transition-colors text-sm"
                    >
                      Skontaktuj się z nami
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </aside>
              </div>
            </>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
}