import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "components/Button";
import { Container } from "components/Container";
import { PageHeader } from "components/PageHeader";
import {
  Search,
  Sparkles,
  ArrowRight,
  ChevronRight,
  FileText,
  FlaskConical,
  ListChecks,
  Shield,
  Award,
  Info,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Building2,
  ExternalLink,
  Globe,
  MapPin,
  Star
} from "lucide-react";
import { Helmet } from "react-helmet-async";

// Merged product data type to match the component expectations
interface ProductCategory {
  id: string;
  name: string;
  code: string;
  description: string;
  requirements: {
    id: string;
    title: string;
    description: string;
    mandatoryTests: string[];
    documentationRequired: string[];
    cprChanges: string[];
    certificationSystems: string[];
  };
};

// Fallback data for when the Supabase integration isn't configured
const placeholderRequirements = {
  id: "placeholder-req",
  title: "Wymagania podstawowe",
  description: "Szczegółowe wymagania dla tej kategorii produktów są obecnie opracowywane. Skontaktuj się z Multicert, aby uzyskać szczegółowe informacje.",
  mandatoryTests: [
    "Badania wstępne typu",
    "Ocena zgodności z normami zharmonizowanymi",
    "Raportowanie środowiskowe (nowe z CPR 2024)"
  ],
  documentationRequired: [
    "Deklaracja właściwości użytkowych i zgodności (DoP&C)",
    "Oznakowanie CE",
    "Dokumentacja zakładowej kontroli produkcji",
    "Cyfrowy paszport produktu (planowany — obowiązkowy dopiero po publikacji nowych norm zharmonizowanych i aktów KE)"
  ],
  cprChanges: [
    "Cyfryzacja dokumentacji i oznaczeń",
    "Zwiększone wymagania środowiskowe",
    "Nowe systemy oceny i weryfikacji stałości właściwości użytkowych"
  ],
  certificationSystems: ["System 2+", "System 3"]
};

// Complete list of 36 product families per CPR 2024/3110 Annex IV Table 1
const buildFullProductCategoryList = () => {
  return [
    { value: "concrete-prefab", label: "Wyroby prefabrykowane z betonu (01)" },
    { value: "doors-windows", label: "Drzwi, okna i okucia (02)" },
    { value: "membranes", label: "Membrany izolacyjne (03)" },
    { value: "insulation", label: "Materiały termoizolacyjne (04)" },
    { value: "structural-bearings", label: "Łożyska konstrukcyjne (05)" },
    { value: "chimneys", label: "Kominy i przewody (06)" },
    { value: "gypsum-products", label: "Wyroby gipsowe (07)" },
    { value: "geotextiles", label: "Geowłókniny i geomembrany (08)" },
    { value: "curtain-walls", label: "Ściany osłonowe (09)" },
    { value: "fire-equipment", label: "Urządzenia przeciwpożarowe (10)" },
    { value: "sanitary-ware", label: "Urządzenia sanitarne (11)" },
    { value: "road-equipment", label: "Urządzenia drogowe (12)" },
    { value: "timber-structural", label: "Konstrukcje drewniane (13)" },
    { value: "wood-panels", label: "Płyty drewnopochodne (14)" },
    { value: "cement", label: "Cement i spoiwa (15)" },
    { value: "steel", label: "Stal zbrojeniowa (16)" },
    { value: "bricks", label: "Wyroby murarskie (17)" },
    { value: "sewage-products", label: "Oczyszczanie ścieków (18)" },
    { value: "flooring", label: "Wyroby podłogowe (19)" },
    { value: "metal-structural", label: "Konstrukcje metalowe (20)" },
    { value: "wall-finishes", label: "Wykończenia ścian i sufitów (21)" },
    { value: "roofing", label: "Pokrycia dachowe (22)" },
    { value: "road-construction", label: "Budowa dróg (23)" },
    { value: "aggregates", label: "Kruszywa (24)" },
    { value: "construction-adhesives", label: "Kleje budowlane (25)" },
    { value: "concrete-related", label: "Wyroby betonowe (26)" },
    { value: "heating-devices", label: "Urządzenia grzewcze (27)" },
    { value: "pipes-nondrinking", label: "Rury i zbiorniki (28)" },
    { value: "pipes-drinking", label: "Wyroby do wody pitnej (29)" },
    { value: "glass-products", label: "Wyroby szklane (30)" },
    { value: "cables", label: "Kable i przewody (31)" },
    { value: "joint-sealants", label: "Uszczelniacze (32)" },
    { value: "fixings", label: "Mocowania i łączniki (33)" },
    { value: "building-kits", label: "Zestawy budowlane (34)" },
    { value: "fire-stopping", label: "Ochrona przeciwpożarowa (35)" },
    { value: "fixed-ladders", label: "Drabiny stałe (36)" }
  ];
};

export function ProductSearchTool() {
  const navigate = useNavigate();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const [productOptions] = useState<{ value: string, label: string }[]>(buildFullProductCategoryList());

  const handleCategoryChange = (value: string) => {
    setSelectedCategoryId(value);
    if (!value) {
      setSelectedCategory(null);
      return;
    }

    const categoryOption = productOptions.find(opt => opt.value === value);
    const name = categoryOption ? categoryOption.label.split('(')[0].trim() : value;
    const code = categoryOption && categoryOption.label.includes('(') ?
      categoryOption.label.split('(')[1].replace(')', '') : '';

    setSelectedCategory({
      id: value,
      name,
      code,
      description: `${name} - szczegółowy opis kategorii`,
      requirements: placeholderRequirements
    });
  };

  const tabs = [
    { id: "overview", label: "Przegląd", icon: ListChecks },
    { id: "tests", label: "Badania", icon: FlaskConical },
    { id: "documentation", label: "Dokumentacja", icon: FileText },
    { id: "changes", label: "Zmiany CPR 2024", icon: Sparkles },
    { id: "certification", label: "Certyfikacja", icon: Award }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Helmet>
        <title>Wyszukiwarka Wymagań CPR 2024/3110 | NowyCPR.pl</title>
        <meta name="description" content="Sprawdź wymagania CPR 2024/3110 dla swojego wyrobu budowlanego. Wybierz kategorię i poznaj obowiązkowe badania, dokumentację i zmiany względem CPR 305/2011." />
        <meta property="og:title" content="Wyszukiwarka Wymagań CPR 2024/3110 | NowyCPR.pl" />
        <meta property="og:description" content="Interaktywna wyszukiwarka wymagań dla 36 kategorii wyrobów budowlanych objętych CPR 2024/3110." />
        <meta property="og:url" content="https://www.nowycpr.pl/wyszukiwarka" />
        <link rel="canonical" href="https://www.nowycpr.pl/wyszukiwarka" />
      </Helmet>

      <PageHeader>
        {/* Search input — editorial style */}
        <div id="search-section" className="max-w-3xl">
          <label className="editorial-kicker mb-4 block" style={{ color: "oklch(20% .03 264)" }}>
            Kategoria wyrobu
          </label>
          <div className="relative mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "oklch(60% .015 264)" }} />
            <select
              value={selectedCategoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-base bg-white focus:outline-none appearance-none cursor-pointer transition-all font-serif"
              style={{ border: "1px solid oklch(86% .012 264)", borderRadius: "2px", color: "oklch(20% .03 264)" }}
            >
              <option value="">-- Wybierz kategorię --</option>
              {productOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <Button
            onClick={() => document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" })}
            disabled={!selectedCategory}
            className="px-8 py-4 text-sm font-semibold transition-all disabled:opacity-40"
            style={{ backgroundColor: "oklch(20% .03 264)", color: "white", borderRadius: "2px" }}
          >
            Pokaż wymagania
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </PageHeader>

      {/* Results Section */}
      <section className="py-12 bg-white">
        <Container>
          {selectedCategory && (
            <div id="results-section" className="scroll-mt-16">
              <div className="bg-white border border-[oklch(92%_.008_264)] p-6 mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-[2px] bg-[oklch(55%_.22_27/0.1)] flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-[oklch(55%_.22_27)]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[oklch(20%_.03_264)]">{selectedCategory.name}</h3>
                    <p className="text-slate-500">
                      Kod kategorii: <span className="text-[oklch(55%_.22_27)] font-semibold">{selectedCategory.code}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap gap-2 mb-8 pb-4 border-b border-slate-200">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-2 px-4 text-sm font-medium rounded-lg transition-all ${activeTab === tab.id
                        ? "bg-[oklch(20%_.03_264)] text-white"
                        : "bg-white border border-slate-200 text-slate-600 hover:border-[oklch(55%_.22_27/0.4)] hover:text-[oklch(55%_.22_27)]"
                      }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === "overview" && (
                <div className="bg-white border border-[oklch(92%_.008_264)] p-8">
                  <h3 className="text-xl font-bold text-[oklch(20%_.03_264)] mb-4">{selectedCategory.requirements.title}</h3>
                  <p className="text-slate-600 mb-8 leading-relaxed">{selectedCategory.requirements.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-6 rounded-[2px] border border-slate-200">
                      <h4 className="font-bold text-[oklch(20%_.03_264)] mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[oklch(55%_.22_27)]" />
                        Kluczowe wymagania
                      </h4>
                      <ul className="space-y-3">
                        {selectedCategory.requirements.mandatoryTests.slice(0, 3).map((test, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <ChevronRight className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700 text-sm">{test}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-emerald-50 p-6 rounded-[2px] border border-emerald-200">
                      <h4 className="font-bold text-emerald-700 mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Nowości w CPR 2024
                      </h4>
                      <ul className="space-y-3">
                        {selectedCategory.requirements.cprChanges.slice(0, 3).map((change, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <ArrowRight className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700 text-sm">{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "tests" && (
                <div className="bg-white border border-[oklch(92%_.008_264)] p-8">
                  <h3 className="text-xl font-bold text-[oklch(20%_.03_264)] mb-2">Wymagane badania</h3>
                  <p className="text-slate-500 mb-6">
                    Wyroby z kategorii "{selectedCategory.name}" muszą przejść następujące badania:
                  </p>
                  <ul className="space-y-4">
                    {selectedCategory.requirements.mandatoryTests.map((test, index) => (
                      <li key={index} className="bg-slate-50 p-4 rounded-[2px] border border-slate-200">
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-lg bg-[oklch(55%_.22_27/0.1)] flex items-center justify-center text-sm font-bold text-[oklch(55%_.22_27)]">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-[oklch(20%_.03_264)]">{test}</p>
                            {test.includes("nowe") && (
                              <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-xs">
                                <Sparkles className="w-3 h-3" />
                                Nowy wymóg CPR 2024
                              </span>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "documentation" && (
                <div className="bg-white border border-[oklch(92%_.008_264)] p-8">
                  <h3 className="text-xl font-bold text-[oklch(20%_.03_264)] mb-2">Wymagana dokumentacja</h3>
                  <p className="text-slate-500 mb-6">
                    Producenci wyrobów z kategorii "{selectedCategory.name}" muszą przygotować:
                  </p>
                  <ul className="space-y-4">
                    {selectedCategory.requirements.documentationRequired.map((doc, index) => (
                      <li key={index} className="bg-slate-50 p-4 rounded-[2px] border border-slate-200">
                        <div className="flex items-start gap-4">
                          <FileText className="w-6 h-6 text-slate-400 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-[oklch(20%_.03_264)]">{doc}</p>
                            {doc.includes("nowy") && (
                              <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-xs">
                                <Sparkles className="w-3 h-3" />
                                Nowy wymóg CPR 2024
                              </span>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 p-4 rounded-[2px] bg-[oklch(55%_.22_27/0.05)] border border-[oklch(55%_.22_27/0.2)] flex items-start gap-3">
                    <Info className="w-5 h-5 text-[oklch(55%_.22_27)] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-[oklch(20%_.03_264)]">Pobierz wzory dokumentów</p>
                      <p className="text-slate-500 text-sm mb-3">W sekcji "Dokumenty" znajdziesz gotowe szablony wymaganych dokumentów.</p>
                      <Button variant="outline" size="sm" asChild className="border-slate-200 text-slate-700 hover:border-[oklch(55%_.22_27/0.4)] hover:text-[oklch(55%_.22_27)]">
                        <Link to="/documents">Przejdź do dokumentów</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "changes" && (
                <div className="bg-white border border-[oklch(92%_.008_264)] p-8">
                  <h3 className="text-xl font-bold text-[oklch(20%_.03_264)] mb-2">Zmiany w rozporządzeniu CPR (EU) 2024/3110</h3>
                  <p className="text-slate-500 mb-6">
                    Najważniejsze modyfikacje dla kategorii "{selectedCategory.name}" w porównaniu z poprzednim rozporządzeniem:
                  </p>
                  <ul className="space-y-4">
                    {selectedCategory.requirements.cprChanges.map((change, index) => (
                      <li key={index} className="bg-emerald-50 p-4 rounded-[2px] border border-emerald-200">
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-sm font-bold text-emerald-700">
                            {index + 1}
                          </div>
                          <p className="font-medium text-slate-700">{change}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "certification" && (
                <div className="bg-white border border-[oklch(92%_.008_264)] p-8">
                  <h3 className="text-xl font-bold text-[oklch(20%_.03_264)] mb-2">Systemy oceny i weryfikacji stałości właściwości użytkowych</h3>
                  <p className="text-slate-500 mb-6">
                    Dla wyrobów z kategorii "{selectedCategory.name}" obowiązują następujące systemy certyfikacji:
                  </p>
                  <div className="space-y-4">
                    {selectedCategory.requirements.certificationSystems.map((system, index) => (
                      <div key={index} className="bg-slate-50 p-6 rounded-[2px] border border-slate-200">
                        <div className="flex items-center gap-3 mb-3">
                          <Shield className="w-6 h-6 text-[oklch(55%_.22_27)]" />
                          <h4 className="font-bold text-[oklch(20%_.03_264)] text-lg">{system}</h4>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {system === "System 1+" && "Najwyższy poziom kontroli - wymaga certyfikacji przez jednostkę notyfikowaną, stałego nadzoru i badań próbek z rynku."}
                          {system === "System 1" && "Wymaga certyfikacji przez jednostkę notyfikowaną oraz stałego nadzoru bez badań próbek z rynku."}
                          {system === "System 2+" && "Wymaga certyfikacji zakładowej kontroli produkcji przez jednostkę notyfikowaną i wstępnych badań typu przez producenta."}
                          {system === "System 3+" && "Kontrola przeprowadzana przez jednostkę notyfikowaną w zakresie oceny zrównoważenia środowiskowego."}
                          {system === "System 3" && "Wymaga badań typu przez akredytowane laboratorium, zakładowa kontrola produkcji przez producenta."}
                          {system === "System 4" && "Najniższy poziom kontroli - badania typu i zakładowa kontrola produkcji wykonywane przez producenta."}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 rounded-[2px] bg-[oklch(55%_.22_27/0.05)] border border-[oklch(55%_.22_27/0.2)] flex items-start gap-3">
                    <Award className="w-5 h-5 text-[oklch(55%_.22_27)] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-[oklch(20%_.03_264)]">Potrzebujesz certyfikacji?</p>
                      <p className="text-slate-500 text-sm mb-3">Multicert oferuje kompleksowe usługi certyfikacji zgodnej z CPR (EU) 2024/3110.</p>
                      <Button variant="outline" size="sm" asChild className="border-slate-200 text-slate-700 hover:border-[oklch(55%_.22_27/0.4)] hover:text-[oklch(55%_.22_27)]">
                        <Link to="/services">Sprawdź nasze usługi</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-10 text-center">
                <Button variant="outline" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="border-slate-200 text-slate-700 hover:border-[oklch(55%_.22_27/0.4)]">
                  Powrót do wyszukiwarki
                </Button>
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* About Section */}
      <section id="about-section" className="py-24 bg-white border-t border-slate-200">
        <Container>
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-[oklch(20%_.03_264)] mb-6">
                O rozporządzeniu CPR (EU) 2024/3110
              </h2>
              <p className="text-slate-700 mb-4 leading-relaxed">
                <a
                  href="https://eur-lex.europa.eu/legal-content/PL/TXT/HTML/?uri=OJ:L_202403110#anx_III"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[oklch(55%_.22_27)] hover:text-[#1a3d6b] underline transition-colors"
                >
                  Rozporządzenie CPR (EU) 2024/3110
                </a>{" "}
                o wyrobach budowlanych wprowadza istotne zmiany dla producentów, importerów i dystrybutorów wyrobów budowlanych w Unii Europejskiej.
              </p>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Główne obszary zmian obejmują:
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Zrównoważony rozwój i aspekty środowiskowe",
                  "Cyfryzacja dokumentacji i oznakowania wyrobu",
                  "Nowe systemy oceny i weryfikacji stałości właściwości użytkowych",
                  "Zaostrzenie wymagań dotyczących bezpieczeństwa i jakości",
                  "Wprowadzenie cyfrowego paszportu produktu"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[oklch(55%_.22_27)] flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => document.getElementById("search-section")?.scrollIntoView({ behavior: "smooth" })}
                variant="outline"
                className="border-slate-200 text-slate-700 hover:border-[oklch(55%_.22_27/0.4)] hover:text-[oklch(55%_.22_27)]"
              >
                Sprawdź wymagania dla Twojego produktu
              </Button>
            </div>

            <div className="lg:w-1/2">
              <div className="bg-white border border-[oklch(92%_.008_264)] p-8">
                <h3 className="text-xl font-bold text-[oklch(20%_.03_264)] mb-6 flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-[oklch(55%_.22_27)]" />
                  Harmonogram wdrażania CPR
                </h3>
                <div className="space-y-6">
                  {[
                    { year: "Gru 2024", title: "Publikacja CPR (UE) 2024/3110", desc: "Publikacja w Dzienniku Urzędowym UE i początek biegu terminów", done: true },
                    { year: "7 sty 2025", title: "Wejście w życie", desc: "Wybrane przepisy zaczęły obowiązywać (Art. 1–4, 9, 10, 37, 89, 90)", done: true },
                    { year: "8 sty 2026", title: "Stosowanie głównych przepisów", desc: "Główne obowiązki CPR 2024/3110 wchodzą w życie; stary format DoP (305/2011) nadal ważny dla wyrobów objętych istniejącymi normami EN", active: true },
                    { year: "2026–2029+", title: "Nowe normy zharmonizowane", desc: "Komisja przyjmuje nowe HTS dla kolejnych rodzin wyrobów; nowy format DoP&C staje się obowiązkowy dla danej rodziny 12 miesięcy po mandacie normy" },
                    { year: "7 sty 2040", title: "Pełne wygaśnięcie CPR 305/2011", desc: "Ostateczny koniec okresu przejściowego — wszystkie wyroby budowlane objęte wyłącznie nowym CPR 2024/3110" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`w-16 flex-shrink-0 text-sm font-bold flex items-center gap-2 ${item.active || item.done ? 'text-[oklch(55%_.22_27)]' : 'text-slate-400'}`}>
                        {item.done && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        {item.year}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-[oklch(20%_.03_264)]">{item.title}</p>
                        <p className="text-slate-500 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 rounded-[2px] bg-amber-50 border border-amber-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-amber-800 text-sm font-medium">
                      Działaj już teraz, nie czekaj na ostatni moment! Proces dostosowania do CPR (EU) 2024/3110 może być długotrwały.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Źródła krajowe i europejskie */}
      <section className="py-24 bg-white border-t border-slate-200">
        <Container>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[oklch(55%_.22_27/0.1)] border border-[oklch(55%_.22_27/0.2)] text-[oklch(55%_.22_27)] text-sm font-medium mb-5">
              <Globe className="w-4 h-4" />
              Oficjalne źródła informacji o CPR
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[oklch(20%_.03_264)] mb-4">
              Weryfikuj wymagania bezpośrednio u źródła
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Lista sprawdzonych instytucji i baz danych — krajowych i europejskich — do których powinien sięgać każdy producent wyrobów budowlanych.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">

            {/* Krajowe */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-5 h-5 text-[oklch(55%_.22_27)]" />
                <h3 className="text-lg font-semibold text-[oklch(20%_.03_264)]">Źródła krajowe</h3>
              </div>
              <div className="space-y-4">

                {/* Multicert — wyróżnione */}
                <a
                  href="https://www.multicert.pl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-5 rounded-[2px] bg-[oklch(55%_.22_27/0.05)] border border-[oklch(55%_.22_27/0.2)] hover:border-[oklch(55%_.22_27/0.4)] hover:bg-[oklch(55% .22 27)]/8 transition-all duration-300 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[oklch(55% .22 27)]/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Star className="w-4 h-4 text-[oklch(55%_.22_27)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[oklch(20%_.03_264)] font-semibold text-sm">Multicert Sp. z o.o.</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[oklch(55% .22 27)]/15 text-[oklch(55%_.22_27)] font-medium">Certyfikacja CPR</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[oklch(55%_.22_27)] transition-colors ml-auto shrink-0" />
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Akredytowana jednostka certyfikująca wyroby budowlane. Certyfikacja ZKP, weryfikacja DoP&C, przegląd dokumentacji technicznej zgodnie z CPR (UE) 2024/3110.
                    </p>
                  </div>
                </a>

                {/* GUNB */}
                <a
                  href="https://www.gunb.gov.pl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-5 rounded-[2px] bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-all duration-300 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-sky-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Shield className="w-4 h-4 text-sky-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[oklch(20%_.03_264)] font-semibold text-sm">GUNB</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 font-medium">Organ nadzoru rynku</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 transition-colors ml-auto shrink-0" />
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Główny Urząd Nadzoru Budowlanego — organ odpowiedzialny za nadzór rynku wyrobów budowlanych w Polsce. Rejestr wyrobów, decyzje, kontrole.
                    </p>
                  </div>
                </a>

                {/* PKN */}
                <a
                  href="https://www.pkn.pl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-5 rounded-[2px] bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[oklch(20%_.03_264)] font-semibold text-sm">PKN</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">Normy EN</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors ml-auto shrink-0" />
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Polskie Centrum Normalizacji — zakup i dostęp do norm zharmonizowanych EN stosowanych w CPR (EN 197, EN 771, EN 13162 i in.).
                    </p>
                  </div>
                </a>

                {/* ocenytechniczne.pl — Multicert */}
                <a
                  href="https://ocenytechniczne.pl/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-5 rounded-[2px] bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[oklch(20%_.03_264)] font-semibold text-sm">ocenytechniczne.pl</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">EOT / ETA</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors ml-auto shrink-0" />
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Multicert — Europejskie Oceny Techniczne (EOT) dla wyrobów budowlanych nieobj­ętych normami zharmonizowanymi. Pełen zakres usług: ocena zgodności, badania, ekspertyzy.
                    </p>
                  </div>
                </a>

              </div>
            </div>

            {/* Europejskie */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Globe className="w-5 h-5 text-[oklch(55%_.22_27)]" />
                <h3 className="text-lg font-semibold text-[oklch(20%_.03_264)]">Źródła europejskie</h3>
              </div>
              <div className="space-y-4">

                {/* EUR-Lex */}
                <a
                  href="https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=OJ:L_202403110"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-5 rounded-[2px] bg-white border border-slate-200 hover:border-[oklch(55% .22 27)]/30 hover:bg-[oklch(55%_.22_27/0.05)] transition-all duration-300 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[oklch(55%_.22_27/0.1)] flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-4 h-4 text-[oklch(55%_.22_27)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[oklch(20%_.03_264)] font-semibold text-sm">EUR-Lex</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[oklch(55%_.22_27/0.1)] text-[oklch(55%_.22_27)] font-medium">Tekst CPR 2024/3110</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[oklch(55%_.22_27)] transition-colors ml-auto shrink-0" />
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Oficjalny Dziennik Urzędowy UE — pełny tekst Rozporządzenia (UE) 2024/3110 w języku polskim. Jedyne miarodajne źródło prawa.
                    </p>
                  </div>
                </a>

                {/* NANDO */}
                <a
                  href="https://ec.europa.eu/growth/tools-databases/nando/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-5 rounded-[2px] bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    <ListChecks className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[oklch(20%_.03_264)] font-semibold text-sm">NANDO</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">Jednostki notyfikowane UE</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors ml-auto shrink-0" />
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Oficjalna baza Komisji Europejskiej wszystkich jednostek notyfikowanych (NB) we wszystkich państwach UE. Weryfikacja aktualnego zakresu akredytacji.
                    </p>
                  </div>
                </a>

                {/* EOTA */}
                <a
                  href="https://www.eota.eu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-5 rounded-[2px] bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Award className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[oklch(20%_.03_264)] font-semibold text-sm">EOTA</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">ETA / EAD</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors ml-auto shrink-0" />
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      European Organisation for Technical Assessment — baza EAD i ETA dla wyrobów bez normy zharmonizowanej. Kluczowe dla innowacyjnych produktów.
                    </p>
                  </div>
                </a>

                {/* CEN */}
                <a
                  href="https://www.cencenelec.eu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-5 rounded-[2px] bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Globe className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[oklch(20%_.03_264)] font-semibold text-sm">CEN/CENELEC</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">Normy europejskie EN</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors ml-auto shrink-0" />
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Europejski Komitet Normalizacyjny — plan prac normalizacyjnych, statusy mandatów dla nowych norm CPR 2024, robocze dokumenty WG.
                    </p>
                  </div>
                </a>

              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* Help Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <Container>
          <div className="relative overflow-hidden rounded-[2px] bg-[oklch(20%_.03_264)] p-8 md:p-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Potrzebujesz pomocy w przygotowaniu do wymagań CPR?
              </h2>
              <p className="text-slate-300 mb-8">
                Nasi eksperci pomogą Ci dostosować Twoje wyroby do nowych wymagań.
                Oferujemy kompleksowe wsparcie w procesie certyfikacji oraz ocenę zgodności z wymaganiami CPR 2024/3110.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  className="group px-6 py-3 rounded-[2px] bg-white hover:bg-slate-100 text-[oklch(20%_.03_264)] font-semibold"
                >
                  <Link to="/services">
                    Nasze usługi certyfikacyjne
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("search-section")?.scrollIntoView({ behavior: "smooth" })}
                  className="px-6 py-3 rounded-[2px] border-white/20 text-white hover:bg-white/10"
                >
                  Sprawdź wymagania
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}