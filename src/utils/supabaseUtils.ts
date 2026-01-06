/**
 * Supabase utilities index file
 * 
 * This file exports all Supabase-related utilities for easy imports.
 * Instead of importing from multiple files, you can import everything from this file.
 * 
 * Example:
 * ```typescript
 * import { supabase, supabaseAuth, supabaseDb } from 'utils/supabaseUtils';
 * ```
 */

// Export the Supabase client
export { supabase } from './supabase';

// Export auth utilities
export { supabaseAuth } from './supabaseAuth';

// Export database utilities
export { supabaseDb } from './supabaseDb';

// Re-export types that might be useful
export type { AuthUser, AuthState, ProductCategoryRow, ProductRequirementRow } from './supabase';
