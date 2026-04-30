import { motion } from 'motion/react';
import { ScrollText } from 'lucide-react';
import { AmuletPieceIcon } from './AmuletPieceIcon';

interface RewardModalProps {
  levelCompleteInfo: string;
  onContinue: () => void;
}

export function RewardModal({ levelCompleteInfo, onContinue }: RewardModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-chola-red/80 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-stone-900 border-2 border-royal-gold p-6 sm:p-8 max-w-md w-full flex flex-col items-center text-center rounded-2xl shadow-[0_0_50px_rgba(195,154,82,0.3)]"
      >
        <h2 className="text-3xl text-royal-gold-light mb-4">Trial Conquered</h2>
        
        <div className="flex gap-6 mb-8 justify-center">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full bg-royal-gold/20 flex items-center justify-center border border-royal-gold mb-2 shadow-[0_0_15px_rgba(195,154,82,0.5)] overflow-hidden">
              <AmuletPieceIcon className="w-12 h-12 transform -translate-y-2" />
            </div>
            <span className="text-sm font-serif text-parchment-dark">Amulet Piece</span>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full bg-parchment/10 flex items-center justify-center border border-parchment-dark mb-2">
              <ScrollText className="w-8 h-8 text-parchment" />
            </div>
            <span className="text-sm font-serif text-parchment-dark">Royal Scroll</span>
          </motion.div>
        </div>

        <p className="text-parchment mb-8 italic">
          {levelCompleteInfo}
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
          className="w-full py-3 bg-royal-gold text-chola-red font-serif font-bold text-lg rounded shadow-lg uppercase tracking-wider"
        >
          Continue Journey
        </motion.button>
      </motion.div>
    </div>
  );
}
