import { useRef, useState } from 'react';
import { Camera, Upload, Sparkles, Zap, Brain, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface HeroScreenProps {
  onImageUpload: (file: File) => void;
}

export function HeroScreen({ onImageUpload }: HeroScreenProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Heading */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-[#2D2F34] tracking-tight">
            {t('hero.title')}{' '}
            <span className="inline-flex gap-1 items-center">
              <motion.span
                animate={{ 
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >
                <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-[#7BDCFF] fill-[#7BDCFF]" />
              </motion.span>
            </span>
          </h1>
          <p className="text-lg md:text-xl text-[#2D2F34]/70">
            {t('hero.subtitle')}
          </p>
        </div>

        {/* Upload Area */}
        <div
          className={`relative border-4 border-dashed rounded-3xl p-12 transition-all duration-300 ${
            isDragging
              ? 'border-[#FF7F50] bg-[#FF7F50]/5 scale-105'
              : 'border-[#53C6F0]/30 bg-white/50 hover:border-[#53C6F0] hover:bg-white/80'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-6">
            {/* Camera Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-[#7BDCFF] rounded-full blur-xl opacity-30 animate-pulse" />
                <div className="relative bg-gradient-to-br from-[#53C6F0] to-[#7BDCFF] p-6 rounded-full">
                  <Camera className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xl text-[#2D2F34]">
                {t('hero.upload_area')}
              </p>
              <p className="text-sm text-[#2D2F34]/60">
                {t('hero.upload_formats')}
              </p>
            </div>

            <Button
              size="lg"
              className="bg-[#FF7F50] hover:bg-[#E96F42] text-white px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="w-5 h-5 mr-2" />
              {t('hero.cta_button')}
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
          <motion.div 
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#53C6F0]/20 hover:border-[#53C6F0]/40 transition-all"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-[#53C6F0] to-[#7BDCFF] rounded-xl flex items-center justify-center mb-3 mx-auto">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <p className="text-[#2D2F34]">{t('hero.feature_1')}</p>
          </motion.div>
          <motion.div 
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#FF7F50]/20 hover:border-[#FF7F50]/40 transition-all"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF7F50] to-[#E96F42] rounded-xl flex items-center justify-center mb-3 mx-auto">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <p className="text-[#2D2F34]">{t('hero.feature_2')}</p>
          </motion.div>
          <motion.div 
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#91FF3A]/20 hover:border-[#91FF3A]/40 transition-all"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-[#91FF3A] to-[#7BDCFF] rounded-xl flex items-center justify-center mb-3 mx-auto">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <p className="text-[#2D2F34]">{t('hero.feature_3')}</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
