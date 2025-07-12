import React from 'react';
import { Code2, Sparkles } from 'lucide-react';

interface HeaderProps {
  onToggleCodeMode: () => void;
  isCodeMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleCodeMode, isCodeMode }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={scrollToTop}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
          >
            <Sparkles className="w-7 h-7 text-white" />
            <h1 className="text-2xl font-black text-white tracking-tight">
              Effectify
            </h1>
          </button>
          
          <button
            onClick={onToggleCodeMode}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              isCodeMode 
                ? 'bg-white text-black' 
                : 'bg-transparent text-white hover:bg-white/10'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span className="font-medium font-secondary">
              {isCodeMode ? 'Preview Mode' : 'Code Mode'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};