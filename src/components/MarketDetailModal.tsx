import React, { useState, useRef, useMemo } from 'react';
import { MarketItem, ChartTimeframe } from '../types';
import {
  X,
  Star,
  TrendingUp,
  TrendingDown,
  Maximize2,
  Share2,
  Bell,
  Activity,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Info,
} from 'lucide-react';

interface MarketDetailModalProps {
  item: MarketItem | null;
  onClose: () => void;
  isWatched: boolean;
  onToggleWatchlist: (id: string, e: React.MouseEvent) => void;
}

export const MarketDetailModal: React.FC<MarketDetailModalProps> = ({
  item,
  onClose,
  isWatched,
  onToggleWatchlist,
}) => {
  const [timeframe, setTimeframe] = useState<ChartTimeframe>('1D');
  const [chartType, setChartType] = useState<'line' | 'candles'>('line');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [alertActive, setAlertActive] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  if (!item) return null;

  const chartSeries = item.chartData[timeframe] || item.chartData['1D'];
  const activePoint = hoverIndex !== null && chartSeries[hoverIndex] ? chartSeries[hoverIndex] : chartSeries[chartSeries.length - 1];
  const firstPoint = chartSeries[0];
  const periodChange = activePoint && firstPoint ? activePoint.price - firstPoint.price : item.change;
  const periodChangePercent = firstPoint && firstPoint.price ? (periodChange / firstPoint.price) * 100 : item.changePercent;
  const isPeriodPositive = periodChange >= 0;

  // Compute SVG dimensions and paths
  const prices = chartSeries.map((p) => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  const svgWidth = 720;
  const svgHeight = 240;
  const padding = 20;

  const pointsString = useMemo(() => {
    return chartSeries
      .map((p, idx) => {
        const x = padding + (idx / (chartSeries.length - 1)) * (svgWidth - padding * 2);
        const y = svgHeight - padding - ((p.price - minPrice) / priceRange) * (svgHeight - padding * 2);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [chartSeries, minPrice, priceRange]);

  const areaPath = useMemo(() => {
    if (chartSeries.length < 2) return '';
    const firstX = padding;
    const lastX = svgWidth - padding;
    const bottomY = svgHeight - padding;
    return `M ${pointsString.split(' ')[0]} L ${pointsString.replace(/ /g, ' L ')} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;
  }, [pointsString, chartSeries.length]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const relativeX = Math.max(0, Math.min(mouseX - padding, rect.width - padding * 2));
    const normalizedIndex = Math.round((relativeX / (rect.width - padding * 2)) * (chartSeries.length - 1));
    if (normalizedIndex >= 0 && normalizedIndex < chartSeries.length) {
      setHoverIndex(normalizedIndex);
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="market-detail-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="market-detail-modal-content"
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-[#E0E3EB] overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-[#E0E3EB] flex items-start justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className="w-12 h-12 rounded-full text-white flex items-center justify-center font-mono font-bold text-[15px] shadow-sm shrink-0"
              style={{ backgroundColor: item.badgeBgColor }}
            >
              {item.badge}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-[20px] sm:text-[24px] text-[#131722] tracking-tight">
                  {item.name}
                </h2>
                <span className="text-[12px] font-mono px-2 py-0.5 rounded bg-[#F0F3FA] text-[#434656] font-medium">
                  {item.symbol}
                </span>
                {item.region && (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-[#2962ff] font-medium hidden sm:inline-block">
                    {item.region}
                  </span>
                )}
              </div>
              <p className="text-[12px] text-[#737687] mt-0.5 truncate max-w-md">
                {item.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => onToggleWatchlist(item.id, e)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isWatched
                  ? 'bg-amber-50 text-amber-600 border-amber-200'
                  : 'text-[#737687] hover:text-[#131722] border-[#E0E3EB] hover:bg-[#F0F3FA]'
              }`}
              title={isWatched ? 'Starred in Watchlist' : 'Add to Watchlist'}
            >
              <Star className={`w-4 h-4 ${isWatched ? 'fill-amber-400' : ''}`} />
            </button>
            <button
              onClick={() => setAlertActive((prev) => !prev)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                alertActive
                  ? 'bg-blue-50 text-[#2962ff] border-blue-200'
                  : 'text-[#737687] hover:text-[#131722] border-[#E0E3EB] hover:bg-[#F0F3FA]'
              }`}
              title="Set Price Alert"
            >
              <Bell className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg border border-[#E0E3EB] text-[#737687] hover:text-[#131722] hover:bg-[#F0F3FA] transition-colors cursor-pointer"
              title="Share / Copy Link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              id="close-detail-modal-btn"
              onClick={onClose}
              className="p-2 rounded-lg text-[#737687] hover:text-[#131722] hover:bg-[#F0F3FA] transition-colors ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Main Price & Performance Bar */}
          <div className="flex flex-wrap items-end justify-between gap-4 bg-[#F9FAFC] p-4 sm:p-5 rounded-xl border border-[#E0E3EB]">
            <div>
              <div className="text-[12px] uppercase font-semibold tracking-wider text-[#737687]">
                {hoverIndex !== null ? `Price at ${new Date(activePoint.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Current Real-Time Price'}
              </div>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="font-mono font-bold text-[32px] sm:text-[38px] text-[#131722] tracking-tight">
                  {item.currency === 'USD' || !item.currency ? '$' : ''}
                  {activePoint ? activePoint.price.toLocaleString('en-US', { minimumFractionDigits: 2 }) : item.priceFormatted}
                </span>
                <span
                  className={`font-mono font-semibold text-[15px] sm:text-[17px] flex items-center gap-1 ${
                    isPeriodPositive ? 'text-[#089981]' : 'text-[#F23645]'
                  }`}
                >
                  {isPeriodPositive ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  {isPeriodPositive ? '+' : ''}
                  {periodChange.toFixed(2)} ({isPeriodPositive ? '+' : ''}
                  {periodChangePercent.toFixed(2)}%)
                </span>
              </div>
            </div>

            {/* Timeframe & Chart Style Selectors */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-white p-1 rounded-lg border border-[#E0E3EB] shadow-2xs">
                {(['1D', '5D', '1M', '6M', '1Y', '5Y', 'ALL'] as ChartTimeframe[]).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => {
                      setTimeframe(tf);
                      setHoverIndex(null);
                    }}
                    className={`px-2.5 py-1 text-[12px] font-medium rounded transition-colors cursor-pointer ${
                      timeframe === tf
                        ? 'bg-[#131722] text-white font-semibold'
                        : 'text-[#434656] hover:text-[#131722] hover:bg-[#F0F3FA]'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Technical Chart Canvas */}
          <div className="bg-white rounded-xl border border-[#E0E3EB] p-4 relative">
            <div className="flex items-center justify-between text-[11px] text-[#737687] font-mono mb-2">
              <span>HIGH: ${maxPrice.toFixed(2)}</span>
              <span>TIME: {timeframe} INTERVAL</span>
              <span>LOW: ${minPrice.toFixed(2)}</span>
            </div>

            {/* SVG Interactive Chart */}
            <div className="w-full relative h-[240px]">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-full overflow-visible cursor-crosshair"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isPeriodPositive ? '#089981' : '#F23645'} stopOpacity="0.28" />
                    <stop offset="100%" stopColor={isPeriodPositive ? '#089981' : '#F23645'} stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                <line x1={padding} y1={padding} x2={svgWidth - padding} y2={padding} stroke="#F0F3FA" strokeWidth="1" strokeDasharray="4 4" />
                <line x1={padding} y1={svgHeight / 2} x2={svgWidth - padding} y2={svgHeight / 2} stroke="#F0F3FA" strokeWidth="1" strokeDasharray="4 4" />
                <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="#F0F3FA" strokeWidth="1" strokeDasharray="4 4" />

                {/* Area Gradient */}
                <path d={areaPath} fill="url(#chartGradient)" />

                {/* Main Stroke Line */}
                <polyline
                  fill="none"
                  stroke={isPeriodPositive ? '#089981' : '#F23645'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={pointsString}
                />

                {/* Hover Cursor Vertical Line and Indicator Dot */}
                {hoverIndex !== null && (
                  <>
                    <line
                      x1={padding + (hoverIndex / (chartSeries.length - 1)) * (svgWidth - padding * 2)}
                      y1={padding}
                      x2={padding + (hoverIndex / (chartSeries.length - 1)) * (svgWidth - padding * 2)}
                      y2={svgHeight - padding}
                      stroke="#737687"
                      strokeWidth="1.2"
                      strokeDasharray="3 3"
                    />
                    <circle
                      cx={padding + (hoverIndex / (chartSeries.length - 1)) * (svgWidth - padding * 2)}
                      cy={svgHeight - padding - ((activePoint.price - minPrice) / priceRange) * (svgHeight - padding * 2)}
                      r="5"
                      fill={isPeriodPositive ? '#089981' : '#F23645'}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                  </>
                )}
              </svg>
            </div>

            {/* Volume Histogram preview */}
            <div className="mt-2 pt-2 border-t border-[#F0F3FA] flex items-end justify-between h-10 gap-1 px-4">
              {chartSeries.slice(-24).map((p, i) => {
                const volHeight = Math.max(4, Math.min(36, ((p.volume || 1000000) / 6000000) * 36));
                return (
                  <div
                    key={i}
                    style={{ height: `${volHeight}px` }}
                    className={`flex-1 rounded-t-xs opacity-50 hover:opacity-100 transition-opacity ${
                      (p.close || 0) >= (p.open || 0) ? 'bg-[#089981]' : 'bg-[#F23645]'
                    }`}
                    title={`Volume: ${(p.volume || 0).toLocaleString()}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Key Financial Statistics & Fundamentals */}
          <div>
            <h3 className="font-display font-semibold text-[16px] text-[#131722] mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#2962ff]" />
              Key Statistics & Overview
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#F9FAFC] p-3 rounded-lg border border-[#E0E3EB]">
                <div className="text-[11px] text-[#737687] uppercase font-semibold">24h High / Low</div>
                <div className="font-mono text-[14px] font-semibold text-[#131722] mt-1">
                  ${item.low24h} - ${item.high24h}
                </div>
              </div>
              <div className="bg-[#F9FAFC] p-3 rounded-lg border border-[#E0E3EB]">
                <div className="text-[11px] text-[#737687] uppercase font-semibold">Volume</div>
                <div className="font-mono text-[14px] font-semibold text-[#131722] mt-1">
                  {item.volume}
                </div>
              </div>
              <div className="bg-[#F9FAFC] p-3 rounded-lg border border-[#E0E3EB]">
                <div className="text-[11px] text-[#737687] uppercase font-semibold">Market Cap / Total</div>
                <div className="font-mono text-[14px] font-semibold text-[#131722] mt-1">
                  {item.marketCap || 'N/A'}
                </div>
              </div>
              <div className="bg-[#F9FAFC] p-3 rounded-lg border border-[#E0E3EB]">
                <div className="text-[11px] text-[#737687] uppercase font-semibold">Technical Gauge</div>
                <div className="mt-1">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
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
                </div>
              </div>
            </div>
          </div>

          {/* Top Constituents / Holdings if applicable */}
          {item.topHoldings && item.topHoldings.length > 0 && (
            <div>
              <h3 className="font-display font-semibold text-[15px] text-[#131722] mb-2.5 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#2962ff]" />
                Top Holdings & Major Constituents
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.topHoldings.map((h, i) => (
                  <span
                    key={i}
                    className="text-[12px] bg-[#F0F3FA] text-[#434656] px-3 py-1.5 rounded-lg border border-[#E0E3EB] font-medium"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E0E3EB] bg-[#F9FAFC] flex items-center justify-between">
          <div className="text-[12px] text-[#737687] flex items-center gap-1.5">
            <Info className="w-4 h-4 text-[#2962ff]" />
            <span>Data updated dynamically from global exchange feeds</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#131722] text-white text-[13px] font-medium hover:bg-[#2c303c] transition-colors cursor-pointer"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
