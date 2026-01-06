import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "../components/Container";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/extensions/shadcn/components/card";
import { Button } from "@/extensions/shadcn/components/button";
import { Input } from "@/extensions/shadcn/components/input";
import { Label } from "@/extensions/shadcn/components/label";
import { Textarea } from "@/extensions/shadcn/components/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/extensions/shadcn/components/select";
import { fetchDocuments, addDocument, deleteDocument, getDocumentDownloadUrl } from "../utils/supabase/admin";
import { toast } from "sonner";
import { useAuth } from "../utils/AuthContextUnified";
import { AuthWrapper } from "../components/AuthWrapper";
// Import patched client where needed
import patchedBrain from "../utils/patchedBrain";

function AdminDocuments() {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "template", // 'template', 'guide', 'regulation'
    file: null
  });

  // Load documents
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchDocuments();
      setDocuments(data);
    } catch (err) {
      console.error("Error loading documents:", err instanceof Error ? err.message : JSON.stringify(err));

      let errorMessage = "Nie udało się załadować dokumentów. ";
      if (err instanceof Error) {
        if (err.message.includes("auth/invalid-api-key") || err.message.includes("Invalid API key")) {
          errorMessage += "Nieprawidłowy klucz API Supabase.";
        } else if (err.message.includes("network") || err.message.includes("fetch") || err.message.includes("Network Error")) {
          errorMessage += "Problem z połączeniem sieciowym. Sprawdź połączenie internetowe.";
        } else if (err.message.includes("does not exist") || err.message.includes("documents") || err.message.includes("relation")) {
          errorMessage += "Tabela documents nie istnieje w bazie danych. Konieczne jest zaimportowanie danych.";
        } else if (err.message.includes("permission denied")) {
          errorMessage += "Brak uprawnień do tabeli documents. Sprawdź polityki RLS w bazie danych.";
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

  // Handle document upload
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.title || !formData.file) {
      toast.error("Tytuł i plik są wymagane");
      return;
    }

    setIsUploading(true);

    try {
      const result = await addDocument(formData);

      if (result.success) {
        toast.success("Dokument został dodany");
        // Reset form
        setFormData({
          title: "",
          description: "",
          category: "template",
          file: null
        });
        // Refresh documents list
        loadDocuments();
      } else {
        toast.error(`Błąd: ${result.error}`);
      }
    } catch (err) {
      console.error("Error uploading document:", err instanceof Error ? err.message : JSON.stringify(err));
      toast.error(`Błąd podczas dodawania dokumentu: ${err instanceof Error ? err.message : "Nieznany błąd"}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle delete document
  const handleDelete = async (documentId) => {
    if (window.confirm("Czy na pewno chcesz usunąć ten dokument? Ta operacja jest nieodwracalna.")) {
      setIsDeleting(true);
      try {
        const result = await deleteDocument(documentId);
        if (result.success) {
          toast.success("Dokument został usunięty");
          // Refresh the list
          loadDocuments();
        } else {
          toast.error(`Błąd: ${result.error}`);
        }
      } catch (err) {
        console.error("Error deleting document:", err instanceof Error ? err.message : JSON.stringify(err));
        toast.error(`Błąd podczas usuwania dokumentu: ${err instanceof Error ? err.message : "Nieznany błąd"}`);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      file: e.target.files[0]
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle category select change
  const handleCategoryChange = (value) => {
    setFormData({
      ...formData,
      category: value
    });
  };

  // Download a document
  const handleDownload = async (document) => {
    try {
      const url = await getDocumentDownloadUrl(document.id);
      if (url) {
        window.open(url, '_blank');
      } else {
        toast.error("Nie udało się pobrać dokumentu");
      }
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error("Błąd podczas pobierania dokumentu");
    }
  };

  // Filter documents based on search query
  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Map category to Polish
  const getCategoryName = (category) => {
    switch (category) {
      case 'template': return 'Wzór dokumentu';
      case 'guide': return 'Poradnik';
      case 'regulation': return 'Przepis/Rozporządzenie';
      default: return category;
    }
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dokumenty</h1>
            <p className="text-muted-foreground mt-1">Zarządzaj dokumentami i materiałami do pobrania</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/admin-dashboard")}
          >
            Powrót do dashboardu
          </Button>
        </div>

        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-muted-foreground">Ładowanie dokumentów...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dokumenty</h1>
          <p className="text-muted-foreground mt-1">Zarządzaj dokumentami i materiałami do pobrania</p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("/admin-dashboard")}
        >
          Powrót do dashboardu
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
              <Button onClick={loadDocuments}>
                Spróbuj ponownie
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {/* Upload new document */}
          <Card>
            <CardHeader>
              <CardTitle>Dodaj nowy dokument</CardTitle>
              <CardDescription>Dodaj dokumenty, przewodniki i wzory do pobrania</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tytuł dokumentu *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="np. Wzór Deklaracji Właściwości Użytkowych"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Opis dokumentu</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Krótki opis zawartości dokumentu"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Kategoria</Label>
                  <Select
                    value={formData.category}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Wybierz kategorię" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="template">Wzór dokumentu</SelectItem>
                      <SelectItem value="guide">Poradnik</SelectItem>
                      <SelectItem value="regulation">Przepis/Rozporządzenie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Plik dokumentu *</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Zalecane formaty: PDF, DOCX, XLS (max 10MB)
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <div className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                      Dodawanie...
                    </>
                  ) : "Dodaj dokument"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* List of documents */}
          <div className="space-y-6">
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Szukaj dokumentów..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {filteredDocuments.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground my-8">
                    {searchQuery ?
                      "Nie znaleziono dokumentów pasujących do zapytania" :
                      "Brak dokumentów. Dodaj pierwszy dokument."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {filteredDocuments.map((doc) => (
                  <Card key={doc.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-xl">{doc.title}</CardTitle>
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                          {getCategoryName(doc.category)}
                        </span>
                      </div>
                      <CardDescription>
                        Dodano: {formatDate(doc.created_at)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      {doc.description && (
                        <p className="text-sm text-muted-foreground">
                          {doc.description}
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(doc)}
                      >
                        Pobierz
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(doc.id)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        Usuń
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Export with wrapper
export default function WrappedAdminDocuments() {
  return (
    <AuthWrapper>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Container>
            <AdminDocuments />
          </Container>
        </main>
        <Footer />
      </div>
    </AuthWrapper>
  );
}