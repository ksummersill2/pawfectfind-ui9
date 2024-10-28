import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Supabase configuration
const supabaseUrl = 'https://imeweqrvijtxaubchhon.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltZXdlcXJ2aWp0eGF1YmNoaG9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk4MzQwNTEsImV4cCI6MjA0NTQxMDA1MX0.oZnvg1FWXG_hRM9pCRq8FZLER6QqEUqXM7oqcReg6uM';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration');
  throw new Error('Missing Supabase configuration');
}

// Create Supabase client with debug logging
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    storage: localStorage,
    storageKey: 'pawfectfind_auth',
    flowType: 'pkce'
  },
  global: {
    headers: {
      'x-application-name': 'pawfectfind'
    }
  },
  db: {
    schema: 'public'
  }
});

// Helper function to handle Supabase queries with retries
export async function fetchFromSupabase<T>(
  query: Promise<{ data: T | null; error: any }>,
  retries = 3,
  delay = 1000
): Promise<T> {
  let lastError;
  
  for (let i = 0; i < retries; i++) {
    try {
      const { data, error } = await query;
      
      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('No data returned from Supabase query');
      }
      
      return data;
    } catch (err) {
      lastError = err;
      console.error(`Supabase query attempt ${i + 1} failed:`, err);
      
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        continue;
      }
      
      break;
    }
  }
  
  throw lastError;
}

// Debug logging for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event);
  console.log('Session:', session ? 'exists' : 'none');
  if (session?.user) {
    console.log('User ID:', session.user.id);
    console.log('User email:', session.user.email);
  }
});

// Initialize admin user with better error handling
export const initializeAdmin = async () => {
  try {
    console.log('Checking for existing admin...');
    
    // First check if admin exists in auth
    const { data: { user: existingAuthUser }, error: authError } = await supabase.auth.admin.getUserById(
      'admin@pawfectfind.com'
    );

    if (authError) {
      console.error('Error checking admin auth:', authError);
    }

    if (!existingAuthUser) {
      console.log('Admin user not found, creating...');
      
      // Create admin user
      const { data: { user: newUser }, error: signUpError } = await supabase.auth.signUp({
        email: 'admin@pawfectfind.com',
        password: 'admin123',
        options: {
          data: {
            role: 'admin'
          }
        }
      });

      if (signUpError) {
        console.error('Error creating admin user:', signUpError);
        return;
      }

      if (!newUser) {
        console.error('Failed to create admin user - no user returned');
        return;
      }

      console.log('Admin user created:', newUser.id);

      // Create admin profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: newUser.id,
          email: 'admin@pawfectfind.com',
          role: 'admin',
          display_name: 'Admin'
        });

      if (profileError) {
        console.error('Error creating admin profile:', profileError);
      } else {
        console.log('Admin profile created successfully');
      }
    } else {
      console.log('Admin user already exists');
      
      // Ensure admin profile exists
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: existingAuthUser.id,
          email: 'admin@pawfectfind.com',
          role: 'admin',
          display_name: 'Admin'
        });

      if (profileError) {
        console.error('Error ensuring admin profile:', profileError);
      } else {
        console.log('Admin profile verified/updated');
      }
    }
  } catch (err) {
    console.error('Error in admin initialization:', err);
  }
};

// Test database connection with detailed error logging
export const testConnection = async () => {
  try {
    console.log('Testing database connection...');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Database connection test failed:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return false;
    }

    console.log('Database connection successful, retrieved:', data);
    return true;
  } catch (err) {
    console.error('Database connection test error:', err);
    return false;
  }
};

// Initialize on load
console.log('Initializing Supabase client...');
testConnection().then(success => {
  if (success) {
    console.log('Connection test passed, initializing admin...');
    initializeAdmin();
  } else {
    console.error('Connection test failed, skipping admin initialization');
  }
});

export default supabase;