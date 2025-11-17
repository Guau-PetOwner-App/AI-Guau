import { useState, useEffect } from 'react';
import { HeroScreen } from './components/HeroScreen';
import { AnalysisScreen } from './components/AnalysisScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { ShareModal } from './components/ShareModal';
import { AuthModal } from './components/AuthModal';
import { ErrorScreen } from './components/ErrorScreen';
import { analyzePetImage } from './services/openai';
import { mapGuauVisionToPetAnalysis } from './services/petAnalysisMapper';
import { generateReportImage } from './services/reportGenerator';
import { savePetAnalysis, claimPendingAnalysis, hasPendingAnalysis, updateAnalysisEmail } from './services/petAnalysisService';
import { onAuthStateChange, getCurrentUser, getOrCreateProfile, signInWithOTP } from './lib/supabase';
import { buildRedirectUrl } from './config/app';
import { toast, Toaster } from 'sonner';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './components/LanguageSwitcher';
// Logo de Guau desde Supabase Storage
const logoOrange = 'https://oqoaxusesfcrmejftwmt.supabase.co/storage/v1/object/public/landing-images/guau-logo-coral.png';

type Screen = 'hero' | 'analysis' | 'results' | 'error';

export interface PetAnalysis {
  species: string; // "Perro" or "Gato"
  breeds: string[];
  age: string;
  energyLevel: string;
  colors: string[];
  personality: string;
  routine: {
    time: string;
    activity: string;
    iconName: string;
  }[];
  imageUrl: string;
  // Additional fields from Assistant
  whatsappMessage?: string;
  shareCardCopy?: string;
  disclaimers?: string[];
  confidence?: number;
  coatType?: string;
  facts?: string[]; // 5 facts about the pet
}

type AuthAction = 'save' | 'share' | 'download' | null;

export default function App() {
  const { t, i18n } = useTranslation();
  const [currentScreen, setCurrentScreen] = useState<Screen>('hero');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<PetAnalysis | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authAction, setAuthAction] = useState<AuthAction>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [analysisStatus, setAnalysisStatus] = useState<string>('');
  const [savedAnalysisId, setSavedAnalysisId] = useState<string | null>(null);
  const [hasEmailSaved, setHasEmailSaved] = useState<boolean>(false);

  // Update HTML lang attribute when language changes
  useEffect(() => {
    const lang = i18n.language || 'en';
    const htmlLang = lang.substring(0, 2); // 'en', 'es', 'fr'
    document.documentElement.lang = htmlLang;
  }, [i18n.language]);

  // Check auth state on mount and listen for changes
  useEffect(() => {
    console.log('🐾 Guau App conectado con OpenAI Assistant API + Supabase');
    console.log('📍 Assistant ID: asst_7bJDB6UcFWaQkvWSjPixb7NB');
    
    // Check current user
    getCurrentUser().then(user => {
      if (user) {
        console.log('✅ Usuario autenticado:', user.email);
        setIsAuthenticated(true);
        setCurrentUser(user);
        
        // Check if there's a pending analysis to claim (from localStorage only on mount)
        if (hasPendingAnalysis() && user.id && user.email) {
          claimPendingAnalysis(user.id, user.email).then(claimed => {
            if (claimed) {
              toast.success('¡Tu análisis anterior ha sido guardado en tu cuenta!');
            }
          }).catch(err => {
            console.warn('⚠️ No se pudo reclamar análisis pendiente:', err);
          });
        }

        // Get or create profile (optional - may fail if table not created)
        if (user.id && user.email) {
          getOrCreateProfile(user.id, user.email).catch(err => {
            console.warn('⚠️ No se pudo crear perfil:', err);
          });
        }
      }
    }).catch(err => {
      console.warn('⚠️ Error verificando usuario:', err);
    });

    // Listen to auth changes
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      console.log('Auth event:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session?.user) {
        setIsAuthenticated(true);
        setCurrentUser(session.user);
        
        // Get or create profile (optional - may fail if table not created)
        getOrCreateProfile(session.user.id, session.user.email).catch(err => {
          console.warn('⚠️ No se pudo crear perfil:', err);
        });

        // Note: Claim is handled by useEffect that watches isAuthenticated + savedAnalysisId
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Auto-claim current session analysis when user authenticates
  useEffect(() => {
    if (isAuthenticated && currentUser && savedAnalysisId) {
      console.log('🎯 User authenticated with saved analysis, attempting claim...');
      claimPendingAnalysis(currentUser.id, currentUser.email, savedAnalysisId)
        .then(claimed => {
          if (claimed) {
            console.log('✅ Current session analysis claimed successfully');
          }
        })
        .catch(err => {
          console.warn('⚠️ Error claiming current session analysis:', err);
        });
    }
  }, [isAuthenticated, currentUser, savedAnalysisId]);

  const handleImageUpload = async (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    setUploadedFile(file); // Store file for later upload to Supabase
    setCurrentScreen('analysis');
    setErrorMessage('');
    setAnalysisProgress(0);
    setAnalysisStatus('');

    try {
      // Mapear idioma de i18n a locale para OpenAI
      const lang = (i18n.language || 'en').substring(0, 2);
      const langToLocale: Record<string, string> = {
        en: 'en-US',
        es: 'es-ES',
        fr: 'fr-FR',
      };
      const locale = langToLocale[lang] ?? 'en-US';

      // Call OpenAI Vision API for real analysis with progress tracking
      const response = await analyzePetImage(file, locale, undefined, (progress, status) => {
        setAnalysisProgress(progress);
        setAnalysisStatus(status);
      });

      // Check for errors in response
      if (response.error) {
        setErrorMessage(response.error.message);
        setCurrentScreen('error');
        toast.error(response.error.message);
        return;
      }

      // Map response to our format
      const petAnalysis = mapGuauVisionToPetAnalysis(response, imageUrl);
      
      if (petAnalysis) {
        setAnalysis(petAnalysis);
        setCurrentScreen('results');
        toast.success('¡Análisis completado por IA!');

        // Auto-save analysis (with or without user)
        try {
          const email = isAuthenticated && currentUser?.email ? currentUser.email : undefined;
          const result = await savePetAnalysis(petAnalysis, file, email);
          
          if (result.success) {
            setSavedAnalysisId(result.id);
            console.log('✅ Análisis guardado en Supabase:', result.id);
            
            if (isAuthenticated) {
              toast.success('Guardado en tu cuenta', { duration: 3000 });
              setHasEmailSaved(true);
            } else {
              // For anonymous users, save ID for later claim
              console.log('💾 Análisis guardado anónimamente. ID guardado para claim:', result.id);
            }
          } else {
            console.warn('⚠️ No se pudo guardar análisis:', result.error);
          }
        } catch (saveError) {
          console.warn('⚠️ Guardado de análisis no disponible:', saveError);
        }
      } else {
        throw new Error('No se pudo procesar el análisis');
      }

    } catch (error) {
      console.error('Error analyzing image:', error);
      const errorMsg = error instanceof Error 
        ? error.message 
        : 'Error al analizar la imagen. Por favor, intenta de nuevo.';
      
      setErrorMessage(errorMsg);
      setCurrentScreen('error');
      toast.error(errorMsg);
    }
  };

  const handleReset = () => {
    setCurrentScreen('hero');
    setUploadedImage(null);
    setAnalysis(null);
    setShowShareModal(false);
    setShowAuthModal(false);
    setAuthAction(null);
    setSavedAnalysisId(null);
    setHasEmailSaved(false);
  };

  const handleAuthRequired = (action: AuthAction) => {
    // ONLY "save" and "download" require email
    // "share" opens ShareModal directly without email
    if (action === 'share') {
      console.log('📤 Share action - opening ShareModal directly (no email required)');
      handleShare();
      return;
    }
    
    // Check if email has already been saved (authenticated OR email saved for anonymous)
    if (isAuthenticated || hasEmailSaved) {
      // User is already authenticated or email saved, execute action directly
      executeAction(action);
    } else {
      // Show auth modal to get email
      setAuthAction(action);
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowAuthModal(false);
    setHasEmailSaved(true); // Email saved after auth
    
    // Execute the pending action after modal closes
    if (authAction) {
      const action = authAction;
      setAuthAction(null);
      
      // Small delay to ensure modal closes before opening next modal
      setTimeout(() => {
        executeAction(action);
      }, 150);
    } else {
      setAuthAction(null);
    }
  };

  const executeAction = (action: AuthAction) => {
    switch (action) {
      case 'save':
        handleSaveProfile();
        break;
      case 'share':
        handleShare();
        break;
      case 'download':
        handleDownload();
        break;
    }
  };

  const handleSaveProfile = () => {
    // Analysis is already saved in Supabase
    if (savedAnalysisId) {
      console.log('💾 Perfil ya guardado:', savedAnalysisId);
      
      if (isAuthenticated) {
        // User is authenticated - redirect to profile
        toast.success('¡Perfil guardado en tu cuenta!', {
          description: 'Abre get.guau.app para ver todos tus análisis',
          action: {
            label: 'Abrir',
            onClick: () => window.open('https://get.guau.app', '_blank')
          },
          duration: 5000,
        });
      } else {
        // Email was sent but not authenticated yet
        toast.success('✓ Email enviado', {
          description: 'Revisa tu correo y haz click en el magic link',
          action: {
            label: 'Abrir app',
            onClick: () => window.open('https://get.guau.app', '_blank')
          },
          duration: 6000,
        });
      }
    } else {
      toast.error('No se pudo guardar el perfil');
    }
  };

  const handleShare = () => {
    console.log('📤 Share button clicked');
    setShowShareModal(true);
  };

  const handleSaveEmailFromShare = async (email: string) => {
    if (!analysis || !uploadedFile) {
      throw new Error('No analysis or file available');
    }

    console.log('💾 Saving email from ShareModal:', email);
    
    try {
      // STEP 1: Update existing analysis with email OR save new one
      if (savedAnalysisId) {
        // Analysis already exists, just update email
        console.log('📧 Updating existing analysis with email:', savedAnalysisId);
        const updated = await updateAnalysisEmail(savedAnalysisId, email);
        if (!updated) {
          console.warn('⚠️ Could not update analysis email, but continuing...');
        }
      } else {
        // Analysis doesn't exist yet, save it
        console.log('💾 Saving new analysis with email');
        const result = await savePetAnalysis(analysis, uploadedFile, email);
        
        if (result.success) {
          setSavedAnalysisId(result.id);
          console.log('✅ Analysis saved:', result.id);
        } else {
          throw new Error(result.error || 'Error al guardar');
        }
      }

      // STEP 2: Send magic link
      console.log('📧 Sending magic link to:', email);
      const redirectUrl = buildRedirectUrl();
      await signInWithOTP(email, redirectUrl);
      
      // STEP 3: Update state
      setHasEmailSaved(true);
      console.log('✅ Magic link sent to:', email);
      
    } catch (error) {
      console.error('Error saving email from share:', error);
      throw error;
    }
  };

  const handleDownload = async () => {
    if (!analysis) return;
    
    try {
      console.log('📥 Generating download...');
      toast.loading(t('toast.download_generating'), { id: 'download' });
      
      await generateReportImage(analysis);
      
      toast.success(t('toast.report_downloaded'), { id: 'download' });
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error(t('toast.download_error'), { id: 'download' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#7BDCFF]/10 via-white to-[#FFBBA1]/10">
      {/* Toast Notifications */}
      <Toaster 
        position="top-center" 
        expand={false}
        richColors 
      />

      {/* Logo */}
      <div className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between">
        <img src={logoOrange} alt="Guau" className="h-8 md:h-10" />
        <LanguageSwitcher />
      </div>



      {currentScreen === 'hero' && <HeroScreen onImageUpload={handleImageUpload} />}
      {currentScreen === 'analysis' && (
        <AnalysisScreen 
          progress={analysisProgress} 
          statusMessage={analysisStatus}
        />
      )}
      {currentScreen === 'error' && <ErrorScreen message={errorMessage} onRetry={handleReset} />}
      {currentScreen === 'results' && analysis && (
        <ResultsScreen
          analysis={analysis}
          onSaveProfile={() => handleAuthRequired('save')}
          onShare={() => handleAuthRequired('share')}
          onDownload={() => handleAuthRequired('download')}
          onReset={handleReset}
        />
      )}

      {showShareModal && (
        <ShareModal
          onClose={() => setShowShareModal(false)}
          petData={analysis}
          hasEmailSaved={hasEmailSaved}
          onSaveEmail={handleSaveEmailFromShare}
        />
      )}

      {showAuthModal && authAction && (
        <AuthModal
          onClose={() => {
            setShowAuthModal(false);
            setAuthAction(null);
          }}
          onSuccess={handleAuthSuccess}
          actionType={authAction}
          analysisId={savedAnalysisId}
          onEmailSaved={() => setHasEmailSaved(true)}
        />
      )}

      {/* GDPR Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 text-center text-xs text-[#2D2F34]/60 bg-white/80 backdrop-blur-sm border-t border-[#2D2F34]/10">
        {t('common.footer_privacy')}
      </footer>
    </div>
  );
}
