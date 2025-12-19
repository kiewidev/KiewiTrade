
import { Fill, FillSide, Trade, TradeSide, AnalyticsSummary } from '../types';

export const groupFillsFIFO = (rawFills: Fill[]): Trade[] => {
  const sortedFills = [...rawFills].sort((a, b) => 
    new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
  );

  const trades: Trade[] = [];
  const inventories: Record<string, Fill[]> = {};

  sortedFills.forEach(fill => {
    const symbol = fill.symbol;
    if (!inventories[symbol]) inventories[symbol] = [];
    
    const inventory = inventories[symbol];
    
    // Check if current fill reduces existing position
    if (inventory.length > 0 && inventory[0].side !== fill.side) {
      let remainingToMatch = fill.quantity;
      const matchedEntries: Fill[] = [];
      const matchedExits: Fill[] = [];
      const originalFillTotalQty = fill.quantity;

      while (remainingToMatch > 0 && inventory.length > 0) {
        const entry = inventory[0];
        const matchQty = Math.min(entry.quantity, remainingToMatch);
        
        // Split entry if necessary
        matchedEntries.push({ ...entry, quantity: matchQty });
        
        // Corresponding exit part
        const exitPart: Fill = { 
          ...fill, 
          quantity: matchQty,
          fees: fill.fees * (matchQty / originalFillTotalQty) 
        };
        matchedExits.push(exitPart);

        entry.quantity -= matchQty;
        remainingToMatch -= matchQty;

        if (entry.quantity <= 0) {
          inventory.shift();
        }

        // When a round trip is completed
        if (remainingToMatch >= 0) {
           // This logic is simplified; in full FIFO, a trade is "built" once inventory hits zero or direction flips
        }
      }

      // Build trade from matched parts
      if (matchedEntries.length > 0) {
        trades.push(buildTrade(matchedEntries, matchedExits));
      }

      // If we reversed the position
      if (remainingToMatch > 0) {
        inventory.push({ ...fill, quantity: remainingToMatch });
      }
    } else {
      // Scale in or first position
      inventory.push({ ...fill });
    }
  });

  return trades;
};

const buildTrade = (entries: Fill[], exits: Fill[]): Trade => {
  const totalQty = entries.reduce((sum, e) => sum + e.quantity, 0);
  const entryCost = entries.reduce((sum, e) => sum + (e.price * e.quantity), 0);
  const exitValue = exits.reduce((sum, e) => sum + (e.price * e.quantity), 0);
  
  const avgEntry = entryCost / totalQty;
  const avgExit = exitValue / totalQty;
  
  const side = entries[0].side === FillSide.BUY ? TradeSide.LONG : TradeSide.SHORT;
  const totalFees = entries.reduce((sum, e) => sum + e.fees, 0) + exits.reduce((sum, e) => sum + e.fees, 0);
  
  const pnlGross = side === TradeSide.LONG 
    ? (avgExit - avgEntry) * totalQty 
    : (avgEntry - avgExit) * totalQty;
  
  const pnlNet = pnlGross - totalFees;

  return {
    id: crypto.randomUUID(),
    symbol: entries[0].symbol,
    side,
    openDatetime: entries[0].datetime,
    closeDatetime: exits[exits.length - 1].datetime,
    quantity: totalQty,
    avgEntryPrice: avgEntry,
    avgExitPrice: avgExit,
    fees: totalFees,
    pnlGross,
    pnlNet,
    legs: [...entries, ...exits]
  };
};

export const calculateAnalytics = (trades: Trade[]): AnalyticsSummary => {
  if (trades.length === 0) {
    return { totalPnl: 0, winRate: 0, profitFactor: 0, avgWin: 0, avgLoss: 0, expectancy: 0, maxDrawdown: 0, totalTrades: 0 };
  }

  const wins = trades.filter(t => t.pnlNet > 0);
  const losses = trades.filter(t => t.pnlNet <= 0);
  
  const totalPnl = trades.reduce((sum, t) => sum + t.pnlNet, 0);
  const winRate = wins.length / trades.length;
  
  const grossProfit = wins.reduce((sum, t) => sum + t.pnlNet, 0);
  const grossLoss = Math.abs(losses.reduce((sum, t) => sum + t.pnlNet, 0));
  
  const profitFactor = grossLoss === 0 ? grossProfit : grossProfit / grossLoss;
  
  const avgWin = wins.length > 0 ? grossProfit / wins.length : 0;
  const avgLoss = losses.length > 0 ? grossLoss / losses.length : 0;
  
  const expectancy = (winRate * avgWin) - ((1 - winRate) * avgLoss);

  // Simple Equity Curve & Max DD
  let equity = 0;
  let peak = 0;
  let maxDD = 0;
  [...trades].sort((a,b) => new Date(a.closeDatetime).getTime() - new Date(b.closeDatetime).getTime()).forEach(t => {
    equity += t.pnlNet;
    if (equity > peak) peak = equity;
    const dd = peak - equity;
    if (dd > maxDD) maxDD = dd;
  });

  return { totalPnl, winRate, profitFactor, avgWin, avgLoss, expectancy, maxDrawdown: maxDD, totalTrades: trades.length };
};
