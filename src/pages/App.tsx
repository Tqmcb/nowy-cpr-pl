import React, { useState, useEffect } from "react";
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
  Sparkles,
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
    <div ref={triggerRef as React.RefObject<HTMLDivElement>} className="text-center">
      <Icon className="w-5 h-5 mx-auto mb-2 text-white/70" />
      <div className="text-2xl md:text-3xl font-bold text-white">
        {count}{suffix}
      </div>
      <div className="text-sm text-white/70 mt-1">{label}</div>
    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const aboutRef = useReveal();
  const featuresRef = useReveal();
  const blogRef = useReveal();

  // Fetch latest blog posts from markdown files
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { getAllPosts } = await import('../utils/blogLoader');
        const allPosts = await getAllPosts();
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

  return (
    <div className="flex flex-col min-h-screen section-paper">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-24 border-b border-slate-800">
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
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left Content */}
              <div className="animate-fade-in-up">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/30 mb-8">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">Rozporządzenie CPR w mocy od 2024</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  <span className="text-white">Nowe </span>
                  <span className="text-white font-bold">Rozporządzenie CPR</span>
                  <span className="text-white"> – Co i kiedy Cię dotyczy?</span>
                </h1>

                <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed max-w-xl">
                  CPR (EU) 2024/3110 stosuje się od 8 stycznia 2026. Większość nowych wymogów
                  (GWP, DPP, EPD) wymaga jeszcze nowych norm zharmonizowanych —
                  sprawdź harmonogram dla swojej branży.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    onClick={() => navigate("/product-search")}
                    className="group"
                  >
                    <span>Sprawdź wymagania dla produktu</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate("/documents")}
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    Przeglądaj dokumenty
                  </Button>
                </div>

                {/* Stats */}
                <div className="mt-12 grid grid-cols-3 gap-6">
                  {[
                    { value: "2026", label: "Rok stosowania", icon: Calendar },
                    { value: "27", label: "Krajów UE", icon: Users },
                    { value: "2028+", label: "Realne GWP / DPP", icon: TrendingUp }
                  ].map((stat, idx) => (
                    <StatCounter key={idx} {...stat} />
                  ))}
                </div>
              </div>

              {/* Right Visual */}
              <div className="relative animate-fade-in-up-delay-2">
                <div className="relative bg-white border border-slate-200 shadow-sm rounded-xl p-8">
                  {/* Subtle border accent */}
                  <div className="absolute -inset-px bg-gradient-to-r from-[#1a56a0]/10 via-slate-200/50 to-[#0d2137]/10 rounded-2xl"></div>

                  <div className="relative aspect-video rounded-xl overflow-hidden">
                    {/* Construction site photo */}
                    <img
                      src="/images/hero-construction.jpg"
                      alt="Nowoczesna budowa — wyroby budowlane CPR 2024/3110"
                      className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d2137]/90 via-[#0d2137]/40 to-[#0d2137]/10"></div>
                    {/* Content overlay */}
                    <div className="relative flex flex-col items-center justify-end h-full p-6 text-center">
                      <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-[#0d2137] flex items-center justify-center shadow-lg shadow-[#1a56a0]/30">
                        <ClipboardList className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">CPR (EU) 2024/3110</h3>
                      <p className="text-slate-200 text-xs mb-4">Rozporządzenie w sprawie wyrobów budowlanych</p>
                      {/* Feature Pills */}
                      <div className="flex flex-wrap justify-center gap-2">
                        {["Digital DoP&C", "Oznakowanie CE", "Paszport produktu"].map((tag) => (
                          <span key={tag} className="px-3 py-1 rounded-full bg-black/40 border border-white/20 text-xs text-slate-200 backdrop-blur-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 rounded-xl bg-[#1a56a0] flex items-center justify-center shadow-lg">
                    <span className="text-2xl">🇪🇺</span>
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-lg bg-[#1a56a0] flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </Container>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
              <div className="w-1 h-2 bg-white/60 rounded-full animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* About CPR 2024 Section */}
        <section ref={aboutRef as React.RefObject<HTMLElement>} className="py-24 section-paper relative reveal">
          <Container>
            {/* Section Header */}
            <div className="max-w-3xl mx-auto text-center mb-16">
              {/* Info Alert */}
              <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 mb-8 inline-flex items-start gap-3 text-left">
                <div className="w-8 h-8 rounded-lg bg-[#1a56a0]/10 flex items-center justify-center flex-shrink-0">
                  <Info className="w-4 h-4 text-[#1a56a0]" />
                </div>
                <p className="text-sm text-slate-700">
                  <span className="text-[#1a56a0] font-semibold">Ważne:</span> Rozporządzenie CPR (EU) 2024/3110 zostało opublikowane{" "}
                  <a
                    href="https://eur-lex.europa.eu/legal-content/PL/TXT/HTML/?uri=OJ:L_202403110"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1a56a0] hover:text-[#1a3d6b] underline transition-colors"
                  >
                    w Dzienniku Urzędowym UE
                  </a>{" "}
                  i wchodzi do pełnego stosowania od 8 stycznia 2026 roku.
                </p>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-[#0d2137] mb-6">
                Czym jest <span className="text-[#1a56a0] font-bold">rozporządzenie CPR?</span>
              </h2>
              <p className="text-lg text-slate-700 leading-relaxed">
                Rozporządzenie w sprawie wyrobów budowlanych (CPR) ustanawia zharmonizowane warunki
                wprowadzania do obrotu wyrobów budowlanych w całej Unii Europejskiej, zastępując
                dotychczasowe przepisy z 2011 roku.
              </p>
            </div>

            {/* Status wymagań CPR 2024 — kluczowa informacja */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden mb-16 border-l-4 border-l-[#1a56a0]">
              <div className="px-6 py-4 bg-slate-100 border-b border-slate-200 flex items-center gap-2">
                <Info className="w-4 h-4 text-[#1a56a0] flex-shrink-0" />
                <span className="text-sm font-semibold text-[#0d2137]">
                  Co obowiązuje teraz — status {new Date().toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="p-6 md:p-8">
                <p className="text-slate-700 leading-relaxed text-base md:text-lg">
                  <span className="font-semibold text-[#0d2137]">CPR 2024 obowiązuje od 8 stycznia 2026</span>,
                  ale <span className="font-semibold text-[#1a56a0]">GWP, EPD i paszport produktu (DPP) jeszcze nie są obowiązkowe</span> — i nie będą
                  dla nikogo w tym samym momencie. Obowiązek wchodzi <span className="font-semibold text-[#0d2137]">oddzielnie dla każdej grupy wyrobów</span>,
                  dopiero gdy CEN opublikuje nową normę zharmonizowaną (hTS) w Dzienniku Urzędowym UE — a po publikacji
                  jest jeszcze <span className="font-semibold text-[#0d2137]">12–36 miesięcy okresu przejściowego</span>.
                </p>
                <p className="mt-4 text-slate-700 leading-relaxed text-base md:text-lg">
                  Na dziś <span className="font-semibold text-[#1a56a0]">żadna nowa hTS nie wyszła</span>.
                  Pierwsze spodziewane są najwcześniej 2027–2029 (zgodnie z planem prac KE), więc
                  realny obowiązek dla większości wyrobów to <span className="font-semibold text-[#0d2137]">najwcześniej 2029–2031</span>.
                </p>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {/* Timeline Card */}
              <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-8 hover-lift">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#0d2137] flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0d2137]">Kluczowe daty</h3>
                </div>

                <div className="space-y-4">
                  {[
                    { year: "Grudzień 2024", text: "Publikacja rozporządzenia (EU) 2024/3110", active: true, done: true },
                    { year: "7 sty 2025", text: "Wejście w życie — 20 dni po publikacji w Dz.U. UE", active: true, done: true },
                    { year: "8 sty 2026", text: "Przepisy ramowe CPR; stare hEN i AVCP nadal obowiązują do publikacji hTS", active: true, done: true },
                    { year: "2027–2028+", text: "Pierwsze hTS, DoP&C, system AVS, cyfrowy paszport produktu (DPP)" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className={`w-28 flex-shrink-0 text-sm font-semibold flex items-center gap-2 ${item.active ? 'text-[#1a56a0]' : 'text-slate-500'}`}>
                        {item.done && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        {item.year}
                      </div>
                      <div className="flex-1 text-slate-700 text-sm leading-relaxed">{item.text}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Changes Card */}
              <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-8 hover-lift">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#1a56a0] flex items-center justify-center">
                    <ListChecks className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0d2137]">Główne zmiany w CPR</h3>
                </div>

                <div className="space-y-3">
                  {[
                    { text: "Obowiązkowe cyfrowe deklaracje właściwości użytkowych i zgodności (Digital DoP&C)", icon: FileText, color: "text-[#1a56a0]" },
                    { text: "Nowe wymagania środowiskowe i wskaźniki zrównoważonego rozwoju", icon: TrendingUp, color: "text-emerald-600" },
                    { text: "Rozszerzone obowiązki dla producentów, importerów i dystrybutorów", icon: Users, color: "text-[#1a56a0]" },
                    { text: "Cyfrowy paszport produktu integrujący dokumentację", icon: ClipboardList, color: "text-[#1a56a0]" },
                    { text: "Bardziej rygorystyczne wymagania dotyczące oznakowania CE", icon: Shield, color: "text-[#1a56a0]" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 group">
                      <item.icon className={`w-5 h-5 mt-0.5 ${item.color} group-hover:scale-110 transition-transform`} />
                      <span className="text-slate-700 text-sm leading-relaxed group-hover:text-slate-900 transition-colors">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-[#0d2137] p-8 md:p-12">
              <div className="absolute inset-0 bg-gradient-to-r from-[#1a56a0]/20 via-transparent to-[#1a56a0]/10"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#1a56a0]/10 rounded-full blur-3xl"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    Gotowy sprawdzić wymagania dla Twojego produktu?
                  </h3>
                  <p className="text-slate-300">
                    Skorzystaj z naszej wyszukiwarki i dowiedz się więcej o wymaganiach CPR dla Twoich wyrobów.
                  </p>
                </div>
                <Button
                  size="lg"
                  onClick={() => navigate("/product-search")}
                  className="flex-shrink-0 bg-white text-[#0d2137] hover:bg-slate-100 border-0"
                >
                  Rozpocznij teraz
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* Features Section */}
        <section ref={featuresRef as React.RefObject<HTMLElement>} className="py-24 section-blueprint reveal">
          <Container>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0d2137] mb-4">
                Dlaczego <span className="text-[#1a56a0] font-bold">NowyCPR.pl?</span>
              </h2>
              <p className="text-slate-700 max-w-2xl mx-auto">
                Kompleksowe wsparcie w przygotowaniu do wymagań rozporządzenia CPR
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Search,
                  title: "Wyszukiwarka CPR",
                  description: "Szybko znajdź wymagania i normy zharmonizowane dla Twojego produktu budowlanego",
                  iconBg: "bg-[#0d2137]",
                  path: "/product-search"
                },
                {
                  icon: FileText,
                  title: "Baza dokumentów",
                  description: "Dostęp do aktualnych dokumentów, wytycznych i norm związanych z CPR",
                  iconBg: "bg-[#1a56a0]",
                  path: "/documents"
                },
                {
                  icon: Award,
                  title: "Usługi certyfikacyjne",
                  description: "Profesjonalne wsparcie w procesie certyfikacji i przygotowania dokumentacji",
                  iconBg: "bg-[#1a56a0]",
                  path: "/services"
                }
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 shadow-sm rounded-xl p-8 hover-lift group cursor-pointer reveal-stagger"
                  style={{ "--i": idx } as React.CSSProperties}
                  onClick={() => navigate(feature.path)}
                >
                  <div className={`w-16 h-16 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0d2137] mb-3">{feature.title}</h3>
                  <p className="text-slate-700 leading-relaxed">{feature.description}</p>
                  <div className="mt-6 flex items-center text-[#1a56a0] text-sm font-medium group-hover:gap-3 transition-all">
                    <span>Dowiedz się więcej</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Latest Blog Posts Section */}
        <section ref={blogRef as React.RefObject<HTMLElement>} className="py-24 section-paper reveal">
          <Container>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#0d2137] mb-2">
                  Najnowsze <span className="text-[#0d2137] font-bold">artykuły</span>
                </h2>
                <p className="text-slate-700">
                  Aktualności i przewodniki dotyczące rozporządzenia CPR
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate("/blog")}
                className="flex-shrink-0"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Zobacz wszystkie artykuły
              </Button>
            </div>

            {loadingPosts ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
                    <div className="h-6 bg-slate-200 rounded w-full mb-2"></div>
                    <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : blogPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {blogPosts.map((post, idx) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 hover-lift group cursor-pointer block no-underline reveal-stagger"
                    style={{ "--i": idx } as React.CSSProperties}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 rounded-full bg-[#1a56a0]/10 text-[#1a56a0] text-xs font-medium">
                        {post.category}
                      </span>
                      <span className="text-slate-600 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(post.published_at)}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#0d2137] mb-3 group-hover:text-[#1a56a0] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-slate-700 text-sm leading-relaxed line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-[#1a56a0] text-sm font-medium group-hover:gap-2 transition-all">
                      <span>Czytaj więcej</span>
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-12 text-center">
                <BookOpen className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                <h3 className="text-lg font-semibold text-[#0d2137] mb-2">Brak artykułów</h3>
                <p className="text-slate-700">Nowe artykuły pojawią się wkrótce.</p>
              </div>
            )}
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default HomePage;
