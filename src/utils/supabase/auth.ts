import { createSupabaseClient, getSupabaseConfig } from './client';
import type { Provider } from '@supabase/supabase-js';
import brain from 'brain';

// User type definition
export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    [key: string]: any;
  };
}

// Auth state type definition
export interface AuthState {
  user: AuthUser | null;
  session: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

/**
 * A unified interface for authentication operations.
 * This utility handles both direct Supabase auth and API-based auth.
 */
export const supabaseAuth = {
  /**
   * Sign up a new user with email and password
   * @param email User's email
   * @param password User's password
   * @param metadata Optional user metadata
   */
  signUp: async (email: string, password: string, metadata?: { full_name?: string }) => {
    try {
      // Try API-based signup first
      const response = await brain.signup({
        email,
        password,
        full_name: metadata?.full_name
      });
      const result = await response.json();
      
      if (result.success) {
        return { data: result, error: null };
      }
      
      // Fallback to direct Supabase signup
      const supabase = createSupabaseClient();
      if (!supabase) {
        return { data: null, error: { message: 'No valid Supabase configuration' } };
      }
      
      return await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata }
      });
    } catch (error) {
      console.error('Error during signup:', error);
      return { 
        data: null, 
        error: error instanceof Error ? { message: error.message } : { message: 'Unknown error during signup' } 
      };
    }
  },

  /**
   * Sign in with email and password
   * @param email User's email
   * @param password User's password
   */
  signIn: async (email: string, password: string) => {
    try {
      // Try API-based login first
      const response = await brain.login({
        email,
        password
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Store auth data in localStorage
        localStorage.setItem('auth_token', result.access_token);
        localStorage.setItem('user_data', JSON.stringify({
          user_id: result.user_id,
          email: result.email,
          metadata: result.metadata
        }));
        
        // Also save in Supabase format for compatibility
        if (result.access_token) {
          const supabaseSession = {
            access_token: result.access_token,
            refresh_token: result.refresh_token || '',
            expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour
            expires_in: 3600
          };
          localStorage.setItem('sb-qiekotzsywbhuwnxxdda-auth-token', JSON.stringify(supabaseSession));
        }
        
        return { 
          data: { 
            session: { access_token: result.access_token },
            user: { id: result.user_id, email: result.email }
          }, 
          error: null 
        };
      }
      
      // Fallback to direct Supabase login
      const supabase = createSupabaseClient();
      if (!supabase) {
        return { data: null, error: { message: 'No valid Supabase configuration' } };
      }
      
      return await supabase.auth.signInWithPassword({ email, password });
    } catch (error) {
      console.error('Error during login:', error);
      return { 
        data: null, 
        error: error instanceof Error ? { message: error.message } : { message: 'Unknown error during login' } 
      };
    }
  },

  /**
   * Sign in with a third-party provider
   * @param provider The provider to use (e.g., 'google', 'github')
   */
  signInWithProvider: async (provider: Provider) => {
    const supabase = createSupabaseClient();
    if (!supabase) {
      return { data: null, error: { message: 'No valid Supabase configuration' } };
    }
    
    return await supabase.auth.signInWithOAuth({ provider });
  },

  /**
   * Sign out the current user
   */
  signOut: async () => {
    try {
      // First try API-based logout
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        try {
          await brain.logout(null, { headers: { 'Authorization': `Bearer ${token}` } });
        } catch (err) {
          console.warn('API logout failed, continuing with local logout');
        }
      }

      // Always clear localStorage regardless of API result
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('sb-qiekotzsywbhuwnxxdda-auth-token');
      
      // Also try direct Supabase logout
      const supabase = createSupabaseClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
      
      return { error: null };
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('sb-qiekotzsywbhuwnxxdda-auth-token');
      
      return { 
        error: error instanceof Error ? { message: error.message } : { message: 'Unknown error during logout' } 
      };
    }
  },

  /**
   * Verify the current authentication token
   */
  verifyAuth: async () => {
    try {
      // First check localStorage
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      
      if (token && userData) {
        try {
          // Verify token with API
          const response = await brain.verify_auth({ token });
          const result = await response.json();
          
          if (result.success) {
            return { 
              data: { user: JSON.parse(userData) }, 
              error: null 
            };
          }
        } catch (err) {
          console.warn('API verification failed, trying Supabase fallback');
        }
      }
      
      // Fallback to Supabase session
      const supabase = createSupabaseClient();
      if (!supabase) {
        return { data: null, error: { message: 'No valid Supabase configuration' } };
      }
      
      return await supabase.auth.getSession();
    } catch (error) {
      console.error('Error during auth verification:', error);
      return { 
        data: null, 
        error: error instanceof Error ? { message: error.message } : { message: 'Unknown error during verification' } 
      };
    }
  },

  /**
   * Get the current user
   */
  getUser: async () => {
    try {
      // First check localStorage
      const userData = localStorage.getItem('user_data');
      
      if (userData) {
        return { 
          data: { user: JSON.parse(userData) }, 
          error: null 
        };
      }
      
      // Fallback to Supabase
      const supabase = createSupabaseClient();
      if (!supabase) {
        return { data: null, error: { message: 'No valid Supabase configuration' } };
      }
      
      return await supabase.auth.getUser();
    } catch (error) {
      console.error('Error getting user:', error);
      return { 
        data: null, 
        error: error instanceof Error ? { message: error.message } : { message: 'Unknown error getting user' } 
      };
    }
  },

  /**
   * Send a password reset email
   * @param email User's email
   */
  resetPassword: async (email: string) => {
    try {
      // Try API-based reset first
      const response = await brain.reset_password({ email, password: '' });
      const result = await response.json();
      
      if (result.success) {
        return { data: result, error: null };
      }
      
      // Fallback to Supabase
      const supabase = createSupabaseClient();
      if (!supabase) {
        return { data: null, error: { message: 'No valid Supabase configuration' } };
      }
      
      const redirectTo = `${window.location.origin}/reset-password`;
      
      return await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    } catch (error) {
      console.error('Error during password reset:', error);
      return { 
        data: null, 
        error: error instanceof Error ? { message: error.message } : { message: 'Unknown error during password reset' } 
      };
    }
  },

  /**
   * Set up a listener for auth state changes
   * @param callback Function to call when auth state changes
   */
  onAuthStateChange: (callback: (event: any, session: any) => void) => {
    const supabase = createSupabaseClient();
    if (!supabase) {
      console.error('Cannot set up auth listener: No valid Supabase configuration');
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
    
    return supabase.auth.onAuthStateChange(callback);
  },
  
  /**
   * Check if user has admin privileges
   * @param email User's email
   */
  isAdmin: (email: string): boolean => {
    // Admin check based on email domain
    return email.endsWith('@multicert.pl');
  }
};
