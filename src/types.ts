export type AssetCategory =
  | 'US stocks'
  | 'World stocks'
  | 'Crypto'
  | 'Futures'
  | 'Forex'
  | 'Government bonds'
  | 'Corporate bonds'
  | 'ETFs'
  | 'Economy';

export type TableTab = 'Most active' | 'Top gainers' | 'Top losers' | 'High volatility';

export type TechRating = 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';

export interface IndexItem {
  id: string;
  name: string;
  ticker: string;
  provider: string;
  badgeNumber: string;
  avatarBg: string;
  avatarTextColor?: string;
  price: number;
  change: number;
  changePercent: number;
  currency?: string;
  sparklinePoints: number[];
  high52w: number;
  low52w: number;
  peRatio?: number;
  turnover?: string;
  description: string;
}

export interface SecurityItem {
  id: string;
  ticker: string;
  name: string;
  avatarChar: string;
  avatarBg: string;
  avatarTextColor?: string;
  lastPrice: number;
  currency: string;
  changePercent: number;
  change: number;
  techRating: TechRating;
  volume: string;
  trend: 'up' | 'down';
  trendPoints: number[];
  category: AssetCategory;
  marketCap?: string;
  peRatio?: number;
  range52w?: string;
  dayRange?: string;
  analystConsensus?: string;
}
