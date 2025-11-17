import { useState } from 'react';
import { X, Mail, Sparkles, CheckCircle2, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { toast } from 'sonner';
import { signInWithOTP } from '../lib/supabase';
import { buildRedirectUrl } from '../config/app';
import { updateAnalysisEmail } from '../services/petAnalysisService';
import { useTranslation } from 'react-i18next';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
  actionType: 'save' | 'share' | 'download';
  analysisId?: string | null; // ID of the analysis to update with email
  onEmailSaved?: () => void; // Callback when email is saved to analysis
}

export function AuthModal({ onClose, onSuccess, actionType, analysisId, onEmailSaved }: AuthModalProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const actionTitles = {
    save: t('auth.save_title'),
    share: t('auth.share_title'),
    download: t('auth.download_title')
  };

  const actionDescriptions = {
    save: t('auth.save_description'),
    share: t('auth.share_description'),
    download: t('auth.download_description')
  };

  const actionButtons = {
    save: t('auth.save_button'),
    share: t('auth.share_button'),
    download: t('auth.download_button')
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error(t('auth.error_email_required'));
      return;
    }

    setIsSubmitting(true);

    try {
      // 🎯 STEP 1: Update analysis with email BEFORE sending magic link
      // This ensures the email is saved in DB immediately
      console.log('🔍 AuthModal - analysisId received:', analysisId);
      
      if (analysisId) {
        console.log('📧 Updating analysis with email before auth:', {
          analysisId,
          email,
        });
        
        const emailUpdated = await updateAnalysisEmail(analysisId, email);
        
        if (emailUpdated) {
          console.log('✅ Email saved to analysis! Ready for claim after login.');
          toast.success('Email guardado correctamente', { duration: 2000 });
          
          // Notify parent that email was saved
          if (onEmailSaved) {
            onEmailSaved();
          }
        } else {
          console.warn('⚠️ Could not update analysis email, continuing anyway...');
          console.warn('');
          console.warn('🚨 ACCIÓN REQUERIDA:');
          console.warn('   Ejecuta el SQL fix en Supabase Dashboard');
          console.warn('   Archivo: /FIX_URGENTE_EJECUTAR_YA.sql');
          console.warn('   O lee: /INSTRUCCIONES_VISUALES.md');
          console.warn('');
          // Don't show error toast to user, just continue with auth
        }
      } else {
        console.warn('⚠️ No analysisId provided to AuthModal, skipping email update');
      }

      // 🎯 STEP 2: Send magic link for ALL actions
      const redirectUrl = buildRedirectUrl();
      console.log('🔗 Sending magic link with redirect to:', redirectUrl);
      
      await signInWithOTP(email, redirectUrl);
      
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Store email for reference
      localStorage.setItem('auth_email_sent', email);
      
      if (actionType === 'save') {
        toast.success(t('auth.success_title'));
        // Magic link will redirect user to https://get.guau.app
      } else {
        // For "share" and "download", show success and execute action
        toast.success(t('toast.profile_saved'));
        
        console.log(`✅ Email saved & magic link sent, executing ${actionType} action`);
        
        // Close modal and execute the pending action
        onSuccess();
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error('Auth error:', error);
      toast.error('Error al enviar el correo. Intenta de nuevo.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative w-full max-w-md"
        >
          <Card className="p-8 bg-white shadow-2xl border-none">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[#2D2F34]/60 hover:text-[#2D2F34] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSuccess ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center space-y-3">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#FF7F50] to-[#FFBBA1] rounded-2xl flex items-center justify-center shadow-lg">
                      {actionType === 'share' ? (
                        <Heart className="w-8 h-8 text-white fill-white" />
                      ) : (
                        <Sparkles className="w-8 h-8 text-white" />
                      )}
                    </div>
                  </div>
                  <h3 className="text-2xl text-[#2D2F34]">
                    {actionTitles[actionType]}
                  </h3>
                  <p className="text-[#2D2F34]/70 text-sm">
                    {actionDescriptions[actionType]}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#2D2F34]">
                      {t('auth.email_label')}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2D2F34]/40" />
                      <Input
                        id="email"
                        type="email"
                        placeholder={t('auth.email_placeholder')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 py-6 rounded-xl border-[#53C6F0]/30 focus:border-[#53C6F0]"
                        required
                        autoFocus
                      />
                    </div>
                    {actionType === 'save' && (
                      <p className="text-xs text-[#2D2F34]/60">
                        {t('auth.save_description')} 🪄
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#FF7F50] hover:bg-[#E96F42] text-white py-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {actionType === 'download' && t('toast.download_generating')}
                        {actionType === 'share' && t('toast.download_generating')}
                        {actionType === 'save' && t('toast.download_generating')}
                      </div>
                    ) : (
                      actionButtons[actionType]
                    )}
                  </Button>
                </form>

                {/* Privacy Note */}
                <p className="text-xs text-center text-[#2D2F34]/60">
                  {t('auth.privacy_note')}
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4 py-8"
              >
                <div className="flex justify-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 10 }}
                    className="w-20 h-20 bg-gradient-to-br from-[#91FF3A] to-[#7BDCFF] rounded-2xl flex items-center justify-center shadow-xl"
                  >
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </motion.div>
                </div>
                <h3 className="text-2xl text-[#2D2F34]">
                  {t('auth.success_title')}
                </h3>
                <p className="text-[#2D2F34]/70">
                  {t('auth.success_message')} <strong>{email}</strong>
                </p>
                <p className="text-sm text-[#2D2F34]/60">
                  {t('toast.check_email')} 🐾
                </p>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="mt-4"
                >
                  {t('error.retry_button')}
                </Button>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
