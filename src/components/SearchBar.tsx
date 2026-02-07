import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  const clearSearch = () => {
    onSearchChange('');
  };

  return (
    <div className="relative" style={{ transform: 'translateY(-39%)' }}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
        <input
          type="text"
          placeholder="Search effects, authors, or tags..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-80 pl-10 pr-10 py-2 bg-zinc-800 border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-zinc-700 transition-all duration-200 font-secondary"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors duration-200"
            title="Clear search"
          >
            <X className="w-3 h-3 text-white/70 hover:text-white" />
          </button>
        )}
      </div>
    </div>
  );
};