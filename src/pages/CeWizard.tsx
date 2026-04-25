import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PageHeader, RelatedPages } from "../components/PageHeader";
import { Container } from "../components/Container";
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Circle,
  Building2,
  Globe,
  FileText,
  Shield,
  ArrowRight,
  RotateCcw,
  Download,
  Clock,
  AlertTriangle,
  Newspaper,
} from "lucide-react";

// ────────────────────────────────────────────────────────────────────────────
// DATA
// ────────────────────────────────────────────────────────────────────────────

interface ProductOption {
  id: string;
  label: string;
  familyNumbers: number[];
  avs: string;
  mainNorms: string[];
  category: string;
}

const PRODUCT_OPTIONS: ProductOption[] = [
  { id: "cement", label: "Cement, wapno, spoiwa hydrauliczne", familyNumbers: [15], avs: "1+", mainNorms: ["EN 197-1", "EN 459-1"], category: "Spoiwa" },
  { id: "stal", label: "Stal zbrojeniowa / sprężająca", familyNumbers: [16], avs: "1+", mainNorms: ["EN 10080", "EN 10138-1"], category: "Wyroby konstrukcyjne" },
  { id: "okna", label: "Okna, drzwi, bramy", familyNumbers: [2], avs: "1 / 3", mainNorms: ["EN 14351-1", "EN 13241"], category: "Wyroby wykończeniowe" },
  { id: "izolacja", label: "Izolacja termiczna (EPS, wełna, XPS)", familyNumbers: [4], avs: "1 / 3", mainNorms: ["EN 13162", "EN 13163", "EN 13164"], category: "Izolacje" },
  { id: "prefab", label: "Prefabrykaty betonowe", familyNumbers: [1], avs: "1 / 2+", mainNorms: ["EN 13369", "EN 13225"], category: "Wyroby konstrukcyjne" },
  { id: "drewno", label: "Drewno konstrukcyjne / klejone", familyNumbers: [13], avs: "1 / 2+", mainNorms: ["EN 14081-1", "EN 14080"], category: "Wyroby konstrukcyjne" },
  { id: "metal", label: "Metalowe wyroby konstrukcyjne", familyNumbers: [20], avs: "1 / 2+", mainNorms: ["EN 1090-1", "EN 10025-1"], category: "Wyroby konstrukcyjne" },
  { id: "murowe", label: "Wyroby murowe (cegły, bloczki)", familyNumbers: [17], avs: "2+ / 4", mainNorms: ["EN 771-1", "EN 998-1"], category: "Wyroby konstrukcyjne" },
  { id: "kruszywa", label: "Kruszywa", familyNumbers: [24], avs: "2+", mainNorms: ["EN 12620", "EN 13043"], category: "Kruszywa" },
  { id: "pokrycia", label: "Pokrycia dachowe", familyNumbers: [22], avs: "3 / 4", mainNorms: ["EN 490", "EN 1304", "EN 544"], category: "Wyroby dachowe" },
  { id: "podlogi", label: "Podłogi i posadzki", familyNumbers: [19], avs: "3 / 4", mainNorms: ["EN 14041", "EN 14342"], category: "Wyroby wykończeniowe" },
  { id: "szklo", label: "Szkło budowlane", familyNumbers: [30], avs: "3 / 4", mainNorms: ["EN 572-1", "EN 1279-1"], category: "Szkło" },
  { id: "gips", label: "Wyroby gipsowe", familyNumbers: [7], avs: "3 / 4", mainNorms: ["EN 520", "EN 13279-1"], category: "Wyroby wykończeniowe" },
  { id: "membrany", label: "Membrany hydroizolacyjne", familyNumbers: [3], avs: "3 / 4", mainNorms: ["EN 13956", "EN 13967"], category: "Hydroizolacje" },
  { id: "kable", label: "Kable elektroenergetyczne", familyNumbers: [31], avs: "3", mainNorms: ["EN 50575"], category: "Elektryczne" },
  { id: "ppoz", label: "Ochrona przeciwpożarowa (bierna/czynna)", familyNumbers: [10, 35], avs: "1", mainNorms: ["EN 54-1", "EN 1366-1"], category: "Ochrona przeciwpożarowa" },
  { id: "woda", label: "Wyroby w kontakcie z wodą pitną", familyNumbers: [29], avs: "1 / 3", mainNorms: ["EN 1452-1", "EN 12201-1"], category: "Instalacyjne" },
  { id: "kleje", label: "Kleje budowlane", familyNumbers: [25], avs: "3 / 4", mainNorms: ["EN 12004-1"], category: "Chemia budowlana" },
  { id: "tynki", label: "Tynki, okładziny ścienne", familyNumbers: [21], avs: "3 / 4", mainNorms: ["EN 998-1", "EN 15824"], category: "Wyroby wykończeniowe" },
  { id: "kanalizacja", label: "Kanalizacja / rury", familyNumbers: [18, 28], avs: "3 / 4", mainNorms: ["EN 1401-1", "EN 1555-1"], category: "Instalacyjne" },
  { id: "inne", label: "Inny wyrób budowlany", familyNumbers: [], avs: "?", mainNorms: [], category: "Inne" },
];

type MarketScope = "ue" | "polska" | "eksport";
type CompanySize = "mikro" | "msp" | "duza";
type HasExistingCert = "tak-305" | "tak-cpr2024" | "nie";

interface WizardState {
  step: number;
  product: ProductOption | null;
  market: MarketScope | null;
  companySize: CompanySize | null;
  hasCert: HasExistingCert | null;
  hasZkp: boolean | null;
  needsFireResistance: boolean | null;
}

// ────────────────────────────────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────────────────────────────────

function getAvsLevel(product: ProductOption, needsFire: boolean | null): string {
  if (product.id === "inne") return "Skontaktuj się z ekspertem";
  if (needsFire && ["okna", "izolacja"].includes(product.id)) return "1";
  return product.avs.split(" / ")[0];
}

function needsNotifiedBody(avs: string): boolean {
  return ["1+", "1", "2+"].includes(avs);
}

interface ChecklistItem {
  step: number;
  title: string;
  description: string;
  link?: { label: string; to: string };
  duration?: string;
  critical?: boolean;
}

function generateChecklist(state: WizardState): ChecklistItem[] {
  const product = state.product!;
  const avs = getAvsLevel(product, state.needsFireResistance);
  const items: ChecklistItem[] = [];
  let stepNum = 1;

  // 1. Identify norm
  items.push({
    step: stepNum++,
    title: "Zidentyfikuj obowiązującą normę hEN (stary system, nadal aktualny)",
    description: `Twój wyrób podlega aktualnie normom: ${product.mainNorms.join(", ") || "skonsultuj z ekspertem"}. To są istniejące normy hEN wg CPR 305/2011 — nadal obowiązują do czasu publikacji nowych hTS pod CPR 2024. Sprawdź Załącznik ZA normy, aby ustalić wymagane właściwości do zadeklarowania w DoP.`,
    link: product.familyNumbers.length > 0
      ? { label: "Sprawdź w katalogu wyrobów", to: "/wyroby" }
      : undefined,
  });

  // 2. Set up ZKP
  if (state.hasZkp === false || state.hasZkp === null) {
    items.push({
      step: stepNum++,
      title: "Wdróż Zakładową Kontrolę Produkcji (ZKP / FPC)",
      description:
        "System ZKP musi obejmować: kontrolę surowców, monitorowanie produkcji, badania wyrobu gotowego, kalibrację sprzętu i zarządzanie reklamacjami. Dokumentuj wszystkie procedury.",
      link: { label: "Pobierz szablon ZKP", to: "/documents" },
      duration: "4-8 tygodni",
      critical: true,
    });
  }

  // 3. ITT (Initial Type Testing)
  if (["1+", "1", "3"].includes(avs)) {
    items.push({
      step: stepNum++,
      title: avs === "3"
        ? "Zlec badania typu (ITT) w laboratorium JN"
        : "Zlec badania typu (ITT) w akredytowanym laboratorium JN",
      description: `W systemie AVS ${avs} badania typu muszą być wykonane ${avs === "3" ? "przez laboratorium jednostki notyfikowanej" : "pod nadzorem jednostki notyfikowanej"}. Badania obejmują właściwości wymienione w Załączniku ZA normy: ${product.mainNorms[0] || ""}.`,
      duration: "4-12 tygodni",
      critical: true,
    });
  } else if (avs === "4") {
    items.push({
      step: stepNum++,
      title: "Wykonaj badania typu (ITT) samodzielnie lub w laboratorium",
      description:
        "W systemie AVS 4 producent sam odpowiada za badania. Możesz zlecić je laboratorium lub wykonać samodzielnie, pod warunkiem posiadania odpowiedniego sprzętu i kompetencji.",
      duration: "2-6 tygodni",
    });
  }

  // 4. Notified Body certification
  if (["1+", "1"].includes(avs)) {
    items.push({
      step: stepNum++,
      title: "Uzyskaj certyfikat od Jednostki Notyfikowanej (JN)",
      description: `System AVS ${avs} wymaga certyfikatu stałości właściwości użytkowych wydanego przez JN. ${avs === "1+" ? "JN przeprowadzi również inspekcję wstępną zakładu i próbki wyrobu." : "JN oceni dokumentację techniczną i wyniki badań."}`,
      link: { label: "Jak wybrać JN", to: "/faq" },
      duration: "2-4 tygodnie",
      critical: true,
    });
  } else if (avs === "2+") {
    items.push({
      step: stepNum++,
      title: "Uzyskaj certyfikat ZKP od Jednostki Notyfikowanej",
      description:
        "W systemie AVS 2+ JN certyfikuje Twój system ZKP (nie wyrób). JN przeprowadzi inspekcję wstępną, a następnie nadzór okresowy (co 12-24 miesiące).",
      duration: "2-4 tygodnie",
      critical: true,
    });
  }

  // 5. DoP&C
  items.push({
    step: stepNum++,
    title: "Teraz: wystaw DoP (stary system) | Docelowo: DoP&C",
    description:
      "Do czasu publikacji hTS dla Twojej rodziny wyrobów wystawiaj Deklarację Właściwości Użytkowych (DoP) wg CPR 305/2011 na dotychczasowych zasadach. DoP&C zastąpi DoP dopiero po wejściu w życie właściwej hTS — na marzec 2026 żadna hTS nie została jeszcze opublikowana. Już teraz możesz zapoznać się z wymaganiami przyszłego DoP&C (Załącznik III CPR 2024) i przygotować dokumentację ZKP.",
    link: { label: "Pobierz szablon DoP i DoP&C", to: "/documents" },
    critical: true,
  });

  // 6. CE marking
  items.push({
    step: stepNum++,
    title: "Umieść oznakowanie CE na wyrobie",
    description: `Oznakowanie CE musi zawierać: litery CE (min. 5 mm), ${needsNotifiedBody(avs) ? "numer JN, " : ""}nazwę producenta, rok pierwszego oznakowania, numer DoP&C i deklarowane właściwości.`,
    link: { label: "Wygeneruj etykietę CE", to: "/generator-ce" },
  });

  // 7. SVHC check
  items.push({
    step: stepNum++,
    title: "Sprawdź obecność substancji SVHC",
    description:
      "Zweryfikuj, czy wyrób zawiera substancje wzbudzające szczególnie duże obawy (SVHC z listy REACH) >0,1% masy. Informacja musi znaleźć się w DoP&C.",
  });

  // 8. Transition from old cert
  if (state.hasCert === "tak-305") {
    items.push({
      step: stepNum++,
      title: "Zaktualizuj dokumentację z CPR 305/2011 na CPR 2024",
      description:
        "Przygotuj się na przejście: gdy zostanie opublikowana hTS dla Twojej rodziny wyrobów, będziesz musiał zamienić starą DoP na nową DoP&C i zaktualizować oznakowanie CE zgodnie z art. 20. Już teraz możesz dostosowywać dokumentację ZKP. Istniejące certyfikaty JN mogą być podstawą do uproszczonej procedury.",
      critical: true,
    });
  }

  // 9. Microsized simplifications
  if (state.companySize === "mikro") {
    items.push({
      step: stepNum++,
      title: "Skorzystaj z uproszczeń dla mikroprzedsiębiorstw (art. 8)",
      description:
        "Jako mikroprzedsiębiorstwo możesz: stosować uproszczone procedury oceny, korzystać z uproszczonej dokumentacji technicznej. Skonsultuj szczegóły z JN.",
    });
  }

  // 10. Market surveillance
  items.push({
    step: stepNum++,
    title: "Przygotuj się na nadzór rynku",
    description:
      "Przechowuj dokumentację techniczną przez 10 lat. Bądź gotowy udostępnić DoP&C, certyfikaty i dokumentację ZKP na żądanie organów nadzoru (GUNB/WINB).",
  });

  return items;
}

// ────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ────────────────────────────────────────────────────────────────────────────

const TOTAL_STEPS = 6;

export default function CeWizard() {
  const navigate = useNavigate();
  const [state, setState] = useState<WizardState>({
    step: 1,
    product: null,
    market: null,
    companySize: null,
    hasCert: null,
    hasZkp: null,
    needsFireResistance: null,
  });

  const setField = <K extends keyof WizardState>(key: K, value: WizardState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const next = () => setState((prev) => ({ ...prev, step: Math.min(prev.step + 1, TOTAL_STEPS + 1) }));
  const prev = () => setState((prev) => ({ ...prev, step: Math.max(prev.step - 1, 1) }));
  const reset = () =>
    setState({ step: 1, product: null, market: null, companySize: null, hasCert: null, hasZkp: null, needsFireResistance: null });

  const canProceed = (): boolean => {
    switch (state.step) {
      case 1: return state.product !== null;
      case 2: return state.market !== null;
      case 3: return state.companySize !== null;
      case 4: return state.hasCert !== null;
      case 5: return state.hasZkp !== null;
      case 6: return state.needsFireResistance !== null;
      default: return false;
    }
  };

  // Skip fire question for products where it's not relevant
  const showFireStep = state.product && ["okna", "izolacja", "szklo", "fasady"].includes(state.product.id);
  const effectiveTotalSteps = showFireStep ? TOTAL_STEPS : TOTAL_STEPS - 1;
  const isLastQuestion = showFireStep ? state.step === TOTAL_STEPS : state.step === TOTAL_STEPS - 1;
  const isResult = showFireStep ? state.step > TOTAL_STEPS : state.step > TOTAL_STEPS - 1;

  const handleNext = () => {
    if (isLastQuestion) {
      // Go to results
      setState((prev) => ({ ...prev, step: TOTAL_STEPS + 1 }));
    } else if (state.step === 5 && !showFireStep) {
      // Skip fire step, go to results
      setState((prev) => ({ ...prev, step: TOTAL_STEPS + 1, needsFireResistance: false }));
    } else {
      next();
    }
  };

  const pageTitle = "Ścieżka do CE — kreator certyfikacji CPR 2024 | NowyCPR.pl";

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content="Interaktywny kreator ścieżki do oznakowania CE wyrobu budowlanego wg CPR 2024/3110. Odpowiedz na 5 pytań i otrzymaj spersonalizowaną checklistę." />
        <link rel="canonical" href="https://www.nowycpr.pl/sciezka-ce/" />
      </Helmet>
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <main id="main-content" className="flex-grow">
          <PageHeader />

          <Container>
            {!isResult ? (
              <>
                {/* Progress bar */}
                <div className="flex items-center gap-2 mb-8">
                  {Array.from({ length: effectiveTotalSteps }, (_, i) => (
                    <div key={i} className="flex items-center gap-2 flex-1">
                      <div className={`w-full h-1.5 rounded-full transition-all duration-300 ${i + 1 <= state.step ? "bg-[oklch(55%_.22_27)]" : "bg-slate-200"}`} />
                    </div>
                  ))}
                  <span className="text-xs text-slate-500 shrink-0 ml-2">
                    {state.step}/{effectiveTotalSteps}
                  </span>
                </div>

                {/* Questions */}
                <div className="max-w-2xl mx-auto">
                  {/* Step 1: Product */}
                  {state.step === 1 && (
                    <div>
                      {/* Upfront hTS warning */}
                      <div className="flex items-start gap-3 p-4 rounded-[2px] bg-[oklch(55%_.22_27)]/8 border border-[oklch(55%_.22_27)]/25 mb-6">
                        <AlertTriangle className="w-5 h-5 text-[oklch(55%_.22_27)] shrink-0 mt-0.5" />
                        <div className="text-sm text-slate-700 leading-relaxed">
                          <strong className="text-[oklch(55%_.22_27)]">Na marzec 2026 żadne nowe normy zharmonizowane (hTS) pod CPR 2024 nie zostały opublikowane.</strong>{" "}
                          Obowiązują nadal stare normy hEN i system AVCP/certyfikacji wg CPR 305/2011.
                          Kreator pokazuje <strong>docelową ścieżkę wg CPR 2024</strong> — pomaga przygotować się na zmiany, które wejdą w życie po publikacji hTS (najwcześniej 2027–2029).
                        </div>
                      </div>
                      <h2 className="text-xl font-semibold text-[oklch(20%_.03_264)] mb-2 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-[oklch(55%_.22_27)]" />
                        Co produkujesz?
                      </h2>
                      <p className="text-slate-500 text-sm mb-6">Wybierz rodzaj wyrobu budowlanego.</p>
                      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                        {PRODUCT_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setField("product", opt)}
                            className={`w-full text-left p-4 rounded-[2px] border transition-all duration-200 ${
                              state.product?.id === opt.id
                                ? "bg-[oklch(55%_.22_27)]/10 border-[oklch(55%_.22_27)]/40 text-[oklch(20%_.03_264)]"
                                : "bg-white border-slate-200 text-slate-700 hover:border-[oklch(55%_.22_27)]/30 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">{opt.label}</span>
                              {opt.avs !== "?" && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                                  AVS {opt.avs}
                                </span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Market */}
                  {state.step === 2 && (
                    <div>
                      <h2 className="text-xl font-semibold text-[oklch(20%_.03_264)] mb-2 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-[oklch(55%_.22_27)]" />
                        Gdzie sprzedajesz wyrób?
                      </h2>
                      <p className="text-slate-500 text-sm mb-6">Zakres rynku określony w CPR.</p>
                      <div className="space-y-3">
                        {([
                          { value: "ue" as MarketScope, label: "Rynek UE / EOG", desc: "Sprzedaż na terenie Unii Europejskiej lub Europejskiego Obszaru Gospodarczego" },
                          { value: "polska" as MarketScope, label: "Tylko Polska", desc: "Sprzedaż wyłącznie na rynku krajowym (nadal obowiązuje CPR)" },
                          { value: "eksport" as MarketScope, label: "Eksport poza UE", desc: "Sprzedaż poza UE — CE wymagane tylko jeśli wyrób trafia też na rynek UE" },
                        ]).map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setField("market", opt.value)}
                            className={`w-full text-left p-4 rounded-[2px] border transition-all duration-200 ${
                              state.market === opt.value
                                ? "bg-[oklch(55%_.22_27)]/10 border-[oklch(55%_.22_27)]/40"
                                : "bg-white border-slate-200 hover:border-[oklch(55%_.22_27)]/30"
                            }`}
                          >
                            <div className="font-medium text-sm text-[oklch(20%_.03_264)]">{opt.label}</div>
                            <div className="text-xs text-slate-500 mt-1">{opt.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Company size */}
                  {state.step === 3 && (
                    <div>
                      <h2 className="text-xl font-semibold text-[oklch(20%_.03_264)] mb-2 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-[oklch(55%_.22_27)]" />
                        Jaka jest wielkość Twojej firmy?
                      </h2>
                      <p className="text-slate-500 text-sm mb-6">Mikroprzedsiębiorstwa mogą korzystać z uproszczeń.</p>
                      <div className="space-y-3">
                        {([
                          { value: "mikro" as CompanySize, label: "Mikroprzedsiębiorstwo", desc: "<10 pracowników, obroty <2 mln EUR" },
                          { value: "msp" as CompanySize, label: "Małe / średnie przedsiębiorstwo", desc: "10-250 pracowników" },
                          { value: "duza" as CompanySize, label: "Duże przedsiębiorstwo", desc: ">250 pracowników" },
                        ]).map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setField("companySize", opt.value)}
                            className={`w-full text-left p-4 rounded-[2px] border transition-all duration-200 ${
                              state.companySize === opt.value
                                ? "bg-[oklch(55%_.22_27)]/10 border-[oklch(55%_.22_27)]/40"
                                : "bg-white border-slate-200 hover:border-[oklch(55%_.22_27)]/30"
                            }`}
                          >
                            <div className="font-medium text-sm text-[oklch(20%_.03_264)]">{opt.label}</div>
                            <div className="text-xs text-slate-500 mt-1">{opt.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 4: Existing cert */}
                  {state.step === 4 && (
                    <div>
                      <h2 className="text-xl font-semibold text-[oklch(20%_.03_264)] mb-2 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-[oklch(55%_.22_27)]" />
                        Czy posiadasz certyfikat?
                      </h2>
                      <p className="text-slate-500 text-sm mb-6">Istniejące certyfikaty mogą uprościć przejście na CPR 2024.</p>
                      <div className="space-y-3">
                        {([
                          { value: "tak-305" as HasExistingCert, label: "Tak, certyfikat wg CPR 305/2011 (stary system)", desc: "Posiadam certyfikat AVCP / hEN wydany na podstawie CPR 305/2011" },
                          { value: "nie" as HasExistingCert, label: "Nie, to nowy wyrób (certyfikuję po raz pierwszy)", desc: "Pierwszy raz certyfikuję ten wyrób lub wchodzę na nowy rynek" },
                        ]).map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setField("hasCert", opt.value)}
                            className={`w-full text-left p-4 rounded-[2px] border transition-all duration-200 ${
                              state.hasCert === opt.value
                                ? "bg-[oklch(55%_.22_27)]/10 border-[oklch(55%_.22_27)]/40"
                                : "bg-white border-slate-200 hover:border-[oklch(55%_.22_27)]/30"
                            }`}
                          >
                            <div className="font-medium text-sm text-[oklch(20%_.03_264)]">{opt.label}</div>
                            <div className="text-xs text-slate-500 mt-1">{opt.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 5: ZKP */}
                  {state.step === 5 && (
                    <div>
                      <h2 className="text-xl font-semibold text-[oklch(20%_.03_264)] mb-2 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[oklch(55%_.22_27)]" />
                        Czy masz wdrożony system ZKP (FPC)?
                      </h2>
                      <p className="text-slate-500 text-sm mb-6">Zakładowa Kontrola Produkcji jest obowiązkowa dla wszystkich systemów AVS.</p>
                      <div className="space-y-3">
                        {([
                          { value: true, label: "Tak", desc: "Mam udokumentowany system ZKP" },
                          { value: false, label: "Nie / nie wiem", desc: "Nie mam ZKP lub nie jestem pewien" },
                        ]).map((opt) => (
                          <button
                            key={String(opt.value)}
                            onClick={() => setField("hasZkp", opt.value)}
                            className={`w-full text-left p-4 rounded-[2px] border transition-all duration-200 ${
                              state.hasZkp === opt.value
                                ? "bg-[oklch(55%_.22_27)]/10 border-[oklch(55%_.22_27)]/40"
                                : "bg-white border-slate-200 hover:border-[oklch(55%_.22_27)]/30"
                            }`}
                          >
                            <div className="font-medium text-sm text-[oklch(20%_.03_264)]">{opt.label}</div>
                            <div className="text-xs text-slate-500 mt-1">{opt.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 6: Fire resistance (conditional) */}
                  {state.step === 6 && showFireStep && (
                    <div>
                      <h2 className="text-xl font-semibold text-[oklch(20%_.03_264)] mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-[oklch(55%_.22_27)]" />
                        Czy wyrób wymaga odporności ogniowej?
                      </h2>
                      <p className="text-slate-500 text-sm mb-6">Wyroby z deklarowaną odpornością ogniową wymagają systemu AVS 1.</p>
                      <div className="space-y-3">
                        {([
                          { value: true, label: "Tak", desc: "Wyrób ma deklarowaną odporność ogniową (EI, REI, EW)" },
                          { value: false, label: "Nie", desc: "Wyrób nie wymaga deklaracji odporności ogniowej" },
                        ]).map((opt) => (
                          <button
                            key={String(opt.value)}
                            onClick={() => setField("needsFireResistance", opt.value)}
                            className={`w-full text-left p-4 rounded-[2px] border transition-all duration-200 ${
                              state.needsFireResistance === opt.value
                                ? "bg-[oklch(55%_.22_27)]/10 border-[oklch(55%_.22_27)]/40"
                                : "bg-white border-slate-200 hover:border-[oklch(55%_.22_27)]/30"
                            }`}
                          >
                            <div className="font-medium text-sm text-[oklch(20%_.03_264)]">{opt.label}</div>
                            <div className="text-xs text-slate-500 mt-1">{opt.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-8">
                    <button
                      onClick={state.step === 1 ? () => navigate("/") : prev}
                      className="flex items-center gap-2 text-slate-500 hover:text-[oklch(20%_.03_264)] transition-colors text-sm"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      {state.step === 1 ? "Strona główna" : "Wstecz"}
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={!canProceed()}
                      className={`flex items-center gap-2 px-6 py-3 rounded-[2px] font-semibold text-sm transition-all ${
                        canProceed()
                          ? "bg-[oklch(55%_.22_27)] text-white hover:bg-[#1a3d6b]"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      {isLastQuestion ? "Pokaż checklistę" : "Dalej"}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* ── RESULTS ── */
              <div>
                {/* Summary header */}
                <div className="bg-slate-50 border border-slate-200 rounded-[2px] p-6 mb-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-[oklch(20%_.03_264)] mb-2">Twoja ścieżka do CE</h2>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs px-3 py-1 rounded-full bg-[oklch(55%_.22_27)]/10 border border-[oklch(55%_.22_27)]/30 text-[oklch(55%_.22_27)] font-bold">
                          {state.product!.label}
                        </span>
                        <span className="text-xs px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
                          AVS {getAvsLevel(state.product!, state.needsFireResistance)}
                        </span>
                        {needsNotifiedBody(getAvsLevel(state.product!, state.needsFireResistance)) && (
                          <span className="text-xs px-3 py-1 rounded-full bg-[oklch(55%_.22_27)]/10 border border-[oklch(55%_.22_27)]/20 text-[oklch(55%_.22_27)]">
                            Wymaga JN
                          </span>
                        )}
                        {state.companySize === "mikro" && (
                          <span className="text-xs px-3 py-1 rounded-full bg-[oklch(55%_.22_27)]/10 border border-[oklch(55%_.22_27)]/20 text-[oklch(55%_.22_27)]">
                            Uproszczenia Art. 8
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={reset}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-500 hover:text-[oklch(20%_.03_264)] border border-slate-200 rounded-[2px] hover:border-slate-300 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Zacznij od nowa
                    </button>
                  </div>
                </div>

                {/* hTS disclaimer */}
                <div className="flex items-start gap-3 p-4 rounded-[2px] bg-[oklch(55%_.22_27)]/5 border border-[oklch(55%_.22_27)]/20 mb-6">
                  <AlertTriangle className="w-5 h-5 text-[oklch(55%_.22_27)] shrink-0 mt-0.5" />
                  <div className="text-sm text-slate-700 leading-relaxed">
                    <strong className="text-[oklch(55%_.22_27)]">Ważne:</strong> Poniższe kroki opisują docelowy proces według CPR 2024. Nowe obowiązki (DoP&C, AVS, nowe oznakowanie CE) wchodzą w życie <strong>dopiero po opublikowaniu zharmonizowanych specyfikacji technicznych (hTS)</strong> dla danej rodziny wyrobów. Do tego czasu stosuj dotychczasowe normy hEN i system AVCP. Checklista pomoże Ci przygotować się na nadchodzące zmiany.
                  </div>
                </div>

                {/* Checklist */}
                <div className="space-y-4">
                  {generateChecklist(state).map((item) => (
                    <div
                      key={item.step}
                      className={`relative pl-12 py-4 pr-5 rounded-[2px] border transition-all ${
                        item.critical
                          ? "bg-[oklch(55%_.22_27)]/5 border-[oklch(55%_.22_27)]/20"
                          : "bg-white border-slate-200"
                      }`}
                    >
                      {/* Step number */}
                      <div className="absolute left-4 top-4 w-6 h-6 rounded-full bg-[oklch(55%_.22_27)]/15 flex items-center justify-center">
                        <span className="text-xs font-bold text-[oklch(55%_.22_27)]">{item.step}</span>
                      </div>

                      <h3 className="font-semibold text-[oklch(20%_.03_264)] text-sm mb-1.5 flex items-center gap-2">
                        {item.title}
                        {item.critical && <AlertTriangle className="w-3.5 h-3.5 text-[oklch(55%_.22_27)]" />}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>

                      <div className="flex items-center gap-4 mt-3 flex-wrap">
                        {item.duration && (
                          <span className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Clock className="w-3 h-3" />
                            {item.duration}
                          </span>
                        )}
                        {item.link && (
                          <Link
                            to={item.link.to}
                            className="flex items-center gap-1.5 text-xs text-[oklch(55%_.22_27)] hover:text-[#1a3d6b] transition-colors"
                          >
                            {item.link.label}
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link
                    to="/documents"
                    className="flex items-center gap-3 p-4 rounded-[2px] bg-white border border-slate-200 hover:border-[oklch(55%_.22_27)]/30 hover:shadow-sm transition-all group"
                  >
                    <Download className="w-5 h-5 text-[oklch(55%_.22_27)]" />
                    <div>
                      <div className="text-sm font-semibold text-[oklch(20%_.03_264)] group-hover:text-[oklch(55%_.22_27)] transition-colors">Pobierz szablony</div>
                      <div className="text-xs text-slate-500">DoP&C, ZKP, checklista</div>
                    </div>
                  </Link>
                  <Link
                    to="/generator-ce"
                    className="flex items-center gap-3 p-4 rounded-[2px] bg-white border border-slate-200 hover:border-[oklch(55%_.22_27)]/30 hover:shadow-sm transition-all group"
                  >
                    <FileText className="w-5 h-5 text-[oklch(55%_.22_27)]" />
                    <div>
                      <div className="text-sm font-semibold text-[oklch(20%_.03_264)] group-hover:text-[oklch(55%_.22_27)] transition-colors">Generator etykiety CE</div>
                      <div className="text-xs text-slate-500">Wygeneruj oznakowanie</div>
                    </div>
                  </Link>
                  <Link
                    to="/services"
                    className="flex items-center gap-3 p-4 rounded-[2px] bg-[oklch(20%_.03_264)] border border-[oklch(20% .03 264)] hover:bg-[#1a3d6b] transition-all group"
                  >
                    <Newspaper className="w-5 h-5 text-white" />
                    <div>
                      <div className="text-sm font-semibold text-white">Pomoc eksperta</div>
                      <div className="text-xs text-slate-300">Multicert Sp. z o.o.</div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </Container>
        </main>
        <RelatedPages />
        <Footer />
      </div>
    </>
  );
}
