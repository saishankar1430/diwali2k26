import React from 'react';
import { Sparkles, Volume2, VolumeX } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface TitleScreenProps {
  onStart: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, isMuted, onToggleMute }) => {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-10 bg-gradient-to-b from-[#12081f] via-[#1a0c2e] to-[#0d0517] text-[#fff8e7] overflow-hidden select-none">
      {/* Background ambient glowing particles */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff9800] rounded-full blur-[140px] opacity-25" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#e91e63] rounded-full blur-[130px] opacity-20" />
      </div>

      {/* Top Header Row */}
      <div className="w-full flex items-center justify-between max-w-4xl z-10">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2a1640]/80 border border-[#f59e0b]/30 shadow-sm">
          <Sparkles className="w-4 h-4 text-[#fbbf24]" />
          <span className="text-xs sm:text-sm font-medium tracking-wide text-[#fde68a]">
            A Diwali gali, just for us
          </span>
        </div>

        <button
          onClick={onToggleMute}
          className="p-2.5 rounded-full bg-[#2a1640]/80 border border-[#f59e0b]/30 text-[#fde68a] hover:bg-[#3b1f5c] transition-colors focus:outline-none"
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Center Hero Diya Graphic & Romantic Message */}
      <div className="flex flex-col items-center text-center max-w-xl z-10 my-auto py-8">
        {/* Animated 2D Diya Illustration matching the reference video */}
        <div className="relative mb-6">
          <div className="absolute -inset-4 bg-[#f59e0b] rounded-full blur-2xl opacity-40 animate-pulse" />
          <svg className="w-28 h-28 sm:w-36 sm:h-36 relative" viewBox="0 0 160 160" fill="none">
            {/* Clay Diya Bowl */}
            <path
              d="M20 90C20 120 50 135 80 135C110 135 140 120 140 90C140 85 130 82 80 82C30 82 20 85 20 90Z"
              fill="url(#diyaBowl)"
            />
            {/* Ornate Gold Trim */}
            <path
              d="M24 90C36 112 56 122 80 122C104 122 124 112 136 90"
              stroke="#fbbf24"
              strokeWidth="3.5"
              strokeDasharray="2 6"
            />
            {/* Base Pedestal */}
            <path d="M60 135L55 145H105L100 135H60Z" fill="#a04000" />
            {/* Glowing Flame */}
            <path
              d="M80 32C72 48 64 62 64 74C64 88 71 96 80 96C89 96 96 88 96 74C96 62 88 48 80 32Z"
              fill="url(#flameOuter)"
            />
            <path
              d="M80 50C76 60 72 70 72 78C72 87 76 92 80 92C84 92 88 87 88 78C88 70 84 60 80 50Z"
              fill="#fffbeb"
            />
            {/* Gradients */}
            <defs>
              <linearGradient id="diyaBowl" x1="20" y1="82" x2="140" y2="135" gradientUnits="userSpaceOnUse">
                <stop stopColor="#b45309" />
                <stop offset="0.5" stopColor="#d97706" />
                <stop offset="1" stopColor="#92400e" />
              </linearGradient>
              <linearGradient id="flameOuter" x1="80" y1="32" x2="80" y2="96" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fef08a" />
                <stop offset="0.3" stopColor="#f59e0b" />
                <stop offset="0.8" stopColor="#ea580c" />
                <stop offset="1" stopColor="#dc2626" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#fff7ed] font-['Playfair_Display'] leading-tight mb-3 drop-shadow-md">
          Heeru, come light up Diwali with me
        </h1>

        {/* Couple Polaroid Preview Badge */}
        <div className="relative mb-5 flex items-center justify-center">
          <div className="p-1.5 bg-[#fef3c7] rounded-xl shadow-xl shadow-black/50 rotate-[-2deg] hover:rotate-0 transition-transform duration-300 border border-[#f59e0b]/40">
            <img
              src="/assets/aistudio/file_0000000081d882078ae16a2e9c29c523.png"
              alt="Heeru and Sushii"
              className="w-24 h-24 sm:w-28 sm:h-28 object-cover object-top rounded-lg"
            />
            <div className="mt-1 text-center font-['Caveat'] text-[#78350f] text-xs font-bold">
              Heeru ❤️ Sushii
            </div>
          </div>
        </div>

        {/* Subtitle from the video */}
        <p className="text-sm sm:text-base text-[#fde68a]/90 font-['Outfit'] font-normal max-w-md leading-relaxed mb-8">
          A sleepy little lane waiting in the dark. Light the first diya and watch our whole town glow, one memory at a time.
        </p>

        {/* Start Button */}
        <button
          onClick={() => {
            soundEngine.startAmbientMusic();
            onStart();
          }}
          className="group relative inline-flex items-center gap-3 px-8 py-3.5 sm:px-10 sm:py-4 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-[#2a1303] font-semibold text-base sm:text-lg shadow-lg shadow-[#d97706]/30 hover:shadow-xl hover:shadow-[#f59e0b]/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
        >
          <span>Step into the gali</span>
          <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>

      {/* Footer Branding Badge */}
      <div className="z-10 text-xs text-[#fef3c7]/60 font-['Outfit'] tracking-wider flex items-center gap-1.5">
        <span>Heeru</span>
        <span className="text-[#f43f5e]">❤️</span>
        <span>Sushii – Diwali 2026</span>
      </div>
    </div>
  );
};
