
export enum GameScene {
  INTRO = 'INTRO',
  FOREST = 'FOREST',
  MEETING = 'MEETING',
  SEARCH = 'SEARCH',
  PATH = 'PATH',
  TEMPLE = 'TEMPLE',
  CLIMAX = 'CLIMAX',
  ENDING = 'ENDING'
}

export interface DialogueLine {
  speaker: string;
  text: string;
  emotion?: 'normal' | 'confused' | 'scared' | 'angry';
  effect?: 'shake' | 'whisper';
}

export interface Subtitle {
  id: string;
  text: string;
  triggerX: number; // X position to trigger
  speaker?: string;
  duration?: number;
  position?: { top: string; left: string }; // Screen position %
  className?: string; // Additional styling classes
}

export interface Interactable {
  id: string;
  x: number;
  label: string;
  type: 'seed' | 'pot' | 'altar_flower' | 'altar_incense' | 'altar_wine' | 'lily' | 'door' | 'shadow' | 'ninesong';
  requiredItem?: string;
  completed?: boolean;
}

export interface GameState {
  currentScene: GameScene;
  playerX: number;
  inventory: string[];
  flags: {
    hasMetNineSong: boolean;
    hasSeed: boolean;
    seedPlanted: boolean;
    enteredTemple: boolean;
    flowerPlaced: boolean;
    incenseLit: boolean;
    wineDrunk: boolean;
  };
}