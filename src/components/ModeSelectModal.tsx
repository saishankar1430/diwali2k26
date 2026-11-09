import React from 'react';
import { Footprints, Compass } from 'lucide-react';

interface ModeSelectModalProps {
  onSelectWalk: () => void;
  onSelectTour: () => void;
}

export const ModeSelectModal: React.FC<ModeSelectModalProps> = ({ onSelectWalk, onSelectTour }) => {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/40 pointer-events-auto">
      <div className="w-full max-w-sm rounded-2xl bg-[#201033]/95 border border-[#f59e0b]/40 p-6 sm:p-8 text-center text-[#fff8e7] shadow-2xl backdrop-blur-sm">
        <h3 className="text-xl sm:text-2xl font-bold font-['Playfair_Display'] text-[#fef3c7] mb-6">
          How do you want to see it?
        </h3>

        <div className="flex flex-col gap-3">
          <button
            onClick={onSelectWalk}
            className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-[#241203] font-semibold text-base flex items-center justify-center gap-2.5 shadow-md hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Footprints className="w-5 h-5" />
            <span>Walk around</span>
          </button>

          <button
            onClick={onSelectTour}
            className="w-full py-3.5 px-5 rounded-xl bg-[#2e1847] border border-[#f59e0b]/30 text-[#fde68a] font-semibold text-base flex items-center justify-center gap-2.5 hover:bg-[#3d1f5e] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Compass className="w-5 h-5 text-[#fbbf24]" />
            <span>Take the tour</span>
          </button>
        </div>

        <p className="mt-5 text-xs text-[#fde68a]/60 font-['Outfit']">
          WASD or Joystick to explore together
        </p>
      </div>
    </div>
  );
};
