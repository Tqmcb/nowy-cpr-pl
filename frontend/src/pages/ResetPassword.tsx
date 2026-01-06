import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Container } from '../components/Container';
import { useAuth } from '../utils/AuthContextUnified';
import { AuthWrapper } from '../components/AuthWrapper';
import { getAuthErrorMessage } from '../utils/authHelpers';
import { supabase } from '../utils/supabase';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { updatePassword } = useAuth();

  useEffect(() => {
    // Sprawdź czy URL zawiera token dostępu od Supabase
    const hash = location.hash;
    
    if (!hash || !hash.includes('access_token')) {
      setError('Link resetowania hasła jest nieprawidłowy lub wygasł. Spróbuj ponownie zresetować hasło.');
      return;
    }
    
    console.log('Recognized valid password reset token in URL hash');
    
    // Automatycznie obsłuż hash z tokenu i ustaw sesję
    // Supabase może automatycznie obsłużyć token z URL
    const setupAuth = async () => {
      try {
        // Supabase SDK automatycznie odczytuje token z URL bez konieczności ręcznej ekstrakcji
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session from hash:', error);
          setError('Wystąpił problem z tokenem resetowania hasła: ' + error.message);
          return;
        }
        
        if (data.session) {
          console.log('Successfully retrieved session from reset password token');
        } else {
          console.warn('No session established from hash, but no error reported');
        }
      } catch (err) {
        console.error('Exception during auth setup:', err instanceof Error ? err.message : 'Unknown error');
        setError('Nie można przetworzyć tokenu resetowania hasła. Spróbuj ponownie wygenerować link.');
      }
    };
    
    setupAuth();
  }, [location]);

  const validatePassword = () => {
    if (password.length < 6) {
      setError('Hasło musi mieć co najmniej 6 znaków.');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Hasła nie są identyczne.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword()) return;
    
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      // Sprawdź konfigurację Supabase
      const supabaseUrl = localStorage.getItem('supabaseUrl');
      const supabaseKey = localStorage.getItem('supabaseKey');
      console.log('Supabase config (ResetPassword):', {
        url: supabaseUrl,
        hasKey: !!supabaseKey
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
      
      // Sprawdź czy URL zawiera token
      const hash = location.hash;
      if (!hash || !hash.includes('access_token')) {
        setError('Link resetowania hasła jest nieprawidłowy lub wygasł. Spróbuj ponownie zresetować hasło.');
        setIsLoading(false);
        return;
      }
      
      // Sprawdź czy mamy aktywną sesję (która powinna być już ustawiona w useEffect)
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        console.error('No active session found when trying to update password');
        setError('Nie znaleziono aktywnej sesji. Link resetowania hasła mógł wygasnąć. Proszę spróbować zresetować hasło ponownie.');
        setIsLoading(false);
        return;
      }

      console.log('Attempting to update password');
      const { error } = await updatePassword(password);
      
      if (error) {
        console.error('Password update error:', error);
        
        // Użyj helpera do tłumaczenia błędów autoryzacyjnych
        const errorMessage = getAuthErrorMessage(error);
        
        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        setMessage('Twoje hasło zostało pomyślnie zaktualizowane.');
        toast.success('Hasło zaktualizowane pomyślnie.');
        console.log('Password updated successfully');
        // Redirect to login after successful password update (with a short delay)
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      console.error('Password update error:', err instanceof Error ? err.message : 'Unknown error');
      setError('Wystąpił błąd podczas aktualizacji hasła. Spróbuj ponownie.');
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
              <h1 className="text-2xl font-bold mb-6 text-center">Ustaw nowe hasło</h1>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                {error && (
                  <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                    {error}
                  </div>
                )}
                
                {message && (
                  <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50">
                    {message}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Nowe hasło
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Minimum 6 znaków"
                      required
                      minLength={6}
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Potwierdź nowe hasło
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Potwierdź nowe hasło"
                      required
                    />
                  </div>
                  
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full px-4 py-2 rounded-md bg-blue-600 text-white font-medium ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                    >
                      {isLoading ? "Aktualizowanie..." : "Zapisz nowe hasło"}
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

export default ResetPassword;
