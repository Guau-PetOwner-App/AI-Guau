/**
 * Guau App Configuration
 * 
 * Este archivo contiene la configuración para el landing de captación
 * y la app oficial de Guau.
 */

// URL de la app oficial de Guau (donde se redirige después del magic link)
export const GUAU_APP_URL = 'https://get.guau.app';

// Este landing es solo para captación de usuarios
// El magic link siempre redirige a GUAU_APP_URL
export const IS_CAPTURE_LANDING = true;

// Función helper para construir URL de redirect con análisis pendiente
export function buildRedirectUrl(pendingAnalysisId?: string, pendingEmail?: string): string {
  const url = new URL(GUAU_APP_URL);
  
  // Si hay análisis pendiente, pasarlo como query params
  if (pendingAnalysisId) {
    url.searchParams.set('pending_analysis_id', pendingAnalysisId);
  }
  
  if (pendingEmail) {
    url.searchParams.set('pending_email', pendingEmail);
  }
  
  return url.toString();
}

// Función para extraer análisis pendiente de URL (para usar en la app oficial)
export function getPendingAnalysisFromUrl(): { id: string; email: string } | null {
  if (typeof window === 'undefined') return null;
  
  const params = new URLSearchParams(window.location.search);
  const id = params.get('pending_analysis_id');
  const email = params.get('pending_email');
  
  if (id && email) {
    return { id, email };
  }
  
  return null;
}

