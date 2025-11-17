import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Progress } from './ui/progress';
import { Sparkles, Heart, Dna, Zap, Calendar, Lightbulb } from 'lucide-react';
import { getNextRandomFact, resetFactsQueue, type PetFact } from '../petFacts';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

interface AnalysisScreenProps {
  progress?: number;
  statusMessage?: string;
}

export function AnalysisScreen({ progress = 0, statusMessage }: AnalysisScreenProps) {
  const { t } = useTranslation();
  const [currentMessage, setCurrentMessage] = useState(0);
  const [currentFact, setCurrentFact] = useState<PetFact>(getNextRandomFact());

  const loadingMessages = [
    { text: t('analysis.status_1'), icon: Sparkles },
    { text: t('analysis.status_2'), icon: Dna },
    { text: t('analysis.status_3'), icon: Heart },
    { text: t('analysis.status_4'), icon: Zap },
    { text: t('analysis.status_5'), icon: Sparkles },
    { text: t('analysis.status_6'), icon: Calendar }
  ];

  useEffect(() => {
    // Only cycle through fun messages if no status message provided
    if (!statusMessage) {
      const messageInterval = setInterval(() => {
        setCurrentMessage((prev) => (prev + 1) % loadingMessages.length);
      }, 500);

      return () => {
        clearInterval(messageInterval);
      };
    }
  }, [statusMessage, loadingMessages.length]);

  // Reset facts when language changes
  useEffect(() => {
    resetFactsQueue();
    setCurrentFact(getNextRandomFact());
  }, [i18n.language]);

  // Rotate facts every 6 seconds (más tiempo para leer)
  useEffect(() => {
    const factInterval = setInterval(() => {
      setCurrentFact(getNextRandomFact(currentFact.text));
    }, 6000);

    return () => {
      clearInterval(factInterval);
    };
  }, [currentFact]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Animated Circle */}
        <div className="flex justify-center">
          <motion.div
            className="relative w-32 h-32"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#53C6F0] via-[#FF7F50] to-[#91FF3A] opacity-20 blur-xl" />
            <div className="absolute inset-2 rounded-full bg-white border-4 border-white shadow-xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {(() => {
                  const CurrentIcon = loadingMessages[currentMessage].icon;
                  return <CurrentIcon className="w-12 h-12 text-[#FF7F50]" strokeWidth={2.5} />;
                })()}
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Loading Message */}
        <motion.div
          key={statusMessage || currentMessage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-center space-y-2"
        >
          <p className="text-2xl text-[#2D2F34]">
            {statusMessage || loadingMessages[currentMessage].text}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-3" />
          <p className="text-center text-sm text-[#2D2F34]/60">{Math.round(progress)}%</p>
        </div>

        {/* Fun Facts - Rotating */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#7BDCFF]/30 flex items-start gap-3 min-h-[100px]"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-[#91FF3A] to-[#7BDCFF] rounded-lg flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentFact.text}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-sm text-[#2D2F34]/70 text-left"
              >
                <span className="font-semibold">{t('analysis.did_you_know')}</span>{' '}
                {currentFact.emoji && <span>{currentFact.emoji} </span>}
                {currentFact.text}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
