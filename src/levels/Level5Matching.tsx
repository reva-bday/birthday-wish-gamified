import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { cn } from '../lib/utils';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

// Dummy data for Level 5
const MESSAGES_DATA = [
  { id: 'm1', text: "Happy Birthday da, inaiku matum dhan idhalam solran adhunala ketuko. Enanu yosikadha romba. Unu solradhuku ila, poi velaiya paru avlodhann🥱. Be brave and confident wherever you go!! - UG ▶️ Office ▶️ PG", friendName: "Vignesh" },
  { id: 'm2', text: "Happy birthday panni!🥳", friendName: "Ram" },
  { id: 'm3', text: "Gappy Bithday Reva! 💜", friendName: "Gk" },
  { id: 'm4', text: "Ini vaazhum kaalangal yaavum minukkum minu minukkume! ✨", friendName: "Sri" },
  { id: 'm5', text: "Let’s make it a habit to sit down for real deep talks, and wish you become an even stronger!", friendName: "Jc" },
];

export function Level5Matching({ onComplete }: Props) {
  const [messages, setMessages] = useState<{ id: string, text: string }[]>([]);
  const [friends, setFriends] = useState<{ id: string, name: string }[]>([]);

  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [iterations, setIterations] = useState(0);
  const [errorHighlightId, setErrorHighlightId] = useState<string | null>(null);

  const dropZoneRefs = useRef<{ [id: string]: HTMLElement | null }>({});

  useEffect(() => {
    // Separate into messages and friends, and shuffle them independently
    const msgs = MESSAGES_DATA.map(m => ({ id: m.id, text: m.text })).sort(() => Math.random() - 0.5);
    const frnds = MESSAGES_DATA.map(m => ({ id: m.id, name: m.friendName })).sort(() => Math.random() - 0.5);

    setMessages(msgs);
    setFriends(frnds);
  }, []);

  const handleMessageClick = (msgId: string) => {
    setSelectedMessageId(prev => prev === msgId ? null : msgId);
  };

  const handleFriendClick = (friendId: string) => {
    if (selectedMessageId) {
      if (selectedMessageId === friendId) {
        // Correct match
        const newMatched = new Set(matchedIds).add(selectedMessageId);
        setMatchedIds(newMatched);
        setSelectedMessageId(null);
        if (newMatched.size === MESSAGES_DATA.length) {
          setTimeout(onComplete, 1500);
        }
      } else {
        // Wrong match
        setIterations(i => i + 1);
        setErrorHighlightId(friendId);
        setTimeout(() => setErrorHighlightId(null), 800);
      }
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo, messageId: string) => {
    const pointerX = info.point.x;
    const pointerY = info.point.y;

    let droppedFriendId = null;
    for (const [fId, el] of Object.entries(dropZoneRefs.current) as [string, HTMLElement | null][]) {
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      // Increase drop zone tolerance
      if (
        pointerX >= rect.left - 20 &&
        pointerX <= rect.right + 20 &&
        pointerY >= rect.top - 20 &&
        pointerY <= rect.bottom + 20
      ) {
        droppedFriendId = fId;
        break;
      }
    }

    if (droppedFriendId) {
      if (messageId === droppedFriendId) {
        // Correct match
        const newMatched = new Set(matchedIds).add(messageId);
        setMatchedIds(newMatched);
        if (newMatched.size === MESSAGES_DATA.length) {
          setTimeout(onComplete, 1500);
        }
      } else {
        // Wrong match
        setIterations(i => i + 1);
        setErrorHighlightId(droppedFriendId);
        setTimeout(() => setErrorHighlightId(null), 800);
      }
    }
  };

  const assignRef = useCallback((id: string, el: HTMLElement | null) => {
    dropZoneRefs.current[id] = el;
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="p-4 sm:p-10 w-full max-w-4xl flex flex-col items-center"
    >
      <div className="bg-gradient-to-b from-transparent to-stone-900/50 absolute inset-0 pointer-events-none -z-10 rounded-3xl" />
      <h2 className="text-2xl sm:text-3xl font-serif text-royal-gold-light mb-4 text-center">Level V: The Messengers' Scrolls</h2>
      <p className="text-parchment-dark mb-4 text-center max-w-xl text-sm sm:text-base">
        Couriers from across the kingdom have brought tidings from your closest allies.
        Drag and attach the scroll to the correct sender.
      </p>

      {iterations > 0 && matchedIds.size < MESSAGES_DATA.length && (
        <div className="mb-6 px-4 py-2 bg-stone-light/20 rounded-full border border-royal-gold/20 flex items-center gap-2 text-royal-gold-light text-sm font-sans">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span className="font-bold text-red-300">You taking {iterations} guesses, lol?</span>
        </div>
      )}
      {matchedIds.size === MESSAGES_DATA.length && (
        <div className="mb-6 px-4 py-2 bg-stone-light/20 rounded-full border border-royal-gold/20 flex items-center gap-2 text-royal-gold-light text-sm font-sans">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="font-bold text-green-300">Wow, you took {iterations} {iterations === 1 ? 'guess' : 'guesses'}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:gap-8 w-full relative mt-4">
        {/* Messages Column (Draggables) */}
        <div className="flex flex-col gap-8 w-full">
          <h3 className="font-serif text-center text-royal-gold mb-2 border-b border-royal-gold/20 w-full pb-2">The Scrolls</h3>
          {messages.map((msg) => {
            const isMatched = matchedIds.has(msg.id);
            const isSelected = selectedMessageId === msg.id;
            if (isMatched) return null; // Hide matched items from source

            return (
              <motion.div
                key={`msg-${msg.id}`}
                layoutId={`piece-${msg.id}`}
                drag
                dragSnapToOrigin
                onDragEnd={(e, info) => handleDragEnd(e, info, msg.id)}
                whileDrag={{ scale: 1.05, zIndex: 100, cursor: 'grabbing', rotate: 2 }}
                onClick={() => handleMessageClick(msg.id)}
                className="w-full relative cursor-grab bg-transparent select-none z-10 group mt-5"
              >
                <div className={cn(
                  "relative w-full rounded-lg bg-gradient-to-b from-[#d1d5db] to-[#6b7280] border-2 border-stone-700 p-3 sm:p-4 flex items-center justify-center min-h-[5rem] transition-all",
                  isSelected ? "ring-2 ring-royal-gold/60 scale-105 z-20 shadow-[0_10px_25px_rgba(0,0,0,0.6)]" : "group-hover:brightness-110 shadow-[0_5px_15px_rgba(0,0,0,0.4)]"
                )}>
                  {/* Silver Tab Top */}
                  <div className="absolute -top-[24px] left-1/2 -translate-x-1/2 w-[32px] h-[24px] rounded-t-full bg-[#d1d5db] border-t-2 border-l-2 border-r-2 border-stone-700" />
                  {/* Blocker for Tab Seam */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[28px] h-[4px] bg-[#d1d5db] -translate-y-[2px]" />

                  <span className="relative z-20 pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] font-serif italic text-stone-200 text-center text-xs sm:text-sm font-medium leading-relaxed">"{msg.text}"</span>
                </div>
              </motion.div>
            );
          })}
          {matchedIds.size === MESSAGES_DATA.length && (
            <div className="flex-1 flex items-center justify-center italic text-stone-light/50 font-serif">
              All messages restored.
            </div>
          )}
        </div>

        {/* Friends Column (Drop Zones) */}
        <div className="flex flex-col gap-8 w-full">
          <h3 className="font-serif text-center text-royal-gold mb-2 border-b border-royal-gold/20 w-full pb-2">The Senders</h3>
          {friends.map((friend) => {
            const isMatched = matchedIds.has(friend.id);
            const isError = errorHighlightId === friend.id;
            const matchedMsg = messages.find(m => m.id === friend.id);

            return (
              <motion.div
                key={`frnd-${friend.id}`}
                ref={el => assignRef(friend.id, el)}
                animate={isError ? { x: [0, -6, 6, -6, 6, 0] } : {}}
                transition={{ duration: 0.3 }}
                className="w-full relative block mt-5"
              >
                {!isMatched ? (
                  <div
                    onClick={() => handleFriendClick(friend.id)}
                    className={cn(
                      "w-full relative rounded-lg transition-all min-h-[5rem] flex flex-col items-center justify-center p-3 sm:p-4 cursor-pointer shadow-md select-none group border-2 border-dashed",
                      selectedMessageId && !isError ? "ring-2 ring-royal-gold/40 hover:bg-stone-800" : "",
                      isError ? "border-red-500 bg-red-900/50" : "border-stone-500 bg-stone-900/60"
                    )}
                  >
                    {/* Top Tab for the Name Slot */}
                    <div className={cn(
                      "absolute -top-[24px] left-1/2 -translate-x-1/2 w-[32px] h-[24px] rounded-t-full border-t-2 border-l-2 border-r-2 border-dashed pointer-events-none",
                      isError ? "border-red-500" : "border-stone-500 bg-stone-900/60 group-hover:bg-stone-800"
                    )} />
                    {/* Blocker to make tab area continuous */}
                    <div className={cn(
                      "absolute top-0 left-1/2 -translate-x-1/2 w-[28px] h-[4px] -translate-y-[2px] transition-colors pointer-events-none",
                      isError ? "bg-[#3a1a1b]" : "bg-[#181615] group-hover:bg-[#201d1c]"
                    )} />

                    {/* Content */}
                    <span className={cn(
                      "relative z-10 text-center font-serif tracking-widest font-bold uppercase pointer-events-none text-xs sm:text-sm drop-shadow-md",
                      isError ? "text-red-300" : "text-stone-300"
                    )}>
                      {friend.name}
                    </span>
                  </div>
                ) : (
                  <motion.div
                    layoutId={`piece-${friend.id}`}
                    className="w-full relative rounded-lg border border-yellow-600 bg-gradient-to-b from-[#d4af37] via-[#aa7a1e] to-[#6b4712] p-3 sm:p-4 flex flex-col justify-between items-center shadow-[0_5px_20px_rgba(212,175,55,0.4)] min-h-[5rem]"
                  >
                    {/* Golden Tab Top */}
                    <div className="absolute -top-[24px] left-1/2 -translate-x-1/2 w-[32px] h-[24px] rounded-t-full bg-[#d4af37] border-t border-l border-r border-yellow-600 pointer-events-none" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[30px] h-[4px] bg-[#d4af37] -translate-y-[2px] pointer-events-none" />

                    {/* The Message */}
                    <p className="font-serif italic text-[#fffce8] text-center pointer-events-none font-medium mb-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] z-20 text-[10px] sm:text-xs">"{matchedMsg?.text}"</p>

                    {/* Solid Golden Background Name */}
                    <span className="text-center font-serif tracking-widest font-bold uppercase text-[#fffbe6] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] z-20 text-xs sm:text-base border-t border-[#fdf098]/30 pt-2 w-full mt-auto">
                      {friend.name}
                    </span>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {matchedIds.size === MESSAGES_DATA.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="mt-10 flex flex-col items-center"
          >
            <div className="text-xl font-serif text-green-400 flex items-center gap-2 mb-6">
              <CheckCircle className="w-6 h-6" /> All connections restored
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onComplete}
              className="px-10 py-4 bg-royal-gold text-chola-red font-serif font-bold text-xl rounded shadow-lg uppercase tracking-widest"
            >
              Enter the Inner Sanctum
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
