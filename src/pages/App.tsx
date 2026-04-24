import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { getAllPosts as getBlogPosts } from "../utils/blogLoader";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useNavigate, Link } from "react-router-dom";
import { useCountUp } from "../hooks/useCountUp";
import { useReveal } from "../hooks/useReveal";
import {
  Search,
  FileText,
  Award,
  Calendar,
  ListChecks,
  ArrowRight,
  ChevronRight,
  Building2,
  Shield,
  Clock,
  BookOpen,
  TrendingUp,
  Users,
  CheckCircle2,
  Info,
  ClipboardList
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published_at: string;
  category: string;
  image_url?: string;
}

function StatCounter({ value, label, icon: Icon }: { value: string; label: string; icon: React.ElementType }) {
  const num = parseInt(value.replace(/\D/g, ""), 10);
  const suffix = value.replace(/^\d+/, "");
  const { count, triggerRef } = useCountUp(num, 1400);
  return (
    <div ref={triggerRef as React.RefCallback<HTMLDivElement>} className="text-center">
      <Icon className="w-5 h-5 mx-auto mb-2 text-white/70" />
      <div className="text-2xl md:text-3xl font-bold text-white">
        {count}{suffix}
      </div>
      <div className="text-sm text-white/70 mt-1">{label}</div>
    </div>
  );
}

function EditorialStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <div
        className="text-[3.25rem] md:text-[4rem] leading-none tracking-[-0.03em]"
        style={{ color: "oklch(20% .03 264)", fontFamily: '"Schibsted Grotesk", system-ui, sans-serif', fontWeight: 500 }}
      >
        {value}
      </div>
      <div className="editorial-kicker mt-2">{label}</div>
    </div>
  );
}

const ROTATING_PHRASES = [
  "beton i prefabrykaty",
  "okna i drzwi",
  "wyroby izolacyjne",
  "kruszywa budowlane",
  "konstrukcje stalowe",
  "cement i spoiwa",
  "rury i złączki",
  "wyroby ceramiczne",
];

function useRotatingText(phrases: string[], intervalMs = 3000) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(i => (i + 1) % phrases.length);
        setVisible(true);
      }, 400);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [phrases.length, intervalMs]);

  return { text: phrases[index], visible };
}

function HomePage() {
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const aboutRef = useReveal();
  const featuresRef = useReveal();
  const blogRef = useReveal();
  const rotating = useRotatingText(ROTATING_PHRASES);

  // Fetch latest blog posts from markdown files
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await getBlogPosts();
        // Show 3 newest articles on homepage
        setBlogPosts(allPosts.slice(0, 3));
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const canonicalUrl = "https://www.nowycpr.pl/";
  const pageTitle = "CPR 2024/3110 dla wyrobów budowlanych — wymagania, DoP&C, CE | NowyCPR.pl";
  const pageDesc =
    "NowyCPR.pl wyjaśnia wymagania CPR 2024/3110 dla wyrobów budowlanych: DoP&C, oznakowanie CE, AVS, FPC, GWP, EPD, DPP, importerzy i dystrybutorzy.";
  const pageKeywords =
    "CPR 2024/3110, rozporządzenie CPR, wyroby budowlane, DoP&C, oznakowanie CE, AVS, FPC, GWP, EPD, DPP, certyfikacja wyrobów budowlanych";
  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "NowyCPR.pl",
    "url": canonicalUrl,
    "inLanguage": "pl-PL",
    "publisher": {
      "@type": "Organization",
      "name": "Multicert Sp. z o.o.",
      "url": "https://www.multicert.pl"
    },
    "description": pageDesc,
    "keywords": pageKeywords,
    "about": [
      { "@type": "Thing", "name": "Rozporządzenie (UE) 2024/3110" },
      { "@type": "Thing", "name": "Deklaracja Właściwości Użytkowych i Zgodności" },
      { "@type": "Thing", "name": "Oznakowanie CE wyrobów budowlanych" },
      { "@type": "Thing", "name": "Systemy AVS" },
      { "@type": "Thing", "name": "Cyfrowy Paszport Produktu" }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen section-paper">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="keywords" content={pageKeywords} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify(homeSchema)}
        </script>
      </Helmet>
      <Header />

      <main className="flex-grow">
        {/* Editorial Hero — Multicert brand system */}
        <section className="relative pt-16 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-white">
          {/* Thin top rule — masthead */}

          {/* Brand-red kreska akcentu — sygnatura Multicert */}

          <Container>
            <div className="relative z-10 max-w-6xl mx-auto">
              {/* Masthead metadata row */}
              <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.18em] font-semibold mb-10 md:mb-14 animate-fade-in-up" style={{ color: "oklch(20% .03 264)" }}>
                <span>NowyCPR · Wydanie #04 · Kwiecień 2026</span>
                <span className="hidden sm:inline" style={{ color: "oklch(60% .015 264)" }}>Portal regulacyjny dla wyrobów budowlanych</span>
                <span style={{ color: "oklch(55% .22 27)" }}>Stan: obowiązuje od 8·I·2026</span>
              </div>

              {/* Main hero grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Left: oversized numeral */}
                <div className="lg:col-span-4 animate-fade-in-up">
                  <div className="editorial-kicker mb-4" style={{ color: "oklch(55% .22 27)" }}>ROZPORZĄDZENIE</div>
                  <div className="editorial-numeral text-[7rem] md:text-[8.5rem] lg:text-[10rem] leading-[0.8]" style={{ color: "oklch(20% .03 264)" }}>
                    2024
                  </div>
                  <div className="editorial-numeral text-4xl md:text-5xl mt-3" style={{ color: "oklch(55% .22 27)" }}>/3110</div>
                  <div className="mt-8 flex items-center gap-3 text-sm">
                    <div className="h-px flex-1" style={{ backgroundColor: "oklch(86% .012 264)" }} />
                    <span className="editorial-kicker">UE · EUR-Lex</span>
                  </div>
                  <p className="mt-6 text-sm leading-relaxed max-w-xs" style={{ color: "oklch(42% .02 264)" }}>
                    Rozporządzenie Parlamentu Europejskiego i Rady ustanawiające zharmonizowane warunki wprowadzania do obrotu wyrobów budowlanych.
                  </p>
                </div>

                {/* Right: title + lede + CTA */}
                <div className="lg:col-span-8 animate-fade-in-up-delay-1">
                  <h1 className="font-serif text-[3rem] md:text-[4rem] lg:text-[5.5rem] leading-[0.95] mb-8" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>
                    Nowy CPR —<br/>
                    <span className="italic" style={{ color: "oklch(55% .22 27)", fontWeight: 500 }}>co i kiedy</span><br/>
                    Cię dotyczy?
                  </h1>

                  <p className="drop-cap text-lg md:text-xl leading-[1.6] max-w-2xl mb-6" style={{ color: "oklch(42% .02 264)" }}>
                    Od 8 stycznia 2026 obowiązuje nowe Rozporządzenie (EU) 2024/3110. Ramy prawne wchodzą teraz, ale GWP, EPD i paszport produktu pojawią się oddzielnie dla każdej grupy wyrobów — razem z nowymi hTS. Sprawdź co dotyczy{" "}
                    <span
                      className="inline-block font-serif italic transition-all duration-400"
                      style={{
                        color: "oklch(55% .22 27)",
                        opacity: rotating.visible ? 1 : 0,
                        transform: rotating.visible ? "translateY(0)" : "translateY(6px)",
                        fontWeight: 500,
                      }}
                    >
                      {rotating.text}
                    </span>
                    .
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <Button
                      size="lg"
                      asChild
                      className="text-white font-semibold px-8 py-6 transition-colors hover:opacity-90"
                      style={{ backgroundColor: "oklch(20% .03 264)", borderRadius: "2px" }}
                    >
                      <Link to="/wyszukiwarka" className="inline-flex items-center gap-2 whitespace-nowrap">
                        <span>Sprawdź wymagania</span>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </Link>
                    </Button>
                    <Button
                      size="lg"
                      asChild
                      className="bg-transparent font-semibold px-8 py-6 transition-colors hover:bg-slate-50"
                      style={{ color: "oklch(20% .03 264)", border: "1px solid oklch(20% .03 264)", borderRadius: "2px" }}
                    >
                      <Link to="/documents">
                        Dokumenty źródłowe
                      </Link>
                    </Button>
                  </div>

                  {/* Stats in editorial row */}
                  <div className="mt-14 pt-8 grid grid-cols-3 gap-6 md:gap-10" style={{ borderTop: "1px solid oklch(86% .012 264)" }}>
                    <EditorialStat value="2026" label="Rok stosowania" />
                    <EditorialStat value="27" label="Krajów UE" />
                    <EditorialStat value="2028+" label="Realne GWP · DPP" />
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* About CPR 2024 Section — editorial magazyn */}
        <section ref={aboutRef as React.RefCallback<HTMLElement>} className="py-24 md:py-32 relative reveal bg-white">
          <Container>
            {/* Section label + number */}
            <div className="max-w-6xl mx-auto mb-12 md:mb-16">
              <div className="flex items-baseline gap-6 mb-10">
                <span className="editorial-numeral text-6xl md:text-7xl" style={{ color: "oklch(55% .22 27)", fontWeight: 300 }}>01</span>
                <div className="flex items-center gap-3 pt-4">
                  <div className="h-[2px] w-10" style={{ backgroundColor: "oklch(55% .22 27)" }} />
                  <span className="editorial-kicker">Kontekst regulacyjny</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                <h2 className="lg:col-span-7 font-serif text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] leading-[1] mb-0" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>
                  Czym jest<br/>
                  <span className="italic" style={{ color: "oklch(55% .22 27)", fontWeight: 500 }}>rozporządzenie</span> CPR?
                </h2>
                <div className="lg:col-span-5 lg:pt-6">
                  <p className="drop-cap text-lg md:text-xl leading-[1.65]" style={{ color: "oklch(42% .02 264)" }}>
                    Rozporządzenie w sprawie wyrobów budowlanych ustanawia zharmonizowane warunki wprowadzania do obrotu wyrobów budowlanych w całej Unii Europejskiej, zastępując dotychczasowe przepisy z 2011 roku.
                  </p>
                </div>
              </div>
            </div>

            {/* Pull quote — status key info */}
            <div className="max-w-6xl mx-auto mb-20 md:mb-24">
              <div className="relative py-10 md:py-14" style={{ borderTop: "2px solid oklch(20% .03 264)", borderBottom: "1px solid oklch(86% .012 264)" }}>
                <div className="editorial-kicker absolute -top-3 left-0 bg-white pr-4">
                  Status — {new Date().toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' })}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-7">
                    <p className="font-serif text-2xl md:text-3xl lg:text-[2.25rem] leading-[1.25] italic" style={{ color: "oklch(20% .03 264)", fontWeight: 400 }}>
                      „CPR 2024 obowiązuje od 8 stycznia 2026, ale <span style={{ color: "oklch(55% .22 27)", fontStyle: "normal", fontWeight: 500 }}>GWP, EPD i paszport produktu jeszcze nie są obowiązkowe</span> — i nie będą dla nikogo w tym samym momencie."
                    </p>
                  </div>
                  <div className="lg:col-span-5 lg:border-l lg:pl-8" style={{ borderColor: "oklch(86% .012 264)" }}>
                    <p className="text-base leading-[1.7] mb-4" style={{ color: "oklch(42% .02 264)" }}>
                      Obowiązek wchodzi <strong style={{ color: "oklch(20% .03 264)", fontWeight: 600 }}>oddzielnie dla każdej grupy wyrobów</strong>, dopiero gdy CEN opublikuje nową normę zharmonizowaną (hTS). Po publikacji jeszcze 12–36 miesięcy okresu przejściowego.
                    </p>
                    <p className="text-base leading-[1.7]" style={{ color: "oklch(42% .02 264)" }}>
                      Na dziś żadna nowa hTS nie wyszła. Pierwsze spodziewane 2027–2029 — realny obowiązek dla większości wyrobów <strong style={{ color: "oklch(55% .22 27)", fontWeight: 600 }}>najwcześniej 2029–2031</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline + Changes — editorial two column */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 mb-20">
              {/* Timeline */}
              <div>
                <div className="flex items-baseline gap-4 mb-8 pb-4" style={{ borderBottom: "2px solid oklch(20% .03 264)" }}>
                  <span className="editorial-numeral text-3xl" style={{ color: "oklch(55% .22 27)" }}>02</span>
                  <h3 className="font-serif text-2xl md:text-3xl" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>
                    Kluczowe <span className="italic" style={{ color: "oklch(55% .22 27)" }}>daty</span>
                  </h3>
                </div>

                <div className="divide-y" style={{ borderColor: "oklch(92% .008 264)" }}>
                  {[
                    { year: "Grudzień 2024", text: "Publikacja rozporządzenia (EU) 2024/3110", done: true },
                    { year: "7·I·2025", text: "Wejście w życie — 20 dni po publikacji w Dz.U. UE", done: true },
                    { year: "8·I·2026", text: "Przepisy ramowe CPR; stare hEN i AVCP nadal obowiązują do publikacji hTS", done: true },
                    { year: "2027–2028+", text: "Pierwsze hTS, DoP&C, system AVS, cyfrowy paszport produktu (DPP)" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-6 items-start py-5" style={{ borderTop: idx === 0 ? "none" : "1px solid oklch(92% .008 264)" }}>
                      <div className="w-32 flex-shrink-0 flex items-center gap-2">
                        <span className="editorial-kicker" style={{ color: item.done ? "oklch(55% .22 27)" : "oklch(60% .015 264)" }}>{item.year}</span>
                      </div>
                      <div className="flex-1 text-sm leading-[1.6]" style={{ color: "oklch(42% .02 264)" }}>{item.text}</div>
                      {item.done && <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "oklch(55% .14 155)" }} />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Changes */}
              <div>
                <div className="flex items-baseline gap-4 mb-8 pb-4" style={{ borderBottom: "2px solid oklch(20% .03 264)" }}>
                  <span className="editorial-numeral text-3xl" style={{ color: "oklch(55% .22 27)" }}>03</span>
                  <h3 className="font-serif text-2xl md:text-3xl" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>
                    Główne <span className="italic" style={{ color: "oklch(55% .22 27)" }}>zmiany</span>
                  </h3>
                </div>

                <div className="space-y-0">
                  {[
                    { text: "Obowiązkowe cyfrowe deklaracje właściwości użytkowych i zgodności (Digital DoP&C)" },
                    { text: "Nowe wymagania środowiskowe i wskaźniki zrównoważonego rozwoju" },
                    { text: "Rozszerzone obowiązki dla producentów, importerów i dystrybutorów" },
                    { text: "Cyfrowy paszport produktu integrujący dokumentację" },
                    { text: "Bardziej rygorystyczne wymagania dotyczące oznakowania CE" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-5 py-5 group" style={{ borderTop: idx === 0 ? "none" : "1px solid oklch(92% .008 264)" }}>
                      <span className="editorial-numeral text-2xl" style={{ color: "oklch(55% .22 27)", fontWeight: 400, minWidth: "2rem" }}>
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 text-base leading-[1.6] pt-1" style={{ color: "oklch(42% .02 264)" }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Banner — editorial */}
            <div className="max-w-6xl mx-auto">
              <div className="relative py-12 md:py-16 px-8 md:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8" style={{ backgroundColor: "oklch(20% .03 264)" }}>
                {/* Brand-red accent corner */}
                <div className="absolute top-0 left-0 h-[5px] w-24" style={{ backgroundColor: "oklch(55% .22 27)" }} />

                <div className="max-w-2xl">
                  <div className="editorial-kicker mb-4" style={{ color: "oklch(55% .22 27)" }}>Wyszukiwarka wymagań</div>
                  <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.05] text-white" style={{ fontWeight: 500 }}>
                    Sprawdź co dotyczy<br/>
                    <span className="italic" style={{ color: "oklch(75% .15 27)", fontWeight: 500 }}>Twojego produktu.</span>
                  </h3>
                </div>
                <Button
                  size="lg"
                  asChild
                  className="flex-shrink-0 bg-white font-semibold px-8 py-6 transition-all hover:bg-slate-100"
                  style={{ color: "oklch(20% .03 264)", borderRadius: "2px" }}
                >
                  <Link to="/wyszukiwarka" className="inline-flex items-center gap-2 whitespace-nowrap">
                    <span>Rozpocznij teraz</span>
                    <ArrowRight className="w-5 h-5 shrink-0" />
                  </Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* Features Section — editorial */}
        <section ref={featuresRef as React.RefCallback<HTMLElement>} className="py-24 md:py-32 reveal" style={{ backgroundColor: "oklch(98% .005 264)" }}>
          <Container>
            <div className="max-w-6xl mx-auto">
              <div className="flex items-baseline gap-6 mb-12">
                <span className="editorial-numeral text-6xl md:text-7xl" style={{ color: "oklch(55% .22 27)", fontWeight: 300 }}>04</span>
                <div className="flex items-center gap-3 pt-4">
                  <div className="h-[2px] w-10" style={{ backgroundColor: "oklch(55% .22 27)" }} />
                  <span className="editorial-kicker">Narzędzia</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-end">
                <h2 className="lg:col-span-8 font-serif text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] leading-[1]" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>
                  Dlaczego<br/>
                  <span className="italic" style={{ color: "oklch(55% .22 27)", fontWeight: 500 }}>NowyCPR</span>?
                </h2>
                <p className="lg:col-span-4 text-base md:text-lg leading-[1.6]" style={{ color: "oklch(42% .02 264)" }}>
                  Kompleksowe wsparcie w przygotowaniu do wymagań rozporządzenia CPR — od weryfikacji wymagań po certyfikację.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-0" style={{ borderTop: "2px solid oklch(20% .03 264)" }}>
                {[
                  {
                    icon: Search,
                    title: "Wyszukiwarka CPR",
                    description: "Szybko znajdź wymagania i normy zharmonizowane dla Twojego produktu budowlanego.",
                    path: "/wyszukiwarka",
                    num: "01"
                  },
                  {
                    icon: FileText,
                    title: "Baza dokumentów",
                    description: "Dostęp do aktualnych dokumentów, wytycznych i norm związanych z CPR.",
                    path: "/documents",
                    num: "02"
                  },
                  {
                    icon: Award,
                    title: "Usługi certyfikacyjne",
                    description: "Profesjonalne wsparcie w procesie certyfikacji i przygotowania dokumentacji.",
                    path: "/services",
                    num: "03"
                  }
                ].map((feature, idx) => (
                  <Link
                    key={idx}
                    to={feature.path}
                    className="group cursor-pointer reveal-stagger block p-8 md:p-10 transition-all hover:bg-white"
                    style={{
                      "--i": idx,
                      borderRight: idx < 2 ? "1px solid oklch(92% .008 264)" : "none",
                      borderBottom: "1px solid oklch(92% .008 264)"
                    } as React.CSSProperties}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <span className="editorial-numeral text-4xl" style={{ color: "oklch(55% .22 27)", fontWeight: 300 }}>{feature.num}</span>
                      <feature.icon className="w-6 h-6 transition-transform group-hover:scale-110" style={{ color: "oklch(20% .03 264)" }} />
                    </div>
                    <h3 className="font-serif text-2xl md:text-3xl mb-4 leading-[1.1]" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>
                      {feature.title}
                    </h3>
                    <p className="text-base leading-[1.6] mb-6" style={{ color: "oklch(42% .02 264)" }}>
                      {feature.description}
                    </p>
                    <div className="editorial-kicker inline-flex items-center gap-2 group-hover:gap-3 transition-all whitespace-nowrap" style={{ color: "oklch(55% .22 27)" }}>
                      <span>Dowiedz się więcej</span>
                      <ChevronRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Latest Blog Posts — editorial magazyn */}
        <section ref={blogRef as React.RefCallback<HTMLElement>} className="py-24 md:py-32 reveal bg-white">
          <Container>
            <div className="max-w-6xl mx-auto">
              <div className="flex items-baseline gap-6 mb-12">
                <span className="editorial-numeral text-6xl md:text-7xl" style={{ color: "oklch(55% .22 27)", fontWeight: 300 }}>05</span>
                <div className="flex items-center gap-3 pt-4">
                  <div className="h-[2px] w-10" style={{ backgroundColor: "oklch(55% .22 27)" }} />
                  <span className="editorial-kicker">Najnowsze wydania</span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                <h2 className="font-serif text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] leading-[1]" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>
                  Najnowsze<br/>
                  <span className="italic" style={{ color: "oklch(55% .22 27)", fontWeight: 500 }}>artykuły</span>
                </h2>
                <Link to="/blog" className="editorial-kicker inline-flex items-center gap-2 pb-3 transition-colors hover:opacity-70 whitespace-nowrap" style={{ color: "oklch(20% .03 264)" }}>
                  Zobacz wszystkie
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>
              </div>

              {loadingPosts ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0" style={{ borderTop: "2px solid oklch(20% .03 264)" }}>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-8 animate-pulse" style={{ borderRight: i < 3 ? "1px solid oklch(92% .008 264)" : "none", borderBottom: "1px solid oklch(92% .008 264)" }}>
                      <div className="h-4 w-16 mb-6" style={{ backgroundColor: "oklch(92% .008 264)" }}></div>
                      <div className="h-8 mb-3" style={{ backgroundColor: "oklch(92% .008 264)" }}></div>
                      <div className="h-8 w-3/4 mb-6" style={{ backgroundColor: "oklch(92% .008 264)" }}></div>
                      <div className="h-4 mb-2" style={{ backgroundColor: "oklch(96% .008 264)" }}></div>
                      <div className="h-4 w-2/3" style={{ backgroundColor: "oklch(96% .008 264)" }}></div>
                    </div>
                  ))}
                </div>
              ) : blogPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0" style={{ borderTop: "2px solid oklch(20% .03 264)" }}>
                  {blogPosts.map((post, idx) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="group cursor-pointer block no-underline reveal-stagger transition-all hover:bg-slate-50"
                      style={{
                        "--i": idx,
                        borderRight: idx < 2 ? "1px solid oklch(92% .008 264)" : "none",
                        borderBottom: "1px solid oklch(92% .008 264)"
                      } as React.CSSProperties}
                    >
                      {post.image_url && (
                        <div className="h-48 overflow-hidden relative" style={{ borderBottom: "1px solid oklch(92% .008 264)" }}>
                          <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            style={{ filter: "grayscale(0.15)" }}
                          />
                        </div>
                      )}
                      <div className="p-6 md:p-8">
                        {/* Article number + metadata */}
                        <div className="flex items-baseline justify-between mb-5">
                          <span className="editorial-numeral text-3xl" style={{ color: "oklch(55% .22 27)", fontWeight: 300 }}>
                            № {String(idx + 1).padStart(2, "0")}
                          </span>
                          <span className="editorial-kicker" style={{ color: "oklch(60% .015 264)" }}>
                            {formatDate(post.published_at)}
                          </span>
                        </div>

                        {/* Category tag — thin rule style */}
                        <div className="flex items-center gap-2 mb-5">
                          <div className="h-px w-6" style={{ backgroundColor: "oklch(55% .22 27)" }} />
                          <span className="editorial-kicker" style={{ color: "oklch(55% .22 27)" }}>
                            {post.category}
                          </span>
                        </div>

                        <h3 className="font-serif text-2xl md:text-[1.75rem] mb-4 leading-[1.15] line-clamp-3 group-hover:italic transition-all" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>
                          {post.title}
                        </h3>
                        <p className="text-sm leading-[1.65] line-clamp-3 mb-6" style={{ color: "oklch(42% .02 264)" }}>
                          {post.excerpt}
                        </p>
                        <div className="editorial-kicker inline-flex items-center gap-2 group-hover:gap-3 transition-all whitespace-nowrap" style={{ color: "oklch(20% .03 264)" }}>
                          <span>Czytaj więcej</span>
                          <ChevronRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-16 text-center" style={{ borderTop: "2px solid oklch(20% .03 264)", borderBottom: "1px solid oklch(92% .008 264)" }}>
                  <h3 className="font-serif text-2xl mb-2" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>Brak artykułów</h3>
                  <p style={{ color: "oklch(42% .02 264)" }}>Nowe artykuły pojawią się wkrótce.</p>
                </div>
              )}
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default HomePage;
