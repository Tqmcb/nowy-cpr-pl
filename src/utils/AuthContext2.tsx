import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, UserData } from './authService';

// Define the shape of our auth context
interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  signIn: (data: { email: string; password: string }) => Promise<any>;
  signUp: (data: { email: string; password: string; fullName?: string }) => Promise<any>;
  signOut: () => Promise<any>;
  resetPassword?: (email: string) => Promise<any>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => ({}),
});

// Export the hook for using the auth context
export const useAuth2 = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider2: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is already logged in
        const userData = authService.getCurrentUser();
        if (userData) {
          console.log('Found existing user in local storage');
          
          // Verify the token with API
          try {
            await authService.verifyAuth();
            setUser(userData);
          } catch (verifyError) {
            console.error('Token verification failed:', verifyError);
            // Clear local storage if verification fails
            await authService.signOut();
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas sprawdzania autentykacji');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Sign in function
  const signIn = async (data: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.signIn(data);
      
      // Save auth data
      authService.saveAuthData(response);
      
      // Update state
      setUser({
        user_id: response.user_id,
        email: response.email,
        metadata: response.metadata
      });
      
      return { data: response, error: null };
    } catch (err) {
      console.error('Sign in error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Wystąpił błąd podczas logowania';
      setError(errorMessage);
      return { data: null, error: { message: errorMessage } };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up function
  const signUp = async (data: { email: string; password: string; fullName?: string }) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const metadata = data.fullName ? { full_name: data.fullName } : undefined;
      
      const response = await authService.signUp({
        email: data.email,
        password: data.password,
        metadata
      });
      
      // Some implementations automatically log in after signup,
      // others require email verification first
      if (response.access_token) {
        authService.saveAuthData(response);
        setUser({
          user_id: response.user_id,
          email: response.email,
          metadata: response.metadata
        });
      }
      
      return { data: response, error: null };
    } catch (err) {
      console.error('Sign up error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Wystąpił błąd podczas rejestracji';
      setError(errorMessage);
      return { data: null, error: { message: errorMessage } };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setIsLoading(true);
      await authService.signOut();
      setUser(null);
      return { error: null };
    } catch (err) {
      console.error('Sign out error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Wystąpił błąd podczas wylogowywania';
      setError(errorMessage);
      return { error: { message: errorMessage } };
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
