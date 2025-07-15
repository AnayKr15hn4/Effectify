  import React from 'react';
  import { Type, Scroll, Palette, Image, Sparkles, Heart, MousePointer, Grid3X3, Loader } from 'lucide-react';

  const categoryIcons = {
  text: Type,
  scroll: Scroll,
  bg: Palette,
  gallery: Image,
  button: MousePointer,
  loading: Loader,
  others: Grid3X3,
  favorites: Heart,
};

  const categoryLabels = {
  text: 'Text Effects',
  scroll: 'Scroll Effects',
  bg: 'Background Effects',
  gallery: 'Gallery Effects',
  button: 'Button Effects',
  loading: 'Loading Effects',
  others: 'Other Effects',
  favorites: 'Favorites',
};

  const categoryColors = {
    text: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
      text: 'text-cyan-400',
      hover: 'hover:bg-cyan-500/20',
      active: 'bg-cyan-500 text-black'
    },
    scroll: {
      bg: 'bg-pink-500/10',
      border: 'border-pink-500/30', 
      text: 'text-pink-400',
      hover: 'hover:bg-pink-500/20',
      active: 'bg-pink-500 text-black'
    },
    bg: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      text: 'text-purple-400', 
      hover: 'hover:bg-purple-500/20',
      active: 'bg-purple-500 text-black'
    },
    gallery: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-400',
      hover: 'hover:bg-green-500/20', 
      active: 'bg-green-500 text-black'
    },
    button: {
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/30',
      text: 'text-orange-400',
      hover: 'hover:bg-orange-500/20',
      active: 'bg-orange-500 text-black'
    },
    others: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
      hover: 'hover:bg-yellow-500/20',
      active: 'bg-yellow-500 text-black'
    },
    loading: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    hover: 'hover:bg-blue-500/20',
    active: 'bg-blue-500 text-black'
    },
    favorites: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      hover: 'hover:bg-red-500/20',
      active: 'bg-red-500 text-black'
    }
  };

  interface CategoryFilterProps {
    selectedCategory: string | null;
    onCategoryChange: (category: string | null) => void;
    favoritesCount?: number;
  }

  export const CategoryFilter: React.FC<CategoryFilterProps> = ({
    selectedCategory,
    onCategoryChange,
    favoritesCount = 0,
  }) => {
    const categories = ['favorites', 'text', 'scroll', 'bg', 'gallery', 'button', 'loading', 'others'] as const;

    return (
      <div className="mb-20">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-white mr-2" />
            <h2 className="text-3xl font-black text-white">
              Choose Your Effect Category
            </h2>
          </div>
          <p className="text-white/70 max-w-2xl mx-auto font-secondary">
            Browse through our curated collection of UI effects, organized by type and purpose
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6">
        <button
          onClick={() => onCategoryChange(null)}
          className={`flex items-center space-x-3 px-6 py-3 rounded-xl border transition-all duration-200 ${
            selectedCategory === null
              ? 'bg-white text-black border-white'
              : 'bg-transparent text-white border-white/20 hover:bg-white/10 hover:border-white/40'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="font-bold">All Effects</span>
        </button>
        
        {categories.map((category) => {
          const Icon = categoryIcons[category];
          const colors = categoryColors[category];
          const isSpecialCategory = category === 'favorites';
          
          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`flex items-center space-x-3 px-6 py-3 rounded-xl border transition-all duration-200 ${
                selectedCategory === category
                  ? `${colors.active} ${colors.border}`
                  : `${colors.bg} ${colors.border} ${colors.text} ${colors.hover}`
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-bold font-secondary">
                {categoryLabels[category]}
                {isSpecialCategory && favoritesCount > 0 && (
                  <span className="ml-1 text-xs opacity-75">({favoritesCount})</span>
                )}
              </span>
            </button>
          );
        })}
        </div>
      </div>
    );
  };