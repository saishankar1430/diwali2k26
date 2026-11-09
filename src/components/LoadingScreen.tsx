import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-gradient-to-b from-[#180b29] via-[#220f38] to-[#12061e] text-[#fef3c7] select-none">
      {/* Central Flame / Lantern Glow */}
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full bg-[#f59e0b] blur-xl opacity-60 animate-ping" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-12 bg-gradient-to-t from-[#ea580c] via-[#f59e0b] to-[#fef08a] rounded-full blur-[1px] animate-pulse" />
        </div>
      </div>

      <h2 className="text-3xl sm:text-4xl text-[#fed7aa] font-['Caveat'] tracking-wider italic animate-pulse">
        Building your world...
      </h2>

      <p className="mt-3 text-xs sm:text-sm text-[#fde68a]/70 font-['Outfit']">
        Lighting up the lanterns and preparing the gali
      </p>
    </div>
  );
};
