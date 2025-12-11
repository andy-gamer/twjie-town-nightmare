
import React, { useMemo } from 'react';
import { BanyanTree, ShadowFigure } from './SceneElements';

interface SearchLevelProps {
    isVisionMode?: boolean;
}

const SearchLevel: React.FC<SearchLevelProps> = ({ isVisionMode }) => {
  // Generate random positions for shadows that only appear in vision mode
  const horrorShadows = useMemo(() => [
      { x: 20, delay: 0, scale: 0.9 },
      { x: 50, delay: 1, scale: 0.6 },
      { x: 70, delay: 2.5, scale: 0.8 },
      { x: 90, delay: 0.5, scale: 0.7 },
      { x: 10, delay: 3, scale: 0.5 },
  ], []);

  // Creepy whispering text
  const whispers = useMemo(() => [
      { text: "還給我...", top: 30, left: 20, delay: 0 },
      { text: "看不見...", top: 60, left: 40, delay: 1 },
      { text: "好痛...", top: 40, left: 80, delay: 2 },
      { text: "為什麼...", top: 70, left: 60, delay: 1.5 },
  ], []);

  return (
    <div className="absolute inset-0">
        <BanyanTree x={80} />
        
        {isVisionMode && (
            <>
                {/* Horror Shadows Layer - Only Visible in Vision Mode */}
                {horrorShadows.map((s, i) => (
                    <ShadowFigure key={`h-shadow-${i}`} x={s.x} delay={s.delay} scale={s.scale} />
                ))}

                {/* Floating Whispers - Only Visible in Vision Mode */}
                {whispers.map((w, i) => (
                    <div 
                        key={`whisper-${i}`}
                        className="absolute text-red-600/70 font-serif font-bold text-xl tracking-widest blur-[1px] animate-pulse-slow pointer-events-none z-30"
                        style={{ 
                            top: `${w.top}%`, 
                            left: `${w.left}%`,
                            animationDelay: `${w.delay}s`
                        }}
                    >
                        {w.text}
                    </div>
                ))}

                {/* Additional Red Gloom */}
                <div className="absolute inset-0 bg-red-950/20 mix-blend-multiply pointer-events-none z-10"></div>
            </>
        )}
    </div>
  );
};

export default SearchLevel;