import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Container } from "../components/Container";
import { Building2, ChevronRight, Calendar, ArrowLeft, FileText, HelpCircle, Newspaper } from "lucide-react";
import type { ProductFamily } from "../utils/wyrobLoader";
import type { BlogPost } from "../utils/blogLoader";
import { Helmet } from "react-helmet-async";

const WYROB_COMPONENTS: Components = {
  h1: ({ children }) => <h1 className="text-3xl font-bold text-[#0d2137] my-6 leading-tight">{children}</h1>,
  h2: ({ children }) => <h2 className="text-2xl font-semibold text-[#0d2137] mt-8 mb-4 pb-2 border-b border-slate-200">{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg font-semibold text-[#1a56a0] mt-6 mb-3">{children}</h3>,
  p: ({ children }) => <p className="text-slate-700 leading-relaxed my-4 text-[15px]">{children}</p>,
  strong: ({ children }) => <strong className="text-[#0d2137] font-semibold">{children}</strong>,
  em: ({ children }) => <em className="text-slate-500 italic">{children}</em>,
  a: ({ children, href }) => (
    <a href={href} className="text-[#1a56a0] hover:text-[#1a3d6b] underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="my-4 space-y-2">{children}</ul>,
  ol: ({ children }) => <ol className="my-4 space-y-2">{children}</ol>,
  li: ({ children, ordered, index }) => (
    <li className="flex items-start gap-2.5 text-slate-700 text-[15px]">
      {ordered ? (
        <span className="text-[#1a56a0] font-bold mt-0.5 min-w-[1.4rem] text-sm shrink-0">{(index ?? 0) + 1}.</span>
      ) : (
        <span className="text-[#1a56a0] mt-2 shrink-0 text-xs">▪</span>
      )}
      <span>{children}</span>
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-[#1a56a0]/40 bg-[#1a56a0]/5 pl-5 py-3 my-5 rounded-r-lg">
      <div className="text-slate-600 italic text-[15px]">{children}</div>
    </blockquote>
  ),
  hr: () => <hr className="border-slate-200 my-8" />,
  code: ({ children, className }) => {
    if (className) return <code className={`${className} text-[#1a56a0] text-sm font-mono`}>{children}</code>;
    return <code className="bg-slate-100 text-[#1a56a0] px-1.5 py-0.5 rounded text-[13px] font-mono border border-slate-200">{children}</code>;
  },
  pre: ({ children }) => (
    <pre className="bg-slate-50 border border-slate-200 rounded-xl p-5 overflow-x-auto my-6 text-sm font-mono leading-relaxed">{children}</pre>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-6 rounded-xl border border-slate-200 shadow-sm">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-[#0d2137]">{children}</thead>,
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

  // Load related blog posts when wyrob is available
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
      <div className="flex flex-col min-h-screen section-paper">
      <Header />
      <main className="flex-grow pt-24 pb-20">
        <Container>
          <button
            onClick={() => navigate("/wyroby")}
            className="flex items-center gap-2 text-slate-500 hover:text-[#1a56a0] transition-colors mb-6 group"
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
              <h3 className="text-xl font-semibold text-[#0d2137] mb-2">{error}</h3>
              <button
                onClick={() => navigate("/wyroby")}
                className="mt-4 px-6 py-3 bg-[#0d2137] text-white font-semibold rounded-xl hover:bg-[#1a3d6b] transition-colors"
              >
                Wróć do katalogu
              </button>
            </div>
          )}
          {!loading && wyrob && (
            <>
              <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
                <button onClick={() => navigate("/")} className="hover:text-[#1a56a0] transition-colors">
                  Strona główna
                </button>
                <ChevronRight className="w-3 h-3" />
                <button onClick={() => navigate("/wyroby")} className="hover:text-[#1a56a0] transition-colors">
                  Wyroby
                </button>
                <ChevronRight className="w-3 h-3" />
                <span className="text-[#0d2137]">{wyrob.title}</span>
              </nav>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <article className="lg:col-span-2">
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 rounded-full bg-[#1a56a0]/10 border border-[#1a56a0]/20 text-[#1a56a0] text-sm font-bold">
                        Rodzina #{wyrob.family_number}
                      </span>
                      {wyrob.category && (
                        <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                          {wyrob.category}
                        </span>
                      )}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-[#0d2137] mb-3">
                      {wyrob.title}
                    </h1>
                    {wyrob.family_name_en && (
                      <p className="text-slate-500 italic">{wyrob.family_name_en}</p>
                    )}
                  </div>
                  <div className="prose-light">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={WYROB_COMPONENTS}>
                      {wyrob.content}
                    </ReactMarkdown>
                  </div>
                </article>
                <aside className="space-y-6">
                  <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                    <h3 className="text-[#0d2137] font-semibold text-lg mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#1a56a0]" />
                      Informacje
                    </h3>
                    <dl className="space-y-4">
                      <div>
                        <dt className="text-slate-500 text-xs uppercase tracking-wide mb-1">Numer rodziny</dt>
                        <dd className="text-[#0d2137] font-semibold">#{wyrob.family_number}</dd>
                      </div>
                      {wyrob.normy && wyrob.normy.length > 0 && (
                        <div>
                          <dt className="text-slate-500 text-xs uppercase tracking-wide mb-1">Normy</dt>
                          <dd className="space-y-1">
                            {wyrob.normy.map((norma) => (
                              <span key={norma} className="block text-slate-700 text-sm font-mono bg-slate-100 px-2 py-1 rounded">
                                {norma}
                              </span>
                            ))}
                          </dd>
                        </div>
                      )}
                      {wyrob.avs_system && (
                        <div>
                          <dt className="text-slate-500 text-xs uppercase tracking-wide mb-1">System AVS</dt>
                          <dd className="text-[#0d2137] font-semibold">{wyrob.avs_system}</dd>
                        </div>
                      )}
                      {wyrob.category && (
                        <div>
                          <dt className="text-slate-500 text-xs uppercase tracking-wide mb-1">Kategoria</dt>
                          <dd className="text-slate-700">{wyrob.category}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                  <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                    <h3 className="text-[#0d2137] font-semibold text-lg mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-[#1a56a0]" />
                      Kluczowe daty
                    </h3>
                    <ul className="space-y-3">
                      {KEY_DATES.map((item) => (
                        <li key={item.date} className="flex items-start gap-3">
                          <span className="text-[#1a56a0] font-mono text-xs font-bold mt-0.5 whitespace-nowrap">
                            {item.date}
                          </span>
                          <span className="text-slate-600 text-sm">{item.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-[#1a56a0]/5 border border-[#1a56a0]/20 rounded-2xl p-6">
                    <h3 className="text-[#0d2137] font-semibold text-lg mb-2 flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-[#1a56a0]" />
                      Potrzebujesz pomocy?
                    </h3>
                    <p className="text-slate-600 text-sm mb-4">
                      Nasi eksperci pomogą Ci w certyfikacji i spełnieniu wymagań CPR 2024/3110.
                    </p>
                    <button
                      onClick={() => navigate("/services")}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0d2137] text-white font-semibold rounded-xl hover:bg-[#1a3d6b] transition-colors text-sm"
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
                  <h2 className="text-xl font-semibold text-[#0d2137] mb-6 flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-[#1a56a0]" />
                    Powiązane artykuły
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {relatedPosts.map((post) => (
                      <Link
                        key={post.slug}
                        to={`/blog/${post.slug}`}
                        className="group bg-white border border-slate-200 rounded-xl p-4 hover:border-[#1a56a0]/30 hover:shadow-md transition-all duration-300"
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
                        <span className="text-xs text-[#1a56a0] font-medium">{post.category}</span>
                        <h3 className="text-sm font-semibold text-[#0d2137] mt-1 group-hover:text-[#1a56a0] transition-colors line-clamp-2">
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
