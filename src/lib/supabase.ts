import { createClient } from '@supabase/supabase-js';

const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const supabaseUrl = 'https://sacidmujchtkalbpulvl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhY2lkbXVqY2h0a2FsYnB1bHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5NDMyOTYsImV4cCI6MjA0NzUxOTI5Nn0.wL23ylQAY7vSeVtbi8Yb5MNw7Ix7xc_ilwnZi6DnX6Y';

if (!validateUrl(supabaseUrl)) {
  throw new Error('Invalid Supabase URL');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);