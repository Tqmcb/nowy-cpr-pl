import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/extensions/shadcn/components/button";
import { Badge } from "@/extensions/shadcn/components/badge";
import { Separator } from "@/extensions/shadcn/components/separator";
import { Skeleton } from "@/extensions/shadcn/components/skeleton";
import { subscribeToNewsletter, validateEmail } from "utils/newsletterHelpers";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  published_at: string;
  updated_at?: string;
  is_published: boolean;
  category: string;
  image_url: string;
  tags?: string[];
}

// Komponent dla pustego stanu
const EmptyState = () => (
  <div className="text-center py-16 border border-dashed border-gray-300 rounded-lg bg-gray-50">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0h4M7 12h3m-3 4h7" />
    </svg>
    <h3 className="mt-4 text-lg font-medium text-gray-900">Brak artykułów</h3>
    <p className="mt-2 text-gray-600">Nie znaleziono artykułów spełniających kryteria wyszukiwania.</p>
  </div>
);

// Komponent wyświetlający stan ładowania
const LoadingState = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Skeleton className="h-48 w-full" />
        <div className="p-6 space-y-4">
          <div className="flex justify-between">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-20 w-full" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-28" />
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-48 overflow-hidden">
        <img 
          src={post.image_url} 
          alt={post.title} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="secondary" className="mr-2">{post.category}</Badge>
          <div className="flex items-center text-sm text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {readingTime} min
            <span className="mx-2">•</span>
            {formatDate(post.published_at)}
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.author)}&background=random&color=fff`}
              alt={post.author}
              className="w-6 h-6 rounded-full mr-2 border border-gray-200"
            />
            <span className="text-sm text-gray-600">{post.author}</span>
          </div>
          <Button 
            onClick={onClick}
            variant="outline"
            size="sm"
            className="font-medium"
          >
            Czytaj więcej
          </Button>
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
  
  // Pobieranie wpisów bloga z API
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://api.databutton.com/_projects/89c9d971-d0a0-4797-87da-9d7f842175ad/dbtn/devx/app/routes/local-posts?published_only=true`);
        const data = await response.json();
        
        if (data.success && data.posts) {
          setBlogPosts(data.posts);
          setError(null);
        } else {
          setError(data.message || "Nie udało się pobrać artykułów");
          setBlogPosts([]);
        }
      } catch (error) {
        console.error("Błąd pobierania artykułów:", error);
        setError("Wystąpił błąd podczas pobierania artykułów");
        setBlogPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-2/3">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Blog i aktualności CPR 2024</h1>
              <p className="text-lg text-gray-600 mb-6">
                Najnowsze informacje, interpretacje i poradniki dotyczące nowego rozporządzenia o wyrobach budowlanych. Bądź na bieżąco z wszystkimi zmianami prawnymi i najlepszymi praktykami w branży.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => document.getElementById("blog-list")?.scrollIntoView({ behavior: "smooth" })}
                  className="font-medium"
                >
                  Przeglądaj artykuły
                </Button>
                <Button 
                  variant="outline" 
                  className="font-medium"
                  onClick={() => document.getElementById("newsletter-section")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Zapisz się do newslettera
                </Button>
              </div>
            </div>
            <div className="md:w-1/3">
              <img 
                src="https://images.unsplash.com/photo-1593642533144-3d62aa4783ec?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3" 
                alt="Blog CPR 2024" 
                className="rounded-lg shadow-md w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blog List Section */}
      <section id="blog-list" className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Najnowsze artykuły</h2>
            
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-grow">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Szukaj artykułów..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="md:w-1/3 lg:w-1/4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Wszystkie kategorie</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div id="blog-posts-grid" className="mt-8">
              {loading ? (
                <LoadingState />
              ) : error ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-xl font-medium text-gray-900">{error}</h3>
                  <p className="mt-2 text-gray-600">Spróbuj odświeżyć stronę</p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    className="mt-4"
                    variant="outline"
                  >
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
                <div className="col-span-3">
                  <EmptyState />
                  {selectedCategory !== "all" && (
                    <div className="text-center mt-4">
                      <Button 
                        onClick={() => setSelectedCategory("all")} 
                        className="mt-4"
                        variant="outline"
                      >
                        Pokaż wszystkie kategorie
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter-section" className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 shadow-sm border border-blue-100">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-2/3">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Bądź na bieżąco z CPR 2024</h2>
                <p className="text-gray-600 mb-6">
                  Zapisz się do naszego newslettera i otrzymuj najnowsze informacje, interpretacje przepisów i praktyczne porady dotyczące nowego rozporządzenia CPR prosto na swoją skrzynkę.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="email" 
                    placeholder="Twój adres e-mail" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <Button type="submit" className="whitespace-nowrap">
                    Zapisz się
                  </Button>
                </form>
                <p className="text-xs text-gray-500 mt-3">
                  Zapisując się, zgadzasz się na naszą politykę prywatności. W każdej chwili możesz zrezygnować z subskrypcji.
                </p>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <div className="w-48 h-48 rounded-full bg-white flex items-center justify-center shadow-md border border-blue-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section className="py-12 px-4 bg-gray-100">
        <div className="container mx-auto max-w-6xl">
          <Separator className="mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">O blogu</h3>
              <p className="text-gray-600">
                Dostarczamy ekspercką wiedzę i praktyczne informacje dla producentów wyrobów budowlanych dotyczące nowego rozporządzenia CPR 2024.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Kategorie</h3>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 6).map(category => (
                  <Badge 
                    key={category} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-gray-200"
                    onClick={() => {
                      setSelectedCategory(category);
                      document.getElementById("blog-list")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
              <p className="text-gray-600 mb-2">
                Masz pytania dotyczące CPR 2024? Skontaktuj się z naszymi ekspertami.
              </p>
              <Button 
                variant="outline" 
                className="font-medium"
                onClick={() => navigate("/Contact")}
              >
                Skontaktuj się
              </Button>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} NowyCPR.pl | Wszystkie prawa zastrzeżone
          </div>
        </div>
      </section>
    </div>
  );
}
