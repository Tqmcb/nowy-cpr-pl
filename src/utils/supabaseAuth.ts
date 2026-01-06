import { supabase } from './supabase';
import type { Provider } from '@supabase/supabase-js';

/**
 * A simplified interface for Supabase authentication operations.
 * This utility handles all authentication directly from the frontend.
 */
export const supabaseAuth = {
  /**
   * Sign up a new user with email and password
   * @param email User's email
   * @param password User's password
   * @param metadata Optional user metadata
   */
  signUp: async (email: string, password: string, metadata?: { full_name?: string }) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
  },

  /**
   * Sign in with email and password
   * @param email User's email
   * @param password User's password
   */
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  },

  /**
   * Sign in with a third-party provider
   * @param provider The provider to use (e.g., 'google', 'github')
   */
  signInWithProvider: async (provider: Provider) => {
    return await supabase.auth.signInWithOAuth({ provider });
  },

  /**
   * Sign out the current user
   */
  signOut: async () => {
    return await supabase.auth.signOut();
  },

  /**
   * Get the current user's session
   */
  getSession: async () => {
    return await supabase.auth.getSession();
  },

  /**
   * Get the current user
   */
  getUser: async () => {
    return await supabase.auth.getUser();
  },

  /**
   * Update the current user
   * @param attributes Attributes to update
   */
  updateUser: async (attributes: {
    email?: string;
    password?: string;
    data?: { [key: string]: any };
  }) => {
    return await supabase.auth.updateUser(attributes);
  },

  /**
   * Send a password reset email
   * @param email User's email
   */
  resetPassword: async (email: string) => {
    // Generate the redirect URL based on the current location
    const redirectTo = `${window.location.origin}/reset-password`;
    
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo
    });
  },

  /**
   * Set up a listener for auth state changes
   * @param callback Function to call when auth state changes
   */
  onAuthStateChange: (callback: (event: any, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};
