import React, { useState, useEffect } from "react";
import { useReveal } from "../hooks/useReveal";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PageHeader, RelatedPages } from "../components/PageHeader";
import { Container } from "../components/Container";
import { Search, Building2, ChevronRight, Filter, CheckCircle2, Layers, TreePine, Thermometer, Droplets, DoorOpen, Home, Wrench, Gauge, Zap, Flame, Route, Mountain, Hammer, Shield, type LucideIcon } from "lucide-react";
import type { ProductFamily } from "../utils/wyrobLoader";

function getCategoryIcon(title: string, category: string): LucideIcon {
  const t = (title ?? "").toLowerCase();
  const c = (category ?? "").toLowerCase();
  if (/beton|prefabrykat|murowy|cegł|kruszywa|wapno|cement|spoiwa/.test(t)) return Layers;
  if (/drewno|drewn|płyt.*drewno|clb|glulam|sklejka/.test(t)) return TreePine;
  if (/izolacja|wełna|styropian|eps|xps|pir|pur|etics/.test(t)) return Thermometer;
  if (/membran|hydroizol|bitum|papa|uszczel/.test(t)) return Droplets;
  if (/okna|okno|drzwi|brama|fasad|szkło/.test(t)) return DoorOpen;
  if (/dach|pokryci/.test(t)) return Home;
  if (/podłog|posadzk|tynk|gips|okładzin/.test(t)) return Layers;
  if (/stal|metalow|żelbetow|zbrojeni|łożysk|kotw|łącznik/.test(t)) return Wrench;
  if (/rur|zbiornik|instalac|kanalizac|komin|armatur|grzewcz|woda pitna/.test(t)) return Gauge;
  if (/kabel|kable|elektr|detekcj/.test(t)) return Zap;
  if (/pożar|ogniow|gaśnicz/.test(t)) return Flame;
  if (/drogowy|drogi|nawierzch/.test(t)) return Route;
  if (/geosynt|geomembran|geotekst/.test(t)) return Mountain;
  if (/klej|zaprawa|chemia budowlana/.test(t)) return Hammer;
  if (/konstrukcj/.test(c)) return Building2;
  if (/izolac/.test(c)) return Thermometer;
  if (/ochrona/.test(c)) return Shield;
  if (/instalac/.test(c)) return Gauge;
  return Building2;
}

const MAIN_CATEGORIES = [
  "Wyroby konstrukcyjne",
  "Wyroby wykończeniowe",
  "Instalacyjne",
  "Ochrona przeciwpożarowa",
  "Chemia budowlana",
];
const CATEGORIES = ["Wszystkie", ...MAIN_CATEGORIES, "Inne"];

export default function Wyroby() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [wyroby, setWyroby] = useState<ProductFamily[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("Wszystkie");
  const gridRef = useReveal(0);

  const legacySlug = searchParams.get("slug");

  if (legacySlug) {
    return <Navigate to={`/wyrob?slug=${encodeURIComponent(legacySlug)}`} replace />;
  }

  useEffect(() => {
    const load = async () => {
      try {
        const { getAllWyroby } = await import("../utils/wyrobLoader");
        const data = await getAllWyroby();
        setWyroby(data);
      } catch (err) {
        console.error("Error loading wyroby:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = wyroby.filter((w) => {
    const matchesSearch = search === "" || w.title.toLowerCase().includes(search.toLowerCase()) || w.excerpt.toLowerCase().includes(search.toLowerCase()) || w.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "Wszystkie" ||
      (activeCategory === "Inne" && !MAIN_CATEGORIES.includes(w.category)) ||
      w.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const goToWyrob = (slug: string) => navigate("/wyrob?slug=" + slug);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Katalog wyrobów budowlanych CPR 2024/3110",
    "description": "36 kategorii wyrobów budowlanych objętych Rozporządzeniem CPR (UE) 2024/3110",
    "url": "https://www.nowycpr.pl/wyroby",
    "numberOfItems": wyroby.length,
    "itemListElement": wyroby.map((w, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": w.title,
      "url": `https://www.nowycpr.pl/wyrob?slug=${w.slug}`
    }))
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Helmet>
        <title>Wyroby budowlane CPR: normy hEN, AVS i certyfikacja | NowyCPR.pl</title>
        <meta name="description" content="Katalog kategorii wyrobów budowlanych objętych CPR 2024/3110. Sprawdź normy zharmonizowane hEN, systemy AVS, badania, FPC/ZKP i wymagania certyfikacyjne." />
        <meta name="keywords" content="wyroby budowlane CPR, katalog wyrobów budowlanych, normy zharmonizowane hEN, system AVS, certyfikacja wyrobów, FPC, ZKP, DoP&C" />
        <meta property="og:title" content="Wyroby budowlane CPR: normy hEN, AVS i certyfikacja | NowyCPR.pl" />
        <meta property="og:description" content="Kategorie wyrobów budowlanych, normy hEN, systemy AVS, certyfikacja, FPC/ZKP i DoP&C." />
        <meta property="og:url" content="https://www.nowycpr.pl/wyroby" />
        <link rel="canonical" href="https://www.nowycpr.pl/wyroby" />
        {wyroby.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify(itemListSchema)}
          </script>
        )}
      </Helmet>
      <Header />
      <main className="flex-grow">
        <PageHeader />


        {/* Search & filter bar — engineering paper texture for visual interest */}
        <div className="bg-white" style={{ borderBottom: "1px solid oklch(92% .008 264)" }}>
          <Container>
            <div className="max-w-6xl mx-auto py-8">
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "oklch(60% .015 264)" }} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Szukaj wyrobów po nazwie, kategorii..."
                  className="w-full pl-12 pr-4 py-3 bg-white focus:outline-none transition-all text-sm font-serif"
                  style={{ border: "1px solid oklch(86% .012 264)", borderRadius: "2px", color: "oklch(20% .03 264)" }}
                />
              </div>
              {/* Category filters */}
              <div className="flex flex-wrap gap-2 items-center">
                <Filter className="w-4 h-4 mr-1 shrink-0" style={{ color: "oklch(60% .015 264)" }} />
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] transition-all"
                    style={{
                      backgroundColor: activeCategory === cat ? "oklch(20% .03 264)" : "white",
                      color: activeCategory === cat ? "white" : "oklch(42% .02 264)",
                      border: "1px solid " + (activeCategory === cat ? "oklch(20% .03 264)" : "oklch(86% .012 264)"),
                      borderRadius: "2px",
                    }}
                  >
                    {cat}
                  </button>
                ))}
                {filtered.length > 0 && !loading && (
                  <span className="w-full sm:w-auto mt-2 sm:mt-0 sm:ml-auto editorial-kicker text-right" style={{ color: "oklch(60% .015 264)" }}>
                    {filtered.length} wyrobów
                  </span>
                )}
              </div>
            </div>
          </Container>
        </div>

        {/* Grid area — editorial */}
        <div className="py-16 bg-white">
          <Container>
            <div className="max-w-6xl mx-auto">
              {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0" style={{ borderTop: "2px solid oklch(20% .03 264)" }}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="p-6 animate-pulse" style={{
                      borderRight: i % 3 !== 2 ? "1px solid oklch(92% .008 264)" : "none",
                      borderBottom: "1px solid oklch(92% .008 264)"
                    }}>
                      <div className="h-10 w-10 mb-4" style={{ backgroundColor: "oklch(92% .008 264)" }} />
                      <div className="h-5 w-3/4 mb-3" style={{ backgroundColor: "oklch(92% .008 264)" }} />
                      <div className="h-4 w-1/2 mb-4" style={{ backgroundColor: "oklch(96% .008 264)" }} />
                      <div className="h-4 w-full mb-2" style={{ backgroundColor: "oklch(96% .008 264)" }} />
                      <div className="h-4 w-5/6" style={{ backgroundColor: "oklch(96% .008 264)" }} />
                    </div>
                  ))}
                </div>
              )}
              {!loading && filtered.length === 0 && (
                <div className="py-20 text-center" style={{ borderTop: "2px solid oklch(20% .03 264)", borderBottom: "1px solid oklch(92% .008 264)" }}>
                  <h3 className="font-serif text-2xl mb-2" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>Nie znaleziono wyrobów</h3>
                  <p style={{ color: "oklch(42% .02 264)" }}>Zmień kryteria wyszukiwania lub wybierz inną kategorię.</p>
                </div>
              )}
              {!loading && filtered.length > 0 && (
                <div ref={gridRef} className="reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0" style={{ borderTop: "2px solid oklch(20% .03 264)" }}>
                  {filtered.map((wyrob, idx) => {
                    const Icon = getCategoryIcon(wyrob.title, wyrob.category);
                    const colMod = idx % 3;
                    return (
                      <div
                        key={wyrob.slug}
                        className="reveal-stagger group cursor-pointer flex flex-col p-6 md:p-8 transition-all hover:bg-slate-50"
                        style={{
                          "--i": idx,
                          borderRight: colMod !== 2 ? "1px solid oklch(92% .008 264)" : "none",
                          borderBottom: "1px solid oklch(92% .008 264)",
                          backgroundColor: "white",
                        } as React.CSSProperties}
                        onClick={() => goToWyrob(wyrob.slug)}
                      >
                        {/* Top row: numeral + AVS */}
                        <div className="flex items-start justify-between mb-5">
                          <span className="editorial-numeral text-4xl" style={{ color: "oklch(55% .22 27)", fontWeight: 300 }}>
                            {String(wyrob.family_number).padStart(2, "0")}
                          </span>
                          <div className="flex items-center gap-2">
                            <Icon className="w-5 h-5" style={{ color: "oklch(20% .03 264)" }} />
                            {wyrob.avs_system && (
                              <span className="editorial-kicker" style={{ color: "oklch(60% .015 264)" }}>
                                {wyrob.avs_system}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Family label */}
                        <div className="editorial-kicker mb-3" style={{ color: "oklch(55% .22 27)" }}>
                          Rodzina · {wyrob.family_number}
                        </div>

                        {/* Title */}
                        <h2 className="font-serif text-xl md:text-[1.4rem] mb-3 leading-[1.2] line-clamp-2 group-hover:italic transition-all" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>
                          {wyrob.title}
                        </h2>

                        {/* Category tag */}
                        {wyrob.category && (
                          <div className="flex items-center gap-2 mb-3">
                            <div className="h-px w-5" style={{ backgroundColor: "oklch(55% .22 27)" }} />
                            <span className="editorial-kicker" style={{ color: "oklch(42% .02 264)" }}>
                              {wyrob.category}
                            </span>
                          </div>
                        )}

                        {/* Excerpt */}
                        <p className="text-sm leading-[1.6] line-clamp-2 flex-grow mb-5" style={{ color: "oklch(42% .02 264)" }}>
                          {wyrob.excerpt}
                        </p>

                        {/* CTA */}
                        <div className="mt-auto pt-4 flex flex-col items-start sm:flex-row sm:items-center sm:justify-between gap-3" style={{ borderTop: "1px solid oklch(92% .008 264)" }}>
                          {wyrob.date && (
                            <span className="editorial-kicker" style={{ color: "oklch(60% .015 264)" }}>
                              {new Date(wyrob.date).toLocaleDateString("pl-PL", { month: "short", year: "numeric" })}
                            </span>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); goToWyrob(wyrob.slug); }}
                            className="editorial-kicker inline-flex w-full sm:w-auto items-center justify-between sm:justify-end gap-2 flex-nowrap leading-none group-hover:gap-2.5 transition-all self-stretch sm:self-auto sm:ml-auto whitespace-nowrap"
                            style={{ color: "oklch(55% .22 27)" }}
                          >
                            <span>Sprawdź wymagania</span>
                            <ChevronRight className="w-4 h-4 shrink-0" />
                          </button>
                        </div>
                      </div>
                  );
                })}
                </div>
              )}
            </div>
          </Container>
        </div>
      </main>
      <RelatedPages />
      <Footer />
    </div>
  );
}
