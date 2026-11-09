import React, { useEffect } from 'react';
import { Heart, Sparkles, RotateCcw, Footprints, Camera } from 'lucide-react';
import confetti from 'canvas-confetti';
import { COUPLE_PHOTOS } from '../data/photos';

interface GrandFinaleModalProps {
  onReplayFireworks: () => void;
  onExploreFreely: () => void;
  onOpenScrapbook: () => void;
}

export const GrandFinaleModal: React.FC<GrandFinaleModalProps> = ({
  onReplayFireworks,
  onExploreFreely,
  onOpenScrapbook,
}) => {
  useEffect(() => {
    // Launch celebratory gold and festive colored confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffd700', '#ff4081', '#ff9800', '#00e676', '#f50057'],
    });
  }, []);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 pointer-events-auto overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#2e1247] via-[#200a36] to-[#140624] border-2 border-[#f59e0b]/50 p-5 sm:p-8 text-center text-[#fff8e7] shadow-2xl relative my-auto">
        {/* Decorative Diya Header */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-[#fbbf24]" />
          <span className="text-xs uppercase tracking-widest text-[#f59e0b] font-semibold font-['Outfit']">
            Diwali Night Together
          </span>
          <Sparkles className="w-4 h-4 text-[#fbbf24]" />
        </div>

        {/* Floating Heart */}
        <div className="flex items-center justify-center my-2">
          <div className="p-3 rounded-full bg-[#f43f5e]/20 border border-[#f43f5e]/40 shadow-inner">
            <Heart className="w-8 h-8 text-[#f43f5e] fill-[#f43f5e] animate-pulse" />
          </div>
        </div>

        {/* Personalized Title */}
        <h2 className="text-2xl sm:text-3xl font-bold font-['Playfair_Display'] text-[#fef3c7] mb-2">
          Happy Diwali, Sushii ❤️
        </h2>

        {/* Personalized Message */}
        <p className="text-sm sm:text-base text-[#fed7aa] font-['Playfair_Display'] italic leading-relaxed mb-3">
          &ldquo;Every Diwali becomes more beautiful when I celebrate it with you.&rdquo;
        </p>

        {/* Horizontal Mini Photo Strip Preview */}
        <div className="my-4 p-2 bg-[#120520]/80 rounded-2xl border border-[#f59e0b]/25">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-[11px] font-['Outfit'] font-bold text-[#fbbf24] uppercase tracking-wider">
              Our {COUPLE_PHOTOS.length} Captured Memories
            </span>
            <button
              onClick={onOpenScrapbook}
              className="text-[11px] text-[#fde68a] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>View All</span>
              <Camera className="w-3 h-3 text-[#fbbf24]" />
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {COUPLE_PHOTOS.slice(0, 8).map((photo) => (
              <div
                key={photo.id}
                onClick={onOpenScrapbook}
                className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-[#f59e0b]/40 cursor-pointer hover:scale-105 transition-transform relative bg-[#1c0b2c] flex items-center justify-center"
                title={photo.title}
              >
                <img
                  src={photo.url}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-xs opacity-35 scale-110 pointer-events-none"
                />
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="relative z-10 w-full h-full object-contain p-0.5"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Signature */}
        <div className="text-sm font-semibold text-[#f59e0b] font-['Outfit'] mb-6">
          With love, Heeru.
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={onOpenScrapbook}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#d97706] to-[#b45309] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Camera className="w-4 h-4 text-[#fde68a]" />
            <span>Open Scrapbook ({COUPLE_PHOTOS.length})</span>
          </button>

          <button
            onClick={() => {
              confetti({
                particleCount: 60,
                spread: 80,
                origin: { y: 0.7 },
                colors: ['#ffd700', '#ff4081', '#ff9800'],
              });
              onReplayFireworks();
            }}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-[#241203] font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replay Fireworks</span>
          </button>

          <button
            onClick={onExploreFreely}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#2a1340] border border-[#f59e0b]/40 text-[#fde68a] font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 hover:bg-[#3b1a5a] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Footprints className="w-4 h-4" />
            <span>Explore Gali</span>
          </button>
        </div>
      </div>
    </div>
  );
};

