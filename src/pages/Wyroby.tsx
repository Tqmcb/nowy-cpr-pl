import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Container } from "../components/Container";
import { Search, Building2, ChevronRight, Filter } from "lucide-react";
import type { ProductFamily } from "../utils/wyrobLoader";
import { getCategorySketch } from "../components/BlueprintSketches";

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
    <div className="flex flex-col min-h-screen bg-white">
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
      <main className="flex-grow pt-24 pb-20">
        <section className="relative overflow-hidden border-b border-slate-800">
          {/* B&W photo background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=1400&q=80')",
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
            <div className="relative z-10 py-16 text-center max-w-3xl mx-auto">
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
        <Container>
          <div className="relative mb-6 mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Szukaj wyrobów po nazwie, kategorii..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1a56a0]/50 focus:ring-1 focus:ring-[#1a56a0]/30 transition-all duration-300"
            />
          </div>
          <div className="flex flex-wrap gap-2 mb-10">
            <Filter className="w-4 h-4 text-slate-400 self-center mr-1" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={"px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 " + (activeCategory === cat ? "bg-[#0d2137] text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-[#1a56a0]/50 hover:text-[#1a56a0]")}
              >
                {cat}
              </button>
            ))}
          </div>
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 animate-pulse">
                  <div className="h-6 w-16 bg-slate-200 rounded-full mb-4" />
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
              <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#0d2137] mb-2">Nie znaleziono wyrobów</h3>
              <p className="text-slate-500">Zmień kryteria wyszukiwania lub wybierz inną kategorię.</p>
            </div>
          )}
          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((wyrob) => (
                <div
                  key={wyrob.slug}
                  className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-[#1a56a0]/30 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col"
                  onClick={() => goToWyrob(wyrob.slug)}
                >
                  {/* Blueprint sketch illustration */}
                  <div className="flex justify-end mb-3 opacity-40 group-hover:opacity-70 transition-opacity duration-300">
                    {getCategorySketch(wyrob.title, wyrob.category, 44)}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#1a56a0]/10 border border-[#1a56a0]/20 text-[#1a56a0] text-xs font-bold">
                      #{wyrob.family_number}
                    </span>
                    {wyrob.avs_system && (
                      <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded">
                        {wyrob.avs_system}
                      </span>
                    )}
                  </div>
                  <h2 className="text-[#0d2137] font-semibold text-lg mb-2 group-hover:text-[#1a56a0] transition-colors duration-300 line-clamp-2 flex-grow-0">
                    {wyrob.title}
                  </h2>
                  {wyrob.category && (
                    <span className="inline-block text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded mb-3 w-fit">
                      {wyrob.category}
                    </span>
                  )}
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 flex-grow mb-4">
                    {wyrob.excerpt}
                  </p>
                  <button
                    onClick={(e) => { e.stopPropagation(); goToWyrob(wyrob.slug); }}
                    className="mt-auto flex items-center gap-2 text-[#1a56a0] text-sm font-medium hover:gap-3 transition-all duration-300"
                  >
                    Sprawdź wymagania
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
}
