import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "../components/Container";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "@/extensions/shadcn/components/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/extensions/shadcn/components/card";
import { Input } from "@/extensions/shadcn/components/input";
import { Textarea } from "@/extensions/shadcn/components/textarea";
import { createProductCategory } from "../utils/supabase/admin";
import { toast } from "sonner";
import { useAuth } from "../utils/AuthContextUnified";
import { AuthWrapper } from "../components/AuthWrapper";

function AdminAddCategory() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [categoryData, setCategoryData] = useState({
    code: "",
    name: "",
    description: ""
  });
  
  const [requirementData, setRequirementData] = useState({
    title: "",
    description: "",
    mandatory_tests: [""],
    documentation_required: [""],
    cpr_changes: [""],
    certification_systems: [""]
  });

  // Handle category inputs
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCategoryData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle requirement inputs (simple fields)
  const handleRequirementChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRequirementData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle array inputs for requirements
  const handleArrayChange = (field: keyof typeof requirementData, index: number, value: string) => {
    setRequirementData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return {
        ...prev,
        [field]: newArray
      };
    });
  };

  // Add new item to an array field
  const addArrayItem = (field: keyof typeof requirementData) => {
    setRequirementData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }));
  };

  // Remove item from an array field
  const removeArrayItem = (field: keyof typeof requirementData, index: number) => {
    setRequirementData(prev => {
      const newArray = [...prev[field]];
      newArray.splice(index, 1);
      // Ensure we always have at least one item
      if (newArray.length === 0) newArray.push("");
      return {
        ...prev,
        [field]: newArray
      };
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!categoryData.code || !categoryData.name || !requirementData.title) {
      toast.error("Proszę wypełnić wszystkie wymagane pola");
      return;
    }
    
    // Filter out empty array items
    const cleanedRequirements = {
      ...requirementData,
      mandatory_tests: requirementData.mandatory_tests.filter(item => item.trim() !== ""),
      documentation_required: requirementData.documentation_required.filter(item => item.trim() !== ""),
      cpr_changes: requirementData.cpr_changes.filter(item => item.trim() !== ""),
      certification_systems: requirementData.certification_systems.filter(item => item.trim() !== "")
    };
    
    setIsSubmitting(true);
    
    try {
      const result = await createProductCategory(categoryData, cleanedRequirements);
      
      if (result.success) {
        toast.success("Kategoria produktu została dodana");
        navigate("/admin-product-categories");
      } else {
        toast.error(`Błąd: ${result.error}`);
      }
    } catch (error) {
      console.error("Error adding product category:", error instanceof Error ? error.message : JSON.stringify(error));
      
      // Bardziej szczegółowa obsługa błędów
      let errorMessage = "Wystąpił błąd podczas dodawania kategorii. ";
      if (error instanceof Error) {
        if (error.message.includes("auth/invalid-api-key") || error.message.includes("Invalid API key")) {
          errorMessage += "Nieprawidłowy klucz API Supabase.";
        } else if (error.message.includes("network") || error.message.includes("fetch") || error.message.includes("Network Error")) {
          errorMessage += "Problem z połączeniem sieciowym. Sprawdź połączenie internetowe.";
        } else if (error.message.includes("permission denied") || error.message.includes("not authorized")) {
          errorMessage += "Brak uprawnień do dodawania rekordów. Sprawdź polityki RLS w bazie danych.";
        } else if (error.message.includes("duplicate key") || error.message.includes("unique constraint")) {
          errorMessage += "Kategoria o podanym kodzie już istnieje. Użyj unikalnego kodu.";
        } else if (error.message.includes("timeout") || error.message.includes("timed out")) {
          errorMessage += "Timeout podczas łączenia z bazą danych. Sprawdź połączenie internetowe.";
        } else if (error.message.includes("relation") || error.message.includes("does not exist")) {
          errorMessage += "Tabele nie istnieją. Konieczne jest zaimportowanie schematu bazy danych.";
        } else {
          errorMessage += error.message;
        }
      } else if (error === null || error === undefined) {
        errorMessage += "Nie można połączyć się z bazą danych. Sprawdź konfigurację Supabase.";
      } else if (typeof error === 'object') {
        // Jeśli to obiekt, możemy spróbować pobrać wiadomość błędu
        const errorObj = error as Record<string, unknown>;
        if (errorObj.message && typeof errorObj.message === 'string') {
          errorMessage += errorObj.message;
        } else if (errorObj.error && typeof errorObj.error === 'string') {
          errorMessage += errorObj.error;
        } else {
          errorMessage += "Nieznany błąd obiektu. Sprawdź konsolę przeglądarki dla szczegółów.";
        }
      } else {
        errorMessage += "Nieznany błąd. Sprawdź konsolę przeglądarki dla szczegółów.";
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dodaj Kategorię Produktu</h1>
          <p className="text-muted-foreground mt-1">Utwórz nową kategorię produktu wraz z wymaganiami CPR</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate("/admin-product-categories")}
        >
          Powrót do listy
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informacje o kategorii</CardTitle>
            <CardDescription>Wprowadź podstawowe informacje o kategorii produktu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium">Kod *</label>
                <Input
                  id="code"
                  name="code"
                  value={categoryData.code}
                  onChange={handleCategoryChange}
                  placeholder="np. KAT-01"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Nazwa kategorii *</label>
                <Input
                  id="name"
                  name="name"
                  value={categoryData.name}
                  onChange={handleCategoryChange}
                  placeholder="np. Okna i drzwi"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="description" className="text-sm font-medium">Opis</label>
                <Textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={categoryData.description}
                  onChange={handleCategoryChange}
                  placeholder="Opisz kategorię produktu"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Wymagania CPR</CardTitle>
            <CardDescription>Określ wymagania związane z CPR 2024 dla tej kategorii</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Tytuł wymagań *</label>
                <Input
                  id="title"
                  name="title"
                  value={requirementData.title}
                  onChange={handleRequirementChange}
                  placeholder="np. Wymagania CPR 2024 dla okien i drzwi"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="req-description" className="text-sm font-medium">Opis wymagań</label>
                <Textarea
                  id="req-description"
                  name="description"
                  rows={3}
                  value={requirementData.description}
                  onChange={handleRequirementChange}
                  placeholder="Ogólny opis wymagań dla tej kategorii"
                />
              </div>
              
              {/* Array fields */}
              {[
                { key: 'mandatory_tests' as const, label: 'Obowiązkowe testy' },
                { key: 'documentation_required' as const, label: 'Wymagana dokumentacja' },
                { key: 'cpr_changes' as const, label: 'Zmiany w CPR 2024' },
                { key: 'certification_systems' as const, label: 'Systemy certyfikacji' }
              ].map((field) => (
                <div key={field.key} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">{field.label}</label>
                    <Button 
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayItem(field.key)}
                    >
                      Dodaj nowy
                    </Button>
                  </div>
                  {requirementData[field.key].map((item, index) => (
                    <div key={`${field.key}-${index}`} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => handleArrayChange(field.key, index, e.target.value)}
                        placeholder={`Wprowadź ${field.label.toLowerCase()}`}
                      />
                      {requirementData[field.key].length > 1 && (
                        <Button 
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeArrayItem(field.key, index)}
                          className="text-destructive border-destructive hover:bg-destructive/10"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 mt-6">
          <Button 
            variant="outline" 
            type="button" 
            onClick={() => navigate("/admin-product-categories")}
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
                Dodawanie...
              </>
            ) : "Dodaj kategorię"}
          </Button>
        </div>
      </form>
    </div>
  );
}

// Export with wrapper
export default function WrappedAdminAddCategory() {
  return (
    <AuthWrapper>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Container>
            <AdminAddCategory />
          </Container>
        </main>
        <Footer />
      </div>
    </AuthWrapper>
  );
}