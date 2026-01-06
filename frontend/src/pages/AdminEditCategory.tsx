import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container } from "../components/Container";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/Button";
import { 
  fetchProductCategoryById, 
  fetchRequirementById, 
  updateProductCategory,
  deleteProductCategory
} from "../utils/supabase";
import { toast } from "sonner";
import { useAuth } from "../utils/AuthContext";

export default function AdminEditCategory() {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  const { session, isLoading: isAuthLoading } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthLoading && !session) {
      toast.error("Dostęp tylko dla zalogowanych administratorów");
      navigate("/login", { state: { from: `/admin-edit-category/${categoryId}` } });
    }
  }, [session, isAuthLoading, navigate, categoryId]);
  
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
  const [categoryData, setCategoryData] = useState({
    code: "",
    name: "",
    description: ""
  });
  
  const [requirementData, setRequirementData] = useState({
    id: "",
    title: "",
    description: "",
    mandatory_tests: [""],
    documentation_required: [""],
    cpr_changes: [""],
    certification_systems: [""]
  });

  // Load category and requirement data
  useEffect(() => {
    const loadData = async () => {
      if (!categoryId) return;
      
      setIsLoading(true);
      
      try {
        // Load category
        const category = await fetchProductCategoryById(categoryId);
        if (!category) {
          toast.error("Nie znaleziono kategorii produktu");
          navigate("/admin-product-categories");
          return;
        }
        
        setCategoryData({
          code: category.code,
          name: category.name,
          description: category.description
        });
        
        // Load requirement
        const requirement = await fetchRequirementById(category.requirement_id);
        if (!requirement) {
          toast.error("Nie znaleziono wymagań dla tej kategorii");
          navigate("/admin-product-categories");
          return;
        }
        
        // Przygotowanie danych requirement z domyślnymi pustymi tablicami dla brakujących pól
        const ensureArray = (arr: any[] | null | undefined): string[] => {
          if (!arr || !Array.isArray(arr) || arr.length === 0) return [""];
          return arr;
        };
        
        setRequirementData({
          id: requirement.id,
          title: requirement.title || "",
          description: requirement.description || "",
          mandatory_tests: ensureArray(requirement.mandatory_tests),
          documentation_required: ensureArray(requirement.documentation_required),
          cpr_changes: ensureArray(requirement.cpr_changes),
          certification_systems: ensureArray(requirement.certification_systems)
        });
      } catch (error) {
        console.error("Error loading category data:", error instanceof Error ? error.message : JSON.stringify(error));
        
        // Bardziej szczegółowa obsługa błędów
        let errorMessage = "Wystąpił błąd podczas ładowania danych kategorii. ";
        if (error instanceof Error) {
          if (error.message.includes("auth/invalid-api-key") || error.message.includes("Invalid API key")) {
            errorMessage += "Nieprawidłowy klucz API Supabase.";
          } else if (error.message.includes("network") || error.message.includes("fetch") || error.message.includes("Network Error")) {
            errorMessage += "Problem z połączeniem sieciowym. Sprawdź połączenie internetowe.";
          } else if (error.message.includes("does not exist") || error.message.includes("product_categories") || error.message.includes("relation")) {
            errorMessage += "Tabela product_categories nie istnieje w bazie danych. Konieczne jest zaimportowanie danych.";
          } else if (error.message.includes("permission denied")) {
            errorMessage += "Brak uprawnień do tabeli product_categories. Sprawdź polityki RLS w bazie danych.";
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
        navigate("/admin-product-categories");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [categoryId, navigate]);

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
    if (field === 'id') return; // Guard against adding to non-array fields
    
    setRequirementData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }));
  };

  // Remove item from an array field
  const removeArrayItem = (field: keyof typeof requirementData, index: number) => {
    if (field === 'id' || field === 'title' || field === 'description') return; // Guard against removing from non-array fields
    
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
    
    if (!categoryId || !requirementData.id) {
      toast.error("Brak identyfikatora kategorii lub wymagań");
      return;
    }
    
    // Validate form
    if (!categoryData.code || !categoryData.name || !requirementData.title) {
      toast.error("Proszę wypełnić wszystkie wymagane pola");
      return;
    }
    
    // Filter out empty array items
    const cleanedRequirements = {
      title: requirementData.title,
      description: requirementData.description,
      mandatory_tests: requirementData.mandatory_tests.filter(item => item.trim() !== ""),
      documentation_required: requirementData.documentation_required.filter(item => item.trim() !== ""),
      cpr_changes: requirementData.cpr_changes.filter(item => item.trim() !== ""),
      certification_systems: requirementData.certification_systems.filter(item => item.trim() !== "")
    };
    
    setIsSubmitting(true);
    
    try {
      const result = await updateProductCategory(
        categoryId,
        categoryData,
        requirementData.id,
        cleanedRequirements
      );
      
      if (result.success) {
        toast.success("Kategoria produktu została zaktualizowana");
        navigate("/admin-product-categories");
      } else {
        toast.error(`Błąd: ${result.error}`);
      }
    } catch (error) {
      console.error("Error updating product category:", error instanceof Error ? error.message : JSON.stringify(error));
      
      // Bardziej szczegółowa obsługa błędów
      let errorMessage = "Wystąpił błąd podczas aktualizacji kategorii. ";
      if (error instanceof Error) {
        if (error.message.includes("auth/invalid-api-key") || error.message.includes("Invalid API key")) {
          errorMessage += "Nieprawidłowy klucz API Supabase.";
        } else if (error.message.includes("network") || error.message.includes("fetch") || error.message.includes("Network Error")) {
          errorMessage += "Problem z połączeniem sieciowym. Sprawdź połączenie internetowe.";
        } else if (error.message.includes("permission denied")) {
          errorMessage += "Brak uprawnień do aktualizacji tabeli. Sprawdź polityki RLS w bazie danych.";
        } else if (error.message.includes("timeout") || error.message.includes("timed out")) {
          errorMessage += "Timeout podczas łączenia z bazą danych. Sprawdź połączenie internetowe.";
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

  // Handle category deletion
  const handleDeleteCategory = async () => {
    if (!categoryId) return;
    
    setIsDeleting(true);
    
    try {
      const result = await deleteProductCategory(categoryId);
      
      if (result.success) {
        toast.success("Kategoria produktu została usunięta");
        navigate("/admin-product-categories");
      } else {
        toast.error(`Błąd: ${result.error}`);
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      console.error("Error deleting product category:", error instanceof Error ? error.message : JSON.stringify(error));
      
      // Bardziej szczegółowa obsługa błędów
      let errorMessage = "Wystąpił błąd podczas usuwania kategorii. ";
      if (error instanceof Error) {
        if (error.message.includes("auth/invalid-api-key") || error.message.includes("Invalid API key")) {
          errorMessage += "Nieprawidłowy klucz API Supabase.";
        } else if (error.message.includes("network") || error.message.includes("fetch") || error.message.includes("Network Error")) {
          errorMessage += "Problem z połączeniem sieciowym. Sprawdź połączenie internetowe.";
        } else if (error.message.includes("permission denied") || error.message.includes("not authorized")) {
          errorMessage += "Brak uprawnień do usuwania w tabeli. Sprawdź polityki RLS w bazie danych.";
        } else if (error.message.includes("foreign key constraint") || error.message.includes("violates")) {
          errorMessage += "Ta kategoria jest używana przez inne elementy i nie może być usunięta.";
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
            <p className="mt-2">Ładowanie danych kategorii...</p>
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
              <h1 className="text-3xl font-bold">Edytuj Kategorię Produktu</h1>
              <Button 
                variant="outline" 
                onClick={() => navigate("/admin-product-categories")}
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
                    Czy na pewno chcesz usunąć tę kategorię produktu? Ta operacja jest nieodwracalna.
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
                      onClick={handleDeleteCategory}
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
              <div className="space-y-8">
                {/* Category Information */}
                <section>
                  <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200">Informacje o kategorii</h2>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">Kod *</label>
                      <input
                        type="text"
                        id="code"
                        name="code"
                        value={categoryData.code}
                        onChange={handleCategoryChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nazwa kategorii *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={categoryData.name}
                        onChange={handleCategoryChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Opis</label>
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={categoryData.description}
                        onChange={handleCategoryChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </section>
                
                {/* Requirement Information */}
                <section>
                  <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200">Wymagania CPR</h2>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Tytuł wymagań *</label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={requirementData.title}
                        onChange={handleRequirementChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="req-description" className="block text-sm font-medium text-gray-700 mb-1">Opis wymagań</label>
                      <textarea
                        id="req-description"
                        name="description"
                        rows={3}
                        value={requirementData.description}
                        onChange={handleRequirementChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    {/* Array fields */}
                    {[
                      { key: 'mandatory_tests' as const, label: 'Obowiązkowe testy' },
                      { key: 'documentation_required' as const, label: 'Wymagana dokumentacja' },
                      { key: 'cpr_changes' as const, label: 'Zmiany w CPR 2024' },
                      { key: 'certification_systems' as const, label: 'Systemy certyfikacji' }
                    ].map((field) => (
                      <div key={field.key} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                          <Button 
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addArrayItem(field.key)}
                            className="text-sm py-1"
                          >
                            Dodaj
                          </Button>
                        </div>
                        {requirementData[field.key].map((item, index) => (
                          <div key={`${field.key}-${index}`} className="flex gap-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => handleArrayChange(field.key, index, e.target.value)}
                              className="flex-grow p-2 border border-gray-300 rounded-md"
                              placeholder={`Wprowadź ${field.label.toLowerCase()}`}
                            />
                            {requirementData[field.key].length > 1 && (
                              <Button 
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeArrayItem(field.key, index)}
                                className="text-red-500"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </section>
                
                <div className="flex justify-between gap-4 pt-4">
                  <Button 
                    type="button" 
                    variant="destructive" 
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Usuń kategorię
                  </Button>
                  
                  <div className="flex gap-4">
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
