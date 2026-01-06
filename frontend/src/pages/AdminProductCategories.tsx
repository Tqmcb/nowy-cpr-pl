import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "../components/Container";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/extensions/shadcn/components/card";
import { Button } from "@/extensions/shadcn/components/button";
import { Input } from "@/extensions/shadcn/components/input";
import { fetchProductCategories, deleteProductCategory } from "../utils/supabase/admin";
import { toast } from "sonner";
import { useAuth } from "../utils/AuthContextUnified";
import { AuthWrapper } from "../components/AuthWrapper";

function AdminProductCategories() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Load product categories
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchProductCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error loading product categories:", err instanceof Error ? err.message : JSON.stringify(err));
      
      let errorMessage = "Nie udało się załadować kategorii produktów. ";
      if (err instanceof Error) {
        if (err.message.includes("auth/invalid-api-key") || err.message.includes("Invalid API key")) {
          errorMessage += "Nieprawidłowy klucz API Supabase.";
        } else if (err.message.includes("network") || err.message.includes("fetch") || err.message.includes("Network Error")) {
          errorMessage += "Problem z połączeniem sieciowym. Sprawdź połączenie internetowe.";
        } else if (err.message.includes("does not exist") || err.message.includes("product_categories") || err.message.includes("relation")) {
          errorMessage += "Tabela product_categories nie istnieje w bazie danych. Konieczne jest zaimportowanie danych.";
        } else if (err.message.includes("permission denied")) {
          errorMessage += "Brak uprawnień do tabeli product_categories. Sprawdź polityki RLS w bazie danych.";
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

  // Handle delete category
  const handleDelete = async (categoryId) => {
    if (window.confirm("Czy na pewno chcesz usunąć tę kategorię produktu? Ta operacja jest nieodwracalna.")) {
      setIsDeleting(true);
      try {
        const result = await deleteProductCategory(categoryId);
        if (result.success) {
          toast.success("Kategoria została usunięta");
          // Refresh the list
          loadCategories();
        } else {
          toast.error(`Błąd: ${result.error}`);
        }
      } catch (err) {
        console.error("Error deleting category:", err instanceof Error ? err.message : JSON.stringify(err));
        
        let errorMessage = "Nie udało się usunąć kategorii. ";
        if (err instanceof Error) {
          errorMessage += err.message;
        } else {
          errorMessage += "Nieznany błąd.";
        }
        
        toast.error(errorMessage);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Filter categories based on search query
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Kategorie Produktów</h1>
            <p className="text-muted-foreground mt-1">Zarządzaj kategoriami produktów i ich wymaganiami CPR</p>
          </div>
          <Button onClick={() => navigate("/admin-add-category")}>
            Dodaj nową kategorię
          </Button>
        </div>
        
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-muted-foreground">Ładowanie kategorii produktów...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kategorie Produktów</h1>
          <p className="text-muted-foreground mt-1">Zarządzaj kategoriami produktów i ich wymaganiami CPR</p>
        </div>
        <Button onClick={() => navigate("/admin-add-category")}>
          Dodaj nową kategorię
        </Button>
      </div>

      {error ? (
        <Card className="border-red-200 bg-red-50 mb-6">
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-4 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Błąd ładowania danych</h2>
            <p className="text-gray-700 mb-4">{error}</p>
            <div className="flex justify-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate("/admin-dashboard")}
              >
                Powrót do dashboardu
              </Button>
              <Button onClick={loadCategories}>
                Spróbuj ponownie
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-6">
            <Input
              type="text"
              placeholder="Szukaj kategorii..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          {filteredCategories.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground my-8">
                  {searchQuery ? 
                    "Nie znaleziono kategorii pasujących do zapytania" : 
                    "Brak kategorii produktów. Dodaj pierwszą kategorię."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCategories.map((category) => (
                <Card key={category.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{category.name}</CardTitle>
                        <CardDescription>Kod: {category.code}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="line-clamp-2 text-muted-foreground text-sm">
                      {category.description || "Brak opisu"}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4 pb-4">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate(`/admin-view-category/${category.id}`)}
                    >
                      Szczegóły
                    </Button>
                    <div className="space-x-2">
                      <Button 
                        variant="ghost" 
                        onClick={() => navigate(`/admin-edit-category/${category.id}`)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      >
                        Edytuj
                      </Button>
                      <Button 
                        variant="ghost" 
                        onClick={() => handleDelete(category.id)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        Usuń
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Export with wrapper
export default function WrappedAdminProductCategories() {
  return (
    <AuthWrapper>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Container>
            <AdminProductCategories />
          </Container>
        </main>
        <Footer />
      </div>
    </AuthWrapper>
  );
}