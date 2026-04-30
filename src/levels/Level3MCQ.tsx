import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getAssetPath } from '../lib/constants';
import { cn } from '../lib/utils';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

// Dummy questions testing 'Hyperthymesia' based on instances of past life
const QUESTIONS = [
  {
    id: 1,
    question: "What is the name of first contact card for you in my phone?",
    options: ["Repu Revathi", "Reva Machan", "Revathy The Rep", "Reva🔥 Bm"],
    answerIndex: 2, // Change in future
    imageSrc: getAssetPath('/assets/level3/scratch1.jpeg')
  },
    {
    id: 2,
    question: "What was the very first gift you ever gave me?",
    options: ["Chocolate", "Greeting card", "Rakhi", "Key Chain"],
    answerIndex: 2,
    imageSrc: getAssetPath('/assets/level3/scratch2.jpeg')
  },
  {
    id: 3,
    question: "What is the color of your outfit that is my favorite? (Photo also)?",
    options: ["Rose & Yellow", "Red", "Green", "White"],
    answerIndex: 1,
    imageSrc: getAssetPath('/assets/level3/scratch3.jpeg')
  },
  {
    id: 4,
    question: "Date you joined Spartanz",
    options: ["July 11", "June 7", "August 9", "Jan 23"],
    answerIndex: 0,
    imageSrc: getAssetPath('/assets/level3/scratch4.jpeg')
  },
  {
    id: 5,
    question: "Where did we buy my best outfit (still my favorite), which was chosen by two of the best people in my life?",
    options: ["Forum-Trends", "Mathews Garment", "Forum-Max", "Phoneix-Max"],
    answerIndex: 3,
    imageSrc: getAssetPath('/assets/level3/scratch5.jpeg')
  }
];

function ScratchCard({ imageSrc, onRevealed }: { imageSrc: string, onRevealed: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas logical size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Fill with stone/gold texture
    ctx.fillStyle = '#443f39'; // stone base
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add some noise or "gold leaf" text
    ctx.fillStyle = '#c39a52';
    ctx.font = '20px Cinzel';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch to Reveal', canvas.width/2, canvas.height/2);

    // Prepare for scratching
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 40;
  }, []);

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();

    // Check completion percentage occasionally
    if (Math.random() > 0.8) {
      checkCompletion();
    }
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isRevealed) return;
    isDrawing.current = true;
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current || isRevealed) return;
    const { x, y } = getCoordinates(e);
    scratch(x, y);
  };

  const handleEnd = () => {
    isDrawing.current = false;
  };

  const checkCompletion = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++;
    }
    const percent = transparent / (pixels.length / 4);
    if (percent > 0.45 && !isRevealed) {
      setIsRevealed(true);
      // clear canvas
      ctx.fillRect(0, 0, canvas.width, canvas.height); // actually destination-out will clear it fully
      onRevealed();
    }
  };

  return (
    <div className="relative w-full max-w-sm aspect-square bg-stone-900 rounded-lg overflow-hidden border-2 border-royal-gold shadow-xl select-none">
      <div className="absolute inset-0 flex flex-col items-center justify-center text-parchment-dark bg-stone">
        <span className="text-sm">Secret Memory</span>
        <span className="text-xs opacity-50 block mt-2">({imageSrc.split('/').pop()})</span>
      </div>
      <img src={imageSrc} alt="Memory" className="absolute inset-0 w-full h-full object-cover z-0" 
           onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }} />
      <canvas
        ref={canvasRef}
        className={cn("absolute inset-0 z-10 w-full h-full cursor-crosshair transition-opacity duration-1000", isRevealed && "opacity-0 pointer-events-none")}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        style={{ touchAction: 'none' }}
      />
    </div>
  );
}


const GOLD_PATTERN_URL = "data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M20%2020.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0%2020h2v20H0V20zm4%200h2v20H4V20zm4%200h2v20H8V20zm4%200h2v20h-2V20zm4%200h2v20h-2V20zm4%204h20v2H20v-2zm0%204h20v2H20v-2zm0%204h20v2H20v-2zm0%204h20v2H20v-2z%22%20fill%3D%22%236b4200%22%20fill-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E";
const MAROON_PATTERN_URL = "data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M20%2020.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0%2020h2v20H0V20zm4%200h2v20H4V20zm4%200h2v20H8V20zm4%200h2v20h-2V20zm4%200h2v20h-2V20zm4%204h20v2H20v-2zm0%204h20v2H20v-2zm0%204h20v2H20v-2zm0%204h20v2H20v-2z%22%20fill%3D%22%232a0d0d%22%20fill-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E";

const COLS = 6;
const ROWS = 26;
const TOTAL_CELLS = ROWS * COLS;

const CELL_ORDER = Array.from({ length: TOTAL_CELLS }).map((_, i) => {
  const row = Math.floor(i / COLS);
  const col = i % COLS;
  const jitter = (i * 13) % 40;
  const score = row * 10 + jitter;
  return { id: i, row, col, score };
}).sort((a, b) => a.score - b.score);

export function Level3MCQ({ onComplete }: Props) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // State for scratch card phase
  const [showScratch, setShowScratch] = useState(false);
  const [scratchRevealed, setScratchRevealed] = useState(false);

  const q = QUESTIONS[currentQIndex];

  const handleOptionClick = (idx: number) => {
    if (isAnswering || showScratch) return;
    
    setSelectedOption(idx);
    setIsAnswering(true);
    setErrorMsg('');

    setTimeout(() => {
      if (idx === q.answerIndex) {
        // Correct
        setShowScratch(true);
        setScratchRevealed(false);
      } else {
        // Wrong
        setErrorMsg("Your memory betrays you. Try again.");
        setSelectedOption(null);
        setIsAnswering(false);
      }
    }, 800);
  };

  const handleNextQuestion = () => {
    setIsAnswering(false);
    setSelectedOption(null);
    setShowScratch(false);
    setScratchRevealed(false);

    if (currentQIndex + 1 < QUESTIONS.length) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      onComplete();
    }
  };

  const activeSequenceNumber = Math.floor(((currentQIndex + (showScratch ? 1 : 0)) / QUESTIONS.length) * TOTAL_CELLS);
  
  // Calculate reverse lookup for cell active states
  const cellActiveThresholds = useMemo(() => {
    const thresholds = new Array(TOTAL_CELLS).fill(0);
    CELL_ORDER.forEach((cell, index) => {
      thresholds[cell.id] = index;
    });
    return thresholds;
  }, []);
  
  return (
    <>
      {/* Base Gold Layer (Always present, but covered by Maroon Layer) */}
      <div className="fixed inset-0 pointer-events-none -z-20 bg-gradient-to-br from-[#dca03d] to-[#8d6118]">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: `url("${GOLD_PATTERN_URL}")`, backgroundSize: '40px 40px', backgroundPosition: 'left top', backgroundAttachment: 'fixed' }} />
      </div>

      {/* Grid of Maroon Cells that fade out to reveal Gold */}
      <div className="fixed inset-0 pointer-events-none -z-10 grid grid-cols-6 grid-rows-[repeat(26,minmax(0,1fr))]">
        {Array.from({ length: TOTAL_CELLS }).map((_, i) => {
          const isGold = cellActiveThresholds[i] < activeSequenceNumber;
          return (
            <div 
              key={i} 
              className="relative w-full h-full transition-all duration-700 ease-in-out bg-[#5a1818] origin-center"
              style={{
                opacity: isGold ? 0 : 1,
                transform: isGold ? 'rotateX(90deg) scale(0.8)' : 'rotateX(0deg) scale(1)',
              }}
            >
               <div className="absolute inset-0 opacity-60" style={{ backgroundImage: `url("${MAROON_PATTERN_URL}")`, backgroundSize: '40px 40px', backgroundPosition: 'left top', backgroundAttachment: 'fixed' }} />
            </div>
          );
        })}
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="p-4 sm:p-10 w-full max-w-2xl flex flex-col items-center z-10"
      >
        <div className="bg-stone-950/80 absolute inset-0 pointer-events-none -z-10 rounded-3xl backdrop-blur-sm border border-stone-800" />
        <h2 className="text-2xl sm:text-3xl font-serif text-stone-50 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-wide mb-2">Level III: The Court of Whispers</h2>
        <div className="text-stone-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] mb-8 text-center text-xs sm:text-sm w-full flex justify-between items-center px-4">
          <span>Question {currentQIndex + 1} of {QUESTIONS.length}</span>
          <div className="flex gap-1">
             {QUESTIONS.map((_, i) => (
                <div key={i} className={cn("w-2 h-2 rounded-full", i < currentQIndex ? "bg-stone-200" : i === currentQIndex ? "bg-stone-200 animate-pulse" : "bg-stone-800 border border-stone-600")} />
             ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!showScratch ? (
            <motion.div 
              key="question-box"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full flex flex-col items-center"
            >
              <h3 className="text-xl sm:text-2xl font-serif text-stone-50 text-center mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                {q.question}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-6">
                {q.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = isSelected && idx === q.answerIndex;
                  const isWrong = isSelected && idx !== q.answerIndex;

                  return (
                    <motion.button
                      whileHover={{ scale: isAnswering ? 1 : 1.02 }}
                      whileTap={{ scale: isAnswering ? 1 : 0.98 }}
                      key={idx}
                      onClick={() => handleOptionClick(idx)}
                      disabled={isAnswering}
                      className={cn(
                        "p-4 rounded-lg border-2 text-left font-serif transition-colors",
                        isCorrect ? "bg-green-800 border-green-400 text-white" :
                        isWrong ? "bg-red-800 border-red-500 text-white" :
                        "bg-stone-900 border-stone-700 text-stone-200 hover:border-stone-400 hover:bg-stone-800"
                      )}
                    >
                      {opt}
                    </motion.button>
                  );
                })}
              </div>

              {errorMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-300 mt-2 font-serif text-sm bg-red-950 px-4 py-2 rounded shadow-inner"
                >
                  <AlertCircle className="w-5 h-5"/> {errorMsg}
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="scratch-box"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex flex-col items-center"
            >
              <h3 className="text-lg font-serif text-stone-50 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] mb-6 text-center">
                Correct. Scratch the ancient seal to reveal your artifact.
              </h3>
              
              <ScratchCard 
                imageSrc={q.imageSrc} 
                onRevealed={() => setScratchRevealed(true)} 
              />

              <motion.button
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: scratchRevealed ? 1 : 0, height: scratchRevealed ? 'auto' : 0 }}
                onClick={handleNextQuestion}
                disabled={!scratchRevealed}
                className="mt-8 px-8 py-3 bg-stone-100 text-stone-900 font-serif font-bold rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform"
              >
                 {currentQIndex + 1 === QUESTIONS.length ? "Proceed to Final Chamber" : "Next Memory"}
                 <CheckCircle className="w-5 h-5"/>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </>
  );
}
