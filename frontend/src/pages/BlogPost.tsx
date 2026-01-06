import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/extensions/shadcn/components/button";
import { Skeleton } from "@/extensions/shadcn/components/skeleton";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export default function BlogPost() {
  const navigate = useNavigate();
  const location = useLocation();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pobieranie parametru slug z URL
  const searchParams = new URLSearchParams(location.search);
  const slug = searchParams.get('slug');

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

  // Pobieranie posta z API
  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setError("Nieprawidłowy adres URL artykułu");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`https://api.databutton.com/_projects/89c9d971-d0a0-4797-87da-9d7f842175ad/dbtn/devx/app/routes/local-post/${slug}`);
        const data = await response.json();

        if (data.success && data.post) {
          setPost(data.post);
          setError(null);
        } else {
          setError(data.message || "Nie udało się pobrać artykułu");
          setPost(null);
        }
      } catch (error) {
        console.error("Błąd pobierania artykułu:", error);
        setError("Wystąpił błąd podczas pobierania artykułu");
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  // Konwersja Markdown do HTML (prosta implementacja) 
  const markdownToHtml = (markdown: string) => {
    if (!markdown) return "";

    let html = markdown;

    // Konwersja nagłówków
    html = html.replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold my-4">$1</h1>');
    html = html.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold my-3">$1</h2>');
    html = html.replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold my-2">$1</h3>');

    // Konwersja pogrubienia i kursywy
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Konwersja list
    html = html.replace(/^- (.+)$/gm, '<li class="ml-6 list-disc">$1</li>');
    html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-6 list-decimal">$1</li>');

    // Konwersja cytatów
    html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4">$1</blockquote>');

    // Konwersja tabel (bardzo uproszczona)
    html = html.replace(/\|(.+)\|/g, '<tr><td>$1</td></tr>');
    html = html.replace(/^\|[-:\s]+\|$/gm, '');

    // Konwersja paragrafów (uproszczona)
    html = html.replace(/\n\n([^#<\n].+?)\n\n/gs, '<p class="my-4">$1</p>');

    // Akapity na końcu tekstu
    html = html.replace(/\n\n([^#<\n].+?)$/gs, '<p class="my-4">$1</p>');

    return html;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            // Szkielet ładowania
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4 mx-auto" />
              <div className="flex items-center justify-center space-x-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-96 w-full" />
            </div>
          ) : error ? (
            // Komunikat o błędzie
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-900">{error}</h3>
              <Button
                onClick={() => navigate('/Blog')}
                className="mt-4"
              >
                Wróć do listy artykułów
              </Button>
            </div>
          ) : post ? (
            // Treść artykułu
            <article>
              <Button
                onClick={() => navigate('/Blog')}
                variant="outline"
                className="mb-6"
              >
                &larr; Wróć do listy artykułów
              </Button>

              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                {post.title}
              </h1>

              <div className="flex items-center text-gray-600 mb-6">
                <span className="font-medium">{post.author}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(post.published_at)}</span>
                {post.category && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      {post.category}
                    </span>
                  </>
                )}
              </div>

              {post.image_url && (
                <div className="mb-8 overflow-hidden rounded-lg">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
              />
            </article>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}