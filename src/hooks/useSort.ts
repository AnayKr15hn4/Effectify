import { useState, useMemo } from 'react';
import { Effect } from '../types/Effect';

export type SortOption = 'alphabetical' | 'reverse-alphabetical' | 'random';

export const useSort = (effects: Effect[]) => {
  const [sortOption, _setSortOption] = useState<SortOption>('alphabetical');
  const [randomSeed, setRandomSeed] = useState(Math.random());

  const sortedEffects = useMemo(() => {
    const effectsCopy = [...effects];
    
    switch (sortOption) {
      case 'alphabetical':
        return effectsCopy.sort((a, b) => a.title.localeCompare(b.title));
      
      case 'reverse-alphabetical':
        return effectsCopy.sort((a, b) => b.title.localeCompare(a.title));
      
      case 'random':
        // Use Fisher-Yates shuffle with consistent seed for this render
        const seededRandom = (seed: number) => {
          const x = Math.sin(seed) * 10000;
          return x - Math.floor(x);
        };
        
        for (let i = effectsCopy.length - 1; i > 0; i--) {
          const j = Math.floor(seededRandom(randomSeed + i) * (i + 1));
          [effectsCopy[i], effectsCopy[j]] = [effectsCopy[j], effectsCopy[i]];
        }
        return effectsCopy;
      
      default:
        return effectsCopy;
    }
  }, [effects, sortOption, randomSeed]);

  const setSortOption = (option: SortOption) => {
    if (option === 'random') {
      // Generate new random seed when switching to random
      setRandomSeed(Math.random());
    }
    _setSortOption(option);
  };

  return {
    sortedEffects,
    sortOption,
    setSortOption,
  };
};