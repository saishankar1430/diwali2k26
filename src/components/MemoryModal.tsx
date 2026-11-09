import React, { useState } from 'react';
import { Heart, Sparkles, X, Maximize2 } from 'lucide-react';
import { MemoryItem } from '../types/game';

interface MemoryModalProps {
  memory: MemoryItem;
  onClose: () => void;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({ memory, onClose }) => {
  const [isPhotoZoomed, setIsPhotoZoomed] = useState(false);

  return (
    <>
      <aside
        className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
        aria-label="Story Memory Card"
      >
        {/* Compact corner story card: lower-right on desktop (300-320px width), bottom center on mobile */}
        <div className="absolute right-4 sm:right-6 bottom-20 sm:bottom-24 max-sm:inset-x-4 max-sm:bottom-20 max-sm:right-auto max-sm:left-4 pointer-events-auto w-full max-w-[320px] rounded-2xl bg-[#190a2a]/95 border border-[#f59e0b]/40 p-4 shadow-2xl backdrop-blur-md text-[#fff8e7] animate-fade-in transition-all">
          {/* Top Header Row with tag and close button */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#f59e0b] fill-[#f59e0b]" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#f59e0b] font-['Outfit']">
                {memory.title}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-[#fed7aa]/60 hover:text-[#fff8e7] hover:bg-[#2c1543] transition-colors cursor-pointer"
              title="Close"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Real Couple Polaroid Photo if available */}
          {memory.photoUrl && (
            <div className="relative mb-3 group">
              <div
                onClick={() => setIsPhotoZoomed(true)}
                className="relative rounded-xl overflow-hidden border border-[#f59e0b]/40 shadow-lg cursor-zoom-in bg-[#130722] min-h-[148px] max-h-44 w-full flex items-center justify-center"
              >
                {/* Soft ambient blur backdrop so any aspect ratio fills elegantly */}
                <img
                  src={memory.photoUrl}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-md opacity-35 scale-110 pointer-events-none"
                />
                {/* Fully visible picture preserving natural aspect ratio so faces and details are never cut off */}
                <img
                  src={memory.photoUrl}
                  alt={memory.title}
                  className="relative z-10 max-h-44 w-full object-contain p-1 group-hover:scale-[1.02] transition-transform duration-300"
                />
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2 pointer-events-none">
                  <span className="text-[10px] font-['Outfit'] text-[#fef3c7] font-medium truncate">
                    Tap to enlarge
                  </span>
                  <Maximize2 className="w-3.5 h-3.5 text-[#fbbf24]" />
                </div>
              </div>
              {memory.photoCaption && (
                <p className="mt-1 text-[11px] font-['Outfit'] text-[#fde68a]/85 italic leading-tight">
                  &ldquo;{memory.photoCaption}&rdquo;
                </p>
              )}
            </div>
          )}

          {/* Story Subtitle */}
          <h4 className="text-base font-bold font-['Playfair_Display'] text-[#fef3c7] leading-snug mb-1.5">
            {memory.subtitle}
          </h4>

          {/* Short & Readable Description */}
          <p className="text-xs text-[#fed7aa]/90 font-['Outfit'] leading-relaxed mb-3.5">
            {memory.description}
          </p>

          {/* Small Elegant Continue Action Button */}
          <button
            onClick={onClose}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-[#241203] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Continue Exploring</span>
            <Sparkles className="w-3.5 h-3.5 text-[#241203]" />
          </button>
        </div>
      </aside>

      {/* Photo Zoom Lightbox Modal */}
      {isPhotoZoomed && memory.photoUrl && (
        <div
          onClick={() => setIsPhotoZoomed(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full rounded-2xl bg-[#1e0f30] border border-[#f59e0b]/50 p-4 shadow-2xl flex flex-col items-center"
          >
            <button
              onClick={() => setIsPhotoZoomed(false)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-[#fef3c7] hover:bg-[#d97706] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={memory.photoUrl}
              alt={memory.title}
              className="w-full max-h-[70vh] object-contain rounded-xl shadow-lg border border-[#f59e0b]/20"
            />

            <div className="mt-3 text-center">
              <h5 className="font-['Playfair_Display'] font-bold text-lg text-[#fef3c7]">
                {memory.title} – {memory.subtitle}
              </h5>
              {memory.photoCaption && (
                <p className="font-['Outfit'] text-xs text-[#fde68a]/90 mt-1">
                  {memory.photoCaption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

