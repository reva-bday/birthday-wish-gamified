import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getAssetPath } from '../lib/constants';
import { cn } from '../lib/utils';
import { CheckCircle, Music } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const GramophoneIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 21h4v-3h-4v3z" />
    <path d="M8 18h8v-4H8v4z" />
    <path d="M12 14c2 0 6-3 6-8s-3-4-6-4-6 1.5-6 4 4 8 6 8z" fill="none" strokeWidth="2" />
    <path d="M12 2v12" strokeWidth="2" />
    <ellipse cx="12" cy="6" rx="6" ry="2" fill="none" strokeWidth="2" />
  </svg>
);

const fallbackPalace = "https://images.unsplash.com/photo-1582236319409-af9d821262d1?q=80&w=1600&auto=format&fit=crop";

export function Level2Music({ onComplete }: Props) {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won'>('idle');
  const [foundIds, setFoundIds] = useState<number[]>([]);
  const [isPlayingSnippet, setIsPlayingSnippet] = useState(false);
  const [gramophones, setGramophones] = useState<{id: number, x: number, y: number}[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Generate 5 random positions when component mounts
    const dist = (p1: {x: number, y: number}, p2: {x: number, y: number}) => {
       return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    };

    const newGrams: {id: number, x: number, y: number}[] = [];
    
    const generatePoint = () => {
       const rand = Math.random();
       let x = 0, y = 0;
       
       if (rand < 0.5) {
          // Side region (50% chance): 5-25 or 75-95 x, 20-95 y
          x = Math.random() < 0.5 ? 5 + Math.random() * 20 : 75 + Math.random() * 20;
          y = 20 + Math.random() * 75;
       } else if (rand < 0.75) {
          // Bottom region (25% chance): 25-75 x, 70-95 y
          x = 25 + Math.random() * 50;
          y = 70 + Math.random() * 25;
       } else if (rand < 0.95) {
          // Center region (20% chance): 25-75 x, 40-70 y
          x = 25 + Math.random() * 50;
          y = 40 + Math.random() * 30;
       } else {
          // Top Center region (5% chance): 25-75 x, 5-40 y
          x = 25 + Math.random() * 50;
          y = 5 + Math.random() * 35;
       }
       return { x, y };
    };

    for (let i = 1; i <= 5; i++) {
        let candidate = generatePoint();
        let attempts = 0;
        let valid = false;
        
        while (!valid && attempts < 100) {
           valid = true;
           for (const existing of newGrams) {
               // Ensure at least 15% distance between any two gramophones
               if (dist(existing, candidate) < 15) { 
                   valid = false;
                   break;
               }
           }
           if (!valid) {
               candidate = generatePoint();
               attempts++;
           }
        }
        newGrams.push({ id: i, ...candidate });
    }
    setGramophones(newGrams);
  }, []);

  const startGame = () => {
    setFoundIds([]);
    setGameState('playing');
    if (audioRef.current) {
        audioRef.current.volume = 1;
        audioRef.current.play().then(() => {
            audioRef.current!.pause();
            audioRef.current!.currentTime = 0;
        }).catch(() => {});
    }
  };

  const handleGramophoneClick = (id: number) => {
    if (foundIds.includes(id) || isPlayingSnippet || gameState !== 'playing') return;

    const newFound = [...foundIds, id];
    setFoundIds(newFound);
    setIsPlayingSnippet(true);

    const snippetIndex = newFound.length - 1;

    if (audioRef.current) {
      audioRef.current.currentTime = snippetIndex;
      audioRef.current.play().catch(() => {});
      
      setTimeout(() => {
        if (newFound.length < 5) {
          if (audioRef.current) audioRef.current.pause();
          setIsPlayingSnippet(false);
        } else {
          setIsPlayingSnippet(false);
          setGameState('won');
          if (audioRef.current) {
             audioRef.current.currentTime = 0;
             audioRef.current.play().catch(e => console.log(e));
          }
        }
      }, 1000);
    } else {
        setTimeout(() => {
            if (newFound.length >= 5) {
                setGameState('won');
            }
            setIsPlayingSnippet(false);
        }, 1000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="p-4 sm:p-10 w-full max-w-4xl flex flex-col items-center"
    >
      <div className="bg-gradient-to-b from-transparent to-stone-900/50 absolute inset-0 pointer-events-none -z-10 rounded-3xl" />
      <h2 className="text-2xl sm:text-3xl font-serif text-royal-gold-light mb-4 text-center">Level II: The Silent Gramophones</h2>
      <p className="text-parchment-dark mb-4 text-center text-sm sm:text-base max-w-2xl">
        Five ancient gramophones are lost within the palace columns. Find them all in any order to reassemble the melody of the sovereign. Each discovery restores one second of history.
      </p>

      {gameState === 'idle' && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startGame}
          className="mt-8 px-8 py-3 bg-gradient-to-r from-royal-gold to-royal-gold-light text-chola-red font-serif font-bold text-lg rounded-full shadow-[0_0_15px_rgba(195,154,82,0.4)] uppercase flex items-center gap-2"
        >
          <Music className="w-5 h-5"/> Enter Palace Room
        </motion.button>
      )}

      {gameState !== 'idle' && (
        <div className="w-full flex justify-between items-center px-4 mb-4">
            <span className="font-serif text-royal-gold-light">Found: {foundIds.length} / 5</span>
            {isPlayingSnippet && <span className="font-serif text-amber-500 animate-pulse text-sm">Playing...</span>}
        </div>
      )}

      {gameState !== 'idle' && (
        <div className={cn(
            "relative w-full aspect-[4/3] sm:aspect-[16/9] bg-stone-900 rounded-xl border-2 border-royal-gold/20 flex flex-col shadow-2xl transition-all duration-700 max-w-3xl overflow-hidden",
            gameState === 'won' && "border-royal-gold shadow-[0_0_40px_rgba(195,154,82,0.3)] brightness-110"
        )}>
          <img 
            src={getAssetPath('/assets/level2/palace.png')} 
            onError={(e) => { e.currentTarget.src = fallbackPalace; }}
            alt="Palace Interior" 
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          />
          
          <AnimatePresence>
            {gramophones.map(g => {
                const found = foundIds.includes(g.id);
                return (
                  <motion.button
                    key={g.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={!found ? { scale: 1.2, filter: 'brightness(1.5)' } : {}}
                    whileTap={!found ? { scale: 0.9 } : {}}
                    onClick={() => handleGramophoneClick(g.id)}
                    disabled={found || isPlayingSnippet || gameState === 'won'}
                    className={cn(
                      "absolute flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 shadow",
                      found ? "w-10 h-10 text-royal-gold ring-2 ring-royal-gold bg-black/60 shadow-[0_0_20px_rgba(195,154,82,0.8)] z-10" : "w-10 h-10 text-amber-600/80 bg-stone-900/40 hover:bg-black/50 border border-amber-900/30 cursor-pointer hover:border-transparent"
                    )}
                    style={{ left: `${g.x}%`, top: `${g.y}%` }}
                  >
                    <div className="relative flex items-center justify-center w-full h-full">
                        <img 
                          src={getAssetPath('/assets/level2/gramophone.png')} 
                          alt="gramophone" 
                          className="w-8 h-8 object-contain drop-shadow" 
                          onError={(e) => {
                             e.currentTarget.style.display = 'none';
                             e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <GramophoneIcon className="w-6 h-6 drop-shadow hidden" />
                    </div>
                    {found && <CheckCircle className="absolute -top-1 -right-1 w-4 h-4 bg-black rounded-full text-green-500" />}
                  </motion.button>
                )
            })}
          </AnimatePresence>
        </div>
      )}

      <div className={cn("w-full relative mt-8 flex-col items-center gap-2", gameState === 'won' ? "flex" : "hidden")}>
         <span className="text-xs text-parchment-dark/60 italic">Full Anthem Revealed</span>
         <audio 
           ref={audioRef}
           controls={gameState === 'won'} 
           className="w-full max-w-sm outline-none theme-audio-player"
           src={getAssetPath('/assets/level2/ringtone.mp3')}
         >
             Your browser does not support the audio element.
         </audio>
      </div>

      {gameState === 'won' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center text-center p-6 mt-6 bg-stone-900/80 backdrop-blur border border-royal-gold/30 rounded-xl w-full max-w-sm shadow-xl"
        >
          <Music className="w-12 h-12 text-royal-gold-light mb-4 animate-bounce" />
          <h3 className="text-xl sm:text-2xl font-serif text-royal-gold-light mb-2">The Symphony Restored</h3>
          <p className="text-parchment-dark mb-6 text-sm">The 5 pieces of the melody have been reassembled.</p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
            className="px-8 py-3 bg-gradient-to-r from-green-700 to-green-600 border border-green-400 text-green-100 font-serif font-bold text-lg rounded-full shadow-[0_0_20px_rgba(21,128,61,0.6)] uppercase tracking-wider flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" /> Proceed
          </motion.button>
        </motion.div>
      )}

    </motion.div>
  );
}
