export type GameLevel = 'intro' | 'memory' | 'puzzle' | 'music' | 'mcq' | 'matching' | 'finale' | 'gallery';

export interface GameState {
  currentLevel: GameLevel;
  unlockedLevels: GameLevel[];
  amuletPieces: number;
  scrollsCollected: number;
  finaleUnlocked: boolean;
}
