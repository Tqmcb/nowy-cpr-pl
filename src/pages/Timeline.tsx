import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Container } from "../components/Container";
import { PageHeader, RelatedPages } from "../components/PageHeader";
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
    date: "18 grudnia 2024",
    sortDate: "2024-12-18",
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
      "Zaczynają obowiązywać przepisy ramowe rozporządzenia: nowe definicje, ramy dla jednostek notyfikowanych oraz przepisy o nadzorze rynku i sankcjach. Jednak bez opublikowanych nowych zharmonizowanych specyfikacji technicznych (hTS) producenci nadal stosują dotychczasowe normy zharmonizowane (hEN) i wystawiają DoP na starych zasadach.",
    phase: "teraz",
    category: ["prawo"],
    icon: Scale,
    important: true,
    article: "Art. 93 ust. 2",
  },
  {
    date: "8 stycznia 2026",
    sortDate: "2026-01-08",
    title: "Okres przejściowy — stare hEN nadal obowiązują",
    description:
      "Dopóki Komisja nie opublikuje nowych hTS dla danej rodziny wyrobów, producenci stosują dotychczasowe normy hEN i systemy AVCP. Nowe obowiązki (DoP&C, AVS, oznakowanie CE wg art. 20) wejdą w życie dopiero wraz z publikacją odpowiednich hTS. Przejście następuje stopniowo, rodzina po rodzinie.",
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
      "Rozporządzenie wprowadza rozszerzone obowiązki importerów i dystrybutorów (art. 22-23). Praktyczne stosowanie tych przepisów zależy jednak od publikacji hTS — do tego czasu obowiązują dotychczasowe zasady.",
    phase: "teraz",
    category: ["prawo"],
    icon: Building2,
    article: "Art. 22-23",
  },
  {
    date: "Maj 2026",
    sortDate: "2026-05-13",
    title: "Stan implementacji — projekt aktu delegowanego KE o AVS",
    description:
      "Komisja Europejska prowadzi prace nad aktem delegowanym przypisującym systemy AVS do rodzin wyrobów z Załącznika VII. Pierwszy projekt skierowano do konsultacji państw członkowskich w lipcu 2025; zrewidowaną wersję opublikowano w grudniu 2025 (po uwagach m.in. EuroWindoor, European Aluminium, EPPA, Glass for Europe i SBS proponujących nowy system AVS 4+). Akt nie został jeszcze formalnie przyjęty.",
    phase: "teraz",
    category: ["prawo"],
    icon: Clock,
    article: "Art. 36 ust. 5",
  },
  {
    date: "16 grudnia 2025",
    sortDate: "2025-12-16",
    title: "Pierwszy CPR Working Plan 2026–2029",
    description:
      "Komisja Europejska opublikowała pierwszy CPR Working Plan dla lat 2026–2029 (COM(2025) 772 final) — mapę kolejności prac nad nowymi hTS dla rodzin wyrobów z Załącznika VII. Priorytetowo traktowane są wyroby o wysokim wpływie środowiskowym: beton, stal, izolacja. Plan będzie odnawiany co najmniej co 3 lata, z raportami rocznymi od końca 2026.",
    phase: "przeszlosc",
    category: ["prawo"],
    icon: FileText,
    important: true,
    article: "Art. 6",
  },
  {
    date: "Maj 2026",
    sortDate: "2026-05-13",
    title: "Stan implementacji — brak jeszcze pierwszych hTS",
    description:
      "Na dzień 13 maja 2026 r. żadna nowa hTS nie została jeszcze opublikowana w Dz.U. UE — wszyscy producenci nadal stosują dotychczasowe normy hEN i wystawiają DoP wg CPR 305/2011 (przepisy przejściowe Art. 93 ust. 8–9). Pierwsze nowe hTS spodziewane są w latach 2027–2029 zgodnie z Working Planem COM(2025) 772.",
    phase: "teraz",
    category: ["prawo", "producent"],
    icon: Clock,
    important: true,
    article: "Art. 93 ust. 8–9",
  },
  {
    date: "Po publikacji hTS",
    sortDate: "2026-06-01",
    title: "System AVS i DoP&C — po publikacji nowych hTS",
    description:
      "Nowy system Oceny i Weryfikacji Stałości Właściwości Użytkowych (AVS) z 6 poziomami (1+, 1, 2+, 3+, 3, 4) oraz nowa Deklaracja Właściwości Użytkowych i Zgodności (DoP&C) zaczną obowiązywać dla danej rodziny wyrobów dopiero po opublikowaniu odpowiedniej zharmonizowanej specyfikacji technicznej (hTS). Do tego czasu obowiązują systemy AVCP i stare DoP. Systemy AVS zdefiniowane są w Załączniku IX, a wzór DoP&C w Załączniku V.",
    phase: "przyszlosc",
    category: ["jn", "producent"],
    icon: Shield,
    important: true,
    article: "Art. 36, Zał. IX",
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
    date: "8 stycznia 2040",
    sortDate: "2040-01-08",
    title: "Koniec okresu przejściowego",
    description:
      "Wszystkie wyroby budowlane muszą w pełni spełniać CPR 2024. Kończy się okres przejściowy dla wyrobów wprowadzanych na podstawie starych norm zharmonizowanych (hEN) — pełne uchylenie CPR 305/2011.",
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
    color: "text-[oklch(55% .22 27)]",
    bgColor: "bg-[oklch(55% .22 27)]/10",
    borderColor: "border-[oklch(55% .22 27)]/30",
  },
  przyszlosc: {
    label: "Nadchodzi",
    color: "text-[oklch(20%_.03_264)]",
    bgColor: "bg-[oklch(20%_.03_264/0.08)]",
    borderColor: "border-[oklch(20%_.03_264/0.18)]",
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

  const canonicalUrl = "https://www.nowycpr.pl/harmonogram/";
  const pageTitle = "Terminy CPR 2024/3110: DoP&C, GWP, DPP i sankcje | NowyCPR.pl";
  const pageDesc =
    "Harmonogram CPR 2024/3110: daty stosowania, okresy przejściowe, terminy DoP&C, GWP, EPD, DPP, nowe hTS, sankcje i obowiązki producentów.";

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="keywords" content="harmonogram CPR 2024/3110, terminy CPR, DoP&C 2026, GWP CPR, DPP CPR, okres przejściowy CPR, sankcje CPR, hTS" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <main id="main-content" className="flex-grow">
          <PageHeader>
            {/* Phase indicators as secondary content */}
            <div className="flex flex-wrap gap-3 pt-2">
              {(Object.entries(PHASE_CONFIG) as [TimelinePhase, typeof PHASE_CONFIG.teraz][]).map(
                ([phase, config]) => (
                  <div
                    key={phase}
                    className="flex items-center gap-2 px-4 py-2"
                    style={{ border: "1px solid oklch(86% .012 264)", borderRadius: "2px" }}
                  >
                    <span className={`w-2 h-2 rounded-full ${phase === "teraz" ? "animate-pulse" : ""}`} style={{ backgroundColor: phase === "teraz" ? "oklch(55% .22 27)" : phase === "przeszlosc" ? "oklch(60% .015 264)" : "oklch(20% .03 264)" }} />
                    <span className="editorial-kicker" style={{ color: "oklch(20% .03 264)" }}>{config.label}</span>
                  </div>
                )
              )}
            </div>
          </PageHeader>

          {/* ── FILTER — editorial ── */}
          <section className="py-10 bg-white">
            <Container>
              <div className="max-w-6xl mx-auto flex items-center gap-3 flex-wrap">
                <Filter className="w-4 h-4" style={{ color: "oklch(60% .015 264)" }} />
                <span className="editorial-kicker mr-2">Filtruj</span>
                {(Object.entries(CATEGORY_LABELS) as [TimelineCategory, string][]).map(([cat, label]) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className="px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all"
                    style={{
                      backgroundColor: filter === cat ? "oklch(20% .03 264)" : "white",
                      color: filter === cat ? "white" : "oklch(42% .02 264)",
                      border: "1px solid " + (filter === cat ? "oklch(20% .03 264)" : "oklch(86% .012 264)"),
                      borderRadius: "2px",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </Container>
          </section>

          {/* ── TIMELINE — editorial vertical rail ── */}
          <section className="pb-12 md:pb-16 bg-white">
            <Container>
              <div className="max-w-6xl mx-auto relative">
                {/* Vertical line centered */}
                <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px" style={{ backgroundColor: "oklch(86% .012 264)" }} />

                <div className="space-y-0">
                  {filtered.map((event, index) => {
                    const isLeft = index % 2 === 0;
                    const Icon = event.icon;

                    const isNow =
                      event.phase === "teraz" &&
                      (index === 0 ||
                        filtered[index - 1]?.phase === "przeszlosc");

                    const phaseDot = event.phase === "teraz" ? "oklch(55% .22 27)" : event.phase === "przeszlosc" ? "oklch(60% .015 264)" : "oklch(20% .03 264)";

                    return (
                      <div key={`${event.sortDate}-${event.title}`}>
                        {/* NOW marker — editorial */}
                        {isNow && (
                          <div className="relative flex items-center justify-center py-6">
                            <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-3 h-3 z-10 animate-pulse" style={{ backgroundColor: "oklch(55% .22 27)" }} />
                            <span className="hidden md:block editorial-kicker px-4 py-1 z-10 bg-white" style={{ color: "oklch(55% .22 27)", border: "1px solid oklch(55% .22 27)" }}>
                              · Teraz ·
                            </span>
                          </div>
                        )}

                        <div
                          className={`relative flex items-start gap-6 py-8 ${
                            isLeft ? "md:flex-row" : "md:flex-row-reverse"
                          }`}
                        >
                          {/* Dot on line */}
                          <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-2.5 h-2.5 z-10 mt-2" style={{
                            backgroundColor: event.important ? phaseDot : "white",
                            border: `2px solid ${phaseDot}`,
                          }} />

                          {/* Content card — editorial */}
                          <div className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${isLeft ? "md:pr-8" : "md:pl-8"}`}>
                            <div className="group p-6 transition-all hover:bg-slate-50" style={{
                              backgroundColor: "white",
                              border: "1px solid oklch(92% .008 264)",
                              borderLeft: event.important ? `3px solid oklch(55% .22 27)` : "1px solid oklch(92% .008 264)",
                              borderRadius: "2px",
                            }}>
                              {/* Date + article */}
                              <div className="flex items-baseline gap-3 mb-4 flex-wrap">
                                <span className="editorial-kicker" style={{ color: event.important ? "oklch(55% .22 27)" : "oklch(60% .015 264)" }}>
                                  {event.date}
                                </span>
                                {event.article && (
                                  <span className="editorial-kicker" style={{ color: "oklch(60% .015 264)" }}>
                                    · {event.article}
                                  </span>
                                )}
                              </div>

                              {/* Title + icon */}
                              <div className="flex items-start gap-3">
                                <Icon className="w-4 h-4 mt-1.5 shrink-0" style={{ color: event.important ? "oklch(55% .22 27)" : "oklch(42% .02 264)" }} />
                                <div>
                                  <h3 className="font-serif text-lg md:text-xl mb-2 leading-[1.2]" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>
                                    {event.title}
                                  </h3>
                                  <p className="text-sm leading-[1.65]" style={{ color: "oklch(42% .02 264)" }}>
                                    {event.description}
                                  </p>
                                </div>
                              </div>

                              {/* Category tags */}
                              <div className="flex flex-wrap gap-2 mt-4 ml-7">
                                {event.category
                                  .filter((c) => c !== "all")
                                  .map((cat) => (
                                    <span
                                      key={cat}
                                      className="editorial-kicker px-2 py-0.5"
                                      style={{ color: "oklch(60% .015 264)", border: "1px solid oklch(92% .008 264)" }}
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
          </section>

          {/* ── CTA — editorial dark banner ── */}
          <section className="py-12 md:py-14 bg-white">
            <Container>
              <div className="max-w-6xl mx-auto">
                <div className="relative py-8 md:py-10 px-6 md:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6" style={{ backgroundColor: "oklch(20% .03 264)" }}>
                  <div className="absolute top-0 left-0 h-[5px] w-24" style={{ backgroundColor: "oklch(55% .22 27)" }} />
                  <div className="max-w-2xl">
                    <div className="editorial-kicker mb-4" style={{ color: "oklch(55% .22 27)" }}>Przygotuj się</div>
                    <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.05] text-white" style={{ fontWeight: 500 }}>
                      Sprawdź co dotyczy<br/>
                      <span className="italic" style={{ color: "oklch(75% .15 27)", fontWeight: 500 }}>Twojego wyrobu.</span>
                    </h2>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                    <button
                      onClick={() => navigate("/wyszukiwarka")}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-white font-semibold whitespace-nowrap transition-all hover:bg-slate-100"
                      style={{ color: "oklch(20% .03 264)", borderRadius: "2px" }}
                    >
                      Sprawdź wymagania <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>
                    <button
                      onClick={() => navigate("/documents")}
                      className="flex items-center justify-center gap-2 px-6 py-3 font-semibold whitespace-nowrap transition-all hover:bg-white/10"
                      style={{ border: "1px solid rgba(255,255,255,0.3)", color: "white", backgroundColor: "transparent", borderRadius: "2px" }}
                    >
                      Pobierz szablony <FileText className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        </main>
        <RelatedPages />
        <Footer />
      </div>
    </>
  );
}
