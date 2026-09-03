import React, { useState } from 'react';
import { ChevronDown, Check, Globe2 } from 'lucide-react';

interface HeroSectionProps {
  region: string;
  onSelectRegion: (region: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ region, onSelectRegion }) => {
  const [isOpen, setIsOpen] = useState(false);

  const regions = [
    { id: 'everywhere', label: 'everywhere', desc: 'Global cross-asset overview' },
    { id: 'us', label: 'United States', desc: 'NYSE, NASDAQ, CME & Treasuries' },
    { id: 'europe', label: 'Europe', desc: 'LSE, Euronext, Deutsche Börse' },
    { id: 'asia', label: 'Asia-Pacific', desc: 'TSE, HKEX, SGX, ASX' },
    { id: 'crypto', label: 'Digital Assets', desc: '24/7 Decentralized and CeFi' },
  ];

  return (
    <section className="pt-8 pb-10 flex flex-col items-center justify-center text-center relative" id="hero-title-section">
      <div className="relative inline-block">
        <button
          id="hero-market-dropdown-btn"
          onClick={() => setIsOpen(!isOpen)}
          className="group inline-flex items-center space-x-3 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#131722] hover:text-black/80 transition-colors cursor-pointer"
        >
          <span>Markets, {region}</span>
          <ChevronDown
            className={`w-7 h-7 md:w-9 md:h-9 stroke-[3] text-[#131722] transition-transform duration-200 ${
              isOpen ? 'rotate-180' : 'group-hover:translate-y-1'
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-72 sm:w-80 bg-white border border-[#E0E3EB] rounded-2xl shadow-xl py-2 z-40 text-left">
            <div className="px-4 py-2 text-xs font-bold text-[#787B86] uppercase tracking-wider flex items-center justify-between">
              <span>Filter Market Scope</span>
              <Globe2 className="w-3.5 h-3.5" />
            </div>
            {regions.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  onSelectRegion(r.label);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-[#F0F3FA] transition-colors"
              >
                <div>
                  <div className={`text-sm font-bold ${region === r.label ? 'text-[#2962FF]' : 'text-[#131722]'}`}>
                    Markets, {r.label}
                  </div>
                  <div className="text-xs text-[#787B86]">{r.desc}</div>
                </div>
                {region === r.label && <Check className="w-4 h-4 text-[#2962FF] shrink-0 ml-2" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
