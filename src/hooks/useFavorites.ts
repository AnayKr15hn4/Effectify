import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'efectify-favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites);
        const validFavorites = Array.isArray(parsed) ? parsed.filter(id => id && typeof id === 'string') : [];
        setFavorites(validFavorites);
      } catch (error) {
        setFavorites([]);
      }
    }
  }, []);

  const toggleFavorite = (effectId: string) => {
    if (!effectId) return;

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