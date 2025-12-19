
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Shell } from './components/layout/Shell';
import { Dashboard } from './pages/Dashboard';
import { Trades } from './pages/Trades';
import { ImportWizard } from './pages/ImportWizard';
import { Fill, Trade } from './types';
import { groupFillsFIFO } from './services/tradeEngine';

// Seed data for immediate visualization
const SEED_FILLS: Fill[] = [
  { id: '1', symbol: 'NVDA', side: 'buy' as any, quantity: 10, price: 750.50, fees: 1.5, datetime: '2024-03-01T14:30:00Z' },
  { id: '2', symbol: 'NVDA', side: 'sell' as any, quantity: 10, price: 785.20, fees: 1.5, datetime: '2024-03-01T16:00:00Z' },
  { id: '3', symbol: 'AAPL', side: 'buy' as any, quantity: 50, price: 170.00, fees: 2.0, datetime: '2024-03-02T14:45:00Z' },
  { id: '4', symbol: 'AAPL', side: 'sell' as any, quantity: 50, price: 168.50, fees: 2.0, datetime: '2024-03-02T15:30:00Z' },
  { id: '5', symbol: 'TSLA', side: 'buy' as any, quantity: 20, price: 175.00, fees: 1.0, datetime: '2024-03-03T14:30:00Z' },
  { id: '6', symbol: 'TSLA', side: 'sell' as any, quantity: 20, price: 185.00, fees: 1.0, datetime: '2024-03-03T20:00:00Z' },
];

const App: React.FC = () => {
  const [fills, setFills] = useState<Fill[]>(() => {
    const saved = localStorage.getItem('zen_fills');
    return saved ? JSON.parse(saved) : SEED_FILLS;
  });
  const [trades, setTrades] = useState<Trade[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const grouped = groupFillsFIFO(fills);
    setTrades(grouped);
    localStorage.setItem('zen_fills', JSON.stringify(fills));
  }, [fills]);

  const handleImport = (newFills: Fill[]) => {
    setFills(prev => [...prev, ...newFills]);
    navigate('/');
  };

  return (
    <Routes>
      <Route element={<Shell />}>
        <Route path="/" element={<Dashboard trades={trades} />} />
        <Route path="/trades" element={<Trades trades={trades} />} />
        <Route path="/import" element={<ImportWizard onImportComplete={handleImport} />} />
        <Route path="/analytics" element={<Dashboard trades={trades} />} />
        <Route path="/badges" element={<div className="text-center py-20 text-slate-500 uppercase tracking-widest">Achievements Coming Soon</div>} />
      </Route>
    </Routes>
  );
};

export default App;
