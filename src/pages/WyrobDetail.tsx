import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Container } from "../components/Container";
import { Building2, ChevronRight, Calendar, ArrowLeft, FileText, HelpCircle, Newspaper, ExternalLink, CheckCircle2, Scale, ShieldCheck } from "lucide-react";
import type { ProductFamily } from "../utils/wyrobLoader";
import type { BlogPost } from "../utils/blogLoader";
import { Helmet } from "react-helmet-async";

const WYROB_COMPONENTS: Components = {
  h1: ({ children }) => <h1 className="text-3xl font-bold text-[oklch(20% .03 264)] my-6 leading-tight">{children}</h1>,
  h2: ({ children }) => <h2 className="text-2xl font-semibold text-[oklch(20% .03 264)] mt-8 mb-4 pb-2 border-b border-slate-200">{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg font-semibold text-[oklch(55% .22 27)] mt-6 mb-3">{children}</h3>,
  p: ({ children }) => <p className="text-slate-700 leading-relaxed my-4 text-[15px]">{children}</p>,
  strong: ({ children }) => <strong className="text-[oklch(20% .03 264)] font-semibold">{children}</strong>,
  em: ({ children }) => <em className="text-slate-500 italic">{children}</em>,
  a: ({ children, href }) => (
    <a href={href} className="text-[oklch(55% .22 27)] hover:text-[#1a3d6b] underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="my-4 space-y-2">{children}</ul>,
  ol: ({ children }) => <ol className="my-4 space-y-2">{children}</ol>,
  li: ({ children, ordered, index }) => (
    <li className="flex items-start gap-2.5 text-slate-700 text-[15px]">
      {ordered ? (
        <span className="text-[oklch(55% .22 27)] font-bold mt-0.5 min-w-[1.4rem] text-sm shrink-0">{(index ?? 0) + 1}.</span>
      ) : (
        <span className="text-[oklch(55% .22 27)] mt-2 shrink-0 text-xs">▪</span>
      )}
      <span>{children}</span>
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-[oklch(55% .22 27)]/40 bg-[oklch(55% .22 27)]/5 pl-5 py-3 my-5 rounded-r-lg">
      <div className="text-slate-600 italic text-[15px]">{children}</div>
    </blockquote>
  ),
  hr: () => <hr className="border-slate-200 my-8" />,
  code: ({ children, className }) => {
    if (className) return <code className={`${className} text-[oklch(55% .22 27)] text-sm font-mono`}>{children}</code>;
    return <code className="bg-slate-100 text-[oklch(55% .22 27)] px-1.5 py-0.5 rounded text-[13px] font-mono border border-slate-200">{children}</code>;
  },
  pre: ({ children }) => (
    <pre className="bg-slate-50 border border-slate-200 rounded-xl p-5 overflow-x-auto my-6 text-sm font-mono leading-relaxed">{children}</pre>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-6 rounded-xl border border-slate-200 shadow-sm">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-[oklch(20% .03 264)]">{children}</thead>,
  tbody: ({ children }) => <tbody className="divide-y divide-slate-200">{children}</tbody>,
  tr: ({ children }) => <tr className="hover:bg-slate-50 transition-colors">{children}</tr>,
  th: ({ children }) => (
    <th className="text-white font-semibold text-left px-4 py-3 text-xs uppercase tracking-widest whitespace-nowrap">{children}</th>
  ),
  td: ({ children }) => <td className="text-slate-700 px-4 py-3 text-[13px]">{children}</td>,
};

const KEY_DATES = [
  { date: "8 sty 2026", label: "Pełne stosowanie CPR 2024" },
  { date: "8 sty 2027", label: "Sankcje za naruszenia" },
  { date: "9 sty 2031", label: "Wygasają stare EAD" },
  { date: "7 sty 2040", label: "Koniec okresu przejściowego" },
];

interface TopicExpert {
  name: string;
  role: string;
  initials: string;
}

function getTopicExperts(wyrob: ProductFamily): TopicExpert[] {
  const text = [wyrob.content, wyrob.title, ...(wyrob.tags ?? [])].join(" ").toLowerCase();
  const experts: TopicExpert[] = [];

  // Cyfrowy Paszport Produktu / DPP
  if (/paszport.*produktu|cyfrowy paszport|dpp|digital product passport/.test(text)) {
    experts.push({
      name: "Grzegorz Suwara",
      role: "Ekspert ds. Cyfrowego Paszportu Produktu",
      initials: "GS",
    });
  }

  // EPD / środowisko / LCA / GWP
  if (/\bepd\b|gwp|ślad węglow|deklaracj.*środowisk|ocen.*środowisk|\blca\b|środowiskow|ökobaudat|en 15804/.test(text)) {
    experts.push({
      name: "Mikołaj Junosza Szaniawski",
      role: "Ekspert ds. EPD i oceny środowiskowej",
      initials: "MJS",
    });
  }

  return experts;
}

function formatVerifiedDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("pl-PL", { month: "long", year: "numeric" });
}

export default function WyrobDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const slug = searchParams.get("slug");
  const [wyrob, setWyrob] = useState<ProductFamily | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

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

  useEffect(() => {
    if (!wyrob) return;
    const fetchRelated = async () => {
      try {
        const { getAllPosts } = await import("../utils/blogLoader");
        const { findRelatedBlogPosts } = await import("../utils/crossLinkUtils");
        const allPosts = await getAllPosts();
        setRelatedPosts(findRelatedBlogPosts(wyrob, allPosts, 3));
      } catch (err) {
        console.error("Error loading related posts:", err);
      }
    };
    fetchRelated();
  }, [wyrob]);

  const canonicalUrl = `https://www.nowycpr.pl/wyrob?slug=${wyrob?.slug ?? slug}`;
  const pageTitle = wyrob
    ? `${wyrob.title} — Wymagania CPR 2024/3110 | NowyCPR.pl`
    : "Wyrób budowlany — CPR 2024/3110 | NowyCPR.pl";
  const pageDesc = wyrob?.excerpt
    ? `${wyrob.excerpt} Sprawdź normy, system ${wyrob.avs_system}, certyfikację i wymagania DoP&C.`
    : "Szczegółowe wymagania CPR 2024/3110 dla wyrobów budowlanych.";

  const breadcrumbSchema = wyrob ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Strona główna", "item": "https://www.nowycpr.pl/" },
      { "@type": "ListItem", "position": 2, "name": "Katalog wyrobów", "item": "https://www.nowycpr.pl/wyroby" },
      { "@type": "ListItem", "position": 3, "name": wyrob.title }
    ]
  } : null;

  const techArticleSchema = wyrob ? {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": `${wyrob.title} — Wymagania CPR 2024/3110`,
    "description": pageDesc,
    "url": canonicalUrl,
    "inLanguage": "pl-PL",
    "dateModified": wyrob.date,
    "author": {
      "@type": "Organization",
      "name": "Multicert Sp. z o.o.",
      "url": "https://www.multicert.pl"
    },
    "publisher": { "@id": "https://www.nowycpr.pl/#organization" },
    "about": { "@type": "Thing", "name": "CPR 2024/3110" },
    "keywords": `CPR 2024, ${wyrob.category}, ${wyrob.avs_system}, wyroby budowlane`
  } : null;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={canonicalUrl} />
        {breadcrumbSchema && (
          <script type="application/ld+json">
            {JSON.stringify(breadcrumbSchema)}
          </script>
        )}
        {techArticleSchema && (
          <script type="application/ld+json">
            {JSON.stringify(techArticleSchema)}
          </script>
        )}
      </Helmet>
      <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow pt-24 pb-20">
        <Container>
          <button
            onClick={() => navigate("/wyroby")}
            className="flex items-center gap-2 text-slate-500 hover:text-[oklch(55% .22 27)] transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Wszystkie wyroby
          </button>
          {loading && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 w-1/3 bg-slate-200 rounded" />
                <div className="h-10 w-3/4 bg-slate-200 rounded" />
                <div className="h-4 w-full bg-slate-200 rounded" />
                <div className="h-4 w-5/6 bg-slate-200 rounded" />
              </div>
              <div className="space-y-4">
                <div className="h-48 bg-slate-200 rounded-2xl" />
                <div className="h-48 bg-slate-200 rounded-2xl" />
              </div>
            </div>
          )}
          {!loading && error && (
            <div className="text-center py-20">
              <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[oklch(20% .03 264)] mb-2">{error}</h3>
              <button
                onClick={() => navigate("/wyroby")}
                className="mt-4 px-6 py-3 bg-[oklch(20% .03 264)] text-white font-semibold rounded-xl hover:bg-[#1a3d6b] transition-colors"
              >
                Wróć do katalogu
              </button>
            </div>
          )}
          {!loading && wyrob && (
            <>
              <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
                <button onClick={() => navigate("/")} className="hover:text-[oklch(55% .22 27)] transition-colors">
                  Strona główna
                </button>
                <ChevronRight className="w-3 h-3" />
                <button onClick={() => navigate("/wyroby")} className="hover:text-[oklch(55% .22 27)] transition-colors">
                  Wyroby
                </button>
                <ChevronRight className="w-3 h-3" />
                <span className="text-[oklch(20% .03 264)]">{wyrob.title}</span>
              </nav>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main content */}
                <article className="lg:col-span-2">
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 rounded-full bg-[oklch(55% .22 27)]/10 border border-[oklch(55% .22 27)]/20 text-[oklch(55% .22 27)] text-sm font-bold">
                        Rodzina #{wyrob.family_number}
                      </span>
                      {wyrob.category && (
                        <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                          {wyrob.category}
                        </span>
                      )}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-[oklch(20% .03 264)] mb-3">
                      {wyrob.title}
                    </h1>
                    {wyrob.family_name_en && (
                      <p className="text-slate-500 italic text-sm mb-4">{wyrob.family_name_en}</p>
                    )}

                    {/* ── Credibility bar ── */}
                    <div className="flex flex-wrap items-center gap-3 mt-5 pt-5 border-t border-slate-200">
                      {wyrob.date && (
                        <div className="flex items-center gap-1.5 text-sm bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span className="font-medium">Zweryfikowano: {formatVerifiedDate(wyrob.date)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-sm text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5 text-[oklch(55% .22 27)] shrink-0" />
                        <span>Weryfikacja: Dział Techniczny <strong className="text-[oklch(20% .03 264)]">Multicert Sp. z o.o.</strong></span>
                      </div>
                      <a
                        href="https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=OJ:L_202403110"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-[oklch(55% .22 27)] bg-[oklch(55% .22 27)]/8 border border-[oklch(55% .22 27)]/20 px-3 py-1.5 rounded-full hover:bg-[oklch(55% .22 27)]/15 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        <span className="font-medium">EUR-Lex: CPR 2024/3110</span>
                      </a>
                    </div>
                  </div>

                  <div className="prose-light">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={WYROB_COMPONENTS}>
                      {wyrob.content}
                    </ReactMarkdown>
                  </div>

                  {/* ── Disclaimer ── */}
                  <div className="mt-10 p-5 rounded-2xl bg-amber-50 border border-amber-200">
                    <p className="text-amber-800 text-sm leading-relaxed">
                      <strong>Zastrzeżenie:</strong> Treść tej karty ma charakter informacyjny i edukacyjny — nie stanowi porady technicznej ani prawnej.
                      W przypadku wątpliwości interpretacyjnych wiążący jest tekst rozporządzenia opublikowany w{" "}
                      <a
                        href="https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=OJ:L_202403110"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline font-medium text-amber-900 hover:text-amber-700"
                      >
                        Dzienniku Urzędowym UE
                      </a>
                      . Dane dotyczące norm i systemów AVS mogą ulec zmianie po publikacji nowych aktów delegowanych KE.
                    </p>
                  </div>
                </article>

                {/* Sidebar */}
                <aside className="space-y-5">

                  {/* ── Info card ── */}
                  <div className="bg-white border-2 border-slate-200 shadow-md rounded-2xl p-6">
                    <h3 className="text-[oklch(20% .03 264)] font-semibold text-base mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[oklch(55% .22 27)]" />
                      Informacje o rodzinie
                    </h3>
                    <dl className="space-y-4">
                      <div>
                        <dt className="text-slate-500 text-xs uppercase tracking-wide mb-1">Numer rodziny (Zał. VII)</dt>
                        <dd className="text-[oklch(20% .03 264)] font-bold text-lg">#{wyrob.family_number}</dd>
                      </div>
                      {wyrob.avs_system && (
                        <div>
                          <dt className="text-slate-500 text-xs uppercase tracking-wide mb-1">System AVS</dt>
                          <dd className="text-[oklch(20% .03 264)] font-semibold text-lg">{wyrob.avs_system}</dd>
                        </div>
                      )}
                      {wyrob.category && (
                        <div>
                          <dt className="text-slate-500 text-xs uppercase tracking-wide mb-1">Kategoria</dt>
                          <dd className="text-slate-700 text-sm">{wyrob.category}</dd>
                        </div>
                      )}
                      {wyrob.date && (
                        <div className="pt-3 border-t border-slate-100">
                          <dt className="text-slate-500 text-xs uppercase tracking-wide mb-1.5 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            Ostatnia weryfikacja
                          </dt>
                          <dd className="text-emerald-700 font-semibold text-sm">{formatVerifiedDate(wyrob.date)}</dd>
                          <dd className="text-slate-500 text-xs mt-0.5">Dział Techniczny Multicert Sp. z o.o.</dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  {/* ── Topic experts card ── */}
                  {(() => {
                    const experts = getTopicExperts(wyrob);
                    if (experts.length === 0) return null;
                    return (
                      <div className="bg-white border-2 border-slate-200 shadow-md rounded-2xl p-6">
                        <h3 className="text-[oklch(20% .03 264)] font-semibold text-base mb-4 flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-[oklch(55% .22 27)]" />
                          Eksperci tematyczni
                        </h3>
                        <div className="space-y-4">
                          {experts.map((expert) => (
                            <div key={expert.name} className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-[oklch(20% .03 264)] flex items-center justify-center shrink-0 text-white text-xs font-bold tracking-wide">
                                {expert.initials}
                              </div>
                              <div>
                                <p className="text-[oklch(20% .03 264)] font-semibold text-sm leading-tight">{expert.name}</p>
                                <p className="text-slate-500 text-xs mt-0.5 leading-snug">{expert.role}</p>
                                <p className="text-[10px] text-[oklch(55% .22 27)] font-medium mt-1">Multicert Sp. z o.o.</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* ── Legal basis card ── */}
                  <div className="bg-white border-2 border-[oklch(55% .22 27)]/25 shadow-md rounded-2xl p-6">
                    <h3 className="text-[oklch(20% .03 264)] font-semibold text-base mb-4 flex items-center gap-2">
                      <Scale className="w-5 h-5 text-[oklch(55% .22 27)]" />
                      Podstawa prawna
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-slate-500 text-xs uppercase tracking-wide mb-2">Rozporządzenie</p>
                        <a
                          href="https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=OJ:L_202403110"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[oklch(55% .22 27)] font-semibold text-sm hover:text-[#1a3d6b] hover:underline transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          Rozporządzenie (EU) 2024/3110
                        </a>
                        <p className="text-slate-500 text-xs mt-1 ml-5.5">Dziennik Urzędowy UE, EUR-Lex</p>
                      </div>

                      <div>
                        <p className="text-slate-500 text-xs uppercase tracking-wide mb-2">Załącznik VII — Rodzina {wyrob.family_number}</p>
                        <a
                          href="https://eur-lex.europa.eu/legal-content/PL/TXT/HTML/?uri=OJ:L_202403110#anx_VII"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[oklch(55% .22 27)] font-semibold text-sm hover:text-[#1a3d6b] hover:underline transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          Pełna lista rodzin wyrobów
                        </a>
                      </div>

                      {wyrob.normy && wyrob.normy.length > 0 && (
                        <div>
                          <p className="text-slate-500 text-xs uppercase tracking-wide mb-2">
                            Normy zharmonizowane ({wyrob.normy.length})
                          </p>
                          <div className="space-y-1.5">
                            {wyrob.normy.map((norma) => (
                              <a
                                key={norma}
                                href={`https://www.pkn.pl/uslugi/wyszukiwarka-norm?q=${encodeURIComponent(norma)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-slate-700 text-xs font-mono bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg hover:border-[oklch(55% .22 27)]/50 hover:text-[oklch(55% .22 27)] hover:bg-[oklch(55% .22 27)]/5 transition-all group"
                              >
                                <span className="flex-1">{norma}</span>
                                <ExternalLink className="w-3 h-3 shrink-0 text-slate-400 group-hover:text-[oklch(55% .22 27)] transition-colors" />
                              </a>
                            ))}
                          </div>
                          <p className="text-slate-400 text-[11px] mt-2">↗ Wyszukiwarka PKN</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Key dates ── */}
                  <div className="bg-white border-2 border-slate-200 shadow-md rounded-2xl p-6">
                    <h3 className="text-[oklch(20% .03 264)] font-semibold text-base mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-[oklch(55% .22 27)]" />
                      Kluczowe daty
                    </h3>
                    <ul className="space-y-3">
                      {KEY_DATES.map((item) => (
                        <li key={item.date} className="flex items-start gap-3">
                          <span className="text-[oklch(55% .22 27)] font-mono text-xs font-bold mt-0.5 whitespace-nowrap">
                            {item.date}
                          </span>
                          <span className="text-slate-600 text-sm">{item.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* ── Help ── */}
                  <div className="bg-[oklch(20% .03 264)] rounded-2xl p-6">
                    <h3 className="text-white font-semibold text-base mb-2 flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-amber-300" />
                      Potrzebujesz pomocy?
                    </h3>
                    <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                      Nasi eksperci pomogą Ci w certyfikacji i spełnieniu wymagań CPR 2024/3110 dla tej rodziny wyrobów.
                    </p>
                    <button
                      onClick={() => navigate("/services")}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-[oklch(20% .03 264)] font-semibold rounded-xl hover:bg-slate-100 transition-colors text-sm"
                    >
                      Skontaktuj się z nami
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </aside>
              </div>

              {/* Related blog posts */}
              {relatedPosts.length > 0 && (
                <section className="mt-12 pt-8 border-t border-slate-200">
                  <h2 className="text-xl font-semibold text-[oklch(20% .03 264)] mb-6 flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-[oklch(55% .22 27)]" />
                    Powiązane artykuły
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {relatedPosts.map((post) => (
                      <Link
                        key={post.slug}
                        to={`/blog/${post.slug}`}
                        className="group bg-white border-2 border-slate-200 rounded-xl p-4 hover:border-[oklch(55% .22 27)]/30 hover:shadow-md transition-all duration-300"
                      >
                        {post.image_url && (
                          <div className="mb-3 overflow-hidden rounded-lg">
                            <img
                              src={post.image_url}
                              alt={post.title}
                              className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <span className="text-xs text-[oklch(55% .22 27)] font-medium">{post.category}</span>
                        <h3 className="text-sm font-semibold text-[oklch(20% .03 264)] mt-1 group-hover:text-[oklch(55% .22 27)] transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2">{post.excerpt}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </Container>
      </main>
      <Footer />
    </div>
    </>
  );
}
