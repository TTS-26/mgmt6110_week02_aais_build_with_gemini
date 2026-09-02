import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer
      id="tradingview-footer"
      className="w-full bg-white border-t border-[#E0E3EB] py-12 mt-20"
    >
      <div className="w-full px-4 sm:px-6 md:px-8 max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Logo Left */}
        <div className="font-display font-bold text-[18px] text-[#131722] flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-[#131722] flex items-center justify-center text-white shrink-0">
            <svg
              className="w-3 h-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span>TradingView</span>
        </div>

        {/* Links Center */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-[13px] text-[#434656]">
          <a
            href="#about"
            onClick={(e) => e.preventDefault()}
            className="hover:text-[#2962ff] transition-colors underline-offset-4 hover:underline"
          >
            About
          </a>
          <a
            href="#terms"
            onClick={(e) => e.preventDefault()}
            className="hover:text-[#2962ff] transition-colors underline-offset-4 hover:underline"
          >
            Terms of Use
          </a>
          <a
            href="#privacy"
            onClick={(e) => e.preventDefault()}
            className="hover:text-[#2962ff] transition-colors underline-offset-4 hover:underline"
          >
            Privacy Policy
          </a>
          <a
            href="#cookies"
            onClick={(e) => e.preventDefault()}
            className="hover:text-[#2962ff] transition-colors underline-offset-4 hover:underline"
          >
            Cookies
          </a>
          <a
            href="#help"
            onClick={(e) => e.preventDefault()}
            className="hover:text-[#2962ff] transition-colors underline-offset-4 hover:underline"
          >
            Help Center
          </a>
        </div>

        {/* Copyright Right */}
        <div className="text-[13px] text-[#737687] font-sans">
          © 2024 TradingView, Inc.
        </div>
      </div>
    </footer>
  );
};
