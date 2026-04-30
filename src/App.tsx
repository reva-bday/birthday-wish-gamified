import { useState, useEffect } from 'react';
import { GameLevel } from './types';
import { GameLayout } from './components/GameLayout';
import { Intro } from './levels/Intro';
import { Level1Chronology } from './levels/Level1Chronology';
import { Level2Music } from './levels/Level2Music';
import { Level3MCQ } from './levels/Level3MCQ';
import { Level4Puzzle } from './levels/Level4Puzzle';
import { Level5Matching } from './levels/Level5Matching';
import { Finale } from './levels/Finale';
import { Gallery } from './levels/Gallery';
import { RewardModal } from './components/RewardModal';
import { LEVEL_ORDER } from './lib/constants';

// We'll use localStorage to save progress so she doesn't lose it on refresh!
function loadSavedState() {
  try {
    const saved = localStorage.getItem('tapestryOfErasSave');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.completedLevels) {
        parsed.completedLevels = [];
      }
      return parsed;
    }
  } catch (e) {
    console.error("Failed to load save", e);
  }
  return {
    currentLevel: 'intro' as GameLevel,
    highestLevel: 'intro' as GameLevel,
    completedLevels: [] as string[],
    amulets: 0,
    scrolls: 0,
    galleryUnlocked: false
  };
}

export default function App() {
  const [gameState, setGameState] = useState(loadSavedState);
  const [showReward, setShowReward] = useState<{show: boolean, msg: string}>({show: false, msg: ""});

  useEffect(() => {
    localStorage.setItem('tapestryOfErasSave', JSON.stringify(gameState));
  }, [gameState]);

  const advanceLevel = (rewardMsg: string) => {
    setGameState((prev: any) => {
      const currentIndex = LEVEL_ORDER.indexOf(prev.currentLevel);
      const nextLevel = LEVEL_ORDER[currentIndex + 1] || 'gallery';

      const isCoreLevel = prev.currentLevel !== 'intro' && prev.currentLevel !== 'finale' && prev.currentLevel !== 'gallery';
      const isNewlyCompleted = isCoreLevel && !prev.completedLevels.includes(prev.currentLevel);

      let addedAmulets = isNewlyCompleted ? 1 : 0;
      let addedScrolls = isNewlyCompleted ? 1 : 0;

      const highestIndex = LEVEL_ORDER.indexOf(prev.highestLevel);
      const nextHighestIndex = Math.max(highestIndex, LEVEL_ORDER.indexOf(nextLevel));

      return {
        ...prev,
        amulets: Math.min(5, prev.amulets + addedAmulets),
        scrolls: Math.min(5, prev.scrolls + addedScrolls),
        completedLevels: isNewlyCompleted ? [...prev.completedLevels, prev.currentLevel] : prev.completedLevels,
        currentLevel: nextLevel,
        highestLevel: LEVEL_ORDER[nextHighestIndex] || 'gallery'
      };
    });

    if (rewardMsg) {
      setShowReward({ show: true, msg: rewardMsg });
    }
  };

  const handleNextAfterReward = () => {
    setShowReward({ show: false, msg: "" });
  };

  const goToHome = () => {
    setGameState(prev => ({...prev, currentLevel: 'intro'}));
  };

  const skipToLevel = (level: GameLevel) => {
    setGameState(prev => ({
      ...prev, 
      currentLevel: level,
      // If dev skipped, update highest level so they don't break logic
      highestLevel: LEVEL_ORDER[Math.max(LEVEL_ORDER.indexOf(prev.highestLevel), LEVEL_ORDER.indexOf(level))] || 'gallery'
    }));
  };

  const continueJourney = () => {
    setGameState(prev => ({...prev, currentLevel: prev.highestLevel}));
  };

  return (
    <>
      <GameLayout 
      amulets={gameState.amulets} 
      scrolls={gameState.scrolls}
      onGoHome={goToHome}
      onSkipToLevel={skipToLevel}
      currentLevel={gameState.currentLevel}
      highestLevel={gameState.highestLevel}
      vaultUnlocked={gameState.galleryUnlocked}
    >
        {gameState.currentLevel === 'intro' && (
          <Intro 
            onStart={() => advanceLevel("")} 
            onContinue={continueJourney}
            hasProgress={gameState.highestLevel !== 'intro'}
          />
        )}
        
        {gameState.currentLevel === 'memory' && !showReward.show && (
          <Level1Chronology onComplete={() => advanceLevel("The timeline stands true. You have recovered the first piece of the Ancient Amulet and a secret scroll of the court.")} />
        )}

        {gameState.currentLevel === 'music' && !showReward.show && (
          <Level2Music onComplete={() => advanceLevel("The anthem pleases the ancient spirits. You claim the second Amulet piece and a scroll of melodies.")} />
        )}

        {gameState.currentLevel === 'mcq' && !showReward.show && (
          <Level3MCQ onComplete={() => advanceLevel("A flawless memory! The third Amulet piece is yours, along with a newly discovered scroll.")} />
        )}

        {gameState.currentLevel === 'puzzle' && !showReward.show && (
          <Level4Puzzle onComplete={() => advanceLevel("The mural reveals its hidden passage! You found the fourth piece of the Ancient Amulet and another royal scroll.")} />
        )}

        {gameState.currentLevel === 'matching' && !showReward.show && (
          <Level5Matching onComplete={() => advanceLevel("The messengers are united with their scrolls. The final Amulet piece is in your hands!")} />
        )}

        {gameState.currentLevel === 'finale' && !showReward.show && (
          <Finale 
            amuletPieces={gameState.amulets} 
            onUnlock={() => {
              // Ensure we are in finale and mark vault as unlocked
              setGameState(prev => ({ 
                ...prev, 
                galleryUnlocked: true,
                completedLevels: !prev.completedLevels.includes('finale') ? [...prev.completedLevels, 'finale'] : prev.completedLevels 
              }));
            }} 
          />
        )}

        {gameState.currentLevel === 'gallery' && !showReward.show && (
          <Gallery />
        )}
      </GameLayout>

      {/* Render the reward modal on top when active */}
      {showReward.show && (
        <RewardModal 
          levelCompleteInfo={showReward.msg} 
          onContinue={handleNextAfterReward} 
        />
      )}
    </>
  );
}
