import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "../components/Container";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/Button";
import { supabase } from "../utils/supabase";
import { toast } from "sonner";
import { getSupabaseConfig } from "../utils/supabase";
import { useAuth } from "../utils/AuthContextUnified";
import { AuthWrapper } from "../components/AuthWrapper";

// Type for blog posts
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url?: string;
  author: string;
  published_at: string;
  updated_at: string;
  is_published: boolean;
  category: string;
}

function AdminBlog() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use the auth context
  const auth = useAuth();

  // Check Supabase configuration before loading posts
  const config = getSupabaseConfig();
  
  // Check authentication status
  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      // Redirect to login if not authenticated
      navigate("/login", { state: { from: "/admin-blog" } });
    }
  }, [auth.isAuthenticated, auth.isLoading, navigate]);
  
  // Load blog posts on component mount
  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      setError(null);
      
      if (!config.hasValidConfig) {
        setError("Brak poprawnej konfiguracji Supabase. Przejdź do konfiguracji, aby skonfigurować bazę danych.");
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('published_at', { ascending: false });
        
        if (error) throw error;
        
        setPosts(data as BlogPost[]);
      } catch (err) {
        console.error("Error loading blog posts:", err instanceof Error ? err.message : JSON.stringify(err));
        let errorMessage = "Nie udało się załadować postów. ";
        
        if (err instanceof Error) {
          if (err.message.includes("auth/invalid-api-key") || err.message.includes("Invalid API key")) {
            errorMessage += "Nieprawidłowy klucz API Supabase.";
          } else if (err.message.includes("network") || err.message.includes("fetch") || err.message.includes("Network Error")) {
            errorMessage += "Problem z połączeniem sieciowym. Sprawdź połączenie internetowe.";
          } else if (err.message.includes("does not exist") || err.message.includes("blog_posts") || err.message.includes("relation")) {
            errorMessage += "Tabela blog_posts nie istnieje w bazie danych. Konieczne jest zaimportowanie danych.";
          } else if (err.message.includes("permission denied")) {
            errorMessage += "Brak uprawnień do tabeli blog_posts. Sprawdź polityki RLS w bazie danych.";
          } else {
            errorMessage += err.message;
          }
        } else {
          errorMessage += "Nieznany błąd. Sprawdź konsolę przeglądarki dla szczegółów.";
        }
        
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Toggle publish status
  const togglePublishStatus = async (postId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ is_published: !currentStatus })
        .eq('id', postId);
      
      if (error) throw error;
      
      // Update local state to reflect the change
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, is_published: !currentStatus } : post
      ));
      
      toast.success(`Post ${!currentStatus ? 'opublikowany' : 'ukryty'}`);
    } catch (err) {
      console.error("Error toggling publish status:", err instanceof Error ? err.message : JSON.stringify(err));
      
      let errorMessage = "Błąd podczas zmiany statusu publikacji. ";
      if (err instanceof Error) {
        if (err.message.includes("not found") || err.message.includes("not exist")) {
          errorMessage += "Post nie został znaleziony w bazie danych.";
        } else if (err.message.includes("permission denied") || err.message.includes("not authorized")) {
          errorMessage += "Brak uprawnień do zmiany statusu posta. Sprawdź polityki RLS w bazie danych.";
        } else if (err.message.includes("Invalid API key") || err.message.includes("auth/invalid")) {
          errorMessage += "Niepoprawny klucz API. Sprawdź konfigurację Supabase.";
        } else if (err.message.includes("Network Error") || err.message.includes("fetch failed") || err.message.includes("network") || err.message.includes("fetch")) {
          errorMessage += "Problem z połączeniem sieciowym. Sprawdź połączenie internetowe.";
        } else if (err.message.includes("timeout") || err.message.includes("timed out")) {
          errorMessage += "Timeout podczas łączenia z bazą danych. Sprawdź połączenie internetowe.";
        } else if (err.message.includes("relation") || err.message.includes("does not exist") && err.message.includes("blog_posts")) {
          errorMessage += "Tabela blog_posts nie istnieje w bazie danych. Konieczne jest zaimportowanie danych.";
        } else {
          errorMessage += err.message;
        }
      } else if (err && typeof err === 'object' && 'message' in err) {
        errorMessage += (err as any).message;
      } else {
        errorMessage += "Nieznany błąd. Sprawdź konsolę przeglądarki.";
      }
      
      toast.error(errorMessage);
    }
  };

  // Delete blog post
  const handleDeletePost = async (postId: string) => {
    if (!confirm("Czy na pewno chcesz usunąć ten post? Ta operacja jest nieodwracalna.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);
      
      if (error) throw error;
      
      // Remove post from local state
      setPosts(posts.filter(post => post.id !== postId));
      
      toast.success("Post został usunięty");
    } catch (err) {
      console.error("Error deleting blog post:", err instanceof Error ? err.message : JSON.stringify(err));
      
      let errorMessage = "Błąd podczas usuwania posta. ";
      if (err instanceof Error) {
        if (err.message.includes("not found") || err.message.includes("not exist")) {
          errorMessage += "Post nie został znaleziony w bazie danych.";
        } else if (err.message.includes("permission denied") || err.message.includes("no permission")) {
          errorMessage += "Brak uprawnień do usunięcia posta.";
        } else if (err.message.includes("foreign key") || err.message.includes("constraint")) {
          errorMessage += "Ten post jest powiązany z innymi elementami i nie może być usunięty.";
        } else if (err.message.includes("Invalid API key") || err.message.includes("auth/invalid")) {
          errorMessage += "Niepoprawny klucz API. Sprawdź konfigurację Supabase.";
        } else if (err.message.includes("Network Error") || err.message.includes("fetch failed")) {
          errorMessage += "Problem z połączeniem sieciowym. Sprawdź połączenie internetowe.";
        } else {
          errorMessage += err.message;
        }
      } else {
        errorMessage += "Nieznany błąd. Sprawdź konsolę przeglądarki.";
      }
      
      toast.error(errorMessage);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Container>
          <div className="py-12 px-4">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Zarządzanie Blogiem</h1>
              <Button 
                variant="outline" 
                onClick={() => navigate("/admin-panel")}
                className="flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Powrót
              </Button>
            </div>
            
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                Zarządzaj artykułami i aktualnościami na blogu dotyczącymi CPR 2024.
              </p>
              <Button onClick={() => navigate("/admin-add-blog")}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Dodaj nowy post
              </Button>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
                {error}
                <Button 
                  variant="link" 
                  className="ml-2 text-sm underline" 
                  onClick={() => navigate("/admin-supabase-config")}
                >
                  Skonfiguruj Supabase
                </Button>
              </div>
            )}

            {isLoading ? (
              <div className="py-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="mt-2">Ładowanie postów z bloga...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <h3 className="text-xl font-medium mb-2">Brak postów na blogu</h3>
                <p className="text-gray-600 mb-4">
                  Nie znaleziono żadnych postów. Dodaj swoją pierwszą aktualność lub artykuł na blogu.
                </p>
                <Button onClick={() => navigate("/admin-add-blog")}>
                  Dodaj pierwszy post
                </Button>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tytuł
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kategoria
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Autor
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Akcje
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {posts.map((post) => (
                        <tr key={post.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {post.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {post.category || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {post.author}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(post.published_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {post.is_published ? "Opublikowany" : "Szkic"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button 
                              variant="link" 
                              className="text-blue-600 hover:text-blue-900"
                              onClick={() => navigate(`/admin-edit-blog/${post.id}`)}
                            >
                              Edytuj
                            </Button>
                            <Button 
                              variant="link" 
                              className={`${post.is_published ? 'text-amber-600 hover:text-amber-900' : 'text-green-600 hover:text-green-900'} ml-2`}
                              onClick={() => togglePublishStatus(post.id, post.is_published)}
                            >
                              {post.is_published ? "Ukryj" : "Publikuj"}
                            </Button>
                            <Button 
                              variant="link" 
                              className="text-red-600 hover:text-red-900 ml-2"
                              onClick={() => handleDeletePost(post.id)}
                            >
                              Usuń
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default AdminBlog;
