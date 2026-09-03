import React from 'react';
import { IndexItem } from '../types';

interface IndicesCardsProps {
  indices: IndexItem[];
  onSelectIndex: (index: IndexItem) => void;
  priceTickFlash?: Record<string, 'up' | 'down'>;
}

export const IndicesCards: React.FC<IndicesCardsProps> = ({
  indices,
  onSelectIndex,
  priceTickFlash = {},
}) => {
  return (
    <section
      id="indices-cards-grid"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
    >
      {indices.map((idx, i) => {
        const isPositive = idx.changePercent >= 0;
        const tickStatus = priceTickFlash[idx.id];

        // Custom path curves matching each specific index
        let sparklinePath = 'M 0 32 Q 20 28, 35 22 T 70 14 T 100 4';
        if (i === 1) sparklinePath = 'M 0 35 Q 25 30, 45 25 T 75 10 T 100 2';
        if (i === 2) sparklinePath = 'M 0 8 Q 30 12, 50 18 T 80 26 T 100 34';
        if (i === 3) sparklinePath = 'M 0 30 Q 30 35, 55 20 T 80 15 T 100 6';

        return (
          <article
            key={idx.id}
            id={`index-card-${idx.id}`}
            onClick={() => onSelectIndex(idx)}
            className={`bg-[#F0F3FA]/60 hover:bg-[#F0F3FA] border border-transparent hover:border-[#E0E3EB] rounded-2xl p-4 transition-all duration-200 cursor-pointer group ${
              tickStatus === 'up'
                ? 'bg-emerald-50/80'
                : tickStatus === 'down'
                ? 'bg-rose-50/80'
                : ''
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span
                  style={{ backgroundColor: idx.avatarBg }}
                  className="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold ring-2 ring-white shadow-xs"
                >
                  {idx.badgeNumber}
                </span>
                <div>
                  <h3 className="font-bold text-sm tracking-tight text-[#131722] group-hover:text-[#2962FF] transition-colors">
                    {idx.name}
                  </h3>
                  <p className="text-xs text-[#787B86]">
                    {idx.ticker} • {idx.provider}
                  </p>
                </div>
              </div>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded ${
                  isPositive
                    ? 'text-[#089981] bg-[#E8F5E9]'
                    : 'text-[#F23645] bg-[#FFEBEE]'
                }`}
              >
                {isPositive ? `+${idx.changePercent.toFixed(2)}%` : `${idx.changePercent.toFixed(2)}%`}
              </span>
            </div>

            <div className="flex items-end justify-between mt-2">
              <div>
                <div className="text-2xl font-bold tracking-tight text-[#131722]">
                  {idx.price.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div
                  className={`text-xs font-medium ${
                    isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                  }`}
                >
                  {isPositive ? `+${idx.change.toFixed(2)} today` : `${idx.change.toFixed(2)} today`}
                </div>
              </div>

              {/* Sparkline SVG */}
              <svg
                className={`w-24 h-10 overflow-visible transition-transform group-hover:scale-105 ${
                  isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 100 40"
              >
                <path
                  d={sparklinePath}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </article>
        );
      })}
    </section>
  );
};
