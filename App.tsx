
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameScene, GameState, DialogueLine, Interactable, Subtitle } from './types';
import { SCRIPT, SUBTITLES } from './assets/script';
import { BASE_INTERACTABLES } from './assets/levelData.ts';
import SceneRenderer from './components/SceneRenderer';
import DialogueBox from './components/DialogueBox';
import { audioManager } from './utils/AudioManager';
import { useGameInput } from './hooks/useGameInput';
import { Play, Eye } from 'lucide-react';

const INITIAL_STATE: GameState = {
  currentScene: GameScene.INTRO,
  playerX: 5,
  inventory: [],
  flags: {
    hasMetNineSong: false,
    hasSeed: false,
    seedPlanted: false,
    enteredTemple: false,
    flowerPlaced: false,
    incenseLit: false,
    wineDrunk: false,
  }
};

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [activeDialogue, setActiveDialogue] = useState<DialogueLine[] | null>(null);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [activeSubtitle, setActiveSubtitle] = useState<Subtitle | null>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [showEpilogue, setShowEpilogue] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showVisionTutorial, setShowVisionTutorial] = useState(false); 
  const [isMoving, setIsMoving] = useState(false);
  const [blockMessage, setBlockMessage] = useState<string | null>(null);
  const [isLyingDown, setIsLyingDown] = useState(false); 
  const [transitionOpacity, setTransitionOpacity] = useState(0); 
  const [facingDir, setFacingDir] = useState<1 | -1>(1); 
  const [isVisionMode, setIsVisionMode] = useState(false);
  const [isShaking, setIsShaking] = useState(false); 
  
  // Climax Sequence State
  // 0: Normal, 1: Shadow Emerging, 2: Vines Smashing
  const [climaxStep, setClimaxStep] = useState<0 | 1 | 2>(0); 
  
  // Dialogue Control States
  const [dialogueTyping, setDialogueTyping] = useState(false);
  const [forceShowDialogue, setForceShowDialogue] = useState(false);
  
  // Refs for logic
  const subtitleTimeoutRef = useRef<number | null>(null);
  const blockMessageTimeoutRef = useRef<number | null>(null);
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0); 
  const lastFootstepTime = useRef<number>(0);
  const stateRef = useRef<GameState>(INITIAL_STATE);
  const activeDialogueRef = useRef(activeDialogue);
  const currentLineIndexRef = useRef(currentLineIndex);
  const activeSubtitleRef = useRef(activeSubtitle);
  const isTransitioningRef = useRef(false);
  const dialogueTypingRef = useRef(dialogueTyping);
  const introMonologuePlayedRef = useRef(false);
  
  const isMovingRef = useRef(false);
  const isVisionModeRef = useRef(false);

  const VISION_RADIUS = 250; 

  // Input Hook
  const { keysPressed, addKey, removeKey } = useGameInput(hasStarted && !gameEnded && !showEpilogue);

  useEffect(() => { stateRef.current = gameState; }, [gameState]);
  useEffect(() => { activeDialogueRef.current = activeDialogue; }, [activeDialogue]);
  useEffect(() => { currentLineIndexRef.current = currentLineIndex; }, [currentLineIndex]);
  useEffect(() => { activeSubtitleRef.current = activeSubtitle; }, [activeSubtitle]);
  useEffect(() => { dialogueTypingRef.current = dialogueTyping; }, [dialogueTyping]);
  useEffect(() => { isVisionModeRef.current = isVisionMode; }, [isVisionMode]);

  // -- Initialization --

  const handleStart = () => {
      audioManager.init();
      setHasStarted(true);
      setShowTutorial(true); 
      audioManager.playDrone('forest');
      
      setGameState(prev => ({ ...prev, currentScene: GameScene.FOREST })); 
      setIsLyingDown(true);

      setTimeout(() => {
          setIsLyingDown(false); 
          // Auto-play intro dialogue after standing up
          setTimeout(() => {
              startDialogue(SCRIPT.intro);
          }, 500);
      }, 3000);
  };

  // -- Helper: Get Objective Hint --
  const getCurrentObjective = () => {
      const s = gameState;
      if (s.currentScene === GameScene.INTRO || (s.currentScene === GameScene.FOREST && s.playerX < 20)) return "調查四周...";
      if (!s.flags.hasMetNineSong) return "跟隨聲音的來源";
      if (!s.flags.hasSeed) return "開啟「看取」(F) 尋找遺失之物";
      if (!s.flags.seedPlanted) return "歸還種子至花盆";
      if (s.currentScene === GameScene.PATH) return "前往九姑娘廟";
      if (s.currentScene === GameScene.TEMPLE) {
          if (!s.flags.flowerPlaced) return "儀式: 獻上花朵";
          if (!s.flags.incenseLit) return "儀式: 點燃信香";
          if (!s.flags.wineDrunk) return "儀式: 飲下供酒";
          return "儀式完成...";
      }
      return "前往深處";
  }

  // -- Scene Configuration --
  const getInteractables = useCallback((): Interactable[] => {
    const s = stateRef.current;
    const baseItems = BASE_INTERACTABLES[s.currentScene] || [];
    
    return baseItems.map(item => {
        if (item.type === 'altar_flower') return { ...item, completed: s.flags.flowerPlaced };
        if (item.type === 'altar_incense') return { ...item, completed: s.flags.incenseLit };
        if (item.type === 'altar_wine') return { ...item, completed: s.flags.wineDrunk };
        return item;
    });
  }, []);

  // -- Scene Transition --
  const transitionToScene = useCallback((newScene: GameScene, newX: number, onComplete?: () => void) => {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;
      
      setTransitionOpacity(1); 

      setTimeout(() => {
          setGameState(prev => ({ ...prev, currentScene: newScene, playerX: newX }));
          if (onComplete) onComplete();
          
          setTimeout(() => {
              setTransitionOpacity(0); 
              setTimeout(() => { 
                  isTransitioningRef.current = false; 
              }, 1200); 
          }, 800);
      }, 1200); 
  }, []);


  // -- Interaction Logic --

  const startDialogue = useCallback((lines: DialogueLine[], onFinish?: () => void) => {
    setActiveDialogue(null);
    setCurrentLineIndex(0);
    
    requestAnimationFrame(() => {
        keysPressed.current.clear();
        setIsMoving(false); 
        isMovingRef.current = false;
        setActiveDialogue(lines);
        setCurrentLineIndex(0);
        setDialogueTyping(true); 
        setForceShowDialogue(false);
        (window as any).dialogueCallback = onFinish;
    });
  }, [keysPressed]);

  const handleNextDialogue = useCallback(() => {
    const dialogue = activeDialogueRef.current;
    const index = currentLineIndexRef.current;

    if (!dialogue) return;

    if (dialogueTypingRef.current) {
        setForceShowDialogue(true);
        return;
    }

    if (index < dialogue.length - 1) {
      setCurrentLineIndex(prev => prev + 1);
      setDialogueTyping(true);
      setForceShowDialogue(false);
    } else {
      setActiveDialogue(null);
      setDialogueTyping(false);
      const cb = (window as any).dialogueCallback;
      if (cb) { cb(); (window as any).dialogueCallback = null; }
    }
  }, []);

  const handleTypingComplete = useCallback(() => {
      setDialogueTyping(false);
  }, []);

  const triggerClimax = useCallback(() => {
      if (stateRef.current.currentScene === GameScene.CLIMAX) return; 
      
      audioManager.stopDrone();
      audioManager.playScare(); // Initial scare
      
      setGameState(prev => ({ ...prev, currentScene: GameScene.CLIMAX }));
      setIsLyingDown(true); // Player falls
      setIsShaking(true);
      
      // Sequence: Fall -> Shadow Rises -> Dialogue -> Smash -> Blackout
      setTimeout(() => {
          // 1. Shadow Emerges
          setClimaxStep(1); 
          audioManager.playDrone('forest'); // Ominous sound return
          
          setTimeout(() => {
               // 2. Dialogue (Triggered after shadow is visible)
               startDialogue(SCRIPT.climax, () => {
                   // 3. Vines Smash (After dialogue)
                   setClimaxStep(2);
                   audioManager.playScare(); // Impact sound
                   setIsShaking(true);

                   setTimeout(() => {
                        // 4. Blackout
                        setTransitionOpacity(1); 
                        setIsShaking(false);
                        
                        setTimeout(() => {
                             // 5. Epilogue
                             setShowEpilogue(true);
                             setTransitionOpacity(0);
                        }, 2500);
                   }, 800); // Time for smash animation
               });
          }, 3000); // Wait for Shadow to fully rise
      }, 1000); // Wait for fall

  }, [startDialogue]);

  const handleInteraction = useCallback((target: Interactable) => {
    if (target.completed || isTransitioningRef.current || gameEnded) return; 

    if (target.type === 'seed' && !isVisionModeRef.current) return;

    audioManager.playInteract();
    const currentState = stateRef.current;

    if (target.type === 'ninesong') {
        startDialogue(SCRIPT.templeRepeat);
    }

    if (target.type === 'shadow') {
        startDialogue(SCRIPT.shadows);
    }

    if (target.type === 'seed' && !currentState.flags.hasSeed) {
        startDialogue(SCRIPT.foundSeed, () => {
            setGameState(prev => ({ ...prev, flags: { ...prev.flags, hasSeed: true }}));
        });
    }

    if (target.type === 'pot') {
        if (currentState.flags.hasSeed && !currentState.flags.seedPlanted) {
            setGameState(prev => ({ ...prev, flags: { ...prev.flags, seedPlanted: true }}));
            startDialogue(SCRIPT.plantedSeed, () => {
                 audioManager.stopDrone();
                 transitionToScene(GameScene.PATH, 5, () => {
                     setTimeout(() => audioManager.playDrone('chanting'), 500); 
                 });
            });
        }
    }

    if (target.type === 'lily') {
        startDialogue(SCRIPT.lilyEncounter);
    }

    if (target.type === 'door') {
        startDialogue(SCRIPT.beforeTemple, () => {
            transitionToScene(GameScene.TEMPLE, 15, () => {
                audioManager.playDrone('chanting');
                setTimeout(() => {
                     startDialogue(SCRIPT.templeIntro);
                }, 500);
            });
        });
    }

    if (['altar_flower', 'altar_incense', 'altar_wine'].includes(target.type)) {
        setGameState(prev => {
            const newFlags = { ...prev.flags };
            if (target.type === 'altar_flower') newFlags.flowerPlaced = true;
            if (target.type === 'altar_incense') newFlags.incenseLit = true;
            if (target.type === 'altar_wine') newFlags.wineDrunk = true;
            
            if (newFlags.flowerPlaced && newFlags.incenseLit && newFlags.wineDrunk) {
                if (!gameEnded && prev.currentScene !== GameScene.CLIMAX) {
                    setTimeout(triggerClimax, 800);
                }
            }
            return { ...prev, flags: newFlags };
        });
    }
  }, [startDialogue, triggerClimax, transitionToScene, gameEnded]);

  const showBlockHint = useCallback(() => {
      if (blockMessageTimeoutRef.current) return; 
      setBlockMessage("有一種力量阻止我往左...");
      blockMessageTimeoutRef.current = window.setTimeout(() => {
          setBlockMessage(null);
          blockMessageTimeoutRef.current = null;
      }, 2000);
  }, []);

  // -- Game Loop --

  const gameLoop = useCallback((time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const deltaTime = Math.min(time - lastTimeRef.current, 50); 
    lastTimeRef.current = time;

    // During Climax steps, freeze movement
    if (climaxStep > 0) {
        if (isMovingRef.current) {
            setIsMoving(false);
            isMovingRef.current = false;
        }
        requestRef.current = requestAnimationFrame(gameLoop);
        return;
    }

    if (!hasStarted || gameEnded || showEpilogue || activeDialogueRef.current || isLyingDown || isTransitioningRef.current) {
        if (isMovingRef.current) {
            setIsMoving(false);
            isMovingRef.current = false;
        }
        requestRef.current = requestAnimationFrame(gameLoop);
        return;
    }

    const keys = keysPressed.current;
    const currentState = stateRef.current;
    
    let moveDist = 0;
    
    const SPEED = 0.0086; 

    const isMovingRight = keys.has('ArrowRight') || keys.has('d');
    const isMovingLeft = keys.has('ArrowLeft') || keys.has('a');

    if (isMovingRight) {
        moveDist += SPEED * deltaTime; 
        if (showTutorial) setShowTutorial(false);
        setFacingDir(1);
    }
    
    if (isMovingLeft) {
        if (currentState.currentScene === GameScene.TEMPLE && currentState.playerX < 12) {
             showBlockHint();
        } else {
             moveDist -= SPEED * deltaTime;
             setFacingDir(-1);
        }
    }

    if (moveDist !== 0) {
        setGameState(prev => {
            const clampedX = Math.max(0, Math.min(100, prev.playerX + moveDist));
            return { ...prev, playerX: clampedX };
        });

        if (!isMovingRef.current) {
             setIsMoving(true);
             isMovingRef.current = true;
        }
        
        const now = Date.now();
        const stepDelay = 400; 
        if (now - lastFootstepTime.current > stepDelay) { 
            audioManager.playFootstep();
            lastFootstepTime.current = now;
        }
    } else {
        if (isMovingRef.current) {
            setIsMoving(false);
            isMovingRef.current = false;
        }
    }

    requestRef.current = requestAnimationFrame(gameLoop);
  }, [hasStarted, gameEnded, showEpilogue, keysPressed, showTutorial, showBlockHint, isLyingDown, climaxStep]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameLoop]);

  // -- Interaction Key Listener --
  useEffect(() => {
      const handler = (e: KeyboardEvent) => {
          if (!hasStarted || gameEnded || showEpilogue) return;
          
          if (e.key.toLowerCase() === 'f') {
               setIsVisionMode(prev => !prev);
               setShowVisionTutorial(false);
               return;
          }

          if (e.key === ' ' || e.key === 'Enter') {
              if (activeDialogueRef.current) {
                  handleNextDialogue();
                  return;
              } 
              
              if (!isLyingDown && climaxStep === 0) { // Block interaction during climax sequence
                  const interactables = getInteractables();
                  const currentX = stateRef.current.playerX;
                  const target = interactables.find(i => Math.abs(currentX - i.x) < 10);
                  if (target) handleInteraction(target);
              }
          }
      };
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
  }, [hasStarted, gameEnded, showEpilogue, handleNextDialogue, handleInteraction, getInteractables, isLyingDown, climaxStep]);


  // -- Logic Triggers --
  useEffect(() => {
    const { playerX, currentScene, flags } = gameState;
    if (isTransitioningRef.current) return;

    if (currentScene === GameScene.FOREST) {
         // Changed: Intro dialogue now plays at start.
         // Only trigger scene transition at the end.
         if (playerX > 98) {
             transitionToScene(GameScene.MEETING, 2);
         }
    }
    
    if (currentScene === GameScene.MEETING && playerX > 60 && !flags.hasMetNineSong) {
        startDialogue(SCRIPT.meeting, () => {
            setGameState(prev => ({ ...prev, currentScene: GameScene.SEARCH, flags: { ...prev.flags, hasMetNineSong: true }}));
            setTimeout(() => setShowVisionTutorial(true), 500);
        });
    }
  }, [gameState, startDialogue, transitionToScene]);

  // -- Subtitle Logic --
  useEffect(() => {
    const subtitles = SUBTITLES[gameState.currentScene];
    if (!subtitles) return;
    
    const nearbySubtitle = subtitles.find(s => Math.abs(gameState.playerX - s.triggerX) < 8);
    
    if (nearbySubtitle && activeSubtitle?.id !== nearbySubtitle.id) {
        setActiveSubtitle(nearbySubtitle);
        // Play muttering sound for forest subtitles
        if (gameState.currentScene === GameScene.FOREST) {
             audioManager.playGhostWhisper();
        }

        if (subtitleTimeoutRef.current) window.clearTimeout(subtitleTimeoutRef.current);
        const duration = nearbySubtitle.duration || Math.max(3000, nearbySubtitle.text.length * 200);
        subtitleTimeoutRef.current = window.setTimeout(() => setActiveSubtitle(null), duration);
    }
  }, [gameState.playerX, gameState.currentScene, activeSubtitle]);


  // -- Render --

  if (!hasStarted) {
      return (
        <div className="w-full h-screen bg-black flex flex-col items-center justify-center text-white cursor-pointer" onClick={handleStart}>
            <div className="text-center animate-pulse z-50 relative group">
                <h1 className="text-9xl font-serif mb-8 text-red-800 tracking-[0.2em] font-bold drop-shadow-[0_0_15px_rgba(153,27,27,0.8)] scale-100 group-hover:scale-105 transition-transform duration-700">噩夢</h1>
                <div className="flex items-center justify-center space-x-2 text-lg text-stone-500 hover:text-red-400 transition-colors duration-500 mt-4 opacity-80">
                    <span className="tracking-widest font-serif border-b border-stone-800 pb-1">點擊入夢</span>
                </div>
            </div>
            <div className="scanlines"></div>
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-950/40 via-black to-black"></div>
            <div className="noise"></div>
        </div>
      );
  }

  if (showEpilogue) {
      return (
          <div className="w-full h-screen bg-black flex flex-col items-center justify-center text-white z-[100] fade-enter-active">
             <style>{`
                @keyframes fadeInSlow { 0% { opacity: 0; } 100% { opacity: 1; } }
                .fade-in-slow { animation: fadeInSlow 4s ease-in forwards; }
             `}</style>
             <h1 className="text-4xl md:text-6xl font-serif tracking-[0.5em] text-red-700/80 font-bold mb-4 fade-in-slow">初章：歸鄉</h1>
             <p className="text-stone-500 font-serif text-sm tracking-widest mt-8 fade-in-slow" style={{ animationDelay: '2s' }}>To Be Continued...</p>
             <div className="scanlines opacity-50"></div>
          </div>
      )
  }

  return (
    <div className={`w-full h-screen bg-[#0a0808] text-white overflow-hidden select-none font-sans relative`}>
      <style>{`
          @keyframes shake-screen {
            0% { transform: translate(1px, 1px) rotate(0deg); }
            10% { transform: translate(-1px, -2px) rotate(-1deg); }
            20% { transform: translate(-3px, 0px) rotate(1deg); }
            30% { transform: translate(3px, 2px) rotate(0deg); }
            40% { transform: translate(1px, -1px) rotate(1deg); }
            50% { transform: translate(-1px, 2px) rotate(-1deg); }
            60% { transform: translate(-3px, 1px) rotate(0deg); }
            70% { transform: translate(3px, 1px) rotate(-1deg); }
            80% { transform: translate(-1px, -1px) rotate(1deg); }
            90% { transform: translate(1px, 2px) rotate(0deg); }
            100% { transform: translate(1px, -2px) rotate(-1deg); }
          }
          .animate-shake {
              animation: shake-screen 0.5s infinite;
          }
          .fade-in-out {
              animation: fadeInOut 2.5s forwards;
          }
          @keyframes fadeInOut {
              0% { opacity: 0; }
              10% { opacity: 1; }
              80% { opacity: 1; }
              100% { opacity: 0; }
          }
      `}</style>
      <div className="scanlines"></div>
      <div className="vignette"></div>
      <div className="noise"></div>
      
      {/* Scene Transition Overlay */}
      <div 
        className="absolute inset-0 z-[100] transition-all duration-1000 ease-in-out pointer-events-none"
        style={{ 
            backgroundColor: 'black',
            opacity: transitionOpacity > 0 ? 1 : 0,
            pointerEvents: transitionOpacity > 0 ? 'auto' : 'none' 
        }}
      ></div>

      <div 
         className={`w-full h-full transition-all duration-1000 ${isShaking ? 'animate-shake' : ''}`}
         style={{ filter: transitionOpacity > 0 ? 'blur(8px) brightness(0.5)' : 'none' }}
      >
          {!gameEnded && !isLyingDown && climaxStep === 0 && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none opacity-80">
                  <div className="px-6 py-1 bg-black/40 backdrop-blur-sm border-t border-b border-red-900/30">
                      <span className="text-red-100/70 font-serif tracking-[0.2em] text-sm shadow-black drop-shadow-md">
                          {getCurrentObjective()}
                      </span>
                  </div>
              </div>
          )}
          
          <SceneRenderer 
            state={gameState} 
            interactables={getInteractables()} 
            onInteract={handleInteraction} 
            sceneWidth={100} 
            isMoving={isMoving}
            isLyingDown={isLyingDown}
            facingDir={facingDir}
            isVisionMode={isVisionMode}
            visionRadius={VISION_RADIUS} 
            climaxStep={climaxStep} // Pass Climax Step to Renderer
          />

          {!gameEnded && climaxStep === 0 && (
              <div className="absolute top-6 right-6 z-50 pointer-events-none opacity-60 hover:opacity-100 transition-opacity">
                   <div className="bg-black/50 backdrop-blur-sm px-4 py-2 border border-white/10 rounded-sm text-xs md:text-sm font-serif tracking-widest text-stone-300 flex flex-col gap-1 items-end shadow-lg">
                       <span>← → 移動</span>
                       <span className={isVisionMode ? "text-red-400 font-bold" : ""}>F 看取 (開/關)</span>
                       <span>[SPACE/ENTER] 互動/對話</span>
                   </div>
              </div>
          )}

          {showVisionTutorial && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] pointer-events-none fade-in-out">
                  <div className="bg-black/80 border-2 border-red-800 px-8 py-4 rounded-sm shadow-[0_0_20px_rgba(255,0,0,0.3)] animate-pulse">
                      <p className="text-red-100 text-xl font-serif tracking-widest font-bold text-center">
                         按下 [F] 開啟「看取」<br/>
                         <span className="text-sm opacity-70 mt-2 block">觀測不可見之物</span>
                      </p>
                  </div>
              </div>
          )}

          {blockMessage && (
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 z-50 pointer-events-none fade-in-out">
                  <div className="text-red-400 font-serif text-lg tracking-widest drop-shadow-md bg-black/60 px-6 py-2 border-l-2 border-red-800">
                      {blockMessage}
                  </div>
              </div>
          )}

          {activeSubtitle && !activeDialogue && !isTransitioningRef.current && (
            <>
                {activeSubtitle.position ? (
                    <div 
                        className={`absolute z-30 pointer-events-none animate-pulse-slow fade-in-out ${activeSubtitle.className || ''}`}
                        style={{ 
                            top: activeSubtitle.position.top, 
                            left: activeSubtitle.position.left,
                            transform: 'translate(-50%, -50%)' 
                        }}
                    >
                        <p className={`font-serif tracking-widest drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] whitespace-pre-wrap ${activeSubtitle.className?.includes('text-') ? '' : 'text-stone-300 text-xl'}`}>
                            {activeSubtitle.text}
                        </p>
                    </div>
                ) : (
                    <div className="fixed bottom-32 md:bottom-40 w-full flex justify-center pointer-events-none z-30 px-4">
                        <div className="bg-gradient-to-r from-transparent via-black/60 to-transparent px-10 py-4 backdrop-blur-[2px]">
                            <p className="text-red-500/70 text-sm mb-2 font-serif text-center tracking-widest">{activeSubtitle.speaker}</p>
                            <p className="text-xl md:text-2xl text-stone-200 tracking-[0.15em] font-serif shadow-black drop-shadow-lg text-center leading-relaxed whitespace-pre-wrap">{activeSubtitle.text}</p>
                        </div>
                    </div>
                )}
            </>
          )}

          <DialogueBox 
            dialogue={activeDialogue ? activeDialogue[currentLineIndex] : null} 
            onNext={handleNextDialogue} 
            isEnd={activeDialogue ? currentLineIndex === activeDialogue.length - 1 : false} 
            forceShow={forceShowDialogue}
            onTypingComplete={handleTypingComplete}
          />
      </div>

      <div className="fixed bottom-6 left-6 z-40 md:hidden flex gap-4 opacity-50 hover:opacity-100 transition-opacity">
          <button 
            className="w-16 h-16 bg-white/5 rounded-full border border-white/10 active:bg-white/20 flex items-center justify-center text-2xl backdrop-blur-md"
            onTouchStart={() => addKey('ArrowLeft')}
            onTouchEnd={() => removeKey('ArrowLeft')}
          >←</button>
          <button 
            className="w-16 h-16 bg-white/5 rounded-full border border-white/10 active:bg-white/20 flex items-center justify-center text-2xl backdrop-blur-md"
            onTouchStart={() => addKey('ArrowRight')}
            onTouchEnd={() => removeKey('ArrowRight')}
          >→</button>
      </div>
      <div className="fixed bottom-6 right-6 z-40 md:hidden opacity-50 hover:opacity-100 transition-opacity flex flex-col gap-4 items-end">
          <button 
            className={`w-14 h-14 rounded-full border flex items-center justify-center backdrop-blur-md ${isVisionMode ? 'bg-red-900/40 border-red-500 text-red-200' : 'bg-white/5 border-white/10 text-white/70'}`}
            onTouchStart={() => setIsVisionMode(p => !p)}
          >
              <Eye size={24} />
          </button>
          <button 
            className="w-20 h-20 bg-red-900/20 rounded-full border border-red-500/30 active:bg-red-900/40 flex items-center justify-center text-xs font-bold tracking-widest backdrop-blur-md"
            onClick={() => handleInteraction({} as any)} 
            onTouchStart={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }))}
          >互動</button>
      </div>
    </div>
  );
};

export default App;