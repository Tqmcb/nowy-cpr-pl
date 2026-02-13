import { createClient, SupabaseClient } from '@supabase/supabase-js';
// databutton is not available in frontend, use localStorage instead

// Helper to create a mock client that prevents crashes when config is missing
const createMockClient = (): SupabaseClient => {
  const createMockBuilder = () => {
    const builder: any = {
      _isSingle: false,
      then: function(onfulfilled: any, onrejected: any) {
        const result = this._isSingle
            ? { data: {}, error: null }
            : { data: [], count: 0, error: null };
        return Promise.resolve(result).then(onfulfilled, onrejected);
      },
      select: function() { return this; },
      insert: function() { return this; },
      update: function() { return this; },
      delete: function() { return this; },
      eq: function() { return this; },
      neq: function() { return this; },
      gt: function() { return this; },
      lt: function() { return this; },
      gte: function() { return this; },
      lte: function() { return this; },
      like: function() { return this; },
      ilike: function() { return this; },
      is: function() { return this; },
      in: function() { return this; },
      contains: function() { return this; },
      containedBy: function() { return this; },
      range: function() { return this; },
      rangeGt: function() { return this; },
      rangeGte: function() { return this; },
      rangeLt: function() { return this; },
      rangeLte: function() { return this; },
      rangeAdjacent: function() { return this; },
      overlaps: function() { return this; },
      textSearch: function() { return this; },
      match: function() { return this; },
      not: function() { return this; },
      or: function() { return this; },
      filter: function() { return this; },
      order: function() { return this; },
      limit: function() { return this; },
      offset: function() { return this; },
      single: function() { this._isSingle = true; return this; },
      maybeSingle: function() { this._isSingle = true; return this; },
      csv: function() { return Promise.resolve({ data: '', error: null }); }
    };
    return builder;
  };

  return {
    from: (table: string) => createMockBuilder(),
    auth: {
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
      signInWithOAuth: () => Promise.resolve({ data: { url: null }, error: { message: 'Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      resetPasswordForEmail: () => Promise.resolve({ data: {}, error: null }),
      updateUser: () => Promise.resolve({ data: { user: null }, error: null }),
    },
  } as unknown as SupabaseClient;
};

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
    return createMockClient();
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
    return createMockClient();
  }
  
  return createClient(url, key);
}

// Create and export the default Supabase client
export const supabaseClient = createSupabaseClient();
