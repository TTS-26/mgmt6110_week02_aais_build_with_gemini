import React from 'react';
import { Search, Globe, User, Radio, Sparkles } from 'lucide-react';

interface TopNavBarProps {
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  isLiveUpdating: boolean;
  setIsLiveUpdating: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  onOpenSearch,
  onOpenAuth,
  activeNav,
  setActiveNav,
  isLiveUpdating,
  setIsLiveUpdating,
}) => {
  return (
    <nav
      id="top-navigation-bar"
      className="bg-white border-b border-[#E0E3EB] sticky top-0 z-40 transition-colors"
    >
      <div className="flex justify-between items-center w-full px-4 sm:px-6 md:px-8 max-w-[1280px] mx-auto h-16">
        {/* Brand / Left Side */}
        <div className="flex items-center gap-5 md:gap-6">
          <button
            id="brand-logo-btn"
            onClick={() => setActiveNav('Markets')}
            className="flex items-center gap-2 cursor-pointer focus:outline-none group text-left"
            title="TradingView - Markets"
          >
            {/* SVG Logo circle with checkmark matching image */}
            <div className="w-6 h-6 rounded-full bg-[#131722] flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
              <svg
                className="w-3.5 h-3.5"
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
            <span className="font-semibold text-[17px] tracking-tight text-[#131722] hidden sm:inline-block">
              TradingView
            </span>
          </button>

          {/* Search Trigger (matching screenshot) */}
          <button
            id="global-search-trigger"
            onClick={onOpenSearch}
            className="flex items-center bg-[#F0F3FA] hover:bg-[#E5E9F2] text-[#434656] rounded px-3 py-1.5 border border-transparent hover:border-[#c3c5d8] transition-all w-44 sm:w-64 text-left group cursor-pointer"
          >
            <Search className="w-4 h-4 text-[#737687] mr-2 shrink-0 group-hover:text-[#131722]" />
            <span className="text-[13px] text-[#737687] flex-1 truncate">
              Search (Ctrl+K)
            </span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white text-[#737687] border border-[#E0E3EB] rounded shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Navigation Links (Center) */}
        <div className="hidden lg:flex items-center gap-6 text-[14px]">
          {['Products', 'Community', 'Markets', 'News', 'Brokers', 'More'].map((link) => {
            const isActive = activeNav === link;
            return (
              <button
                key={link}
                id={`nav-link-${link.toLowerCase()}`}
                onClick={() => setActiveNav(link)}
                className={`py-1 transition-colors cursor-pointer font-medium relative ${
                  isActive
                    ? 'text-[#2962ff] font-semibold'
                    : 'text-[#131722] hover:text-[#2962ff] opacity-80 hover:opacity-100'
                }`}
              >
                {link}
                {isActive && (
                  <span className="absolute bottom-[-16px] left-0 right-0 h-[2px] bg-[#2962ff] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Actions / Right Side */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Live stream ticker pulse button */}
          <button
            id="live-ticker-toggle"
            onClick={() => setIsLiveUpdating((prev) => !prev)}
            title={isLiveUpdating ? 'Live market streaming active' : 'Live stream paused'}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium transition-all ${
              isLiveUpdating
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-gray-100 text-gray-600 border border-gray-200'
            }`}
          >
            <span className="relative flex h-2 w-2">
              {isLiveUpdating && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isLiveUpdating ? 'bg-emerald-500' : 'bg-gray-400'
                }`}
              ></span>
            </span>
            <span>{isLiveUpdating ? 'LIVE' : 'PAUSED'}</span>
          </button>

          {/* Language Switcher */}
          <button
            id="lang-switcher-btn"
            className="hidden sm:flex items-center gap-1 text-[#434656] hover:text-[#131722] transition-colors px-1 py-1 rounded cursor-pointer"
            title="Language: English"
          >
            <Globe className="w-4 h-4 text-[#737687]" />
            <span className="text-[13px] font-medium">EN</span>
          </button>

          {/* User Profile */}
          <button
            id="user-profile-btn"
            onClick={onOpenAuth}
            className="text-[#434656] hover:text-[#131722] transition-colors p-1.5 rounded-full hover:bg-[#F0F3FA] cursor-pointer"
            title="User Profile & Watchlist"
          >
            <User className="w-5 h-5 text-[#737687]" />
          </button>

          {/* Get Started Button */}
          <button
            id="get-started-cta-btn"
            onClick={onOpenAuth}
            className="custom-gradient-btn text-white text-[14px] font-medium px-4 py-2 rounded-full hover:opacity-90 active:scale-95 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Get started</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
