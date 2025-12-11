import React, { useMemo } from 'react';
import { BackgroundCandle, ShadowFigure } from './SceneElements';

const ForestLevel: React.FC = () => {
  // Use forest trees as parallax elements
  const forestTrees = useMemo(() => 
    [...Array(8)].map((_, i) => ({ 
        x: i * 15 + Math.random() * 10, 
        h: 350 + Math.random() * 100,
        w: 35 + Math.random() * 20 
    })), 
  []);

  // Generate background candles and shadows for the Ritual Forest atmosphere
  const backgroundElements = useMemo(() => {
     const candles = [...Array(12)].map((_, i) => ({
         x: i * 9 + Math.random() * 5,
         y: Math.random() * 30 + 10,
         scale: 0.5 + Math.random() * 0.5
     }));
     // Random background shadows
     const randomShadows = [...Array(5)].map((_, i) => ({
         x: i * 20 + 5 + Math.random() * 10,
         delay: Math.random() * 5,
         scale: 0.8 + Math.random() * 0.4
     }));

     // Fixed shadows corresponding to Whisper Trigger points in script.ts
     const whisperShadows = [10, 25, 40, 55, 70, 85].map((pos, i) => ({
         x: pos,
         delay: i * 0.5,
         scale: 0.95 // Slightly clearer/larger
     }));

     return { candles, shadows: [...randomShadows, ...whisperShadows] };
  }, []);

  return (
    <div className="absolute inset-0">
        {/* God Rays / Volumetric Light Overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none opacity-20 mix-blend-overlay bg-[linear-gradient(110deg,transparent_0%,transparent_40%,rgba(150,150,220,0.1)_45%,transparent_50%,rgba(150,150,220,0.15)_60%,transparent_100%)]"></div>

        {/* Background Candles - Ritual Atmosphere */}
        {backgroundElements.candles.map((c, i) => (
             <BackgroundCandle key={`c-${i}`} x={c.x} y={c.y} scale={c.scale} />
        ))}

        {/* Background Shadows - Ghostly figures */}
        {backgroundElements.shadows.map((s, i) => (
             <ShadowFigure key={`s-${i}`} x={s.x} delay={s.delay} scale={s.scale} />
        ))}

        {forestTrees.map((tree, i) => (
            <div 
                key={i} 
                className="absolute bottom-20 bg-[#12141a] rounded-t-sm z-10 shadow-[10px_0_30px_rgba(0,0,0,0.3)]" 
                style={{ 
                    left: `${tree.x}%`, 
                    height: `${tree.h}px`,
                    width: `${tree.w}px`,
                    opacity: 1 - (i * 0.08) 
                }} 
            >
                {/* Branch hint */}
                <div className="absolute top-10 -left-10 w-20 h-2 bg-[#12141a] rotate-12"></div>
            </div>
        ))}
    </div>
  );
};

export default ForestLevel;