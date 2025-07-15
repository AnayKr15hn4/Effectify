import React from 'react';
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Hero } from './components/Hero';
import { Header } from './components/Header';
import { CategoryFilter } from './components/CategoryFilter';
import { SortFilter } from './components/SortFilter';
import { SearchBar } from './components/SearchBar';
import { EffectCard } from './components/EffectCard';
import { EffectModal } from './components/EffectModal';
import { effects } from './data/effects';
import { Effect } from './types/Effect';
import { useFavorites } from './hooks/useFavorites';
import { useSort } from './hooks/useSort';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [selectedEffect, setSelectedEffect] = useState<Effect | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { sortedEffects, sortOption, setSortOption } = useSort(effects);

  // Apply search filter first
  const searchFilteredEffects = searchQuery
    ? sortedEffects.filter(effect => 
        effect.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        effect.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        effect.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        effect.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : sortedEffects;

  // Then apply category filter
  const filteredEffects = selectedCategory === 'favorites'
    ? searchFilteredEffects.filter(effect => favorites.includes(effect.id))
    : selectedCategory
    ? searchFilteredEffects.filter(effect => effect.category === selectedCategory)
    : searchFilteredEffects;

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

          <div className="flex items-center justify-between mb-8 gap-6">
            <SortFilter
              selectedSort={sortOption}
              onSortChange={setSortOption}
            />
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>

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
              {searchQuery ? (
                <div>
                  <p className="text-white text-lg mb-2">No effects found</p>
                  <p className="text-white/70">Try adjusting your search terms or browse by category</p>
                </div>
              ) : selectedCategory === 'favorites' ? (
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
