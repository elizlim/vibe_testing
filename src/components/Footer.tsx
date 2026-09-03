import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer
      id="site-footer"
      className="border-t border-[#E0E3EB] bg-white text-xs text-[#787B86] py-6 mt-12"
    >
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <span>© 2025 TradingView</span>
          <a href="#terms" className="hover:text-[#131722] transition-colors">
            Terms of use
          </a>
          <a href="#privacy" className="hover:text-[#131722] transition-colors">
            Privacy policy
          </a>
          <a href="#cookies" className="hover:text-[#131722] transition-colors">
            Cookies
          </a>
        </div>
        <div>
          <span>Select market data provided by major world exchanges.</span>
        </div>
      </div>
    </footer>
  );
};
