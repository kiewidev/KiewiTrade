
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", title }) => {
  return (
    <div className={`bg-white rounded-[3rem] p-10 border border-zinc-50 shadow-[0_2px_20px_rgba(0,0,0,0.01)] transition-all duration-1000 hover:shadow-[0_12px_40px_rgba(0,0,0,0.03)] ${className}`}>
      {title && (
        <h3 className="text-[9px] font-bold text-zinc-300 uppercase tracking-[0.3em] mb-10 pb-4 border-b border-zinc-50">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};
