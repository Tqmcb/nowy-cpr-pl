import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/extensions/shadcn/components/button";
import { subscribeToNewsletter, validateEmail } from "utils/newsletterHelpers";
import { toast } from "sonner";
import { Container } from "./Container";
import { fetchBlogPosts, BlogPost } from "../utils/contentLoader";
import {
  Search,
  Clock,
  User,
  ChevronRight,
  BookOpen,
  Send,
  Mail,
  Filter,
  RefreshCw,
  FileText,
  ArrowRight,
  Sparkles
} from "lucide-react";

// Komponent dla pustego stanu
const EmptyState = () => (
  <div className="text-center py-16 glass-card">
    <BookOpen className="h-16 w-16 mx-auto text-slate-500 mb-4" />
    <h3 className="text-lg font-medium text-white mb-2">Brak artykułów</h3>
    <p className="text-slate-400">Nie znaleziono artykułów spełniających kryteria wyszukiwania.</p>
  </div>
);

// Komponent wyświetlający stan ładowania
const LoadingState = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="glass-card overflow-hidden animate-pulse">
        <div className="h-48 bg-slate-700/50"></div>
        <div className="p-6 space-y-4">
          <div className="flex justify-between">
            <div className="h-6 w-24 bg-slate-700/50 rounded"></div>
            <div className="h-5 w-32 bg-slate-700/50 rounded"></div>
          </div>
          <div className="h-8 w-full bg-slate-700/50 rounded"></div>
          <div className="h-20 w-full bg-slate-700/50 rounded"></div>
          <div className="flex justify-between items-center">
            <div className="h-6 w-32 bg-slate-700/50 rounded"></div>
            <div className="h-8 w-28 bg-slate-700/50 rounded"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Funkcja do formatowania daty
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};

// Funkcja obliczająca czas czytania
const calculateReadingTime = (text: string) => {
  const wordsPerMinute = 200;
  const wordCount = text?.split(/\s+/)?.length || 0;
  return Math.ceil(wordCount / wordsPerMinute) || 1;
};

// Komponent pojedynczego artykułu dla widoku skróconego (karta)
const BlogPostCard = ({ post, onClick }: { post: BlogPost; onClick: () => void }) => {
  const readingTime = calculateReadingTime(post.excerpt + post.content);

  return (
    <div
      className="glass-card overflow-hidden hover-lift card-border-glow group cursor-pointer"
      onClick={onClick}
    >
      {post.image_url && (
        <div className="h-48 overflow-hidden relative">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 text-xs font-medium">
            {post.category}
          </span>
          <div className="flex items-center text-sm text-slate-400 gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {readingTime} min
            </span>
          </div>
        </div>
        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-amber-400 transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>
        <div className="flex justify-between items-center pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <User className="w-4 h-4 text-slate-900" />
            </div>
            <div>
              <span className="text-sm text-white">{post.author}</span>
              <p className="text-xs text-slate-500">{formatDate(post.published_at)}</p>
            </div>
          </div>
          <div className="flex items-center text-amber-400 text-sm font-medium group-hover:gap-2 transition-all">
            <span>Czytaj</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Główny komponent strony bloga
export function BlogPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  // Pobieranie wpisów bloga
  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        setLoading(true);
        const posts = await fetchBlogPosts();
        setBlogPosts(posts);
        setError(null);
      } catch (error) {
        console.error("Błąd pobierania artykułów:", error);
        setError("Nie udało się pobrać artykułów.");
      } finally {
        setLoading(false);
      }
    };

    loadBlogPosts();
  }, []);

  // Przekierowanie do strony szczegółów posta
  const navigateToPost = (slug: string) => {
    navigate(`/BlogPost?slug=${slug}`);
  };

  // Filtrowanie artykułów
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch && (selectedCategory === "all" || post.category === selectedCategory);
  });

  // Lista kategorii z wpisów
  const categories = blogPosts.length > 0 ?
    [...new Set(blogPosts.map(post => post.category))].sort() : [];

  // Obsługa newslettera
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Proszę podać poprawny adres e-mail");
      return;
    }

    subscribeToNewsletter(email);
    toast.success("Dziękujemy za zapisanie się do newslettera!");
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <Container>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="md:w-2/3">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/20 mb-6">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400 text-sm font-medium">Blog CPR</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="text-white">Aktualności i </span>
                  <span className="gradient-text">Wiedza CPR</span>
                </h1>
                <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-2xl">
                  Najnowsze informacje, interpretacje i poradniki dotyczące Rozporządzenia CPR (EU) 2024/3110.
                  Bądź na bieżąco ze wszystkimi zmianami prawnymi i najlepszymi praktykami w branży.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => document.getElementById("blog-list")?.scrollIntoView({ behavior: "smooth" })}
                    className="btn-premium px-6 py-3 rounded-full text-slate-900 font-semibold"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Przeglądaj artykuły
                  </Button>
                  <Button
                    variant="outline"
                    className="px-6 py-3 rounded-full border-white/20 text-white hover:bg-white/10"
                    onClick={() => document.getElementById("newsletter-section")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Newsletter
                  </Button>
                </div>
              </div>
              <div className="md:w-1/3">
                <div className="glass-card p-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <FileText className="w-10 h-10 text-slate-900" />
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text mb-1">{blogPosts.length}</div>
                    <p className="text-slate-400 text-sm">artykułów dostępnych</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold text-white">{categories.length}</div>
                      <p className="text-slate-500 text-xs">kategorii</p>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white">2026</div>
                      <p className="text-slate-500 text-xs">aktualny rok</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Blog List Section */}
      <section id="blog-list" className="py-16 bg-gradient-to-b from-slate-900 to-slate-950">
        <Container>
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Najnowsze <span className="gradient-text">artykuły</span>
            </h2>
            <p className="text-slate-400">Wybierz kategorię lub wyszukaj interesujący Cię temat</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-grow relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Szukaj artykułów..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all"
              />
            </div>
            <div className="md:w-64 relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
              >
                <option value="all" className="bg-slate-800">Wszystkie kategorie</option>
                {categories.map(category => (
                  <option key={category} value={category} className="bg-slate-800">{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Posts Grid */}
          <div id="blog-posts-grid">
            {loading ? (
              <LoadingState />
            ) : error ? (
              <div className="text-center py-12 glass-card">
                <h3 className="text-xl font-medium text-white mb-2">{error}</h3>
                <p className="text-slate-400 mb-4">Spróbuj odświeżyć stronę</p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Odśwież stronę
                </Button>
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map(post => (
                  <BlogPostCard
                    key={post.id}
                    post={post}
                    onClick={() => navigateToPost(post.slug)}
                  />
                ))}
              </div>
            ) : (
              <div>
                <EmptyState />
                {selectedCategory !== "all" && (
                  <div className="text-center mt-6">
                    <Button
                      onClick={() => setSelectedCategory("all")}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Pokaż wszystkie kategorie
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter-section" className="py-24 bg-slate-950">
        <Container>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 via-slate-800 to-slate-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-blue-500/10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-2/3">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Bądź na bieżąco z <span className="gradient-text">CPR</span>
                </h2>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Zapisz się do naszego newslettera i otrzymuj najnowsze informacje,
                  interpretacje przepisów i praktyczne porady dotyczące Rozporządzenia CPR.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Twój adres e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-grow px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all"
                    required
                  />
                  <button
                    type="submit"
                    className="btn-premium px-6 py-3 rounded-xl text-slate-900 font-semibold flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Zapisz się
                  </button>
                </form>
                <p className="text-xs text-slate-500 mt-3">
                  Zapisując się, zgadzasz się na naszą politykę prywatności. W każdej chwili możesz zrezygnować z subskrypcji.
                </p>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Mail className="w-16 h-16 text-slate-900" />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-slate-900 border-t border-white/5">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                O blogu
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Dostarczamy ekspercką wiedzę i praktyczne informacje dla producentów wyrobów budowlanych
                dotyczące Rozporządzenia CPR (EU) 2024/3110.
              </p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-400" />
                Kategorie
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 6).map(category => (
                  <button
                    key={category}
                    className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-sm hover:text-amber-400 hover:border-amber-400/30 transition-all"
                    onClick={() => {
                      setSelectedCategory(category);
                      document.getElementById("blog-list")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-400" />
                Kontakt
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                Masz pytania dotyczące CPR? Skontaktuj się z naszymi ekspertami.
              </p>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => navigate("/services")}
              >
                Skontaktuj się
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
