import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User, AuthError } from '@supabase/supabase-js';

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  loading: boolean;
  error: AuthError | null;
  errorDetails?: string;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isAdmin: false,
    user: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAuthChange = async (event: string, session: any) => {
    console.log('Auth state changed:', event);
    console.log('Session:', session ? 'exists' : 'none');

    if (session?.user) {
      try {
        // First, ensure the profile exists
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert({
            id: session.user.id,
            email: session.user.email,
            is_admin: session.user.email === 'admin@pawfectfind.com'
          });

        if (upsertError) {
          console.error('Profile upsert error:', upsertError);
          throw upsertError;
        }

        // Then fetch the profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          throw profileError;
        }

        console.log('Profile data:', profile);

        setAuthState({
          isAuthenticated: true,
          user: session.user,
          isAdmin: profile?.is_admin || false,
          loading: false,
          error: null
        });
      } catch (err) {
        console.error('Error handling auth change:', err);
        setAuthState({
          isAuthenticated: false,
          user: null,
          isAdmin: false,
          loading: false,
          error: err as AuthError,
          errorDetails: err instanceof Error ? err.message : 'Unknown error during auth change'
        });
      }
    } else {
      setAuthState({
        isAuthenticated: false,
        user: null,
        isAdmin: false,
        loading: false,
        error: null
      });
    }
  };

  const checkSession = async () => {
    try {
      console.log('Checking session...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session check error:', sessionError);
        throw sessionError;
      }

      console.log('Session:', session ? 'exists' : 'none');

      if (session?.user) {
        console.log('User ID:', session.user.id);
        console.log('User email:', session.user.email);

        // First, ensure the profile exists
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert({
            id: session.user.id,
            email: session.user.email,
            is_admin: session.user.email === 'admin@pawfectfind.com'
          });

        if (upsertError) {
          console.error('Profile upsert error:', upsertError);
          throw upsertError;
        }

        // Then fetch the profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          throw profileError;
        }

        console.log('Profile data:', profile);

        setAuthState({
          isAuthenticated: true,
          user: session.user,
          isAdmin: profile?.is_admin || false,
          loading: false,
          error: null
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isAdmin: false,
          loading: false,
          error: null
        });
      }
    } catch (err) {
      console.error('Session check failed:', err);
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: err as AuthError,
        errorDetails: err instanceof Error ? err.message : 'Unknown error during session check'
      }));
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login for:', email);
      setAuthState(prev => ({ ...prev, loading: true, error: null }));

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        throw signInError;
      }

      if (!data.user) {
        console.error('No user data returned from sign in');
        throw new Error('No user data returned from sign in');
      }

      // First, ensure the profile exists
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          email: data.user.email,
          is_admin: data.user.email === 'admin@pawfectfind.com'
        });

      if (upsertError) {
        console.error('Profile upsert error:', upsertError);
        throw upsertError;
      }

      // Then fetch the profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        throw profileError;
      }

      console.log('Profile data:', profile);

      const isAdmin = profile?.is_admin || false;
      console.log('Is admin:', isAdmin);

      setAuthState({
        isAuthenticated: true,
        user: data.user,
        isAdmin,
        loading: false,
        error: null
      });

      return isAdmin;
    } catch (err) {
      console.error('Login failed:', err);
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: false,
        user: null,
        isAdmin: false,
        loading: false,
        error: err as AuthError,
        errorDetails: err instanceof Error ? err.message : 'Unknown error during login'
      }));
      return false;
    }
  };

  const logout = async () => {
    try {
      console.log('Attempting logout...');
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.error('Sign out error:', signOutError);
        throw signOutError;
      }

      console.log('Signed out successfully');

      setAuthState({
        isAuthenticated: false,
        user: null,
        isAdmin: false,
        loading: false,
        error: null
      });
    } catch (err) {
      console.error('Logout failed:', err);
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: err as AuthError,
        errorDetails: err instanceof Error ? err.message : 'Unknown error during logout'
      }));
    }
  };

  return {
    ...authState,
    login,
    logout,
    refreshSession: checkSession
  };
};