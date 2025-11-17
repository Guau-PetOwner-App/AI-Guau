import { supabase, getCurrentUser, type PetAnalysis } from '../lib/supabase';
import type { PetAnalysisResult } from './petAnalysisMapper';

const STORAGE_BUCKET = 'pet-photos';

/**
 * Upload pet photo to Supabase Storage
 */
export async function uploadPetPhoto(file: File, analysisId: string): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${analysisId}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log('Uploading photo to storage:', filePath);

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('Error uploading photo:', error);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    console.log('Photo uploaded successfully:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Error in uploadPetPhoto:', error);
    return null;
  }
}

/**
 * Save pet analysis to database
 * Can be saved anonymously (with email) or for authenticated user
 */
export async function savePetAnalysis(
  analysis: PetAnalysisResult,
  photoFile: File,
  email?: string
): Promise<{ id: string; success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    const analysisId = crypto.randomUUID();

    console.log('Saving pet analysis:', {
      analysisId,
      userId: user?.id,
      email,
      isAuthenticated: !!user,
    });

    // Upload photo to storage
    const photoUrl = await uploadPetPhoto(photoFile, analysisId);
    if (!photoUrl) {
      return {
        id: analysisId,
        success: false,
        error: 'Failed to upload photo',
      };
    }

    // Prepare analysis data
    const analysisData = {
      id: analysisId,
      user_id: user?.id || null,
      email: email || user?.email || null,
      pet_name: null, // User can set this later
      photo_url: photoUrl,
      analysis_data: analysis,
      is_claimed: !!user, // If user is authenticated, it's already claimed
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Insert into database
    const { data, error } = await supabase
      .from('pet_analyses')
      .insert(analysisData)
      .select()
      .single();

    if (error) {
      console.error('Error saving analysis to database:', error);
      return {
        id: analysisId,
        success: false,
        error: error.message,
      };
    }

    console.log('Analysis saved successfully:', data);

    // Store analysis ID in localStorage for later claim
    if (!user && email) {
      localStorage.setItem('pending_analysis_id', analysisId);
      localStorage.setItem('pending_analysis_email', email);
    }

    return {
      id: analysisId,
      success: true,
    };
  } catch (error) {
    console.error('Error in savePetAnalysis:', error);
    return {
      id: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Update an existing anonymous analysis with email ONLY (before login)
 * This is called when user enters email in AuthModal, before they actually authenticate
 */
export async function updateAnalysisEmail(
  analysisId: string,
  email: string
): Promise<boolean> {
  try {
    console.log('📧 Updating analysis with email (pre-auth):', {
      analysisId,
      email,
    });

    // Try to update with email
    // Remove .single() to avoid PGRST116 error when RLS blocks the update
    const { data, error } = await supabase
      .from('pet_analyses')
      .update({
        email: email,
        updated_at: new Date().toISOString(),
      })
      .eq('id', analysisId)
      .is('user_id', null) // Only update if not already claimed
      .select();

    if (error) {
      console.error('❌ Error updating analysis email:', error);
      console.error('⚠️ IMPORTANTE: Debes ejecutar el SQL fix en Supabase!');
      console.error('📄 Archivo: /EJECUTAR_ESTE_SQL_AHORA.sql');
      return false;
    }

    // Check if any rows were updated
    if (!data || data.length === 0) {
      console.warn('⚠️ No se actualizó ningún análisis. Posibles causas:');
      console.warn('   1. El análisis no existe con ese ID');
      console.warn('   2. El análisis ya tiene user_id (está reclamado)');
      console.warn('   3. Las políticas RLS están bloqueando el UPDATE');
      console.warn('📄 Si ves este mensaje, ejecuta: /EJECUTAR_ESTE_SQL_AHORA.sql');
      return false;
    }

    console.log('✅ Analysis email updated (ready for claim):', data[0]);
    return true;
  } catch (error) {
    console.error('Error in updateAnalysisEmail:', error);
    return false;
  }
}

/**
 * Update an existing anonymous analysis with user_id and mark as claimed after login
 * This is called in the official app when user logs in and we find their pending analysis
 */
export async function updateAnalysisWithUser(
  analysisId: string,
  userId: string,
  email: string
): Promise<boolean> {
  try {
    console.log('👤 Claiming analysis with user (post-auth):', {
      analysisId,
      userId,
      email,
    });

    const { data, error } = await supabase
      .from('pet_analyses')
      .update({
        user_id: userId,
        email: email,
        is_claimed: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', analysisId)
      .select()
      .single();

    if (error) {
      console.error('Error updating analysis with user:', error);
      return false;
    }

    console.log('✅ Analysis claimed by user:', data);
    return true;
  } catch (error) {
    console.error('Error in updateAnalysisWithUser:', error);
    return false;
  }
}

/**
 * Claim anonymous analysis after user signs up/in
 * NEW: Also checks for savedAnalysisId in current session
 */
export async function claimPendingAnalysis(
  userId: string, 
  email: string,
  currentAnalysisId?: string
): Promise<boolean> {
  try {
    console.log('Attempting to claim pending analysis:', {
      userId,
      email,
      currentAnalysisId,
    });

    // First, check if there's a current session analysis to claim
    if (currentAnalysisId) {
      const claimed = await updateAnalysisWithUser(currentAnalysisId, userId, email);
      if (claimed) {
        console.log('✅ Current session analysis claimed');
        return true;
      }
    }

    // Fallback: Check localStorage for pending analysis (old flow)
    const pendingAnalysisId = localStorage.getItem('pending_analysis_id');
    const pendingEmail = localStorage.getItem('pending_analysis_email');

    if (!pendingAnalysisId || !pendingEmail) {
      console.log('No pending analysis in localStorage');
      return false;
    }

    // Verify email matches
    if (pendingEmail.toLowerCase() !== email.toLowerCase()) {
      console.warn('Email mismatch, cannot claim analysis');
      localStorage.removeItem('pending_analysis_id');
      localStorage.removeItem('pending_analysis_email');
      return false;
    }

    // Update analysis with user_id and mark as claimed
    const { data, error } = await supabase
      .from('pet_analyses')
      .update({
        user_id: userId,
        email: email,
        is_claimed: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', pendingAnalysisId)
      .eq('email', pendingEmail)
      .select()
      .single();

    if (error) {
      console.error('Error claiming analysis:', error);
      return false;
    }

    console.log('✅ LocalStorage analysis claimed successfully:', data);

    // Clear localStorage
    localStorage.removeItem('pending_analysis_id');
    localStorage.removeItem('pending_analysis_email');

    return true;
  } catch (error) {
    console.error('Error in claimPendingAnalysis:', error);
    return false;
  }
}

/**
 * Get user's pet analyses
 */
export async function getUserAnalyses(userId: string): Promise<PetAnalysis[]> {
  try {
    const { data, error } = await supabase
      .from('pet_analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user analyses:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserAnalyses:', error);
    return [];
  }
}

/**
 * Get analysis by ID
 */
export async function getAnalysisById(analysisId: string): Promise<PetAnalysis | null> {
  try {
    const { data, error } = await supabase
      .from('pet_analyses')
      .select('*')
      .eq('id', analysisId)
      .single();

    if (error) {
      console.error('Error fetching analysis:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getAnalysisById:', error);
    return null;
  }
}

/**
 * Update pet name
 */
export async function updatePetName(analysisId: string, petName: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('pet_analyses')
      .update({
        pet_name: petName,
        updated_at: new Date().toISOString(),
      })
      .eq('id', analysisId);

    if (error) {
      console.error('Error updating pet name:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updatePetName:', error);
    return false;
  }
}

/**
 * Delete analysis
 */
export async function deleteAnalysis(analysisId: string): Promise<boolean> {
  try {
    // First, delete the photo from storage
    const { data: analysis } = await supabase
      .from('pet_analyses')
      .select('photo_url')
      .eq('id', analysisId)
      .single();

    if (analysis?.photo_url) {
      const fileName = analysis.photo_url.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from(STORAGE_BUCKET)
          .remove([fileName]);
      }
    }

    // Delete from database
    const { error } = await supabase
      .from('pet_analyses')
      .delete()
      .eq('id', analysisId);

    if (error) {
      console.error('Error deleting analysis:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteAnalysis:', error);
    return false;
  }
}

/**
 * Check if there's a pending analysis to show after login
 */
export function hasPendingAnalysis(): boolean {
  return !!(
    localStorage.getItem('pending_analysis_id') &&
    localStorage.getItem('pending_analysis_email')
  );
}

/**
 * Get pending analysis details from localStorage
 */
export function getPendingAnalysisDetails(): { id: string; email: string } | null {
  const id = localStorage.getItem('pending_analysis_id');
  const email = localStorage.getItem('pending_analysis_email');

  if (!id || !email) return null;

  return { id, email };
}
