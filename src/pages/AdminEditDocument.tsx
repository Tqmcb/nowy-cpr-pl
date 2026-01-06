import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container } from "../components/Container";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/Button";
import { supabase } from "../utils/supabase";
import { useAuth } from "../utils/AuthContext";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

// Document interface
interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  file_url: string;
  file_name: string;
  file_size?: number;
  file_type?: string;
  created_at: string;
  updated_at: string;
  download_count: number;
  is_public: boolean;
}

export default function AdminEditDocument() {
  const navigate = useNavigate();
  const { docId } = useParams<{ docId: string }>();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  
  // Get auth context
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  
  // Check authentication on component mount
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      // Redirect to login if not authenticated
      toast.error("Wymagane logowanie. Zaloguj się, aby zarządzać dokumentami.");
      navigate("/login", { state: { from: `/admin-edit-document/${docId}` } });
    } else if (!authLoading) {
      setIsAuthChecking(false);
    }
  }, [navigate, docId, authLoading, isAuthenticated]);
  
  // Document state
  const [document, setDocument] = useState<Document | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    is_public: true
  });

  // Load document data
  useEffect(() => {
    // Skip loading if auth check is still in progress
    if (isAuthChecking) return;
    const loadDocument = async () => {
      if (!docId) return;
      
      setIsLoading(true);
      
      try {
        // Check Supabase connection
        if (!supabase) {
          throw new Error("Brak połączenia z Supabase. Sprawdź konfigurację.");
        }
        
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('id', docId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setDocument(data as Document);
          setFormData({
            title: data.title,
            description: data.description || "",
            category: data.category || "",
            is_public: data.is_public
          });
        } else {
          toast.error("Nie znaleziono dokumentu");
          navigate("/admin-documents");
        }
      } catch (err) {
        console.error("Error loading document:", err instanceof Error ? err.message : JSON.stringify(err));
        
        let errorMessage = "Błąd podczas ładowania dokumentu: ";
        if (err instanceof Error) {
          if (err.message.includes("auth/invalid-api-key") || err.message.includes("Invalid API key")) {
            errorMessage += "Nieprawidłowy klucz API Supabase.";
          } else if (err.message.includes("network") || err.message.includes("fetch") || err.message.includes("Network Error")) {
            errorMessage += "Problem z połączeniem sieciowym. Sprawdź połączenie internetowe.";
          } else if (err.message.includes("does not exist") || err.message.includes("documents") || err.message.includes("relation")) {
            errorMessage += "Tabela documents nie istnieje w bazie danych. Konieczne jest zaimportowanie danych.";
          } else if (err.message.includes("permission denied")) {
            errorMessage += "Brak uprawnień do tabeli documents. Sprawdź polityki RLS w bazie danych.";
          } else if (err.message.includes("not found") || err.message.includes("No row")) {
            errorMessage = "Nie znaleziono dokumentu o podanym ID";
          } else if (err.message.includes("Supabase") || err.message.includes("konfigurację")) {
            errorMessage += "Brak połączenia z bazą danych. Sprawdź konfigurację Supabase.";
          } else {
            errorMessage += err.message;
          }
        } else if (err === null || err === undefined) {
          errorMessage += "Nie można połączyć się z bazą danych. Sprawdź konfigurację Supabase.";
        } else if (typeof err === 'object') {
          const errorObj = err as Record<string, unknown>;
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
        navigate("/admin-documents");
      } finally {
        setIsLoading(false);
      }
    };

    loadDocument();
  }, [docId, navigate, isAuthChecking]);

  // Handle text inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!docId || !document) {
      toast.error("Brak danych dokumentu do aktualizacji");
      return;
    }
    
    // Basic validation
    if (!formData.title) {
      toast.error("Tytuł dokumentu jest wymagany");
      return;
    }
    
    setIsSubmitting(true);
    setUploadProgress(0);
    
    try {
      // Check Supabase connection before starting
      if (!supabase) {
        throw new Error("Brak połączenia z Supabase. Sprawdź konfigurację.");
      }
      
      let fileUrl = document.file_url;
      let fileName = document.file_name;
      let fileSize = document.file_size;
      let fileType = document.file_type;
      let newFilePath = "";
      
      // If a new file was selected, upload it
      if (selectedFile) {
        // 1. Upload file to Supabase Storage
        const fileExt = selectedFile.name.split('.').pop();
        const newFileName = `${uuidv4()}.${fileExt}`;
        newFilePath = `documents/${newFileName}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('public')
          .upload(newFilePath, selectedFile, {
            cacheControl: '3600',
            upsert: false,
            onUploadProgress: (progress) => {
              setUploadProgress(Math.round((progress.loaded / progress.total) * 100));
            }
          });
        
        if (uploadError) {
          if (uploadError.message?.includes("already exists")) {
            throw new Error("Plik o tej nazwie już istnieje. Spróbuj ponownie.");
          } else {
            throw uploadError;
          }
        }
        
        // 2. Get public URL for the uploaded file
        const publicUrlResult = supabase.storage
          .from('public')
          .getPublicUrl(newFilePath);
        
        if (!publicUrlResult.data?.publicUrl) {
          throw new Error("Nie udało się uzyskać publicznego URL dla pliku");
        }
        
        fileUrl = publicUrlResult.data.publicUrl;
        fileName = selectedFile.name;
        fileSize = selectedFile.size;
        fileType = selectedFile.type;
      }
      
      // 3. Update document record in database
      const documentData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        file_url: fileUrl,
        file_name: fileName,
        file_size: fileSize,
        file_type: fileType,
        updated_at: new Date().toISOString(),
        is_public: formData.is_public
      };
      
      const { error: dbError } = await supabase
        .from('documents')
        .update(documentData)
        .eq('id', docId);
      
      if (dbError) {
        // Jeśli wystąpił błąd podczas aktualizacji bazy danych, ale przesłaliśmy nowy plik,
        // usuń ten plik aby uniknąć osieroconych plików w storage
        if (selectedFile && newFilePath) {
          try {
            await supabase.storage
              .from('public')
              .remove([newFilePath]);
          } catch (deleteErr) {
            console.error("Nie udało się usunąć pliku po nieudanej aktualizacji:", deleteErr instanceof Error ? deleteErr.message : JSON.stringify(deleteErr));
          }
        }
        
        throw dbError;
      }
      
      // Delete the old file from storage if we uploaded a new one
      if (selectedFile && document.file_url) {
        try {
          // Extract filename from the URL
          const oldFilePathParts = document.file_url.split('/');
          const oldFileName = oldFilePathParts[oldFilePathParts.length - 1];
          
          if (oldFileName) {
            const oldFilePath = `documents/${oldFileName}`;
            const { error: removeError } = await supabase.storage
              .from('public')
              .remove([oldFilePath]);
              
            if (removeError) {
              console.warn("Nie udało się usunąć starego pliku:", removeError.message);
              // Nie przerywamy operacji, to tylko czyszczenie
            }
          }
        } catch (deleteErr) {
          console.error("Błąd podczas próby usunięcia starego pliku:", deleteErr instanceof Error ? deleteErr.message : JSON.stringify(deleteErr));
          // Continue with the update despite this error
        }
      }
      
      toast.success("Dokument został zaktualizowany pomyślnie");
      navigate("/admin-documents");
    } catch (err) {
      console.error("Error updating document:", err instanceof Error ? err.message : JSON.stringify(err));
      
      let errorMessage = "Błąd podczas aktualizacji dokumentu: ";
      if (err instanceof Error) {
        if (err.message.includes("auth/invalid-api-key") || err.message.includes("Invalid API key")) {
          errorMessage += "Nieprawidłowy klucz API Supabase.";
        } else if (err.message.includes("network") || err.message.includes("fetch") || err.message.includes("Network Error")) {
          errorMessage += "Problem z połączeniem sieciowym. Sprawdź połączenie internetowe.";
        } else if (err.message.includes("already exists")) {
          errorMessage += "Plik o tej nazwie już istnieje. Spróbuj ponownie z innym plikiem.";
        } else if (err.message.includes("permission denied") || err.message.includes("not authorized")) {
          errorMessage += "Brak uprawnień do aktualizacji rekordów. Sprawdź polityki RLS w bazie danych.";
        } else if (err.message.includes("Supabase") || err.message.includes("konfigurację")) {
          errorMessage += "Brak połączenia z bazą danych. Sprawdź konfigurację Supabase.";
          toast.error("Sprawdź konfigurację Supabase w ustawieniach administratora");
        } else {
          errorMessage += err.message;
        }
      } else if (err === null || err === undefined) {
        errorMessage += "Nie można połączyć się z bazą danych. Sprawdź konfigurację Supabase.";
      } else if (typeof err === 'object') {
        const errorObj = err as Record<string, unknown>;
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
      setUploadProgress(0);
    }
  };

  // Handle document deletion
  const handleDeleteDocument = async () => {
    if (!docId || !document) {
      toast.error("Brak danych dokumentu do usunięcia");
      return;
    }
    
    setIsDeleting(true);
    
    try {
      // Check Supabase connection before starting
      if (!supabase) {
        throw new Error("Brak połączenia z Supabase. Sprawdź konfigurację.");
      }
      
      // First try to delete the file from storage
      let storageDeleteSuccess = false;
      
      try {
        // Extract filename from the URL
        const fileUrlParts = document.file_url.split('/');
        const fileName = fileUrlParts[fileUrlParts.length - 1];
        
        if (fileName) {
          const filePath = `documents/${fileName}`;
          const { error: storageError } = await supabase.storage
            .from('public')
            .remove([filePath]);
            
          if (storageError) {
            console.warn("Ostrzeżenie podczas usuwania pliku ze storage:", storageError.message);
          } else {
            storageDeleteSuccess = true;
          }
        }
      } catch (deleteErr) {
        console.error("Nie udało się usunąć pliku z magazynu:", deleteErr instanceof Error ? deleteErr.message : JSON.stringify(deleteErr));
        // Continue with the database deletion despite this error
      }
      
      // Delete document record from database
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', docId);
      
      if (error) throw error;
      
      if (storageDeleteSuccess) {
        toast.success("Dokument wraz z plikiem został całkowicie usunięty");
      } else {
        toast.success("Dokument został usunięty, ale plik mógł pozostać w magazynie");
      }
      
      navigate("/admin-documents");
    } catch (err) {
      console.error("Error deleting document:", err instanceof Error ? err.message : JSON.stringify(err));
      
      let errorMessage = "Błąd podczas usuwania dokumentu: ";
      if (err instanceof Error) {
        if (err.message.includes("auth/invalid-api-key") || err.message.includes("Invalid API key")) {
          errorMessage += "Nieprawidłowy klucz API Supabase.";
        } else if (err.message.includes("network") || err.message.includes("fetch") || err.message.includes("Network Error")) {
          errorMessage += "Problem z połączeniem sieciowym. Sprawdź połączenie internetowe.";
        } else if (err.message.includes("permission denied") || err.message.includes("not authorized")) {
          errorMessage += "Brak uprawnień do usuwania w tabeli. Sprawdź polityki RLS w bazie danych.";
        } else if (err.message.includes("foreign key constraint") || err.message.includes("violates")) {
          errorMessage += "Ten dokument jest używany przez inne elementy i nie może być usunięty.";
        } else if (err.message.includes("Supabase") || err.message.includes("konfigurację")) {
          errorMessage += "Brak połączenia z bazą danych. Sprawdź konfigurację Supabase.";
          toast.error("Sprawdź konfigurację Supabase w ustawieniach administratora");
        } else {
          errorMessage += err.message;
        }
      } else if (err === null || err === undefined) {
        errorMessage += "Nie można połączyć się z bazą danych. Sprawdź konfigurację Supabase.";
      } else if (typeof err === 'object') {
        const errorObj = err as Record<string, unknown>;
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
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Format file size
  const formatFileSize = (sizeInBytes?: number) => {
    if (!sizeInBytes) return 'N/A';
    
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = sizeInBytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  if (isAuthChecking || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2">Ładowanie dokumentu...</p>
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
              <h1 className="text-3xl font-bold">Edytuj Dokument</h1>
              <Button 
                variant="outline" 
                onClick={() => navigate("/admin-documents")}
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
                    Czy na pewno chcesz usunąć ten dokument? Ta operacja jest nieodwracalna.
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
                      onClick={handleDeleteDocument}
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
              <div className="space-y-6">
                {/* Document Information */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Tytuł dokumentu *</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
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
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Krótki opis dokumentu..."
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Kategoria</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Wybierz kategorię</option>
                      <option value="Wzory dokumentów">Wzory dokumentów</option>
                      <option value="Deklaracje">Deklaracje</option>
                      <option value="Certyfikaty">Certyfikaty</option>
                      <option value="Przepisy">Przepisy i regulacje</option>
                      <option value="Poradniki">Poradniki i instrukcje</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center pt-4">
                    <input
                      type="checkbox"
                      id="is_public"
                      name="is_public"
                      checked={formData.is_public}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="is_public" className="ml-2 block text-sm text-gray-700">
                      Dokument publiczny (widoczny dla wszystkich)
                    </label>
                  </div>
                </div>
                
                {/* Current File */}
                {document && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium mb-4">Obecny plik</h3>
                    <div className="p-4 bg-gray-50 rounded border border-gray-200">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="font-medium">{document.file_name}</p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(document.file_size)} • Dodano: {new Date(document.created_at).toLocaleDateString('pl-PL')}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <a 
                          href={document.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                          </svg>
                          Podgląd pliku
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* File Upload */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium mb-4">Zamień plik (opcjonalnie)</h3>
                  
                  <div className="mb-4">
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Wybierz nowy plik</span>
                            <input 
                              id="file-upload" 
                              name="file-upload" 
                              type="file" 
                              className="sr-only" 
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="pl-1">lub przeciągnij i upuść</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, DOCX, XLS, XLSX do 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {selectedFile && (
                    <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                        </svg>
                        <div className="ml-2 flex-1">
                          <p className="text-sm font-medium">{selectedFile.name}</p>
                          <p className="text-xs text-gray-500">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button 
                          type="button" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => setSelectedFile(null)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-4">
                      <div className="bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 w-full">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-center mt-1 text-gray-500">{uploadProgress}% przesłano</p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between gap-4 pt-4 border-t border-gray-200">
                  <Button 
                    type="button" 
                    variant="destructive" 
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Usuń dokument
                  </Button>
                  
                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      type="button" 
                      onClick={() => navigate("/admin-documents")}
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
