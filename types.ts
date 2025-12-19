
export enum TradeSide {
  LONG = 'long',
  SHORT = 'short'
}

export enum FillSide {
  BUY = 'buy',
  SELL = 'sell'
}

export interface Fill {
  id: string;
  symbol: string;
  side: FillSide;
  quantity: number;
  price: number;
  fees: number;
  datetime: string;
}

export interface Trade {
  id: string;
  symbol: string;
  side: TradeSide;
  openDatetime: string;
  closeDatetime: string;
  quantity: number;
  avgEntryPrice: number;
  avgExitPrice: number;
  fees: number;
  pnlGross: number;
  pnlNet: number;
  rMultiple?: number;
  strategy?: string;
  notes?: string;
  setup?: string;
  legs: Fill[];
}

export interface AnalyticsSummary {
  totalPnl: number;
  winRate: number;
  profitFactor: number;
  avgWin: number;
  avgLoss: number;
  expectancy: number;
  maxDrawdown: number;
  totalTrades: number;
}
