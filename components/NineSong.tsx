import React from 'react';

const NineSong: React.FC<{ x: number }> = ({ x }) => (
  <div 
    className="absolute bottom-28 z-20 transition-all duration-1000" 
    style={{ left: `${x}%`, transform: 'translateX(-50%) scale(0.5)', transformOrigin: 'bottom center' }}
  >
      <div className="relative w-32 h-48 flex flex-col items-center animate-float-slow">
         {/* Ethereal Glow & Halo */}
         <div className="absolute inset-0 bg-red-400/20 blur-[40px] rounded-full animate-pulse-slow"></div>
         <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-28 h-28 bg-white/5 rounded-full blur-xl mix-blend-overlay"></div>

         {/* Back Hair - Flowing */}
         <div className="absolute top-2 w-40 h-56 bg-[#0a0505] opacity-95 rounded-[50%_50%_40%_40%] -z-10 shadow-2xl skew-x-1 origin-top animate-sway-subtle"></div>

         {/* Floating Ribbons (Piaodai) */}
         <div className="absolute top-14 left-1/2 -translate-x-1/2 w-48 h-48 pointer-events-none">
             {/* Left Ribbon */}
             <div className="absolute top-0 left-0 w-24 h-48 border-l-[8px] border-t-[2px] border-red-900/40 rounded-[100%] rotate-12 animate-ribbon-flow"></div>
             {/* Right Ribbon */}
             <div className="absolute top-0 right-0 w-24 h-48 border-r-[8px] border-t-[2px] border-red-900/40 rounded-[100%] -rotate-12 animate-ribbon-flow-reverse"></div>
         </div>

         {/* Body - Elegant Hanfu (Smaller) */}
         <div className="relative z-10 w-20 h-full flex flex-col items-center">
             {/* Upper Dress */}
             <div className="w-16 h-20 bg-gradient-to-b from-[#2a0a0a] via-[#3a1010] to-[#2a0a0a] rounded-t-2xl relative overflow-hidden shadow-lg border-b border-red-800/30">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-40"></div>
                  {/* Collar */}
                  <div className="absolute top-0 w-full h-full border-t-[10px] border-red-950 rounded-t-2xl"></div>
             </div>
             
             {/* Waist Sash */}
             <div className="w-18 h-6 bg-red-700 shadow-[0_4px_10px_rgba(0,0,0,0.5)] z-20 flex items-center justify-center relative">
                 <div className="w-4 h-4 bg-yellow-600 rotate-45 border border-yellow-200 shadow-sm"></div>
                 {/* Tassel */}
                 <div className="absolute -bottom-10 w-0.5 h-10 bg-red-500/80"></div>
             </div>

             {/* Skirt */}
             <div className="w-24 h-32 bg-gradient-to-b from-[#1a0505] via-[#2a0a0a] to-black rounded-b-3xl -mt-1 relative overflow-hidden shadow-2xl">
                 <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,transparent_0%,black_100%)]"></div>
             </div>
         </div>

         {/* Sleeves */}
         <div className="absolute top-16 -left-10 w-14 h-36 bg-gradient-to-b from-[#2a0505] to-transparent rounded-l-[30px] rotate-12 z-0 animate-sway-slow origin-top-right backdrop-blur-[1px]"></div>
         <div className="absolute top-16 -right-10 w-14 h-36 bg-gradient-to-b from-[#2a0505] to-transparent rounded-r-[30px] -rotate-12 z-0 animate-sway-slow-reverse origin-top-left backdrop-blur-[1px]"></div>

         {/* Head (Smaller) */}
         <div className="absolute -top-2 w-14 h-16 z-20">
             {/* Face */}
             <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-12 bg-[#fff0f0] rounded-[45%_45%_60%_60%] shadow-[inset_0_-4px_8px_rgba(0,0,0,0.1)] overflow-hidden">
                 {/* Bangs */}
                 <div className="absolute top-0 w-full h-6 bg-black"></div>
                 <div className="absolute top-0 -left-1 w-4 h-14 bg-black rotate-2"></div>
                 <div className="absolute top-0 -right-1 w-4 h-14 bg-black -rotate-2"></div>
                 
                 {/* Features */}
                 <div className="absolute top-7 left-1/2 -translate-x-1/2 w-8 flex justify-between px-1.5 opacity-60">
                     <div className="w-2 h-[1px] bg-black rotate-12"></div> 
                     <div className="w-2 h-[1px] bg-black -rotate-12"></div>
                 </div>
                 <div className="absolute top-8 left-1/2 -translate-x-1/2 w-6 flex justify-between px-1">
                     <div className="w-1 h-0.5 bg-red-950/80 rounded-full"></div> 
                     <div className="w-1 h-0.5 bg-red-950/80 rounded-full"></div>
                 </div>
             </div>
             
             {/* Hair Ornaments */}
             <div className="absolute top-2 -left-2 w-0.5 h-10 bg-yellow-500/60 skew-x-6 origin-top animate-dangle"></div>
             <div className="absolute top-2 -right-2 w-0.5 h-10 bg-yellow-500/60 -skew-x-6 origin-top animate-dangle"></div>
             <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-16 h-10 bg-black rounded-t-full z-[-1]"></div>
         </div>
      </div>
  </div>
);

export default NineSong;