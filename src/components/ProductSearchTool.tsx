import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "components/Button";
import { Container } from "components/Container";
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
  Building2
} from "lucide-react";

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
    "Deklaracja właściwości użytkowych (DoP)",
    "Oznakowanie CE",
    "Dokumentacja zakładowej kontroli produkcji",
    "Cyfrowy paszport produktu (nowy z CPR 2024)"
  ],
  cprChanges: [
    "Cyfryzacja dokumentacji i oznaczeń",
    "Zwiększone wymagania środowiskowe",
    "Nowe systemy oceny i weryfikacji stałości właściwości użytkowych"
  ],
  certificationSystems: ["System 2+", "System 3"]
};

// Helper function to build a complete list of product categories when Supabase fails
const buildFullProductCategoryList = () => {
  return [
    { value: "plumbing", label: "Wyroby instalacyjne (PL-1)" },
    { value: "ceiling", label: "Sufity podwieszane (CP-2)" },
    { value: "steel", label: "Wyroby stalowe (ST-3)" },
    { value: "concrete", label: "Betony i zaprawy (CM-4)" },
    { value: "doors", label: "Drzwi i okna (DW-5)" },
    { value: "road", label: "Wyroby drogowe (RD-6)" },
    { value: "flooring", label: "Podłogi i posadzki (FL-7)" },
    { value: "timber", label: "Wyroby drewniane konstrukcyjne (TM-8)" },
    { value: "boards", label: "Płyty drewnopochodne (WB-9)" },
    { value: "insulation", label: "Materiały izolacyjne (IN-10)" },
    { value: "facades", label: "Systemy elewacyjne (FC-11)" },
    { value: "roofing", label: "Pokrycia dachowe (RF-12)" },
    { value: "drywall", label: "Systemy suchej zabudowy (DW-13)" },
    { value: "adhesives", label: "Kleje i uszczelniacze (AD-14)" },
    { value: "waterproofing", label: "Hydroizolacje (WP-15)" },
    { value: "fireproofing", label: "Zabezpieczenia przeciwpożarowe (FP-16)" },
    { value: "glass", label: "Szkło budowlane (GL-17)" },
    { value: "ventilation", label: "Systemy wentylacyjne (VE-18)" },
    { value: "heating", label: "Systemy grzewcze (HE-19)" },
    { value: "electrical", label: "Instalacje elektryczne (EL-20)" },
    { value: "drainage", label: "Systemy odwodnienia (DR-21)" },
    { value: "sanitary", label: "Wyposażenie sanitarne (SA-22)" },
    { value: "paints", label: "Farby i powłoki (PA-23)" },
    { value: "acoustics", label: "Izolacje akustyczne (AC-24)" },
    { value: "stairs", label: "Schody i balustrady (ST-25)" },
    { value: "stonework", label: "Wyroby kamienne (SW-26)" },
    { value: "lighting", label: "Oświetlenie budowlane (LI-27)" },
    { value: "fencing", label: "Ogrodzenia (FE-28)" },
    { value: "foundation", label: "Wyroby fundamentowe (FO-29)" },
    { value: "bricks", label: "Cegły i pustaki (BR-30)" },
    { value: "scaffolding", label: "Rusztowania (SC-31)" },
    { value: "prefab", label: "Elementy prefabrykowane (PF-32)" },
    { value: "solar", label: "Systemy solarne (SO-33)" },
    { value: "geotextiles", label: "Geotekstylia (GT-34)" },
    { value: "plastics", label: "Tworzywa konstrukcyjne (PL-35)" },
    { value: "eco", label: "Materiały ekologiczne (EC-36)" }
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
    <div className="flex flex-col min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float-delay"></div>
        </div>

        <Container>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-2/3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/20 mb-6">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 text-sm font-medium">Wyszukiwarka CPR</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-white">Wyszukiwarka wymagań </span>
                <span className="gradient-text">CPR (EU) 2024/3110</span>
              </h1>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl">
                Sprawdź wymagania dla Twojego wyrobu budowlanego. Wybierz kategorię produktu,
                aby zobaczyć szczegółowe informacje o testach, dokumentacji i zmianach w nowym rozporządzeniu CPR.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => document.getElementById("search-section")?.scrollIntoView({ behavior: "smooth" })}
                  className="group"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Przejdź do wyszukiwarki
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Więcej o CPR 2024
                </Button>
              </div>
            </div>
            <div className="md:w-1/3">
              <div className="glass-card p-6 animate-float">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <Search className="w-10 h-10 text-slate-900" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text mb-1">{productOptions.length}</div>
                  <p className="text-slate-400 text-sm">kategorii produktów</p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-white">2025</div>
                    <p className="text-slate-500 text-xs">rok wejścia</p>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">EU</div>
                    <p className="text-slate-500 text-xs">regulacja</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Search Section */}
      <section id="search-section" className="py-16 bg-gradient-to-b from-slate-900 to-slate-950">
        <Container>
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Znajdź wymagania dla <span className="gradient-text">Twojego produktu</span>
            </h2>
            <p className="text-slate-400 mb-8">
              Wybierz kategorię wyrobu budowlanego, aby sprawdzić wymagania zgodne z rozporządzeniem CPR (EU) 2024/3110.
            </p>

          </div>

          <div className="glass-card p-8 mb-10">
            <div className="max-w-xl mx-auto">
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Wybierz kategorię wyrobu budowlanego:
              </label>
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <select
                  value={selectedCategoryId}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="" className="bg-slate-800">-- Wybierz kategorię --</option>
                  {productOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-slate-800">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-center">
                <Button
                  onClick={() => document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" })}
                  disabled={!selectedCategory}
                  className="group"
                >
                  Pokaż wymagania
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          {selectedCategory && (
            <div id="results-section" className="scroll-mt-16">
              <div className="glass-card p-6 mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-slate-900" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedCategory.name}</h3>
                    <p className="text-slate-400">
                      Kod kategorii: <span className="text-amber-400 font-semibold">{selectedCategory.code}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap gap-2 mb-8 pb-4 border-b border-white/10">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-2 px-4 text-sm font-medium rounded-lg transition-all ${activeTab === tab.id
                        ? "bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900"
                        : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                      }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === "overview" && (
                <div className="glass-card p-8">
                  <h3 className="text-xl font-bold text-white mb-4">{selectedCategory.requirements.title}</h3>
                  <p className="text-slate-400 mb-8 leading-relaxed">{selectedCategory.requirements.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                      <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-amber-400" />
                        Kluczowe wymagania
                      </h4>
                      <ul className="space-y-3">
                        {selectedCategory.requirements.mandatoryTests.slice(0, 3).map((test, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <ChevronRight className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-300 text-sm">{test}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-emerald-500/10 p-6 rounded-xl border border-emerald-500/20">
                      <h4 className="font-bold text-emerald-400 mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Nowości w CPR 2024
                      </h4>
                      <ul className="space-y-3">
                        {selectedCategory.requirements.cprChanges.slice(0, 3).map((change, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <ArrowRight className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-300 text-sm">{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "tests" && (
                <div className="glass-card p-8">
                  <h3 className="text-xl font-bold text-white mb-2">Wymagane badania</h3>
                  <p className="text-slate-400 mb-6">
                    Wyroby z kategorii "{selectedCategory.name}" muszą przejść następujące badania:
                  </p>
                  <ul className="space-y-4">
                    {selectedCategory.requirements.mandatoryTests.map((test, index) => (
                      <li key={index} className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-sm font-bold text-slate-900">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-white">{test}</p>
                            {test.includes("nowe") && (
                              <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs">
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
                <div className="glass-card p-8">
                  <h3 className="text-xl font-bold text-white mb-2">Wymagana dokumentacja</h3>
                  <p className="text-slate-400 mb-6">
                    Producenci wyrobów z kategorii "{selectedCategory.name}" muszą przygotować:
                  </p>
                  <ul className="space-y-4">
                    {selectedCategory.requirements.documentationRequired.map((doc, index) => (
                      <li key={index} className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <div className="flex items-start gap-4">
                          <FileText className="w-6 h-6 text-slate-500 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-white">{doc}</p>
                            {doc.includes("nowy") && (
                              <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs">
                                <Sparkles className="w-3 h-3" />
                                Nowy wymóg CPR 2024
                              </span>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-white">Pobierz wzory dokumentów</p>
                      <p className="text-slate-400 text-sm mb-3">W sekcji "Dokumenty" znajdziesz gotowe szablony wymaganych dokumentów.</p>
                      <Button variant="outline" size="sm" onClick={() => navigate("/documents")}>
                        Przejdź do dokumentów
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "changes" && (
                <div className="glass-card p-8">
                  <h3 className="text-xl font-bold text-white mb-2">Zmiany w rozporządzeniu CPR (EU) 2024/3110</h3>
                  <p className="text-slate-400 mb-6">
                    Najważniejsze modyfikacje dla kategorii "{selectedCategory.name}" w porównaniu z poprzednim rozporządzeniem:
                  </p>
                  <ul className="space-y-4">
                    {selectedCategory.requirements.cprChanges.map((change, index) => (
                      <li key={index} className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-sm font-bold text-slate-900">
                            {index + 1}
                          </div>
                          <p className="font-medium text-emerald-100">{change}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "certification" && (
                <div className="glass-card p-8">
                  <h3 className="text-xl font-bold text-white mb-2">Systemy oceny i weryfikacji stałości właściwości użytkowych</h3>
                  <p className="text-slate-400 mb-6">
                    Dla wyrobów z kategorii "{selectedCategory.name}" obowiązują następujące systemy certyfikacji:
                  </p>
                  <div className="space-y-4">
                    {selectedCategory.requirements.certificationSystems.map((system, index) => (
                      <div key={index} className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <div className="flex items-center gap-3 mb-3">
                          <Shield className="w-6 h-6 text-amber-400" />
                          <h4 className="font-bold text-white text-lg">{system}</h4>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
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

                  <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                    <Award className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-white">Potrzebujesz certyfikacji?</p>
                      <p className="text-slate-400 text-sm mb-3">Multicert oferuje kompleksowe usługi certyfikacji zgodnej z CPR (EU) 2024/3110.</p>
                      <Button variant="outline" size="sm" onClick={() => navigate("/services")}>
                        Sprawdź nasze usługi
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-10 text-center">
                <Button variant="outline" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  Powrót do wyszukiwarki
                </Button>
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* About Section */}
      <section id="about-section" className="py-24 bg-slate-950">
        <Container>
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                O rozporządzeniu <span className="gradient-text">CPR (EU) 2024/3110</span>
              </h2>
              <p className="text-slate-400 mb-4 leading-relaxed">
                <a
                  href="https://eur-lex.europa.eu/legal-content/PL/TXT/HTML/?uri=OJ:L_202403110#anx_III"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 underline transition-colors"
                >
                  Rozporządzenie CPR (EU) 2024/3110
                </a>{" "}
                o wyrobach budowlanych wprowadza istotne zmiany dla producentów, importerów i dystrybutorów wyrobów budowlanych w Unii Europejskiej.
              </p>
              <p className="text-slate-400 mb-6 leading-relaxed">
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
                    <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => document.getElementById("search-section")?.scrollIntoView({ behavior: "smooth" })}
                variant="outline"
              >
                Sprawdź wymagania dla Twojego produktu
              </Button>
            </div>

            <div className="lg:w-1/2">
              <div className="glass-card p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-amber-400" />
                  Harmonogram wdrażania CPR
                </h3>
                <div className="space-y-6">
                  {[
                    { year: "2024", title: "Publikacja CPR (EU) 2024/3110", desc: "Publikacja i początek okresu przejściowego", done: true },
                    { year: "2025", title: "Wejście w życie", desc: "Aktualizacja deklaracji właściwości użytkowych i dokumentacji technicznej", active: true },
                    { year: "2026", title: "Cyfryzacja dokumentacji", desc: "Obowiązkowe wdrożenie cyfrowej deklaracji właściwości użytkowych" },
                    { year: "2027", title: "Wymagania środowiskowe", desc: "Obowiązkowe raportowanie śladu węglowego i cyklu życia produktu" },
                    { year: "2028", title: "Końcowa data zgodności", desc: "Pełne wdrożenie wszystkich wymagań CPR 2024" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`w-16 flex-shrink-0 text-sm font-bold flex items-center gap-2 ${item.active || item.done ? 'text-amber-400' : 'text-slate-500'}`}>
                        {item.done && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {item.year}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-white">{item.title}</p>
                        <p className="text-slate-400 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-300 text-sm font-medium">
                      Działaj już teraz, nie czekaj na ostatni moment! Proces dostosowania do CPR (EU) 2024/3110 może być długotrwały.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Help Section */}
      <section className="py-24 bg-slate-900">
        <Container>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 via-slate-800 to-slate-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-blue-500/10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Potrzebujesz pomocy w przygotowaniu do wymagań CPR?
              </h2>
              <p className="text-slate-400 mb-8">
                Nasi eksperci pomogą Ci dostosować Twoje wyroby do nowych wymagań.
                Oferujemy kompleksowe wsparcie w procesie certyfikacji oraz ocenę zgodności z wymaganiami CPR 2024/3110.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate("/services")}
                  className="group"
                >
                  Nasze usługi certyfikacyjne
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("search-section")?.scrollIntoView({ behavior: "smooth" })}
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