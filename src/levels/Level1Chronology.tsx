import { useState, useEffect } from 'react';
import { motion, Reorder } from 'motion/react';
import { getAssetPath } from '../lib/constants';
import { cn } from '../lib/utils';
import { CheckCircle, GripVertical } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

interface MemoryImage {
  id: string;
  expectedOrder: number;
  src: string;
  isPortrait?: boolean;
}

// Initial static data representing the chronolgy puzzle
const INITIAL_IMAGES: MemoryImage[] = [
  { id: 'img1', expectedOrder: 0, src: getAssetPath('/assets/level1/pic1.jpeg'), isPortrait: false },
  { id: 'img2', expectedOrder: 1, src: getAssetPath('/assets/level1/pic2.jpg'), isPortrait: true }, // Set true/false based on need
  { id: 'img3', expectedOrder: 2, src: getAssetPath('/assets/level1/pic3.jpeg'), isPortrait: false },
  { id: 'img4', expectedOrder: 3, src: getAssetPath('/assets/level1/pic4.jpeg'), isPortrait: false },
  { id: 'img5', expectedOrder: 4, src: getAssetPath('/assets/level1/pic5.jpeg'), isPortrait: true },
];

export function Level1Chronology({ onComplete }: Props) {
  const [items, setItems] = useState<MemoryImage[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    // Shuffle on mount using simple sort for the game feel
    const shuffled = [...INITIAL_IMAGES].sort(() => Math.random() - 0.5);
    setItems(shuffled);
  }, []);

  const handleVerify = () => {
    const correct = items.every((item, i) => item.expectedOrder === i);
    if (correct) {
      setIsCorrect(true);
      setTimeout(onComplete, 1500);
    } else {
      // Small vibration effect could go here
      window.alert("The timeline is still distorted. Re-examine the memories.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="p-4 sm:p-10 w-full max-w-3xl flex flex-col items-center"
    >
      <div className="bg-gradient-to-b from-transparent to-stone-900/50 absolute inset-0 pointer-events-none -z-10 rounded-3xl" />
      <h2 className="text-2xl sm:text-3xl font-serif text-royal-gold-light mb-4 text-center">Level I: The Chronology of Memories</h2>
      <p className="text-parchment-dark mb-8 text-center max-w-xl text-sm sm:text-base leading-relaxed hidden sm:block">
        As the royal 'Hyperthymeist', the flow of time bends to your recollection. 
        Drag and drop the instances of life into their exact historical timeline.
      </p>
      <p className="text-parchment-dark mb-6 text-center max-w-xl text-sm leading-relaxed sm:hidden">
        Drag and drop to restore the timeline.
      </p>

      <div className="w-full mb-10 w-full max-w-sm sm:max-w-md">
        <Reorder.Group axis="y" values={items} onReorder={setItems} className="flex flex-col gap-6">
          {items.map((item, index) => (
            <Reorder.Item
              key={item.id}
              value={item}
              className="relative cursor-grab active:cursor-grabbing rounded-xl overflow-hidden border-2 border-royal-gold/30 hover:border-royal-gold/80 transition-all shadow-lg bg-stone-900 flex group flex-col sm:flex-row"
            >
              <div className="w-full sm:w-12 h-10 sm:h-auto bg-stone-950 flex flex-row sm:flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-royal-gold/20 text-royal-gold shrink-0">
                <span className="font-serif text-xs mr-2 sm:mr-0 sm:mb-1">Slot</span>
                <span className="font-serif text-lg font-bold">{index + 1}</span>
                <GripVertical className="hidden sm:block w-5 h-5 opacity-40 mt-2 group-active:text-royal-gold-light" />
              </div>
              <div className={cn(
                "relative w-full",
                item.isPortrait ? "aspect-square" : "aspect-[4/3]"
              )}>
                {/* Fallback styling */}
                <div className="absolute inset-0 bg-stone-800 text-[10px] flex flex-col justify-center items-center text-center p-2 text-parchment-dark z-0">
                  <span>Missing Relic</span>
                  <span className="opacity-50 break-all">/assets/level1/pic{item.expectedOrder + 1}.jpeg</span>
                </div>
                <img 
                  src={item.src} 
                  alt="Memory" 
                  className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.opacity = '0';
                  }}
                />
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleVerify}
        disabled={isCorrect}
        className={cn(
          "w-full sm:w-auto px-8 py-4 font-serif font-bold text-lg rounded-full uppercase tracking-wider flex items-center justify-center gap-2",
          isCorrect 
            ? "bg-green-700 text-green-100 shadow-[0_0_20px_rgba(21,128,61,0.6)]" 
            : "bg-gradient-to-r from-royal-gold to-royal-gold-light text-chola-red shadow-[0_0_15px_rgba(195,154,82,0.4)]"
        )}
      >
        {isCorrect ? <><CheckCircle className="w-5 h-5"/> Epoch Restored</> : "Seal the Timeline"}
      </motion.button>
    </motion.div>
  );
}
