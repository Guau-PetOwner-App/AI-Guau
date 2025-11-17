import { useState } from 'react';
import { X, Copy, Check, MessageCircle, Send, Mail, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { PetAnalysis } from '../App';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface ShareModalProps {
  onClose: () => void;
  petData: PetAnalysis | null;
  hasEmailSaved: boolean;
  onSaveEmail: (email: string) => Promise<void>;
}

export function ShareModal({ onClose, petData, hasEmailSaved, onSaveEmail }: ShareModalProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Generate share message
  const getShareMessage = () => {
    if (petData?.whatsappMessage) {
      // Use the AI-generated personalized message from the Assistant
      console.log('📱 Using AI-generated WhatsApp message from Assistant');
      return petData.whatsappMessage;
    } else {
      // Fallback: construct message manually
      console.log('📱 Using fallback WhatsApp message (Assistant message not available)');
      return (
        `🐾 ¡Mira la rutina personalizada de mi mascota creada con Guau App!\n\n` +
        `Raza: ${petData?.breeds.join(' + ')}\n` +
        `Edad: ${petData?.age}\n` +
        `Energía: ${petData?.energyLevel}\n\n` +
        `📅 Rutina diaria:\n` +
        `${petData?.routine.map(r => `⏰ ${r.time} - ${r.activity}`).join('\n')}\n\n` +
        `Descubre la rutina de tu mascota en segundos: guauapp.com`
      );
    }
  };

  const shareMessage = getShareMessage();

  const handleSave = async () => {
    if (!email) {
      toast.error(t('share.error_email_required'));
      return;
    }

    setIsSaving(true);
    try {
      await onSaveEmail(email);
      toast.success(t('share.email_saved'));
      setEmail('');
    } catch (error) {
      console.error('Error saving email:', error);
      toast.error('Error al guardar. Intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = async () => {
    let copySuccess = false;

    // Try modern Clipboard API first (with permission handling)
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareMessage);
        copySuccess = true;
      }
    } catch (clipboardError) {
      console.warn('Clipboard API failed, using fallback:', clipboardError);
      // Fall through to textarea fallback
    }

    // Fallback to textarea method if Clipboard API failed or not available
    if (!copySuccess) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = shareMessage;
        
        // Make it invisible but still accessible
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        textArea.style.opacity = '0';
        textArea.setAttribute('readonly', '');
        
        document.body.appendChild(textArea);
        
        // Select the text
        if (navigator.userAgent.match(/ipad|iphone/i)) {
          // iOS specific selection
          const range = document.createRange();
          range.selectNodeContents(textArea);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
          textArea.setSelectionRange(0, 999999);
        } else {
          textArea.select();
        }
        
        // Copy using execCommand
        copySuccess = document.execCommand('copy');
        
        // Clean up
        document.body.removeChild(textArea);
        
        if (!copySuccess) {
          throw new Error('execCommand failed');
        }
      } catch (fallbackError) {
        console.error('Fallback copy also failed:', fallbackError);
        toast.error('No se pudo copiar automáticamente. Selecciona el texto manualmente.');
        return;
      }
    }
    
    // Success!
    setCopied(true);
    toast.success(t('share.copied'));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(shareMessage);
    window.open(`https://wa.me/?text=${message}`, '_blank');
    toast.success(t('share.whatsapp_button'));
  };

  const handleTelegram = () => {
    const message = encodeURIComponent(shareMessage);
    window.open(`https://t.me/share/url?text=${message}`, '_blank');
    toast.success('Abriendo Telegram...');
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
          className="relative w-full max-w-md z-10"
        >
          <Card className="p-6 bg-white shadow-2xl border-none">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[#2D2F34]/60 hover:text-[#2D2F34] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center space-y-3 mb-6">
              <h3 className="text-2xl text-[#2D2F34]">
                {t('share.title')}
              </h3>
              <p className="text-sm text-[#2D2F34]/70">
                {t('share.title')}
              </p>
            </div>

            {/* Save Email Section (only if email not saved) */}
            {!hasEmailSaved && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div className="bg-gradient-to-br from-[#91FF3A]/10 to-[#7BDCFF]/10 rounded-xl p-4 border border-[#91FF3A]/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Save className="w-5 h-5 text-[#2D2F34]" />
                    <h4 className="text-[#2D2F34]">
                      {t('share.email_label')}
                    </h4>
                  </div>
                  <p className="text-xs text-[#2D2F34]/70 mb-3">
                    {t('share.email_label')}
                  </p>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2D2F34]/40" />
                      <Input
                        type="email"
                        placeholder={t('share.email_placeholder')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9 rounded-lg border-[#91FF3A]/30 focus:border-[#91FF3A]"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSave();
                          }
                        }}
                      />
                    </div>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving || !email}
                      className="bg-[#91FF3A] hover:bg-[#7DE82F] text-[#2D2F34] px-6 rounded-lg"
                    >
                      {isSaving ? t('toast.download_generating') : t('share.save_email_button')}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Message Preview */}
            <div className="mb-6">
              <div className="bg-gradient-to-br from-[#7BDCFF]/10 to-[#FFBBA1]/10 rounded-xl p-4 border border-[#53C6F0]/20">
                <p className="text-xs text-[#2D2F34]/60 mb-2">Mensaje que se compartirá:</p>
                <div className="bg-white rounded-lg p-3 max-h-48 overflow-y-auto">
                  <p className="text-sm text-[#2D2F34] whitespace-pre-wrap">
                    {shareMessage}
                  </p>
                </div>
              </div>
            </div>

            {/* Share Actions */}
            <div className="space-y-3">
              {/* WhatsApp */}
              <Button
                onClick={handleWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                {t('share.whatsapp_button')}
              </Button>

              {/* Telegram */}
              <Button
                onClick={handleTelegram}
                className="w-full bg-[#0088cc] hover:bg-[#006FA1] text-white py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Send className="w-5 h-5 mr-2" />
                Compartir por Telegram
              </Button>

              {/* Copy */}
              <Button
                onClick={handleCopy}
                variant="outline"
                className="w-full border-2 border-[#53C6F0] text-[#53C6F0] hover:bg-[#53C6F0]/10 py-6 rounded-xl transition-all duration-300"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    {t('share.copied')}
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 mr-2" />
                    {t('share.copy_button')}
                  </>
                )}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
