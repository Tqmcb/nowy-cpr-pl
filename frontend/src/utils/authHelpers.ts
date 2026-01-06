import { User, AuthError } from '@supabase/supabase-js';
import { API_URL } from 'app';
import { supabase, auth } from './supabase';

// Types for authentication
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
}

// Types for auth form data
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData extends LoginFormData {
  fullName?: string;
}

// Main authentication functions
export const signUp = async ({ email, password, fullName }: SignupFormData) => {
  try {
    const result = await auth.signUp(email, password, {
      full_name: fullName || ''
    });
    
    return result;
  } catch (err) {
    console.error('Error during signup:', err);
    return { error: err as AuthError, data: null };
  }
};

export const signIn = async ({ email, password }: LoginFormData) => {
  try {
    const result = await auth.signIn(email, password);
    return result;
  } catch (err) {
    console.error('Error during login:', err);
    return { error: err as AuthError, data: null };
  }
};

export const signOut = async () => {
  try {
    const { error } = await auth.signOut();
    return { error };
  } catch (err) {
    console.error('Error during signout:', err);
    return { error: err as AuthError };
  }
};

export const resetPassword = async (email: string) => {
  try {
    const result = await auth.resetPassword(email);
    return result;
  } catch (err) {
    console.error('Error during password reset:', err);
    return { error: err as AuthError };
  }
};

export const updatePassword = async (newPassword: string) => {
  try {
    const result = await auth.updatePassword(newPassword);
    return result;
  } catch (err) {
    console.error('Error updating password:', err);
    return { error: err as AuthError };
  }
};

// Session management
export const getCurrentUser = async () => {
  try {
    const result = await auth.getUser();
    return { user: result.data?.user || null, error: result.error };
  } catch (err) {
    console.error('Error getting current user:', err);
    return { user: null, error: err as AuthError };
  }
};

export const getSession = async () => {
  try {
    const result = await auth.getSession();
    return { session: result.data?.session, error: result.error };
  } catch (err) {
    console.error('Error getting session:', err);
    return { session: null, error: err as AuthError };
  }
};

// Listen for auth state changes
export const onAuthStateChange = (callback: Function) => {
  // The auth.onAuthStateChange function returns a subscription object directly
  const subscription = auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
  
  // Return a standardized object with unsubscribe method
  return {
    subscription: {
      unsubscribe: () => {
        if (subscription) {
          subscription.data?.unsubscribe();
        }
      }
    }
  };
};

// User profile management
export const getUserProfile = async (userId: string) => {
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
};

export const updateUserProfile = async (userId: string, updates: any) => {
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
};

// Helper function to handle auth errors
export const getAuthErrorMessage = (error: AuthError | null): string => {
  if (!error) return '';
  
  // Check for network errors first
  if (error.message?.includes('Failed to fetch')) {
    return 'Nie można połączyć się z serwerem Supabase. Sprawdź konfigurację i połączenie internetowe.';
  }
  
  // Check for JWT/token errors
  if (error.message?.includes('JWT') || error.message?.includes('token')) {
    return 'Sesja wygasła lub jest nieprawidłowa. Proszę zalogować się ponownie.';
  }
  
  // Map Supabase auth error messages to user-friendly Polish messages
  const errorMessages: {[key: string]: string} = {
    'Invalid login credentials': 'Nieprawidłowy email lub hasło',
    'User already registered': 'Użytkownik z tym adresem email już istnieje',
    'Email not confirmed': 'Email nie został potwierdzony. Sprawdź swoją skrzynkę pocztową',
    'Password is too short': 'Hasło jest za krótkie. Minimum 6 znaków',
    'Rate limit exceeded': 'Zbyt wiele prób. Spróbuj ponownie później',
    'Invalid URL': 'Nieprawidłowy adres serwera Supabase. Sprawdź konfigurację.',
    'Not Found': 'Nie znaleziono serwera Supabase. Sprawdź konfigurację.',
    'Network Error': 'Błąd sieci. Sprawdź połączenie internetowe.',
  };
  
  return errorMessages[error.message] || error.message || 'Wystąpił błąd. Spróbuj ponownie';
};
