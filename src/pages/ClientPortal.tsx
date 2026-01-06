import { useState } from 'react';
import { useAuth } from '../utils/AuthContextUnified';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Container } from '../components/Container';
import { ProtectedRoute } from '../components/ProtectedRoute';

function ClientPortalContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Container>
          <div className="max-w-6xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-8">Portal Klienta</h1>
            
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              {/* Tabs navigation */}
              <div className="flex border-b border-gray-200">
                <button
                  className={`px-6 py-3 text-sm font-medium ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  Pulpit
                </button>
                <button
                  className={`px-6 py-3 text-sm font-medium ${activeTab === 'certification' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('certification')}
                >
                  Procesy certyfikacji
                </button>
                <button
                  className={`px-6 py-3 text-sm font-medium ${activeTab === 'documents' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('documents')}
                >
                  Moje dokumenty
                </button>
                <button
                  className={`px-6 py-3 text-sm font-medium ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('profile')}
                >
                  Profil
                </button>
              </div>
              
              {/* Tab content */}
              <div className="p-6">
                {activeTab === 'dashboard' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Witaj, {user?.user_metadata?.full_name || user?.email}!</h2>
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-3">Skróty informacji</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <h4 className="font-medium mb-2">Aktywne certyfikacje</h4>
                          <p className="text-3xl font-bold text-blue-600">0</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <h4 className="font-medium mb-2">Dokumenty do podpisu</h4>
                          <p className="text-3xl font-bold text-blue-600">0</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <h4 className="font-medium mb-2">Powiadomienia</h4>
                          <p className="text-3xl font-bold text-blue-600">0</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-3">Aktualne informacje</h3>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <p className="text-blue-800">Witamy w portalu klienta NowyCPR.pl. Tutaj możesz zarządzać swoimi procesami certyfikacji, przeglądać dokumenty i monitorować status swoich zgłoszeń.</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'certification' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Procesy certyfikacji</h2>
                    <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-center">
                      <p className="text-gray-600 mb-4">Nie masz jeszcze żadnych aktywnych procesów certyfikacji.</p>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        Rozpocznij nowy proces
                      </button>
                    </div>
                  </div>
                )}
                
                {activeTab === 'documents' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Moje dokumenty</h2>
                    <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-center">
                      <p className="text-gray-600 mb-4">Nie masz jeszcze żadnych dokumentów w systemie.</p>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        Prześlij dokument
                      </button>
                    </div>
                  </div>
                )}
                
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Twój profil</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-medium mb-3">Dane konta</h3>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-1">Email</p>
                            <p className="font-medium">{user?.email}</p>
                          </div>
                          <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-1">Imię i nazwisko</p>
                            <p className="font-medium">{user?.user_metadata?.full_name || '-'}</p>
                          </div>
                          <div>
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                              Zmień hasło
                            </button>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-3">Dane kontaktowe</h3>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-gray-600 mb-4">Uzupełnij dane kontaktowe, aby ułatwić komunikację w ramach procesów certyfikacji.</p>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                            Uzupełnij dane
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default function ClientPortal() {
  return (
    <ProtectedRoute>
      <ClientPortalContent />
    </ProtectedRoute>
  );
}