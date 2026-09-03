import React, { useState } from 'react';
import { Search, Globe, User, Check, Sparkles, Activity } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  isLiveSimulating: boolean;
  onToggleLive: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  isLiveSimulating,
  onToggleLive,
}) => {
  const [selectedLang, setSelectedLang] = useState('EN');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'ES', name: 'Español' },
    { code: 'DE', name: 'Deutsch' },
    { code: 'FR', name: 'Français' },
    { code: 'JA', name: '日本語' },
    { code: 'ZH', name: '简体中文' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E0E3EB]">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        {/* Left side: Brand Logo, Search & Nav links */}
        <div className="flex items-center space-x-5 lg:space-x-6">
          {/* TradingView Stylized Logo */}
          <a
            id="brand-logo"
            href="#"
            aria-label="TradingView Home"
            className="flex items-center text-black focus:outline-none hover:opacity-85 transition-opacity"
          >
            <svg
              className="w-8 h-8 fill-current"
              viewBox="0 0 36 28"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 0h6.5v28H0V0zm9.5 7.5h6.5V28H9.5V7.5zm10-7.5H26v28h-6.5V0zm10 14h6.5V28H29.5V14z" />
            </svg>
          </a>

          {/* Global Search Input Pill */}
          <div className="relative hidden sm:block w-48 md:w-60">
            <button
              id="global-search-btn"
              onClick={onOpenSearch}
              type="button"
              className="w-full flex items-center justify-between bg-[#F0F3FA] hover:bg-[#e4e7ee] text-[#787B86] px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer"
            >
              <span className="flex items-center">
                <Search className="w-4 h-4 mr-2 text-[#787B86]" />
                <span>Search</span>
              </span>
              <kbd className="text-[11px] text-[#787B86] font-normal tracking-wide bg-white/70 px-1.5 py-0.5 rounded border border-black/5">
                Ctrl+K
              </kbd>
            </button>
          </div>

          {/* Primary Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-7 text-sm font-semibold">
            <a
              href="#products"
              className="text-[#131722] hover:text-[#2962FF] transition-colors"
            >
              Products
            </a>
            <a
              href="#community"
              className="text-[#131722] hover:text-[#2962FF] transition-colors"
            >
              Community
            </a>
            <a
              href="#markets"
              className="text-[#2962FF] flex items-center font-bold"
            >
              Markets
            </a>
            <a
              href="#brokers"
              className="text-[#131722] hover:text-[#2962FF] transition-colors"
            >
              Brokers
            </a>
            <a
              href="#more"
              className="text-[#131722] hover:text-[#2962FF] transition-colors"
            >
              More
            </a>
          </nav>
        </div>

        {/* Right side: Utility Actions & CTA */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Mobile search icon */}
          <button
            onClick={onOpenSearch}
            className="sm:hidden p-2 text-[#131722] hover:text-[#2962FF] rounded-full hover:bg-[#F0F3FA]"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Live Data Simulation Toggle */}
          <button
            onClick={onToggleLive}
            title={isLiveSimulating ? 'Live price simulation active' : 'Click to enable live price ticks'}
            className={`hidden md:flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all border ${
              isLiveSimulating
                ? 'bg-emerald-50 text-[#089981] border-emerald-200'
                : 'bg-[#F0F3FA] text-[#787B86] border-transparent hover:text-[#131722]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isLiveSimulating ? 'bg-[#089981] animate-pulse' : 'bg-gray-400'
              }`}
            />
            <span>{isLiveSimulating ? 'Live Ticks' : 'Simulate Live'}</span>
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              id="lang-selector-btn"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center space-x-1.5 text-[#131722] hover:text-[#2962FF] text-sm font-semibold p-1.5 rounded-md hover:bg-[#F0F3FA] transition-colors"
              title="Change Language"
            >
              <Globe className="w-5 h-5 text-[#131722]" />
              <span className="text-sm font-semibold">{selectedLang}</span>
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-[#E0E3EB] rounded-xl shadow-lg py-1 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-xs font-bold text-[#787B86] uppercase tracking-wider">
                  Select Language
                </div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setSelectedLang(l.code);
                      setIsLangOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-[#F0F3FA] text-[#131722]"
                  >
                    <span>{l.name}</span>
                    {selectedLang === l.code && <Check className="w-4 h-4 text-[#2962FF]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile Button */}
          <div className="relative">
            <button
              id="user-profile-btn"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              aria-label="User Account"
              className="p-2 text-[#131722] hover:text-[#2962FF] rounded-full hover:bg-[#F0F3FA] transition-colors"
            >
              <User className="w-5 h-5" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E0E3EB] rounded-xl shadow-lg p-3 z-50 text-sm">
                <div className="flex items-center space-x-3 pb-3 border-b border-[#E0E3EB]">
                  <div className="w-10 h-10 rounded-full bg-[#2962FF] text-white flex items-center justify-center font-bold">
                    TV
                  </div>
                  <div>
                    <div className="font-bold text-[#131722]">Guest Trader</div>
                    <div className="text-xs text-[#787B86]">guest@tradingview.com</div>
                  </div>
                </div>
                <div className="py-2 space-y-1">
                  <a
                    href="#watchlist"
                    className="block px-2 py-1.5 rounded-lg hover:bg-[#F0F3FA] text-[#131722] font-medium"
                  >
                    My Watchlists
                  </a>
                  <a
                    href="#charts"
                    className="block px-2 py-1.5 rounded-lg hover:bg-[#F0F3FA] text-[#131722] font-medium"
                  >
                    Saved Charts & Layouts
                  </a>
                  <a
                    href="#alerts"
                    className="block px-2 py-1.5 rounded-lg hover:bg-[#F0F3FA] text-[#131722] font-medium"
                  >
                    Price Alerts
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Get started CTA gradient button */}
          <a
            id="get-started-cta"
            href="#get-started"
            className="px-4 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-[#2962FF] via-[#5b40ff] to-[#b11fff] hover:opacity-95 shadow-sm transition-all duration-200"
          >
            Get started
          </a>
        </div>
      </div>
    </header>
  );
};
