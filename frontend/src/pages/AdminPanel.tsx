import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "../components/Container";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/Button";
import { supabaseClient, supabaseDb } from "../utils/supabase";
import { toast } from "sonner";
import { useAuth } from "../utils/AuthContext";
import { AuthWrapper } from "../components/AuthWrapper";

function AdminPanel() {
  const navigate = useNavigate();
  // State to track if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | undefined>();
  const [supabaseConnectionStatus, setSupabaseConnectionStatus] = useState<"checking" | "connected" | "error" | "missing-tables">("checking");
  const [connectionError, setConnectionError] = useState<string | null>(null);
  // Check if we have valid Supabase config
  const [config, setConfig] = useState({
    hasValidConfig: false,
    url: '',
    key: ''
  });
  
  // Load config on mount
  useEffect(() => {
    const loadConfig = async () => {
      // Read from localStorage
      const url = localStorage.getItem('supabaseUrl') || '';
      const key = localStorage.getItem('supabaseKey') || '';
      
      setConfig({
        url,
        key,
        hasValidConfig: !!(url && key)
      });
    };
    
    loadConfig();
  }, []);
  
  // Use the auth context
  const auth = useAuth();
  
  // Update local state when auth context changes
  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      setIsAuthenticated(true);
      setUserEmail(auth.user.email);
      setIsLoading(false);
    } else if (!auth.isLoading && !auth.isAuthenticated) {
      // Only redirect if we're not loading and not authenticated
      navigate("/login", { state: { from: "/admin-panel" } });
    }
  }, [auth.isAuthenticated, auth.isLoading, auth.user, navigate]);

  // Check Supabase connection
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        if (!config.hasValidConfig) {
          setSupabaseConnectionStatus("error");
          setConnectionError("Brak poprawnej konfiguracji Supabase.");
          return;
        }
        
        // Try a simple query to test connection
        const { data, error } = await supabaseDb.getRecords(
          'product_categories',
          'count', 
          [],
          { limit: 1 }
        );
        
        if (error) {
          console.error('Supabase connection error:', error.message || 'Unknown error', error);
          
          // Check if it's a "relation does not exist" error (missing tables)
          if (error.message && (
              error.message.includes('relation') && 
              error.message.includes('does not exist') ||
              error.message.toLowerCase().includes('table') ||
              error.code === '42P01'
          )) {
            console.log('Detected missing tables in database');
            setSupabaseConnectionStatus("missing-tables");
            setConnectionError("Połączenie udane, ale baza danych nie zawiera wymaganych tabel. Konieczne jest zaimportowanie danych.");
          } else {
            setSupabaseConnectionStatus("error");
            setConnectionError(error.message || "Nieznany błąd podczas połączenia z bazą danych.");
          }
        } else {
          console.log('Supabase connection successful');
          setSupabaseConnectionStatus("connected");
          setConnectionError(null);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 
                           (error && typeof error === 'object' && 'message' in error) ? (error as any).message : 
                           'Unknown error';
        console.error('Supabase connection check failed:', errorMessage, error);
        setSupabaseConnectionStatus("error");
        setConnectionError(errorMessage || "Nieznany błąd podczas połączenia z bazą danych.");
      }
    };
    
    checkSupabaseConnection();
  }, [config.hasValidConfig]);
  
  // Check authentication on component mount
  useEffect(() => {
    // Authentication is now handled by the auth context
    setIsLoading(auth.isLoading);
  }, [auth.isLoading]);

  // Admin panel sections
  const adminSections = [
    {
      title: "Kategorie Produktów",
      description: "Zarządzaj kategoriami produktów i ich wymaganiami CPR",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      link: "/admin-product-categories"
    },
    {
      title: "Blog i Aktualności",
      description: "Dodawaj i edytuj artykuły na blogu oraz aktualności",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      link: "/admin-blog"
    },
    {
      title: "Dokumenty",
      description: "Zarządzaj dokumentami dostępnymi do pobrania",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      link: "/admin-documents"
    },
    {
      title: "Konfiguracja Supabase",
      description: "Skonfiguruj integrację z bazą danych Supabase",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      link: "/admin-supabase-config"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2">Ładowanie panelu administracyjnego...</p>
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold">Panel Administracyjny</h1>
                {userEmail && (
                  <p className="text-gray-600 mt-1">Zalogowano jako: {userEmail}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/")}
                  className="flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Strona główna
                </Button>
                <Button onClick={async () => {
                  try {
                    await auth.signOut();
                    toast.success("Wylogowano pomyślnie");
                    navigate("/login");
                  } catch (error) {
                    console.error("Błąd podczas wylogowywania:", error);
                    toast.error("Wystąpił błąd podczas wylogowywania");
                  }
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                  Wyloguj
                </Button>
              </div>
            </div>
            
            <div className="mb-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-blue-800">
                Witaj w panelu administracyjnym. Tutaj możesz zarządzać treścią strony, kategoriami produktów, aktualnościami i dokumentami.
              </p>
            </div>
            
            {supabaseConnectionStatus === "error" && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 h-5 w-5 text-red-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Błąd połączenia z bazą danych Supabase</h3>
                    <p className="mt-1 text-sm text-red-700">
                      {connectionError || "Nie można połączyć się z bazą danych. Sprawdź konfigurację Supabase i upewnij się, że serwer jest dostępny."}
                    </p>
                <div className="mt-2 flex space-x-2">
                      <Button 
                        variant="secondary"
                        onClick={() => navigate("/admin-import-data")}
                        className="text-sm py-1"
                      >
                        Importuj dane
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => navigate("/admin-supabase-config")}
                        className="text-sm py-1"
                      >
                        Sprawdź konfigurację
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {supabaseConnectionStatus === "missing-tables" && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 h-5 w-5 text-amber-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">Brak wymaganych tabel w bazie danych</h3>
                    <p className="mt-1 text-sm text-amber-700">
                      {connectionError || "Połączenie z bazą danych jest poprawne, ale nie znaleziono wymaganych tabel. Konieczne jest zaimportowanie początkowych danych."}
                    </p>
                    <div className="mt-2 flex space-x-2">
                      <Button 
                        variant="secondary"
                        onClick={() => navigate("/admin-import-data")}
                        className="text-sm py-1"
                      >
                        Importuj dane
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => navigate("/admin-supabase-config")}
                        className="text-sm py-1"
                      >
                        Sprawdź konfigurację
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {!config.hasValidConfig && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 h-5 w-5 text-yellow-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Brak poprawnej konfiguracji Supabase</h3>
                    <p className="mt-1 text-sm text-yellow-700">
                      Przed korzystaniem z panelu administracyjnego, konieczne jest poprawne skonfigurowanie połączenia z bazą danych Supabase.
                    </p>
                    <div className="mt-2">
                      <Button 
                        variant="secondary"
                        onClick={() => navigate("/admin-supabase-config")}
                        className="text-sm py-1"
                      >
                        Przejdź do konfiguracji
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
              {adminSections.map((section, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                  onClick={() => navigate(section.link)}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      {section.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{section.title}</h3>
                      <p className="text-gray-600 mb-4">{section.description}</p>
                      <Button onClick={(e) => {
                        e.stopPropagation();
                        navigate(section.link);
                      }}>
                        Przejdź
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-4">Szybkie akcje</h2>
              <div className="flex flex-wrap gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/")}
                  className="flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Podgląd strony głównej
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate("/admin-import-data")}
                  className="flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  Importuj dane
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

export default AdminPanel;
