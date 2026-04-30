import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KeyRound, LockOpen } from 'lucide-react';
import { cn } from '../lib/utils';
import { getAssetPath } from '../lib/constants';
import { AmuletPieceIcon } from '../components/AmuletPieceIcon';

interface Props {
  amuletPieces: number;
  onUnlock: () => void;
}

const PASSWORD = "ERA"; // User can change this later!

export function Finale({ amuletPieces, onUnlock }: Props) {
  const [amuletsMerged, setAmuletsMerged] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [errorStatus, setErrorStatus] = useState(false);
  const [photoRevealed, setPhotoRevealed] = useState(false);

  // We have 5 pieces. We will form them in a circle.
  const handleMerge = () => {
    setAmuletsMerged(true);
    setTimeout(() => setShowPassword(true), 1500);
  };

  const handleUnlock = () => {
    if (passwordInput.toUpperCase().trim() === PASSWORD) {
      setErrorStatus(false);
      setPhotoRevealed(true);
      onUnlock();
    } else {
      setErrorStatus(true);
      setTimeout(() => setErrorStatus(false), 800);
    }
  };

  if (photoRevealed) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="fixed inset-0 z-40 bg-black flex items-center justify-center overflow-hidden"
      >
        <img 
          src={getAssetPath('/assets/finale.jpeg')} 
          onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1517260739337-6799d239ce83?q=80&w=1600&auto=format&fit=crop"; }}
          alt="Happy Birthday" 
          /* 
           * === ZOOM TUNING FOR MOBILE ===
           * We use 'object-contain' so it doesn't crop drastically, and zoom it in 
           * with 'scale-[1.25]' to reduce the empty gaps on top and bottom.
           * -> Change 'scale-[1.25]' to 'scale-[1.10]' to zoom OUT a bit more.
           * -> Change 'scale-[1.25]' to 'scale-[1.40]' to zoom IN a bit more.
           */
          className="w-full h-full object-contain scale-[2.5] sm:scale-100 sm:object-cover origin-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-0 right-0 flex flex-col items-center pointer-events-none select-none z-50 drop-shadow-2xl px-4"
        >
          <span className="text-4xl sm:text-5xl md:text-6xl text-[#D4AF37] -mb-4 sm:-mb-6 z-10" style={{ fontFamily: '"Great Vibes", cursive', textShadow: '2px 2px 5px rgba(0,0,0,1)' }}>Happy Birthday</span>
          <span className="text-5xl sm:text-7xl md:text-8xl text-[#DFB941] tracking-widest uppercase z-0" style={{ fontFamily: '"Montserrat", sans-serif', textShadow: '4px 4px 10px rgba(0,0,0,0.9), 0px 0px 20px rgba(0,0,0,0.5)' }}>REVATHI</span>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center w-full min-h-[60vh]"
    >
      <h2 className="text-4xl font-serif text-royal-gold mb-12 drop-shadow-lg text-center">
        The Heart of the Kingdom
      </h2>

      <div className="relative w-72 h-72 mb-16 flex items-center justify-center">
        {/* Glow effect */}
        <div className={cn(
          "absolute inset-0 bg-royal-gold/20 rounded-full blur-3xl transition-opacity duration-1000 z-0",
          amuletsMerged ? "opacity-100" : "opacity-0"
        )}></div>

        {Array.from({ length: 5 }).map((_, i) => {
          const hasPiece = i < amuletPieces;
          const angleDeg = i * 72;
          const rad = (angleDeg - 90) * (Math.PI / 180);
          
          return (
            <motion.div
              key={i}
              initial={false}
              animate={{
                rotate: amuletsMerged ? angleDeg : angleDeg + (hasPiece ? 10 : 0),
                x: amuletsMerged ? 0 : Math.cos(rad) * 60,
                y: amuletsMerged ? 0 : Math.sin(rad) * 60,
                scale: amuletsMerged ? 1 : (hasPiece ? 0.9 : 0.4),
                opacity: hasPiece ? 1 : 0.1
              }}
              transition={{ duration: 1.5, type: "spring", bounce: 0.3 }}
              className="absolute z-10"
              style={{
                width: '200px',
                height: '150px',
                top: '50%',
                left: '50%',
                marginTop: '-150px',
                marginLeft: '-100px',
                transformOrigin: 'bottom center'
              }}
            >
              <AmuletPieceIcon className="w-full h-full drop-shadow-2xl overflow-visible" />
            </motion.div>
          );
        })}

        {/* Center Stone Keyhole Overlay */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: amuletsMerged ? 1 : 0, opacity: amuletsMerged ? 1 : 0 }}
          transition={{ delay:amuletsMerged ? 1 : 0, duration: 0.8, type: 'spring' }}
          className="absolute z-30 w-24 h-24 rounded-full bg-[#059669] border-[6px] border-[#fef08a] flex items-center justify-center shadow-[inset_0_0_40px_#022c22,0_0_50px_#10b981] cursor-pointer hover:scale-105 transition-transform overflow-hidden group"
          onClick={() => setShowPassword(true)}
        >
          {/* Gem Facets / Reflections */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent"></div>
          <div className="absolute top-1 left-2 w-4 h-6 bg-white/40 rounded-full blur-[2px] transform rotate-45"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_black_120%)] opacity-50"></div>
        </motion.button>
      </div>

      <AnimatePresence>
        {!amuletsMerged && amuletPieces >= 5 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <button 
              onClick={handleMerge}
              className="px-8 py-3 bg-gradient-to-r from-royal-gold to-royal-gold-light text-chola-red font-serif font-bold text-lg rounded shadow-[0_0_15px_rgba(195,154,82,0.4)] uppercase tracking-widest"
            >
              Unite the Fragments
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPassword && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex flex-col items-center gap-4 w-full max-w-sm"
          >
            <p className="font-serif text-parchment-dark text-center italic">
              "Speak the final word to break the seal."
            </p>
            <div className="flex w-full">
              <input 
                type="text" 
                placeholder="Enter password..."
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                className={cn(
                  "flex-1 bg-stone/80 border-2 text-parchment font-serif p-3 rounded-l focus:outline-none placeholder:text-stone-light/50 transition-colors uppercase text-center tracking-widest",
                  errorStatus ? "border-red-500 text-red-100" : "border-royal-gold/50 focus:border-royal-gold"
                )}
                onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
              />
              <button 
                onClick={handleUnlock}
                className="bg-royal-gold p-3 rounded-r border-2 border-l-0 border-royal-gold hover:bg-royal-gold-light text-chola-red transition-colors"
              >
                <LockOpen className="w-6 h-6" />
              </button>
            </div>
            {errorStatus && (
              <span className="text-red-400 font-serif text-sm">The seal remains intact. The word is incorrect.</span>
            )}
            <span className="text-[10px] text-stone-light mt-4">Hint: The password is currently set to "ERA" in the code.</span>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
