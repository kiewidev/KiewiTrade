
import React, { useMemo } from 'react';
import { GlassCard } from '../components/shared/GlassCard';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Target, ShieldCheck, Zap, ArrowUpRight } from 'lucide-react';
import { Trade, AnalyticsSummary } from '../types';
import { calculateAnalytics } from '../services/tradeEngine';

interface DashboardProps {
  trades: Trade[];
}

export const Dashboard: React.FC<DashboardProps> = ({ trades }) => {
  const analytics = useMemo(() => calculateAnalytics(trades), [trades]);

  const equityData = useMemo(() => {
    let balance = 0;
    return trades
      .sort((a, b) => new Date(a.closeDatetime).getTime() - new Date(b.closeDatetime).getTime())
      .map((t, i) => {
        balance += t.pnlNet;
        return {
          name: i + 1,
          pnl: balance,
        };
      });
  }, [trades]);

  const stats = [
    { label: 'Net Profit', value: `$${analytics.totalPnl.toFixed(2)}`, icon: <TrendingUp size={16} />, color: 'indigo' },
    { label: 'Success Rate', value: `${(analytics.winRate * 100).toFixed(0)}%`, icon: <Target size={16} />, color: 'emerald' },
    { label: 'Risk Factor', value: analytics.profitFactor.toFixed(2), icon: <ShieldCheck size={16} />, color: 'amber' },
    { label: 'Frequency', value: analytics.totalTrades.toString(), icon: <Zap size={16} />, color: 'rose' },
  ];

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-start">
        <div className="max-w-xl">
          <h2 className="text-4xl font-extralight text-slate-900 mb-4 tracking-tight">Performance Flow</h2>
          <p className="text-slate-400 text-sm font-normal leading-relaxed">
            Your execution rhythm is stable. We noticed high conviction on long entries this week.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-[11px] font-medium tracking-widest uppercase flex items-center gap-2 shadow-xl shadow-slate-900/10">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Active Session
          </div>
        </div>
      </header>

      {/* Minimal KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="group cursor-default">
            <div className="mb-3 flex items-center justify-between">
              <div className={`p-2 rounded-xl bg-slate-50 text-slate-400 group-hover:text-indigo-500 group-hover:bg-indigo-50 transition-all duration-500`}>
                {stat.icon}
              </div>
              <ArrowUpRight size={14} className="text-slate-200 group-hover:text-indigo-300 transition-colors" />
            </div>
            <div className="text-3xl font-light text-slate-900 mb-1">{stat.value}</div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.15em]">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <GlassCard title="Equity Curve">
            <div className="h-[350px] w-full mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={equityData}>
                  <defs>
                    <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.08}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                      dataKey="name" 
                      stroke="#94a3b8" 
                      fontSize={9} 
                      tickLine={false} 
                      axisLine={false}
                      dy={10}
                  />
                  <YAxis 
                      stroke="#94a3b8" 
                      fontSize={9} 
                      tickLine={false} 
                      axisLine={false}
                      dx={-10}
                      tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip 
                    cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255,255,255,0.9)', 
                      border: 'none', 
                      borderRadius: '16px', 
                      boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                      fontSize: '11px',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                  <Area 
                    type="natural" 
                    dataKey="pnl" 
                    stroke="#6366f1" 
                    fillOpacity={1} 
                    fill="url(#curveGradient)" 
                    strokeWidth={2}
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        <GlassCard title="Latest Executions">
          <div className="space-y-8 mt-4">
            {trades.slice(0, 5).map((trade) => (
              <div key={trade.id} className="flex items-center justify-between group">
                <div className="flex flex-col gap-1">
                  <div className="text-sm font-medium text-slate-800 flex items-center gap-2">
                    {trade.symbol}
                    <span className="text-[9px] text-slate-300 font-bold border border-slate-100 px-1 rounded uppercase tracking-tighter">
                      {trade.side}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    {new Date(trade.closeDatetime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div className={`text-sm font-light ${trade.pnlNet >= 0 ? 'text-indigo-500' : 'text-slate-400'}`}>
                  {trade.pnlNet >= 0 ? '+' : ''}{trade.pnlNet.toFixed(2)}
                </div>
              </div>
            ))}
            <button className="w-full py-4 rounded-2xl text-[10px] font-bold text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 transition-all uppercase tracking-widest border border-slate-50 mt-4">
              Explore History
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
