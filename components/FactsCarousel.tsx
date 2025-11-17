import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from './ui/carousel';
import { Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FactsCarouselProps {
  facts: string[];
}

// Gen Z gradients - cada fact tiene su propio gradiente vibrante
const factGradients = [
  { from: '#FF7F50', to: '#FF6B9D', emoji: '🐾' }, // Coral to Pink
  { from: '#53C6F0', to: '#4F46E5', emoji: '✨' }, // Blue to Indigo
  { from: '#91FF3A', to: '#10B981', emoji: '💚' }, // Lime to Green
  { from: '#F59E0B', to: '#EF4444', emoji: '🔥' }, // Amber to Red
  { from: '#8B5CF6', to: '#EC4899', emoji: '💜' }, // Violet to Pink
];

export function FactsCarousel({ facts }: FactsCarouselProps) {
  const { t } = useTranslation();
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrentIndex(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrentIndex(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#91FF3A] to-[#7BDCFF] rounded-2xl shadow-lg"
        >
          <Lightbulb className="w-6 h-6 md:w-7 md:h-7 text-white" />
        </motion.div>
        <h3 className="text-2xl md:text-3xl text-[#2D2F34] px-4">
          {t('facts.title')}
        </h3>
        <p className="text-sm md:text-base text-[#6B7280]">
          {t('facts.subtitle')}
        </p>
      </div>

      {/* Carousel */}
      <Carousel
        setApi={setApi}
        opts={{
          align: 'center',
          loop: true,
        }}
        className="w-full max-w-6xl mx-auto"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {facts.slice(0, 5).map((fact, index) => {
            const gradient = factGradients[index];
            return (
              <CarouselItem key={index} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="h-full"
                >
                  <div
                    className="relative h-[360px] md:h-[400px] rounded-3xl p-6 md:p-8 flex flex-col items-center justify-between text-center shadow-2xl overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
                    }}
                  >
                    {/* Decorative elements */}
                    <div className="absolute top-4 right-4 text-4xl md:text-6xl opacity-20">
                      {gradient.emoji}
                    </div>
                    <div className="absolute bottom-4 left-4 text-4xl md:text-6xl opacity-20 rotate-12">
                      {gradient.emoji}
                    </div>

                    {/* Number badge */}
                    <motion.div
                      initial={{ rotate: -180, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 + index * 0.1 }}
                      className="relative z-10 w-14 h-14 md:w-16 md:h-16 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg"
                    >
                      <span className="text-3xl md:text-4xl text-white drop-shadow-lg">
                        {index + 1}
                      </span>
                    </motion.div>

                    {/* Fact text */}
                    <div className="relative z-10 flex-1 flex items-center justify-center px-2 md:px-4">
                      <p className="text-white text-lg md:text-xl lg:text-2xl leading-relaxed drop-shadow-lg">
                        {fact}
                      </p>
                    </div>

                    {/* Bottom decoration */}
                    <div className="relative z-10 flex gap-2">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.4 + i * 0.1 }}
                          className="w-2 h-2 bg-white/50 rounded-full"
                        />
                      ))}
                    </div>

                    {/* Gradient overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                  </div>
                </motion.div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Navigation arrows - only on desktop */}
        <CarouselPrevious className="hidden lg:flex -left-12 bg-white/90 hover:bg-white" />
        <CarouselNext className="hidden lg:flex -right-12 bg-white/90 hover:bg-white" />
      </Carousel>

      {/* Dots indicator */}
      <div className="flex items-center justify-center gap-1.5 md:gap-2 mt-4">
        {facts.slice(0, 5).map((_, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <div
              className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-6 md:w-8 bg-gradient-to-r from-[#91FF3A] to-[#7BDCFF]'
                  : 'w-1.5 md:w-2 bg-gray-300'
              }`}
            />
          </motion.div>
        ))}
      </div>

      {/* Swipe hint for mobile */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="lg:hidden text-center text-xs md:text-sm text-[#6B7280] mt-2"
      >
        {t('facts.swipe_hint')}
      </motion.div>
    </div>
  );
}
