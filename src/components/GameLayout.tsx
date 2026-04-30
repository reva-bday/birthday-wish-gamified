import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameLevel } from '../types';
import { Crown, Scroll, Home, Menu, X, Archive } from 'lucide-react';
import { cn } from '../lib/utils';
import { LEVEL_ORDER } from '../lib/constants';

interface GameLayoutProps {
  children: React.ReactNode;
  amulets: number;
  scrolls: number;
  onGoHome: () => void;
  onSkipToLevel: (level: GameLevel) => void;
  currentLevel: GameLevel;
  highestLevel: GameLevel;
  vaultUnlocked: boolean;
}

export function GameLayout({ children, amulets, scrolls, onGoHome, onSkipToLevel, currentLevel, highestLevel, vaultUnlocked }: GameLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen w-full relative flex flex-col items-center p-4 sm:p-8 overflow-x-hidden pt-20 sm:pt-24">
      {/* Intricate stone/gold background */}
      <div className="fixed inset-0 pointer-events-none -z-20 bg-chola-red bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-chola-red-light to-[#1a0508]" />
      
      {/* Decorative patterns */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-10 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M20%2020.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0%2020h2v20H0V20zm4%200h2v20H4V20zm4%200h2v20H8V20zm4%200h2v20h-2V20zm4%200h2v20h-2V20zm4%204h20v2H20v-2zm0%204h20v2H20v-2zm0%204h20v2H20v-2zm0%204h20v2H20v-2z%22%20fill%3D%22%23c39a52%22%20fill-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')]" />

      {/* Top HUD */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-4xl flex justify-between items-center fixed top-0 inset-x-0 mx-auto px-4 sm:px-8 py-4 z-50"
      >
        <div className="flex gap-2 items-center">
          <button 
            onClick={onGoHome}
            className="flex items-center gap-2 bg-stone-light/40 px-3 py-2 sm:px-4 sm:py-2 rounded-full border border-royal-gold/30 backdrop-blur-sm -ml-2 sm:-ml-0 hover:bg-royal-gold/20 transition-colors"
          >
            <Home className="w-5 h-5 text-royal-gold-light" />
          </button>
          
          {vaultUnlocked && (
            <motion.button 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={() => onSkipToLevel('gallery')}
              className={cn(
                "flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-full border backdrop-blur-sm transition-all",
                currentLevel === 'gallery'
                  ? "bg-royal-gold/40 border-royal-gold shadow-[0_0_15px_rgba(195,154,82,0.5)]" 
                  : "bg-stone-light/40 border-royal-gold/30 shadow-[0_0_15px_rgba(195,154,82,0.8)] animate-[pulse_2s_ease-in-out_infinite] hover:bg-royal-gold/20"
              )}
              title="Visit Vault"
            >
              <Archive className="w-5 h-5 text-royal-gold-light" />
            </motion.button>
          )}
        </div>

        <div className="flex gap-2 sm:gap-4 items-center">
            <div className="flex items-center gap-1 sm:gap-2 bg-stone-light/40 px-3 py-2 sm:px-4 sm:py-2 rounded-full border border-royal-gold/10 backdrop-blur-sm">
                <Crown className={cn("w-4 h-4 sm:w-5 sm:h-5", amulets > 0 ? "text-royal-gold" : "text-gray-500")} />
                <span className="font-serif font-bold text-royal-gold-light text-xs sm:text-base">{Math.min(5, amulets)}/5</span>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2 bg-stone-light/40 px-3 py-2 sm:px-4 sm:py-2 rounded-full border border-royal-gold/10 backdrop-blur-sm">
                <Scroll className={cn("w-4 h-4 sm:w-5 sm:h-5", scrolls > 0 ? "text-parchment" : "text-gray-500")} />
                <span className="font-serif font-bold text-parchment-dark text-xs sm:text-base">{Math.min(5, scrolls)}</span>
            </div>
            
            <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 bg-stone-light/40 p-2 sm:p-2 rounded-full border border-royal-gold/30 backdrop-blur-sm hover:bg-royal-gold/20 transition-colors"
                title="Level Navigation"
            >
                <Menu className="w-5 h-5 text-royal-gold-light" />
            </button>
        </div>
      </motion.nav>

      {/* Dev Navigation Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-20 right-4 sm:right-8 bg-stone border border-royal-gold-light rounded-xl shadow-2xl z-50 p-4 min-w-[200px]"
          >
            <div className="flex justify-between items-center mb-4 border-b border-royal-gold/20 pb-2">
               <h3 className="font-serif text-royal-gold-light">Travel to...</h3>
               <button onClick={() => setMenuOpen(false)}><X className="w-4 h-4 text-parchment/50 hover:text-parchment" /></button>
            </div>
            <ul className="flex flex-col gap-2">
                {LEVEL_ORDER.map(level => {
                    if (level === 'gallery') return null; // We'll handle vault separately below
                    
                    const levelIndex = LEVEL_ORDER.indexOf(level);
                    const highestIndex = LEVEL_ORDER.indexOf(highestLevel);
                    // If the level is higher than the currently unlocked highest level, lock it.
                    // Intro is at index 0, memory at 1, etc.
                    const isLocked = levelIndex > highestIndex && level !== 'intro';
                    
                    return (
                        <li key={level}>
                            <button 
                                onClick={() => {
                                    if (!isLocked) {
                                      onSkipToLevel(level);
                                      setMenuOpen(false);
                                    }
                                }}
                                disabled={isLocked}
                                className={cn(
                                    "w-full text-left px-3 py-2 rounded font-sans text-sm transition-colors",
                                    currentLevel === level ? "bg-royal-gold text-stone font-bold pointer-events-none" : "hover:bg-stone-light text-parchment",
                                    isLocked && "opacity-40 cursor-not-allowed hover:bg-transparent"
                                )}
                            >
                                {level.toUpperCase()}
                                {isLocked && <span className="float-right text-xs">🔒</span>}
                            </button>
                        </li>
                    );
                })}
                {vaultUnlocked && (
                  <li>
                      <button 
                          onClick={() => {
                              onSkipToLevel('gallery');
                              setMenuOpen(false);
                          }}
                          className={cn(
                              "w-full text-left px-3 py-2 rounded font-sans text-sm transition-colors",
                              currentLevel === 'gallery' ? "bg-royal-gold text-stone font-bold pointer-events-none" : "hover:bg-stone-light text-parchment"
                          )}
                      >
                          VAULT
                      </button>
                  </li>
                )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="w-full max-w-4xl flex-1 relative z-10 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </main>

      {/* Decorative Corner Ornaments */}
      <div className="fixed top-0 left-0 w-32 h-32 opacity-20 pointer-events-none" 
           style={{ background: 'radial-gradient(circle at top left, var(--color-royal-gold-light), transparent 70%)' }}></div>
      <div className="fixed bottom-0 right-0 w-64 h-64 opacity-10 pointer-events-none" 
           style={{ background: 'radial-gradient(circle at bottom right, var(--color-royal-gold), transparent 70%)' }}></div>
    </div>
  );
}
