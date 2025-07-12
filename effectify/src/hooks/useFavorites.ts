import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'efectify-favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
        setFavorites([]);
      }
    }
  }, []);

  const toggleFavorite = (effectId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(effectId)
        ? prev.filter(id => id !== effectId)
        : [...prev, effectId];
      
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (effectId: string) => favorites.includes(effectId);

  return {
    favorites,
    toggleFavorite,
    isFavorite
  };
};