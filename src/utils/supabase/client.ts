import { createClient } from '@supabase/supabase-js';
// databutton is not available in frontend, use localStorage instead

/**
 * Gets configuration from local storage (synchronous and async versions are now identical)
 */
export async function getSupabaseConfigAsync() {
  return getSupabaseConfigFromLocalStorage();
}

/**
 * Gets configuration from local storage
 */
export function getSupabaseConfigFromLocalStorage() {
  const url = localStorage.getItem('supabaseUrl') || '';
  const key = localStorage.getItem('supabaseKey') || '';
  const serviceRoleKey = localStorage.getItem('supabaseServiceRoleKey') || '';
  
  console.info('Supabase config from localStorage:', { 
    url: url, 
    keyStart: key ? key.substring(0, 15) + '...' : 'missing',
    serviceRoleKeyExists: !!serviceRoleKey
  });
  
  // Validate configuration
  if (!url || !url.startsWith('https://')) {
    console.warn('Invalid Supabase URL: URL must start with https://');
  }
  
  if (!key || key.length < 20) {
    console.warn('Invalid Supabase key: Key is missing or too short');
  }
  
  return {
    supabaseUrl: url,
    supabaseKey: key,
    serviceRoleKey,
    hasValidConfig: !!(url && key && url.startsWith('https://') && key.length >= 20)
  };
}

/**
 * Gets configuration from local storage (synchronous version)
 */
export function getSupabaseConfig() {
  return getSupabaseConfigFromLocalStorage();
}

/**
 * Creates a Supabase client instance asynchronously
 * @param config Optional override for default configuration
 */
export async function createSupabaseClientAsync(config?: { 
  url?: string; 
  key?: string; 
  useServiceRole?: boolean;
}) {
  const defaultConfig = await getSupabaseConfigAsync();
  
  const url = config?.url || defaultConfig.supabaseUrl;
  const key = config?.useServiceRole ? 
    defaultConfig.serviceRoleKey : 
    (config?.key || defaultConfig.supabaseKey);
  
  if (!url || !key) {
    console.warn('Missing Supabase configuration. Please configure in Settings.');
    return null;
  }
  
  return createClient(url, key);
}

/**
 * Creates a Supabase client instance (synchronous version)
 * @param config Optional override for default configuration
 */
export function createSupabaseClient(config?: { 
  url?: string; 
  key?: string; 
  useServiceRole?: boolean;
}) {
  const defaultConfig = getSupabaseConfig();
  
  const url = config?.url || defaultConfig.supabaseUrl;
  const key = config?.useServiceRole ? 
    defaultConfig.serviceRoleKey : 
    (config?.key || defaultConfig.supabaseKey);
  
  if (!url || !key) {
    console.warn('Missing Supabase configuration. Please configure in Settings.');
    return null;
  }
  
  return createClient(url, key);
}

// Create and export the default Supabase client
export const supabaseClient = createSupabaseClient();
