import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  subValue: string;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, subValue }) => {
  return (
    <div className="jarvis-panel group relative overflow-hidden p-5 transition-all duration-300 hover:scale-[1.02] hover:bg-[#00d2ff08]">
      <div className="scanning-line opacity-10"></div>
      
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 border border-[#00d2ff44] rounded-lg bg-[#00d2ff05] text-[#00d2ff]">
          <Icon size={18} className="animate-pulse" />
        </div>
        <div className="text-[10px] text-[#00d2ff44] font-mono tracking-tighter uppercase">ID: {Math.random().toString(16).slice(2, 8)}</div>
      </div>

      <div className="space-y-1">
        <span className="text-[10px] font-bold text-[#00d2ff88] uppercase tracking-[0.2em]">{label}</span>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-black text-[#00d2ff] jarvis-glow-text tracking-tight">{value}</p>
        </div>
        <p className="text-[10px] text-[#00d2ff44] font-medium uppercase tracking-widest">{subValue}</p>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00d2ff44] to-transparent"></div>
    </div>
  );
};

export default StatCard;
