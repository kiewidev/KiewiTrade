
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, TableProperties, FileUp, Settings, Trophy, PieChart, Sparkles } from 'lucide-react';

export const Shell: React.FC = () => {
  const navItems = [
    { to: '/', icon: <LayoutDashboard size={18} strokeWidth={1.2} />, label: 'Dashboard' },
    { to: '/trades', icon: <TableProperties size={18} strokeWidth={1.2} />, label: 'Journal' },
    { to: '/analytics', icon: <PieChart size={18} strokeWidth={1.2} />, label: 'Analysis' },
    { to: '/import', icon: <FileUp size={18} strokeWidth={1.2} />, label: 'Sync' },
    { to: '/badges', icon: <Trophy size={18} strokeWidth={1.2} />, label: 'Achievements' },
  ];

  return (
    <div className="flex h-screen bg-white overflow-hidden font-light">
      {/* Sidebar with isolated item states to fix "white bleed" bug */}
      <aside className="w-64 border-r border-zinc-100 bg-white/50 backdrop-blur-xl flex flex-col z-20">
        <div className="px-8 py-12">
          <h1 className="text-sm font-extralight tracking-[0.4em] text-zinc-900 flex items-center gap-1">
            KIEWI <span className="font-normal text-indigo-400">TRADE</span>
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                relative flex items-center gap-4 px-4 py-3 rounded-2xl nav-item-transition group
                ${isActive 
                  ? 'bg-zinc-50/80 text-indigo-500' 
                  : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50/30'}
              `}
            >
              {({ isActive }) => (
                <>
                  <span className={`${isActive ? 'text-indigo-400' : 'text-zinc-300 group-hover:text-zinc-600'} transition-colors duration-300`}>
                    {item.icon}
                  </span>
                  <span className="text-[12px] font-normal tracking-wide">{item.label}</span>
                  {isActive && (
                    <div className="absolute right-4 w-1 h-1 rounded-full bg-indigo-400" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 space-y-6">
          <div className="p-5 rounded-[2rem] bg-indigo-50/20 border border-indigo-100/30">
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <Sparkles size={12} strokeWidth={2} />
              <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Context</span>
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed font-normal">
              Optimal performance detected on high volatility sessions.
            </p>
          </div>
          <button className="flex items-center gap-3 px-4 py-2 text-zinc-400 hover:text-zinc-900 transition-colors w-full text-[11px] font-medium uppercase tracking-widest">
            <Settings size={14} strokeWidth={1.2} />
            Options
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 flex items-center justify-between px-16 bg-white/10 backdrop-blur-md border-b border-zinc-50 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-[0.3em]">Institutional Grade Tools</span>
          </div>
          
          <div className="flex items-center gap-10">
            <div className="flex flex-col items-end gap-1">
              <span className="text-[8px] text-zinc-400 uppercase font-bold tracking-widest">P&L (YTD)</span>
              <span className="text-sm font-light text-zinc-900 tabular-nums">+$42,120.00</span>
            </div>
            <div className="h-9 w-9 rounded-full border border-zinc-100 bg-white shadow-sm flex items-center justify-center text-[10px] font-bold text-zinc-400">
              KT
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-16 pb-16 pt-8 scroll-smooth">
          <div className="max-w-5xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};
