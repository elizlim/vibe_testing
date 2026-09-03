import React, { useState, useEffect } from 'react';
import { Search, X, ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';
import { SecurityItem, IndexItem } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  allSecurities: SecurityItem[];
  allIndices: IndexItem[];
  onSelectItem: (item: SecurityItem | IndexItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  allSecurities,
  allIndices,
  onSelectItem,
}) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const combinedItems: (SecurityItem | IndexItem)[] = [...allIndices, ...allSecurities];

  const filtered = combinedItems.filter((item) => {
    const matchesQuery =
      item.ticker.toLowerCase().includes(query.toLowerCase()) ||
      item.name.toLowerCase().includes(query.toLowerCase());

    if (!matchesQuery) return false;

    if (activeFilter === 'All') return true;
    if (activeFilter === 'Indices') return 'badgeNumber' in item;
    if (activeFilter === 'Stocks') return 'category' in item && item.category === 'US stocks';
    if (activeFilter === 'Crypto') return 'category' in item && item.category === 'Crypto';
    if (activeFilter === 'Forex') return 'category' in item && item.category === 'Forex';
    return true;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-xl rounded-2xl border border-[#E0E3EB] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#E0E3EB]">
          <Search className="w-5 h-5 text-[#787B86] mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Search tickers, company names, indices, crypto..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-[#131722] placeholder-[#787B86] text-base focus:outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-[#F0F3FA] rounded-full text-[#787B86] mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[11px] text-[#787B86] bg-[#F0F3FA] px-2 py-0.5 rounded border border-[#E0E3EB]">
            ESC
          </kbd>
        </div>

        {/* Category Filter Pills */}
        <div className="px-4 py-2 bg-[#F0F3FA]/40 border-b border-[#E0E3EB] flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
          {['All', 'Indices', 'Stocks', 'Crypto', 'Forex'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeFilter === tab
                  ? 'bg-[#131722] text-white'
                  : 'bg-white text-[#787B86] hover:text-[#131722] border border-[#E0E3EB]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-[#E0E3EB]/60">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-[#787B86] text-sm">
              No matching assets or symbols found for &quot;{query}&quot;
            </div>
          ) : (
            filtered.map((item) => {
              const isIndex = 'badgeNumber' in item;
              const price = isIndex ? item.price : item.lastPrice;
              const isPositive = item.changePercent >= 0;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectItem(item);
                    onClose();
                  }}
                  className="px-4 py-3 flex items-center justify-between hover:bg-[#F0F3FA] cursor-pointer transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      style={{ backgroundColor: item.avatarBg }}
                      className="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs"
                    >
                      {isIndex ? item.badgeNumber : item.avatarChar}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#131722] group-hover:text-[#2962FF] flex items-center">
                        <span>{item.ticker}</span>
                        <span className="ml-2 text-xs font-normal text-[#787B86]">
                          {isIndex ? item.provider : item.category}
                        </span>
                      </div>
                      <div className="text-xs text-[#787B86] truncate max-w-xs">{item.name}</div>
                    </div>
                  </div>

                  <div className="text-right flex items-center space-x-3">
                    <div>
                      <div className="font-semibold text-sm text-[#131722]">
                        {price.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: price < 10 ? 4 : 2,
                        })}{' '}
                        <span className="text-[11px] text-[#787B86]">{item.currency || 'USD'}</span>
                      </div>
                      <div
                        className={`text-xs font-medium flex items-center justify-end ${
                          isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isPositive ? (
                          <TrendingUp className="w-3 h-3 mr-0.5" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-0.5" />
                        )}
                        {isPositive ? `+${item.changePercent.toFixed(2)}%` : `${item.changePercent.toFixed(2)}%`}
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#787B86] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
