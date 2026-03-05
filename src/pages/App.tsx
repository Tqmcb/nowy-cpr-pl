import React, { useState, useEffect } from "react";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useNavigate, Link } from "react-router-dom";
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

function HomePage() {
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

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
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center gradient-hero particles-bg overflow-hidden pt-24">
          {/* Hero Photo Background - subtle construction site texture */}
          <div className="absolute inset-0 pointer-events-none">
            <img
              src="/images/hero-bg.jpg"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover object-center opacity-[0.12]"
            />
            {/* Extra dark gradient on top of photo to preserve text contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-slate-900/60"></div>
          </div>

          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float-delay"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-amber-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
          </div>

          <Container>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left Content */}
              <div className="animate-fade-in-up">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/20 mb-8">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400 text-sm font-medium">Rozporządzenie CPR w mocy od 2024</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  <span className="text-white">Nowe </span>
                  <span className="gradient-text">Rozporządzenie CPR</span>
                  <span className="text-white"> – Jesteś gotowy?</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-xl">
                  Rozporządzenie CPR (EU) 2024/3110 stosuje się od 8 stycznia 2026.
                  Sprawdź aktualne wymagania dla Twoich produktów budowlanych i uniknij kar.
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
                    { value: "100%", label: "Cyfryzacja DoP", icon: TrendingUp }
                  ].map((stat, idx) => (
                    <div key={idx} className="text-center">
                      <stat.icon className="w-5 h-5 mx-auto mb-2 text-slate-500" />
                      <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                      <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Visual */}
              <div className="relative animate-fade-in-up-delay-2">
                <div className="relative glass-card p-8 animate-float">
                  {/* Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 via-blue-500/20 to-emerald-400/20 rounded-2xl blur-xl opacity-60"></div>

                  <div className="relative aspect-video rounded-xl overflow-hidden">
                    {/* Construction site photo */}
                    <img
                      src="/images/hero-construction.jpg"
                      alt="Nowoczesna budowa — wyroby budowlane CPR 2024/3110"
                      className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                    {/* Gradient overlay — darker at bottom for text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/20"></div>
                    {/* Content overlay */}
                    <div className="relative flex flex-col items-center justify-end h-full p-6 text-center">
                      <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/40">
                        <ClipboardList className="w-7 h-7 text-slate-900" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">CPR (EU) 2024/3110</h3>
                      <p className="text-slate-300 text-xs mb-4">Rozporządzenie w sprawie wyrobów budowlanych</p>
                      {/* Feature Pills */}
                      <div className="flex flex-wrap justify-center gap-2">
                        {["Digital DoP", "Oznakowanie CE", "Paszport produktu"].map((tag) => (
                          <span key={tag} className="px-3 py-1 rounded-full bg-black/40 border border-white/20 text-xs text-slate-200 backdrop-blur-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg animate-pulse-glow">
                    <span className="text-2xl">🇪🇺</span>
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </Container>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
              <div className="w-1 h-2 bg-white/50 rounded-full animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* About CPR 2024 Section */}
        <section className="py-24 bg-slate-900 relative">
          <Container>
            {/* Section Header */}
            <div className="max-w-3xl mx-auto text-center mb-16">
              {/* Info Alert */}
              <div className="glass-card p-4 mb-8 inline-flex items-start gap-3 text-left">
                <div className="w-8 h-8 rounded-lg bg-amber-400/20 flex items-center justify-center flex-shrink-0">
                  <Info className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-sm text-slate-300">
                  <span className="text-amber-400 font-semibold">Ważne:</span> Rozporządzenie CPR (EU) 2024/3110 zostało opublikowane{" "}
                  <a
                    href="https://eur-lex.europa.eu/legal-content/PL/TXT/HTML/?uri=OJ:L_202403110"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline transition-colors"
                  >
                    w Dzienniku Urzędowym UE
                  </a>{" "}
                  i wchodzi do pełnego stosowania od 8 stycznia 2026 roku.
                </p>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Czym jest <span className="gradient-text">rozporządzenie CPR?</span>
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed">
                Rozporządzenie w sprawie wyrobów budowlanych (CPR) ustanawia zharmonizowane warunki
                wprowadzania do obrotu wyrobów budowlanych w całej Unii Europejskiej, zastępując
                dotychczasowe przepisy z 2011 roku.
              </p>
            </div>

            {/* Status wymagań CPR 2024 — kluczowa informacja */}
            <div className="glass-card overflow-hidden mb-16 border-l-4 border-blue-500/60">
              <div className="px-6 py-4 bg-slate-800/60 border-b border-white/10 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-sm font-semibold text-white">
                  Co obowiązuje teraz — status {new Date().toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="p-6 md:p-8">
                <p className="text-slate-200 leading-relaxed text-base md:text-lg">
                  <span className="font-semibold text-white">CPR 2024 obowiązuje od 8 stycznia 2026</span>,
                  ale <span className="font-semibold text-amber-400">GWP, EPD i paszport produktu (DPP) jeszcze nie są obowiązkowe</span> — i nie będą
                  dla nikogo w tym samym momencie. Obowiązek wchodzi <span className="font-semibold text-white">oddzielnie dla każdej grupy wyrobów</span>,
                  dopiero gdy CEN opublikuje nową normę zharmonizowaną (hTS) w Dzienniku Urzędowym UE — a po publikacji
                  jest jeszcze <span className="font-semibold text-white">12–36 miesięcy okresu przejściowego</span>.
                </p>
                <p className="mt-4 text-slate-300 leading-relaxed text-base md:text-lg">
                  Na dziś <span className="font-semibold text-amber-400">żadna nowa hTS nie wyszła</span>.
                  Pierwsze spodziewane są najwcześniej 2026–2027, więc
                  realny obowiązek dla większości wyrobów to <span className="font-semibold text-white">2028–2029</span>.
                </p>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {/* Timeline Card */}
              <div className="glass-card p-8 hover-lift card-border-glow">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-slate-900" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Kluczowe daty</h3>
                </div>

                <div className="space-y-4">
                  {[
                    { year: "Grudzień 2024", text: "Publikacja rozporządzenia (EU) 2024/3110", active: true, done: true },
                    { year: "7 sty 2025", text: "Wejście w życie — wybrane przepisy (art. 1–4, 9, 10, 37, 89, 90)", active: true, done: true },
                    { year: "8 sty 2026", text: "Stosowanie głównych przepisów CPR; okres przejściowy dla Digital DoP", active: true, done: true },
                    { year: "2028+", text: "Pełne wdrożenie cyfrowego paszportu produktu" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className={`w-28 flex-shrink-0 text-sm font-semibold flex items-center gap-2 ${item.active ? 'text-amber-400' : 'text-slate-500'}`}>
                        {item.done && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {item.year}
                      </div>
                      <div className="flex-1 text-slate-300 text-sm leading-relaxed">{item.text}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Changes Card */}
              <div className="glass-card p-8 hover-lift card-border-glow">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                    <ListChecks className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Główne zmiany w CPR</h3>
                </div>

                <div className="space-y-3">
                  {[
                    { text: "Obowiązkowe cyfrowe deklaracje właściwości użytkowych (Digital DoP)", icon: FileText, color: "text-amber-400" },
                    { text: "Nowe wymagania środowiskowe i wskaźniki zrównoważonego rozwoju", icon: TrendingUp, color: "text-emerald-400" },
                    { text: "Rozszerzone obowiązki dla producentów, importerów i dystrybutorów", icon: Users, color: "text-blue-400" },
                    { text: "Cyfrowy paszport produktu integrujący dokumentację", icon: ClipboardList, color: "text-purple-400" },
                    { text: "Bardziej rygorystyczne wymagania dotyczące oznakowania CE", icon: Shield, color: "text-rose-400" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 group">
                      <item.icon className={`w-5 h-5 mt-0.5 ${item.color} group-hover:scale-110 transition-transform`} />
                      <span className="text-slate-300 text-sm leading-relaxed group-hover:text-white transition-colors">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 via-slate-800 to-slate-900 p-8 md:p-12">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-blue-500/10"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    Gotowy sprawdzić wymagania dla Twojego produktu?
                  </h3>
                  <p className="text-slate-400">
                    Skorzystaj z naszej wyszukiwarki i dowiedz się więcej o wymaganiach CPR dla Twoich wyrobów.
                  </p>
                </div>
                <Button
                  size="lg"
                  onClick={() => navigate("/product-search")}
                  className="flex-shrink-0"
                >
                  Rozpocznij teraz
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950">
          <Container>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Dlaczego <span className="gradient-text-blue">NowyCPR.pl?</span>
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Kompleksowe wsparcie w przygotowaniu do wymagań rozporządzenia CPR
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Search,
                  title: "Wyszukiwarka CPR",
                  description: "Szybko znajdź wymagania i normy zharmonizowane dla Twojego produktu budowlanego",
                  gradient: "from-amber-400 to-orange-500",
                  path: "/product-search"
                },
                {
                  icon: FileText,
                  title: "Baza dokumentów",
                  description: "Dostęp do aktualnych dokumentów, wytycznych i norm związanych z CPR",
                  gradient: "from-blue-400 to-cyan-500",
                  path: "/documents"
                },
                {
                  icon: Award,
                  title: "Usługi certyfikacyjne",
                  description: "Profesjonalne wsparcie w procesie certyfikacji i przygotowania dokumentacji",
                  gradient: "from-emerald-400 to-green-500",
                  path: "/services"
                }
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="glass-card p-8 hover-lift card-border-glow group cursor-pointer"
                  onClick={() => navigate(feature.path)}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-slate-900" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                  <div className="mt-6 flex items-center text-amber-400 text-sm font-medium group-hover:gap-3 transition-all">
                    <span>Dowiedz się więcej</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Latest Blog Posts Section */}
        <section className="py-24 bg-slate-950">
          <Container>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Najnowsze <span className="gradient-text">artykuły</span>
                </h2>
                <p className="text-slate-400">
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
                  <div key={i} className="glass-card p-6 animate-pulse">
                    <div className="h-4 bg-slate-700 rounded w-1/3 mb-4"></div>
                    <div className="h-6 bg-slate-700 rounded w-full mb-2"></div>
                    <div className="h-6 bg-slate-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-slate-700 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : blogPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {blogPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="glass-card p-6 hover-lift card-border-glow group cursor-pointer block no-underline"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 text-xs font-medium">
                        {post.category}
                      </span>
                      <span className="text-slate-500 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(post.published_at)}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-amber-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-amber-400 text-sm font-medium group-hover:gap-2 transition-all">
                      <span>Czytaj więcej</span>
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="glass-card p-12 text-center">
                <BookOpen className="w-12 h-12 mx-auto text-slate-600 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Brak artykułów</h3>
                <p className="text-slate-400">Nowe artykuły pojawią się wkrótce.</p>
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