import React from "react";
import { Container } from "./Container";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-gray-50 py-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-xl font-bold mb-4">
              <span className="text-gray-800">NowyCPR</span>
              <span className="text-gray-500">.pl</span>
            </div>
            <p className="text-gray-600 text-sm">
              Kompleksowe wsparcie dla producentów wyrobów budowlanych w kontekście nowego rozporządzenia CPR 2024.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Przydatne linki</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-600 hover:text-gray-800">Strona Główna</Link></li>
              <li><Link to="/product-search" className="text-gray-600 hover:text-gray-800">Wyszukiwarka CPR</Link></li>
              <li><Link to="/documents" className="text-gray-600 hover:text-gray-800">Dokumenty</Link></li>
              <li><Link to="/services" className="text-gray-600 hover:text-gray-800">Usługi</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Kontakt</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Multicert Sp. z o.o.</li>
              <li>ul. Przykładowa 12</li>
              <li>00-000 Warszawa</li>
              <li>info@multicert.pl</li>
              <li>+48 123 456 789</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-600 text-sm mb-4">Bądź na bieżąco z najnowszymi informacjami o CPR 2024</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
              const nameInput = form.querySelector('input[type="text"]') as HTMLInputElement;
              
              if (emailInput && emailInput.value) {
                const name = nameInput?.value || '';
                import('utils/newsletterHelpers').then(({ subscribeToNewsletter, validateEmail }) => {
                  if (!validateEmail(emailInput.value)) {
                    alert("Proszę podać prawidłowy adres email");
                    return;
                  }
                  
                  subscribeToNewsletter(emailInput.value, 'footer-newsletter', name)
                    .then(success => {
                      if (success) {
                        alert("Dziękujemy za zapisanie się do newslettera!");
                        emailInput.value = '';
                        if (nameInput) nameInput.value = '';
                      } else {
                        alert("Wystąpił problem podczas zapisywania. Spróbuj ponownie.");
                      }
                    });
                });
              }
            }}>
              <div className="space-y-3 mb-3">
                <input 
                  type="text" 
                  placeholder="Twoje imię" 
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-white"
                />
                <input 
                  type="email" 
                  placeholder="Twój e-mail" 
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-white"
                />
                <button 
                  type="submit" 
                  className="w-full bg-gray-700 text-white px-3 py-2 text-sm rounded-md hover:bg-gray-600 font-medium"
                >
                  Zapisz się
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Twoje dane będą wykorzystane wyłącznie w celu wysyłki newslettera.</p>
            </form>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <div>
            <p>© 2025 NowyCPR.pl. Wszystkie prawa zastrzeżone.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <p>Strona zarządzana przez Multicert Sp. z o.o., opracowana przez TechStandard.io.</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <Link to="/" className="hover:text-gray-800">Polityka prywatności</Link>
            <Link to="/" className="hover:text-gray-800">Regulamin</Link>
            <Link to="/services" className="hover:text-gray-800">Kontakt</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
