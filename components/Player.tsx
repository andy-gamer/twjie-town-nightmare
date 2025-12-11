
import React from 'react';

interface PlayerProps {
    x: number;
    isMoving: boolean;
    isLyingDown?: boolean;
    facingDir: 1 | -1;
    holdingItem?: 'lantern' | 'pot';
}

const Player: React.FC<PlayerProps> = ({ x, isMoving, isLyingDown, facingDir, holdingItem }) => (
  <div 
    className={`absolute bottom-20 z-30 transition-all duration-500`}
    style={{ 
        left: `${x}%`, 
        // We flip the entire container based on direction
        transform: `translateX(-50%) scaleX(${facingDir}) ${isLyingDown ? 'rotate(90deg) translateY(20px)' : 'rotate(0deg)'}`,
        transformOrigin: 'bottom center',
        transition: 'left 0.1s linear, transform 0.3s ease-out' // Smooth flip
    }}
  >
      <div className={`relative w-16 h-32 ${isMoving && !isLyingDown ? 'animate-walk-bob' : 'animate-drunken-idle'} ${isLyingDown ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000'}`}>
         
         {/* Left Arm (Back) - Visible when walking and swinging */}
         {/* Fixed: Moved to top-14 (Shoulder position) */}
         <div className={`absolute top-14 left-4 w-2.5 h-14 bg-stone-700 rounded-full origin-top z-0 ${isMoving && !isLyingDown ? 'animate-arm-swing-l' : 'hidden'}`}></div>
         
         {/* Legs with natural walking animation */}
         <div className="absolute bottom-0 left-5 w-6 h-8 z-0">
             <div className={`absolute left-0 w-3 h-8 bg-stone-700 border-l border-white/10 rounded-b-md origin-top ${isMoving && !isLyingDown ? 'animate-leg-l' : ''}`}></div>
             <div className={`absolute right-0 w-3 h-8 bg-stone-700 border-r border-white/10 rounded-b-md origin-top ${isMoving && !isLyingDown ? 'animate-leg-r' : ''}`}></div>
         </div>

         {/* Body - Made lighter (stone-700) and added explicit border for visibility against black */}
         <div className={`absolute bottom-6 left-4 w-8 h-20 bg-stone-700 rounded-t-2xl shadow-lg overflow-hidden border border-stone-500/50 z-10`}>
             {/* Dress fold */}
             <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-black to-transparent opacity-40"></div>
         </div>
         
         {/* Head - Made lighter */}
         <div className={`absolute top-4 left-3 w-10 h-10 bg-stone-700 border border-stone-500/50 rounded-full shadow-md z-10 ${isMoving && !isLyingDown ? 'animate-bob-head' : ''}`}>
             {/* Ponytail */}
             <div className="absolute top-4 -left-3 w-4 h-6 bg-stone-800 -rotate-12 rounded-full border border-white/5"></div>
         </div>

         {/* Right Arm (Front) or Held Item */}
         {holdingItem ? (
             // Holding Item Arm (Raised)
             // Fixed: Moved to top-14 (Shoulder position) to avoid looking like it grows from head.
             // Increased rotation to -60deg so the lantern itself remains high at head position.
             <div className={`absolute top-14 right-1 w-8 h-2.5 bg-stone-700 rounded-full origin-left z-20 border-t border-white/10 ${holdingItem === 'pot' ? 'rotate-[-30deg]' : 'rotate-[-60deg]'} ${isMoving && !isLyingDown ? 'animate-arm-sway' : ''}`}>
                 {holdingItem === 'lantern' ? (
                     // LANTERN VISUAL
                     // String length (h-4)
                     <div className={`absolute right-0 top-0 w-[1px] h-4 bg-black/60 origin-top ${isLyingDown ? '' : (isMoving ? 'animate-lantern-swing-move' : 'animate-lantern-swing-idle')}`}>
                          {/* Lantern Body */}
                          <div className="absolute bottom-0 -left-3 w-6 h-8 bg-[#2a1515] rounded-sm flex items-center justify-center border border-amber-900/50 shadow-[0_0_10px_rgba(255,160,0,0.8)]">
                               <div className="w-2 h-4 bg-amber-200 blur-[1px] rounded-full animate-flicker"></div>
        
                               {/* Lantern Light Glow */}
                               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
                                    <div className="animate-flicker-subtle">
                                        <div className="absolute top-0 left-0 w-32 h-32 bg-amber-200/30 blur-[20px] rounded-full mix-blend-hard-light -translate-x-1/2 -translate-y-1/2"></div>
                                        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-500/10 blur-[60px] rounded-full mix-blend-screen -translate-x-1/2 -translate-y-1/2"></div>
                                    </div>
                               </div>
                          </div>
                     </div>
                 ) : (
                     // GLOWING POT VISUAL (Held by hand/rope)
                     <div className={`absolute right-1 top-2 w-[1px] h-4 bg-black/60 origin-top ${isLyingDown ? '' : (isMoving ? 'animate-lantern-swing-move' : 'animate-lantern-swing-idle')}`}>
                          {/* Pot Body */}
                          <div className="absolute bottom-0 -left-4 w-8 h-8 bg-stone-700 rounded-b-xl border-t-2 border-stone-500 flex items-center justify-center shadow-[0_0_15px_rgba(200,255,200,0.3)]">
                               {/* Glowing Seed Inside */}
                               <div className="w-3 h-3 bg-cyan-100 rounded-full blur-[2px] animate-pulse relative">
                                    <div className="absolute inset-0 bg-white blur-sm"></div>
                               </div>
                               {/* Pot Light Glow */}
                               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
                                    <div className="animate-pulse-slow">
                                        <div className="absolute top-0 left-0 w-24 h-24 bg-cyan-200/30 blur-[20px] rounded-full mix-blend-hard-light -translate-x-1/2 -translate-y-1/2"></div>
                                    </div>
                               </div>
                          </div>
                     </div>
                 )}
             </div>
         ) : (
             // Empty Hand (Right Arm) - Swings when walking
             // Fixed: Moved to top-14 (Shoulder position)
             <div className={`absolute top-14 right-2 w-2.5 h-14 bg-stone-700 rounded-full origin-top z-20 border-l border-white/10 ${isMoving && !isLyingDown ? 'animate-arm-swing-r' : 'hidden'}`}></div>
         )}
         
         {/* Splash Particles (Kicking up water) */}
         {isMoving && !isLyingDown && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-10 pointer-events-none z-20">
                <div className="absolute bottom-0 left-2 w-1 h-1 bg-blue-200/50 rounded-full animate-float" style={{ animationDuration: '0.4s' }}></div>
                <div className="absolute bottom-0 right-2 w-1 h-1 bg-blue-200/50 rounded-full animate-float" style={{ animationDuration: '0.4s', animationDelay: '0.2s' }}></div>
            </div>
         )}

         {/* Visibility Booster for Intro (No Lantern) */}
         {/* Adds a subtle rim light/glow around the player so they are seen in black scenes */}
         {!holdingItem && !isLyingDown && (
            <div className="absolute inset-0 z-20 pointer-events-none">
                 <div className="absolute top-4 left-2 w-12 h-24 bg-stone-500/10 rounded-full blur-md"></div>
                 <div className="absolute -inset-4 border border-white/5 rounded-full opacity-20"></div>
            </div>
         )}
         
      </div>
  </div>
);

export default Player;
