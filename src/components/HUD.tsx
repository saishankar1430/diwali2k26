import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Compass,
  Eye,
  ChevronDown,
  ChevronUp,
  Music,
  FastForward,
  Camera,
} from 'lucide-react';
import { MemoryItem, InteractionState } from '../types/game';
import { COUPLE_PHOTOS } from '../data/photos';

interface HUDProps {
  completedCount: number;
  totalMemories: number;
  currentNearMemory: MemoryItem | null;
  interactionState: InteractionState;
  activeInteractingMemory: MemoryItem | null;
  onInteract: () => void;
  onSkipCinematic: () => void;
  onNavigateToMemory: (memory: MemoryItem) => void;
  allMemories: MemoryItem[];
  isMuted: boolean;
  onToggleMute: () => void;
  onTriggerFinale: () => void;
  onTakeTour: () => void;
  onOpenScrapbook: () => void;
  isTouring: boolean;
}

export const HUD: React.FC<HUDProps> = ({
  completedCount,
  totalMemories,
  currentNearMemory,
  interactionState,
  activeInteractingMemory,
  onInteract,
  onSkipCinematic,
  onNavigateToMemory,
  allMemories,
  isMuted,
  onToggleMute,
  onTriggerFinale,
  onTakeTour,
  onOpenScrapbook,
  isTouring,
}) => {
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);

  // Next uncompleted memory for "Look" button
  const nextMemory = allMemories.find((m) => !m.unlocked) || allMemories[0];

  const isCinematicActive =
    interactionState === 'approaching' || interactionState === 'playing_animation';

  return (
    <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-4 sm:p-6 z-20 overflow-hidden">
      {/* Cinematic Letterbox Top Bar during active interaction */}
      {isCinematicActive && (
        <div className="absolute inset-x-0 top-0 h-16 sm:h-20 bg-gradient-to-b from-black/85 to-transparent pointer-events-none z-10 transition-all duration-500" />
      )}

      {/* Top Header Cluster */}
      <div className={`flex items-center justify-between w-full transition-opacity duration-300 ${isCinematicActive ? 'opacity-30' : 'opacity-100'}`}>
        {/* Memories Progress Badge */}
        <div className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1e0f30]/85 border border-[#f59e0b]/30 shadow-md">
          <Sparkles className="w-4 h-4 text-[#fbbf24]" />
          <span className="text-xs sm:text-sm font-semibold tracking-wide text-[#fef3c7] tabular-nums">
            {completedCount} of {totalMemories} memories
          </span>
        </div>

        {/* Center Title Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#1e0f30]/70 border border-[#f59e0b]/20 text-xs font-['Outfit'] text-[#fde68a]">
          <span>Heeru</span>
          <span className="text-[#f43f5e]">❤️</span>
          <span>Sushii</span>
        </div>

        {/* Top Right Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Photo Album / Scrapbook Button */}
          <button
            onClick={onOpenScrapbook}
            className="px-3 sm:px-3.5 py-1.5 rounded-full bg-[#27103d]/90 hover:bg-[#391859] border border-[#f59e0b]/40 text-[#fde68a] text-xs font-semibold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
            title={`Open Our ${COUPLE_PHOTOS.length} Photos Scrapbook`}
          >
            <Camera className="w-3.5 h-3.5 text-[#fbbf24]" />
            <span className="hidden sm:inline">{COUPLE_PHOTOS.length} Photos</span>
          </button>

          <button
            onClick={onTriggerFinale}
            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#e11d48] to-[#be123c] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Diwali Finale</span>
          </button>

          <button
            onClick={onToggleMute}
            className="p-2 rounded-full bg-[#1e0f30]/85 border border-[#f59e0b]/30 text-[#fde68a] hover:bg-[#2c1744] transition-colors focus:outline-none cursor-pointer"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Cinematic Letterbox Subtitle Bar during animation */}
      {isCinematicActive && activeInteractingMemory && (
        <div className="absolute inset-x-0 bottom-20 sm:bottom-24 flex flex-col items-center justify-center px-4 z-30 pointer-events-auto animate-fade-in">
          <div className="max-w-md px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-[#180a2b]/90 border border-[#f59e0b]/35 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 text-left">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#fbbf24] font-['Outfit'] block">
                {activeInteractingMemory.title}
              </span>
              <p className="text-xs sm:text-sm text-[#fef3c7] font-['Playfair_Display'] italic leading-snug">
                &ldquo;{activeInteractingMemory.cinematicDialogue}&rdquo;
              </p>
            </div>
            <button
              onClick={onSkipCinematic}
              className="shrink-0 px-2.5 py-1 rounded-full bg-[#2a1340]/90 border border-[#f59e0b]/30 text-[#fde68a] text-[11px] font-medium flex items-center gap-1 hover:bg-[#3d1a5e] transition-colors cursor-pointer"
            >
              <span>Skip</span>
              <FastForward className="w-3 h-3 text-[#fbbf24]" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Bottom-Center Contextual Interaction Prompt (Above controls HUD, never over characters) */}
      {!isCinematicActive && currentNearMemory && (
        <div className="absolute bottom-20 sm:bottom-22 left-1/2 -translate-x-1/2 pointer-events-auto z-20 animate-fade-in flex flex-col items-center">
          <button
            onClick={onInteract}
            className="group px-4 py-2 rounded-full bg-[#1c0a2e]/92 hover:bg-[#28113f] border border-[#f59e0b]/40 hover:border-[#f59e0b] shadow-xl backdrop-blur-md flex items-center gap-2.5 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span className="px-1.5 py-0.5 rounded bg-[#f59e0b] text-[#1c0a2e] text-[10px] sm:text-[11px] font-mono font-bold shadow-inner">
              E
            </span>
            <span className="text-xs sm:text-sm font-semibold text-[#fff8e7] tracking-wide font-['Outfit']">
              {currentNearMemory.shortPrompt}
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#f59e0b] opacity-80 group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      )}

      {/* Bottom Area: Unified Collapsible Control Dock */}
      <div className={`w-full flex flex-col items-center pointer-events-auto transition-opacity duration-300 ${isCinematicActive ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
        <button
          onClick={() => setIsDockCollapsed(!isDockCollapsed)}
          className="mb-1.5 px-3 py-1 rounded-full bg-[#1a0a29]/80 border border-[#f59e0b]/20 text-[11px] text-[#fde68a] hover:bg-[#2c1744] transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>{isDockCollapsed ? 'Show Controls' : 'Hide Controls'}</span>
          {isDockCollapsed ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {!isDockCollapsed && (
          <div className="w-full max-w-xl rounded-2xl bg-[#1a0a29]/95 border border-[#f59e0b]/30 p-2.5 sm:p-3 flex items-center justify-between gap-2 shadow-2xl backdrop-blur-xs">
            <button
              onClick={onTakeTour}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                isTouring
                  ? 'bg-[#f59e0b] text-[#241203] font-bold'
                  : 'bg-[#29143d] text-[#fde68a] hover:bg-[#381a54]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{isTouring ? 'Touring Gali...' : 'Tour Gali'}</span>
            </button>

            {nextMemory && (
              <button
                onClick={() => onNavigateToMemory(nextMemory)}
                className="px-3.5 py-1.5 rounded-xl bg-[#29143d] border border-[#f59e0b]/30 text-[#fef3c7] hover:bg-[#381a54] text-xs font-medium flex items-center gap-2 transition-all cursor-pointer"
              >
                <span className="text-[#f59e0b] font-semibold">{nextMemory.shortPrompt}</span>
                <span className="px-1.5 py-0.5 rounded bg-[#f59e0b] text-[#241203] text-[10px] font-bold flex items-center gap-0.5">
                  <Eye className="w-2.5 h-2.5" />
                  Look
                </span>
              </button>
            )}

            <button
              onClick={onToggleMute}
              className="p-1.5 rounded-lg bg-[#29143d] text-[#fde68a] hover:bg-[#381a54] transition-colors cursor-pointer"
              title="Toggle Music"
            >
              <Music className={`w-3.5 h-3.5 ${isMuted ? 'opacity-40' : 'text-[#f59e0b]'}`} />
            </button>
          </div>
        )}
      </div>

      {/* Cinematic Letterbox Bottom Bar */}
      {isCinematicActive && (
        <div className="absolute inset-x-0 bottom-0 h-16 sm:h-20 bg-gradient-to-t from-black/85 to-transparent pointer-events-none z-10 transition-all duration-500" />
      )}
    </div>
  );
};
