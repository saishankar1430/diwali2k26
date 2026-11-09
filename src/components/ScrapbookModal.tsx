import React, { useState, useEffect } from 'react';
import {
  Heart,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Maximize2,
  Calendar,
  Eye,
} from 'lucide-react';
import { COUPLE_PHOTOS, CouplePhoto } from '../data/photos';

interface ScrapbookModalProps {
  onClose: () => void;
  onJumpToGali?: (photo: CouplePhoto) => void;
}

export const ScrapbookModal: React.FC<ScrapbookModalProps> = ({ onClose }) => {
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const tags = ['All', 'Festive', 'Romance', 'Moments', 'Smile', 'Night'];

  const filteredPhotos =
    selectedTag === 'All'
      ? COUPLE_PHOTOS
      : COUPLE_PHOTOS.filter((p) => p.tag === selectedTag);

  // Keyboard navigation for active lightbox photo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIndex === null) return;
      if (e.key === 'ArrowRight') {
        setActivePhotoIndex((prev) =>
          prev !== null ? (prev + 1) % filteredPhotos.length : 0
        );
      } else if (e.key === 'ArrowLeft') {
        setActivePhotoIndex((prev) =>
          prev !== null ? (prev - 1 + filteredPhotos.length) % filteredPhotos.length : 0
        );
      } else if (e.key === 'Escape') {
        setActivePhotoIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex, filteredPhotos.length]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-hidden animate-fade-in"
      aria-label="Our Scrapbook"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-gradient-to-b from-[#25103a] via-[#1a0a2b] to-[#120520] border-2 border-[#f59e0b]/40 shadow-2xl overflow-hidden text-[#fff8e7]">
        {/* Header Bar */}
        <div className="shrink-0 p-4 sm:p-6 border-b border-[#f59e0b]/20 flex items-center justify-between gap-3 bg-[#1e0a33]/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#f59e0b]/20 border border-[#f59e0b]/30">
              <Heart className="w-5 h-5 text-[#f59e0b] fill-[#f59e0b]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-bold font-['Playfair_Display'] text-[#fef3c7]">
                  Heeru & Sushii&apos;s Memory Album
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#f59e0b]/20 text-[#fbbf24] text-[11px] font-semibold font-['Outfit'] border border-[#f59e0b]/30">
                  {COUPLE_PHOTOS.length} Moments
                </span>
              </div>
              <p className="text-xs text-[#fed7aa]/80 font-['Outfit'] mt-0.5">
                Every smile, every festival, and every quiet breath together.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#351652]/80 text-[#fed7aa] hover:text-white hover:bg-[#4b2075] transition-colors cursor-pointer"
            title="Close Scrapbook"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="shrink-0 px-4 sm:px-6 py-2.5 flex items-center gap-1.5 overflow-x-auto border-b border-[#f59e0b]/15 bg-[#170826]/40 scrollbar-none">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setSelectedTag(tag);
                setActivePhotoIndex(null);
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold font-['Outfit'] transition-all cursor-pointer whitespace-nowrap ${
                selectedTag === tag
                  ? 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-[#241203] shadow-md'
                  : 'bg-[#2a1340]/60 text-[#fed7aa]/80 hover:bg-[#3d1a5e] hover:text-[#fef3c7]'
              }`}
            >
              {tag === 'All' ? `All (${COUPLE_PHOTOS.length})` : tag}
            </button>
          ))}
        </div>

        {/* Photos Grid Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 scrollbar-thin scrollbar-thumb-[#f59e0b]/30">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setActivePhotoIndex(index)}
              className="group relative flex flex-col p-2 bg-[#fefce8] rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 cursor-pointer border border-[#fde68a]/50"
            >
              {/* Polaroid pin effect */}
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#f43f5e] shadow-sm border border-white/60 z-10" />

              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#241334] flex items-center justify-center">
                {/* Soft ambient blur backdrop */}
                <img
                  src={photo.url}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-xs opacity-40 scale-110 pointer-events-none"
                />
                {/* Fully visible crisp photo with zero awkward cropping */}
                <img
                  src={photo.url}
                  alt={photo.title}
                  loading="lazy"
                  className="relative z-10 max-h-full max-w-full object-contain p-0.5 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 z-20 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="p-2 rounded-full bg-black/60 text-white shadow-md">
                    <Maximize2 className="w-4 h-4 text-[#fbbf24]" />
                  </span>
                </div>
              </div>

              {/* Polaroid bottom caption */}
              <div className="pt-2 px-0.5 flex flex-col justify-between flex-1">
                <span className="text-xs font-bold font-['Playfair_Display'] text-[#241203] truncate block">
                  {photo.title}
                </span>
                <span className="text-[10px] font-['Caveat'] text-[#78350f] font-semibold truncate block mt-0.5">
                  {photo.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="shrink-0 p-3 sm:p-4 border-t border-[#f59e0b]/20 bg-[#1e0a33]/60 flex items-center justify-between text-xs text-[#fde68a]/80 font-['Outfit']">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#fbbf24]" />
            <span>Cherished memories of Heeru & Sushii</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-[#241203] font-bold hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            Back to Diwali Night
          </button>
        </div>
      </div>

      {/* Lightbox / Zoom Carousel View */}
      {activePhotoIndex !== null && filteredPhotos[activePhotoIndex] && (
        <div
          onClick={() => setActivePhotoIndex(null)}
          className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-lg animate-fade-in cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full rounded-3xl bg-[#1b092c] border-2 border-[#f59e0b]/60 p-4 sm:p-6 shadow-2xl flex flex-col items-center cursor-default"
          >
            {/* Close Button */}
            <button
              onClick={() => setActivePhotoIndex(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-black/70 text-white hover:bg-[#d97706] transition-colors cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Prev / Next Buttons */}
            <button
              onClick={() =>
                setActivePhotoIndex(
                  (activePhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length
                )
              }
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-[#f59e0b] text-white hover:text-[#241203] transition-colors cursor-pointer z-10"
              title="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() =>
                setActivePhotoIndex((activePhotoIndex + 1) % filteredPhotos.length)
              }
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-[#f59e0b] text-white hover:text-[#241203] transition-colors cursor-pointer z-10"
              title="Next Photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Main Image */}
            <div className="w-full flex items-center justify-center max-h-[60vh] sm:max-h-[66vh] overflow-hidden rounded-2xl bg-black/40">
              <img
                src={filteredPhotos[activePhotoIndex].url}
                alt={filteredPhotos[activePhotoIndex].title}
                className="max-h-[60vh] sm:max-h-[66vh] max-w-full object-contain rounded-xl"
              />
            </div>

            {/* Photo Details */}
            <div className="w-full mt-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-[#f59e0b]/20 border border-[#f59e0b]/30 text-[11px] font-bold text-[#fbbf24] font-['Outfit']">
                  {filteredPhotos[activePhotoIndex].tag}
                </span>
                <span className="text-xs text-[#fed7aa]/60 font-['Outfit']">
                  {activePhotoIndex + 1} of {filteredPhotos.length}
                </span>
              </div>

              <h4 className="text-xl sm:text-2xl font-bold font-['Playfair_Display'] text-[#fef3c7]">
                {filteredPhotos[activePhotoIndex].title}
              </h4>

              <p className="text-xs sm:text-sm text-[#fde68a] font-['Playfair_Display'] italic mt-0.5">
                {filteredPhotos[activePhotoIndex].subtitle}
              </p>

              <p className="text-xs sm:text-sm text-[#fed7aa]/90 font-['Outfit'] max-w-lg mx-auto mt-2 leading-relaxed">
                &ldquo;{filteredPhotos[activePhotoIndex].caption}&rdquo;
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
