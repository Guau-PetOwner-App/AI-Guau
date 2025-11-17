/**
 * Backend API Service
 * 
 * This service handles communication with the Guau backend API.
 * Use this when you have a backend that proxies OpenAI Assistant calls.
 * 
 * Architecture:
 * Client → Backend (/ai/pet-analyze) → OpenAI Assistant
 *        ↓
 *      /save → Database
 */

import { GuauVisionResponse } from './openai';

// Get backend base URL from environment variable
const API_BASE = import.meta.env.VITE_GUAU_API_BASE || 'http://localhost:3000';

/**
 * Convert File to base64 string (no data URL prefix)
 */
export async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000; // 32KB chunks
  
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)));
  }
  
  return btoa(binary);
}

/**
 * Resize image to max dimension (optional optimization)
 * Returns base64 string without data URL prefix
 */
export async function resizeImage(file: File, maxDimension: number = 1024): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = Math.min(maxDimension / img.width, maxDimension / img.height, 1);
        
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Get base64 without prefix
        const dataURL = canvas.toDataURL('image/jpeg', 0.9);
        const base64 = dataURL.split(',')[1];
        resolve(base64);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Analyze pet image via backend
 * 
 * POST /ai/pet-analyze
 * Body: { image_base64, locale, app_context }
 * Returns: GuauVisionResponse (JSON from OpenAI Assistant)
 */
export async function analyzePetImageViaBackend(
  file: File,
  locale: string = 'es-ES',
  resize: boolean = true
): Promise<GuauVisionResponse> {
  try {
    console.log('📤 Sending image to backend for analysis...');
    
    // Convert to base64 (with optional resize)
    const base64 = resize 
      ? await resizeImage(file, 1024)
      : await fileToBase64(file);
    
    console.log(`📦 Image size: ${(base64.length * 0.75 / 1024).toFixed(2)} KB`);
    
    const response = await fetch(`${API_BASE}/ai/pet-analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_base64: base64,
        locale,
        app_context: 'guau-mvp'
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData?.error?.message || 
        `Backend error: ${response.status} ${response.statusText}`
      );
    }
    
    const data: GuauVisionResponse = await response.json();
    
    // Check for error in response
    if (data.error) {
      throw new Error(data.error.message);
    }
    
    console.log('✅ Analysis received from backend');
    return data;
    
  } catch (error) {
    console.error('❌ Backend API error:', error);
    throw error;
  }
}

/**
 * Save routine to backend database
 * 
 * POST /save
 * Body: { email, payload }
 * Returns: { ok: true }
 */
export async function saveRoutineToBackend(
  email: string,
  payload: GuauVisionResponse
): Promise<{ ok: boolean }> {
  try {
    console.log('💾 Saving routine to backend...');
    
    const response = await fetch(`${API_BASE}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        payload,
        timestamp: new Date().toISOString()
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to save: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.ok !== true) {
      throw new Error('Save operation failed');
    }
    
    console.log('✅ Routine saved successfully');
    return data;
    
  } catch (error) {
    console.error('❌ Save error:', error);
    throw error;
  }
}

/**
 * Health check for backend
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
}

/**
 * Build WhatsApp share URL
 */
export function buildWhatsAppURL(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
