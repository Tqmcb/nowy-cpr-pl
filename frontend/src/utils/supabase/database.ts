import { createSupabaseClient } from './client';
import type { PostgrestError } from '@supabase/supabase-js';
import type { ProductCategoryRow, ProductRequirementRow, BlogPostRow, DocumentRow } from './types';

/**
 * A unified interface for Supabase database operations.
 * This utility handles all database operations directly from the frontend.
 */
export const supabaseDb = {
  /**
   * Fetch records from a table
   * @param table The table name
   * @param columns Columns to select (default: '*')
   * @param filters Optional query filters
   */
  getRecords: async <T = any>(
    table: string,
    columns: string = '*',
    filters?: {
      column: string;
      operator: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'like' | 'ilike';
      value: any;
    }[],
    options?: {
      orderBy?: string;
      ascending?: boolean;
      limit?: number;
      offset?: number;
    }
  ): Promise<{ data: T[] | null; error: PostgrestError | null }> => {
    const supabase = createSupabaseClient();
    if (!supabase) {
      return { data: null, error: { message: 'No valid Supabase configuration' } as PostgrestError };
    }
    
    try {
      let query = supabase.from(table).select(columns);
      
      // Apply filters if provided
      if (filters && filters.length > 0) {
        filters.forEach(filter => {
          query = query[filter.operator](filter.column, filter.value);
        });
      }
      
      // Apply ordering
      if (options?.orderBy) {
        query = query.order(options.orderBy, { ascending: options.ascending ?? true });
      }
      
      // Apply pagination
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      
      if (options?.offset) {
        query = query.offset(options.offset);
      }
      
      return await query;
    } catch (error) {
      console.error(`Error fetching records from ${table}:`, error);
      return { 
        data: null, 
        error: error instanceof Error ? 
          { message: error.message } as PostgrestError : 
          { message: `Unknown error fetching from ${table}` } as PostgrestError 
      };
    }
  },

  /**
   * Fetch a single record from a table
   * @param table The table name
   * @param id The record ID
   * @param columns Columns to select (default: '*')
   */
  getRecord: async <T = any>(
    table: string,
    id: string | number,
    columns: string = '*'
  ): Promise<{ data: T | null; error: PostgrestError | null }> => {
    const supabase = createSupabaseClient();
    if (!supabase) {
      return { data: null, error: { message: 'No valid Supabase configuration' } as PostgrestError };
    }
    
    try {
      return await supabase
        .from(table)
        .select(columns)
        .eq('id', id)
        .single();
    } catch (error) {
      console.error(`Error fetching record from ${table}:`, error);
      return { 
        data: null, 
        error: error instanceof Error ? 
          { message: error.message } as PostgrestError : 
          { message: `Unknown error fetching from ${table}` } as PostgrestError 
      };
    }
  },

  /**
   * Insert a record into a table
   * @param table The table name
   * @param data The data to insert
   */
  insertRecord: async <T = any>(
    table: string,
    data: any
  ): Promise<{ data: T | null; error: PostgrestError | null }> => {
    const supabase = createSupabaseClient();
    if (!supabase) {
      return { data: null, error: { message: 'No valid Supabase configuration' } as PostgrestError };
    }
    
    try {
      return await supabase.from(table).insert(data).select().single();
    } catch (error) {
      console.error(`Error inserting into ${table}:`, error);
      return { 
        data: null, 
        error: error instanceof Error ? 
          { message: error.message } as PostgrestError : 
          { message: `Unknown error inserting into ${table}` } as PostgrestError 
      };
    }
  },

  /**
   * Insert multiple records into a table
   * @param table The table name
   * @param data Array of records to insert
   */
  insertRecords: async <T = any>(
    table: string,
    data: any[]
  ): Promise<{ data: T[] | null; error: PostgrestError | null }> => {
    const supabase = createSupabaseClient();
    if (!supabase) {
      return { data: null, error: { message: 'No valid Supabase configuration' } as PostgrestError };
    }
    
    try {
      return await supabase.from(table).insert(data).select();
    } catch (error) {
      console.error(`Error inserting multiple records into ${table}:`, error);
      return { 
        data: null, 
        error: error instanceof Error ? 
          { message: error.message } as PostgrestError : 
          { message: `Unknown error inserting into ${table}` } as PostgrestError 
      };
    }
  },

  /**
   * Update a record in a table
   * @param table The table name
   * @param id The record ID
   * @param data The data to update
   */
  updateRecord: async <T = any>(
    table: string,
    id: string | number,
    data: any
  ): Promise<{ data: T | null; error: PostgrestError | null }> => {
    const supabase = createSupabaseClient();
    if (!supabase) {
      return { data: null, error: { message: 'No valid Supabase configuration' } as PostgrestError };
    }
    
    try {
      return await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();
    } catch (error) {
      console.error(`Error updating record in ${table}:`, error);
      return { 
        data: null, 
        error: error instanceof Error ? 
          { message: error.message } as PostgrestError : 
          { message: `Unknown error updating ${table}` } as PostgrestError 
      };
    }
  },

  /**
   * Delete a record from a table
   * @param table The table name
   * @param id The record ID
   */
  deleteRecord: async (
    table: string,
    id: string | number
  ): Promise<{ error: PostgrestError | null }> => {
    const supabase = createSupabaseClient();
    if (!supabase) {
      return { error: { message: 'No valid Supabase configuration' } as PostgrestError };
    }
    
    try {
      return await supabase.from(table).delete().eq('id', id);
    } catch (error) {
      console.error(`Error deleting record from ${table}:`, error);
      return { 
        error: error instanceof Error ? 
          { message: error.message } as PostgrestError : 
          { message: `Unknown error deleting from ${table}` } as PostgrestError 
      };
    }
  },

  /**
   * Check if a table exists
   * @param table The table name to check
   */
  checkTableExists: async (table: string): Promise<boolean> => {
    const supabase = createSupabaseClient();
    if (!supabase) {
      return false;
    }
    
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      return !error;
    } catch (error) {
      console.error(`Error checking if table ${table} exists:`, error);
      return false;
    }
  },
  
  /**
   * Upload a file to Supabase storage
   * @param bucket The storage bucket name
   * @param path The file path within the bucket
   * @param file The file to upload
   */
  uploadFile: async (bucket: string, path: string, file: File) => {
    const supabase = createSupabaseClient();
    if (!supabase) {
      return { data: null, error: { message: 'No valid Supabase configuration' } };
    }
    
    try {
      return await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });
    } catch (error) {
      console.error(`Error uploading file to ${bucket}/${path}:`, error);
      return { 
        data: null, 
        error: error instanceof Error ? { message: error.message } : { message: 'Unknown error uploading file' } 
      };
    }
  },

  /**
   * Get a public URL for a file in Supabase storage
   * @param bucket The storage bucket name
   * @param path The file path within the bucket
   */
  getFileUrl: (bucket: string, path: string) => {
    const supabase = createSupabaseClient();
    if (!supabase) {
      return { publicUrl: '' };
    }
    
    return supabase.storage.from(bucket).getPublicUrl(path);
  },

  /**
   * Delete a file from Supabase storage
   * @param bucket The storage bucket name
   * @param path The file path within the bucket
   */
  deleteFile: async (bucket: string, path: string) => {
    const supabase = createSupabaseClient();
    if (!supabase) {
      return { data: null, error: { message: 'No valid Supabase configuration' } };
    }
    
    try {
      return await supabase.storage.from(bucket).remove([path]);
    } catch (error) {
      console.error(`Error deleting file from ${bucket}/${path}:`, error);
      return { 
        data: null, 
        error: error instanceof Error ? { message: error.message } : { message: 'Unknown error deleting file' } 
      };
    }
  }
};
