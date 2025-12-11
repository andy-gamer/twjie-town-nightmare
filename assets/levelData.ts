
import { GameScene, Interactable } from '../types';

export const BASE_INTERACTABLES: Partial<Record<GameScene, Interactable[]>> = {
  [GameScene.SEARCH]: [
     { id: 'seed_spot', x: 65, label: '看取', type: 'seed' }, // Moved to left of pot (75)
     { id: 'pot', x: 75, label: '花盆', type: 'pot' }
  ],
  [GameScene.PATH]: [
      { id: 'lily', x: 50, label: '看花', type: 'lily' },
      { id: 'temple_door', x: 90, label: '進入', type: 'door' }
  ],
  [GameScene.TEMPLE]: [
      { id: 'ninesong', x: 15, label: '對話', type: 'ninesong' }, // Moved from 42 to 15
      { id: 'shadow_wall', x: 8, label: '黑影', type: 'shadow' },
      { id: 'altar_flower', x: 30, label: '供花', type: 'altar_flower' },
      { id: 'altar_incense', x: 50, label: '點香', type: 'altar_incense' },
      { id: 'altar_wine', x: 70, label: '喝酒', type: 'altar_wine' },
  ],
  [GameScene.CLIMAX]: [
      { id: 'ninesong', x: 15, label: '對話', type: 'ninesong' }, // Moved from 42 to 15
      { id: 'altar_flower', x: 30, label: '供花', type: 'altar_flower' },
      { id: 'altar_incense', x: 50, label: '點香', type: 'altar_incense' },
      { id: 'altar_wine', x: 70, label: '喝酒', type: 'altar_wine' },
  ]
};