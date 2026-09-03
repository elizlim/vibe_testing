/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CategoryNav } from './components/CategoryNav';
import { IndicesCards } from './components/IndicesCards';
import { MarketMoversTable } from './components/MarketMoversTable';
import { SecurityDetailModal } from './components/SecurityDetailModal';
import { SearchModal } from './components/SearchModal';
import { Footer } from './components/Footer';
import { BENCHMARK_INDICES, US_STOCKS, CATEGORY_ITEMS_MAP } from './data/marketData';
import { AssetCategory, TableTab, IndexItem, SecurityItem } from './types';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory>('US stocks');
  const [marketRegion, setMarketRegion] = useState<string>('everywhere');
  const [activeTab, setActiveTab] = useState<TableTab>('Most active');
  const [indices, setIndices] = useState<IndexItem[]>(BENCHMARK_INDICES);
  const [securities, setSecurities] = useState<SecurityItem[]>(US_STOCKS);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<SecurityItem | IndexItem | null>(null);
  const [isLiveSimulating, setIsLiveSimulating] = useState(false);
  const [priceTickFlash, setPriceTickFlash] = useState<Record<string, 'up' | 'down'>>({});

  // When selected category changes, update the securities displayed
  useEffect(() => {
    const list = CATEGORY_ITEMS_MAP[selectedCategory] || US_STOCKS;
    setSecurities(list);
  }, [selectedCategory]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Live simulation tick engine
  useEffect(() => {
    if (!isLiveSimulating) return;

    const interval = setInterval(() => {
      // Pick random security or index to gently tick
      const pickType = Math.random() > 0.4 ? 'security' : 'index';

      if (pickType === 'security' && securities.length > 0) {
        const randomIndex = Math.floor(Math.random() * securities.length);
        const target = securities[randomIndex];
        const deltaPercent = (Math.random() * 0.4 - 0.19); // -0.19% to +0.21%
        const isUp = deltaPercent >= 0;
        const newPrice = Math.max(0.01, +(target.lastPrice * (1 + deltaPercent / 100)).toFixed(2));
        const newChg = +(target.change + (newPrice - target.lastPrice)).toFixed(2);
        const newPct = +(target.changePercent + deltaPercent).toFixed(2);

        setSecurities((prev) =>
          prev.map((s, idx) =>
            idx === randomIndex
              ? {
                  ...s,
                  lastPrice: newPrice,
                  change: newChg,
                  changePercent: newPct,
                }
              : s
          )
        );

        // Flash indicator
        setPriceTickFlash((prev) => ({ ...prev, [target.id]: isUp ? 'up' : 'down' }));
        setTimeout(() => {
          setPriceTickFlash((prev) => {
            const copy = { ...prev };
            delete copy[target.id];
            return copy;
          });
        }, 1200);
      } else if (indices.length > 0) {
        const randomIndex = Math.floor(Math.random() * indices.length);
        const target = indices[randomIndex];
        const deltaPercent = (Math.random() * 0.2 - 0.09);
        const isUp = deltaPercent >= 0;
        const newPrice = +(target.price * (1 + deltaPercent / 100)).toFixed(2);
        const newChg = +(target.change + (newPrice - target.price)).toFixed(2);
        const newPct = +(target.changePercent + deltaPercent).toFixed(2);

        setIndices((prev) =>
          prev.map((ind, idx) =>
            idx === randomIndex
              ? {
                  ...ind,
                  price: newPrice,
                  change: newChg,
                  changePercent: newPct,
                }
              : ind
          )
        );

        setPriceTickFlash((prev) => ({ ...prev, [target.id]: isUp ? 'up' : 'down' }));
        setTimeout(() => {
          setPriceTickFlash((prev) => {
            const copy = { ...prev };
            delete copy[target.id];
            return copy;
          });
        }, 1200);
      }
    }, 2400);

    return () => clearInterval(interval);
  }, [isLiveSimulating, securities, indices]);

  return (
    <div className="bg-white text-[#131722] font-sans antialiased min-h-screen flex flex-col selection:bg-blue-100 selection:text-[#2962FF]">
      {/* Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        isLiveSimulating={isLiveSimulating}
        onToggleLive={() => setIsLiveSimulating(!isLiveSimulating)}
      />

      {/* Main Content */}
      <main
        id="market-overview-hub"
        className="flex-grow max-w-[1440px] w-full mx-auto px-4 lg:px-8 py-6 sm:py-8"
      >
        {/* Hero Section */}
        <HeroSection
          region={marketRegion}
          onSelectRegion={(r) => setMarketRegion(r)}
        />

        {/* Sub-navigation & Categories */}
        <CategoryNav
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          onViewAllIndices={() => {
            if (indices[0]) setSelectedItemForDetail(indices[0]);
          }}
        />

        {/* Indices Benchmark Cards */}
        <IndicesCards
          indices={indices}
          onSelectIndex={(idx) => setSelectedItemForDetail(idx)}
          priceTickFlash={priceTickFlash}
        />

        {/* Market Movers Table */}
        <MarketMoversTable
          securities={securities}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          onSelectSecurity={(sec) => setSelectedItemForDetail(sec)}
          priceTickFlash={priceTickFlash}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        allSecurities={Object.values(CATEGORY_ITEMS_MAP).flat()}
        allIndices={indices}
        onSelectItem={(item) => setSelectedItemForDetail(item)}
      />

      {/* Detailed Stock/Index Inspection Modal */}
      <SecurityDetailModal
        item={selectedItemForDetail}
        onClose={() => setSelectedItemForDetail(null)}
      />
    </div>
  );
}
