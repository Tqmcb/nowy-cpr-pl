import React from "react";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { AuthWrapper } from "../components/AuthWrapper";
import { useAuth } from "../utils/AuthContext";

function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-12 md:py-24 bg-gradient-to-b from-gray-50 to-white">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-primary mb-6">
                  Nadchodzące Rozporządzenie CPR – Przygotuj Swój Produkt Na Nowe Wymagania
                </h1>
                <p className="text-lg text-gray-700 mb-8">
                  Nowe przepisy CPR 2024 wprowadzają istotne zmiany dla producentów wyrobów budowlanych. Sprawdź, czy Twoje produkty spełniają aktualne wymagania i uniknij konsekwencji braku zgodności.
                </p>
                <Button 
                  size="lg" 
                  onClick={() => navigate("/product-search")}
                  className="font-semibold bg-secondary text-primary hover:bg-secondary/90"
                >
                  Sprawdź wymagania dla Twojego produktu
                </Button>
              </div>
              <div className="bg-accent/10 rounded-lg aspect-video flex items-center justify-center border-2 border-secondary shadow-md">
                {/* Placeholder for video/infographic */}
                <div className="text-primary text-center p-8">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 mx-auto mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <p>Infografika wyjaśniająca zmiany w przepisach CPR 2024</p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* About CPR 2024 Section */}
        <section className="py-16 bg-white">
          <Container>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-amber-700">
                      <strong>Informacja:</strong> Prezentowane wymagania oparte są na <a href="https://eur-lex.europa.eu/legal-content/PL/TXT/HTML/?uri=OJ:L_202403110#anx_III" target="_blank" rel="noopener noreferrer" className="underline font-medium">propozycji legislacyjnej</a> nowego rozporządzenia CPR. Ostateczna wersja przepisów może się różnić. Regularnie aktualizujemy nasze informacje zgodnie z postępem prac legislacyjnych.
                    </p>
                  </div>
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Czym jest rozporządzenie CPR 2024?</h2>
              <p className="text-lg text-gray-600 mb-4">
                Proponowane rozporządzenie w sprawie wyrobów budowlanych (nazywane roboczo "CPR 2024") to nowy akt prawny Unii Europejskiej w fazie legislacyjnej, który ma zastąpić dotychczasowe przepisy (Rozporządzenie 305/2011) i ustanowić zharmonizowane warunki wprowadzania do obrotu wyrobów budowlanych.
              </p>
              <p className="text-lg text-gray-700">
                Celem nowych przepisów jest zwiększenie bezpieczeństwa i zrównoważonego rozwoju w sektorze budowlanym, wprowadzenie bardziej rygorystycznych norm środowiskowych oraz digitalizacja procesów związanych z certyfikacją.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-6 rounded-lg border-l-4 border-secondary shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="w-8 h-8 bg-secondary text-primary rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                  Kluczowe daty
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex">
                    <span className="font-semibold w-28 flex-shrink-0">2023:</span>
                    <span>Propozycja nowego rozporządzenia przez Komisję Europejską</span>
                  </li>
                  <li className="flex">
                    <span className="font-semibold w-28 flex-shrink-0">2024-2025:</span>
                    <span>Przewidywany okres przyjęcia i wdrażania przepisów</span>
                  </li>
                  <li className="flex">
                    <span className="font-semibold w-28 flex-shrink-0">Po przyjęciu:</span>
                    <span>Planowane wprowadzenie cyfrowych deklaracji właściwości użytkowych</span>
                  </li>
                  <li className="flex">
                    <span className="font-semibold w-28 flex-shrink-0">Docelowo:</span>
                    <span>Harmonizacja wszystkich krajowych przepisów dotyczących wyrobów budowlanych</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg border-l-4 border-accent shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </span>
                  Główne zmiany w CPR 2024
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-accent mr-2">•</span>
                    <span>Wprowadzenie cyfrowych deklaracji właściwości użytkowych (Digital DoP)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent mr-2">•</span>
                    <span>Nowe wymagania środowiskowe i zrównoważonego rozwoju dla wyrobów budowlanych</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Rozszerzone obowiązki dla producentów, importerów i dystrybutorów</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Zmodyfikowane procedury oceny zgodności dla różnych kategorii wyrobów</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Bardziej rygorystyczne wymagania dotyczące oznakowania CE</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-primary/10 p-6 rounded-lg text-center border-2 border-secondary border-dashed">
              <p className="text-gray-700 font-medium">
                Wszystkie podmioty w łańcuchu dostaw wyrobów budowlanych muszą dostosować swoje procedury do nowych wymagań CPR 2024. Nieprzestrzeganie przepisów może prowadzić do poważnych konsekwencji prawnych i biznesowych.
              </p>
            </div>
          </Container>
        </section>
        
        {/* Footer zawiera resztę sekcji strony */}
      </main>

      <Footer />
    </div>
  )
}

// Wrap the component with AuthWrapper
export default HomePage;