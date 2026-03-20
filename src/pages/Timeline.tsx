import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Container } from "../components/Container";
import {
  Calendar,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Shield,
  FileText,
  Scale,
  Building2,
  ArrowRight,
  Filter,
} from "lucide-react";

// ────────────────────────────────────────────────────────────────────────────
// DATA
// ────────────────────────────────────────────────────────────────────────────

type TimelinePhase = "przeszlosc" | "teraz" | "przyszlosc";
type TimelineCategory = "all" | "prawo" | "producent" | "jn" | "nadzor";

interface TimelineEvent {
  date: string;
  sortDate: string; // YYYY-MM-DD for sorting
  title: string;
  description: string;
  phase: TimelinePhase;
  category: TimelineCategory[];
  icon: React.ComponentType<{ className?: string }>;
  important?: boolean;
  article?: string; // optional link to regulation article
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  // ── PRZESZLOSC ──
  {
    date: "9 grudnia 2024",
    sortDate: "2024-12-09",
    title: "Publikacja w Dzienniku Urzędowym UE",
    description:
      "Rozporządzenie (UE) 2024/3110 (CPR 2024) zostało opublikowane w Dz.U. UE L 2024/3110, zastępując Rozporządzenie 305/2011.",
    phase: "przeszlosc",
    category: ["prawo"],
    icon: FileText,
  },
  {
    date: "7 stycznia 2025",
    sortDate: "2025-01-07",
    title: "Wejście w życie CPR 2024",
    description:
      "Rozporządzenie wchodzi w życie 20 dni po publikacji. Od tego momentu biegną okresy przejściowe.",
    phase: "przeszlosc",
    category: ["prawo"],
    icon: Scale,
    important: true,
  },

  // ── TERAZ (2025-2026) ──
  {
    date: "8 stycznia 2026",
    sortDate: "2026-01-08",
    title: "Stosowanie przepisów instytucjonalnych CPR 2024",
    description:
      "Zaczynaja obowiazywac przepisy ramowe rozporządzenia: nowe definicje, ramy dla jednostek notyfikowanych, przepisy o nadzorze rynku i sankcjach. Jednak bez opublikowanych nowych zharmonizowanych specyfikacji technicznych (hTS) producenci nadal stosuja dotychczasowe normy zharmonizowane (hEN) i wystawiaja DoP na starych zasadach.",
    phase: "teraz",
    category: ["prawo"],
    icon: Scale,
    important: true,
    article: "Art. 93 ust. 2",
  },
  {
    date: "8 stycznia 2026",
    sortDate: "2026-01-08",
    title: "Okres przejsciowy — stare hEN nadal obowiazuja",
    description:
      "Dopóki Komisja nie opublikuje nowych hTS dla danej rodziny wyrobów, producenci stosuja dotychczasowe normy hEN i systemy AVCP. Nowe obowiazki (DoP&C, AVS, oznakowanie CE wg Art. 20) wejda w zycie dopiero wraz z publikacja odpowiednich hTS. Przejscie nastepuje stopniowo, rodzina po rodzinie.",
    phase: "teraz",
    category: ["prawo", "producent"],
    icon: Clock,
    important: true,
    article: "Art. 93 ust. 8-9",
  },
  {
    date: "8 stycznia 2026",
    sortDate: "2026-01-08",
    title: "Nowe ramy dla importerów i dystrybutorów",
    description:
      "Rozporządzenie wprowadza rozszerzone obowiazki importerów i dystrybutorów (Art. 22-23). Praktyczne stosowanie tych przepisów zalezy jednak od publikacji hTS — do tego czasu obowiazuja dotychczasowe zasady.",
    phase: "teraz",
    category: ["prawo"],
    icon: Building2,
    article: "Art. 22-23",
  },
  {
    date: "Po publikacji hTS",
    sortDate: "2026-06-01",
    title: "System AVS i DoP&C — po publikacji nowych hTS",
    description:
      "Nowy system Oceny i Weryfikacji Stalosci Wlasciwosci Uzytkowych (AVS) z 5 poziomami (1+, 1, 2, 3, 4) oraz nowa Deklaracja Wlasciwosci Uzytkowych i Zgodnosci (DoP&C) zaczna obowiazywac dla danej rodziny wyrobów dopiero po opublikowaniu odpowiedniej zharmonizowanej specyfikacji technicznej (hTS). Do tego czasu obowiazuja systemy AVCP i stare DoP.",
    phase: "przyszlosc",
    category: ["jn", "producent"],
    icon: Shield,
    important: true,
    article: "Art. 36, Zał. V",
  },

  // ── PRZYSZLOSC (2027+) ──
  {
    date: "8 stycznia 2027",
    sortDate: "2027-01-08",
    title: "Sankcje za naruszenia CPR",
    description:
      "Państwa członkowskie muszą ustanowić system sankcji za naruszenia rozporządzenia. Obejmują fałszywe lub brakujące deklaracje, niewłaściwe oznakowanie CE, brak dokumentacji technicznej.",
    phase: "przyszlosc",
    category: ["prawo", "nadzor"],
    icon: AlertTriangle,
    important: true,
    article: "Art. 92",
  },
  {
    date: "8 lipca 2027",
    sortDate: "2027-07-08",
    title: "Cyfrowa Deklaracja DoP&C",
    description:
      "Komisja udostępnia system informatyczny do cyfrowego składania i dostępu do deklaracji DoP&C. Producenci mogą wystawiać deklaracje w formie cyfrowej.",
    phase: "przyszlosc",
    category: ["prawo", "producent"],
    icon: FileText,
    article: "Art. 11 ust. 9",
  },
  {
    date: "2028+",
    sortDate: "2028-01-01",
    title: "GWP i Cyfrowy Paszport Produktu (DPP)",
    description:
      "Po opublikowaniu zharmonizowanych specyfikacji technicznych (hTS): obowiązkowa deklaracja potencjału globalnego ocieplenia (GWP) i Cyfrowy Paszport Produktu. Dotyczy wyrobów z rodzin objętych nowymi hTS.",
    phase: "przyszlosc",
    category: ["producent"],
    icon: Clock,
    important: true,
    article: "Art. 11 ust. 2, Art. 78-79",
  },
  {
    date: "9 stycznia 2031",
    sortDate: "2031-01-09",
    title: "Wygaśnięcie starych EAD",
    description:
      "Europejskie Dokumenty Oceny (EAD) wydane na podstawie CPR 305/2011 tracą ważność. Producenci korzystający z EAD muszą przejść na nowe specyfikacje.",
    phase: "przyszlosc",
    category: ["prawo", "producent", "jn"],
    icon: AlertTriangle,
    article: "Art. 93 ust. 10",
  },
  {
    date: "8 stycznia 2038",
    sortDate: "2038-01-08",
    title: "Wyroby użyte ponownie / regenerowane",
    description:
      "Przepisy dotyczące wyrobów budowlanych użytych ponownie, regenerowanych i wytworzonych z recyklingu stają się obowiązkowe (Art. 6).",
    phase: "przyszlosc",
    category: ["prawo", "producent"],
    icon: Building2,
    article: "Art. 6, Art. 93 ust. 6",
  },
  {
    date: "7 stycznia 2040",
    sortDate: "2040-01-07",
    title: "Koniec okresu przejściowego",
    description:
      "Wszystkie wyroby budowlane muszą w pełni spełniać CPR 2024. Kończy się okres przejściowy dla wyrobów wprowadzanych na podstawie starych norm zharmonizowanych (hEN).",
    phase: "przyszlosc",
    category: ["prawo", "producent"],
    icon: CheckCircle2,
    important: true,
    article: "Art. 93 ust. 12",
  },
];

const CATEGORY_LABELS: Record<TimelineCategory, string> = {
  all: "Wszystkie",
  prawo: "Prawo / UE",
  producent: "Producenci",
  jn: "Jednostki notyfikowane",
  nadzor: "Nadzór rynku",
};

const PHASE_CONFIG: Record<TimelinePhase, { label: string; color: string; bgColor: string; borderColor: string }> = {
  przeszlosc: {
    label: "Zrealizowane",
    color: "text-slate-400",
    bgColor: "bg-slate-400/10",
    borderColor: "border-slate-400/30",
  },
  teraz: {
    label: "Obowiazuje",
    color: "text-[#1a56a0]",
    bgColor: "bg-[#1a56a0]/10",
    borderColor: "border-[#1a56a0]/30",
  },
  przyszlosc: {
    label: "Nadchodzi",
    color: "text-sky-400",
    bgColor: "bg-sky-400/10",
    borderColor: "border-sky-400/30",
  },
};

// ────────────────────────────────────────────────────────────────────────────
// HELPER: determine current phase based on date
// ────────────────────────────────────────────────────────────────────────────

function getPhaseForToday(): TimelinePhase {
  const today = new Date();
  const cprFullApplication = new Date("2026-01-08");
  if (today < cprFullApplication) return "teraz";
  return "przyszlosc";
}

// ────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ────────────────────────────────────────────────────────────────────────────

export default function TimelinePage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<TimelineCategory>("all");
  const currentPhase = getPhaseForToday();

  const filtered = TIMELINE_EVENTS.filter((e) =>
    filter === "all" ? true : e.category.includes(filter)
  );

  const canonicalUrl = "https://www.nowycpr.pl/harmonogram";
  const pageTitle = "Harmonogram CPR 2024/3110 — Kluczowe daty i terminy | NowyCPR.pl";
  const pageDesc =
    "Interaktywna oś czasu z kluczowymi datami wdrożenia nowego rozporządzenia CPR (UE) 2024/3110. Sprawdź terminy przejściowe, sankcje, GWP i DPP.";

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <Header />
        <main id="main-content" className="flex-grow pt-24 pb-20">
          {/* ── HERO ── */}
          <section className="relative overflow-hidden border-b border-slate-800">
            {/* B&W photo background */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&q=80')",
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
              <div className="relative z-10 pt-8 pb-12">
                <nav className="flex items-center gap-2 text-sm text-white/70 mb-8">
                  <button onClick={() => navigate("/")} className="hover:text-white transition-colors">
                    Strona główna
                  </button>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-white">Harmonogram</span>
                </nav>

                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/15 border border-white/30 text-white">
                    <Calendar className="w-3 h-3" /> Harmonogram
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl mb-4">
                  Harmonogram CPR 2024/3110
                </h1>
                <p className="text-white/80 text-lg max-w-2xl">
                  Kluczowe daty, terminy przejściowe i kamienie milowe wdrożenia nowego rozporządzenia o wyrobach budowlanych.
                </p>

                {/* Phase indicators */}
                <div className="flex flex-wrap gap-3 mt-8">
                  {(Object.entries(PHASE_CONFIG) as [TimelinePhase, typeof PHASE_CONFIG.teraz][]).map(
                    ([phase, config]) => (
                      <div
                        key={phase}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border ${config.borderColor} ${config.bgColor}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${phase === "teraz" ? "bg-[#1a56a0] animate-pulse" : phase === "przeszlosc" ? "bg-slate-400" : "bg-sky-400"}`} />
                        <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </Container>
          </section>

          {/* ── FILTER ── */}
          <Container>
            <div className="flex items-center gap-2 mb-10 flex-wrap">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-slate-500 text-sm mr-2">Filtruj:</span>
              {(Object.entries(CATEGORY_LABELS) as [TimelineCategory, string][]).map(([cat, label]) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                    filter === cat
                      ? "bg-[#1a56a0]/10 border-[#1a56a0]/30 text-[#1a56a0]"
                      : "bg-white border-slate-200 text-slate-600 hover:text-[#0d2137] hover:border-slate-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </Container>

          {/* ── TIMELINE ── */}
          <Container>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-slate-300 via-[#1a56a0]/40 to-sky-400/30" />

              <div className="space-y-0">
                {filtered.map((event, index) => {
                  const phaseConfig = PHASE_CONFIG[event.phase];
                  const isLeft = index % 2 === 0;
                  const Icon = event.icon;

                  // Check if this is the "current" marker
                  const isNow =
                    event.phase === "teraz" &&
                    (index === 0 ||
                      filtered[index - 1]?.phase === "przeszlosc");

                  return (
                    <div key={`${event.sortDate}-${event.title}`}>
                      {/* NOW marker */}
                      {isNow && (
                        <div className="relative flex items-center justify-center py-4">
                          <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full bg-[#1a56a0] shadow-lg shadow-[#1a56a0]/40 z-10 animate-pulse" />
                          <span className="hidden md:block bg-[#1a56a0] text-white text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full z-10">
                            Teraz
                          </span>
                        </div>
                      )}

                      <div
                        className={`relative flex items-start gap-6 py-6 ${
                          isLeft ? "md:flex-row" : "md:flex-row-reverse"
                        }`}
                      >
                        {/* Dot on line */}
                        <div
                          className={`absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 z-10 mt-2 ${
                            event.important
                              ? `${phaseConfig.borderColor.replace("/30", "/80")} ${event.phase === "teraz" ? "bg-[#1a56a0]" : event.phase === "przeszlosc" ? "bg-slate-400" : "bg-sky-400"}`
                              : "bg-white border-slate-300"
                          }`}
                        />

                        {/* Content card */}
                        <div className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${isLeft ? "md:pr-8" : "md:pl-8"}`}>
                          <div
                            className={`group p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                              event.important
                                ? `${phaseConfig.bgColor} ${phaseConfig.borderColor}`
                                : "bg-white border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            {/* Date + phase badge */}
                            <div className="flex items-center gap-3 mb-3 flex-wrap">
                              <span className={`text-xs font-mono font-bold ${phaseConfig.color}`}>
                                {event.date}
                              </span>
                              {event.article && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-500">
                                  {event.article}
                                </span>
                              )}
                            </div>

                            {/* Title + icon */}
                            <div className="flex items-start gap-3">
                              <div
                                className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${phaseConfig.bgColor}`}
                              >
                                <Icon className={`w-4 h-4 ${phaseConfig.color}`} />
                              </div>
                              <div>
                                <h3
                                  className={`font-semibold text-base mb-1.5 ${
                                    event.important ? "text-[#0d2137]" : "text-slate-700"
                                  }`}
                                >
                                  {event.title}
                                </h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                  {event.description}
                                </p>
                              </div>
                            </div>

                            {/* Category tags */}
                            <div className="flex flex-wrap gap-1.5 mt-3 ml-11">
                              {event.category
                                .filter((c) => c !== "all")
                                .map((cat) => (
                                  <span
                                    key={cat}
                                    className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200"
                                  >
                                    {CATEGORY_LABELS[cat]}
                                  </span>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Container>

          {/* ── CTA ── */}
          <section className="mt-16">
            <Container>
              <div className="bg-[#0d2137] rounded-2xl p-8 md:p-12 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Przygotuj się na CPR 2024
                </h2>
                <p className="text-slate-300 max-w-xl mx-auto mb-6">
                  Sprawdź wymagania dla Twojego wyrobu i pobierz szablony dokumentów, aby płynnie przejść na nowe przepisy.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => navigate("/wyszukiwarka")}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-[#0d2137] font-semibold rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    Sprawdź wymagania <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate("/documents")}
                    className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
                  >
                    Pobierz szablony <FileText className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Container>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
