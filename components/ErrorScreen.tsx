import { motion } from 'framer-motion';
import { AlertCircle, RotateCcw, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useTranslation } from 'react-i18next';

interface ErrorScreenProps {
  message: string;
  onRetry: () => void;
}

export function ErrorScreen({ message, onRetry }: ErrorScreenProps) {
  const { t } = useTranslation();
  // Determine error type and provide helpful suggestions
  const isNoPetError = message.toLowerCase().includes('no pet') || 
                       message.toLowerCase().includes('no se detectó');
  const isApiKeyError = message.toLowerCase().includes('api key') ||
                        message.toLowerCase().includes('configurada');
  
  const getSuggestions = () => {
    if (isApiKeyError) {
      return [
        'La app está intentando usar OpenAI API sin una clave válida',
        'Solución rápida: Activa el Modo Demo en /services/openai.ts',
        'Cambia: export const USE_MOCK_MODE = true',
        'O configura una API key válida de OpenAI'
      ];
    }
    if (isNoPetError) {
      return [
        t('error.suggestion_1'),
        t('error.suggestion_2'),
        t('error.suggestion_3'),
        t('error.suggestion_4')
      ];
    }
    return [
      t('error.suggestion_5'),
      t('error.suggestion_6'),
      t('error.suggestion_7')
    ];
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-lg w-full space-y-6"
      >
        {/* Error Icon */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="w-20 h-20 bg-gradient-to-br from-[#FF7F50] to-[#E96F42] rounded-full flex items-center justify-center shadow-xl"
          >
            <AlertCircle className="w-10 h-10 text-white" />
          </motion.div>
        </div>

        {/* Error Message */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl text-[#2D2F34]">
            {t('error.title')}
          </h2>
          <p className="text-lg text-[#2D2F34]/70">
            {message}
          </p>
        </div>

        {/* Suggestions Card */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-[#53C6F0]/30">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#53C6F0] to-[#7BDCFF] rounded-lg flex items-center justify-center">
                <Camera className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg text-[#2D2F34]">
                {t('error.suggestions_title')}
              </h3>
            </div>
            <ul className="space-y-2">
              {getSuggestions().map((suggestion, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-start gap-2 text-[#2D2F34]/80"
                >
                  <span className="text-[#91FF3A] mt-1">•</span>
                  <span>{suggestion}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </Card>

        {/* Retry Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            className="bg-[#FF7F50] hover:bg-[#E96F42] text-white px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            onClick={onRetry}
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            {t('error.retry_button')}
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-[#2D2F34]/60">
          {t('error.help_text')}
        </p>
      </motion.div>
    </div>
  );
}
