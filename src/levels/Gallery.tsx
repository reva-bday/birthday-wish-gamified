import { motion } from 'motion/react';
import { getAssetPath } from '../lib/constants';

export function Gallery() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-5xl py-8 px-4"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-serif text-royal-gold-light mb-4 drop-shadow-lg">
          The Royal Vault
        </h2>
        <p className="text-parchment-dark font-sans text-lg">
          All collected artifacts and memories are preserved here forever.
        </p>
      </div>

      {/* The Final Picture Revealed */}
      <div className="mb-16 flex flex-col items-center">
         <h3 className="text-2xl font-serif text-royal-gold mb-6 border-b border-royal-gold/20 pb-2 px-10">The Grand Portrait</h3>
         <div className="relative p-3 bg-stone-light rounded shadow-2xl border border-royal-gold border-opacity-40 max-w-2xl w-full">
            <div className="absolute inset-2 bg-stone/80 text-parchment-dark flex flex-col items-center justify-center text-center p-4 z-0">
               <span>Missing Grand Portrait</span>
               <span className="text-xs mt-2">Upload: /public/assets/finale/final.jpeg</span>
            </div>
            <img 
               src={getAssetPath('/assets/finale/final.jpeg')} 
               alt="Finale Reveal" 
               className="relative z-10 w-full h-auto object-cover rounded shadow-inner filter sepia-[0.2] contrast-[1.1] brightness-[0.9]"
               onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
            />
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
         {/* Memory Fragments Area (Level 1 & 4 stuff) */}
        <div>
           <h3 className="text-2xl font-serif text-royal-gold mb-6 border-b border-royal-gold/20 pb-2">Recovered Fragments</h3>
           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                '/assets/level1/pic1.jpeg',
                '/assets/level1/pic2.jpg',
                '/assets/level1/pic3.jpeg',
                '/assets/level1/pic4.jpeg',
                '/assets/level1/pic5.jpeg'
              ].map((src, i) => (
                 <div key={i} className="aspect-square relative bg-stone rounded overflow-hidden border border-royal-gold/20 shadow-md group">
                    <img src={getAssetPath(src)} alt={`Memory ${i + 1}`} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 sepia-[0.3]" 
                         onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }} />
                 </div>
              ))}
              {[1, 2, 3, 4, 5].map(i => (
                 <div key={`s-${i}`} className="aspect-square relative bg-stone rounded overflow-hidden border border-royal-gold/20 shadow-md group">
                    <img src={getAssetPath(`/assets/level3/scratch${i}.jpeg`)} alt={`Memory ${i}`} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 sepia-[0.3]" 
                         onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }} />
                 </div>
              ))}
           </div>
        </div>

        {/* Music and Story Area */}
        <div className="flex flex-col gap-10">
           <div>
              <h3 className="text-2xl font-serif text-royal-gold mb-6 border-b border-royal-gold/20 pb-2">The Royal Anthem</h3>
              <div className="bg-stone-900 border border-royal-gold/30 rounded-xl p-6 flex flex-col items-center">
                 <audio controls className="w-full theme-audio-player opacity-90" src={getAssetPath('/assets/level2/ringtone.mp3')} />
                 <p className="text-sm italic text-parchment-dark mt-4 text-center">The song that echoed through the time-slipping corridors.</p>
              </div>
           </div>

           <div>
              <h3 className="text-2xl font-serif text-royal-gold mb-6 border-b border-royal-gold/20 pb-2">The Puzzle Fresco</h3>
              <div className="bg-stone-900 border border-royal-gold/30 rounded-xl p-2">
                 <img src={getAssetPath('/assets/level4/puzzle.jpeg')} alt="Mural" className="w-full h-auto rounded filter sepia-[0.3]" onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}/>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
