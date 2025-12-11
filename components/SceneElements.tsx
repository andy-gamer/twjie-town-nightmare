import React, { useMemo } from 'react';
import { GameScene, GameState } from '../types';

// --- Sky & Background ---

export const Moon: React.FC = () => (
    <div className="absolute top-10 right-20 w-24 h-24 bg-[#e8e4c9] rounded-full shadow-[0_0_120px_rgba(255,255,220,0.5)] z-0 opacity-90 mix-blend-screen">
        <div className="absolute top-4 left-6 w-6 h-6 bg-black/10 rounded-full blur-md"></div>
        <div className="absolute bottom-6 right-6 w-10 h-10 bg-black/10 rounded-full blur-lg"></div>
    </div>
);

export const TownBackground: React.FC = () => {
    // Generate skyline buildings - Taller, denser, row-house style
    const buildings = useMemo(() => [...Array(15)].map((_, i) => ({
        h: 250 + Math.random() * 200, // Taller buildings
        w: 120 + Math.random() * 80, // Wider blocks
        x: i * 8 - 10, // Overlap slightly
        z: Math.random(), // for slight depth variance
        type: Math.floor(Math.random() * 3) // Different roof styles
    })), []);

    // Generate utility poles positions
    const poles = useMemo(() => [5, 25, 45, 65, 85, 95], []);

    return (
        <div className="absolute bottom-24 left-0 w-full h-[700px] z-0 pointer-events-none">
            {/* 1. Indistinct Building Silhouettes Layer (1970s Taiwan Row Houses) */}
            <div className="absolute bottom-0 w-full h-full opacity-80">
                {buildings.map((b, i) => (
                    <div 
                        key={i}
                        className="absolute bottom-0 bg-[#0c0a0a] flex flex-col justify-end"
                        style={{
                            left: `${b.x}%`,
                            width: `${b.w}px`,
                            height: `${b.h}px`,
                            filter: `blur(${1 + b.z * 1.5}px)`,
                            zIndex: Math.floor(b.z * 10),
                            opacity: 0.7 + b.z * 0.3
                        }}
                    >
                         {/* Roof Detail - Slanted or Flat with Water Tank */}
                         <div className="w-full h-8 bg-[#0a0808] absolute top-0 transform -skew-x-12"></div>
                         
                         {/* Balcony / Qilou Overhang hints */}
                         {b.h > 300 && (
                            <div className="absolute bottom-32 w-[110%] -left-[5%] h-4 bg-black/60"></div>
                         )}

                        {/* Random window lights - very dim and indistinct */}
                        {Math.random() > 0.6 && (
                            <div className="absolute top-[30%] left-[20%] w-3 h-4 bg-yellow-900/20 blur-[2px]"></div>
                        )}
                        {Math.random() > 0.7 && (
                            <div className="absolute top-[60%] right-[30%] w-3 h-4 bg-yellow-900/10 blur-[2px]"></div>
                        )}
                    </div>
                ))}
            </div>

            {/* 2. Utility Poles & Lanterns Layer (Foreground of background) */}
            <div className="absolute bottom-0 w-full h-full z-20">
                {/* Wires - SVG Overlay */}
                <svg className="absolute top-0 left-0 w-full h-full overflow-visible opacity-60">
                    <defs>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>
                    {poles.map((x, i) => {
                        if (i === poles.length - 1) return null;
                        const nextX = poles[i+1];
                        return (
                            <g key={`wire-${i}`}>
                                {/* Main sagging wire */}
                                <path 
                                    d={`M ${x}% 200 Q ${(x + nextX) / 2}% 350 ${nextX}% 220`} 
                                    fill="none" 
                                    stroke="#1a1515" 
                                    strokeWidth="2" 
                                />
                                {/* Second wire for Lanterns */}
                                <path 
                                    d={`M ${x}% 220 Q ${(x + nextX) / 2}% 260 ${nextX}% 240`} 
                                    fill="none" 
                                    stroke="#2a0a0a" 
                                    strokeWidth="1" 
                                />
                            </g>
                        );
                    })}
                </svg>

                {/* LANTERN ROW: Lanterns distributed along the "wire" between poles */}
                {poles.map((x, i) => {
                    if (i === poles.length - 1) return null;
                    // Place 3 lanterns between each pole pair
                    const lanterns = [0.25, 0.5, 0.75]; 
                    return lanterns.map((ratio, j) => {
                       const nextX = poles[i+1];
                       const posX = x + (nextX - x) * ratio;
                       // Simple parabolic approximation for Y position on the sagging wire
                       const posY = 220 + 30 * Math.sin(ratio * Math.PI); 

                       return (
                           <div key={`l-row-${i}-${j}`} className="absolute origin-top animate-swing" style={{ left: `${posX}%`, top: `${posY}px`, animationDelay: `${Math.random()}s` }}>
                               <div className="w-[1px] h-4 bg-black/50 absolute -top-4 left-1/2"></div>
                               <div className="w-5 h-6 bg-gradient-to-b from-red-950 via-red-800 to-red-950 rounded-md shadow-[0_0_8px_rgba(255,0,0,0.4)] flex items-center justify-center relative">
                                   <div className="w-1 h-2 bg-orange-200/30 blur-[1px] rounded-full"></div>
                               </div>
                           </div>
                       )
                    });
                })}

                {/* Poles */}
                {poles.map((x, i) => (
                    <div key={`pole-${i}`} className="absolute bottom-0" style={{ left: `${x}%` }}>
                        {/* Pole */}
                        <div className="w-3 h-[500px] bg-[#141010] absolute bottom-0 -translate-x-1/2 flex flex-col items-center">
                            {/* Crossbars */}
                            <div className="w-24 h-2 bg-[#1a1515] absolute top-[200px] -translate-x-1/2 left-1/2 shadow-sm"></div>
                            <div className="w-20 h-2 bg-[#1a1515] absolute top-[220px] -translate-x-1/2 left-1/2 shadow-sm"></div>
                            
                            {/* Insulators */}
                            <div className="w-1.5 h-2 bg-black absolute top-[195px] left-[-30px]"></div>
                            <div className="w-1.5 h-2 bg-black absolute top-[195px] right-[-30px]"></div>
                        </div>

                        {/* Hanging Main Red Lanterns on Poles */}
                        <div className="absolute top-[220px] left-4 animate-swing origin-top" style={{ animationDelay: `${i * 0.5}s` }}>
                            {/* String */}
                            <div className="w-[1px] h-8 bg-black/50 absolute -top-8 left-1/2"></div>
                            {/* Lantern Body */}
                            <div className="w-8 h-10 bg-gradient-to-b from-red-900 via-red-700 to-red-900 rounded-lg shadow-[0_0_15px_rgba(255,0,0,0.6)] flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-red-500/10 animate-pulse"></div>
                                {/* Inner Light */}
                                <div className="w-2 h-4 bg-orange-200/50 blur-[2px] rounded-full"></div>
                                {/* Tassel */}
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-4 bg-red-900/80"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const Road: React.FC = () => (
    <div className="absolute bottom-0 w-full h-24 z-10 pointer-events-none">
         {/* Road surface */}
         <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-[#141212] via-[#0f0e0e] to-transparent"></div>
         {/* Road Texture */}
         <div className="absolute bottom-0 w-full h-16 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]"></div>
         {/* Edge highlight */}
         <div className="absolute bottom-20 w-full h-[1px] bg-white/5 opacity-50"></div>
    </div>
);

export const FloodWater: React.FC = () => (
    <div className="absolute bottom-0 left-0 w-full h-28 z-50 pointer-events-none overflow-hidden">
        {/* Dark muddy water base - stronger opacity */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-[#0c1218] to-[#122436]/40 opacity-90"></div>
        
        {/* Surface Line (The water level) */}
        <div className="absolute top-0 w-full h-[1px] bg-blue-100/20 blur-[1px] animate-pulse-slow"></div>
        <div className="absolute top-1 w-full h-[2px] bg-black/50 blur-[2px]"></div>
        
        {/* Layer 1: Slow Flowing Ripples */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/water.png')] opacity-20 mix-blend-overlay animate-fog-scroll" style={{ animationDuration: '40s', backgroundSize: '400px' }}></div>
        
        {/* Layer 2: Faster Surface Shine (Opposite Direction) */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/water.png')] opacity-10 mix-blend-screen animate-fog-scroll" style={{ animationDuration: '25s', animationDirection: 'reverse', backgroundSize: '250px' }}></div>
        
        {/* Floating Debris/Reflections */}
        <div className="absolute top-4 left-10 w-8 h-1 bg-white/5 rounded-full blur-[1px] animate-float-slow"></div>
        <div className="absolute top-8 left-60 w-12 h-0.5 bg-white/5 rounded-full blur-[1px] animate-float"></div>
        <div className="absolute top-2 right-20 w-4 h-1 bg-white/5 rounded-full blur-[1px] animate-pulse-slow"></div>
    </div>
);

export const Crowd: React.FC = () => {
    // Generate static crowd shapes
    const people = useMemo(() => [...Array(20)].map((_, i) => ({
        h: 60 + Math.random() * 20,
        w: 20 + Math.random() * 10,
        x: i * 5 + Math.random() * 2,
        bobDelay: Math.random() * 2,
        swayDuration: 3 + Math.random() * 2
    })), []);

    return (
        <div className="absolute bottom-20 left-0 w-full h-32 z-5 pointer-events-none opacity-60 mix-blend-multiply">
            {people.map((p, i) => (
                <div 
                    key={i}
                    className="absolute bottom-0 bg-[#0f0a0a] rounded-t-xl"
                    style={{
                        left: `${p.x}%`,
                        height: `${p.h}px`,
                        width: `${p.w}px`,
                        animation: `bob 3s infinite ease-in-out ${p.bobDelay}s, sway ${p.swayDuration}s infinite ease-in-out`
                    }}
                >
                    {/* Eyes observing */}
                    {i % 3 === 0 && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex space-x-2 opacity-30">
                            <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                            <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                        </div>
                    )}
                </div>
            ))}
            <style>{`
                @keyframes bob {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(3px); }
                }
                @keyframes sway {
                    0%, 100% { transform: rotate(1deg); }
                    50% { transform: rotate(-1deg); }
                }
            `}</style>
        </div>
    );
};

export const ShadowFigure: React.FC<{ x: number, delay?: number, scale?: number }> = ({ x, delay = 0, scale = 1 }) => (
    <div 
        className="absolute bottom-20 w-24 h-64 bg-black/90 blur-md rounded-t-[50%] z-20 pointer-events-none animate-ghost-flicker" 
        style={{ 
            left: `${x}%`, 
            transform: `translateX(-50%) scale(${scale})`, 
            animationDelay: `${delay}s`
        }}
    >
         <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-black via-black/80 to-transparent"></div>
    </div>
);

// --- Background Ritual Elements ---

export const BackgroundCandle: React.FC<{ x: number, y: number, scale?: number }> = ({ x, y, scale = 1 }) => (
    <div className="absolute z-0 pointer-events-none" style={{ left: `${x}%`, bottom: `${y}px`, transform: `scale(${scale})` }}>
        <div className="w-2 h-6 bg-[#3a0a0a] relative opacity-70">
            {/* Small Flame */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1.5 h-3 bg-orange-400 rounded-full blur-[1px] animate-flicker-subtle"></div>
            {/* Glow */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-orange-900/40 rounded-full blur-xl animate-pulse-slow mix-blend-screen"></div>
        </div>
    </div>
);

export const RitualStake: React.FC<{ x: number }> = ({ x }) => (
    <div className="absolute bottom-0 z-50 pointer-events-none" style={{ left: `${x}%` }}>
        {/* A jagged wooden stake silhouette in foreground */}
        <div className="w-12 h-[80vh] bg-[#050202] blur-[2px] transform -rotate-3 skew-x-2 relative animate-sway-slow">
             {/* Red cloth tied to it */}
             <div className="absolute top-32 -right-4 w-12 h-32 bg-[#1a0505] rounded-bl-full rotate-12 blur-[1px] opacity-80 animate-sway-slow"></div>
        </div>
    </div>
);

// --- Trees & Nature ---

export const BanyanTree: React.FC<{ x: number }> = ({ x }) => {
  // Memoize random roots generation to prevent jittering on re-render
  const roots = useMemo(() => [...Array(25)].map((_, i) => ({
      left: (i * 20) - 150,
      width: Math.random() * 5 + 3,
      height: 450 + Math.random() * 250,
      rotation: Math.random() * 6 - 3
  })), []);

  return (
    <div 
      className="absolute bottom-16 z-10 flex flex-col items-center pointer-events-none"
      style={{ left: `${x}%`, transform: 'translateX(-50%)' }}
    >
      {/* Massive Canopy - Wider and more sprawling */}
      <div className="absolute -top-[550px] w-[1500px] h-[700px] bg-[#0c0808] rounded-[100%] blur-sm opacity-98 z-20"></div>
      <div className="absolute -top-[500px] -left-[500px] w-[700px] h-[600px] bg-[#0c0808] rounded-[100%] blur-md opacity-95 z-20"></div>
      <div className="absolute -top-[500px] -right-[500px] w-[700px] h-[600px] bg-[#0c0808] rounded-[100%] blur-md opacity-95 z-20"></div>

      {/* Main Trunk System */}
      <div className="relative w-[400px] h-[600px] flex justify-center">
          {/* Main Trunk - Wider */}
          <div className="w-64 h-full bg-[#161010] relative shadow-2xl">
              {/* Texture */}
              <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(90deg,transparent,transparent_5px,#000_6px)]"></div>
          </div>
          
          {/* Side Trunks/Roots - Massive */}
          <div className="absolute bottom-0 -left-32 w-24 h-[550px] bg-[#161010] skew-x-6 rounded-b-lg"></div>
          <div className="absolute bottom-0 -right-32 w-24 h-[550px] bg-[#161010] -skew-x-6 rounded-b-lg"></div>
          
          {/* Hanging Aerial Roots - More dense and various lengths */}
          {roots.map((r, i) => (
              <div 
                  key={i}
                  className="absolute top-0 bg-[#0c0808] opacity-80"
                  style={{
                      left: `${r.left}px`,
                      width: `${r.width}px`,
                      height: `${r.height}px`,
                      transform: `rotate(${r.rotation}deg)`
                  }}
              ></div>
          ))}
      </div>
    </div>
  );
};

export const FlowerFieldBackground: React.FC = () => {
    // Memoize random generation to prevent jittering on re-render
    const flowers = useMemo(() => [...Array(40)].map((_, i) => ({
        left: i * 2.5 + Math.random() * 2,
        delay: Math.random()
    })), []);

    return (
        <div className="absolute bottom-20 left-0 w-full h-64 pointer-events-none opacity-60 z-5">
            {flowers.map((f, i) => (
                <div key={i} className="absolute bottom-0 flex flex-col items-center origin-bottom animate-sway-subtle" style={{ left: `${f.left}%`, animationDelay: `${f.delay}s` }}>
                    {/* Stem */}
                    <div className="w-[1px] h-24 bg-green-900/50"></div>
                    {/* Spider Lily Silhouette Shape */}
                    <div className="absolute top-0 transform -translate-y-1/2 scale-75">
                        {/* Radiating Petals */}
                        <div className="w-16 h-16 relative">
                            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, j) => (
                                <div key={j} className="absolute top-1/2 left-1/2 w-[2px] h-8 bg-red-900/80 origin-top rounded-full" style={{ transform: `rotate(${deg}deg) translateX(-50%)` }}>
                                    <div className="absolute bottom-0 left-0 w-1 h-1 bg-red-800 rounded-full blur-[1px]"></div>
                                </div>
                            ))}
                            <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-red-950 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const GiantLily: React.FC<{ x: number }> = ({ x }) => (
    <div className="absolute bottom-24 z-10 pointer-events-none group" style={{ left: `${x}%`, transform: 'translateX(-50%)' }}>
        <div className="relative w-64 h-80 flex flex-col items-center">
            {/* Stem */}
            <div className="absolute bottom-0 w-3 h-full bg-green-950 rounded-full transform -rotate-3"></div>
            
            {/* Leaves */}
            <div className="absolute bottom-10 -left-16 w-40 h-10 bg-green-950 rounded-[100%] rotate-[-25deg]"></div>
            <div className="absolute bottom-40 -right-14 w-32 h-8 bg-green-950 rounded-[100%] rotate-[20deg]"></div>

            {/* Flower Head */}
            <div className="absolute top-0 transform scale-150 animate-sway-subtle origin-bottom filter drop-shadow-[0_0_15px_rgba(255,0,0,0.1)]">
                 {/* Petals (Recurved) */}
                 <div className="absolute top-0 left-0 w-16 h-24 bg-gradient-to-t from-gray-200 via-red-200 to-red-600 rounded-[50%_50%_0_0] transform rotate-[-45deg] origin-bottom-right">
                    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(150,0,0,0.8)_5%,transparent_20%)] bg-[length:6px_6px]"></div>
                 </div>
                 <div className="absolute top-0 right-0 w-16 h-24 bg-gradient-to-t from-gray-200 via-red-200 to-red-600 rounded-[50%_50%_0_0] transform rotate-[45deg] origin-bottom-left">
                    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(150,0,0,0.8)_5%,transparent_20%)] bg-[length:6px_6px]"></div>
                 </div>
                 <div className="absolute -top-10 left-4 w-16 h-24 bg-gradient-to-t from-gray-300 via-red-300 to-red-700 rounded-[50%_50%_0_0] transform scale-90 rotate-[0deg] origin-bottom -z-10">
                     <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(150,0,0,0.8)_5%,transparent_20%)] bg-[length:6px_6px]"></div>
                 </div>
                 
                 {/* Stamens */}
                 <div className="absolute top-10 left-8 w-[2px] h-24 bg-lime-100 rotate-[-20deg]"></div>
                 <div className="absolute top-10 left-12 w-[2px] h-24 bg-lime-100 rotate-[20deg]"></div>
            </div>
            
            {/* Glow */}
            <div className="absolute top-0 w-64 h-64 bg-red-500/10 blur-[60px] rounded-full mix-blend-screen animate-pulse-slow"></div>
        </div>
    </div>
);

export const MonsterVines: React.FC = () => (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 w-full h-[800px] pointer-events-none opacity-0 animate-fade-in-fast" style={{ animationFillMode: 'forwards' }}>
        <style>{`
            @keyframes thrash {
                0% { transform: rotate(0deg) scale(1); }
                25% { transform: rotate(5deg) scale(1.1); }
                50% { transform: rotate(-5deg) scale(1.2); }
                75% { transform: rotate(2deg) scale(1.1); }
                100% { transform: rotate(0deg) scale(1); }
            }
            .animate-thrash { animation: thrash 0.2s infinite linear; }
            @keyframes fade-in-fast { from { opacity: 0; } to { opacity: 1; } }
            .animate-fade-in-fast { animation: fade-in-fast 2s ease-in; }
        `}</style>
        
        {/* Massive silhouette mass rising from center */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[600px] bg-black blur-sm rounded-t-full animate-thrash opacity-90"></div>
        
        {/* Tentacles/Vines */}
        {[...Array(8)].map((_, i) => (
             <div 
                key={i} 
                className="absolute bottom-0 w-32 h-[120vh] bg-black blur-[2px] origin-bottom animate-thrash"
                style={{ 
                    left: `${10 + i * 12}%`, 
                    animationDelay: `${Math.random()}s`,
                    transform: `rotate(${Math.random() * 60 - 30}deg)`
                }}
             ></div>
        ))}

        {/* Red Eyes/Glows */}
        {[...Array(10)].map((_, i) => (
            <div 
                key={`eye-${i}`}
                className="absolute w-8 h-8 bg-red-600 rounded-full blur-md animate-pulse"
                style={{
                    left: `${20 + Math.random() * 60}%`,
                    bottom: `${200 + Math.random() * 400}px`
                }}
            ></div>
        ))}
    </div>
);

// --- Props & Temple Items ---

export const RedBanner: React.FC<{ x: number, text: string, height?: number }> = ({ x, text, height = 200 }) => (
    <div className="absolute bottom-20 z-0 flex flex-col items-center animate-swing" style={{ left: `${x}%`, height: `${height}px`, transformOrigin: 'top center' }}>
        <div className="w-20 h-full bg-[#3a0a0a] border-x border-[#1a0505] flex flex-col items-center pt-8 shadow-2xl">
            <div className="text-[#a00] font-serif font-bold text-4xl writing-vertical opacity-90 tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{text}</div>
        </div>
        {/* Rope */}
        <div className="w-[1px] h-20 bg-yellow-900/30 absolute -top-20"></div>
    </div>
);

export const Candle: React.FC<{ x: number, y?: number }> = ({ x, y = 16 }) => (
    <div className="absolute z-10" style={{ left: `${x}%`, bottom: `${y}px` }}>
        <div className="w-5 h-16 bg-[#5a0a0a] rounded-sm relative shadow-lg">
            {/* Wick */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-black"></div>
            {/* Flame Core - More chaotic */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-2.5 h-6 bg-white rounded-full blur-[1px] animate-flicker z-20" style={{ animationDuration: '0.05s' }}></div>
            {/* Flame Outer - Intense and larger */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-10 h-12 bg-orange-500 rounded-full blur-[6px] animate-flicker z-10 opacity-90" style={{ animationDuration: '0.08s' }}></div>
            {/* Glow - Massive and flickering hard */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-orange-600/30 rounded-full blur-[60px] animate-flicker mix-blend-screen pointer-events-none" style={{ animationDuration: '0.12s' }}></div>
            {/* Dynamic Shadow Cast */}
            <div className="absolute -bottom-2 -left-8 w-20 h-6 bg-black/70 blur-md rounded-full animate-shadow-flicker"></div>
        </div>
    </div>
);

export const Altar: React.FC<{ x: number, state: GameState }> = ({ x, state }) => (
  <div className="absolute bottom-20 z-10 flex flex-col items-center" style={{ left: `${x}%`, transform: 'translateX(-50%)' }}>
    {/* Large Shrine Hall Table Layout */}
    {/* Background Wall Tablet */}
    <div className="absolute -top-40 w-48 h-64 bg-[#1a0505] border-2 border-red-900/40 rounded-t-full shadow-2xl flex items-center justify-center opacity-80">
        <div className="text-red-800 font-serif writing-vertical text-2xl font-bold tracking-widest opacity-40">土界神位</div>
    </div>

    {/* Main Table Structure - Wide enough to span 30% to 70% relative to center if placed at 50% */}
    <div className="relative w-[60vw] max-w-[800px] h-48 bg-[#1a0a0a] border-t-[8px] border-[#2a1010] flex justify-between items-end px-10 pb-10 shadow-[0_10px_60px_rgba(0,0,0,0.9)] z-10">
        {/* Table Texture */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10 pointer-events-none"></div>
        
        {/* Decorative Cloth */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-full bg-red-900/60 triangle-clip pointer-events-none">
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-yellow-500/30 text-4xl font-serif">☠</div>
        </div>

        {/* Legs */}
        <div className="absolute -bottom-16 left-4 w-16 h-24 bg-[#1a0a0a] rounded-b-lg"></div>
        <div className="absolute -bottom-16 right-4 w-16 h-24 bg-[#1a0a0a] rounded-b-lg"></div>

        {/* 1. Flower Spot (Left) - Corresponds to x=30 interactable roughly */}
        <div className="relative flex flex-col items-center w-24 -mt-8">
            <div className="text-xs text-stone-500 mb-2 font-serif tracking-widest opacity-50">供花</div>
            {state.flags.flowerPlaced ? (
                <div className="relative z-20">
                    {/* Visual Flourish: Burst Aura */}
                    <div className="absolute inset-0 bg-red-500/30 blur-xl rounded-full animate-pulse"></div>
                    
                    {/* Glowing Spider Lily Graphic */}
                    <div className="w-20 h-20 relative animate-float filter drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">
                        {/* Petals */}
                        {[0, 60, 120, 180, 240, 300].map((deg) => (
                            <div key={deg} className="absolute top-1/2 left-1/2 w-10 h-2 bg-gradient-to-r from-red-800 to-red-500 rounded-full origin-left" style={{ transform: `rotate(${deg}deg) translateX(-50%)` }}></div>
                        ))}
                        {/* Stamens */}
                         <div className="absolute top-1/2 left-1/2 w-full h-full animate-pulse-slow">
                            {[15, 75, 135, 195, 255, 315].map((deg) => (
                                 <div key={deg} className="absolute top-1/2 left-1/2 w-12 h-0.5 bg-red-300 origin-left" style={{ transform: `rotate(${deg}deg) translateX(-50%)` }}></div>
                            ))}
                         </div>
                    </div>
                    {/* Aura */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-500/20 blur-xl rounded-full animate-pulse"></div>
                </div>
            ) : (
                <div className="w-16 h-16 border-2 border-dashed border-red-900/30 rounded-full flex items-center justify-center opacity-50">
                    <div className="w-2 h-2 bg-red-900/30 rounded-full animate-ping"></div>
                </div>
            )}
        </div>
        
        {/* 2. Incense Spot (Center) - Corresponds to x=50 interactable */}
        <div className="relative flex flex-col items-center -mt-16 mx-4">
             <div className="text-xs text-stone-500 mb-2 font-serif tracking-widest opacity-50">信香</div>
             <div className="relative w-32 h-16 bg-[#2a1212] border border-[#3a1a1a] rounded-sm flex justify-center items-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">
                {/* Ash Bed */}
                <div className="w-24 h-8 bg-stone-600/30 rounded-full blur-[1px]"></div>
                {state.flags.incenseLit && (
                <div className="absolute -top-8 flex space-x-4">
                     {/* Incense Sticks */}
                     {[0, 15, -15].map((angle, i) => (
                         <div key={i} className="w-[2px] h-12 bg-red-900 relative origin-bottom" style={{ transform: `rotate(${angle}deg)` }}>
                             {/* Burning Tip */}
                             <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-orange-500 rounded-full animate-flicker box-shadow-[0_0_5px_orange]"></div>
                             {/* Smoke Particles */}
                             <div className="absolute -top-20 left-0 w-full h-20 overflow-hidden pointer-events-none">
                                 <div className="absolute bottom-0 w-4 h-4 bg-gray-400/20 rounded-full blur-sm animate-float-slow" style={{ animationDelay: `${i * 0.5}s` }}></div>
                                 <div className="absolute bottom-0 w-6 h-6 bg-gray-400/10 rounded-full blur-md animate-float" style={{ animationDelay: `${i * 0.5 + 0.2}s` }}></div>
                             </div>
                         </div>
                     ))}
                     {/* Visual Flourish: Heavy Smoke Cloud */}
                     <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-20 h-40 bg-gray-400/10 blur-xl rounded-full animate-float-slow pointer-events-none"></div>
                </div>
                )}
            </div>
        </div>

        {/* 3. Wine Spot (Right) - Corresponds to x=70 interactable roughly */}
        <div className="relative flex flex-col items-center w-24 -mt-8">
             <div className="text-xs text-stone-500 mb-2 font-serif tracking-widest opacity-50">供酒</div>
             {state.flags.wineDrunk ? (
                <div className="relative transform rotate-90 translate-y-4 opacity-70">
                     {/* Spilled Cup */}
                     <div className="w-10 h-12 border-2 border-stone-600 bg-stone-800 rounded-sm"></div>
                     {/* Puddle */}
                     <div className="absolute -left-10 top-0 w-20 h-10 bg-red-900/60 blur-sm rounded-full transform -skew-x-12"></div>
                     
                     {/* Visual Flourish: Spiritual Vapor */}
                     <div className="absolute -top-20 -left-5 w-24 h-32 bg-gradient-to-t from-red-500/10 to-transparent blur-md animate-pulse-slow pointer-events-none transform -rotate-90"></div>
                </div>
            ) : (
                <div className="relative w-12 h-14 group">
                    <div className="absolute inset-0 bg-stone-800 border border-stone-600 rounded-sm shadow-lg overflow-hidden">
                         <div className="absolute bottom-0 w-full h-4/5 bg-red-900 opacity-90 group-hover:bg-red-700 transition-colors"></div>
                         {/* Liquid Surface */}
                         <div className="absolute top-[20%] w-full h-1 bg-red-400/20 blur-[1px]"></div>
                    </div>
                </div>
            )}
        </div>
    </div>
  </div>
);