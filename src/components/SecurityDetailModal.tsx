import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, Star, Bell, ExternalLink, BarChart3 } from 'lucide-react';
import { SecurityItem, IndexItem } from '../types';

interface SecurityDetailModalProps {
  item: SecurityItem | IndexItem | null;
  onClose: () => void;
}

export const SecurityDetailModal: React.FC<SecurityDetailModalProps> = ({ item, onClose }) => {
  const [activeTimeframe, setActiveTimeframe] = useState('1M');
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [alertSet, setAlertSet] = useState(false);

  if (!item) return null;

  const isIndex = 'badgeNumber' in item;
  const isPositive = item.changePercent >= 0;
  const price = isIndex ? item.price : item.lastPrice;
  const currency = item.currency || 'USD';

  const timeframes = ['1D', '5D', '1M', '6M', 'YTD', '1Y', '5Y', 'ALL'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl border border-[#E0E3EB] shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E0E3EB] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              style={{ backgroundColor: item.avatarBg }}
              className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-xs"
            >
              {isIndex ? item.badgeNumber : item.avatarChar}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-lg text-[#131722]">{item.name}</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#F0F3FA] text-[#787B86]">
                  {item.ticker}
                </span>
              </div>
              <p className="text-xs text-[#787B86]">
                {isIndex ? `${item.provider} Benchmark` : `${item.category} • Real-time Data`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsWatchlisted(!isWatchlisted)}
              className={`p-2 rounded-full border transition-colors cursor-pointer ${
                isWatchlisted
                  ? 'bg-amber-50 text-amber-500 border-amber-200'
                  : 'text-[#787B86] hover:text-[#131722] border-transparent hover:bg-[#F0F3FA]'
              }`}
              title={isWatchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
            >
              <Star className="w-5 h-5 fill-current" />
            </button>
            <button
              onClick={() => setAlertSet(!alertSet)}
              className={`p-2 rounded-full border transition-colors cursor-pointer ${
                alertSet
                  ? 'bg-blue-50 text-[#2962FF] border-blue-200'
                  : 'text-[#787B86] hover:text-[#131722] border-transparent hover:bg-[#F0F3FA]'
              }`}
              title={alertSet ? 'Price alert configured' : 'Set price alert'}
            >
              <Bell className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#787B86] hover:text-[#131722] hover:bg-[#F0F3FA] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Price & Summary Hero */}
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-[#131722]">
                {price.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: price < 10 ? 4 : 2,
                })}{' '}
                <span className="text-base font-medium text-[#787B86]">{currency}</span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <span
                  className={`inline-flex items-center text-sm font-bold ${
                    isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {isPositive ? `+${item.change.toFixed(2)}` : `${item.change.toFixed(2)}`} (
                  {isPositive ? `+${item.changePercent.toFixed(2)}%` : `${item.changePercent.toFixed(2)}%`})
                </span>
                <span className="text-xs text-[#787B86]">Today</span>
              </div>
            </div>

            {'techRating' in item && (
              <div className="flex flex-col items-end">
                <div className="text-xs text-[#787B86] mb-1 font-medium">Technical Rating</div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    item.techRating.includes('Buy')
                      ? 'text-[#089981] bg-[#E8F5E9]'
                      : item.techRating.includes('Sell')
                      ? 'text-[#F23645] bg-[#FFEBEE]'
                      : 'text-[#787B86] bg-[#F0F3FA]'
                  }`}
                >
                  {item.techRating}
                </span>
              </div>
            )}
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center justify-between border-b border-[#E0E3EB] pb-2">
            <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setActiveTimeframe(tf)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    activeTimeframe === tf
                      ? 'bg-[#131722] text-white'
                      : 'text-[#787B86] hover:text-[#131722] hover:bg-[#F0F3FA]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
            <div className="hidden sm:flex items-center text-xs text-[#2962FF] font-semibold hover:underline cursor-pointer">
              <BarChart3 className="w-3.5 h-3.5 mr-1" />
              Advanced Chart
            </div>
          </div>

          {/* Interactive Chart Canvas Simulation */}
          <div className="bg-[#F0F3FA]/40 border border-[#E0E3EB] rounded-xl p-4 h-48 sm:h-56 relative flex flex-col justify-between">
            <div className="flex justify-between text-xs text-[#787B86]">
              <span>High: {(price * 1.025).toFixed(2)}</span>
              <span>Timeframe: {activeTimeframe}</span>
              <span>Low: {(price * 0.978).toFixed(2)}</span>
            </div>

            {/* SVG Interactive Wave Chart */}
            <div className="w-full h-32 relative">
              <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={isPositive ? '#089981' : '#F23645'}
                      stopOpacity="0.25"
                    />
                    <stop
                      offset="100%"
                      stopColor={isPositive ? '#089981' : '#F23645'}
                      stopOpacity="0.0"
                    />
                  </linearGradient>
                </defs>
                {/* Area Fill */}
                <path
                  d={
                    isPositive
                      ? 'M 0 100 Q 80 80, 160 50 T 280 40 T 400 15 L 400 120 L 0 120 Z'
                      : 'M 0 20 Q 80 35, 160 60 T 280 85 T 400 105 L 400 120 L 0 120 Z'
                  }
                  fill="url(#chartGradient)"
                />
                {/* Line */}
                <path
                  d={
                    isPositive
                      ? 'M 0 100 Q 80 80, 160 50 T 280 40 T 400 15'
                      : 'M 0 20 Q 80 35, 160 60 T 280 85 T 400 105'
                  }
                  fill="none"
                  stroke={isPositive ? '#089981' : '#F23645'}
                  strokeWidth="2.5"
                />
              </svg>
            </div>

            <div className="flex justify-between text-[11px] text-[#787B86] border-t border-[#E0E3EB]/50 pt-1">
              <span>9:30 AM</span>
              <span>11:30 AM</span>
              <span>1:30 PM</span>
              <span>4:00 PM</span>
            </div>
          </div>

          {/* Key Fundamentals Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-[#F0F3FA]/60 rounded-xl">
              <div className="text-xs text-[#787B86]">Day Range</div>
              <div className="font-bold text-sm text-[#131722] mt-0.5">
                {'dayRange' in item && item.dayRange
                  ? item.dayRange
                  : `${(price * 0.99).toFixed(2)} - ${(price * 1.01).toFixed(2)}`}
              </div>
            </div>

            <div className="p-3 bg-[#F0F3FA]/60 rounded-xl">
              <div className="text-xs text-[#787B86]">52-Week Range</div>
              <div className="font-bold text-sm text-[#131722] mt-0.5">
                {'range52w' in item && item.range52w
                  ? item.range52w
                  : isIndex
                  ? `${item.low52w} - ${item.high52w}`
                  : 'N/A'}
              </div>
            </div>

            <div className="p-3 bg-[#F0F3FA]/60 rounded-xl">
              <div className="text-xs text-[#787B86]">
                {isIndex ? 'Daily Turnover' : 'Market Cap'}
              </div>
              <div className="font-bold text-sm text-[#131722] mt-0.5">
                {isIndex ? item.turnover : item.marketCap || 'N/A'}
              </div>
            </div>

            <div className="p-3 bg-[#F0F3FA]/60 rounded-xl">
              <div className="text-xs text-[#787B86]">Volume</div>
              <div className="font-bold text-sm text-[#131722] mt-0.5">
                {'volume' in item ? item.volume : 'High'}
              </div>
            </div>

            <div className="p-3 bg-[#F0F3FA]/60 rounded-xl">
              <div className="text-xs text-[#787B86]">P/E Ratio</div>
              <div className="font-bold text-sm text-[#131722] mt-0.5">
                {item.peRatio ? `${item.peRatio}x` : 'N/A'}
              </div>
            </div>

            <div className="p-3 bg-[#F0F3FA]/60 rounded-xl">
              <div className="text-xs text-[#787B86]">Analyst Consensus</div>
              <div className="font-bold text-sm text-[#131722] mt-0.5 truncate">
                {'analystConsensus' in item && item.analystConsensus
                  ? item.analystConsensus
                  : 'Moderate Buy'}
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-3.5 bg-[#F0F3FA] border-t border-[#E0E3EB] flex items-center justify-between">
          <span className="text-xs text-[#787B86]">Data updated in real-time</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-[#E0E3EB] hover:bg-[#e4e7ee] text-xs font-bold rounded-lg text-[#131722] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
