import React from 'react';
import { MarketCategory, ViewMode } from '../types';
import { CATEGORY_TABS } from '../data/marketData';
import { ChevronRight, LayoutGrid, ListFilter, Grid3X3, Sparkles } from 'lucide-react';

interface CategoryPillsProps {
  activeCategory: MarketCategory;
  onSelectCategory: (category: MarketCategory) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  searchFilter: string;
  setSearchFilter: (term: string) => void;
  categoryCount: number;
}

const CATEGORY_TITLES: Record<MarketCategory, string> = {
  'us-stocks': 'Indices',
  'world-stocks': 'World Indices & Equities',
  'crypto': 'Cryptocurrencies',
  'futures': 'Commodities & Futures',
  'forex': 'Foreign Exchange (Forex)',
  'gov-bonds': 'Government Sovereign Yields',
  'corp-bonds': 'Corporate Credit & Bonds',
  'etfs': 'Exchange-Traded Funds (ETFs)',
  'economy': 'Macro Economic Indicators',
};

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  activeCategory,
  onSelectCategory,
  viewMode,
  setViewMode,
  searchFilter,
  setSearchFilter,
  categoryCount,
}) => {
  return (
    <div id="category-navigation-section" className="mb-8 space-y-4">
      {/* Category Heading and Scrollable Pills */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Category Title (Indices >) */}
        <div className="flex items-center gap-2 shrink-0">
          <h2
            id="active-category-title"
            className="font-display font-semibold text-[24px] sm:text-[28px] text-[#131722] flex items-center tracking-tight"
          >
            {CATEGORY_TITLES[activeCategory]}
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 ml-1 text-[#131722] shrink-0" />
          </h2>
          <span className="text-[12px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#F0F3FA] text-[#434656]">
            {categoryCount}
          </span>
        </div>

        {/* Horizontal Pill Bar matching image */}
        <div className="w-full lg:w-auto overflow-x-auto hide-scrollbar py-1">
          <div
            id="category-pills-bar"
            className="flex items-center gap-1.5 sm:gap-2 border border-[#E0E3EB] rounded-full p-1 whitespace-nowrap min-w-max bg-white shadow-2xs"
          >
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`category-tab-${tab.id}`}
                  onClick={() => onSelectCategory(tab.id)}
                  className={`px-3.5 sm:px-4 py-1.5 rounded-full text-[13px] sm:text-[14px] font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#131722] text-white shadow-xs font-semibold'
                      : 'text-[#434656] hover:text-[#131722] hover:bg-[#F0F3FA]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Secondary Controls Bar: Quick filter tag & View Mode */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F0F3FA]">
        <div className="flex items-center gap-2 text-[13px] text-[#737687]">
          <span>Showing liquid assets in</span>
          <span className="font-semibold text-[#131722]">
            {CATEGORY_TABS.find((t) => t.id === activeCategory)?.label}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick in-page filter */}
          <div className="relative">
            <input
              type="text"
              placeholder="Filter list..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="bg-[#F0F3FA] focus:bg-white text-[#131722] placeholder:text-[#737687] text-[12px] px-2.5 py-1 rounded border border-transparent focus:border-[#2962ff] focus:outline-none w-32 sm:w-40 transition-colors font-sans"
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* View Mode Toggle Buttons */}
          <div className="flex items-center bg-[#F0F3FA] p-0.5 rounded border border-[#E0E3EB]">
            <button
              onClick={() => setViewMode('cards')}
              title="Card Grid View"
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-[#2962ff] shadow-2xs font-semibold'
                  : 'text-[#737687] hover:text-[#131722]'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              title="Table View"
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-[#2962ff] shadow-2xs font-semibold'
                  : 'text-[#737687] hover:text-[#131722]'
              }`}
            >
              <ListFilter className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('heatmap')}
              title="Heatmap View"
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                viewMode === 'heatmap'
                  ? 'bg-white text-[#2962ff] shadow-2xs font-semibold'
                  : 'text-[#737687] hover:text-[#131722]'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
