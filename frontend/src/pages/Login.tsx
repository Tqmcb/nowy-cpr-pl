import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContextUnified';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Container } from '../components/Container';
import { API_URL } from 'app';

function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, signIn, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [redirected, setRedirected] = useState(false);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !redirected) {
      setRedirected(true);
      navigate('/client-portal');
    }
  }, [isAuthenticated, navigate, redirected]);

  // Sprawdza czy konto istnieje w Supabase używając API
  const checkAccountExists = async () => {
    try {
      console.log('Checking if account exists:', email);
      const response = await fetch(`${API_URL}/check-auth2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include'
      });
      
      console.log('Account check response status:', response.status);
      const data = await response.json();
      console.log('Account check response data:', data);
      return data;
    } catch (err) {
      console.error('Error checking account:', err);
      return { exists: false, message: 'Błąd połączenia z serwerem.' };
    }
  };

  // Tworzy konto administratora używając API
  const createAdminAccount = async () => {
    try {
      // Get Supabase config data from localStorage
      const supabaseUrl = localStorage.getItem('supabaseUrl') || '';
      const supabaseKey = localStorage.getItem('supabaseKey') || '';
      const serviceRoleKey = localStorage.getItem('supabaseServiceRoleKey') || '';
      
      console.log('Creating admin with Supabase config:', { 
        hasUrl: !!supabaseUrl, 
        hasKey: !!supabaseKey, 
        hasServiceKey: !!serviceRoleKey 
      });
      
      // Sprawdź czy mamy konfigurację z localStorage lub z db.storage
      let body = { 
        email, 
        password,
        full_name: 'Administrator'
      };
      
      // Dodaj konfigurację Supabase tylko jeśli mamy ją w localStorage
      if (supabaseUrl && supabaseKey) {
        body = {
          ...body,
          supabase_url: supabaseUrl,
          supabase_key: supabaseKey,
          service_role_key: serviceRoleKey
        };
      }
      
      console.log('Sending create-admin request to:', `${API_URL}/create-admin`);
      const response = await fetch(`${API_URL}/create-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        credentials: 'include'
      });
      
      console.log('Create admin response status:', response.status);
      const data = await response.json();
      console.log('Create admin response data:', data);
      return data;
    } catch (err) {
      console.error('Error creating admin account:', err);
      return { success: false, message: 'Błąd podczas tworzenia konta administratora.' };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Pobierz i wyświetl informacje o konfiguracji Supabase dla diagnostyki
    const supabaseUrl = localStorage.getItem('supabaseUrl');
    const supabaseKey = localStorage.getItem('supabaseKey');
    console.log('Supabase config from localStorage (Login):',{url:supabaseUrl,keyStart:supabaseKey?supabaseKey.substring(0,15)+'...':'undefined'});
    
    console.log('Login form submitted for:', email);

    try {
      // Try login with unified auth context
      const { data, error: signInError } = await signIn({ email, password });
      
      console.log('SignIn result:', {
        success: !!data,
        hasError: !!signInError,
        errorMessage: signInError?.message
      });
      
      if (signInError) {
        // If login fails, check if this is a potential admin account
        if (email.endsWith('@multicert.pl')) {
          // Try to create admin account
          const adminCreation = await createAdminAccount();
          console.log('Admin creation result:', adminCreation);
          
          if (adminCreation.success) {
            toast.success(adminCreation.message);
            // Try logging in immediately after creating the account
            console.log('Trying to login after admin account creation');
            
            const { data: newData, error: newError } = await signIn({ email, password });
            
            console.log('Login result after admin creation:', {
              success: !!newData,
              hasError: !!newError,
              errorMessage: newError?.message
            });
            
            if (newError) {
              setError('Konto utworzono, ale nie można się zalogować automatycznie. Spróbuj ponownie.');
              toast.error('Spróbuj zalogować się ponownie.');
            } else if (newData) {
              toast.success('Zalogowano pomyślnie!');
              setRedirected(true);
              navigate('/client-portal');
            }
          } else {
            toast.error(adminCreation.message);
            setError(adminCreation.message);
          }
        } else {
          // Check if account exists
          const accountCheck = await checkAccountExists();
          
          if (!accountCheck.exists) {
            // For non-multicert emails that don't exist, redirect to signup
            toast.error('Konto nie istnieje. Proszę się zarejestrować.');
            setTimeout(() => navigate('/signup'), 1500);
          } else {
            // Account exists but login failed
            const errorMessage = signInError.message || 'Nieprawidłowy email lub hasło';
            setError(errorMessage);
            toast.error(errorMessage);
          }
        }
      } else if (data) {
        // Successfully logged in, redirect to client portal or dashboard
        toast.success('Zalogowano pomyślnie!');
        setRedirected(true);
        navigate('/client-portal');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Wystąpił błąd podczas logowania. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };

  // Jeśli trwa ładowanie, pokazujemy komunikat
  if ((isAuthenticated || authLoading) && isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
            <Container>
              <div className="max-w-md mx-auto py-12 px-4 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-600">Trwa logowanie...</p>
                </div>
              </div>
            </Container>
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
          <div className="max-w-md mx-auto py-12 px-4">
            <h1 className="text-2xl font-bold mb-6 text-center">Logowanie</h1>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              {error && (
                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                  {error}
                  {(error.includes("Wystąpił błąd") || error.includes("Supabase") || error.includes("API key")) && (
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
                
                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Hasło
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Twoje hasło"
                    required
                  />
                  <div className="mt-1 text-sm text-right">
                    <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800">
                      Nie pamiętasz hasła?
                    </Link>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full px-4 py-2 rounded-md bg-blue-600 text-white font-medium ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                  >
                    {isLoading ? "Logowanie..." : "Zaloguj się"}
                  </button>
                </div>
              </form>
              
              <div className="mt-6 text-center text-sm">
                <p>
                  Nie masz jeszcze konta?{" "}
                  <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                    Zarejestruj się
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

export default Login;