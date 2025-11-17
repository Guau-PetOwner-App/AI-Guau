import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
const SUPABASE_URL = 'https://oqoaxusesfcrmejftwmt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xb2F4dXNlc2Zjcm1lamZ0d210Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NzgyNjUsImV4cCI6MjA3NTQ1NDI2NX0.gzN5Rx9cCSWoC7QGlNfAClwKV-l0__2zqwlZeTaJKaI';

// Database Types
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  phone: string | null;
  is_professional: boolean;
  stripe_customer_id: string | null;
}

export interface PetAnalysis {
  id: string;
  user_id: string | null;
  email: string | null;
  pet_name: string | null;
  photo_url: string;
  analysis_data: any; // GuauVisionResponse JSON
  is_claimed: boolean;
  created_at: string;
  updated_at: string;
}

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionUrl: true,
  },
});

// Auth helpers
export const getCurrentUser = async () => {
  try {
    // First check if there's a session
    const { data: { session } } = await supabase.auth.getSession();
    
    // No session = not authenticated (normal case, not an error)
    if (!session) {
      return null;
    }

    // If session exists, get user
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      // Only log real errors, not missing session errors
      if (error.name !== 'AuthSessionMissingError') {
        console.error('Error getting current user:', error);
      }
      return null;
    }
    
    return user;
  } catch (error) {
    // Silently handle auth errors - user is simply not logged in
    return null;
  }
};

export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error);
      return null;
    }
    return session;
  } catch (error) {
    return null;
  }
};

// Sign in with OTP (magic link)
export const signInWithOTP = async (email: string, redirectTo?: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo || window.location.origin,
    },
  });
  
  if (error) {
    console.error('Error signing in with OTP:', error);
    throw error;
  }
  
  return data;
};

// Sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};

// Get or create profile
export const getOrCreateProfile = async (userId: string, email: string): Promise<Profile | null> => {
  try {
    // First try to get existing profile
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (existingProfile) {
      return existingProfile;
    }

    // If not found, create new profile
    if (fetchError && fetchError.code === 'PGRST116') {
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email,
          full_name: email.split('@')[0], // Use email prefix as default name
          is_professional: false,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating profile:', insertError);
        return null;
      }

      return newProfile;
    }

    console.error('Error fetching profile:', fetchError);
    return null;
  } catch (error) {
    console.error('Error in getOrCreateProfile:', error);
    return null;
  }
};
