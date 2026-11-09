/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameState, MemoryItem, InteractionState } from './types/game';
import { INITIAL_MEMORIES, getCompletedMemoriesCount } from './game/rules';
import { WorldScene } from './game/worldScene';
import { TitleScreen } from './components/TitleScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { ModeSelectModal } from './components/ModeSelectModal';
import { HUD } from './components/HUD';
import { MemoryModal } from './components/MemoryModal';
import { GrandFinaleModal } from './components/GrandFinaleModal';
import { ScrapbookModal } from './components/ScrapbookModal';
import { VirtualJoystick } from './components/VirtualJoystick';
import { soundEngine } from './utils/audio';

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<WorldScene | null>(null);

  // Game state
  const [gameState, setGameState] = useState<GameState>('title');
  const [memories, setMemories] = useState<MemoryItem[]>(() =>
    INITIAL_MEMORIES.map((m) => ({ ...m }))
  );
  const [currentNearMemory, setCurrentNearMemory] = useState<MemoryItem | null>(null);
  const [interactionState, setInteractionState] = useState<InteractionState>('idle');
  const [activeInteractingMemory, setActiveInteractingMemory] = useState<MemoryItem | null>(null);
  const [activeMemoryCard, setActiveMemoryCard] = useState<MemoryItem | null>(null);
  const [isScrapbookOpen, setIsScrapbookOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isTouring, setIsTouring] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Check touch device
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Support for ?autostart=1 query parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      soundEngine.startAmbientMusic();
      setGameState('playing');
    }
  }, []);

  // Initialize Three.js scene once
  useEffect(() => {
    if (!mountRef.current || sceneRef.current) return;

    const scene = new WorldScene(
      {
        container: mountRef.current,
        onNearMemoryChange: (mem) => {
          setCurrentNearMemory(mem);
        },
        onMemoryComplete: (mem) => {
          handleUnlockMemory(mem);
        },
        onInteractionStateChange: (state, mem) => {
          setInteractionState(state);
          setActiveInteractingMemory(mem);
        },
      },
      memories
    );

    sceneRef.current = scene;

    return () => {
      scene.dispose();
      sceneRef.current = null;
    };
  }, []);

  const handleStartFromTitle = () => {
    setGameState('loading');
    setTimeout(() => {
      setGameState('mode_select');
    }, 1200);
  };

  const handleSelectWalk = () => {
    setIsTouring(false);
    setGameState('playing');
    if (sceneRef.current) {
      sceneRef.current.resetToThirdPerson();
    }
  };

  // Autonomous romantic tour mode through the gali
  const handleSelectTour = () => {
    setIsTouring(true);
    setGameState('playing');
    runTourSequence();
  };

  const runTourSequence = async () => {
    if (!sceneRef.current) return;
    const tourTargets = memories;

    for (let i = 0; i < tourTargets.length; i++) {
      if (!sceneRef.current) break;
      const mem = tourTargets[i];

      // Direct couple to interaction position
      sceneRef.current.triggerCinematicInteraction(mem);

      // Wait 3.5 seconds before moving to next
      await new Promise((resolve) => setTimeout(resolve, 3800));
    }

    // Grand Finale after tour
    triggerGrandFinale();
  };

  const handleUnlockMemory = (memory: MemoryItem) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === memory.id ? { ...m, unlocked: true } : m))
    );
    setActiveMemoryCard(memory);
  };

  const handleInteract = () => {
    if (!currentNearMemory || !sceneRef.current) return;
    sceneRef.current.triggerCinematicInteraction(currentNearMemory);
  };

  const handleSkipCinematic = () => {
    sceneRef.current?.skipCurrentCinematic();
  };

  // Keyboard shortcut listener for E and Space
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      if (e.code === 'KeyE' || e.code === 'Space') {
        if (activeMemoryCard) {
          setActiveMemoryCard(null);
          sceneRef.current?.resetToThirdPerson();
        } else if (interactionState === 'playing_animation') {
          handleSkipCinematic();
        } else if (currentNearMemory && interactionState === 'idle') {
          handleInteract();
        }
      } else if (e.code === 'Escape' && interactionState !== 'idle') {
        handleSkipCinematic();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [gameState, currentNearMemory, activeMemoryCard, interactionState]);

  const handleNavigateToMemory = (memory: MemoryItem) => {
    if (!sceneRef.current) return;
    sceneRef.current.teleportTo(
      [memory.characterTargetPos[0], memory.characterTargetPos[1], memory.characterTargetPos[2] - 0.8],
      memory.characterTargetHeading
    );
    sceneRef.current.resetToThirdPerson();
  };

  const triggerGrandFinale = useCallback(() => {
    if (!sceneRef.current) return;
    setGameState('finale');

    // Teleport couple to rooftop terrace overlook facing the city
    sceneRef.current.teleportTo([0, 0, 15.2], 0);
    sceneRef.current.coupleActor.setPose('look_up');

    // Pan camera behind them looking up at the sky and city terrace
    sceneRef.current.startCinematicView([0, 2.4, 11.0], [0, 9.5, 24.0]);
    sceneRef.current.environment.lightUpAll();

    // Launch barrage of multi-colored fireworks
    const colors = ['#ffd700', '#ff4081', '#00e676', '#ff9100', '#e040fb', '#00e5ff'];
    for (let f = 0; f < 10; f++) {
      setTimeout(() => {
        if (!sceneRef.current) return;
        const fx = (Math.random() - 0.5) * 18;
        const fy = 10 + Math.random() * 8;
        const fz = 18 + Math.random() * 8;
        const col = colors[f % colors.length];

        soundEngine.playFireworkBurst(true);
        if (f % 2 === 0) {
          sceneRef.current.particleManager.spawnHeartFirework([fx, fy, fz]);
        } else {
          sceneRef.current.particleManager.spawnGrandFirework([fx, fy, fz], col);
        }
      }, f * 550);
    }
  }, []);

  const completedCount = getCompletedMemoriesCount(memories);

  // Trigger finale automatically when all memories are unlocked
  useEffect(() => {
    if (completedCount === memories.length && memories.length > 0 && gameState === 'playing') {
      setTimeout(() => {
        triggerGrandFinale();
      }, 1500);
    }
  }, [completedCount, memories.length, gameState, triggerGrandFinale]);

  return (
    <main
      className="relative w-screen h-screen overflow-hidden bg-[#0e071a]"
      data-testid="diwali-app-container"
    >
      {/* 3D WebGL Canvas Mount Container */}
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing"
      />

      {/* Screen 1: Title Screen */}
      {gameState === 'title' && (
        <TitleScreen
          onStart={handleStartFromTitle}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(soundEngine.toggleMute())}
        />
      )}

      {/* Screen 2: Loading Screen */}
      {gameState === 'loading' && <LoadingScreen />}

      {/* Screen 3: Mode Select Modal */}
      {gameState === 'mode_select' && (
        <ModeSelectModal onSelectWalk={handleSelectWalk} onSelectTour={handleSelectTour} />
      )}

      {/* Screen 4: Playing HUD */}
      {(gameState === 'playing' || gameState === 'finale') && (
        <HUD
          completedCount={completedCount}
          totalMemories={memories.length}
          currentNearMemory={currentNearMemory}
          interactionState={interactionState}
          activeInteractingMemory={activeInteractingMemory}
          onInteract={handleInteract}
          onSkipCinematic={handleSkipCinematic}
          onNavigateToMemory={handleNavigateToMemory}
          allMemories={memories}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(soundEngine.toggleMute())}
          onTriggerFinale={triggerGrandFinale}
          onTakeTour={handleSelectTour}
          onOpenScrapbook={() => setIsScrapbookOpen(true)}
          isTouring={isTouring}
        />
      )}

      {/* Active Memory Card Modal */}
      {activeMemoryCard && (
        <MemoryModal
          memory={activeMemoryCard}
          onClose={() => {
            setActiveMemoryCard(null);
            sceneRef.current?.resetToThirdPerson();
          }}
        />
      )}

      {/* Grand Finale Modal */}
      {gameState === 'finale' && (
        <GrandFinaleModal
          onReplayFireworks={triggerGrandFinale}
          onExploreFreely={() => {
            setGameState('playing');
            setIsTouring(false);
            sceneRef.current?.resetToThirdPerson();
          }}
          onOpenScrapbook={() => setIsScrapbookOpen(true)}
        />
      )}

      {/* 23 Photos Scrapbook Modal */}
      {isScrapbookOpen && (
        <ScrapbookModal onClose={() => setIsScrapbookOpen(false)} />
      )}

      {/* Virtual Joystick on mobile / touch */}
      {isTouchDevice && gameState === 'playing' && (
        <VirtualJoystick
          onInputChange={(input) => sceneRef.current?.setInput(input)}
          onInteract={handleInteract}
          actionPrompt={
            currentNearMemory && interactionState === 'idle'
              ? currentNearMemory.shortPrompt
              : null
          }
        />
      )}
    </main>
  );
}
