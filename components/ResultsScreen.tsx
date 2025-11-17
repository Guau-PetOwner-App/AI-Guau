import { motion } from 'framer-motion';
import { Share2, Download, Save, Heart, Sparkles, CheckCircle2, Calendar, Cat, Footprints, Brain, Home, Coffee, Gamepad2, Activity, type LucideIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { PetAnalysis } from '../App';
import { FactsCarousel } from './FactsCarousel';
import { useTranslation } from 'react-i18next';

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  footprints: Footprints,
  brain: Brain,
  home: Home,
  coffee: Coffee,
  gamepad2: Gamepad2,
  activity: Activity,
};

interface ResultsScreenProps {
  analysis: PetAnalysis;
  onSaveProfile: () => void;
  onShare: () => void;
  onDownload: () => void;
  onReset: () => void;
}

export function ResultsScreen({ analysis, onSaveProfile, onShare, onDownload, onReset }: ResultsScreenProps) {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full space-y-8"
      >
        {/* Success Header */}
        <div className="text-center space-y-3">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-[#91FF3A] to-[#7BDCFF] rounded-full flex items-center justify-center shadow-xl">
              <Sparkles className="w-10 h-10 text-white fill-white" />
            </div>
          </motion.div>
          <h2 className="text-3xl md:text-4xl text-[#2D2F34]">
            {t('results.title')}
          </h2>
          <p className="text-lg text-[#2D2F34]/70 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#91FF3A]" />
            {t('toast.analysis_complete')}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Image and Basic Info */}
          <div className="space-y-6">
            {/* Pet Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={analysis.imageUrl}
                alt="Pet"
                className="w-full aspect-square object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-[#91FF3A] text-[#2D2F34] hover:bg-[#91FF3A]">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {t('toast.analysis_complete')}
                </Badge>
              </div>
            </div>

            {/* Basic Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-white/80 backdrop-blur-sm border-[#91FF3A]/30">
                <p className="text-sm text-[#2D2F34]/60 mb-1">{t('results.species')}</p>
                <p className="text-xl text-[#2D2F34]">{analysis.species}</p>
              </Card>
              <Card className="p-4 bg-white/80 backdrop-blur-sm border-[#53C6F0]/30">
                <p className="text-sm text-[#2D2F34]/60 mb-1">{t('results.age')}</p>
                <p className="text-xl text-[#2D2F34]">{analysis.age}</p>
              </Card>
            </div>

            {/* Energy Level Card - Full Width */}
            <Card className="p-4 bg-white/80 backdrop-blur-sm border-[#FF7F50]/30">
              <p className="text-sm text-[#2D2F34]/60 mb-1">{t('results.energy')}</p>
              <p className="text-xl text-[#2D2F34]">{analysis.energyLevel}</p>
            </Card>

            {/* Breeds */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-[#7BDCFF]/30">
              <p className="text-sm text-[#2D2F34]/60 mb-3">{t('results.breeds')}</p>
              <div className="flex flex-wrap gap-2">
                {analysis.breeds.map((breed, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-base bg-[#7BDCFF]/20 text-[#2D2F34] hover:bg-[#7BDCFF]/30"
                  >
                    {breed}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Colors */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-[#FFBBA1]/30">
              <p className="text-sm text-[#2D2F34]/60 mb-3">{t('results.colors')}</p>
              <div className="flex flex-wrap gap-2">
                {analysis.colors.map((color, index) => (
                  <Badge key={index} variant="outline" className="text-[#2D2F34]">
                    {color}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Personality and Routine */}
          <div className="space-y-6">
            {/* Personality */}
            <Card className="p-6 bg-gradient-to-br from-[#FF7F50]/10 to-[#FFBBA1]/10 border-[#FF7F50]/30">
              <div className="flex items-start gap-3 mb-3">
                <Heart className="w-6 h-6 text-[#FF7F50] flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-[#2D2F34]/60 mb-2">{t('results.personality')}</p>
                  <p className="text-lg text-[#2D2F34]">{analysis.personality}</p>
                </div>
              </div>
            </Card>

            {/* Routine */}
            <Card className="p-6 bg-gradient-to-br from-[#53C6F0]/10 to-[#7BDCFF]/10 border-[#53C6F0]/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#53C6F0] to-[#7BDCFF] rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl text-[#2D2F34]">
                  {t('results.routine')}
                </h3>
              </div>
              <div className="space-y-4">
                {analysis.routine.map((item, index) => {
                  const IconComponent = iconMap[item.iconName] || Activity;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 bg-white/60 rounded-xl hover:bg-white/80 transition-colors"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-[#FF7F50] to-[#FFBBA1] rounded-xl flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-[#2D2F34]/60">{item.time}</p>
                        <p className="text-lg text-[#2D2F34]">{item.activity}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>

            {/* CTA Message */}
            <Card className="p-6 bg-gradient-to-r from-[#91FF3A]/20 to-[#7BDCFF]/20 border-[#91FF3A]/40">
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#91FF3A] to-[#7BDCFF] rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-[#2D2F34]">
                    <span className="font-semibold">{t('results.routine_ready')}</span>
                    <br />
                    <span className="text-sm">
                      {t('results.routine_cta')}
                    </span>
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Facts - 5 things your pet wants to tell you - FLASHCARD CAROUSEL */}
        {analysis.facts && analysis.facts.length > 0 && (
          <div className="mt-8">
            <FactsCarousel facts={analysis.facts} />
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* Primary Actions - Require Auth */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-[#FF7F50] hover:bg-[#E96F42] text-white px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={onSaveProfile}
            >
              <Save className="w-5 h-5 mr-2" />
              {t('results.save_button')}
            </Button>
            <Button
              size="lg"
              className="bg-[#53C6F0] hover:bg-[#4AB5DF] text-white px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={onShare}
            >
              <Share2 className="w-5 h-5 mr-2" />
              {t('results.share_button')}
            </Button>
            <Button
              size="lg"
              className="bg-[#91FF3A] hover:bg-[#7FE62F] text-[#2D2F34] px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={onDownload}
            >
              <Download className="w-5 h-5 mr-2" />
              {t('results.download_button')}
            </Button>
          </div>

          {/* Secondary Action */}
          <div className="flex justify-center">
            <Button
              size="lg"
              variant="outline"
              className="border-[#2D2F34]/20 text-[#2D2F34] hover:bg-[#2D2F34]/5 px-8 py-6 rounded-full text-lg transition-all duration-300"
              onClick={onReset}
            >
              <Cat className="w-5 h-5 mr-2" />
              {t('results.new_analysis')}
            </Button>
          </div>
        </div>

        {/* Disclaimers */}
        {analysis.disclaimers && analysis.disclaimers.length > 0 && (
          <Card className="p-4 bg-white/60 backdrop-blur-sm border-[#2D2F34]/10">
            <p className="text-xs text-center text-[#2D2F34]/60">
              ⚠️ {analysis.disclaimers.join(' ')}
            </p>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
