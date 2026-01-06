import { getSupabaseClient } from './supabaseAuth';

/**
 * Generic types for database operations
 */
type TableName = 'product_categories' | 'products' | 'blog_posts' | 'documents';
type OrderDirection = 'asc' | 'desc';

/**
 * Generic fetch function for Supabase tables
 * @param table The table name to fetch from
 * @param options Query options including filters, sorting, etc.
 */
export async function fetchData<T>(table: TableName, options: {
  columns?: string;
  filters?: Record<string, any>;
  orderBy?: string;
  orderDirection?: OrderDirection;
  limit?: number;
  offset?: number;
  single?: boolean;
}) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { data: null, error: { message: 'No valid Supabase configuration' } };
  }
  
  try {
    // Start the query
    let query = supabase.from(table).select(options.columns || '*');
    
    // Apply filters if provided
    if (options.filters) {
      for (const [key, value] of Object.entries(options.filters)) {
        query = query.eq(key, value);
      }
    }
    
    // Apply ordering
    if (options.orderBy) {
      query = query.order(
        options.orderBy, 
        { ascending: options.orderDirection !== 'desc' }
      );
    }
    
    // Apply pagination
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    if (options.offset) {
      query = query.offset(options.offset);
    }
    
    // Execute the query
    if (options.single) {
      return await query.single<T>();
    } else {
      return await query<T>();
    }
  } catch (error) {
    console.error(`Error fetching data from ${table}:`, error);
    return { 
      data: null, 
      error: error instanceof Error ? error : { message: `Error fetching data from ${table}` } 
    };
  }
}

/**
 * Insert data into a Supabase table
 * @param table The table name to insert into
 * @param data The data to insert
 */
export async function insertData<T>(table: TableName, data: Record<string, any>) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { data: null, error: { message: 'No valid Supabase configuration' } };
  }
  
  try {
    return await supabase.from(table).insert(data).select().single<T>();
  } catch (error) {
    console.error(`Error inserting data into ${table}:`, error);
    return { 
      data: null, 
      error: error instanceof Error ? error : { message: `Error inserting data into ${table}` } 
    };
  }
}

/**
 * Update data in a Supabase table
 * @param table The table name to update
 * @param id The ID of the record to update
 * @param data The update data
 */
export async function updateData<T>(table: TableName, id: string | number, data: Record<string, any>) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { data: null, error: { message: 'No valid Supabase configuration' } };
  }
  
  try {
    return await supabase.from(table).update(data).eq('id', id).select().single<T>();
  } catch (error) {
    console.error(`Error updating data in ${table}:`, error);
    return { 
      data: null, 
      error: error instanceof Error ? error : { message: `Error updating data in ${table}` } 
    };
  }
}

/**
 * Delete data from a Supabase table
 * @param table The table name to delete from
 * @param id The ID of the record to delete
 */
export async function deleteData(table: TableName, id: string | number) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { data: null, error: { message: 'No valid Supabase configuration' } };
  }
  
  try {
    return await supabase.from(table).delete().eq('id', id);
  } catch (error) {
    console.error(`Error deleting data from ${table}:`, error);
    return { 
      data: null, 
      error: error instanceof Error ? error : { message: `Error deleting data from ${table}` } 
    };
  }
}

/**
 * Upload a file to Supabase storage
 * @param bucket The storage bucket name
 * @param path The file path within the bucket
 * @param file The file to upload
 */
export async function uploadFile(bucket: string, path: string, file: File) {
  const supabase = getSupabaseClient();
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
      error: error instanceof Error ? error : { message: `Error uploading file` } 
    };
  }
}

/**
 * Get a public URL for a file in Supabase storage
 * @param bucket The storage bucket name
 * @param path The file path within the bucket
 */
export function getFileUrl(bucket: string, path: string) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return null;
  }
  
  return supabase.storage.from(bucket).getPublicUrl(path);
}

/**
 * Delete a file from Supabase storage
 * @param bucket The storage bucket name
 * @param path The file path within the bucket
 */
export async function deleteFile(bucket: string, path: string) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { data: null, error: { message: 'No valid Supabase configuration' } };
  }
  
  try {
    return await supabase.storage.from(bucket).remove([path]);
  } catch (error) {
    console.error(`Error deleting file from ${bucket}/${path}:`, error);
    return { 
      data: null, 
      error: error instanceof Error ? error : { message: `Error deleting file` } 
    };
  }
}
