import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import brain from "brain";
import { Container } from "../components/Container";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "@/extensions/shadcn/components/button";
import { toast } from "sonner";
import { useAuth } from "../utils/AuthContextUnified";

function AdminImportData() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | undefined>();
  const [importMessage, setImportMessage] = useState<string>("");
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle");

  // Use the auth context
  const auth = useAuth();
  
  // Update local state when auth context changes
  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      setIsAuthenticated(true);
      setUserEmail(auth.user.email);
    } else if (!auth.isLoading && !auth.isAuthenticated) {
      // Only redirect if we're not loading and not authenticated
      navigate("/login", { state: { from: "/admin-import-data" } });
    }
  }, [auth.isAuthenticated, auth.isLoading, auth.user, navigate]);

  const handleImportData = async () => {
    setIsLoading(true);
    setImportMessage("");
    setImportStatus("idle");

    try {
      // Get token from localStorage using the unified auth system
      const token = localStorage.getItem("auth_token") || "";
      const serviceRoleKey = localStorage.getItem("supabaseServiceRoleKey") || "";
      
      // Use service role key if available, otherwise use auth token
      const adminKey = serviceRoleKey || token;
      
      if (!adminKey) {
        throw new Error("Brak tokenu autoryzacyjnego. Zaloguj się ponownie.");
      }

      console.log("Importing data with admin authorization");
      
      // Use the admin key for authorization
      const response = await brain.import_supabase_product_data({
        admin_key: adminKey
      }, {
        headers: {
          "X-Admin-Key": adminKey
        }
      });

      const result = await response.json();
      console.log("Import result:", result);
      
      if (result.success) {
        setImportMessage(result.message);
        setImportStatus("success");
        toast.success(result.message);
      } else {
        setImportMessage(result.message);
        setImportStatus("error");
        toast.error(result.message);
      }
    } catch (error) {
      // Improved error handling with detailed logging
      console.error("Error importing data:", error);
      
      let errorMessage = "Wystąpił błąd podczas importu danych.";
      
      if (error instanceof Error) {
        console.error("Error details:", error.message);
        errorMessage += ` Szczegóły błędu: ${error.message}`;
      } else if (typeof error === 'object' && error !== null) {
        // Log the full error object for debugging
        console.error("Non-Error object received:", JSON.stringify(error));
        errorMessage += " Nieznany format błędu.";
      }
      
      setImportMessage(errorMessage);
      setImportStatus("error");
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Container>
          <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/admin-panel")}
                  className="flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Powrót do panelu
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
              <h1 className="text-2xl font-bold mb-4">Import danych do Supabase</h1>
              
              {userEmail && (
                <p className="text-gray-600 mb-4">Zalogowano jako: {userEmail}</p>
              )}
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Informacje o imporcie danych</h2>
                <p className="text-gray-600 mb-4">
                  Ta operacja zaimportuje początkowe dane do bazy Supabase, w tym:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-gray-600">
                  <li>Kategorie produktów (36 kategorii)</li>
                  <li>Wymagania dla produktów (podstawowe i szczegółowe dla wybranych kategorii)</li>
                  <li>Relacje między kategoriami a wymaganiami</li>
                </ul>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-blue-800 mb-4">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Ważna informacja</h3>
                      <p className="mt-1 text-sm">
                        Ten proces utworzy niezbędne tabele w bazie danych jeśli nie istnieją. 
                        Istniejące dane zostaną zastąpione. Upewnij się, że konfiguracja Supabase 
                        jest poprawna przed kontynuowaniem.
                      </p>
                      <p className="mt-2 text-sm">
                        Aby ta operacja się powiodła, potrzebne są poprawnie skonfigurowane dane dostępowe Supabase 
                        oraz klucz administracyjny (service role key). Jeśli nie masz skonfigurowanych tych danych, 
                        przejdź najpierw do <a href="/admin-supabase-config" className="text-blue-600 underline hover:text-blue-800">konfiguracji Supabase</a>.
                      </p>
                    </div>
                  </div>
                </div>
                
                {importStatus === "success" && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div className="ml-3">
                        <p className="text-sm text-green-700">{importMessage}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {importStatus === "error" && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{importMessage}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={handleImportData} 
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Importowanie...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      Importuj dane
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/admin-panel")}
                >
                  Anuluj
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default AdminImportData;
