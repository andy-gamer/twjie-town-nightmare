
import React from 'react';
import { Altar, RedBanner, Candle, ShadowFigure } from './SceneElements';
import { GameScene, GameState } from '../types';

interface TempleLevelProps {
    state: GameState;
    climaxStep?: number; // 0: Normal, 1: Shadow Rises, 2: Smash
}

const TempleLevel: React.FC<TempleLevelProps> = ({ state, climaxStep = 0 }) => {
  const isClimax = state.currentScene === GameScene.CLIMAX;

  return (
    <div className={`absolute inset-0 transition-colors duration-1000 ${isClimax ? 'bg-red-950/90' : 'bg-red-950/20'}`}>
        <style>{`
            @keyframes rise-up {
                0% { transform: translate(-50%, 100%) scale(0.8); opacity: 0; }
                100% { transform: translate(-50%, -20%) scale(1.5); opacity: 1; }
            }
            .animate-rise-up { animation: rise-up 3s ease-out forwards; }

            @keyframes vine-smash {
                0% { transform: translateY(-100vh); }
                60% { transform: translateY(0); }
                70% { transform: translateY(-20px); }
                100% { transform: translateY(0); }
            }
            .animate-vine-smash { animation: vine-smash 0.3s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        `}</style>

        {/* Deep background pulsing gloom */}
        <div className="absolute inset-0 bg-black/40 animate-pulse-slow mix-blend-multiply pointer-events-none"></div>

        {/* FATHER SHADOW - Emerging from BEHIND the Altar (z-0) */}
        {climaxStep >= 1 && (
            <div className="absolute bottom-40 left-1/2 w-64 h-[600px] z-0 animate-rise-up origin-bottom">
                 {/* Main Body */}
                 <div className="absolute bottom-0 w-full h-full bg-[#050000] rounded-t-[40%] blur-[4px]"></div>
                 {/* Head */}
                 <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-56 bg-[#050000] rounded-full blur-[2px]"></div>
                 {/* Red Eyes */}
                 <div className="absolute top-20 left-[35%] w-4 h-2 bg-red-600 blur-[2px] animate-pulse"></div>
                 <div className="absolute top-20 right-[35%] w-4 h-2 bg-red-600 blur-[2px] animate-pulse"></div>
                 {/* Multiple Arms fanning out */}
                 {[...Array(6)].map((_,i) => (
                      <div key={i} className="absolute top-40 w-8 h-64 bg-[#050000] blur-[3px] origin-top" style={{ left: '50%', transform: `rotate(${(i-2.5)*30}deg)` }}></div>
                 ))}
            </div>
        )}

        {/* VINE SMASH - In front of everything (z-50) */}
        {climaxStep >= 2 && (
            <div className="absolute inset-0 z-50 pointer-events-none">
                {/* Vines targeting NineSong (x=15) and Yan (dynamic playerX) */}
                <div className="absolute -top-20 left-[15%] w-24 h-[120vh] bg-[#0a0202] animate-vine-smash blur-sm" style={{ animationDelay: '0.05s' }}></div>
                <div className="absolute -top-20 w-24 h-[120vh] bg-[#0a0202] animate-vine-smash blur-sm" style={{ left: `${state.playerX}%`, transform: 'translateX(-50%)', animationDelay: '0.02s' }}></div>
                {/* Center smash for impact */}
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-[120vh] bg-[#0a0202] animate-vine-smash blur-sm"></div>
                
                {/* Screen Flash on impact */}
                <div className="absolute inset-0 bg-red-600 mix-blend-color animate-ping" style={{ animationDuration: '0.2s' }}></div>
            </div>
        )}

        {/* CLIMAX: Horror Atmosphere Overlays */}
        {isClimax && (
            <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
                {/* Rapid Strobe Effect */}
                <div className="absolute inset-0 bg-red-600/10 mix-blend-color-dodge animate-flicker" style={{ animationDuration: '0.15s' }}></div>
                
                {/* Closing Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_30%,black_100%)] animate-pulse" style={{ animationDuration: '0.5s' }}></div>
                
                {/* Screen Noise/Chaos */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-shake mix-blend-overlay"></div>
            </div>
        )}

        {/* Central Altar Pulsing Light */}
        <div className={`absolute bottom-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] blur-[100px] rounded-full mix-blend-screen pointer-events-none ${isClimax ? 'bg-red-600/40 animate-flicker' : 'bg-red-600/20 animate-pulse-slow'}`}></div>

        {/* Altar covers the range where interactables are (30 to 70) */}
        {/* Altar is z-10, so Shadow (z-0) appears behind it */}
        <Altar x={50} state={state} />
        
        {/* Banners - Swing violently in Climax */}
        <div className={isClimax ? 'animate-shake' : ''}>
            <RedBanner x={15} text="國泰民安" />
            <RedBanner x={85} text="風調雨順" />
        </div>
        
        {/* Candles with enhanced lighting - Flickering intensely in Climax */}
        <div className={isClimax ? 'animate-flicker' : ''}>
            <Candle x={20} />
            <Candle x={80} />
            <Candle x={25} y={30} />
            <Candle x={75} y={30} />
        </div>
        
        {/* Center Altar Eerie Glow - Pulsing heart of the temple */}
        <div className={`absolute bottom-40 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-red-600/30 blur-[80px] rounded-full mix-blend-screen pointer-events-none ${isClimax ? 'animate-ping' : 'animate-pulse'}`} style={{ animationDuration: isClimax ? '1s' : '4s' }}></div>

        {/* Oppressive Ceiling Shadow */}
        <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-black via-red-950/20 to-transparent pointer-events-none z-20"></div>

        {/* Shadows blocking the way */}
        <ShadowFigure x={-5} />
        <ShadowFigure x={5} />

        {/* --- Dynamic Atmosphere Effects --- */}
        <div className="absolute inset-0 z-35 pointer-events-none overflow-hidden">
              {/* Flickering wall shadows (Simulated candlelight casting) */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,transparent_30%,rgba(0,0,0,0.6)_80%)] animate-shadow-flicker mix-blend-multiply"></div>
              
              {/* Pulsing Vignette */}
              <div className={`absolute inset-0 box-border border-[50px] border-black/10 blur-xl ${isClimax ? 'animate-pulse' : 'animate-pulse-slow'}`}></div>

              {/* Light Leaks / Spirit Orbs */}
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-500/5 rounded-full blur-xl animate-float-slow mix-blend-screen"></div>
              <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-orange-500/5 rounded-full blur-2xl animate-float mix-blend-screen" style={{ animationDelay: '2s' }}></div>

              {/* Moving Shadow Bars (Like slats or cage) */}
              <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_100px,rgba(0,0,0,0.1)_120px)] opacity-30 mix-blend-multiply animate-sway-subtle"></div>
              
              {/* Global Red Tint Flicker */}
              <div className="absolute inset-0 bg-red-900/5 mix-blend-overlay animate-flicker-subtle"></div>

              {/* Central Pulsing Radiation from Altar */}
              <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[100px] mix-blend-color-dodge animate-pulse-ring pointer-events-none"></div>
        </div>
    </div>
  );
};

export default TempleLevel;