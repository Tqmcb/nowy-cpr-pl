import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabaseAuth } from './supabase/auth';
import { supabaseDb } from './supabase/database';

// Define the UserData interface for consistency
interface UserData {
  user_id: string;
  email: string;
  metadata?: Record<string, any>;
}

// Define the shape of our auth context
interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  signIn: (data: { email: string; password: string }) => Promise<any>;
  signUp: (data: { email: string; password: string; fullName?: string }) => Promise<any>;
  signOut: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  getUserProfile: (userId: string) => Promise<any>;
  updateUserProfile: (userId: string, updates: any) => Promise<any>;
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
  resetPassword: async () => ({}),
  getUserProfile: async () => ({}),
  updateUserProfile: async () => ({}),
});

// Export the hook for using the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('[AuthContextUnified] Checking authentication status...');
        setIsLoading(true);
        
        // Check local storage for auth data
        const userData = localStorage.getItem('user_data');
        if (userData) {
          console.log('[AuthContextUnified] Found user data in local storage, verifying token...');
          
          // Check if token exists
          const token = localStorage.getItem('auth_token');
          if (!token) {
            console.warn('[AuthContextUnified] No token found, clearing auth state');
            // Clear auth data from local storage
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            localStorage.removeItem('sb-qiekotzsywbhuwnxxdda-auth-token');
            setIsLoading(false);
            return;
          }
          
          // Verify the token with our unified auth system
          try {
            const { data, error } = await supabaseAuth.verifyAuth();
            
            if (data && !error) {
              console.log('[AuthContextUnified] Token verified successfully');
              const parsedUserData = JSON.parse(userData);
              setUser(parsedUserData);
            } else {
              console.warn('[AuthContextUnified] Token verification failed:', error?.message);
              // Clear local storage if verification fails
              localStorage.removeItem('auth_token');
              localStorage.removeItem('user_data');
              localStorage.removeItem('sb-qiekotzsywbhuwnxxdda-auth-token');
            }
          } catch (verifyError) {
            console.error('[AuthContextUnified] Token verification error:', verifyError);
            // Clear local storage if verification fails
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            localStorage.removeItem('sb-qiekotzsywbhuwnxxdda-auth-token');
          }
        } else {
          console.log('[AuthContextUnified] No user data found in local storage');
        }
      } catch (err) {
        console.error('[AuthContextUnified] Auth check error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Wystąpił błąd podczas sprawdzania autentykacji';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Sign in function
  const signIn = async (data: { email: string; password: string }) => {
    try {
      console.log('[AuthContextUnified] Signing in user:', data.email);
      setIsLoading(true);
      setError(null);
      
      // Use our unified auth system
      const { data: authData, error: authError } = await supabaseAuth.signIn(
        data.email, 
        data.password
      );
      
      if (authError) {
        throw new Error(authError.message || 'Logowanie nie powiodło się');
      }
      
      console.log('[AuthContextUnified] Sign in successful');
      
      // Get user data from local storage (it should be set by supabaseAuth.signIn)
      const userDataStr = localStorage.getItem('user_data');
      
      if (userDataStr) {
        const userData = JSON.parse(userDataStr) as UserData;
        // Update state
        setUser(userData);
      } else {
        // If user_data doesn't exist, create it from the auth response
        if (authData?.user) {
          const userData: UserData = {
            user_id: authData.user.id,
            email: authData.user.email || '',
            metadata: authData.user.user_metadata
          };
          
          localStorage.setItem('user_data', JSON.stringify(userData));
          setUser(userData);
        }
      }
      
      return { data: authData, error: null };
    } catch (err) {
      console.error('[AuthContextUnified] Sign in error:', err);
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
      console.log('[AuthContextUnified] Signing up user:', data.email);
      setIsLoading(true);
      setError(null);
      
      // Use our unified auth system
      const { data: authData, error: authError } = await supabaseAuth.signUp(
        data.email, 
        data.password, 
        { full_name: data.fullName }
      );
      
      if (authError) {
        throw new Error(authError.message || 'Rejestracja nie powiodła się');
      }
      
      console.log('[AuthContextUnified] Sign up successful');
      
      // Most signup flows require email verification, so we don't auto-login
      // But this depends on the configuration
      
      return { data: authData, error: null };
    } catch (err) {
      console.error('[AuthContextUnified] Sign up error:', err);
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
      console.log('[AuthContextUnified] Signing out user');
      setIsLoading(true);
      
      // Use our unified auth system
      const { error } = await supabaseAuth.signOut();
      
      if (error) {
        console.warn('[AuthContextUnified] Error during sign out:', error.message);
      }
      
      // Update state regardless of API result
      setUser(null);
      
      // Clear from localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('sb-qiekotzsywbhuwnxxdda-auth-token');
      
      return { error: null };
    } catch (err) {
      console.error('[AuthContextUnified] Sign out error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Wystąpił błąd podczas wylogowywania';
      setError(errorMessage);
      return { error: { message: errorMessage } };
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      console.log('[AuthContextUnified] Resetting password for:', email);
      setIsLoading(true);
      
      // Use our unified auth system
      const { data, error } = await supabaseAuth.resetPassword(email);
      
      if (error) {
        throw new Error(error.message || 'Resetowanie hasła nie powiodło się');
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('[AuthContextUnified] Reset password error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Wystąpił błąd podczas resetowania hasła';
      return { data: null, error: { message: errorMessage } };
    } finally {
      setIsLoading(false);
    }
  };
  // Get user profile function
  const getUserProfile = async (userId: string) => {
    try {
      // Get user data from Supabase's user_profiles table
      const { data, error } = await supabaseDb.getRecord('user_profiles', userId);
      
      if (error) {
        // If the profile doesn't exist, fallback to current user data
        return { profile: user, error: null };
      }
      
      return { profile: data, error: null };
    } catch (err) {
      console.error('[AuthContextUnified] Get user profile error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Wystąpił błąd podczas pobierania profilu';
      return { profile: null, error: { message: errorMessage } };
    }
  };
  
  // Update user profile function
  const updateUserProfile = async (userId: string, updates: any) => {
    try {
      // Try to update profile in Supabase
      const { data, error } = await supabaseDb.updateRecord('user_profiles', userId, updates);
      
      if (error) {
        // If fails, just update local state
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser as UserData);
        localStorage.setItem('user_data', JSON.stringify(updatedUser));
        return { data: updatedUser, error: null };
      }
      
      // Also update local state
      if (userId === user?.user_id) {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser as UserData);
        localStorage.setItem('user_data', JSON.stringify(updatedUser));
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('[AuthContextUnified] Update user profile error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Wystąpił błąd podczas aktualizacji profilu';
      return { data: null, error: { message: errorMessage } };
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
    resetPassword,
    getUserProfile,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};