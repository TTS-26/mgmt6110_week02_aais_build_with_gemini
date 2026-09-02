import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MarketCategory, MarketItem, ViewMode } from './types';
import { INITIAL_MARKET_DATA } from './data/marketData';
import { TopNavBar } from './components/TopNavBar';
import { MarketsHeadline } from './components/MarketsHeadline';
import { CategoryPills } from './components/CategoryPills';
import { MarketGrid } from './components/MarketGrid';
import { MarketDetailModal } from './components/MarketDetailModal';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';

export default function App() {
  const [marketData, setMarketData] = useState<MarketItem[]>(INITIAL_MARKET_DATA);
  const [activeCategory, setActiveCategory] = useState<MarketCategory>('us-stocks');
  const [currentPerspective, setCurrentPerspective] = useState<string>('everywhere');
  const [activeNav, setActiveNav] = useState<string>('Markets');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isLiveUpdating, setIsLiveUpdating] = useState<boolean>(true);
  const [flashingIds, setFlashingIds] = useState<Record<string, 'up' | 'down'>>({});
  
  // Watchlist persistence
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tv_markets_watchlist');
      return saved ? JSON.parse(saved) : ['sp500', 'nasdaq100', 'btc', 'gold'];
    } catch {
      return ['sp500', 'nasdaq100', 'btc', 'gold'];
    }
  });

  const handleToggleWatchlist = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWatchlist((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('tv_markets_watchlist', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  // Global Keyboard shortcuts (Ctrl+K / Cmd+K)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Real-time market tick simulation
  useEffect(() => {
    if (!isLiveUpdating) return;

    const interval = setInterval(() => {
      setMarketData((prevData) => {
        // Pick 1-3 random items to update
        const count = Math.floor(Math.random() * 2) + 1;
        const updated = [...prevData];
        const newFlashes: Record<string, 'up' | 'down'> = {};

        for (let i = 0; i < count; i++) {
          const randomIndex = Math.floor(Math.random() * updated.length);
          const current = updated[randomIndex];
          const deltaPct = (Math.random() - 0.49) * 0.003; // small realistic tick
          const newPrice = Math.max(0.01, current.price * (1 + deltaPct));
          const priceDiff = newPrice - (current.openPrice || current.price);
          const newPct = (priceDiff / (current.openPrice || current.price)) * 100;
          const direction: 'up' | 'down' = deltaPct >= 0 ? 'up' : 'down';

          newFlashes[current.id] = direction;

          // Append to 1D chart data
          const current1D = [...current.chartData['1D']];
          if (current1D.length > 0) {
            current1D[current1D.length - 1] = {
              ...current1D[current1D.length - 1],
              price: Number(newPrice.toFixed(2)),
              close: Number(newPrice.toFixed(2)),
            };
          }

          updated[randomIndex] = {
            ...current,
            price: Number(newPrice.toFixed(2)),
            priceFormatted:
              newPrice > 1000
                ? newPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : newPrice.toFixed(2),
            change: Number(priceDiff.toFixed(2)),
            changePercent: Number(newPct.toFixed(2)),
            chartData: {
              ...current.chartData,
              '1D': current1D,
            },
          };

          // If selected item is being updated, sync it
          setSelectedItem((prevSelected) => {
            if (prevSelected && prevSelected.id === current.id) {
              return updated[randomIndex];
            }
            return prevSelected;
          });
        }

        setFlashingIds(newFlashes);
        setTimeout(() => setFlashingIds({}), 1200);

        return updated;
      });
    }, 2400);

    return () => clearInterval(interval);
  }, [isLiveUpdating]);

  // Filtered and sorted data based on perspective, category, and filter
  const displayedItems = useMemo(() => {
    let list = marketData;

    // Apply perspective filter
    if (currentPerspective === 'gainers') {
      list = [...list].sort((a, b) => b.changePercent - a.changePercent);
    } else if (currentPerspective === 'losers') {
      list = [...list].sort((a, b) => a.changePercent - b.changePercent);
    } else if (currentPerspective === 'active') {
      list = [...list].sort((a, b) => (parseFloat(b.volume || '0') || 0) - (parseFloat(a.volume || '0') || 0));
    } else {
      // Regular category filter
      list = list.filter((item) => item.category === activeCategory);
    }

    // Apply search filter if present
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.symbol.toLowerCase().includes(q) ||
          item.badge.toLowerCase().includes(q)
      );
    }

    return list;
  }, [marketData, activeCategory, currentPerspective, searchFilter]);

  const gainersCount = useMemo(() => marketData.filter((i) => i.change >= 0).length, [marketData]);
  const losersCount = useMemo(() => marketData.filter((i) => i.change < 0).length, [marketData]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#131722]">
      {/* Top Navbar */}
      <TopNavBar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        isLiveUpdating={isLiveUpdating}
        setIsLiveUpdating={setIsLiveUpdating}
      />

      {/* Main Content Canvas */}
      <main className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-18 flex-1">
        {/* Headline Section: Markets, everywhere ⌄ */}
        <MarketsHeadline
          currentPerspective={currentPerspective}
          onSelectPerspective={(p) => {
            setCurrentPerspective(p);
            setSearchFilter('');
          }}
          gainersCount={gainersCount}
          losersCount={losersCount}
        />

        {/* Market Categories Navigation (Indices > [ US stocks | World stocks | Crypto ... ]) */}
        <CategoryPills
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            if (currentPerspective !== 'everywhere') {
              setCurrentPerspective('everywhere');
            }
            setSearchFilter('');
          }}
          viewMode={viewMode}
          setViewMode={setViewMode}
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          categoryCount={displayedItems.length}
        />

        {/* Market Data Grid (Cards with badge circles, price, % change, hover states) */}
        <MarketGrid
          items={displayedItems}
          selectedItem={selectedItem}
          onSelectItem={(item) => setSelectedItem(item)}
          viewMode={viewMode}
          watchlist={watchlist}
          onToggleWatchlist={handleToggleWatchlist}
          flashingIds={flashingIds}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Detail Chart Modal */}
      {selectedItem && (
        <MarketDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          isWatched={watchlist.includes(selectedItem.id)}
          onToggleWatchlist={handleToggleWatchlist}
        />
      )}

      {/* Quick Search Modal (Ctrl+K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        items={marketData}
        onSelectItem={(item) => {
          setActiveCategory(item.category);
          setSelectedItem(item);
        }}
      />

      {/* Get Started / Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        watchlistCount={watchlist.length}
      />
    </div>
  );
}
