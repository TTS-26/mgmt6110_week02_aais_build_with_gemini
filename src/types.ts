export type MarketCategory =
  | 'us-stocks'
  | 'world-stocks'
  | 'crypto'
  | 'futures'
  | 'forex'
  | 'gov-bonds'
  | 'corp-bonds'
  | 'etfs'
  | 'economy';

export interface TimeSeriesPoint {
  time: string;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
}

export interface MarketItem {
  id: string;
  symbol: string;
  name: string;
  badge: string; // e.g., '500', '100', '30', 'BTC', 'NVDA'
  badgeBgColor: string; // e.g. '#F23645' (red) or '#0091ff' (blue) or '#089981' (green) or '#9700ff'
  category: MarketCategory;
  region?: 'Americas' | 'Europe' | 'Asia' | 'Global';
  price: number;
  priceFormatted: string;
  change: number;
  changePercent: number;
  currency?: string;
  unit?: string;
  volume?: string;
  marketCap?: string;
  high24h?: number;
  low24h?: number;
  openPrice?: number;
  peRatio?: number;
  dividendYield?: number;
  rating?: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
  description: string;
  constituentsCount?: number;
  topHoldings?: string[];
  chartData: {
    '1D': TimeSeriesPoint[];
    '5D': TimeSeriesPoint[];
    '1M': TimeSeriesPoint[];
    '6M': TimeSeriesPoint[];
    '1Y': TimeSeriesPoint[];
    '5Y': TimeSeriesPoint[];
    'ALL': TimeSeriesPoint[];
  };
}

export type ChartTimeframe = '1D' | '5D' | '1M' | '6M' | '1Y' | '5Y' | 'ALL';
export type ViewMode = 'cards' | 'table' | 'heatmap';
export type SortOption = 'default' | 'gainers' | 'losers' | 'name' | 'volume';
