import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: any | null;
  session: any | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkSession: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: false,
  error: null,

  signIn: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      set({ 
        user: data?.user || null, 
        session: data?.session || null,
        error: null 
      });
    } catch (error: any) {
      set({ error: error.message || 'Failed to sign in' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
      
      set({ 
        user: data?.user || null, 
        session: data?.session || null,
        error: null 
      });
    } catch (error: any) {
      set({ error: error.message || 'Failed to sign up' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, session: null, error: null });
    } catch (error: any) {
      set({ error: error.message || 'Failed to sign out' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  checkSession: async () => {
    try {
      set({ loading: true, error: null });
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: { user } } = await supabase.auth.getUser();
        set({ user, session, error: null });
      } else {
        set({ user: null, session: null, error: null });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to check session' });
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));