import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContextUnified';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Container } from '../components/Container';
import { AuthWrapper } from '../components/AuthWrapper';

function Signup() {
  const navigate = useNavigate();
  const { isAuthenticated, signUp, isLoading: authLoading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !success) {
      navigate('/client-portal');
    }
  }, [isAuthenticated, navigate, success]);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('Signup submission using unified auth context');
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Validate password match
    if (password !== confirmPassword) {
      setError('Hasła nie są takie same');
      toast.error('Hasła nie są takie same');
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setError('Hasło musi mieć co najmniej 6 znaków');
      toast.error('Hasło musi mieć co najmniej 6 znaków');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await signUp({ email, password, fullName });
      
      if (error) {
        const errorMessage = error.message || 'Wystąpił błąd podczas rejestracji. Spróbuj ponownie.';
        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        setSuccess(true);
        toast.success('Rejestracja przebiegła pomyślnie! Sprawdź swój email, aby potwierdzić konto.');
        // Redirect to login after successful signup
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      console.error('Signup error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Wystąpił błąd podczas rejestracji. Spróbuj ponownie.';
      setError(errorMessage);
      toast.error(errorMessage);
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
            <h1 className="text-2xl font-bold mb-6 text-center">Zarejestruj się</h1>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              {success ? (
                <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50">
                  <p>Rejestracja przebiegła pomyślnie! Sprawdź swój email, aby potwierdzić konto.</p>
                  <p className="mt-2">Za chwilę zostaniesz przekierowany do strony logowania...</p>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                      {error}
                      {error.includes("Wystąpił błąd") && (
                        <p className="mt-2">
                          Sprawdź, czy konfiguracja Supabase jest poprawna. 
                          <Link to="/admin-supabase-config" className="text-red-600 hover:text-red-800 underline">
                            Kliknij tutaj, aby skonfigurować Supabase
                          </Link>
                        </p>
                      )}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                        Imię i Nazwisko
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Jan Kowalski"
                      />
                    </div>
                    
                    <div className="mb-4">
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
                    
                    <div className="mb-4">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Hasło
                      </label>
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Minimum 6 znaków"
                        required
                      />
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Potwierdź hasło
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Potwierdź hasło"
                        required
                      />
                    </div>
                    
                    <div className="flex justify-center">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full px-4 py-2 rounded-md bg-blue-600 text-white font-medium ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                      >
                        {isLoading ? "Rejestrowanie..." : "Zarejestruj się"}
                      </button>
                    </div>
                  </form>
                </>
              )}
              
              <div className="mt-6 text-center text-sm">
                <p>
                  Masz już konto?{" "}
                  <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                    Zaloguj się
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default Signup;