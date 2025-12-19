
import React, { useState } from 'react';
import { GlassCard } from '../components/shared/GlassCard';
import { Upload, FileText, CheckCircle2, AlertCircle, FilePlus } from 'lucide-react';
import { Fill, FillSide } from '../types';

interface ImportWizardProps {
  onImportComplete: (fills: Fill[]) => void;
}

export const ImportWizard: React.FC<ImportWizardProps> = ({ onImportComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processCSV = (content: string) => {
    try {
      const lines = content.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const fills: Fill[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const cols = lines[i].split(',');
        const row: any = {};
        headers.forEach((h, idx) => row[h] = cols[idx]?.trim());
        
        fills.push({
          id: crypto.randomUUID(),
          symbol: row.symbol || row.asset || 'UNKNOWN',
          side: (row.side || '').toLowerCase().includes('buy') ? FillSide.BUY : FillSide.SELL,
          quantity: parseFloat(row.quantity || row.qty || '0'),
          price: parseFloat(row.price || '0'),
          fees: parseFloat(row.fees || row.commission || '0'),
          datetime: row.datetime || row.date || new Date().toISOString()
        });
      }
      
      onImportComplete(fills);
      setLoading(false);
    } catch (err) {
      setError("Parsing error. Verify Symbol, Side, Quantity, Price, DateTime columns.");
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    setError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      processCSV(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12 py-8">
      <header className="text-center space-y-4">
        <h2 className="text-4xl font-extralight text-slate-900 tracking-tight">Expand Dataset</h2>
        <p className="text-slate-400 text-sm max-w-sm mx-auto font-normal leading-relaxed">
          Sync your broker history to maintain your analytical flow.
        </p>
      </header>

      <div className="bg-white rounded-[3rem] p-4 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
        <div className={`rounded-[2.5rem] border-2 border-dashed transition-all duration-700 p-2 ${loading ? 'border-indigo-100' : 'border-slate-50 hover:border-indigo-100'}`}>
          <label className="w-full flex flex-col items-center cursor-pointer py-24 group">
            <div className="h-16 w-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-indigo-50 transition-all duration-500 group-hover:scale-110">
              <FilePlus size={28} className="text-slate-300 group-hover:text-indigo-400 transition-colors" strokeWidth={1.5} />
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="h-6 w-6 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Syncing...</span>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <span className="text-sm font-light text-slate-800 block">Drop export file here</span>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Supports .csv standard</span>
              </div>
            )}
            <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
          </label>
        </div>
      </div>

      {error && (
        <div className="p-6 rounded-3xl bg-rose-50 text-rose-500 text-xs font-medium flex items-center gap-4 animate-fade-in">
          <AlertCircle size={18} strokeWidth={2} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Auto-Matching', 'Fee Deduction', 'Duplicate Shield'].map(feature => (
          <div key={feature} className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100/50 flex flex-col items-center text-center gap-3">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
