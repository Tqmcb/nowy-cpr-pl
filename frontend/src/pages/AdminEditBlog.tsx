import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container } from "../components/Container";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/Button";
import { supabase } from "../utils/supabase";
import { toast } from "sonner";
import { useAuth } from "../utils/AuthContext";

// Type for blog post
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

export default function AdminEditBlog() {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const { session, isLoading: isAuthLoading } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthLoading && !session) {
      toast.error("Dostęp tylko dla zalogowanych administratorów");
      navigate("/login", { state: { from: `/admin-edit-blog/${postId}` } });
    }
  }, [session, isAuthLoading, navigate, postId]);
  
  // Show loading state while checking auth
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2">Weryfikacja uprawnień...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Form state
  const [formData, setFormData] = useState<BlogPost>({
    id: "",
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image_url: "",
    author: "",
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_published: false,
    category: ""
  });

  // Load blog post
  useEffect(() => {
    const loadPost = async () => {
      if (!postId) return;
      
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', postId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setFormData(data as BlogPost);
        } else {
          toast.error("Nie znaleziono posta");
          navigate("/admin-blog");
        }
      } catch (err) {
        console.error("Error loading blog post:", err instanceof Error ? err.message : JSON.stringify(err));
        
        // Bardziej szczegółowa obsługa błędów
        let errorMessage = "Wystąpił błąd podczas ładowania posta. ";
        
        if (err instanceof Error) {
          if (err.message.includes("auth/invalid-api-key") || err.message.includes("Invalid API key")) {
            errorMessage += "Nieprawidłowy klucz API Supabase.";
          } else if (err.message.includes("network") || err.message.includes("fetch") || err.message.includes("Network Error")) {
            errorMessage += "Problem z połączeniem sieciowym. Sprawdź połączenie internetowe.";
          } else if (err.message.includes("permission denied") || err.message.includes("not authorized")) {
            errorMessage += "Brak uprawnień do odczytu postów. Sprawdź polityki RLS w bazie danych.";
          } else if (err.message.includes("timeout") || err.message.includes("timed out")) {
            errorMessage += "Timeout podczas łączenia z bazą danych. Sprawdź połączenie internetowe.";
          } else if (err.message.includes("relation") || err.message.includes("does not exist")) {
            errorMessage += "Tabela blog_posts nie istnieje w bazie danych. Konieczne jest zaimportowanie schematu bazy danych.";
          } else {
            errorMessage += err.message;
          }
        } else if (err && typeof err === 'object' && 'message' in err) {
          errorMessage += (err as any).message;
        } else {
          errorMessage += "Nieznany błąd. Sprawdź konsolę przeglądarki dla szczegółów.";
        }
        
        toast.error(errorMessage);
        navigate("/admin-blog");
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [postId, navigate]);

  // Handle text inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  // Auto-generate slug from title if it's not set yet
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    
    // Only auto-update slug if it matches the previous auto-generated value
    const currentSlug = formData.slug;
    const previousAutoSlug = createSlug(formData.title);
    
    setFormData(prev => ({
      ...prev,
      title,
      slug: currentSlug === previousAutoSlug ? createSlug(title) : currentSlug
    }));
  };

  // Create a URL-friendly slug from a string
  const createSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!postId) return;
    
    // Basic validation
    if (!formData.title || !formData.content) {
      toast.error("Tytuł i treść artykułu są wymagane");
      return;
    }
    
    if (!formData.slug) {
      setFormData(prev => ({ ...prev, slug: createSlug(formData.title) }));
    }
    
    setIsSubmitting(true);
    
    try {
      // Update the post with current timestamp
      const updatedPost = {
        ...formData,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('blog_posts')
        .update(updatedPost)
        .eq('id', postId);
      
      if (error) throw error;
      
      toast.success("Post zaktualizowany");
      navigate("/admin-blog");
    } catch (err) {
      console.error("Error updating blog post:", err instanceof Error ? err.message : JSON.stringify(err));
      
      // Bardziej szczegółowa obsługa błędów
      let errorMessage = "Wystąpił błąd podczas aktualizacji posta. ";
      
      if (err instanceof Error) {
        if (err.message.includes("auth/invalid-api-key") || err.message.includes("Invalid API key")) {
          errorMessage += "Nieprawidłowy klucz API Supabase.";
        } else if (err.message.includes("network") || err.message.includes("fetch") || err.message.includes("Network Error")) {
          errorMessage += "Problem z połączeniem sieciowym. Sprawdź połączenie internetowe.";
        } else if (err.message.includes("permission denied") || err.message.includes("not authorized")) {
          errorMessage += "Brak uprawnień do edycji postów. Sprawdź polityki RLS w bazie danych.";
        } else if (err.message.includes("timeout") || err.message.includes("timed out")) {
          errorMessage += "Timeout podczas łączenia z bazą danych. Sprawdź połączenie internetowe.";
        } else if (err.message.includes("relation") || err.message.includes("does not exist")) {
          errorMessage += "Tabela blog_posts nie istnieje w bazie danych. Konieczne jest zaimportowanie schematu bazy danych.";
        } else {
          errorMessage += err.message;
        }
      } else if (err && typeof err === 'object' && 'message' in err) {
        errorMessage += (err as any).message;
      } else {
        errorMessage += "Nieznany błąd. Sprawdź konsolę przeglądarki dla szczegółów.";
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle post deletion
  const handleDeletePost = async () => {
    if (!postId) return;
    
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);
      
      if (error) throw error;
      
      toast.success("Post został usunięty");
      navigate("/admin-blog");
    } catch (err) {
      console.error("Error deleting blog post:", err instanceof Error ? err.message : JSON.stringify(err));
      
      // Bardziej szczegółowa obsługa błędów
      let errorMessage = "Wystąpił błąd podczas usuwania posta. ";
      
      if (err instanceof Error) {
        if (err.message.includes("auth/invalid-api-key") || err.message.includes("Invalid API key")) {
          errorMessage += "Nieprawidłowy klucz API Supabase.";
        } else if (err.message.includes("network") || err.message.includes("fetch") || err.message.includes("Network Error")) {
          errorMessage += "Problem z połączeniem sieciowym. Sprawdź połączenie internetowe.";
        } else if (err.message.includes("permission denied") || err.message.includes("not authorized")) {
          errorMessage += "Brak uprawnień do usuwania postów. Sprawdź polityki RLS w bazie danych.";
        } else if (err.message.includes("timeout") || err.message.includes("timed out")) {
          errorMessage += "Timeout podczas łączenia z bazą danych. Sprawdź połączenie internetowe.";
        } else {
          errorMessage += err.message;
        }
      } else if (err && typeof err === 'object' && 'message' in err) {
        errorMessage += (err as any).message;
      } else {
        errorMessage += "Nieznany błąd. Sprawdź konsolę przeglądarki dla szczegółów.";
      }
      
      toast.error(errorMessage);
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2">Ładowanie posta...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Container>
          <div className="py-12 px-4">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Edytuj Post</h1>
              <Button 
                variant="outline" 
                onClick={() => navigate("/admin-blog")}
                className="flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Powrót
              </Button>
            </div>
            
            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                  <h3 className="text-xl font-bold mb-4">Potwierdź usunięcie</h3>
                  <p className="mb-6 text-gray-600">
                    Czy na pewno chcesz usunąć ten post? Ta operacja jest nieodwracalna.
                  </p>
                  <div className="flex justify-end gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isDeleting}
                    >
                      Anuluj
                    </Button>
                    <Button 
                      className="bg-red-600 hover:bg-red-700"
                      onClick={handleDeletePost}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <div className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                          Usuwanie...
                        </>
                      ) : "Usuń"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Tytuł *</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleTitleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                    <input
                      type="text"
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Kategoria</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Wybierz kategorię</option>
                      <option value="Wytyczne CPR">Wytyczne CPR</option>
                      <option value="Aktualności">Aktualności</option>
                      <option value="Certyfikacja">Certyfikacja</option>
                      <option value="Interpretacje prawne">Interpretacje prawne</option>
                      <option value="Case study">Case study</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Zespół NowyCPR.pl"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">URL Obrazka</label>
                    <input
                      type="text"
                      id="image_url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">Opis skrócony</label>
                    <textarea
                      id="excerpt"
                      name="excerpt"
                      rows={2}
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Krótki opis pojawiający się na liście artykułów"
                    />
                  </div>
                </div>
                
                {/* Publication date */}
                <div>
                  <label htmlFor="published_at" className="block text-sm font-medium text-gray-700 mb-1">
                    Data publikacji
                  </label>
                  <div className="text-sm text-gray-600">
                    {new Date(formData.published_at).toLocaleDateString('pl-PL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                
                {/* Content */}
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Treść *</label>
                  <textarea
                    id="content"
                    name="content"
                    rows={15}
                    value={formData.content}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md font-mono"
                    placeholder="Wpisz treść artykułu..."
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">Wspierane formatowanie Markdown</p>
                </div>
                
                {/* Publication status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_published"
                    name="is_published"
                    checked={formData.is_published}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="is_published" className="ml-2 block text-sm text-gray-700">
                    Opublikowany
                  </label>
                </div>
                
                <div className="flex justify-between gap-4 pt-4">
                  <Button 
                    type="button" 
                    variant="destructive" 
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Usuń post
                  </Button>
                  
                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      type="button" 
                      onClick={() => navigate("/admin-blog")}
                    >
                      Anuluj
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                          Zapisywanie...
                        </>
                      ) : "Zapisz zmiany"}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
