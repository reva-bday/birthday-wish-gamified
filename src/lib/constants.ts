import { GameLevel } from '../types';

export const LEVEL_ORDER: GameLevel[] = ['intro', 'memory', 'music', 'mcq', 'puzzle', 'matching', 'finale'];

// Helper to construct image paths so they dynamically try to load, or fallback smoothly.
export function getAssetPath(path: string) {
  // Use Vite's BASE_URL so it works on GitHub Pages (e.g. /birthday-wish-gamified/)
  const baseUrl = import.meta.env.BASE_URL || '/';
  // Strip leading slash from path to avoid double slashes
  return baseUrl + path.replace(/^\/+/, '');
}
