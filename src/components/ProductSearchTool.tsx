import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "components/Button";
import { Container } from "components/Container";
import { PageHeader } from "components/PageHeader";
import { getAllProductCategories, type ProductCategory } from "utils/productData";
import type { ProductFamily } from "utils/wyrobLoader";
import { buildWyrobSnapshot } from "utils/wyrobSummaries";
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
  Star,
  ClipboardList,
  BookOpenText
} from "lucide-react";
import { Helmet } from "react-helmet-async";

const normalizeSearchQuery = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

export function ProductSearchTool() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [wyroby, setWyroby] = useState<ProductFamily[]>([]);

  const productCategories = useMemo(() => getAllProductCategories(), []);
  const productOptions = useMemo(() => productCategories.map(category => ({
    value: category.id,
    label: `${category.name} (${category.code})`,
  })), [productCategories]);

  useEffect(() => {
    const loadWyroby = async () => {
      try {
        const { getAllWyroby } = await import("../utils/wyrobLoader");
        const data = await getAllWyroby();
        setWyroby(data);
      } catch (error) {
        console.error("Error loading wyroby for search tool:", error);
      }
    };

    loadWyroby();
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      return;
    }

    const query = searchParams.get("q");
    if (!query) {
      return;
    }

    const normalizedQuery = normalizeSearchQuery(query);
    const matchedCategory = productCategories.find((category) => {
      const haystack = normalizeSearchQuery([
        category.id,
        category.name,
        category.code,
        category.description,
        category.requirements.title,
      ].join(" "));
      return haystack.includes(normalizedQuery) || normalizedQuery.includes(normalizeSearchQuery(category.name));
    });

    if (matchedCategory) {
      setSelectedCategoryId(matchedCategory.id);
      setSelectedCategory(matchedCategory);
    }
  }, [productCategories, searchParams, selectedCategoryId]);

  const selectedWyrob = useMemo(() => {
    if (!selectedCategory) {
      return null;
    }

    return wyroby.find((wyrob) => wyrob.family_number === Number(selectedCategory.code)) ?? null;
  }, [selectedCategory, wyroby]);

  const wyrobSnapshot = useMemo(() => buildWyrobSnapshot(selectedWyrob), [selectedWyrob]);
  const visibleChanges = wyrobSnapshot?.changes.length ? wyrobSnapshot.changes : selectedCategory?.requirements.cprChanges ?? [];
  const visibleActions = wyrobSnapshot?.actions.length ? wyrobSnapshot.actions : selectedCategory?.requirements.documentationRequired.slice(0, 5) ?? [];

  const handleCategoryChange = (value: string) => {
    setSelectedCategoryId(value);
    setActiveTab("overview");

    if (!value) {
      setSelectedCategory(null);
      setSearchParams({}, { replace: true });
      return;
    }

    const category = productCategories.find((item) => item.id === value) ?? null;
    setSelectedCategory(category);

    if (category) {
      setSearchParams({ q: category.name.toLowerCase() }, { replace: true });
    }
  };

  const tabs = [
    { id: "overview", label: "Przegląd", icon: ListChecks },
    { id: "tests", label: "Badania", icon: FlaskConical },
    { id: "documentation", label: "Dokumentacja", icon: FileText },
    { id: "changes", label: "Zmiany CPR 2024", icon: Sparkles },
    { id: "certification", label: "Certyfikacja", icon: Award }
  ];

  const searchPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Wyszukiwarka wymagań CPR dla wyrobu budowlanego",
    "url": "https://www.nowycpr.pl/wyszukiwarka/",
    "description": "Narzędzie do sprawdzania wymagań CPR 2024/3110 dla konkretnych rodzin wyrobów budowlanych.",
    "inLanguage": "pl-PL",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.nowycpr.pl/wyszukiwarka/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Helmet>
        <title>Wymagania CPR dla wyrobu budowlanego — wyszukiwarka | NowyCPR.pl</title>
        <meta name="description" content="Sprawdź wymagania CPR 2024/3110 dla konkretnego wyrobu budowlanego: norma hEN, system AVS, badania, dokumentacja, DoP&C, FPC/ZKP i certyfikacja." />
        <meta name="keywords" content="wymagania CPR dla wyrobu, wyroby budowlane CPR, system AVS, norma zharmonizowana hEN, DoP&C, FPC, certyfikacja wyrobu budowlanego" />
        <meta property="og:title" content="Wymagania CPR dla wyrobu budowlanego — wyszukiwarka | NowyCPR.pl" />
        <meta property="og:description" content="Interaktywna wyszukiwarka wymagań CPR dla kategorii wyrobów budowlanych: AVS, hEN, badania, DoP&C i FPC." />
        <meta property="og:url" content="https://www.nowycpr.pl/wyszukiwarka/" />
        <link rel="canonical" href="https://www.nowycpr.pl/wyszukiwarka/" />
        <script type="application/ld+json">{JSON.stringify(searchPageSchema)}</script>
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
            className="px-8 py-4 text-sm font-semibold transition-all disabled:opacity-40 gap-2 whitespace-nowrap"
            style={{ backgroundColor: "oklch(20% .03 264)", color: "white", borderRadius: "2px" }}
          >
            Pokaż wymagania
            <ArrowRight className="w-4 h-4 shrink-0" />
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
                <p className="max-w-4xl text-slate-700 leading-relaxed">
                  {wyrobSnapshot?.familySummary || selectedCategory.description}
                </p>
                <p className="mt-3 max-w-4xl text-slate-500 leading-relaxed">
                  {wyrobSnapshot?.currentStatus || selectedCategory.requirements.description}
                </p>
                {selectedWyrob && (
                  <>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {selectedWyrob.normy.slice(0, 5).map((norma) => (
                        <span
                          key={norma}
                          className="inline-flex items-center rounded-full border border-[oklch(92%_.008_264)] bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                        >
                          {norma}
                        </span>
                      ))}
                      {selectedWyrob.avs_system && (
                        <span className="inline-flex items-center rounded-full border border-[oklch(55%_.22_27/0.18)] bg-[oklch(55%_.22_27/0.06)] px-3 py-1 text-xs font-semibold text-[oklch(55%_.22_27)]">
                          AVS/AVCP: {selectedWyrob.avs_system}
                        </span>
                      )}
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                      <div className="rounded-[2px] border border-slate-200 bg-slate-50 p-5">
                        <div className="mb-3 flex items-center gap-2 text-[oklch(20%_.03_264)]">
                          <BookOpenText className="h-4 w-4 text-[oklch(55%_.22_27)]" />
                          <h4 className="text-sm font-semibold">Co realnie się zmienia</h4>
                        </div>
                        <ul className="space-y-2">
                          {visibleChanges.slice(0, 3).map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[oklch(55%_.22_27)]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-[2px] border border-slate-200 bg-white p-5">
                        <div className="mb-3 flex items-center gap-2 text-[oklch(20%_.03_264)]">
                          <ClipboardList className="h-4 w-4 text-[oklch(55%_.22_27)]" />
                          <h4 className="text-sm font-semibold">Co producent powinien zrobić teraz</h4>
                        </div>
                        <ul className="space-y-2">
                          {visibleActions.slice(0, 4).map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[oklch(55%_.22_27)]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-[2px] border border-[oklch(55%_.22_27/0.18)] bg-[oklch(55%_.22_27/0.05)] p-5">
                        <div className="mb-3 flex items-center gap-2 text-[oklch(20%_.03_264)]">
                          <Info className="h-4 w-4 text-[oklch(55%_.22_27)]" />
                          <h4 className="text-sm font-semibold">Pełna karta rodziny</h4>
                        </div>
                        <p className="mb-4 text-sm leading-relaxed text-slate-700">
                          Dla tej rodziny jest już dostępna pełna karta z normami, systemem oceny, checklistą i przykładami wyrobów.
                        </p>
                        <Button asChild className="gap-2 whitespace-nowrap px-4 py-2 text-sm" style={{ backgroundColor: "oklch(55%_.22_27)", color: "white", borderRadius: "2px" }}>
                          <Link to={`/wyrob/${selectedWyrob.slug}/`}>
                            Otwórz pełną kartę
                            <ArrowRight className="h-4 w-4 shrink-0" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </>
                )}
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
                <div className="bg-white border border-[oklch(92%_.008_264)] p-6">
                  <h3 className="text-xl font-bold text-[oklch(20%_.03_264)] mb-4">
                    {selectedWyrob ? `Najważniejsze dla rodziny ${selectedCategory.code}` : selectedCategory.requirements.title}
                  </h3>
                  <p className="text-slate-600 mb-8 leading-relaxed">
                    {selectedWyrob
                      ? "Ten widok zbiera najważniejsze informacje z pełnej karty wyrobu: co dziś obowiązuje, co zmieni CPR 2024 dla tej rodziny i jakie działania warto przygotować już teraz."
                      : selectedCategory.requirements.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-6 rounded-[2px] border border-slate-200">
                      <h4 className="font-bold text-[oklch(20%_.03_264)] mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[oklch(55%_.22_27)]" />
                        Kluczowe wymagania i normy
                      </h4>
                      <ul className="space-y-3">
                        {(selectedWyrob?.normy.length ? selectedWyrob.normy : selectedCategory.requirements.mandatoryTests).slice(0, 4).map((test, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <ChevronRight className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700 text-sm">{test}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-[oklch(55%_.22_27/0.05)] p-6 rounded-[2px] border border-[oklch(55%_.22_27/0.18)]">
                      <h4 className="font-bold text-[oklch(55%_.22_27)] mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Co zmienia się dla tej rodziny
                      </h4>
                      <ul className="space-y-3">
                        {visibleChanges.slice(0, 4).map((change, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <ArrowRight className="w-4 h-4 text-[oklch(55%_.22_27)] mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700 text-sm">{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "tests" && (
                <div className="bg-white border border-[oklch(92%_.008_264)] p-6">
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
                              <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 rounded bg-[oklch(55%_.22_27/0.08)] text-[oklch(55%_.22_27)] text-xs">
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
                <div className="bg-white border border-[oklch(92%_.008_264)] p-6">
                  <h3 className="text-xl font-bold text-[oklch(20%_.03_264)] mb-2">Wymagana dokumentacja</h3>
                  <p className="text-slate-500 mb-6">
                    Producenci wyrobów z kategorii "{selectedCategory.name}" muszą przygotować:
                  </p>
                  {visibleActions.length > 0 && (
                    <div className="mb-6 rounded-[2px] border border-[oklch(55%_.22_27/0.18)] bg-[oklch(55%_.22_27/0.05)] p-5">
                      <p className="mb-3 font-medium text-[oklch(20%_.03_264)]">Najpilniejsze działania organizacyjne</p>
                      <ul className="space-y-2">
                        {visibleActions.slice(0, 4).map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[oklch(55%_.22_27)]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <ul className="space-y-4">
                    {selectedCategory.requirements.documentationRequired.map((doc, index) => (
                      <li key={index} className="bg-slate-50 p-4 rounded-[2px] border border-slate-200">
                        <div className="flex items-start gap-4">
                          <FileText className="w-6 h-6 text-slate-400 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-[oklch(20%_.03_264)]">{doc}</p>
                            {doc.includes("nowy") && (
                              <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 rounded bg-[oklch(55%_.22_27/0.08)] text-[oklch(55%_.22_27)] text-xs">
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
                <div className="bg-white border border-[oklch(92%_.008_264)] p-6">
                  <h3 className="text-xl font-bold text-[oklch(20%_.03_264)] mb-2">Zmiany w rozporządzeniu CPR (EU) 2024/3110</h3>
                  <p className="text-slate-500 mb-6">
                    Najważniejsze modyfikacje dla kategorii "{selectedCategory.name}" w porównaniu z poprzednim rozporządzeniem:
                  </p>
                  <ul className="space-y-4">
                    {visibleChanges.map((change, index) => (
                      <li key={index} className="bg-[oklch(55%_.22_27/0.05)] p-4 rounded-[2px] border border-[oklch(55%_.22_27/0.18)]">
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-lg bg-[oklch(55%_.22_27/0.1)] flex items-center justify-center text-sm font-bold text-[oklch(55%_.22_27)]">
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
                <div className="bg-white border border-[oklch(92%_.008_264)] p-6">
                  <h3 className="text-xl font-bold text-[oklch(20%_.03_264)] mb-2">Systemy oceny i weryfikacji stałości właściwości użytkowych</h3>
                  <p className="text-slate-500 mb-6">
                    Dla wyrobów z kategorii "{selectedCategory.name}" obowiązują następujące systemy certyfikacji:
                  </p>
                  {selectedWyrob && (
                    <div className="mb-6 rounded-[2px] border border-slate-200 bg-slate-50 p-5">
                      <p className="font-medium text-[oklch(20%_.03_264)]">
                        Karta rodziny wskazuje dla tej grupy: <span className="text-[oklch(55%_.22_27)]">{selectedWyrob.avs_system || "sprawdzenie właściwej normy wyrobu"}</span>
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        W praktyce poziom udziału jednostki notyfikowanej zależy od funkcji wyrobu, normy bazowej oraz tego, czy mówimy o stanie obecnym pod hEN/AVCP, czy o modelu docelowym po wdrożeniu odpowiedniej hTS.
                      </p>
                    </div>
                  )}
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
      <section id="about-section" className="py-14 bg-white border-t border-slate-200">
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
              <div className="bg-white border border-[oklch(92%_.008_264)] p-6">
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
                        {item.done && <CheckCircle2 className="w-4 h-4 text-[oklch(55%_.22_27)]" />}
                        {item.year}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-[oklch(20%_.03_264)]">{item.title}</p>
                        <p className="text-slate-500 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 rounded-[2px] bg-[oklch(55%_.22_27/0.05)] border border-[oklch(55%_.22_27/0.18)]">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-[oklch(55%_.22_27)] flex-shrink-0 mt-0.5" />
                    <p className="text-[oklch(20%_.03_264)] text-sm font-medium">
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
      <section className="py-14 bg-white border-t border-slate-200">
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
                  className="flex items-start gap-4 p-5 rounded-[2px] bg-white border border-slate-200 hover:border-[oklch(55%_.22_27/0.3)] hover:bg-[oklch(55%_.22_27/0.04)] transition-all duration-300 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[oklch(55%_.22_27/0.1)] flex items-center justify-center shrink-0 mt-0.5">
                    <Shield className="w-4 h-4 text-[oklch(55%_.22_27)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[oklch(20%_.03_264)] font-semibold text-sm">GUNB</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[oklch(55%_.22_27/0.1)] text-[oklch(55%_.22_27)] font-medium">Organ nadzoru rynku</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[oklch(55%_.22_27)] transition-colors ml-auto shrink-0" />
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
                  className="flex items-start gap-4 p-5 rounded-[2px] bg-white border border-slate-200 hover:border-[oklch(55%_.22_27/0.3)] hover:bg-[oklch(55%_.22_27/0.04)] transition-all duration-300 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[oklch(55%_.22_27/0.1)] flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 className="w-4 h-4 text-[oklch(55%_.22_27)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[oklch(20%_.03_264)] font-semibold text-sm">ocenytechniczne.pl</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[oklch(55%_.22_27/0.1)] text-[oklch(55%_.22_27)] font-medium">EOT / ETA</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[oklch(55%_.22_27)] transition-colors ml-auto shrink-0" />
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
      <section className="py-14 bg-slate-50 border-t border-slate-200">
        <Container>
          <div className="relative overflow-hidden rounded-[2px] bg-[oklch(20%_.03_264)] p-6 md:p-12">
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
                  <Link to="/services" className="inline-flex items-center gap-2 whitespace-nowrap">
                    <span>Nasze usługi certyfikacyjne</span>
                    <ArrowRight className="w-5 h-5 shrink-0 group-hover:translate-x-1 transition-transform" />
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
