import React from 'react';
import { ChevronRight } from 'lucide-react';
import { AssetCategory } from '../types';

interface CategoryNavProps {
  selectedCategory: AssetCategory;
  onSelectCategory: (category: AssetCategory) => void;
  onViewAllIndices?: () => void;
}

const CATEGORIES: AssetCategory[] = [
  'US stocks',
  'World stocks',
  'Crypto',
  'Futures',
  'Forex',
  'Government bonds',
  'Corporate bonds',
  'ETFs',
  'Economy',
];

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
  onViewAllIndices,
}) => {
  return (
    <section
      id="market-filters-section"
      className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
    >
      {/* Category Headline */}
      <div className="flex items-center">
        <button
          id="indices-headline-btn"
          onClick={onViewAllIndices}
          className="group flex items-center text-2xl font-bold text-[#131722] hover:text-[#2962FF] transition-colors cursor-pointer"
        >
          <span>Indices</span>
          <ChevronRight className="w-5 h-5 ml-1 text-[#131722] group-hover:text-[#2962FF] group-hover:translate-x-0.5 transition-all stroke-[2.5]" />
        </button>
      </div>

      {/* Pill Tabs Container */}
      <div className="overflow-x-auto no-scrollbar py-1">
        <div className="inline-flex items-center space-x-1 border border-[#E0E3EB] rounded-full p-1 bg-white shadow-xs">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                id={`category-pill-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => onSelectCategory(cat)}
                className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#131722] text-white shadow-sm'
                    : 'text-[#131722] hover:text-[#2962FF] hover:bg-[#F0F3FA]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
