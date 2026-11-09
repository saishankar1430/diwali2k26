import React, { useRef, useState, useEffect } from 'react';
import { PlayerInput } from '../types/game';

interface VirtualJoystickProps {
  onInputChange: (input: Partial<PlayerInput>) => void;
  onInteract: () => void;
  actionPrompt?: string | null;
}

export const VirtualJoystick: React.FC<VirtualJoystickProps> = ({
  onInputChange,
  onInteract,
  actionPrompt,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchPos, setTouchPos] = useState<{ x: number; y: number } | null>(null);
  const touchIdRef = useRef<number | null>(null);

  const maxRadius = 45;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (touchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    updateJoystick(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        updateJoystick(touch.clientX, touch.clientY);
        break;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setTouchPos(null);
        onInputChange({ forward: false, backward: false, left: false, right: false });
        break;
      }
    }
  };

  const updateJoystick = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const clampedDist = Math.min(maxRadius, dist);
    const angle = Math.atan2(dy, dx);

    const knobX = Math.cos(angle) * clampedDist;
    const knobY = Math.sin(angle) * clampedDist;

    setTouchPos({ x: knobX, y: knobY });

    // Threshold deadzone
    if (clampedDist > 10) {
      const normX = dx / dist;
      const normY = dy / dist;

      onInputChange({
        forward: normY < -0.3,
        backward: normY > 0.3,
        left: normX < -0.3,
        right: normX > 0.3,
      });
    } else {
      onInputChange({ forward: false, backward: false, left: false, right: false });
    }
  };

  useEffect(() => {
    return () => {
      onInputChange({ forward: false, backward: false, left: false, right: false });
    };
  }, [onInputChange]);

  return (
    <div className="absolute inset-x-0 bottom-6 px-6 pointer-events-none flex items-end justify-between z-20">
      {/* Joystick Pad on bottom-left */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className="w-28 h-28 rounded-full bg-black/40 border border-[#f59e0b]/40 relative pointer-events-auto flex items-center justify-center backdrop-blur-xs select-none touch-none"
      >
        <div
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#d97706] to-[#fbbf24] shadow-md pointer-events-none transition-transform duration-75"
          style={{
            transform: touchPos
              ? `translate(${touchPos.x}px, ${touchPos.y}px)`
              : 'translate(0px, 0px)',
          }}
        />
      </div>

      {/* Action / Interact Button on bottom-right */}
      {actionPrompt && (
        <button
          onClick={onInteract}
          className="pointer-events-auto px-5 py-3 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-[#200e02] font-bold text-sm shadow-xl active:scale-95 transition-transform animate-bounce flex items-center gap-2"
        >
          <span>{actionPrompt}</span>
          <span className="bg-[#200e02] text-[#fbbf24] rounded-full w-5 h-5 flex items-center justify-center text-xs">
            E
          </span>
        </button>
      )}
    </div>
  );
};
