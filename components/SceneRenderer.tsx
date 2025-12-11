import React from 'react';
import { GameScene, Interactable, GameState } from '../types';
import { Sparkles, ChevronDown, Hand, Ghost, Eye } from 'lucide-react';
import { Moon, TownBackground, Crowd, Road, FloodWater } from './SceneElements';
import Player from './Player';
import NineSong from './NineSong';
import ForestLevel from './ForestLevel';
import SearchLevel from './SearchLevel';
import PathLevel from './PathLevel';
import TempleLevel from './TempleLevel';

interface SceneRendererProps {
  state: GameState;
  interactables: Interactable[];
  onInteract: (target: Interactable) => void;
  sceneWidth: number;
  isMoving: boolean;
  isLyingDown?: boolean; 
  facingDir?: 1 | -1;
  isVisionMode: boolean;
  visionRadius?: number; 
  climaxStep?: number; // New prop for camera control during climax
}

// --- Main Renderer ---

const SceneRenderer: React.FC<SceneRendererProps> = ({ state, interactables, onInteract, sceneWidth, isMoving, isLyingDown, facingDir = 1, isVisionMode, visionRadius = 250, climaxStep = 0 }) => {

  const isWhisperZone = state.currentScene === GameScene.FOREST && state.playerX > 10 && state.playerX < 90;
  const isTempleScene = state.currentScene === GameScene.TEMPLE || state.currentScene === GameScene.CLIMAX;
  
  const holdingItem = state.flags.seedPlanted ? 'pot' : undefined;

  // Camera Logic
  const ZOOM_LEVEL = 1.3; 
  const VIEWPORT_CENTER = 50; 
  const worldWidthVw = 100 * ZOOM_LEVEL;

  // Calculate Target Focus Point
  // If Climax Step > 0 (Shadow/Smash), force focus to Altar (x=50) so player sees the event
  let focusX = state.playerX;
  if (climaxStep > 0) {
      focusX = 50; 
  }

  const focusPosVw = (focusX / 100) * worldWidthVw;
  let offsetVw = VIEWPORT_CENTER - focusPosVw;
  const maxOffset = 0;
  const minOffset = 100 - worldWidthVw;

  if (offsetVw > maxOffset) offsetVw = maxOffset;
  if (offsetVw < minOffset) offsetVw = minOffset;

  const playerScreenPosVw = (state.playerX / 100 * worldWidthVw) + offsetVw;

  return (
    <div 
        className={`relative w-full h-full overflow-hidden bg-[#1a1d26] transition-all duration-700`}
        style={{
            filter: isVisionMode ? 'saturate(0.2) contrast(1.1)' : 'none'
        }}
    >
      
      {isVisionMode && (
         <div 
            className="absolute inset-0 pointer-events-none z-[60] bg-black/60 backdrop-blur-sm animate-pulse-slow"
            style={{
                maskImage: `radial-gradient(circle at ${playerScreenPosVw}vw 70%, transparent ${visionRadius}px, black ${visionRadius + 100}px)`,
                WebkitMaskImage: `radial-gradient(circle at ${playerScreenPosVw}vw 70%, transparent ${visionRadius}px, black ${visionRadius + 100}px)`,
            }}
         >
            <div className="absolute inset-0 bg-red-900/10 mix-blend-overlay"></div>
         </div>
      )}

      {/* --- STATIC & PARALLAX BACKGROUND LAYERS --- */}
      
      <div className="absolute inset-0 bg-gradient-to-b from-[#2a2f3d] via-[#1a1d26] to-[#0f111a] z-0"></div>
      <Moon />
      
      <div className="absolute inset-0 z-0 transition-transform duration-75" style={{ transform: `translateX(${offsetVw * 0.15}vw)` }}>
        <TownBackground />
        <Crowd />
      </div>

      <div className="absolute inset-0 pointer-events-none z-50 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.3)_80%,rgba(0,0,0,0.6)_100%)]"></div>

      <div 
        className="absolute inset-0 pointer-events-none z-40 transition-opacity duration-1000"
        style={{ 
            background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.6) 90%)', 
            opacity: isWhisperZone ? 0.5 : 0 
        }}
      ></div>

      {/* --- SCENE WORLD CONTAINER (Camera Movement) --- */}
      <div 
        className="absolute top-0 left-0 h-full z-10 will-change-transform"
        style={{ 
            width: `${worldWidthVw}vw`, 
            transform: `translateX(${offsetVw}vw)`,
            // Fix: Remove transition during movement to prevent lag/choppiness. 
            // Only transition for cinematic pans (climax or scene shifts).
            transition: (isMoving && climaxStep === 0) ? 'none' : 'transform 1.5s ease-in-out'
        }}
      >
        <Road />

        {/* --- LEVEL CONTENT RENDERER --- */}
        {state.currentScene === GameScene.FOREST && <ForestLevel />}
        {(state.currentScene === GameScene.MEETING || state.currentScene === GameScene.SEARCH) && <SearchLevel isVisionMode={isVisionMode} />}
        {state.currentScene === GameScene.PATH && <PathLevel />}
        {isTempleScene && <TempleLevel state={state} climaxStep={climaxStep} />}


        {/* Interactables */}
        {interactables.map(item => {
            if (item.type === 'seed' && state.flags.hasSeed) return null;
            let label = item.label;
            let icon = <Sparkles className="w-8 h-8 text-yellow-100 animate-pulse drop-shadow-[0_0_8px_rgba(255,255,200,0.8)] relative z-10" />;
            
            if (item.type === 'pot') icon = <div className={`w-12 h-12 rounded-t-lg border-2 shadow-[0_0_15px_rgba(255,255,255,0.2)] relative z-10 ${state.flags.seedPlanted ? 'border-green-700 bg-green-900' : 'border-stone-500 bg-stone-700'}`}></div>;
            if (item.type === 'shadow') icon = <Ghost className="w-8 h-8 text-red-900 animate-bounce relative z-10" />;
            if (item.type === 'ninesong') icon = <div className="w-12 h-32"></div>; 
            
            if (item.type === 'seed') {
                 if (!isVisionMode) return null; 
                 icon = (
                    <div className="relative">
                        <div className="w-4 h-4 bg-white rounded-full blur-[2px] animate-pulse"></div>
                        <div className="absolute inset-0 w-8 h-8 bg-white/30 rounded-full blur-md animate-pulse-ring -translate-x-2 -translate-y-2"></div>
                    </div>
                 );
                 label = "看取";
            }

            const isAltarItem = ['altar_flower', 'altar_incense', 'altar_wine'].includes(item.type);
            if (isAltarItem) {
                icon = <div className="w-12 h-12"></div>; 
            }

            const inRange = Math.abs(state.playerX - item.x) < 10;

            return (
              <div 
                key={item.id} 
                className="absolute bottom-28 -translate-x-1/2 z-40 flex flex-col items-center group cursor-pointer transition-all duration-300"
                style={{ 
                    left: `${item.x}%`, 
                    opacity: Math.abs(state.playerX - item.x) < 20 ? 1 : 0.4,
                    bottom: isAltarItem ? '180px' : '7rem' 
                }}
                onClick={() => onInteract(item)}
              >
                 {inRange && item.type !== 'ninesong' && !isAltarItem && (
                    <>
                        <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-white/10 rounded-full animate-pulse-ring pointer-events-none z-0"></div>
                        <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white/10 rounded-full animate-pulse-ring delay-75 pointer-events-none z-0"></div>
                    </>
                 )}

                 <div className={`flex flex-col items-center mb-1 z-20 transition-all duration-300 ${inRange ? 'scale-125 -translate-y-4 filter drop-shadow-[0_0_15px_rgba(255,255,200,0.6)]' : ''}`}>
                    {inRange && item.type !== 'ninesong' && !isAltarItem && <ChevronDown className="text-white w-6 h-6 drop-shadow-md animate-bounce" />}
                    {icon}
                 </div>
                 
                 <div className={`mt-2 px-3 py-1 rounded bg-black/60 backdrop-blur-sm border border-white/20 text-xs font-serif tracking-widest transition-all duration-300 ${inRange ? 'text-yellow-200 opacity-100 shadow-[0_0_10px_rgba(255,255,200,0.2)] scale-110' : 'text-gray-400 opacity-0 group-hover:opacity-100'}`}>
                    {label} {inRange && <span className="text-[10px] ml-1 opacity-70">[SPACE]</span>}
                 </div>
              </div>
            );
        })}

        {/* Characters */}
        {state.currentScene !== GameScene.INTRO && <Player x={state.playerX} isMoving={isMoving} isLyingDown={isLyingDown} facingDir={facingDir} holdingItem={holdingItem} />}
        
        {state.currentScene === GameScene.MEETING && <NineSong x={85} />}
        {state.currentScene === GameScene.SEARCH && <NineSong x={30} />}
        {state.currentScene === GameScene.PATH && <NineSong x={90} />}
        {state.currentScene === GameScene.TEMPLE && <NineSong x={15} />}
        {state.currentScene === GameScene.CLIMAX && <NineSong x={15} />}

      </div>

      <FloodWater />

    </div>
  );
};

export default SceneRenderer;