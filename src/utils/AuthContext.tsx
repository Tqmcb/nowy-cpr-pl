import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, auth } from './supabase';
import { apiSignIn, apiSignUp, apiResetPassword, apiVerifyAuth } from './authApi';
import type { LoginFormData, SignupFormData } from './authHelpers';

// Define the shape of our auth context state
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// Create the auth context with default values
// Function to expose auth methods directly on the context
type AuthContextWithMethodsType = AuthContextType & {
  signIn: (data: LoginFormData) => Promise<any>;
  signUp: (data: SignupFormData) => Promise<any>;
  signOut: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  updatePassword: (newPassword: string) => Promise<any>;
  getUserProfile: (userId: string) => Promise<any>;
  updateUserProfile: (userId: string, updates: any) => Promise<any>;
};

const AuthContext = createContext<AuthContextWithMethodsType>({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initial session check
    const checkSession = async () => {
      try {
        setIsLoading(true);
        
        // Debug info - sprawdź konfigurację Supabase
        const supabaseConfig = window.localStorage.getItem('sb-qiekotzsywbhuwnxxdda-auth-token');
        console.log('Session check - localStorage token:',supabaseConfig?'Present':'Not found');
        
        // First check localStorage for session
        const storedSession = localStorage.getItem('sb-qiekotzsywbhuwnxxdda-auth-token');
        if (storedSession) {
          try {
            const sessionData = JSON.parse(storedSession);
            if (sessionData && sessionData.access_token) {
              console.log('Found stored token, verifying...');
              // Verify the token with our API
              const verifyResult = await apiVerifyAuth(sessionData.access_token);
              
              if (verifyResult.data && !verifyResult.error) {
                console.log('Token verified via API');
                // Create a session-like object
                const sessionObj = {
                  access_token: sessionData.access_token,
                  refresh_token: sessionData.refresh_token || '',
                  expires_at: sessionData.expires_at,
                  expires_in: sessionData.expires_in,
                  token_type: 'bearer',
                  user: verifyResult.data.user
                };
                
                setSession(sessionObj as any);
                setUser(verifyResult.data.user);
                setIsLoading(false);
                return;
              } else {
                console.log('Token verification failed, clearing local storage');
                localStorage.removeItem('sb-qiekotzsywbhuwnxxdda-auth-token');
              }
            }
          } catch (e) {
            console.error('Error parsing stored session:', e);
          }
        }
        
        // If local storage check fails, fallback to Supabase
        const { data, error } = await auth.getSession();
        
        if (error) {
          console.error('Error checking session with Supabase:', error);
          setError(error.message);
        } else {
          setSession(data.session);
          setUser(data.session?.user || null);
        }
      } catch (err) {
        console.error('Unexpected error checking session:', err);
        setError('Nieoczekiwany błąd podczas sprawdzania sesji');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Set up auth state change subscription
    const { data } = supabase.auth.onAuthStateChange((event: string, session: Session | null) => {
      setSession(session);
      setUser(session?.user || null);
      setIsLoading(false);
    });

    // Cleanup subscription
    return () => {
      if (data) data.subscription.unsubscribe();
    };
  }, []);

  // Use direct implementations of auth functions
  const value = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    error,
    
    // Direct implementation of auth functions using fixed API
    signIn: async ({ email, password }: LoginFormData) => {
      console.log('Using fixed API for login');
      try {
        // First try the API endpoint
        const result = await apiSignIn({ email, password });
        if (result.data) {
          console.log('Login successful via API');
          // Update session in localStorage for compatibility with Supabase client
          if (result.data.session) {
            localStorage.setItem('sb-qiekotzsywbhuwnxxdda-auth-token', JSON.stringify({
              access_token: result.data.session.access_token,
              refresh_token: result.data.session.refresh_token,
              expires_at: result.data.session.expires_at,
              expires_in: result.data.session.expires_in
            }));
          }
          return result;
        }
        
        // If API fails, try direct Supabase auth as fallback
        console.log('API login failed, trying Supabase client fallback');
        return await auth.signIn(email, password);
      } catch (err) {
        console.error('Error during login:', err);
        return { error: err as AuthError, data: null };
      }
    },
    
    signUp: async ({ email, password, fullName }: SignupFormData) => {
      try {
        // First try the API endpoint
        const result = await apiSignUp({ 
          email, 
          password, 
          full_name: fullName || '' 
        });
        
        if (result.data) {
          return result;
        }
        
        // If API fails, try direct Supabase auth as fallback
        return await auth.signUp(email, password, {
          full_name: fullName || ''
        });
      } catch (err) {
        console.error('Error during signup:', err);
        return { error: err as AuthError, data: null };
      }
    },
    
    signOut: async () => {
      try {
        return await auth.signOut();
      } catch (err) {
        console.error('Error during signout:', err);
        return { error: err as AuthError };
      }
    },
    
    resetPassword: async (email: string) => {
      try {
        // First try the API endpoint
        const result = await apiResetPassword(email);
        if (result.data) {
          return result;
        }
        
        // If API fails, try direct Supabase auth as fallback
        return await auth.resetPassword(email);
      } catch (err) {
        console.error('Error during password reset:', err);
        return { error: err as AuthError };
      }
    },
    
    updatePassword: async (newPassword: string) => {
      try {
        return await auth.updatePassword(newPassword);
      } catch (err) {
        console.error('Error updating password:', err);
        return { error: err as AuthError };
      }
    },
    
    getUserProfile: async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        return { profile: data, error };
      } catch (err) {
        console.error('Error getting user profile:', err);
        return { profile: null, error: err };
      }
    },
    
    updateUserProfile: async (userId: string, updates: any) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', userId);
        
        return { data, error };
      } catch (err) {
        console.error('Error updating user profile:', err);
        return { error: err };
      }
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
