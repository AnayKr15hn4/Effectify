import React from 'react';
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Hero } from './components/Hero';
import { Header } from './components/Header';
import { CategoryFilter } from './components/CategoryFilter';
import { EffectCard } from './components/EffectCard';
import { EffectModal } from './components/EffectModal';
import { effects } from './data/effects';
import { Effect } from './types/Effect';
import { useFavorites } from './hooks/useFavorites';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [selectedEffect, setSelectedEffect] = useState<Effect | null>(null);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const filteredEffects = selectedCategory === 'favorites'
    ? effects.filter(effect => favorites.includes(effect.id))
    : selectedCategory
    ? effects.filter(effect => effect.category === selectedCategory)
    : effects;

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header 
        onToggleCodeMode={() => setIsCodeMode(!isCodeMode)}
        isCodeMode={isCodeMode}
      />
      
      <Hero />
      
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            favoritesCount={favorites.length}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEffects.map((effect) => (
              <EffectCard
                key={effect.id}
                effect={effect}
                isCodeMode={isCodeMode}
                onPreview={setSelectedEffect}
                isFavorite={isFavorite(effect.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>

          {filteredEffects.length === 0 && (
            <div className="text-center py-12">
              {selectedCategory === 'favorites' ? (
                <div>
                  <Heart className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <p className="text-white text-lg mb-2">No favorites yet</p>
                  <p className="text-white/70">Click the heart icon on any effect to add it to your favorites</p>
                </div>
              ) : (
                <p className="text-white text-lg">
                  No effects found in this category.
                </p>
              )}
            </div>
          )}
        </div>
      </main>

      <EffectModal
        effect={selectedEffect}
        onClose={() => setSelectedEffect(null)}
      />
    </div>
  );
}

export default App;
