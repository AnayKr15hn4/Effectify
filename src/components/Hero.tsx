import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  const scrollToEffects = () => {
    const effectsSection = document.querySelector('main');
    if (effectsSection) {
      effectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // trigger rerender every 7 seconds
  const [seed, setSeed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeed(prev => prev + 1);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Black background */}
      <div className="absolute inset-0 bg-black min-h-screen" />

      {/* Floating particles */}
      <div className="absolute inset-0 min-h-screen">
        {[...Array(20)].map((_, i) => (
          <div
            key={`${seed}-${i}`}
            className="absolute w-1 h-1 bg-white/40 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Hero content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-20 h-20 text-white mr-4" />
            <h1 className="text-7xl md:text-8xl font-black text-white tracking-tight">
              Effectify
            </h1>
          </div>

          <button 
            onClick={scrollToEffects}
            className="mt-12 px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-all duration-200 transform hover:scale-105 font-secondary"
          >
            Explore Effects
          </button>
        </div>
      </div>
    </section>
  );
};
