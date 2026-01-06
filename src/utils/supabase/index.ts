/**
 * Supabase utilities index file
 * 
 * This file exports all Supabase-related utilities for easy imports.
 * Instead of importing from multiple files, you can import everything from this file.
 * 
 * Example:
 * ```typescript
 * import { supabaseClient, supabaseAuth, supabaseDb } from 'utils/supabase';
 * ```
 */

export { supabaseClient } from './client';
export { supabaseAuth } from './auth';
export { supabaseDb } from './database';

// Re-export types that might be useful
export type { ProductCategoryRow, ProductRequirementRow, BlogPostRow, DocumentRow } from './types';
