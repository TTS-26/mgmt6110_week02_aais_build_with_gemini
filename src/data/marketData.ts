import { MarketCategory, MarketItem, TimeSeriesPoint } from '../types';

function generateChartSeries(
  basePrice: number,
  points: number,
  volatility: number,
  trend: number
): TimeSeriesPoint[] {
  const result: TimeSeriesPoint[] = [];
  let currentPrice = basePrice * (1 - trend * 0.5);
  const now = Date.now();
  const step = 86400000 / (points / 5);

  for (let i = 0; i < points; i++) {
    const randomDelta = (Math.random() - 0.48) * volatility * currentPrice;
    currentPrice = Math.max(currentPrice * 0.5, currentPrice + randomDelta + (trend * basePrice) / points);
    const high = currentPrice * (1 + Math.random() * 0.005);
    const low = currentPrice * (1 - Math.random() * 0.005);
    const open = (high + low) / 2;
    const timeStr = new Date(now - (points - i) * step).toISOString();

    result.push({
      time: timeStr,
      price: Number(currentPrice.toFixed(2)),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(currentPrice.toFixed(2)),
      volume: Math.floor(Math.random() * 5000000 + 1000000),
    });
  }

  // Ensure last point aligns with basePrice
  if (result.length > 0) {
    result[result.length - 1].price = basePrice;
    result[result.length - 1].close = basePrice;
  }
  return result;
}

function createMarketItem(
  id: string,
  symbol: string,
  name: string,
  badge: string,
  badgeBgColor: string,
  category: MarketCategory,
  price: number,
  change: number,
  changePercent: number,
  opts: Partial<MarketItem> = {}
): MarketItem {
  const isUp = change >= 0;
  const trend = isUp ? 0.06 : -0.06;

  return {
    id,
    symbol,
    name,
    badge,
    badgeBgColor,
    category,
    region: opts.region || 'Americas',
    price,
    priceFormatted: price > 1000 ? price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : price.toFixed(2),
    change,
    changePercent,
    currency: opts.currency || 'USD',
    unit: opts.unit,
    volume: opts.volume || `${(Math.random() * 8 + 1.2).toFixed(2)}B`,
    marketCap: opts.marketCap || `${(price * 4.2).toFixed(1)}B`,
    high24h: Number((price * 1.012).toFixed(2)),
    low24h: Number((price * 0.989).toFixed(2)),
    openPrice: Number((price - change).toFixed(2)),
    peRatio: opts.peRatio || Number((Math.random() * 25 + 15).toFixed(1)),
    dividendYield: opts.dividendYield || Number((Math.random() * 2 + 0.5).toFixed(2)),
    rating: opts.rating || (changePercent > 0.8 ? 'Strong Buy' : changePercent > 0 ? 'Buy' : changePercent > -1 ? 'Neutral' : 'Sell'),
    description: opts.description || `${name} (${symbol}) tracks major constituents providing deep liquidity and transparent pricing.`,
    constituentsCount: opts.constituentsCount,
    topHoldings: opts.topHoldings,
    chartData: {
      '1D': generateChartSeries(price, 30, 0.003, trend * 0.2),
      '5D': generateChartSeries(price, 45, 0.008, trend * 0.5),
      '1M': generateChartSeries(price, 50, 0.015, trend),
      '6M': generateChartSeries(price, 60, 0.025, trend * 1.5),
      '1Y': generateChartSeries(price, 75, 0.035, trend * 2),
      '5Y': generateChartSeries(price, 90, 0.05, 0.4),
      'ALL': generateChartSeries(price, 100, 0.08, 0.8),
    },
  };
}

export const INITIAL_MARKET_DATA: MarketItem[] = [
  // --- Indices (US stocks tab in original screen) ---
  createMarketItem(
    'sp500',
    'SPX',
    'S&P 500',
    '500',
    '#F23645', // Red badge matching screenshot
    'us-stocks',
    5983.25,
    -18.42,
    -0.31,
    {
      description: 'Standard and Poor’s 500 Index tracks 500 of the largest publicly traded companies on US stock exchanges.',
      constituentsCount: 503,
      topHoldings: ['Apple Inc (7.1%)', 'Microsoft Corp (6.4%)', 'NVIDIA Corp (6.1%)', 'Amazon.com (3.8%)', 'Alphabet Inc (2.3%)'],
      marketCap: '$45.8T',
      volume: '$38.2B',
      rating: 'Buy',
    }
  ),
  createMarketItem(
    'nasdaq100',
    'NDX',
    'Nasdaq 100',
    '100',
    '#0091ff', // Blue badge matching screenshot
    'us-stocks',
    20892.64,
    142.18,
    0.69,
    {
      description: 'The Nasdaq-100 includes 100 of the largest non-financial domestic and international companies listed on The Nasdaq Stock Market.',
      constituentsCount: 101,
      topHoldings: ['Apple Inc (8.8%)', 'Microsoft Corp (8.2%)', 'NVIDIA Corp (7.9%)', 'Broadcom Inc (4.7%)', 'Amazon.com (5.1%)'],
      marketCap: '$24.6T',
      volume: '$42.1B',
      rating: 'Strong Buy',
    }
  ),
  createMarketItem(
    'dow30',
    'DJI',
    'Dow 30',
    '30',
    '#0091ff', // Blue badge matching screenshot
    'us-stocks',
    43910.29,
    65.44,
    0.15,
    {
      description: 'The Dow Jones Industrial Average (DJIA) is a price-weighted index that tracks 30 large, publicly owned blue-chip companies in the US.',
      constituentsCount: 30,
      topHoldings: ['UnitedHealth Group (8.9%)', 'Goldman Sachs (7.8%)', 'Microsoft (6.5%)', 'Home Depot (5.4%)', 'Caterpillar (4.9%)'],
      marketCap: '$13.9T',
      volume: '$16.4B',
      rating: 'Neutral',
    }
  ),
  createMarketItem(
    'russell2000',
    'RUT',
    'Russell 2000',
    '2K',
    '#089981',
    'us-stocks',
    2310.85,
    14.62,
    0.64,
    {
      description: 'The Russell 2000 Index measures the performance of the small-cap segment of the US equity universe.',
      constituentsCount: 1980,
      topHoldings: ['Super Micro Computer', 'MicroStrategy', 'Comfort Systems', 'FTAI Aviation', 'Fabrinet'],
      marketCap: '$3.4T',
      volume: '$8.9B',
      rating: 'Buy',
    }
  ),
  createMarketItem(
    'vix',
    'VIX',
    'Cboe Volatility Index',
    'VIX',
    '#9700ff',
    'us-stocks',
    14.88,
    -0.45,
    -2.94,
    {
      description: 'Market volatility index based on S&P 500 index option prices, often termed the market fear gauge.',
      marketCap: 'N/A',
      volume: '$1.8B',
      rating: 'Neutral',
    }
  ),
  createMarketItem(
    'nyse-composite',
    'NYA',
    'NYSE Composite',
    'NY',
    '#0049db',
    'us-stocks',
    19640.12,
    -32.10,
    -0.16,
    {
      description: 'Includes all common stocks listed on the New York Stock Exchange, including ADRs and REITs.',
      constituentsCount: 2400,
      marketCap: '$28.1T',
      volume: '$22.5B',
      rating: 'Neutral',
    }
  ),

  // --- World Stocks ---
  createMarketItem(
    'nikkei225',
    'N225',
    'Nikkei 225',
    '225',
    '#089981',
    'world-stocks',
    38642.91,
    298.54,
    0.78,
    {
      region: 'Asia',
      currency: 'JPY',
      description: 'The Nikkei 225 is Japan’s premier stock index of top-rated companies on the Tokyo Stock Exchange.',
      topHoldings: ['Fast Retailing', 'Tokyo Electron', 'SoftBank Group', 'Advantest', 'KDDI'],
      marketCap: '¥720T',
    }
  ),
  createMarketItem(
    'dax40',
    'DAX',
    'DAX 40',
    '40',
    '#0091ff',
    'world-stocks',
    19254.97,
    88.32,
    0.46,
    {
      region: 'Europe',
      currency: 'EUR',
      description: 'The DAX 40 consists of 40 major German blue-chip companies trading on the Frankfurt Stock Exchange.',
      topHoldings: ['SAP SE', 'Siemens AG', 'Allianz SE', 'Airbus SE', 'Deutsche Telekom'],
      marketCap: '€1.9T',
    }
  ),
  createMarketItem(
    'ftse100',
    'FTSE',
    'FTSE 100',
    '100',
    '#F23645',
    'world-stocks',
    8274.61,
    -19.45,
    -0.23,
    {
      region: 'Europe',
      currency: 'GBP',
      description: 'The Financial Times Stock Exchange 100 Index represents the 100 largest UK companies on the London Stock Exchange.',
      topHoldings: ['AstraZeneca', 'Shell PLC', 'HSBC Holdings', 'Unilever', 'BP PLC'],
      marketCap: '£2.1T',
    }
  ),
  createMarketItem(
    'cac40',
    'PX1',
    'CAC 40',
    '40',
    '#F23645',
    'world-stocks',
    7382.40,
    -34.12,
    -0.46,
    {
      region: 'Europe',
      currency: 'EUR',
      description: 'The CAC 40 benchmark index represents the 40 most significant equities on Euronext Paris.',
      topHoldings: ['LVMH', 'TotalEnergies', 'Sanofi', 'Hermès', 'L’Oréal'],
      marketCap: '€2.3T',
    }
  ),
  createMarketItem(
    'hangseng',
    'HSI',
    'Hang Seng Index',
    'HSI',
    '#089981',
    'world-stocks',
    19924.50,
    312.20,
    1.59,
    {
      region: 'Asia',
      currency: 'HKD',
      description: 'Tracks the largest companies of the Hong Kong stock market, maintaining high exposure to Greater China tech.',
      topHoldings: ['Tencent Holdings', 'Alibaba Group', 'Meituan', 'AIA Group', 'CCB'],
      marketCap: 'HK$36T',
    }
  ),
  createMarketItem(
    'nifty50',
    'NIFTY',
    'Nifty 50',
    '50',
    '#089981',
    'world-stocks',
    23518.70,
    184.25,
    0.79,
    {
      region: 'Asia',
      currency: 'INR',
      description: 'National Stock Exchange of India benchmark index consisting of 50 weighted Indian company stocks across 13 sectors.',
      topHoldings: ['HDFC Bank', 'Reliance Industries', 'ICICI Bank', 'Infosys', 'TCS'],
      marketCap: '₹195T',
    }
  ),

  // --- Crypto ---
  createMarketItem(
    'btc',
    'BTC/USD',
    'Bitcoin',
    '₿',
    '#F7931A',
    'crypto',
    96450.00,
    1820.50,
    1.92,
    {
      region: 'Global',
      description: 'Bitcoin is the original decentralized peer-to-peer digital currency and largest cryptocurrency by market capitalization.',
      marketCap: '$1.91T',
      volume: '$48.5B',
      rating: 'Strong Buy',
    }
  ),
  createMarketItem(
    'eth',
    'ETH/USD',
    'Ethereum',
    'Ξ',
    '#627EEA',
    'crypto',
    3480.20,
    74.15,
    2.18,
    {
      region: 'Global',
      description: 'Ethereum is a decentralized open-source blockchain featuring smart contract functionality and proof-of-stake consensus.',
      marketCap: '$418.5B',
      volume: '$24.1B',
      rating: 'Buy',
    }
  ),
  createMarketItem(
    'sol',
    'SOL/USD',
    'Solana',
    'SOL',
    '#9700ff',
    'crypto',
    215.80,
    11.40,
    5.58,
    {
      region: 'Global',
      description: 'High-speed layer-1 blockchain built for high throughput and sub-second transaction finality.',
      marketCap: '$101.4B',
      volume: '$9.2B',
      rating: 'Strong Buy',
    }
  ),
  createMarketItem(
    'bnb',
    'BNB/USD',
    'BNB Chain',
    'BNB',
    '#F3BA2F',
    'crypto',
    648.90,
    -4.10,
    -0.63,
    {
      region: 'Global',
      description: 'Native utility asset powering the BNB Chain ecosystem and Binance exchange discounts.',
      marketCap: '$93.2B',
      volume: '$1.8B',
    }
  ),
  createMarketItem(
    'xrp',
    'XRP/USD',
    'XRP Ledger',
    'XRP',
    '#23292F',
    'crypto',
    1.48,
    0.14,
    10.45,
    {
      region: 'Global',
      description: 'Real-time gross settlement system and currency exchange network designed for institutional cross-border liquidity.',
      marketCap: '$84.1B',
      volume: '$8.4B',
      rating: 'Strong Buy',
    }
  ),
  createMarketItem(
    'doge',
    'DOGE/USD',
    'Dogecoin',
    'Ð',
    '#C2A633',
    'crypto',
    0.285,
    -0.008,
    -2.73,
    {
      region: 'Global',
      description: 'Popular open-source peer-to-peer meme cryptocurrency utilizing scrypt technology.',
      marketCap: '$41.8B',
      volume: '$3.7B',
    }
  ),

  // --- Futures ---
  createMarketItem(
    'gold',
    'GC1!',
    'Gold Futures',
    'GC',
    '#E5A93C',
    'futures',
    2648.70,
    16.40,
    0.62,
    {
      unit: 'USD / Troy oz',
      description: 'COMEX Gold benchmark futures contract, reflecting global safe-haven bullion demand and currency hedge pricing.',
      volume: '$32.1B',
      rating: 'Buy',
    }
  ),
  createMarketItem(
    'crude',
    'CL1!',
    'Crude Oil WTI',
    'CL',
    '#2c303c',
    'futures',
    69.84,
    -1.12,
    -1.58,
    {
      unit: 'USD / Barrel',
      description: 'West Texas Intermediate light sweet crude oil futures traded on the New York Mercantile Exchange.',
      volume: '$28.4B',
      rating: 'Sell',
    }
  ),
  createMarketItem(
    'silver',
    'SI1!',
    'Silver Futures',
    'SI',
    '#737687',
    'futures',
    31.25,
    0.48,
    1.56,
    {
      unit: 'USD / Troy oz',
      description: 'COMEX Silver futures contract with broad industrial and precious metal investment utility.',
      volume: '$14.2B',
      rating: 'Buy',
    }
  ),
  createMarketItem(
    'natgas',
    'NG1!',
    'Natural Gas',
    'NG',
    '#0091ff',
    'futures',
    3.14,
    0.18,
    6.08,
    {
      unit: 'USD / MMBtu',
      description: 'Henry Hub natural gas futures representing physical delivery in Louisiana, highly sensitive to weather cycles.',
      volume: '$9.6B',
      rating: 'Strong Buy',
    }
  ),
  createMarketItem(
    'copper',
    'HG1!',
    'Copper Futures',
    'HG',
    '#C74500',
    'futures',
    4.18,
    -0.03,
    -0.71,
    {
      unit: 'USD / lb',
      description: 'High Grade Copper futures contract, considered a bellwether for global macroeconomic and construction demand.',
      volume: '$8.1B',
    }
  ),

  // --- Forex ---
  createMarketItem(
    'eurusd',
    'EUR/USD',
    'Euro / US Dollar',
    '€/$',
    '#0049db',
    'forex',
    1.0542,
    -0.0034,
    -0.32,
    {
      description: 'The world’s most heavily traded currency pair, representing the economies of the Eurozone and the United States.',
      volume: '$580B',
      rating: 'Neutral',
    }
  ),
  createMarketItem(
    'usdjpy',
    'USD/JPY',
    'US Dollar / Japanese Yen',
    '$/¥',
    '#F23645',
    'forex',
    154.68,
    0.84,
    0.55,
    {
      description: 'Key Asia-Pacific FX pair heavily driven by the interest rate differential between the Federal Reserve and the Bank of Japan.',
      volume: '$420B',
      rating: 'Buy',
    }
  ),
  createMarketItem(
    'gbpusd',
    'GBP/USD',
    'British Pound / US Dollar',
    '£/$',
    '#089981',
    'forex',
    1.2615,
    0.0028,
    0.22,
    {
      description: 'Known as "Cable", one of the oldest and most liquid foreign exchange markets in the world.',
      volume: '$310B',
    }
  ),
  createMarketItem(
    'audusd',
    'AUD/USD',
    'Australian Dollar / US Dollar',
    'A$/$',
    '#0091ff',
    'forex',
    0.6510,
    0.0018,
    0.28,
    {
      description: 'Popular commodity currency pair influenced by Australian raw material exports and Chinese industrial demand.',
      volume: '$190B',
    }
  ),

  // --- Government Bonds ---
  createMarketItem(
    'us10y',
    'US10Y',
    'US 10-Year Yield',
    '10Y',
    '#0049db',
    'gov-bonds',
    4.425,
    -0.038,
    -0.85,
    {
      unit: '% Yield',
      description: 'The benchmark US 10-Year Treasury note yield, the global risk-free rate cornerstone for mortgages and credit.',
      volume: '$140B',
      rating: 'Neutral',
    }
  ),
  createMarketItem(
    'us2y',
    'US02Y',
    'US 2-Year Yield',
    '2Y',
    '#F23645',
    'gov-bonds',
    4.312,
    0.024,
    0.56,
    {
      unit: '% Yield',
      description: 'Short-term Treasury yield closely tracking market expectations for Federal Reserve monetary policy rates.',
      volume: '$95B',
    }
  ),
  createMarketItem(
    'us30y',
    'US30Y',
    'US 30-Year Bond',
    '30Y',
    '#089981',
    'gov-bonds',
    4.610,
    -0.045,
    -0.97,
    {
      unit: '% Yield',
      description: 'Long-term US sovereign bond yield, pricing long-range inflation forecasts and fiscal supply outlooks.',
      volume: '$60B',
    }
  ),
  createMarketItem(
    'de10y',
    'DE10Y',
    'German 10-Year Bund',
    'BUND',
    '#0091ff',
    'gov-bonds',
    2.368,
    -0.015,
    -0.63,
    {
      region: 'Europe',
      unit: '% Yield',
      description: 'The premier European sovereign benchmark issued by the Federal Republic of Germany.',
      volume: '€45B',
    }
  ),

  // --- Corporate Bonds ---
  createMarketItem(
    'hyg',
    'HYG',
    'iShares High Yield Corp',
    'HYG',
    '#089981',
    'corp-bonds',
    78.45,
    0.32,
    0.41,
    {
      dividendYield: 5.82,
      description: 'Provides targeted exposure to a broad range of US high yield "junk" corporate debt.',
      marketCap: '$17.2B',
      volume: '$2.1B',
    }
  ),
  createMarketItem(
    'lqd',
    'LQD',
    'iShares Investment Grade',
    'LQD',
    '#0049db',
    'corp-bonds',
    109.80,
    -0.42,
    -0.38,
    {
      dividendYield: 4.45,
      description: 'Tracks US dollar-denominated investment-grade corporate bonds across blue-chip issuers.',
      marketCap: '$32.4B',
      volume: '$1.9B',
    }
  ),
  createMarketItem(
    'agg',
    'AGG',
    'iShares Core US Aggregate',
    'AGG',
    '#737687',
    'corp-bonds',
    98.15,
    0.08,
    0.08,
    {
      dividendYield: 3.75,
      description: 'Broad benchmark tracking the total investment-grade US bond universe.',
      marketCap: '$110.5B',
      volume: '$1.4B',
    }
  ),

  // --- ETFs ---
  createMarketItem(
    'spy',
    'SPY',
    'SPDR S&P 500 ETF Trust',
    'SPY',
    '#F23645',
    'etfs',
    597.40,
    -1.85,
    -0.31,
    {
      description: 'The oldest, largest, and most heavily traded exchange-traded fund in the world tracking the S&P 500.',
      marketCap: '$590B',
      volume: '$28.5B',
      rating: 'Buy',
    }
  ),
  createMarketItem(
    'qqq',
    'QQQ',
    'Invesco QQQ Trust',
    'QQQ',
    '#0091ff',
    'etfs',
    509.80,
    3.45,
    0.68,
    {
      description: 'Tracks the innovation-heavy Nasdaq-100 index, concentrating on leading technology and growth leaders.',
      marketCap: '$295B',
      volume: '$24.2B',
      rating: 'Strong Buy',
    }
  ),
  createMarketItem(
    'vti',
    'VTI',
    'Vanguard Total Stock Market',
    'VTI',
    '#089981',
    'etfs',
    289.60,
    0.42,
    0.15,
    {
      description: 'Complete exposure to the entire investable US equity market across small, mid, and large-cap stocks.',
      marketCap: '$410B',
      volume: '$4.1B',
    }
  ),
  createMarketItem(
    'gld',
    'GLD',
    'SPDR Gold Shares',
    'GLD',
    '#E5A93C',
    'etfs',
    244.20,
    1.50,
    0.62,
    {
      description: 'Direct physical gold bullion ETF offering liquid fractional exposure to gold spot pricing.',
      marketCap: '$72.8B',
      volume: '$1.7B',
    }
  ),

  // --- Economy ---
  createMarketItem(
    'usgdp',
    'US.GDP',
    'US Real GDP Growth',
    'GDP',
    '#089981',
    'economy',
    2.8,
    0.2,
    7.69,
    {
      unit: '% QoQ Ann.',
      description: 'US annualized quarter-over-quarter change in gross domestic product adjusted for price changes.',
      rating: 'Buy',
    }
  ),
  createMarketItem(
    'uscpi',
    'US.CPI',
    'US CPI Inflation (YoY)',
    'CPI',
    '#F23645',
    'economy',
    2.6,
    0.1,
    4.0,
    {
      unit: '% YoY',
      description: 'Consumer Price Index measure of the average change over time in prices paid by consumers.',
      rating: 'Neutral',
    }
  ),
  createMarketItem(
    'fedfunds',
    'FED.RATE',
    'Fed Funds Target Rate',
    'FED',
    '#0049db',
    'economy',
    4.75,
    -0.25,
    -5.0,
    {
      unit: '% Upper Bound',
      description: 'The Federal Open Market Committee target interest rate range for overnight interbank lending.',
      rating: 'Neutral',
    }
  ),
  createMarketItem(
    'unemp',
    'US.UNEMP',
    'US Unemployment Rate',
    'UNEMP',
    '#737687',
    'economy',
    4.1,
    0.0,
    0.0,
    {
      unit: '% of Labor Force',
      description: 'Percentage of the civilian labor force that is unemployed and actively seeking work.',
      rating: 'Neutral',
    }
  ),
];

export const CATEGORY_TABS: { id: MarketCategory; label: string }[] = [
  { id: 'us-stocks', label: 'US stocks' },
  { id: 'world-stocks', label: 'World stocks' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'futures', label: 'Futures' },
  { id: 'forex', label: 'Forex' },
  { id: 'gov-bonds', label: 'Government bonds' },
  { id: 'corp-bonds', label: 'Corporate bonds' },
  { id: 'etfs', label: 'ETFs' },
  { id: 'economy', label: 'Economy' },
];
