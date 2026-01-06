import { useState, useEffect } from "react";
import { supabaseClient } from "../utils/supabase";
import { useNavigate } from "react-router-dom";
import brain from "brain";
import { Container } from "../components/Container";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export default function SupabaseConfig() {
  // Load stored values when component mounts
  useEffect(() => {
    const storedUrl = localStorage.getItem('supabaseUrl');
    const storedKey = localStorage.getItem('supabaseKey');
    const storedServiceRoleKey = localStorage.getItem('supabaseServiceRoleKey');
    const storedAdminKey = localStorage.getItem('adminKey');
    
    if (storedUrl) setSupabaseUrl(storedUrl);
    if (storedKey) setSupabaseKey(storedKey);
    if (storedServiceRoleKey) setServiceRoleKey(storedServiceRoleKey);
    if (storedAdminKey) setAdminKey(storedAdminKey);
    
    if (storedUrl && storedKey) {
      setMessage("Wczytano zapisane dane konfiguracyjne z pamięci przeglądarki.");
      setMessageType("info");
    }
  }, []);
  const navigate = useNavigate();
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseKey, setSupabaseKey] = useState("");
  const [serviceRoleKey, setServiceRoleKey] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info" | "">("");
  const [testConnectionStatus, setTestConnectionStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [testConnectionMessage, setTestConnectionMessage] = useState("");

  // Test connection to Supabase
  const testConnection = async () => {
    if (!supabaseUrl || !supabaseKey) {
      setTestConnectionMessage("Wprowadź URL i klucz Supabase, aby przetestować połączenie.");
      setTestConnectionStatus("error");
      return;
    }
    
    setTestConnectionStatus("loading");
    setTestConnectionMessage("Testowanie połączenia...");
    
    try {
      // Test the connection using our API with the updated endpoint name
      const response = await brain.check_supabase_connection_status({  
        supabase_url: supabaseUrl,
        supabase_anon_key: supabaseKey
      });
      
      const result = await response.json();
      console.log("Connection test result:", result);
      
      if (result.success) {
        setTestConnectionStatus("success");
        setTestConnectionMessage(`Połączenie udane! Znaleziono ${result.tables_count || 0} tabel${result.tables && result.tables.length > 0 ? ': ' + result.tables.join(', ') : '.'}`);
      } else {
        setTestConnectionStatus("error");
        setTestConnectionMessage(`Błąd połączenia: ${result.message || 'Nieznany błąd'}`); 
      }
    } catch (error) {
      // Improved error handling with detailed logging
      console.error("Error testing connection:", error);
      
      let errorMessage = "Wystąpił błąd podczas testowania połączenia.";
      
      if (error instanceof Error) {
        console.error("Error details:", error.message);
        errorMessage += ` Szczegóły błędu: ${error.message}`;
      } else if (typeof error === 'object' && error !== null) {
        // Log the full error object for debugging
        console.error("Non-Error object received:", JSON.stringify(error));
        errorMessage += " Nieznany format błędu.";
      }
      
      setTestConnectionStatus("error");
      setTestConnectionMessage(errorMessage);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setMessageType("");

    try {
      console.log("Sending Supabase configuration to API:",{url:supabaseUrl,keyStart:supabaseKey?supabaseKey.substring(0,15)+'...':'undefined'});
      
      // Use the renamed endpoint function from our API
      const response = await brain.save_supabase_config({
        supabase_url: supabaseUrl,
        supabase_anon_key: supabaseKey,
        supabase_service_role_key: serviceRoleKey,
        admin_key: adminKey
      });

      const result = await response.json();
      console.log("API response:", result);
      
      if (result.success) {
        setMessage(result.message);
        setMessageType("success");
        
        // Update the supabase.ts file with the new credentials
        localStorage.setItem("supabaseUrl", supabaseUrl);
        localStorage.setItem("supabaseKey", supabaseKey);
        if (serviceRoleKey) {
          localStorage.setItem("supabaseServiceRoleKey", serviceRoleKey);
        }
        if (adminKey) {
          localStorage.setItem("adminKey", adminKey);
        }
        console.log("Saved Supabase config to localStorage");
        
        // Reload after 2 seconds to apply the new configuration
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessage(result.message);
        setMessageType("error");
      }
    } catch (error) {
      // Improved error handling with detailed logging
      console.error("Error updating Supabase configuration:", error);
      
      let errorMessage = "Wystąpił błąd podczas aktualizacji konfiguracji Supabase.";
      
      if (error instanceof Error) {
        console.error("Error details:", error.message);
        errorMessage += ` Szczegóły błędu: ${error.message}`;
      } else if (typeof error === 'object' && error !== null) {
        // Log the full error object for debugging
        console.error("Non-Error object received:", JSON.stringify(error));
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
      
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <p className="text-gray-600 mb-6">
          Wprowadź dane dostępowe do swojej bazy Supabase. Dane te zostaną bezpiecznie zapisane i używane 
          do komunikacji z bazą danych. Po zapisaniu aplikacja zostanie automatycznie odświeżona.
        </p>
        
        {message && (
          <div className={`p-4 rounded-md mb-6 ${
            messageType === "success" ? "bg-green-50 text-green-800" : 
            messageType === "error" ? "bg-red-50 text-red-800" : 
            "bg-blue-50 text-blue-800"
          }`}>
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
              Klucz Anonimowy Supabase
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
          </div>
          
          <div className="mb-4">
            <label htmlFor="serviceRoleKey" className="block text-sm font-medium text-gray-700 mb-1">
              Klucz Service Role Supabase
            </label>
            <input
              type="password"
              id="serviceRoleKey"
              value={serviceRoleKey}
              onChange={(e) => setServiceRoleKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cC..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Klucz "service_role" z sekcji Project API keys w Supabase. Wymagany do tworzenia tabel i zarządzania danymi.
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
          
                    <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={testConnection}
                disabled={testConnectionStatus === "loading"}
                className={`px-4 py-2 rounded-md bg-gray-100 text-gray-800 border border-gray-300 font-medium hover:bg-gray-200 ${testConnectionStatus === "loading" ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {testConnectionStatus === "loading" ? "Testowanie..." : "Testuj połączenie"}
              </button>
              
              <span className={`ml-4 text-sm ${
                testConnectionStatus === "success" ? "text-green-600" :
                testConnectionStatus === "error" ? "text-red-600" :
                "text-gray-600"
              }`}>
                {testConnectionMessage}
              </span>
            </div>
            
            <p className="text-xs text-gray-500">
              Zalecamy przetestowanie połączenia przed zapisaniem konfiguracji.
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
        
        <div className="mt-8 border-t pt-6 border-gray-200">
          <h3 className="text-lg font-medium mb-2">Informacje pomocy</h3>
          <div className="bg-gray-50 p-3 rounded-md text-sm">
            <p className="mb-2"><strong>URL Supabase:</strong> Znajdziesz go w panelu sterowania Supabase, w sekcji Settings i API.</p>
            <p className="mb-2"><strong>Klucz Anonimowy:</strong> To klucz "anon" lub "public" z sekcji Project API keys.</p>
            <p className="mb-2"><strong>Klucz Service Role:</strong> To klucz "service_role" z sekcji Project API keys. Ma wyższe uprawnienia niż klucz anonimowy.</p>
            <p><strong>Klucz Administracyjny:</strong> To wartość sekretu ADMIN_KEY używana do weryfikacji administratorów systemu.</p>
          </div>
        </div>
      </div>
        </div>
      </Container>
      </main>
      <Footer />
    </div>
  );
}
