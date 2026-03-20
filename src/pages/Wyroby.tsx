import React, { useState, useEffect } from "react";
import { useReveal } from "../hooks/useReveal";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Container } from "../components/Container";
import { Search, Building2, ChevronRight, Filter, Layers, TreePine, Thermometer, Droplets, DoorOpen, Home, Wrench, Gauge, Zap, Flame, Route, Mountain, Hammer, Shield, CheckCircle2, type LucideIcon } from "lucide-react";
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
  const [wyroby, setWyroby] = useState<ProductFamily[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("Wszystkie");
  const gridRef = useReveal();

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
      "url": `https://www.nowycpr.pl/wyroby?slug=${w.slug}`
    }))
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#dde6f0" }}>
      <Helmet>
        <title>Katalog Wyrobów Budowlanych — CPR 2024/3110 | NowyCPR.pl</title>
        <meta name="description" content="Przeszukaj katalog 36 kategorii wyrobów budowlanych objętych CPR 2024/3110. Sprawdź normy zharmonizowane, systemy AVS i wymagania certyfikacyjne dla swojego produktu." />
        <meta property="og:title" content="Katalog Wyrobów Budowlanych CPR 2024/3110 | NowyCPR.pl" />
        <meta property="og:description" content="36 kategorii wyrobów budowlanych — normy, systemy AVS, certyfikacja DoP&C." />
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
        {/* Hero */}
        <section className="relative overflow-hidden border-b-2 border-[#0d2137]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=1400&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "grayscale(100%) contrast(1.1) brightness(0.75)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to right, rgba(13,33,55,0.92) 0%, rgba(26,86,160,0.72) 100%)" }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-[4px]"
            style={{ background: "linear-gradient(to right, #8b1a3c 30%, #1a56a0 100%)" }}
          />
          <Container>
            <div className="relative z-10 pt-32 pb-16 text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/30 text-white text-sm font-medium mb-6">
                <Building2 className="w-4 h-4" />
                CPR 2024/3110 — Załącznik VII
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                36 Rodzin Wyrobów Budowlanych
              </h1>
              <p className="text-white/80 text-lg leading-relaxed">
                Kompletny katalog rodzin wyrobów budowlanych objętych Rozporządzeniem CPR (EU) 2024/3110,
                Załącznik VII. Sprawdź wymagania, systemy AVS i normy zharmonizowane dla każdej rodziny.
              </p>
            </div>
          </Container>
        </section>

        {/* Search & filter bar — engineering paper texture for visual interest */}
        <div className="bar-blueprint border-b-2 border-slate-300 shadow-md relative overflow-hidden">
          <Container>
            <div className="py-5">
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a56a0]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Szukaj wyrobów po nazwie, kategorii..."
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1a56a0] focus:bg-white transition-all duration-200 text-sm font-medium"
                />
              </div>
              {/* Category filters */}
              <div className="flex flex-wrap gap-2 items-center">
                <Filter className="w-4 h-4 text-slate-500 mr-1 shrink-0" />
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={
                      "px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-all duration-200 " +
                      (activeCategory === cat
                        ? "bg-[#0d2137] border-[#0d2137] text-white shadow-sm"
                        : "bg-white border-slate-300 text-slate-700 hover:border-[#1a56a0] hover:text-[#1a56a0]")
                    }
                  >
                    {cat}
                  </button>
                ))}
                {filtered.length > 0 && !loading && (
                  <span className="ml-auto text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                    {filtered.length} wyrobów
                  </span>
                )}
              </div>
            </div>
          </Container>
        </div>

        {/* Grid area — blueprint dot pattern background */}
        <div className="py-10 bg-blueprint-dots">
          <Container>
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white border-2 border-slate-200 rounded-2xl p-6 animate-pulse shadow-sm">
                    <div className="h-10 w-10 bg-slate-200 rounded-xl mb-4" />
                    <div className="h-5 w-3/4 bg-slate-200 rounded mb-3" />
                    <div className="h-4 w-1/2 bg-slate-200 rounded mb-4" />
                    <div className="h-4 w-full bg-slate-200 rounded mb-2" />
                    <div className="h-4 w-5/6 bg-slate-200 rounded" />
                  </div>
                ))}
              </div>
            )}
            {!loading && filtered.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-2xl bg-white border-2 border-slate-300 flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Building2 className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-[#0d2137] mb-2">Nie znaleziono wyrobów</h3>
                <p className="text-slate-600">Zmień kryteria wyszukiwania lub wybierz inną kategorię.</p>
              </div>
            )}
            {!loading && filtered.length > 0 && (
              <div ref={gridRef} className="reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((wyrob, idx) => {
                  const Icon = getCategoryIcon(wyrob.title, wyrob.category);
                  return (
                    <div
                      key={wyrob.slug}
                      className="reveal-stagger card-tech group relative bg-white border-2 border-slate-200 border-l-[5px] border-l-[#1a56a0] rounded-2xl p-5 hover:shadow-xl hover:border-slate-300 hover:border-l-[#8b1a3c] transition-all duration-300 cursor-pointer flex flex-col shadow-md"
                      style={{ "--i": idx } as React.CSSProperties}
                      onClick={() => goToWyrob(wyrob.slug)}
                    >
                      {/* Top row: icon + AVS badge */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="card-icon w-11 h-11 rounded-xl bg-[#1a56a0]/10 border border-[#1a56a0]/20 flex items-center justify-center group-hover:bg-[#1a56a0]/20 transition-colors duration-300">
                          <Icon className="w-5 h-5 text-[#1a56a0]" />
                        </div>
                        {wyrob.avs_system && (
                          <span className="text-[11px] text-slate-600 font-mono bg-slate-100 border border-slate-300 px-2 py-1 rounded-lg leading-none">
                            {wyrob.avs_system}
                          </span>
                        )}
                      </div>

                      {/* Family number */}
                      <div className="mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#0d2137]/8 border border-[#0d2137]/15 text-[#0d2137] text-[11px] font-bold tracking-wide">
                          RODZINA #{wyrob.family_number}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-[#0d2137] font-bold text-base mb-1.5 group-hover:text-[#1a56a0] transition-colors duration-300 line-clamp-2 leading-snug">
                        {wyrob.title}
                      </h2>

                      {/* Category tag */}
                      {wyrob.category && (
                        <span className="inline-block text-[11px] font-semibold text-[#1a56a0] bg-[#1a56a0]/8 border border-[#1a56a0]/20 px-2 py-0.5 rounded mb-2.5 w-fit">
                          {wyrob.category}
                        </span>
                      )}

                      {/* Excerpt */}
                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 flex-grow mb-4">
                        {wyrob.excerpt}
                      </p>

                      {/* CTA */}
                      <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        {wyrob.date && (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                            <CheckCircle2 className="w-3 h-3 shrink-0" />
                            {new Date(wyrob.date).toLocaleDateString("pl-PL", { month: "short", year: "numeric" })}
                          </span>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); goToWyrob(wyrob.slug); }}
                          className="flex items-center gap-1.5 text-[#1a56a0] text-sm font-semibold group-hover:gap-2.5 transition-all duration-300 ml-auto"
                        >
                          Sprawdź wymagania
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Container>
        </div>
      </main>
      <Footer />
    </div>
  );
}
