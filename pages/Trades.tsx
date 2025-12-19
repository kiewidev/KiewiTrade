
import React, { useState } from 'react';
import { GlassCard } from '../components/shared/GlassCard';
import { Trade, TradeSide } from '../types';
import { Filter, Search, MessageSquareCode, ExternalLink } from 'lucide-react';
import { analyzeTradePerformance } from '../services/geminiService';

interface TradesProps {
  trades: Trade[];
}

export const Trades: React.FC<TradesProps> = ({ trades }) => {
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (trade: Trade) => {
    setLoading(true);
    setAnalysis(null);
    setSelectedTrade(trade);
    const result = await analyzeTradePerformance(trade);
    setAnalysis(result || "No analysis could be generated.");
    setLoading(false);
  };

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extralight text-slate-900 mb-4 tracking-tight">Trade Journal</h2>
          <p className="text-slate-400 text-sm font-normal">Every tick matters. Review your history to find the signal in the noise.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-indigo-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search ticker..." 
              className="pl-10 pr-6 py-2.5 rounded-full bg-slate-50 border-none text-xs focus:ring-1 focus:ring-indigo-100 transition-all outline-none w-48 font-medium placeholder:text-slate-300"
            />
          </div>
          <button className="p-3 rounded-full border border-slate-100 text-slate-400 hover:text-indigo-500 transition-all">
            <Filter size={14} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3">
          <GlassCard className="!p-0 border-none shadow-none bg-transparent">
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">
                <tr>
                  <th className="px-6 py-4">Ticker</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Closure</th>
                  <th className="px-6 py-4 text-right">Net PnL</th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade) => (
                  <tr key={trade.id} className="bg-white rounded-3xl group cursor-pointer transition-all hover:translate-x-1 duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.03)]">
                    <td className="px-6 py-5 rounded-l-[2rem]">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 text-sm">{trade.symbol}</span>
                        <span className="text-[10px] text-slate-400 font-medium">Vol {trade.quantity}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${trade.pnlNet >= 0 ? 'bg-emerald-50/30 text-emerald-600 border-emerald-100/50' : 'bg-rose-50/30 text-rose-500 border-rose-100/50'}`}>
                        {trade.pnlNet >= 0 ? 'Profit' : 'Loss'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[11px] text-slate-500 font-normal">
                        {new Date(trade.closeDatetime).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                      </span>
                    </td>
                    <td className={`px-6 py-5 text-right font-light text-sm ${trade.pnlNet >= 0 ? 'text-indigo-500' : 'text-slate-400'}`}>
                      {trade.pnlNet >= 0 ? '+' : ''}{trade.pnlNet.toFixed(2)}
                    </td>
                    <td className="px-6 py-5 text-right rounded-r-[2rem]">
                      <button 
                        onClick={() => handleAnalyze(trade)}
                        className="p-2.5 rounded-xl bg-slate-50 text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all duration-500"
                      >
                        <MessageSquareCode size={16} strokeWidth={1.5} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </div>

        <div className="space-y-8">
          <GlassCard title="Zen Assistant">
            {selectedTrade ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xl font-light text-slate-900">{selectedTrade.symbol}</span>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">Deep Analysis</p>
                  </div>
                  <ExternalLink size={14} className="text-slate-200 cursor-pointer hover:text-indigo-400" />
                </div>
                
                {loading ? (
                  <div className="space-y-4 py-8">
                    <div className="h-3 w-full bg-slate-50 animate-pulse rounded-full" />
                    <div className="h-3 w-5/6 bg-slate-50 animate-pulse rounded-full" />
                    <div className="h-3 w-4/6 bg-slate-50 animate-pulse rounded-full" />
                  </div>
                ) : (
                  <div className="text-[13px] text-slate-500 font-light leading-relaxed space-y-4 whitespace-pre-wrap">
                    {analysis}
                  </div>
                )}
                
                <div className="pt-6 border-t border-slate-50">
                  <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-3">Stats</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded-2xl">
                      <div className="text-[8px] text-slate-400 uppercase font-bold mb-1">Entry</div>
                      <div className="text-xs font-medium text-slate-800">${selectedTrade.avgEntryPrice.toFixed(2)}</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl">
                      <div className="text-[8px] text-slate-400 uppercase font-bold mb-1">Exit</div>
                      <div className="text-xs font-medium text-slate-800">${selectedTrade.avgExitPrice.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-24 px-4">
                <div className="h-12 w-12 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200">
                  <MessageSquareCode size={24} strokeWidth={1} />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                  Select an execution to receive AI-driven behavioral coaching.
                </p>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
