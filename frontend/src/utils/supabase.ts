/**
 * Legacy supabase.ts file
 * Re-exports the new modularized supabase utilities
 * for backwards compatibility
 */

// Import the utilities from the new location but with different names to avoid conflicts
import { supabaseClient as importedClient } from './supabase/client';
import { supabaseAuth } from './supabase/auth';
import { supabaseDb } from './supabase/database';
import { getSupabaseConfig, createSupabaseClient, getSupabaseConfigFromLocalStorage } from './supabase/client';

// Re-export all types from the types file
import type { 
  ProductCategoryRow, 
  ProductRequirementRow, 
  BlogPostRow,
  DocumentRow,
  UserProfileRow
} from './supabase/types';

// Import legacy types for backwards compatibility
import { createClient, type SupabaseClient, type Session, type User, type AuthResponse, type UserResponse } from '@supabase/supabase-js';
import { APP_BASE_PATH } from 'app';

// Re-export getSupabaseConfig from utils/supabase/client.ts
export { getSupabaseConfig, getSupabaseConfigFromLocalStorage, createSupabaseClient }

// Get current Supabase configuration
const config = getSupabaseConfig();
const SUPABASE_URL = config.supabaseUrl;
const SUPABASE_ANON_KEY = config.supabaseKey;

// Also check for service role key (for admin operations)
export const getServiceRoleKey = () => localStorage.getItem('supabaseServiceRoleKey');

// Auth related types - Kept for backward compatibility
export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
  app_metadata?: any;
  created_at: string;
}

export interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
}

// Legacy getSupabaseClient is now imported from utils/supabase/client.ts
// This comment is kept for documentation purposes

// Create a supabase client instance
// Create a Supabase client with error handling
let supabaseClient: SupabaseClient;
try {
  const config = getSupabaseConfig();
  if (!config.hasValidConfig) {
    console.error('Invalid Supabase configuration. Please configure Supabase in the admin panel.');
    throw new Error('Invalid Supabase configuration');
  }
  
  // Create client with proper URL validation
  try {
    // Test URL format validity before creating client
    let validatedUrl = config.supabaseUrl;
    // Ensure URL has https:// prefix
    if (validatedUrl && !validatedUrl.startsWith('http')) {
      validatedUrl = `https://${validatedUrl}`;
    }
    // Validate URL format
    try {
      new URL(validatedUrl);
    } catch (e) {
      console.error(`Invalid URL format: ${validatedUrl}`, e instanceof Error ? e.message : 'Unknown error');
      throw new Error(`Invalid Supabase URL format: ${validatedUrl}`);
    }
    
    supabaseClient = createClient(validatedUrl, config.supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
  } catch (urlError) {
    console.error('Invalid Supabase URL format:', config.supabaseUrl, urlError instanceof Error ? urlError.message : 'Unknown URL error');
    throw new Error(`Invalid Supabase URL: ${config.supabaseUrl}`);
  }
  
  // Test the connection silently (don't throw)
  supabaseClient.from('product_categories').select('count', { count: 'exact', head: true })
    .then(({ count, error }) => {
      if (error) {
        console.error('Error connecting to Supabase:', error.message || 'Unknown error', error);
      } else {
        console.log('Successfully connected to Supabase. Table product_categories has', count, 'records');
      }
    })
    .catch(err => {
      const errorMessage = err instanceof Error ? err.message : 
                          (err && typeof err === 'object' && 'message' in err) ? (err as any).message : 
                          'Unknown error';
      console.error('Failed to query Supabase:', errorMessage, err);
    });
} catch (error) {
  console.error('Failed to initialize Supabase client:', error instanceof Error ? error.message : 'Invalid Supabase configuration');
  // Create a dummy client that logs errors but doesn't throw
  try {
    supabaseClient = createClient('https://example.supabase.co', 'dummy-key');
  } catch {
    // Last resort if even the dummy client fails
    console.error('Could not create even a dummy Supabase client');
    // @ts-ignore - Create empty object to prevent app crashes
    supabaseClient = {} as SupabaseClient;
  }
}

// Export the client for direct use - Legacy and new export names
export const supabase = supabaseClient;
export { supabaseClient, supabaseAuth, supabaseDb };

// Re-export the imported client as a fallback if our initialization fails
if (!supabaseClient) {
  console.warn('Using imported supabaseClient as fallback');
  // @ts-ignore - This is a fallback
  supabaseClient = importedClient;
}

// Authentication functions
export const auth = {
  /**
   * Sign up a new user with email and password
   */
  signUp: async (email: string, password: string, metadata?: { full_name?: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    return { data, error };
  },

  /**
   * Sign in with email and password
   */
  signIn: async (email: string, password: string): Promise<AuthResponse> => {
    return await supabase.auth.signInWithPassword({ email, password });
  },

  /**
   * Sign out the current user
   */
  signOut: async () => {
    return await supabase.auth.signOut();
  },

  /**
   * Reset password with email
   */
  resetPassword: async (email: string) => {
    // Generowanie URL przekierowania dla resetowania hasła
    try {
      // Najprostszy sposób generowania URL - użyj aktualnego URL jako bazy
      let origin = window.location.origin; // np. https://example.com
      let basePath = '';
      
      // Jeśli aplikacja jest uruchomiona z inna ścieżką bazową, dodaj ją
      if (APP_BASE_PATH && APP_BASE_PATH !== '/') {
        basePath = APP_BASE_PATH.startsWith('/') ? APP_BASE_PATH : `/${APP_BASE_PATH}`;
      }
      
      // Usuń końcowy ukośnik jeśli istnieje
      if (basePath.endsWith('/')) {
        basePath = basePath.slice(0, -1);
      }
      
      // Pełny URL przekierowania
      const redirectUrl = `${origin}${basePath}/reset-password`;
      
      console.log('Reset password redirect URL:', redirectUrl);
      
      // Użyj świeżego klienta Supabase z aktualnymi dostępami
      const config = getSupabaseConfig();
      if (!config.hasValidConfig) {
        return { data: null, error: { message: 'Invalid Supabase configuration' } as any };
      }
      
      // Stwórz nowy klient z poprawnym kluczem
      const freshClient = createClient(config.supabaseUrl, config.supabaseKey);
      
      // Wywołaj API resetowania hasła
      const result = await freshClient.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      });
      
      // Log sukcesu z zacenzurowanym emailem
      const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, '$1***$3');
      console.log(`Password reset email sent to ${maskedEmail}`);
      
      return result;
    } catch (err) {
      // Szczegółowe logowanie błędów
      console.error('Error in resetPassword:', 
        err instanceof Error ? 
        { message: err.message, name: err.name, stack: err.stack } : 
        'Unknown error');
      
      // Zwróć błąd w formacie zgodnym z Supabase
      return { 
        data: null, 
        error: { 
          message: err instanceof Error ? err.message : 'Unknown error during password reset' 
        } as any 
      };
    }
  },

  /**
   * Update user password (when signed in)
   */
  updatePassword: async (password: string) => {
    return await supabase.auth.updateUser({ password });
  },

  /**
   * Get the current user
   */
  getUser: async (): Promise<UserResponse> => {
    return await supabase.auth.getUser();
  },

  /**
   * Get the current session
   */
  getSession: async () => {
    return await supabase.auth.getSession();
  },

  /**
   * Set up an auth state change listener
   */
  onAuthStateChange: (callback: (event: any, session: Session | null) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Types for our database tables
export type ProductCategoryRow = {
  id: string;
  name: string;
  code: string;
  description: string;
  requirement_id: string;
};

export type ProductRequirementRow = {
  id: string;
  title: string;
  description: string;
  mandatory_tests: string[];
  documentation_required: string[];
  cpr_changes: string[];
  certification_systems: string[];
};

// Helper functions for product data
export const fetchProductCategories = async () => {
  if (!supabase) {
    console.error('Error fetching product categories: Supabase not configured');
    throw new Error('Nieprawidłowa konfiguracja Supabase. Przejdź do panelu konfiguracji, aby skonfigurować bazę danych.');
  }
  
  try {
    const { data, error } = await supabase
      .from('product_categories')
      .select('*');
    
    if (error) {
      console.error('Error fetching product categories:', error.message || 'Unknown error', error);
      
      // Mapowanie błędów na bardziej przyjazne dla użytkownika komunikaty
      if (error.message?.includes('Invalid API key')) {
        throw new Error('Nieprawidłowy klucz API Supabase.');
      } else if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
        throw new Error('Tabela product_categories nie istnieje w bazie danych. Konieczne jest zaimportowanie danych.');
      } else if (error.message?.includes('permission denied')) {
        throw new Error('Brak uprawnień do tabeli product_categories. Sprawdź polityki RLS w bazie danych.');
      } else {
        throw new Error(`Błąd bazy danych: ${error.message || 'Nieznany błąd'}`);
      }
    }
    
    if (!data) {
      console.error('No data returned from product_categories query');
      throw new Error('Brak danych zwróconych z zapytania. Sprawdź połączenie z bazą danych.');
    }
    
    return data as ProductCategoryRow[];
  } catch (e) {
    // Przekaż dalej błąd już sformatowany, lub sformatuj nieznany błąd
    if (e instanceof Error) {
      console.error('Error fetching product categories:', e.message);
      throw e;
    } else if (e === null || e === undefined) {
      console.error('Null or undefined error when fetching product categories');
      throw new Error('Nieoczekiwany błąd podczas pobierania kategorii produktów: null lub undefined.');
    } else if (typeof e === 'object') {
      const errorObj = e as Record<string, unknown>;
      const errorMessage = errorObj.message && typeof errorObj.message === 'string' 
        ? errorObj.message 
        : 'Nieznany błąd obiektu';
      console.error('Object error fetching product categories:', errorMessage, e);
      throw new Error(`Nieoczekiwany błąd podczas pobierania kategorii produktów: ${errorMessage}`);
    } else {
      console.error('Unknown error fetching product categories:', e);
      throw new Error('Nieoczekiwany błąd podczas pobierania kategorii produktów.');
    }
  }
};

export const fetchProductCategoryOptions = async () => {
  const categories = await fetchProductCategories();
  return categories.map(category => ({
    value: category.id,
    label: `${category.name} (${category.code})`
  }));
};

export const fetchProductCategoryById = async (id: string) => {
  if (!supabase) {
    console.error(`Error fetching product category with id ${id}: Supabase not configured`);
    throw new Error('Nieprawidłowa konfiguracja Supabase. Przejdź do panelu konfiguracji, aby skonfigurować bazę danych.');
  }
  
  try {
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching product category with id ${id}:`, error.message || 'Unknown error', error);
      
      // Mapowanie błędów na bardziej przyjazne dla użytkownika komunikaty
      if (error.message?.includes('Invalid API key')) {
        throw new Error('Nieprawidłowy klucz API Supabase.');
      } else if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
        throw new Error('Tabela product_categories nie istnieje w bazie danych. Konieczne jest zaimportowanie danych.');
      } else if (error.message?.includes('permission denied')) {
        throw new Error('Brak uprawnień do tabeli product_categories. Sprawdź polityki RLS w bazie danych.');
      } else if (error.code === 'PGRST116') {
        throw new Error(`Nie znaleziono kategorii produktu o ID: ${id}`);
      } else {
        throw new Error(`Błąd bazy danych: ${error.message || 'Nieznany błąd'}`);
      }
    }
    
    if (!data) {
      throw new Error(`Nie znaleziono kategorii produktu o ID: ${id}`);
    }
    
    return data as ProductCategoryRow;
  } catch (e) {
    // Przekaż dalej błąd już sformatowany, lub sformatuj nieznany błąd
    if (e instanceof Error) {
      console.error(`Error fetching product category with id ${id}:`, e.message);
      throw e;
    } else if (e === null || e === undefined) {
      console.error(`Null or undefined error when fetching product category with id ${id}`);
      throw new Error('Nieoczekiwany błąd podczas pobierania kategorii produktu: null lub undefined.');
    } else if (typeof e === 'object') {
      const errorObj = e as Record<string, unknown>;
      const errorMessage = errorObj.message && typeof errorObj.message === 'string' 
        ? errorObj.message 
        : 'Nieznany błąd obiektu';
      console.error(`Object error fetching product category with id ${id}:`, errorMessage, e);
      throw new Error(`Nieoczekiwany błąd podczas pobierania kategorii produktu: ${errorMessage}`);
    } else {
      console.error(`Unknown error fetching product category with id ${id}:`, e);
      throw new Error('Nieoczekiwany błąd podczas pobierania kategorii produktu.');
    }
  }
};

export const fetchRequirementById = async (id: string) => {
  if (!supabase) {
    console.error(`Error fetching requirement with id ${id}: Supabase not configured`);
    throw new Error('Nieprawidłowa konfiguracja Supabase. Przejdź do panelu konfiguracji, aby skonfigurować bazę danych.');
  }
  
  try {
    const { data, error } = await supabase
      .from('product_requirements')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching requirement with id ${id}:`, error.message || 'Unknown error', error);
      
      // Mapowanie błędów na bardziej przyjazne dla użytkownika komunikaty
      if (error.message?.includes('Invalid API key')) {
        throw new Error('Nieprawidłowy klucz API Supabase.');
      } else if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
        throw new Error('Tabela product_requirements nie istnieje w bazie danych. Konieczne jest zaimportowanie danych.');
      } else if (error.message?.includes('permission denied')) {
        throw new Error('Brak uprawnień do tabeli product_requirements. Sprawdź polityki RLS w bazie danych.');
      } else if (error.code === 'PGRST116') {
        throw new Error(`Nie znaleziono wymagań produktu o ID: ${id}`);
      } else {
        throw new Error(`Błąd bazy danych: ${error.message || 'Nieznany błąd'}`);
      }
    }
    
    if (!data) {
      throw new Error(`Nie znaleziono wymagań produktu o ID: ${id}`);
    }
    
    // Upewnij się, że pola tablicowe są zainicjowane
    const requirements = {
      ...data,
      mandatory_tests: Array.isArray(data.mandatory_tests) ? data.mandatory_tests : [],
      documentation_required: Array.isArray(data.documentation_required) ? data.documentation_required : [],
      cpr_changes: Array.isArray(data.cpr_changes) ? data.cpr_changes : [],
      certification_systems: Array.isArray(data.certification_systems) ? data.certification_systems : []
    } as ProductRequirementRow;
    
    return requirements;
  } catch (e) {
    // Przekaż dalej błąd już sformatowany, lub sformatuj nieznany błąd
    if (e instanceof Error) {
      console.error(`Error fetching requirement with id ${id}:`, e.message);
      throw e;
    } else if (e === null || e === undefined) {
      console.error(`Null or undefined error when fetching requirement with id ${id}`);
      throw new Error('Nieoczekiwany błąd podczas pobierania wymagań produktu: null lub undefined.');
    } else if (typeof e === 'object') {
      const errorObj = e as Record<string, unknown>;
      const errorMessage = errorObj.message && typeof errorObj.message === 'string' 
        ? errorObj.message 
        : 'Nieznany błąd obiektu';
      console.error(`Object error fetching requirement with id ${id}:`, errorMessage, e);
      throw new Error(`Nieoczekiwany błąd podczas pobierania wymagań produktu: ${errorMessage}`);
    } else {
      console.error(`Unknown error fetching requirement with id ${id}:`, e);
      throw new Error('Nieoczekiwany błąd podczas pobierania wymagań produktu.');
    }
  }
};

export const fetchProductWithRequirements = async (productId: string) => {
  if (!supabase) {
    console.error(`Error fetching product with requirements (ID: ${productId}): Supabase not configured`);
    throw new Error('Nieprawidłowa konfiguracja Supabase. Przejdź do panelu konfiguracji, aby skonfigurować bazę danych.');
  }
  
  try {
    // First get the product category
    const product = await fetchProductCategoryById(productId);
    if (!product) {
      console.error(`Product category not found (ID: ${productId})`);
      throw new Error('Nie znaleziono kategorii produktu o podanym identyfikatorze.');
    }
    
    // Then get the associated requirement
    const requirement = await fetchRequirementById(product.requirement_id);
    if (!requirement) {
      console.error(`Requirement not found for product (ID: ${productId}, Requirement ID: ${product.requirement_id})`);
      throw new Error('Nie znaleziono wymagań dla tej kategorii produktu. Dane mogą być niekompletne.');
    }
    
    // Return combined data in the format expected by the UI
    return {
      id: product.id,
      name: product.name,
      code: product.code,
      description: product.description,
      requirements: {
        id: requirement.id,
        title: requirement.title,
        description: requirement.description,
        mandatoryTests: requirement.mandatory_tests,
        documentationRequired: requirement.documentation_required,
        cprChanges: requirement.cpr_changes,
        certificationSystems: requirement.certification_systems
      }
    };
  } catch (error) {
    // Jeśli błąd jest już sformatowany przez nasze funkcje, przekaż go dalej
    if (error instanceof Error) {
      console.error(`Error in fetchProductWithRequirements (ID: ${productId}):`, error.message);
      throw error;
    } else {
      // W przypadku nieoczekiwanego błędu, sformatuj go jako Error
      console.error(`Unknown error in fetchProductWithRequirements (ID: ${productId}):`, error);
      throw new Error('Wystąpił nieoczekiwany błąd podczas pobierania danych produktu.');
    }
  }
};

// CRUD operations for admin panel

/**
 * Create a new product category with its requirement
 */
export const createProductCategory = async (category: Omit<ProductCategoryRow, 'id'>, requirement: Omit<ProductRequirementRow, 'id'>) => {
  if (!supabase) {
    console.error('Error creating product category: Supabase not configured');
    return { success: false, error: 'Nieprawidłowa konfiguracja Supabase. Przejdź do panelu konfiguracji, aby skonfigurować bazę danych.' };
  }
  
  try {
    // First create the requirement
    const { data: reqData, error: reqError } = await supabase
      .from('product_requirements')
      .insert(requirement)
      .select('id')
      .single();
    
    if (reqError) {
      console.error('Error creating product requirement:', reqError.message || 'Unknown error', reqError);
      
      // Mapowanie błędów na bardziej przyjazne dla użytkownika komunikaty
      let errorMessage = 'Wystąpił błąd podczas tworzenia wymagań produktu: ';
      
      if (reqError.message.includes('auth/invalid-api-key') || reqError.message.includes('Invalid API key')) {
        errorMessage += 'Nieprawidłowy klucz API Supabase.';
      } else if (reqError.message.includes('relation') || reqError.message.includes('does not exist')) {
        errorMessage += 'Tabela product_requirements nie istnieje w bazie danych. Konieczne jest zaimportowanie danych.';
      } else if (reqError.message.includes('permission denied')) {
        errorMessage += 'Brak uprawnień do dodawania rekordów. Sprawdź polityki RLS w bazie danych.';
      } else if (reqError.message.includes('duplicate key value violates unique constraint')) {
        errorMessage += 'Istnieje już kategoria o takim kodzie. Kod musi być unikalny.';
      } else {
        errorMessage += reqError.message;
      }
      
      return { success: false, error: errorMessage };
    }
    
    if (!reqData || !reqData.id) {
      console.error('Error creating product requirement: No ID returned');
      return { success: false, error: 'Błąd podczas tworzenia wymagań produktu: brak zwracanego ID.' };
    }
    
    // Then create the category with the requirement ID
    const { data: catData, error: catError } = await supabase
      .from('product_categories')
      .insert({
        ...category,
        requirement_id: reqData.id
      })
      .select('id')
      .single();
    
    if (catError) {
      console.error('Error creating product category:', catError.message || 'Unknown error', catError);
      
      // Try to clean up the requirement if category creation fails
      try {
        await supabase.from('product_requirements').delete().eq('id', reqData.id);
        console.log(`Cleaned up requirement ${reqData.id} after category creation failure`);
      } catch (cleanupError) {
        console.error('Failed to clean up requirement after category creation failure:', 
          cleanupError instanceof Error ? cleanupError.message : 'Unknown error');
      }
      
      // Mapowanie błędów na bardziej przyjazne dla użytkownika komunikaty
      let errorMessage = 'Wystąpił błąd podczas tworzenia kategorii produktu: ';
      
      if (catError.message.includes('auth/invalid-api-key') || catError.message.includes('Invalid API key')) {
        errorMessage += 'Nieprawidłowy klucz API Supabase.';
      } else if (catError.message.includes('relation') || catError.message.includes('does not exist')) {
        errorMessage += 'Tabela product_categories nie istnieje w bazie danych. Konieczne jest zaimportowanie danych.';
      } else if (catError.message.includes('permission denied')) {
        errorMessage += 'Brak uprawnień do dodawania rekordów. Sprawdź polityki RLS w bazie danych.';
      } else if (catError.message.includes('duplicate key value violates unique constraint')) {
        errorMessage += 'Istnieje już kategoria o takim kodzie. Kod musi być unikalny.';
      } else {
        errorMessage += catError.message;
      }
      
      return { success: false, error: errorMessage };
    }
    
    if (!catData || !catData.id) {
      console.error('Error creating product category: No ID returned');
      
      // Try to clean up the requirement
      try {
        await supabase.from('product_requirements').delete().eq('id', reqData.id);
        console.log(`Cleaned up requirement ${reqData.id} after category creation failure (no ID returned)`);
      } catch (cleanupError) {
        console.error('Failed to clean up requirement:', 
          cleanupError instanceof Error ? cleanupError.message : 'Unknown error');
      }
      
      return { success: false, error: 'Błąd podczas tworzenia kategorii produktu: brak zwracanego ID.' };
    }
    
    // Success!
    console.log(`Successfully created product category ${catData.id} with requirement ${reqData.id}`);
    return { success: true, data: { categoryId: catData.id, requirementId: reqData.id } };
  } catch (e) {
    console.error('Error creating product category:', e instanceof Error ? e.message : 'Unknown error');
    
    // Bardziej szczegółowa obsługa błędów
    let errorMessage = 'Wystąpił nieoczekiwany błąd podczas tworzenia kategorii produktu.';
    if (e instanceof Error) {
      if (e.message.includes('fetch') || e.message.includes('network') || e.message.includes('Network Error')) {
        errorMessage = 'Problem z połączeniem sieciowym. Sprawdź połączenie internetowe.';
      } else {
        errorMessage = e.message;
      }
    }
    
    return { success: false, error: errorMessage };
  }
};

/**
 * Update an existing product category and its requirement
 */
export const updateProductCategory = async (
  categoryId: string, 
  categoryData: Partial<Omit<ProductCategoryRow, 'id'>>,
  requirementId: string,
  requirementData: Partial<Omit<ProductRequirementRow, 'id'>>
) => {
  if (!supabase) {
    console.error('Error updating product category: Supabase not configured');
    return { success: false, error: 'Nieprawidłowa konfiguracja Supabase. Przejdź do panelu konfiguracji, aby skonfigurować bazę danych.' };
  }
  
  try {
    // Validate inputs
    if (!categoryId || !requirementId) {
      console.error('Missing categoryId or requirementId for update');
      return { success: false, error: 'Brak identyfikatora kategorii lub wymagań.' };
    }
    
    // Update the requirement
    const { error: reqError } = await supabase
      .from('product_requirements')
      .update(requirementData)
      .eq('id', requirementId);
    
    if (reqError) {
      console.error('Error updating product requirement:', reqError.message || 'Unknown error', reqError);
      
      // Mapowanie błędów na bardziej przyjazne dla użytkownika komunikaty
      let errorMessage = 'Wystąpił błąd podczas aktualizacji wymagań produktu: ';
      
      if (reqError.message.includes('auth/invalid-api-key') || reqError.message.includes('Invalid API key')) {
        errorMessage += 'Nieprawidłowy klucz API Supabase.';
      } else if (reqError.message.includes('relation') || reqError.message.includes('does not exist')) {
        errorMessage += 'Tabela product_requirements nie istnieje w bazie danych. Konieczne jest zaimportowanie danych.';
      } else if (reqError.message.includes('permission denied')) {
        errorMessage += 'Brak uprawnień do aktualizacji rekordów. Sprawdź polityki RLS w bazie danych.';
      } else if (reqError.message.includes('not found')) {
        errorMessage += `Nie znaleziono wymagań o ID: ${requirementId}.`;
      } else {
        errorMessage += reqError.message;
      }
      
      return { success: false, error: errorMessage };
    }
    
    // Update the category
    const { error: catError } = await supabase
      .from('product_categories')
      .update(categoryData)
      .eq('id', categoryId);
    
    if (catError) {
      console.error('Error updating product category:', catError.message || 'Unknown error', catError);
      
      // Mapowanie błędów na bardziej przyjazne dla użytkownika komunikaty
      let errorMessage = 'Wystąpił błąd podczas aktualizacji kategorii produktu: ';
      
      if (catError.message.includes('auth/invalid-api-key') || catError.message.includes('Invalid API key')) {
        errorMessage += 'Nieprawidłowy klucz API Supabase.';
      } else if (catError.message.includes('relation') || catError.message.includes('does not exist')) {
        errorMessage += 'Tabela product_categories nie istnieje w bazie danych. Konieczne jest zaimportowanie danych.';
      } else if (catError.message.includes('permission denied')) {
        errorMessage += 'Brak uprawnień do aktualizacji rekordów. Sprawdź polityki RLS w bazie danych.';
      } else if (catError.message.includes('duplicate key value violates unique constraint')) {
        errorMessage += 'Istnieje już kategoria o takim kodzie. Kod musi być unikalny.';
      } else if (catError.message.includes('not found')) {
        errorMessage += `Nie znaleziono kategorii o ID: ${categoryId}.`;
      } else {
        errorMessage += catError.message;
      }
      
      return { success: false, error: errorMessage };
    }
    
    // Success!
    console.log(`Successfully updated product category ${categoryId} and requirement ${requirementId}`);
    return { success: true };
  } catch (e) {
    console.error('Error updating product category:', e instanceof Error ? e.message : 'Unknown error');
    
    // Bardziej szczegółowa obsługa błędów
    let errorMessage = 'Wystąpił nieoczekiwany błąd podczas aktualizacji kategorii produktu.';
    if (e instanceof Error) {
      if (e.message.includes('fetch') || e.message.includes('network') || e.message.includes('Network Error')) {
        errorMessage = 'Problem z połączeniem sieciowym. Sprawdź połączenie internetowe.';
      } else {
        errorMessage = e.message;
      }
    }
    
    return { success: false, error: errorMessage };
  }
};

/**
 * Delete a product category and its requirement
 */
export const deleteProductCategory = async (categoryId: string) => {
  if (!supabase) {
    console.error('Error deleting product category: Supabase not configured');
    return { success: false, error: 'Nieprawidłowa konfiguracja Supabase. Przejdź do panelu konfiguracji, aby skonfigurować bazę danych.' };
  }
  
  try {
    // Validate input
    if (!categoryId) {
      console.error('Missing categoryId for delete operation');
      return { success: false, error: 'Brak identyfikatora kategorii.' };
    }
    
    // First get the category to find the requirement ID
    let category;
    try {
      category = await fetchProductCategoryById(categoryId);
    } catch (fetchError) {
      console.error('Error fetching category before delete:', 
        fetchError instanceof Error ? fetchError.message : 'Unknown error');
      
      // W przypadku błędu pobierania, sprawdźmy, czy to faktycznie błąd "nie znaleziono"
      if (fetchError instanceof Error && 
          (fetchError.message.includes('Nie znaleziono') || fetchError.message.includes('not found'))) {
        return { success: false, error: 'Nie znaleziono kategorii o podanym identyfikatorze.' };
      }
      
      // W przeciwnym wypadku przekaż oryginalny błąd
      return { 
        success: false, 
        error: fetchError instanceof Error 
          ? fetchError.message 
          : 'Wystąpił błąd podczas pobierania kategorii przed usunięciem.' 
      };
    }
    
    if (!category) {
      return { success: false, error: 'Nie znaleziono kategorii o podanym identyfikatorze.' };
    }
    
    const requirementId = category.requirement_id;
    if (!requirementId) {
      console.error(`Category ${categoryId} has no associated requirement_id`);
      return { success: false, error: 'Ta kategoria nie ma powiązanych wymagań.' };
    }
    
    // Delete the category
    const { error: catError } = await supabase
      .from('product_categories')
      .delete()
      .eq('id', categoryId);
    
    if (catError) {
      console.error('Error deleting product category:', catError.message || 'Unknown error', catError);
      
      // Mapowanie błędów na bardziej przyjazne dla użytkownika komunikaty
      let errorMessage = 'Wystąpił błąd podczas usuwania kategorii produktu: ';
      
      if (catError.message.includes('auth/invalid-api-key') || catError.message.includes('Invalid API key')) {
        errorMessage += 'Nieprawidłowy klucz API Supabase.';
      } else if (catError.message.includes('relation') || catError.message.includes('does not exist')) {
        errorMessage += 'Tabela product_categories nie istnieje w bazie danych.';
      } else if (catError.message.includes('permission denied')) {
        errorMessage += 'Brak uprawnień do usuwania rekordów. Sprawdź polityki RLS w bazie danych.';
      } else if (catError.message.includes('foreign key constraint') || catError.message.includes('violates')) {
        errorMessage += 'Ta kategoria jest używana przez inne elementy i nie może zostać usunięta.';
      } else {
        errorMessage += catError.message;
      }
      
      return { success: false, error: errorMessage };
    }
    
    // Delete the associated requirement
    const { error: reqError } = await supabase
      .from('product_requirements')
      .delete()
      .eq('id', requirementId);
    
    if (reqError) {
      console.error('Error deleting product requirement:', reqError.message || 'Unknown error', reqError);
      
      // Log ostrzegawczy - kategoria została usunięta, ale nie udało się usunąć wymagań
      console.warn(`Category ${categoryId} was deleted, but failed to delete requirement ${requirementId}. The requirement is now orphaned.`);
      
      // Mapowanie błędów na bardziej przyjazne dla użytkownika komunikaty
      let errorMessage = 'Kategoria została usunięta, ale wystąpił błąd podczas usuwania powiązanych wymagań: ';
      
      if (reqError.message.includes('auth/invalid-api-key') || reqError.message.includes('Invalid API key')) {
        errorMessage += 'Nieprawidłowy klucz API Supabase.';
      } else if (reqError.message.includes('relation') || reqError.message.includes('does not exist')) {
        errorMessage += 'Tabela product_requirements nie istnieje w bazie danych.';
      } else if (reqError.message.includes('permission denied')) {
        errorMessage += 'Brak uprawnień do usuwania rekordów. Sprawdź polityki RLS w bazie danych.';
      } else {
        errorMessage += reqError.message;
      }
      
      // Zwracamy sukces, ponieważ kategoria została usunięta, ale z ostrzeżeniem
      return { success: true, warning: errorMessage };
    }
    
    // Success!
    console.log(`Successfully deleted product category ${categoryId} and requirement ${requirementId}`);
    return { success: true };
  } catch (e) {
    console.error('Error deleting product category:', e instanceof Error ? e.message : 'Unknown error');
    
    // Bardziej szczegółowa obsługa błędów
    let errorMessage = 'Wystąpił nieoczekiwany błąd podczas usuwania kategorii produktu.';
    if (e instanceof Error) {
      if (e.message.includes('fetch') || e.message.includes('network') || e.message.includes('Network Error')) {
        errorMessage = 'Problem z połączeniem sieciowym. Sprawdź połączenie internetowe.';
      } else {
        errorMessage = e.message;
      }
    }
    
    return { success: false, error: errorMessage };
  }
};