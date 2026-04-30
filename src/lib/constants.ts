import { GameLevel } from '../types';

export const LEVEL_ORDER: GameLevel[] = ['intro', 'memory', 'music', 'mcq', 'puzzle', 'matching', 'finale'];

// Helper to construct image paths so they dynamically try to load, or fallback smoothly.
export function getAssetPath(path: string) {
  // During dev and prod in Vite, referencing static assets in /public is just absolute path.
  // We use this mostly for clarity and in case changing base URL is needed.
  return path;
}
