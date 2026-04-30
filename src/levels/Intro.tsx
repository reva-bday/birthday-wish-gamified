import { motion } from 'motion/react';

interface IntroProps {
  onStart: () => void;
  onContinue: () => void;
  hasProgress: boolean;
}

export function Intro({ onStart, onContinue, hasProgress }: IntroProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-2xl w-full p-6 sm:p-12 text-center flex flex-col items-center relative z-10"
    >
      <h1 className="text-4xl sm:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-b from-royal-gold-light to-royal-gold drop-shadow-2xl">
        The Tapestry of Eras
      </h1>
      
      <div className="space-y-6 text-base sm:text-xl text-parchment-dark leading-relaxed font-sans mb-12 drop-shadow-md">
        <p>
          Welcome, Time Traveler. You have stepped into the golden age of Tamilakam, 
          a period of mighty kings, towering temples, and untold secrets.
        </p>
        <p>
          The legendary royal pendant has been shattered into five pieces and scattered across the eras. 
          To restore the artifact and unlock its final blessing, you must traverse five trials of memory, wisdom, and intuition.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        {hasProgress ? (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onContinue}
              className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-royal-gold to-royal-gold-light text-chola-red font-serif font-bold text-xl rounded-full shadow-[0_0_30px_rgba(195,154,82,0.6)] hover:shadow-[0_0_40px_rgba(195,154,82,0.8)] transition-all uppercase tracking-widest border border-royal-gold-light"
            >
              Continue Journey
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (window.confirm("Are you sure you want to restart? Your timeline will be rewritten.")) {
                  localStorage.removeItem('tapestryOfErasSave');
                  window.location.reload();
                }
              }}
              className="w-full sm:w-auto px-10 py-5 bg-transparent border-2 border-stone-light text-stone-light font-serif font-bold text-xl rounded-full hover:bg-stone/50 hover:text-parchment transition-all uppercase tracking-widest"
            >
              Restart Chapter
            </motion.button>
          </>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-royal-gold to-royal-gold-light text-chola-red font-serif font-bold text-xl rounded-full shadow-[0_0_30px_rgba(195,154,82,0.6)] hover:shadow-[0_0_40px_rgba(195,154,82,0.8)] transition-all uppercase tracking-widest border border-royal-gold-light"
          >
            Begin the Journey
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
