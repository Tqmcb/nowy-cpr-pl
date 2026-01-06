import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "../components/Container";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/Button";
import { supabase } from "../utils/supabase";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../utils/AuthContext";

export default function AdminAddDocument() {
  const navigate = useNavigate();
  const { session, isLoading: isAuthLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthLoading && !session) {
      toast.error("Dostęp tylko dla zalogowanych administratorów");
      navigate("/login", { state: { from: "/admin-add-document" } });
    }
  }, [session, isAuthLoading, navigate]);
  
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
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    is_public: true
  });

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
    
    // Basic validation
    if (!formData.title) {
      toast.error("Tytuł dokumentu jest wymagany");
      return;
    }
    
    if (!selectedFile) {
      toast.error("Wybierz plik do przesłania");
      return;
    }
    
    setIsSubmitting(true);
    setUploadProgress(0);
    
    try {
      // 1. Upload file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `documents/${fileName}`;
      
      // Check Supabase connection before starting upload
      if (!supabase) {
        throw new Error("Brak połączenia z Supabase. Sprawdź konfigurację.");
      }
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, selectedFile, {
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
        .getPublicUrl(filePath);
      
      if (!publicUrlResult.data?.publicUrl) {
        throw new Error("Nie udało się uzyskać publicznego URL dla pliku");
      }
      
      const publicUrl = publicUrlResult.data.publicUrl;
      
      // 3. Create document record in database
      const documentData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        file_url: publicUrl,
        file_name: selectedFile.name,
        file_size: selectedFile.size,
        file_type: selectedFile.type,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        download_count: 0,
        is_public: formData.is_public
      };
      
      const { error: dbError } = await supabase
        .from('documents')
        .insert(documentData);
      
      if (dbError) {
        // W przypadku błędu bazy danych, usuń również przesłany plik aby uniknąć śmieci
        try {
          await supabase.storage
            .from('public')
            .remove([filePath]);
        } catch (deleteErr) {
          console.error("Nie udało się usunąć pliku po nieudanym zapisie dokumentu:", deleteErr instanceof Error ? deleteErr.message : JSON.stringify(deleteErr));
        }
        
        throw dbError;
      }
      
      toast.success("Dokument został dodany pomyślnie");
      navigate("/admin-documents");
    } catch (err) {
      console.error("Error adding document:", err instanceof Error ? err.message : JSON.stringify(err));
      
      let errorMessage = "Błąd podczas dodawania dokumentu: ";
      if (err instanceof Error) {
        if (err.message.includes("auth/invalid-api-key") || err.message.includes("Invalid API key")) {
          errorMessage += "Nieprawidłowy klucz API Supabase.";
        } else if (err.message.includes("network") || err.message.includes("fetch") || err.message.includes("Network Error")) {
          errorMessage += "Problem z połączeniem sieciowym. Sprawdź połączenie internetowe.";
        } else if (err.message.includes("already exists")) {
          errorMessage += "Plik o tej nazwie już istnieje. Spróbuj ponownie z innym plikiem.";
        } else if (err.message.includes("permission denied") || err.message.includes("not authorized")) {
          errorMessage += "Brak uprawnień do dodawania rekordów. Sprawdź polityki RLS w bazie danych.";
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Container>
          <div className="py-12 px-4">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Dodaj Nowy Dokument</h1>
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
                
                {/* File Upload */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium mb-4">Plik dokumentu</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Wybierz plik do przesłania *
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Wybierz plik</span>
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
                
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => navigate("/admin-documents")}
                  >
                    Anuluj
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !selectedFile}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                        Przesłanie w toku...
                      </>
                    ) : "Dodaj dokument"}
                  </Button>
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
