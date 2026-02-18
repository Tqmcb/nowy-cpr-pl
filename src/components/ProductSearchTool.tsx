import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "components/Button";
import { fetchProductCategoryOptions, fetchProductWithRequirements, getSupabaseConfig, getSupabaseClient } from "../utils/supabase";
import type { ProductCategoryRow, ProductRequirementRow } from "../utils/supabase";
import brain from "brain";

// Merged product data type to match the component expectations
interface ProductCategory {
  id: string;
  name: string;
  code: string;
  description: string;
  requirements: {
    id: string;
    title: string;
    description: string;
    mandatoryTests: string[];
    documentationRequired: string[];
    cprChanges: string[];
    certificationSystems: string[];
  };
};

// Fallback data for when the Supabase integration isn't configured
const placeholderRequirements = {
  id: "placeholder-req",
  title: "Wymagania podstawowe",
  description: "Szczegółowe wymagania dla tej kategorii produktów są obecnie opracowywane. Skontaktuj się z Multicert, aby uzyskać szczegółowe informacje.",
  mandatoryTests: [
    "Badania wstępne typu",
    "Ocena zgodności z normami zharmonizowanymi",
    "Raportowanie środowiskowe (nowe z CPR 2024)"
  ],
  documentationRequired: [
    "Deklaracja właściwości użytkowych (DoP)",
    "Oznakowanie CE",
    "Dokumentacja zakładowej kontroli produkcji",
    "Cyfrowy paszport produktu (nowy z CPR 2024)"
  ],
  cprChanges: [
    "Cyfryzacja dokumentacji i oznaczeń (Digital DoP)",
    "Zwiększone wymagania środowiskowe (zrównoważony rozwój)",
    "Nowe systemy oceny i weryfikacji stałości właściwości użytkowych (w tym System 3+)",
    "Paszport Produktu (Digital Product Passport)",
    "Rozszerzone wymogi dotyczące substancji niebezpiecznych"
  ],
  certificationSystems: ["System 1", "System 2+", "System 3+", "System 3", "System 4"]
};

// Helper function to build a complete list of product categories when Supabase fails
const buildFullProductCategoryList = () => {
  return [
    { value: "plumbing", label: "Wyroby instalacyjne (PL-1)" },
    { value: "ceiling", label: "Sufity podwieszane (CP-2)" },
    { value: "steel", label: "Wyroby stalowe (ST-3)" },
    { value: "concrete", label: "Betony i zaprawy (CM-4)" },
    { value: "doors", label: "Drzwi i okna (DW-5)" },
    { value: "road", label: "Wyroby drogowe (RD-6)" },
    { value: "flooring", label: "Podłogi i posadzki (FL-7)" },
    { value: "timber", label: "Wyroby drewniane konstrukcyjne (TM-8)" },
    { value: "boards", label: "Płyty drewnopochodne (WB-9)" },
    { value: "insulation", label: "Materiały izolacyjne (IN-10)" },
    { value: "facades", label: "Systemy elewacyjne (FC-11)" },
    { value: "roofing", label: "Pokrycia dachowe (RF-12)" },
    { value: "drywall", label: "Systemy suchej zabudowy (DW-13)" },
    { value: "adhesives", label: "Kleje i uszczelniacze (AD-14)" },
    { value: "waterproofing", label: "Hydroizolacje (WP-15)" },
    { value: "fireproofing", label: "Zabezpieczenia przeciwpożarowe (FP-16)" },
    { value: "glass", label: "Szkło budowlane (GL-17)" },
    { value: "ventilation", label: "Systemy wentylacyjne (VE-18)" },
    { value: "heating", label: "Systemy grzewcze (HE-19)" },
    { value: "electrical", label: "Instalacje elektryczne (EL-20)" },
    { value: "drainage", label: "Systemy odwodnienia (DR-21)" },
    { value: "sanitary", label: "Wyposażenie sanitarne (SA-22)" },
    { value: "paints", label: "Farby i powłoki (PA-23)" },
    { value: "acoustics", label: "Izolacje akustyczne (AC-24)" },
    { value: "stairs", label: "Schody i balustrady (ST-25)" },
    { value: "stonework", label: "Wyroby kamienne (SW-26)" },
    { value: "lighting", label: "Oświetlenie budowlane (LI-27)" },
    { value: "fencing", label: "Ogrodzenia (FE-28)" },
    { value: "foundation", label: "Wyroby fundamentowe (FO-29)" },
    { value: "bricks", label: "Cegły i pustaki (BR-30)" },
    { value: "scaffolding", label: "Rusztowania (SC-31)" },
    { value: "prefab", label: "Elementy prefabrykowane (PF-32)" },
    { value: "solar", label: "Systemy solarne (SO-33)" },
    { value: "geotextiles", label: "Geotekstylia (GT-34)" },
    { value: "plastics", label: "Tworzywa konstrukcyjne (PL-35)" },
    { value: "eco", label: "Materiały ekologiczne (EC-36)" }
  ];
};

export function ProductSearchTool() {
  const navigate = useNavigate();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  const [productOptions, setProductOptions] = useState<{value: string, label: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false);

  // Load product options on component mount
  useEffect(() => {
    const loadProductOptions = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Check if Supabase is configured using the helper function
        const { hasValidConfig } = getSupabaseConfig();
        setIsSupabaseConfigured(hasValidConfig);
        
        if (hasValidConfig) {
          try {
            // Try to fetch categories from Supabase
            const supabaseOptions = await fetchProductCategoryOptions();
            
            if (supabaseOptions && supabaseOptions.length > 0) {
              console.info("Successfully loaded", supabaseOptions.length, "product categories from Supabase");
              setProductOptions(supabaseOptions);
              return;
            } else {
              console.warn("No product categories found in Supabase, using fallback data");
            }
          } catch (supabaseError) {
            console.error("Error fetching from Supabase:", supabaseError);
            setError("Błąd podczas pobierania danych z Supabase. Używam danych zapasowych.");
          }
        } else {
          console.warn("Supabase not configured. Using fallback data.");
        }
        
        // Fallback to static data if Supabase fails or isn't configured
        setProductOptions(buildFullProductCategoryList());
      } catch (err) {
        console.error("Unexpected error loading product categories:", err);
        setError("Nie udało się załadować kategorii produktów. Używam danych zapasowych.");
        // Use fallback data on error
        setProductOptions(buildFullProductCategoryList());
      } finally {
        setIsLoading(false);
      }
    };

    loadProductOptions();
  }, []);
  
  const handleCategoryChange = async (value: string) => {
    setSelectedCategoryId(value);
    if (!value) {
      setSelectedCategory(null);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { hasValidConfig } = getSupabaseConfig();
      
      if (hasValidConfig) {
        try {
          // Try to fetch the product with requirements from Supabase
          const productData = await fetchProductWithRequirements(value);
          
          if (productData) {
            console.info("Successfully loaded product data from Supabase", productData);
            setSelectedCategory(productData);
            setIsLoading(false);
            return;
          } else {
            console.warn("Product data not found in Supabase, using fallback");
          }
        } catch (supabaseError) {
          console.error("Error fetching product from Supabase:", supabaseError);
        }
      }
      
      // Fallback to static data if Supabase fails or isn't configured
      // Find the category in our options
      const categoryOption = productOptions.find(opt => opt.value === value);
      const name = categoryOption ? categoryOption.label.split('(')[0].trim() : value;
      const code = categoryOption && categoryOption.label.includes('(') ? 
        categoryOption.label.split('(')[1].replace(')', '') : '';
      
      // Create a placeholder category
      const placeholderCategory: ProductCategory = {
        id: value,
        name: name,
        code: code,
        description: `${name} - szczegółowy opis kategorii`,
        requirements: placeholderRequirements
      };
      
      setSelectedCategory(placeholderCategory);
    } catch (err) {
      console.error("Error in category handling:", err);
      setError("Nie udało się załadować szczegółów wybranej kategorii produktów.");
      setSelectedCategory(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Wyszukiwarka wymagań proponowanego CPR</h1>
              <p className="text-lg text-gray-600 mb-6">
                Sprawdź przewidywane wymagania dla Twojego wyrobu budowlanego. Wybierz kategorię produktu, aby zobaczyć szczegółowe informacje o testach, dokumentacji i zmianach proponowanych w nowym rozporządzeniu CPR.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => document.getElementById("search-section")?.scrollIntoView({ behavior: "smooth" })}
                  className="font-medium"
                >
                  Przejdź do wyszukiwarki
                </Button>
                <Button 
                  variant="outline" 
                  className="font-medium"
                  onClick={() => document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Więcej o CPR 2024
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3" 
                alt="CPR 2024 Regulations"
                className="rounded-lg shadow-md max-w-full h-auto"
                style={{ maxHeight: "350px" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section id="search-section" className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Znajdź wymagania dla Twojego produktu</h2>
            <p className="text-gray-600 mb-8">
              Wybierz kategorię wyrobu budowlanego, aby sprawdzić przewidywane wymagania zgodne z proponowanym nowym rozporządzeniem CPR.
            </p>
            
            {!isSupabaseConfigured && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-amber-700">
                      Baza danych Supabase nie jest skonfigurowana. Wyświetlamy dane przykładowe.
                      <a 
                        onClick={() => navigate("/admin-supabase-config")} 
                        className="font-medium underline ml-1 cursor-pointer"
                      >
                        Skonfiguruj bazę danych
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 mb-10">
            <div className="max-w-xl mx-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wybierz kategorię wyrobu budowlanego:
              </label>
              <select
                value={selectedCategoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-gray-400"
                disabled={isLoading}
              >
                <option value="">-- Wybierz kategorię --</option>
                {productOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="mt-2 text-center">
                <Button
                  onClick={() => document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" })}
                  disabled={!selectedCategory || isLoading}
                  className="font-medium"
                >
                  {isLoading ? "Ładowanie..." : "Pokaż wymagania"}
                </Button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          {selectedCategory && (
            <div id="results-section" className="scroll-mt-16">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold">{selectedCategory.name}</h3>
                  <p className="text-gray-600 text-base">
                    Kod kategorii: <span className="font-semibold">{selectedCategory.code}</span> | {selectedCategory.description}
                  </p>
                </div>
              </div>
              
              <div className="w-full">
                <div className="grid grid-cols-5 mb-8 gap-2 border-b border-gray-200 pb-4">
                  <button onClick={() => setActiveTab("overview")} className={`py-2 px-4 text-sm font-medium rounded-md ${activeTab === "overview" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-700"}`}>Przegląd</button>
                  <button onClick={() => setActiveTab("tests")} className={`py-2 px-4 text-sm font-medium rounded-md ${activeTab === "tests" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-700"}`}>Badania</button>
                  <button onClick={() => setActiveTab("documentation")} className={`py-2 px-4 text-sm font-medium rounded-md ${activeTab === "documentation" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-700"}`}>Dokumentacja</button>
                  <button onClick={() => setActiveTab("changes")} className={`py-2 px-4 text-sm font-medium rounded-md ${activeTab === "changes" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-700"}`}>Zmiany CPR 2024</button>
                  <button onClick={() => setActiveTab("certification")} className={`py-2 px-4 text-sm font-medium rounded-md ${activeTab === "certification" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-700"}`}>Certyfikacja</button>
                </div>
                
                {activeTab === "overview" && (
                  <div className="space-y-4">
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold">{selectedCategory.requirements.title}</h3>
                      </div>
                      <div>
                        <p className="text-gray-700 mb-6">{selectedCategory.requirements.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-gray-50 p-6 rounded-lg">
                            <h4 className="font-bold text-gray-700 mb-3">Kluczowe wymagania:</h4>
                            <ul className="space-y-2">
                              {selectedCategory.requirements.mandatoryTests.slice(0, 3).map((test, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-gray-500 mr-2">✓</span>
                                  <span>{test}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="bg-green-50 p-6 rounded-lg">
                            <h4 className="font-bold text-green-700 mb-3">Nowości w CPR 2024:</h4>
                            <ul className="space-y-2">
                              {selectedCategory.requirements.cprChanges.slice(0, 3).map((change, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-green-500 mr-2">→</span>
                                  <span>{change}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === "tests" && (
                  <div className="space-y-4">
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold">Wymagane badania</h3>
                        <p className="text-gray-600">
                          Wyroby z kategorii "{selectedCategory.name}" muszą przejść następujące badania:
                        </p>
                      </div>
                      <div>
                        <ul className="space-y-4">
                          {selectedCategory.requirements.mandatoryTests.map((test, index) => (
                            <li key={index} className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-start">
                                <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                                  {index + 1}
                                </div>
                                <div>
                                  <p className="font-medium">{test}</p>
                                  {test.includes("nowe") && (
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded mt-1 inline-block">
                                      Nowy wymog CPR 2024
                                    </span>
                                  )}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === "documentation" && (
                  <div className="space-y-4">
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold">Wymagana dokumentacja</h3>
                        <p className="text-gray-600">
                          Producenci wyrobów z kategorii "{selectedCategory.name}" muszą przygotować:
                        </p>
                      </div>
                      <div>
                        <ul className="space-y-4">
                          {selectedCategory.requirements.documentationRequired.map((doc, index) => (
                            <li key={index} className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-start">
                                <div className="text-gray-400 mr-3">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="font-medium">{doc}</p>
                                  {doc.includes("nowy") && (
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded mt-1 inline-block">
                                      Nowy wymog CPR 2024
                                    </span>
                                  )}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                        
                        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-start">
                            <div className="text-gray-500 mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700">Pobierz wzory dokumentów</p>
                              <p className="text-gray-600 text-sm">W sekcji "Dokumenty" znajdziesz gotowe szablony wymaganych dokumentów.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === "changes" && (
                  <div className="space-y-4">
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold">Zmiany proponowane w nowym rozporządzeniu CPR</h3>
                        <p className="text-gray-600">
                          Najważniejsze modyfikacje dla kategorii "{selectedCategory.name}" w porównaniu z poprzednim rozporządzeniem:
                        </p>
                      </div>
                      <div>
                        <ul className="space-y-4">
                          {selectedCategory.requirements.cprChanges.map((change, index) => (
                            <li key={index} className="bg-green-50 p-4 rounded-lg">
                              <div className="flex items-start">
                                <div className="bg-green-100 text-green-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                                  {index + 1}
                                </div>
                                <p className="font-medium text-green-900">{change}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === "certification" && (
                  <div className="space-y-4">
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold">Systemy oceny i weryfikacji stałości właściwości użytkowych</h3>
                        <p className="text-gray-600">
                          Dla wyrobów z kategorii "{selectedCategory.name}" obowiązują następujące systemy certyfikacji:
                        </p>
                      </div>
                      <div>
                        <div className="space-y-4">
                          {selectedCategory.requirements.certificationSystems.map((system, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-bold mb-2">{system}</h4>
                              <p className="text-gray-600">
                                {system === "System 1+" && "Najwyższy poziom kontroli - wymaga certyfikacji przez jednostkę notyfikowaną, stałego nadzoru i badań próbek z rynku."}
                                {system === "System 1" && "Wymaga certyfikacji przez jednostkę notyfikowaną oraz stałego nadzoru bez badań próbek z rynku."}
                                {system === "System 2+" && "Wymaga certyfikacji zakładowej kontroli produkcji przez jednostkę notyfikowaną i wstępnych badań typu przez producenta."}
                                {system === "System 3+" && "Kontrola przeprowadzana przez jednostkę notyfikowaną w zakresie oceny zrównoważenia środowiskowego - walidacja modeli, danych wejściowych i oprogramowania do oceny środowiskowej"}
                                {system === "System 3" && "Wymaga badań typu przez akredytowane laboratorium, zakładowa kontrola produkcji przez producenta."}
                                {system === "System 4" && "Najniższy poziom kontroli - badania typu i zakładowa kontrola produkcji wykonywane przez producenta."}
                              </p>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
                          <div className="flex items-start">
                            <div className="text-yellow-500 mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-yellow-800">Potrzebujesz certyfikacji?</p>
                              <p className="text-yellow-700 text-sm mb-2">Multicert oferuje kompleksowe usługi certyfikacji zgodnej z CPR 2024.</p>
                              <Button 
                                variant="outline"
                                className="text-sm bg-white"
                                onClick={() => navigate("/services")}
                              >
                                Sprawdź nasze usługi
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-10 flex justify-center">
                <Button variant="outline" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  Powrót do wyszukiwarki
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <hr className="border-t border-gray-200" />

      {/* About Section */}
      <section id="about-section" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">O proponowanym rozporządzeniu CPR</h2>
              <p className="text-gray-600 mb-4">
                <a href="https://eur-lex.europa.eu/legal-content/PL/TXT/HTML/?uri=OJ:L_202403110#anx_III" target="_blank" rel="noopener noreferrer" className="underline font-medium">Proponowane nowe rozporządzenie</a> o wyrobach budowlanych (roboczo nazywane "CPR 2024") zakłada istotne zmiany dla producentów, importerów i dystrybutorów wyrobów budowlanych w Unii Europejskiej.
              </p>
              <p className="text-gray-600 mb-4">
                Główne obszary zmian obejmują:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Zrównoważony rozwój i aspekty środowiskowe</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Cyfryzacja dokumentacji i oznakowania wyrobu</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Nowe systemy oceny i weryfikacji stałości właściwości użytkowych</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Zaostrzenie wymagań dotyczących bezpieczeństwa i jakości</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Wprowadzenie cyfrowego paszportu produktu</span>
                </li>
              </ul>
              <Button 
                onClick={() => document.getElementById("search-section")?.scrollIntoView({ behavior: "smooth" })}
                variant="outline"
                className="font-medium"
              >
                Sprawdź wymagania dla Twojego produktu
              </Button>
            </div>
            
            <div className="md:w-1/2">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold mb-4">Przewidywany harmonogram wdrażania nowego CPR</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-16 text-sm font-bold">2024</div>
                    <div>
                      <p className="font-semibold">Wejście w życie CPR 2024</p>
                      <p className="text-gray-600 text-sm">Publikacja i początek okresu przejściowego</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-16 text-sm font-bold">2025</div>
                    <div>
                      <p className="font-semibold">Wdrożenie nowych wymagań dokumentacyjnych</p>
                      <p className="text-gray-600 text-sm">Aktualizacja deklaracji właściwości użytkowych i dokumentacji technicznej</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-16 text-sm font-bold">2026</div>
                    <div>
                      <p className="font-semibold">Cyfryzacja dokumentacji</p>
                      <p className="text-gray-600 text-sm">Obowiązkowe wdrożenie cyfrowej deklaracji właściwości użytkowych</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-16 text-sm font-bold">2027</div>
                    <div>
                      <p className="font-semibold">Pełne wdrożenie wymagań środowiskowych</p>
                      <p className="text-gray-600 text-sm">Obowiązkowe raportowanie śladu węglowego i cyklu życia produktu</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-16 text-sm font-bold">2028</div>
                    <div>
                      <p className="font-semibold">Końcowa data zgodności</p>
                      <p className="text-gray-600 text-sm">Pełne wdrożenie wszystkich wymagów CPR 2024 bez wyjątków</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-red-50 rounded-lg">
                  <p className="text-red-700 font-medium">
                    Uwaga: Działaj już teraz, nie czekaj na ostatni moment! Proces dostosowania do CPR 2024 może być długotrwały.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Potrzebujesz pomocy w przygotowaniu do nowych wymagań CPR?</h2>
            <p className="text-gray-600 mb-8">
              Nasi eksperci pomogą Ci dostosować Twoje wyroby do nowych wymagań. Oferujemy kompleksowe wsparcie w procesie certyfikacji oraz doradztwo w zakresie interpretacji przepisów.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="font-medium"
                onClick={() => navigate("/services")}
              >
                Nasze usługi certyfikacyjne
              </Button>
              <Button 
                variant="outline" 
                className="font-medium"
                onClick={() => document.getElementById("search-section")?.scrollIntoView({ behavior: "smooth" })}
              >
                Sprawdź wymagania
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}