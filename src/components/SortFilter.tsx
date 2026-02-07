import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Shuffle } from 'lucide-react';
import { SortOption } from '../hooks/useSort';

interface SortFilterProps {
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const sortOptions = [
  { id: 'alphabetical', label: 'A → Z', icon: ArrowUp },
  { id: 'reverse-alphabetical', label: 'Z → A', icon: ArrowDown },
  { id: 'random', label: 'Random', icon: Shuffle },
] as const;

export const SortFilter: React.FC<SortFilterProps> = ({
  selectedSort,
  onSortChange,
}) => {
  return (
    <div className="flex items-center space-x-4 mb-8">
      <span className="text-white font-medium font-secondary">Sort by:</span>
      <div className="flex flex-wrap gap-2">
        {sortOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              onClick={() => onSortChange(option.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                selectedSort === option.id
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-white border-white/20 hover:bg-white/10 hover:border-white/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium font-secondary">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};