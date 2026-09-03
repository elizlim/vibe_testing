import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { SecurityItem, TableTab } from '../types';

interface MarketMoversTableProps {
  securities: SecurityItem[];
  activeTab: TableTab;
  onTabChange: (tab: TableTab) => void;
  onSelectSecurity: (sec: SecurityItem) => void;
  priceTickFlash?: Record<string, 'up' | 'down'>;
}

type SortField = 'ticker' | 'lastPrice' | 'changePercent' | 'change' | 'volume';
type SortDirection = 'asc' | 'desc';

export const MarketMoversTable: React.FC<MarketMoversTableProps> = ({
  securities,
  activeTab,
  onTabChange,
  onSelectSecurity,
  priceTickFlash = {},
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>('desc');
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    techRating: true,
    volume: true,
    trend: true,
  });

  const tabs: TableTab[] = ['Most active', 'Top gainers', 'Top losers', 'High volatility'];

  // Filter based on active tab
  const filteredSecurities = useMemo(() => {
    let list = [...securities];
    if (activeTab === 'Top gainers') {
      list = list.filter((s) => s.changePercent > 0).sort((a, b) => b.changePercent - a.changePercent);
    } else if (activeTab === 'Top losers') {
      list = list.filter((s) => s.changePercent < 0).sort((a, b) => a.changePercent - b.changePercent);
    } else if (activeTab === 'High volatility') {
      list = [...list].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
    }
    // Sort if column header clicked
    if (sortField) {
      list.sort((a, b) => {
        let valA: number | string = a[sortField];
        let valB: number | string = b[sortField];

        if (sortField === 'volume') {
          // Parse volume strings like '52.84M', '412K', '28.4B'
          const parseVol = (v: string) => {
            const num = parseFloat(v);
            if (v.includes('B')) return num * 1000;
            if (v.includes('K')) return num / 1000;
            return num;
          };
          valA = parseVol(a.volume);
          valB = parseVol(b.volume);
        }

        if (typeof valA === 'string') {
          return sortDir === 'asc'
            ? valA.localeCompare(valB as string)
            : (valB as string).localeCompare(valA);
        }

        return sortDir === 'asc'
          ? (valA as number) - (valB as number)
          : (valB as number) - (valA as number);
      });
    }
    return list;
  }, [securities, activeTab, sortField, sortDir]);

  const displayedList = isExpanded ? filteredSecurities : filteredSecurities.slice(0, 5);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDir === 'desc') setSortDir('asc');
      else {
        setSortField(null);
        setSortDir('desc');
      }
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case 'Strong Buy':
      case 'Buy':
        return 'text-[#089981] bg-[#E8F5E9]';
      case 'Neutral':
        return 'text-[#787B86] bg-[#F0F3FA]';
      case 'Sell':
      case 'Strong Sell':
        return 'text-[#F23645] bg-[#FFEBEE]';
      default:
        return 'text-[#787B86] bg-[#F0F3FA]';
    }
  };

  return (
    <section
      id="market-movers-panel"
      className="border border-[#E0E3EB] rounded-2xl overflow-hidden bg-white shadow-xs"
    >
      {/* Table Filter Header & Sub-tabs */}
      <div className="px-6 py-4 border-b border-[#E0E3EB] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                id={`table-tab-${tab.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => onTabChange(tab)}
                className={`px-3.5 py-1.5 text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#F0F3FA] text-[#131722]'
                    : 'text-[#787B86] hover:text-[#131722] hover:bg-[#F0F3FA]/50'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="flex items-center space-x-3 text-xs text-[#787B86]">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#089981] animate-pulse" />
            <span>Market Open • Real-time quotes</span>
          </div>

          <div className="relative">
            <button
              id="customize-columns-btn"
              onClick={() => setShowColumnSettings(!showColumnSettings)}
              className="p-1 hover:text-[#131722] text-[#787B86] rounded hover:bg-[#F0F3FA] transition-colors cursor-pointer"
              title="Customize Columns"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {showColumnSettings && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E0E3EB] rounded-xl shadow-lg p-3 z-30 text-xs">
                <div className="font-bold text-[#131722] mb-2">Display Columns</div>
                <label className="flex items-center space-x-2 py-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visibleColumns.techRating}
                    onChange={(e) =>
                      setVisibleColumns({ ...visibleColumns, techRating: e.target.checked })
                    }
                    className="rounded text-[#2962FF] focus:ring-[#2962FF]"
                  />
                  <span>Tech Rating</span>
                </label>
                <label className="flex items-center space-x-2 py-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visibleColumns.volume}
                    onChange={(e) =>
                      setVisibleColumns({ ...visibleColumns, volume: e.target.checked })
                    }
                    className="rounded text-[#2962FF] focus:ring-[#2962FF]"
                  />
                  <span>Volume</span>
                </label>
                <label className="flex items-center space-x-2 py-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visibleColumns.trend}
                    onChange={(e) =>
                      setVisibleColumns({ ...visibleColumns, trend: e.target.checked })
                    }
                    className="rounded text-[#2962FF] focus:ring-[#2962FF]"
                  />
                  <span>7D Trend</span>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Financial Data Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm" id="market-overview-table">
          <thead className="bg-[#F0F3FA]/40 text-[#787B86] text-xs font-semibold uppercase tracking-wider border-b border-[#E0E3EB]">
            <tr>
              <th
                onClick={() => handleSort('ticker')}
                className="py-3 px-6 cursor-pointer hover:text-[#131722]"
                scope="col"
              >
                <div className="flex items-center space-x-1">
                  <span>Ticker / Name</span>
                  {sortField === 'ticker' ? (
                    sortDir === 'asc' ? <ArrowUp className="w-3 h-3 text-[#2962FF]" /> : <ArrowDown className="w-3 h-3 text-[#2962FF]" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-30" />
                  )}
                </div>
              </th>

              <th
                onClick={() => handleSort('lastPrice')}
                className="py-3 px-4 text-right cursor-pointer hover:text-[#131722]"
                scope="col"
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Last Price</span>
                  {sortField === 'lastPrice' ? (
                    sortDir === 'asc' ? <ArrowUp className="w-3 h-3 text-[#2962FF]" /> : <ArrowDown className="w-3 h-3 text-[#2962FF]" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-30" />
                  )}
                </div>
              </th>

              <th
                onClick={() => handleSort('changePercent')}
                className="py-3 px-4 text-right cursor-pointer hover:text-[#131722]"
                scope="col"
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Chg %</span>
                  {sortField === 'changePercent' ? (
                    sortDir === 'asc' ? <ArrowUp className="w-3 h-3 text-[#2962FF]" /> : <ArrowDown className="w-3 h-3 text-[#2962FF]" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-30" />
                  )}
                </div>
              </th>

              <th
                onClick={() => handleSort('change')}
                className="py-3 px-4 text-right cursor-pointer hover:text-[#131722]"
                scope="col"
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Chg</span>
                  {sortField === 'change' ? (
                    sortDir === 'asc' ? <ArrowUp className="w-3 h-3 text-[#2962FF]" /> : <ArrowDown className="w-3 h-3 text-[#2962FF]" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-30" />
                  )}
                </div>
              </th>

              {visibleColumns.techRating && (
                <th className="py-3 px-4 text-center" scope="col">
                  Tech Rating
                </th>
              )}

              {visibleColumns.volume && (
                <th
                  onClick={() => handleSort('volume')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-[#131722]"
                  scope="col"
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Volume</span>
                    {sortField === 'volume' ? (
                      sortDir === 'asc' ? <ArrowUp className="w-3 h-3 text-[#2962FF]" /> : <ArrowDown className="w-3 h-3 text-[#2962FF]" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 opacity-30" />
                    )}
                  </div>
                </th>
              )}

              {visibleColumns.trend && (
                <th className="py-3 px-6 text-center" scope="col">
                  7D Trend
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E0E3EB]">
            {displayedList.map((sec, idx) => {
              const isPositive = sec.changePercent >= 0;
              const tick = priceTickFlash[sec.id];

              // SVG trend path based on exact coordinates from HTML
              let trendPath = 'M 0 20 Q 20 22, 40 10 T 80 2';
              if (sec.ticker === 'AAPL') trendPath = 'M 0 16 Q 30 18, 50 12 T 80 6';
              else if (sec.ticker === 'TSLA') trendPath = 'M 0 4 Q 30 8, 45 16 T 80 22';
              else if (sec.ticker === 'MSFT') trendPath = 'M 0 18 Q 20 14, 45 15 T 80 4';
              else if (sec.ticker === 'AMZN') trendPath = 'M 0 22 Q 25 15, 50 12 T 80 4';
              else if (!isPositive) trendPath = 'M 0 6 Q 30 10, 45 15 T 80 22';

              return (
                <tr
                  key={sec.id}
                  id={`security-row-${sec.id}`}
                  onClick={() => onSelectSecurity(sec)}
                  className={`hover:bg-[#F0F3FA]/40 transition-colors cursor-pointer group ${
                    tick === 'up'
                      ? 'bg-emerald-50/60'
                      : tick === 'down'
                      ? 'bg-rose-50/60'
                      : ''
                  }`}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div
                        style={{
                          backgroundColor: sec.avatarBg,
                          color: sec.avatarTextColor || '#ffffff',
                        }}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                      >
                        {sec.avatarChar}
                      </div>
                      <div>
                        <div className="font-bold text-[#131722] group-hover:text-[#2962FF] transition-colors">
                          {sec.ticker}
                        </div>
                        <div className="text-xs text-[#787B86] font-normal truncate max-w-[140px] sm:max-w-none">
                          {sec.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-right font-semibold text-[#131722] whitespace-nowrap">
                    {sec.lastPrice.toLocaleString('en-US', {
                      minimumFractionDigits: sec.lastPrice < 10 ? 4 : 2,
                      maximumFractionDigits: sec.lastPrice < 10 ? 4 : 2,
                    })}{' '}
                    <span className="text-xs font-normal text-[#787B86]">{sec.currency}</span>
                  </td>

                  <td
                    className={`py-4 px-4 text-right font-semibold whitespace-nowrap ${
                      isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                    }`}
                  >
                    {isPositive ? `+${sec.changePercent.toFixed(2)}%` : `${sec.changePercent.toFixed(2)}%`}
                  </td>

                  <td
                    className={`py-4 px-4 text-right font-medium whitespace-nowrap ${
                      isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                    }`}
                  >
                    {isPositive ? `+${sec.change.toFixed(2)}` : `${sec.change.toFixed(2)}`}
                  </td>

                  {visibleColumns.techRating && (
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${getRatingBadge(
                          sec.techRating
                        )}`}
                      >
                        {sec.techRating}
                      </span>
                    </td>
                  )}

                  {visibleColumns.volume && (
                    <td className="py-4 px-4 text-right text-[#787B86] font-normal whitespace-nowrap">
                      {sec.volume}
                    </td>
                  )}

                  {visibleColumns.trend && (
                    <td className="py-4 px-6 text-center">
                      <svg
                        className={`w-20 h-6 mx-auto ${
                          isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 80 24"
                      >
                        <path d={trendPath} strokeLinecap="round" />
                      </svg>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer / Pagination or View More */}
      <div className="px-6 py-3.5 bg-white border-t border-[#E0E3EB] flex items-center justify-between text-sm">
        <span className="text-[#787B86] text-xs">
          Showing {displayedList.length} of {filteredSecurities.length > 5 ? 500 : filteredSecurities.length} active securities
        </span>

        <button
          id="view-entire-table-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          className="font-semibold text-[#2962FF] hover:text-[#1e53e5] flex items-center text-xs cursor-pointer"
        >
          <span>{isExpanded ? 'Collapse table view' : 'View entire market table'}</span>
          <ChevronRight
            className={`w-3.5 h-3.5 ml-1 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          />
        </button>
      </div>
    </section>
  );
};
