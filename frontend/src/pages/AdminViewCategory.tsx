import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container } from "../components/Container";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "@/extensions/shadcn/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/extensions/shadcn/components/card";
import { fetchProductWithRequirements } from "../utils/supabase/admin";
import { toast } from "sonner";
import { useAuth } from "../utils/AuthContextUnified";
import { AuthWrapper } from "../components/AuthWrapper";

function AdminViewCategory() {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  const { auth } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Load product data
  useEffect(() => {
    const loadData = async () => {
      if (!categoryId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await fetchProductWithRequirements(categoryId);
        if (!data) {
          setError("Nie znaleziono kategorii produktu");
          return;
        }
        
        setProduct(data);
      } catch (err) {
        console.error("Error loading product data:", err instanceof Error ? err.message : JSON.stringify(err));
        
        let errorMessage = "Nie udało się załadować danych produktu. ";
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

    loadData();
  }, [categoryId]);

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Szczegóły Kategorii Produktu</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate("/admin-product-categories")}
          >
            Powrót do listy
          </Button>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-muted-foreground">Ładowanie danych kategorii...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Szczegóły Kategorii Produktu</h1>
            <p className="text-muted-foreground mt-1">Informacje o kategorii i jej wymaganiach</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate("/admin-product-categories")}
          >
            Powrót do listy
          </Button>
        </div>
              
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-4 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Błąd ładowania danych</h2>
            <p className="text-gray-700 mb-4">{error || "Nie znaleziono kategorii produktu"}</p>
            <Button 
              onClick={() => navigate("/admin-product-categories")}
            >
              Wróć do listy kategorii
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Szczegóły Kategorii Produktu</h1>
                <p className="text-muted-foreground mt-1">Informacje o kategorii i jej wymaganiach związanych z CPR 2024</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate("/admin-product-categories")}
              >
                Powrót do listy
              </Button>
            </div>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Informacje o kategorii</CardTitle>
                <CardDescription>
                  Podstawowe informacje o kategorii produktu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Kod</p>
                    <p className="text-lg font-medium">{product.code || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nazwa kategorii</p>
                    <p className="text-lg font-medium">{product.name}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Opis</p>
                    <p className="text-base">{product.description || "Brak opisu"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Wymagania CPR</CardTitle>
                <CardDescription>
                  Szczegółowe wymagania CPR 2024 dla tej kategorii produktu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tytuł wymagań</p>
                    <p className="text-lg font-medium">{product.requirements.title}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Opis wymagań</p>
                    <p className="text-base">{product.requirements.description || "Brak opisu wymagań"}</p>
                  </div>
                  
                  {/* Display arrays */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Mandatory Tests */}
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="font-bold text-lg mb-2">Obowiązkowe testy</h3>
                      {product.requirements.mandatoryTests && product.requirements.mandatoryTests.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1">
                          {product.requirements.mandatoryTests.map((test: string, index: number) => (
                            <li key={index}>{test}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground italic">Brak danych</p>
                      )}
                    </div>
                    
                    {/* Documentation Required */}
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="font-bold text-lg mb-2">Wymagana dokumentacja</h3>
                      {product.requirements.documentationRequired && product.requirements.documentationRequired.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1">
                          {product.requirements.documentationRequired.map((doc: string, index: number) => (
                            <li key={index}>{doc}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground italic">Brak danych</p>
                      )}
                    </div>
                    
                    {/* CPR Changes */}
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="font-bold text-lg mb-2">Zmiany w CPR 2024</h3>
                      {product.requirements.cprChanges && product.requirements.cprChanges.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1">
                          {product.requirements.cprChanges.map((change: string, index: number) => (
                            <li key={index}>{change}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground italic">Brak danych</p>
                      )}
                    </div>
                    
                    {/* Certification Systems */}
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="font-bold text-lg mb-2">Systemy certyfikacji</h3>
                      {product.requirements.certificationSystems && product.requirements.certificationSystems.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1">
                          {product.requirements.certificationSystems.map((system: string, index: number) => (
                            <li key={index}>{system}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground italic">Brak danych</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
    </div>
  );
}

export default AdminViewCategory;