import React from 'react';
import { MarketItem, ViewMode } from '../types';
import { TrendingUp, TrendingDown, Star, ArrowUpRight, ArrowDownRight, BarChart2 } from 'lucide-react';

interface MarketGridProps {
  items: MarketItem[];
  selectedItem: MarketItem | null;
  onSelectItem: (item: MarketItem) => void;
  viewMode: ViewMode;
  watchlist: string[];
  onToggleWatchlist: (id: string, e: React.MouseEvent) => void;
  flashingIds: Record<string, 'up' | 'down'>;
}

// Mini Sparkline SVG Generator
const MiniSparkline: React.FC<{ data: number[]; isPositive: boolean }> = ({ data, isPositive }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 28;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const strokeColor = isPositive ? '#089981' : '#F23645';

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

export const MarketGrid: React.FC<MarketGridProps> = ({
  items,
  selectedItem,
  onSelectItem,
  viewMode,
  watchlist,
  onToggleWatchlist,
  flashingIds,
}) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-[#F0F3FA] rounded-2xl border border-[#E0E3EB] my-8">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto text-[#737687] shadow-sm mb-3">
          <BarChart2 className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-[16px] text-[#131722] mb-1">No markets match your criteria</h3>
        <p className="text-[13px] text-[#737687]">Try adjusting your search filter or selecting another asset class tab above.</p>
      </div>
    );
  }

  // --- 1. CARDS VIEW (Matching the prompt screenshot exactly) ---
  if (viewMode === 'cards') {
    return (
      <div id="market-cards-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {items.map((item) => {
          const isSelected = selectedItem?.id === item.id;
          const isWatched = watchlist.includes(item.id);
          const isPositive = item.change >= 0;
          const flash = flashingIds[item.id];
          const sparklineData = item.chartData['1D'].map((p) => p.price);

          return (
            <div
              key={item.id}
              id={`market-card-${item.id}`}
              onClick={() => onSelectItem(item)}
              className={`rounded-xl p-4 sm:p-5 flex items-center justify-between cursor-pointer transition-all border group relative ${
                isSelected
                  ? 'bg-[#F0F3FA] border-[#c3c5d8] shadow-xs'
                  : 'bg-white hover:bg-[#F0F3FA] border-transparent hover:border-[#E0E3EB]'
              } ${flash === 'up' ? 'flash-green' : flash === 'down' ? 'flash-red' : ''}`}
            >
              {/* Left: Badge + Name */}
              <div className="flex items-center min-w-0 pr-3">
                {/* Colored Circle Badge from Screenshot */}
                <div
                  className="w-12 h-12 rounded-full text-white flex items-center justify-center font-mono font-bold text-[14px] mr-4 shrink-0 shadow-xs select-none"
                  style={{ backgroundColor: item.badgeBgColor }}
                >
                  {item.badge}
                </div>

                {/* Symbol & Title */}
                <div className="truncate">
                  <div className="font-display font-medium text-[16px] sm:text-[17px] text-[#131722] group-hover:text-[#2962ff] transition-colors truncate">
                    {item.name}
                  </div>
                  <div className="text-[12px] text-[#737687] font-mono flex items-center gap-1.5 mt-0.5">
                    <span>{item.symbol}</span>
                    {item.unit && (
                      <span className="text-[10px] px-1 py-0.2 bg-gray-100 rounded text-gray-500">
                        {item.unit}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Sparkline, Live Price, and % Change */}
              <div className="flex items-center gap-3 shrink-0">
                {/* Mini Sparkline Chart */}
                <div className="hidden sm:block opacity-75 group-hover:opacity-100 transition-opacity">
                  <MiniSparkline data={sparklineData} isPositive={isPositive} />
                </div>

                {/* Price & Change */}
                <div className="text-right">
                  <div className="font-mono font-semibold text-[15px] text-[#131722] tracking-tight">
                    {item.currency === 'USD' || !item.currency ? '$' : ''}
                    {item.priceFormatted}
                  </div>
                  <div
                    className={`text-[12px] font-mono font-medium flex items-center justify-end gap-0.5 mt-0.5 ${
                      isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="w-3.5 h-3.5 inline" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5 inline" />
                    )}
                    <span>
                      {isPositive ? '+' : ''}
                      {item.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Watchlist Star Button */}
                <button
                  onClick={(e) => onToggleWatchlist(item.id, e)}
                  title={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
                  className={`p-1.5 rounded-full transition-colors ${
                    isWatched
                      ? 'text-amber-500 hover:text-amber-600'
                      : 'text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <Star className={`w-4 h-4 ${isWatched ? 'fill-amber-400' : ''}`} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // --- 2. TABLE VIEW ---
  if (viewMode === 'table') {
    return (
      <div id="market-table-container" className="bg-white rounded-xl border border-[#E0E3EB] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#F0F3FA] text-[#737687] font-semibold uppercase text-[11px] tracking-wider border-b border-[#E0E3EB]">
              <tr>
                <th className="py-3 px-4 w-10"></th>
                <th className="py-3 px-4">Market / Asset</th>
                <th className="py-3 px-4 text-right">Price</th>
                <th className="py-3 px-4 text-right">24h Change</th>
                <th className="py-3 px-4 text-right">24h %</th>
                <th className="py-3 px-4 text-right hidden sm:table-cell">24h Range</th>
                <th className="py-3 px-4 text-right hidden md:table-cell">Volume</th>
                <th className="py-3 px-4 text-center hidden lg:table-cell">Technical Rating</th>
                <th className="py-3 px-4 text-right">Chart</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F3FA]">
              {items.map((item) => {
                const isPositive = item.change >= 0;
                const isWatched = watchlist.includes(item.id);
                const isSelected = selectedItem?.id === item.id;
                const sparklineData = item.chartData['1D'].map((p) => p.price);

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className={`hover:bg-[#F9FAFC] cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#F0F3FA]' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-center" onClick={(e) => onToggleWatchlist(item.id, e)}>
                      <button className="text-gray-300 hover:text-amber-500">
                        <Star className={`w-4 h-4 ${isWatched ? 'text-amber-400 fill-amber-400' : ''}`} />
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full text-white flex items-center justify-center font-mono font-bold text-[11px] shrink-0"
                          style={{ backgroundColor: item.badgeBgColor }}
                        >
                          {item.badge}
                        </div>
                        <div>
                          <div className="font-semibold text-[#131722] hover:text-[#2962ff]">{item.name}</div>
                          <div className="text-[11px] text-[#737687] font-mono">{item.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-[#131722]">
                      {item.currency === 'USD' || !item.currency ? '$' : ''}
                      {item.priceFormatted}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-mono font-medium ${
                        isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {item.change.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-medium">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[12px] ${
                          isPositive ? 'bg-emerald-50 text-[#089981]' : 'bg-red-50 text-[#F23645]'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {item.changePercent.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[#737687] hidden sm:table-cell text-[12px]">
                      ${item.low24h} - ${item.high24h}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[#434656] hidden md:table-cell">
                      {item.volume}
                    </td>
                    <td className="py-3 px-4 text-center hidden lg:table-cell">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          item.rating === 'Strong Buy'
                            ? 'bg-emerald-600 text-white'
                            : item.rating === 'Buy'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.rating === 'Sell'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {item.rating || 'Neutral'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-block">
                        <MiniSparkline data={sparklineData} isPositive={isPositive} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // --- 3. HEATMAP VIEW ---
  return (
    <div id="market-heatmap-grid" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {items.map((item) => {
        const isPositive = item.change >= 0;
        const absPercent = Math.min(Math.abs(item.changePercent), 5);
        const opacity = 0.4 + (absPercent / 5) * 0.6;
        const bgColor = isPositive
          ? `rgba(8, 153, 129, ${opacity})`
          : `rgba(242, 54, 69, ${opacity})`;

        return (
          <div
            key={item.id}
            id={`heatmap-tile-${item.id}`}
            onClick={() => onSelectItem(item)}
            style={{ backgroundColor: bgColor }}
            className="rounded-xl p-4 text-white flex flex-col justify-between h-32 cursor-pointer hover:scale-[1.02] transition-transform shadow-xs"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="font-bold font-display text-[15px]">{item.name}</span>
                <div className="text-[11px] opacity-80 font-mono">{item.symbol}</div>
              </div>
              <span className="text-[11px] font-mono px-1.5 py-0.5 bg-black/20 rounded">
                {item.badge}
              </span>
            </div>

            <div className="flex justify-between items-end">
              <span className="text-[13px] font-mono opacity-90">${item.priceFormatted}</span>
              <span className="text-[15px] font-mono font-bold">
                {isPositive ? '+' : ''}
                {item.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
