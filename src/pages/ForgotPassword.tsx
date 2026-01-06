import { useState } from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContextUnified';
import { AuthWrapper } from '../components/AuthWrapper';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Container } from '../components/Container';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Pobierz konfigurację Supabase dla loggera
      const supabaseUrl = localStorage.getItem('supabaseUrl');
      const supabaseKey = localStorage.getItem('supabaseKey');
      console.log('Supabase config (ResetPassword):', {
        url: supabaseUrl,
        hasKey: !!supabaseKey,
        currentUrl: window.location.origin
      });

      // Sprawdź czy mamy poprawną konfigurację Supabase
      if (!supabaseUrl || !supabaseKey) {
        const configError = 'Brak konfiguracji Supabase. Skonfiguruj Supabase w panelu administratora.';
        console.error(configError);
        setError(configError);
        toast.error('Proszę skonfigurować Supabase przed resetowaniem hasła');
        setIsLoading(false);
        return;
      }

      console.log('Attempting password reset for:', email);
      try {
        const { error } = await resetPassword(email);
        
        if (error) {
          console.error('Password reset error:', error);
          
          // Szczegółowe informacje o błędzie do konsoli
          if (typeof error === 'object') {
            console.log('Detailed error info:', JSON.stringify(error, null, 2));
          }
          
          // Bardziej przyjazne komunikaty błędów
          let errorMessage = 'Wystąpił błąd. Spróbuj ponownie.';
          
          if (error.message?.includes('Invalid API key')) {
            errorMessage = 'Nieprawidłowy klucz API Supabase. Sprawdź konfigurację w panelu administracyjnym.';
          } else if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
            errorMessage = 'Nie można połączyć się z serwerem Supabase. Sprawdź konfigurację i połączenie internetowe.';
          } else if (error.message?.includes('rate limit')) {
            errorMessage = 'Przekroczono limit prób. Spróbuj ponownie za kilka minut.';
          } else if (error.message?.includes('User not found')) {
            // Dla bezpieczeństwa nie informujemy, że użytkownik nie istnieje
            setSuccess(true);
            toast.success('Jeśli konto istnieje, wysłaliśmy link do resetowania hasła na podany adres email.');
            console.log('Password reset flow completed, redirecting to success state');
            return;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          setError(errorMessage);
          toast.error(errorMessage);
        } else {
          setSuccess(true);
          toast.success('Wysłaliśmy link do resetowania hasła na podany adres email.');
          console.log('Password reset email sent successfully');
        }
      } catch (innerError) {
        // Dodatkowa obsługa błędów dla przypadku, gdy resetPassword rzuci błąd
        console.error('Unexpected error during password reset:', innerError instanceof Error ? innerError.message : 'Unknown error');
        const errorMessage = 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error('Password reset error:', err instanceof Error ? err.message : 'Unknown error');
      setError('Wystąpił błąd. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Container>
          <div className="max-w-md mx-auto py-12 px-4">
            <h1 className="text-2xl font-bold mb-6 text-center">Resetowanie hasła</h1>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              {success ? (
                <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50">
                  <p>Wysłaliśmy link do resetowania hasła na podany adres email.</p>
                  <p className="mt-2">Sprawdź swoją skrzynkę pocztową i postępuj zgodnie z instrukcjami.</p>
                  <div className="mt-4">
                    <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                      Powrót do strony logowania
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 mb-6">
                    Wprowadź swój adres email, a wyślemy Ci link do zresetowania hasła.
                  </p>
                  
                  {error && (
                    <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="przyklad@email.com"
                        required
                      />
                    </div>
                    
                    <div className="flex justify-center">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full px-4 py-2 rounded-md bg-blue-600 text-white font-medium ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                      >
                        {isLoading ? "Wysyłanie..." : "Wyślij link resetujący"}
                      </button>
                    </div>
                  </form>
                  
                  <div className="mt-6 text-center text-sm">
                    <Link to="/login" className="text-blue-600 hover:text-blue-800">
                      Powrót do strony logowania
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default ForgotPassword;