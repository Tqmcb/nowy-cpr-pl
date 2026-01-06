import { useState } from "react";
import { useNavigate } from "react-router-dom";
import brain from "brain";
import { Container } from "../components/Container";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { AuthWrapper } from "../components/AuthWrapper";
import { useAuth } from "../utils/AuthContextUnified";

function AdminSupabaseConfig() {
  const navigate = useNavigate();
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseKey, setSupabaseKey] = useState("");
  const [serviceRoleKey, setServiceRoleKey] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  
  // Use the auth context
  const auth = useAuth();
  
  // Redirect to login if not authenticated
  if (!auth.isLoading && !auth.isAuthenticated) {
    navigate("/login", { state: { from: "/admin-supabase-config" } });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setMessageType("");

    try {
      if (!supabaseUrl || !supabaseKey || !serviceRoleKey || !adminKey) {
        setMessage("Wszystkie pola są wymagane");
        setMessageType("error");
        setIsLoading(false);
        return;
      }
      
      // Podstawowa walidacja URL
      if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('supabase.co')) {
        setMessage("URL Supabase musi zaczynać się od 'https://' i zawierać 'supabase.co'");
        setMessageType("error");
        setIsLoading(false);
        return;
      }
      
      // Sprawdź minimalną długość kluczy
      if (supabaseKey.length < 20 || !supabaseKey.startsWith('ey')) {
        setMessage("Klucz anonimowy Supabase jest nieprawidłowy. Musi mieć co najmniej 20 znaków i zaczynać się od 'ey'");
        setMessageType("error");
        setIsLoading(false);
        return;
      }
      
      // Sprawdź klucz service role, jeśli podany
      if (serviceRoleKey && (serviceRoleKey.length < 20 || !serviceRoleKey.startsWith('ey'))) {
        setMessage("Klucz Service Role Supabase jest nieprawidłowy. Musi mieć co najmniej 20 znaków i zaczynać się od 'ey'");
        setMessageType("error");
        setIsLoading(false);
        return;
      }
      
      console.info('Wysyłanie konfiguracji Supabase:', { 
        url: supabaseUrl, 
        keyLength: supabaseKey.length, 
        serviceRoleKeyLength: serviceRoleKey.length,
        adminKeyProvided: !!adminKey
      });
      
      // Use the renamed endpoint function from our API
      const response = await brain.save_supabase_config({
        supabase_url: supabaseUrl,
        supabase_anon_key: supabaseKey,
        supabase_service_role_key: serviceRoleKey,
        admin_key: adminKey
      });

      const result = await response.json();
      console.info('Wynik zapisywania konfiguracji:', result);
      
      if (result.success) {
        setMessage(result.message || "Konfiguracja została zapisana pomyślnie");
        setMessageType("success");
        
        // Update the supabase configuration in localStorage
        localStorage.setItem("supabaseUrl", supabaseUrl);
        localStorage.setItem("supabaseKey", supabaseKey);
        // If service role key is provided, save it too
        if (serviceRoleKey) {
          localStorage.setItem("supabaseServiceRoleKey", serviceRoleKey);
        }
        
        console.info('Konfiguracja zapisana w localStorage', { 
          url: supabaseUrl, 
          keyStart: supabaseKey.substring(0, 10) + '...',
          serviceRoleKeyExists: !!serviceRoleKey
        });
        
        // Reload after 2 seconds to apply the new configuration
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessage(result.message || "Wystąpił błąd podczas zapisywania konfiguracji");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error updating Supabase configuration:", error instanceof Error ? error.message : JSON.stringify(error));
      
      let errorMessage = "Wystąpił błąd podczas zapisywania konfiguracji: ";
      if (error instanceof Error) {
        if (error.message.includes("network") || error.message.includes("fetch") || error.message.includes("Failed to fetch")) {
          errorMessage += "Problem z połączeniem sieciowym. Sprawdź połączenie internetowe.";
        } else if (error.message.includes("timeout") || error.message.includes("timed out")) {
          errorMessage += "Upłynął limit czasu żądania. Spróbuj ponownie później.";
        } else if (error.message.includes("permission") || error.message.includes("access") || error.message.includes("denied")) {
          errorMessage += "Brak uprawnień do wykonania tej operacji.";
        } else {
          errorMessage += error.message;
        }
      } else if (error === null || error === undefined) {
        errorMessage += "Nieznany błąd. Sprawdź połączenie z internetem.";
      } else if (typeof error === 'object') {
        const errorObj = error as Record<string, unknown>;
        if (errorObj.message && typeof errorObj.message === 'string') {
          errorMessage += errorObj.message;
        } else if (errorObj.error && typeof errorObj.error === 'string') {
          errorMessage += errorObj.error;
        } else {
          errorMessage += "Nieznany błąd. Sprawdź konsolę przeglądarki dla szczegółów.";
        }
      } else {
        errorMessage += "Nieznany błąd. Sprawdź konsolę przeglądarki dla szczegółów.";
      }
      
      setMessage(errorMessage);
      setMessageType("error");
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
            <button 
              onClick={() => navigate(-1)}
              className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Powrót
            </button>
            
            <h1 className="text-2xl font-bold mb-6">Konfiguracja Supabase</h1>
            
            {auth.isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="mt-2">Ładowanie...</p>
              </div>
            ) : (
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <p className="text-gray-600 mb-6">
                Wprowadź dane dostępowe do swojej bazy Supabase. Dane te zostaną bezpiecznie zapisane i używane 
                do komunikacji z bazą danych. Po zapisaniu aplikacja zostanie automatycznie odświeżona.
              </p>
              
              {message && (
                <div className={`p-4 rounded-md mb-6 ${messageType === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
                  {message}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="supabaseUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    URL Supabase
                  </label>
                  <input
                    type="text"
                    id="supabaseUrl"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://your-project.supabase.co"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="supabaseKey" className="block text-sm font-medium text-gray-700 mb-1">
                    Klucz Anonimowy Supabase (anon)
                  </label>
                  <input
                    type="text"
                    id="supabaseKey"
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Klucz anon do dostępu publicznego z frontend, znajdziesz go w Supabase w zakładce Settings {"&"}{"gt;"} API.
                    <br />
                    <strong>Ważne:</strong> Klucz musi mieć co najmniej 20 znaków i zaczynać się od "ey".
                  </p>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="serviceRoleKey" className="block text-sm font-medium text-gray-700 mb-1">
                    Klucz Service Role Supabase
                  </label>
                  <input
                    type="text"
                    id="serviceRoleKey"
                    value={serviceRoleKey}
                    onChange={(e) => setServiceRoleKey(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Klucz service_role do operacji administracyjnych, znajdziesz go w Supabase w zakładce Settings {"&"}{"gt;"} API.
                    <br />
                    <strong>Ważne:</strong> Klucz musi mieć co najmniej 20 znaków i zaczynać się od "ey".
                  </p>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="adminKey" className="block text-sm font-medium text-gray-700 mb-1">
                    Klucz Administracyjny
                  </label>
                  <input
                    type="password"
                    id="adminKey"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Klucz administracyjny"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Klucz dostępowy dla administratorów. Skontaktuj się z administratorem systemu, aby go uzyskać.
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-md bg-blue-600 text-white font-medium ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                  >
                    {isLoading ? "Zapisywanie..." : "Zapisz konfigurację"}
                  </button>
                </div>
              </form>
            </div>
            )}            
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

// Wrap the component with AuthWrapper
export default function WrappedAdminSupabaseConfig() {
  return (
    <AuthWrapper>
      <AdminSupabaseConfig />
    </AuthWrapper>
  );
}
