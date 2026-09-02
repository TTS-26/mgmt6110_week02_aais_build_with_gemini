import React, { useState, useEffect, useRef } from 'react';
import { MarketItem } from '../types';
import { Search, X, TrendingUp, TrendingDown, ArrowRight, CornerDownLeft } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: MarketItem[];
  onSelectItem: (item: MarketItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  items,
  onSelectItem,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredItems = items.filter((item) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.symbol.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.badge.toLowerCase().includes(q)
    );
  }).slice(0, 10);

  const handleSelect = (item: MarketItem) => {
    onSelectItem(item);
    onClose();
  };

  const handleKeyNav = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    }
  };

  return (
    <div
      id="search-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-100"
      onClick={onClose}
    >
      <div
        id="search-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-[#E0E3EB] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E0E3EB] flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-[#2962ff] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search indices, stocks, crypto, futures, forex, bonds..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyNav}
            className="w-full text-[15px] sm:text-[16px] text-[#131722] placeholder:text-[#737687] bg-transparent border-none focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#737687] hover:text-[#131722] p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono bg-[#F0F3FA] text-[#737687] rounded border border-[#E0E3EB]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-[#F0F3FA] p-2">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-[#737687]">
              <p className="text-[14px]">No market instruments found for "{query}"</p>
              <p className="text-[12px] mt-1 text-gray-400">Try searching for SPX, Nasdaq, Bitcoin, Gold, or Treasury yields</p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = selectedIndex === index;
              const isPositive = item.change >= 0;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#F0F3FA] text-[#2962ff]' : 'hover:bg-[#F9FAFC] text-[#131722]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-full text-white flex items-center justify-center font-mono font-bold text-[12px] shrink-0"
                      style={{ backgroundColor: item.badgeBgColor }}
                    >
                      {item.badge}
                    </div>
                    <div className="truncate">
                      <div className="font-semibold text-[14px] truncate">{item.name}</div>
                      <div className="text-[12px] text-[#737687] font-mono flex items-center gap-2">
                        <span>{item.symbol}</span>
                        <span className="text-[#c3c5d8]">•</span>
                        <span className="capitalize">{item.category.replace('-', ' ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono font-semibold text-[14px] text-[#131722]">
                      ${item.priceFormatted}
                    </div>
                    <div
                      className={`text-[12px] font-mono font-medium ${
                        isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {item.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="p-3 border-t border-[#E0E3EB] bg-[#F9FAFC] flex items-center justify-between text-[11px] text-[#737687]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-[#E0E3EB] rounded font-mono">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-[#E0E3EB] rounded font-mono">↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-[#E0E3EB] rounded font-mono flex items-center">
                <CornerDownLeft className="w-3 h-3" />
              </kbd>
              Select
            </span>
          </div>
          <span>TradingView Global Search</span>
        </div>
      </div>
    </div>
  );
};
