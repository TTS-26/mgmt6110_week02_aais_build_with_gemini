import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, TrendingUp, BarChart3, Globe, Flame, ShieldAlert, Sparkles, Check } from 'lucide-react';

interface MarketsHeadlineProps {
  currentPerspective: string;
  onSelectPerspective: (perspective: string) => void;
  gainersCount: number;
  losersCount: number;
}

export const MarketsHeadline: React.FC<MarketsHeadlineProps> = ({
  currentPerspective,
  onSelectPerspective,
  gainersCount,
  losersCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const perspectives = [
    { id: 'everywhere', title: 'Markets, everywhere', subtitle: 'Complete global market overview', icon: Globe },
    { id: 'gainers', title: 'Top Gainers & Outperformers', subtitle: 'Assets with highest 24h momentum', icon: TrendingUp },
    { id: 'losers', title: 'Biggest Movers & Pullbacks', subtitle: 'Assets experiencing downward pressure', icon: ShieldAlert },
    { id: 'active', title: 'Most Active Volume', subtitle: 'Highest liquidity and trade flow', icon: Flame },
  ];

  const currentItem = perspectives.find((p) => p.id === currentPerspective) || perspectives[0];

  return (
    <div id="markets-headline-container" className="text-center mb-10 md:mb-14 flex flex-col items-center justify-center relative">
      <div className="relative inline-block" ref={dropdownRef}>
        <button
          id="markets-dropdown-headline-btn"
          onClick={() => setIsOpen((prev) => !prev)}
          className="group flex items-center justify-center gap-2 text-[36px] sm:text-[44px] md:text-[48px] font-bold text-[#131722] tracking-tight hover:text-[#2962ff] transition-colors cursor-pointer select-none leading-tight"
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <span className="font-display">{currentItem.title}</span>
          <ChevronDown
            className={`w-8 h-8 md:w-10 md:h-10 text-[#131722] group-hover:text-[#2962ff] transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div
            id="headline-perspectives-menu"
            className="absolute left-1/2 -translate-x-1/2 mt-3 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-[#E0E3EB] p-2 z-50 text-left animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="px-3 py-2 text-[11px] font-semibold text-[#737687] uppercase tracking-wider border-b border-[#E0E3EB] mb-1">
              Select Market View
            </div>
            {perspectives.map((p) => {
              const Icon = p.icon;
              const isSelected = currentPerspective === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectPerspective(p.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#F0F3FA] text-[#2962ff]' : 'hover:bg-[#F9FAFC] text-[#131722]'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'bg-[#2962ff] text-white' : 'bg-[#eaedfd] text-[#2962ff]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold flex items-center justify-between">
                      <span>{p.title}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#2962ff]" />}
                    </div>
                    <div className="text-[12px] text-[#737687] truncate">{p.subtitle}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Market Breadth Pill */}
      <div className="mt-3 flex items-center gap-3 text-[13px] text-[#737687]">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-[#089981]"></span>
          <span className="text-[#089981] font-mono">{gainersCount} Advancing</span>
        </div>
        <span className="text-[#c3c5d8]">•</span>
        <div className="flex items-center gap-1.5 font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-[#F23645]"></span>
          <span className="text-[#F23645] font-mono">{losersCount} Declining</span>
        </div>
        <span className="text-[#c3c5d8] hidden sm:inline">•</span>
        <span className="hidden sm:inline text-[#737687]">Live 24/7 Global Aggregator</span>
      </div>
    </div>
  );
};
