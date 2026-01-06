import { useState } from "react";
import { useNavigate } from "react-router-dom";
import patchedBrain from "../utils/patchedBrain";
import { Container } from "../components/Container";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export default function AdminDataImport() {
  const navigate = useNavigate();
  const [adminKey, setAdminKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await patchedBrain.import_product_data({
        admin_key: adminKey
      }, {
        headers: {
          "X-Admin-Key": adminKey
        }
      });

      const result = await response.json();
      if (result.success) {
        setMessage(result.message);
        setMessageType("success");
      } else {
        setMessage(result.message);
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error importing data:", error);
      setMessage("An error occurred while importing data.");
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
            
            <h1 className="text-2xl font-bold mb-6">Import danych produktów</h1>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <p className="text-gray-600 mb-6">
                Ten narzędzie importuje istniejące dane kategorii produktów i wymagań do bazy danych Supabase.
                Operacja ta nadpisze istniejące dane w bazie danych. Upewnij się, że konfiguracja Supabase została 
                poprawnie skonfigurowana przed wykonaniem importu.
              </p>
              
              {message && (
                <div className={`p-4 rounded-md mb-6 ${messageType === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
                  {message}
                </div>
              )}
              
              <form onSubmit={handleImport}>
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
                    {isLoading ? "Importowanie..." : "Importuj dane"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
