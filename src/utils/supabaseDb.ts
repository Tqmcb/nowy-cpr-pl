import { supabase } from './supabase';
import type { PostgrestError } from '@supabase/supabase-js';

/**
 * A simplified interface for Supabase database operations.
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
    }[]
  ): Promise<{ data: T[] | null; error: PostgrestError | null }> => {
    let query = supabase.from(table).select(columns);
    
    // Apply filters if provided
    if (filters && filters.length > 0) {
      filters.forEach(filter => {
        query = query[filter.operator](filter.column, filter.value);
      });
    }
    
    return await query;
  },

  /**
   * Fetch a single record from a table
   * @param table The table name
   * @param id The record ID
   * @param columns Columns to select (default: '*')
   */
  getRecord: async <T = any>(
    table: string,
    id: string,
    columns: string = '*'
  ): Promise<{ data: T | null; error: PostgrestError | null }> => {
    return await supabase
      .from(table)
      .select(columns)
      .eq('id', id)
      .single();
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
    return await supabase.from(table).insert(data).select().single();
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
    return await supabase.from(table).insert(data).select();
  },

  /**
   * Update a record in a table
   * @param table The table name
   * @param id The record ID
   * @param data The data to update
   */
  updateRecord: async <T = any>(
    table: string,
    id: string,
    data: any
  ): Promise<{ data: T | null; error: PostgrestError | null }> => {
    return await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single();
  },

  /**
   * Delete a record from a table
   * @param table The table name
   * @param id The record ID
   */
  deleteRecord: async (
    table: string,
    id: string
  ): Promise<{ error: PostgrestError | null }> => {
    return await supabase.from(table).delete().eq('id', id);
  },

  /**
   * Check if a table exists
   * @param table The table name to check
   */
  checkTableExists: async (table: string): Promise<boolean> => {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      return !error;
    } catch (error) {
      console.error(`Error checking if table ${table} exists:`, error);
      return false;
    }
  }
};
