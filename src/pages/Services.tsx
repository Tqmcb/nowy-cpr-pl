import React, { useState } from "react";
import { Container } from "../components/Container";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/Button";

export default function Services() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    consent: false
  });
  
  const [formStatus, setFormStatus] = useState<null | "success" | "error">(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setFormStatus("success");
      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
        consent: false
      });
    }, 1000);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-12 md:py-24 bg-gradient-to-b from-gray-50 to-white">
          <Container>
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 mb-6">
                Usługi certyfikacyjne Multicert
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Kompleksowe wsparcie w certyfikacji wyrobów budowlanych zgodnie z CPR 2024. Oferujemy profesjonalną pomoc, szybką realizację i najwyższą jakość usług.
              </p>
            </div>
          </Container>
        </section>

        {/* Key Benefits */}
        <section className="py-16 bg-white">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center p-6 bg-primary/5 rounded-lg">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Ekspresowa certyfikacja</h3>
                <p className="text-gray-600">
                  Uzyskaj certyfikat w rekordowym czasie dzięki naszym zoptymalizowanym procesom i doświadczonemu zespołowi ekspertów.
                </p>
              </div>
              
              <div className="text-center p-6 bg-primary/5 rounded-lg">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Ekspercka pomoc</h3>
                <p className="text-gray-600">
                  Nasi specjaliści pomogą zinterpretować przepisy i dopasować wymagania do specyfiki Twojego produktu.
                </p>
              </div>
              
              <div className="text-center p-6 bg-primary/5 rounded-lg">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 16M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044M12 3c-2.755 0-5.455.232-8.083.678C3.384 4.367 3 4.833 3 5.373V6.5m15-3.5v8.5a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 13.5V8.25m18 0A2.25 2.25 0 0018.75 6H5.25A2.25 2.25 0 003 8.25m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v2.25" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Współpraca z laboratoriami</h3>
                <p className="text-gray-600">
                  Korzystamy z sieci akredytowanych laboratoriów badawczych, co gwarantuje kompleksową obsługę w jednym miejscu.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Services Offered */}
        <section className="py-16 bg-gray-50">
          <Container>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Nasze usługi certyfikacyjne</h2>
              <p className="text-lg text-gray-600">
                Multicert oferuje szeroki zakres usług wspierających producentów w dostosowaniu do wymagań CPR 2024.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <span className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-3 flex-shrink-0 text-lg font-bold">1</span>
                  Certyfikacja stałości właściwości użytkowych
                </h3>
                <p className="text-gray-600 mb-4">
                  Kompleksowa ocena i certyfikacja zgodnie z systemami AVCP określonymi w CPR 2024. Obejmuje badanie typu, ocenę dokumentacji technicznej i weryfikację zakładowej kontroli produkcji.
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-primary mr-2 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Certyfikaty zgodne z systemami A+, A, B+ i B</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-primary mr-2 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Certyfikacja zakładowej kontroli produkcji</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-primary mr-2 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Okresowa ocena i nadzór nad produkcją</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <span className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-3 flex-shrink-0 text-lg font-bold">2</span>
                  Badania wyrobów budowlanych
                </h3>
                <p className="text-gray-600 mb-4">
                  Kompleksowe badania laboratoryjne wyrobów budowlanych, które są niezbędne do uzyskania certyfikacji. Współpracujemy z siecią akredytowanych laboratoriów badawczych.
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-primary mr-2 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Badania typu zgodnie z normami zharmonizowanymi</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-primary mr-2 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Badania środowiskowe i ocena cyklu życia</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-primary mr-2 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Analiza składu i ocena zawartości substancji niebezpiecznych</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <span className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-3 flex-shrink-0 text-lg font-bold">3</span>
                  Przygotowanie dokumentacji technicznej
                </h3>
                <p className="text-gray-600 mb-4">
                  Profesjonalne przygotowanie i weryfikacja dokumentacji technicznej zgodnie z nowymi wymogami CPR 2024, w tym cyfrowych deklaracji właściwości użytkowych.
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-primary mr-2 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Przygotowanie cyfrowych DoP w formacie XML</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-primary mr-2 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Opracowanie kart charakterystyki produktu</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-primary mr-2 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Przygotowanie etykiet i oznakowania CE</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <span className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-3 flex-shrink-0 text-lg font-bold">4</span>
                  Doradztwo i szkolenia
                </h3>
                <p className="text-gray-600 mb-4">
                  Profesjonalne doradztwo i szkolenia z zakresu wymagań CPR 2024 dla producentów, dystrybutorów i importerów wyrobów budowlanych.
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-primary mr-2 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Konsultacje dotyczące nowych przepisów CPR 2024</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-primary mr-2 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Szkolenia z zakładowej kontroli produkcji</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-primary mr-2 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Warsztaty z przygotowania dokumentacji technicznej</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="text-center">
              <Button size="lg">
                Poznaj pełną ofertę usług
              </Button>
            </div>
          </Container>
        </section>

        {/* Case Studies */}
        <section className="py-16 bg-white">
          <Container>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Zaufali nam</h2>
              <p className="text-lg text-gray-600">
                Poznaj historie sukcesu firm, które skorzystały z naszych usług certyfikacyjnych.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold">Ceramika Budowlana S.A.</h3>
                  <div className="text-primary font-semibold">2023</div>
                </div>
                <p className="text-gray-600 mb-4">
                  Certyfikacja pełnej linii wyrobów ceramicznych zgodnie z CPR. Proces został zakończony w ciągu 4 tygodni, co pozwoliło na terminowe wprowadzenie produktów na rynek UE.
                </p>
                <div className="text-sm text-gray-500 italic">
                  "Profesjonalizm i szybkość działania Multicert pozwoliły nam uniknąć opóźnień w dostawach do naszych klientów."
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold">Termo Izolacje Sp. z o.o.</h3>
                  <div className="text-primary font-semibold">2024</div>
                </div>
                <p className="text-gray-600 mb-4">
                  Kompleksowe dostosowanie dokumentacji technicznej i procedur do nowych wymogów CPR 2024. Wdrożenie systemu zakładowej kontroli produkcji zgodnego z nowymi przepisami.
                </p>
                <div className="text-sm text-gray-500 italic">
                  "Dzięki wsparciu Multicert bezproblemowo przeszliśmy przez proces dostosowania do nowych przepisów CPR 2024."
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold">Stal Konstrukcje Sp.j.</h3>
                  <div className="text-primary font-semibold">2023</div>
                </div>
                <p className="text-gray-600 mb-4">
                  Pełna certyfikacja wyrobów stalowych zgodnie z systemem AVCP 2+. Przygotowanie cyfrowych deklaracji właściwości użytkowych dla całego asortymentu.
                </p>
                <div className="text-sm text-gray-500 italic">
                  "Eksperci Multicert przeprowadzili nas przez złożony proces certyfikacji krok po kroku, co znacznie ułatwiło całą procedurę."
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Contact Form */}
        <section className="py-16 bg-gray-50">
          <Container>
            <div className="max-w-3xl mx-auto">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Umów bezpłatną konsultację</h2>
                  <p className="text-gray-600">
                    Skontaktuj się z nami, aby omówić Twoje potrzeby związane z certyfikacją wyrobów budowlanych zgodnie z CPR 2024.
                  </p>
                </div>
                
                {formStatus === "success" ? (
                  <div className="bg-green-50 text-green-700 p-4 rounded-lg text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 mx-auto mb-2">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <h3 className="font-bold mb-1">Dziękujemy za wiadomość!</h3>
                    <p>Nasz ekspert skontaktuje się z Tobą w ciągu 24 godzin, aby omówić szczegóły konsultacji.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Imię i nazwisko *</label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Firma *</label>
                        <input
                          id="company"
                          name="company"
                          type="text"
                          required
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Wiadomość *</label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        placeholder="Opisz jaką usługę certyfikacyjną jesteś zainteresowany"
                      ></textarea>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex items-start">
                        <input
                          id="consent"
                          name="consent"
                          type="checkbox"
                          required
                          checked={formData.consent}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mt-1"
                        />
                        <label htmlFor="consent" className="ml-2 block text-sm text-gray-700">
                          Wyrażam zgodę na przetwarzanie moich danych osobowych w celu udzielenia odpowiedzi na zapytanie oraz w celach marketingowych zgodnie z Polityką Prywatności. *
                        </label>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <Button type="submit" size="lg">
                        Wyślij zapytanie
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </Container>
        </section>
        
        {/* Chatbot Placeholder */}
        <div className="fixed bottom-6 right-6 z-10">
          <button className="bg-primary text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
