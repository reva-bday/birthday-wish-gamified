import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getAssetPath } from '../lib/constants';
import { cn } from '../lib/utils';
import { CheckCircle, RotateCcw } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const GRID_SIZE = 3;
const TOTAL_TILES = GRID_SIZE * GRID_SIZE;
const EMPTY_TILE_VAL = (GRID_SIZE - 1) * GRID_SIZE; // Bottom-left tile (6)

export function Level4Puzzle({ onComplete }: Props) {
  const [tiles, setTiles] = useState<number[]>([]);
  const [isWon, setIsWon] = useState(false);

  const shuffleTiles = () => {
    // Start with a solved state
    let state = Array.from({length: TOTAL_TILES}, (_, i) => i);
    let emptyIdx = EMPTY_TILE_VAL;
    let prevIdx = -1;
    
    // Generate an easy puzzle by making 15 random valid moves
    for (let i = 0; i < 15; i++) {
        const row = Math.floor(emptyIdx / GRID_SIZE);
        const col = emptyIdx % GRID_SIZE;
        const neighbors = [];
        
        if (row > 0) neighbors.push(emptyIdx - GRID_SIZE); // UP
        if (row < GRID_SIZE - 1) neighbors.push(emptyIdx + GRID_SIZE); // DOWN
        if (col > 0) neighbors.push(emptyIdx - 1); // LEFT
        if (col < GRID_SIZE - 1) neighbors.push(emptyIdx + 1); // RIGHT
        
        // Pick a neighbor that isn't the one we just moved from (to avoid immediate undo)
        const validNeighbors = neighbors.filter(n => n !== prevIdx);
        // Fallback in case of dead end (should not happen in 15 puzzle)
        const randNeighbor = validNeighbors.length > 0 
            ? validNeighbors[Math.floor(Math.random() * validNeighbors.length)]
            : neighbors[0];
            
        // Swap
        [state[emptyIdx], state[randNeighbor]] = [state[randNeighbor], state[emptyIdx]];
        prevIdx = emptyIdx;
        emptyIdx = randNeighbor;
    }
    
    setTiles(state);
    setIsWon(false);
  };

  useEffect(() => {
    shuffleTiles();
  }, []);

  const handleTileClick = (index: number) => {
    if (isWon) return;

    const emptyIndex = tiles.indexOf(EMPTY_TILE_VAL);
    
    // Check adjacency
    const tileRow = Math.floor(index / GRID_SIZE);
    const tileCol = index % GRID_SIZE;
    const emptyRow = Math.floor(emptyIndex / GRID_SIZE);
    const emptyCol = emptyIndex % GRID_SIZE;

    const isAdjacent = 
      (Math.abs(tileRow - emptyRow) === 1 && tileCol === emptyCol) ||
      (Math.abs(tileCol - emptyCol) === 1 && tileRow === emptyRow);

    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);

      // Check win
      if (newTiles.every((val, i) => val === i)) {
        setIsWon(true);
        setTimeout(onComplete, 2000);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="p-4 sm:p-10 w-full max-w-2xl flex flex-col items-center"
    >
      <div className="bg-gradient-to-b from-transparent to-stone-900/50 absolute inset-0 pointer-events-none -z-10 rounded-3xl" />
      <h2 className="text-2xl sm:text-3xl font-serif text-royal-gold-light mb-4 text-center">Level IV: The Temple Murals</h2>
      <p className="text-parchment-dark mb-4 text-center text-sm sm:text-base">
        A shattered fresco blocks the entrance to the inner sanctuary. 
        Slide the ancient stones to reveal the grand picture. 
      </p>

      {!isWon && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={shuffleTiles}
          className="mb-6 px-5 py-2 bg-stone-800/80 border border-royal-gold/30 text-parchment-dark font-serif text-sm rounded-full flex items-center gap-2 hover:border-royal-gold/60 transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Restart Puzzle
        </motion.button>
      )}

      {/* Frame for the puzzle */}
      <div className="relative p-2 bg-stone-light rounded-sm shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] border border-royal-gold/30">
        
        {/* Background placeholder if image missing */}
        <div className="absolute inset-2 bg-stone/80 flex flex-col items-center justify-center text-center p-4 z-0 text-parchment-dark/50">
           <span>Missing Fresco</span>
           <span className="text-xs mt-2">Upload: /public/assets/level4/puzzle.jpeg</span>
        </div>

        <div 
          className="relative grid bg-black z-10" 
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            width: 'min(80vw, 400px)',
            height: 'min(80vw, 400px)',
            gap: '2px'
          }}
        >
          {tiles.map((tileValue, currentIndex) => {
            const isEmpty = tileValue === EMPTY_TILE_VAL;
            
            // Calculate background position based on the CORRECT position of this piece
            const originalRow = Math.floor(tileValue / GRID_SIZE);
            const originalCol = tileValue % GRID_SIZE;
            
            return (
              <motion.div
                layout
                key={tileValue}
                onClick={() => handleTileClick(currentIndex)}
                className={cn(
                  "relative w-full h-full overflow-hidden",
                  isEmpty ? "opacity-0 pointer-events-none" : "hover:brightness-110 shadow-inner cursor-pointer"
                )}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                {!isEmpty && (
                  <div 
                    className="absolute inset-0 bg-no-repeat transition-all"
                    style={{
                      backgroundImage: `url(${getAssetPath('/assets/level4/puzzle.jpeg')})`,
                      backgroundSize: `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`,
                      backgroundPosition: `${(originalCol / (GRID_SIZE - 1)) * 100}% ${(originalRow / (GRID_SIZE - 1)) * 100}%`
                    }}
                  />
                )}
                {!isEmpty && (
                  <div className="absolute inset-0 border border-royal-gold/10 pointer-events-none"></div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {isWon && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 flex items-center gap-2 text-green-400 font-serif text-xl"
        >
          <CheckCircle className="w-6 h-6" />
          <span>The Mural is Complete!</span>
        </motion.div>
      )}

    </motion.div>
  );
}
