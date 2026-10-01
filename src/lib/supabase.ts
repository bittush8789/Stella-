import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Validates whether valid Supabase environment variables are provided
 */
export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes('your-project-id') &&
    supabaseUrl.startsWith('https://')
  );
};

/**
 * Initialized Supabase client instance using environment variables
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
  : null;

export interface SupabaseConnectionStatus {
  isConfigured: boolean;
  url: string;
  isConnected: boolean;
  tables: string[];
  lastChecked?: string;
  error?: string;
}

/**
 * Checks connection health to the configured Supabase database
 */
export async function checkSupabaseConnection(): Promise<SupabaseConnectionStatus> {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      isConfigured: false,
      url: supabaseUrl || 'Not configured in environment',
      isConnected: false,
      tables: ['products', 'users', 'cart_items', 'wishlist_items', 'orders'],
      error: 'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment to connect to Supabase.'
    };
  }

  try {
    const { error } = await supabase.from('products').select('count', { count: 'exact', head: true });
    if (error) {
      return {
        isConfigured: true,
        url: supabaseUrl,
        isConnected: false,
        tables: ['products', 'users', 'cart_items', 'wishlist_items', 'orders'],
        lastChecked: new Date().toLocaleTimeString(),
        error: error.message
      };
    }
    return {
      isConfigured: true,
      url: supabaseUrl,
      isConnected: true,
      tables: ['products', 'users', 'cart_items', 'wishlist_items', 'orders'],
      lastChecked: new Date().toLocaleTimeString()
    };
  } catch (err: any) {
    return {
      isConfigured: true,
      url: supabaseUrl,
      isConnected: false,
      tables: ['products', 'users', 'cart_items', 'wishlist_items', 'orders'],
      lastChecked: new Date().toLocaleTimeString(),
      error: err.message || 'Failed to connect to Supabase'
    };
  }
}
