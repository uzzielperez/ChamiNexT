import React from 'react';
import { Cpu, Zap, Shield, Activity, LayoutGrid, RefreshCw } from 'lucide-react';

interface SidebarProps {
  activeView: 'dashboard' | 'chat' | 'kanban' | 'sync';
  setActiveView: (view: 'dashboard' | 'chat' | 'kanban' | 'sync') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <div className="w-20 lg:w-64 h-full bg-[#000814] border-r border-[#00d2ff22] flex flex-col items-center py-8 relative">
      <div className="mb-12 relative group">
        <div className="w-12 h-12 rounded-full border-2 border-[#00d2ff] flex items-center justify-center relative animate-[spin_10s_linear_infinite]">
          <div className="w-8 h-8 rounded-full border border-[#00d2ff44] animate-[ping_2s_linear_infinite]"></div>
          <Cpu className="absolute text-[#00d2ff] group-hover:scale-110 transition-transform" size={24} />
        </div>
        <div className="hidden lg:block absolute left-16 top-2 ml-2">
          <h1 className="text-xl font-bold tracking-[0.2em] jarvis-glow-text uppercase">Alfred</h1>
          <p className="text-[8px] text-[#00d2ff88] uppercase tracking-[0.3em]">System.OS.v4.0</p>
        </div>
      </div>

      <nav className="flex-1 space-y-8 w-full px-4">
        <button
          onClick={() => setActiveView('dashboard')}
          className={`w-full flex flex-col lg:flex-row items-center gap-3 p-3 rounded-lg transition-all duration-300 group ${
            activeView === 'dashboard' 
              ? 'bg-[#00d2ff11] text-[#00d2ff] border border-[#00d2ff44] shadow-[0_0_15px_rgba(0,210,255,0.2)]' 
              : 'text-[#00d2ff44] hover:text-[#00d2ffaa]'
          }`}
        >
          <Activity size={20} />
          <span className="text-[10px] lg:text-xs font-bold uppercase tracking-widest hidden lg:block">Tactical</span>
        </button>

        <button
          onClick={() => setActiveView('kanban')}
          className={`w-full flex flex-col lg:flex-row items-center gap-3 p-3 rounded-lg transition-all duration-300 group ${
            activeView === 'kanban' 
              ? 'bg-[#00d2ff11] text-[#00d2ff] border border-[#00d2ff44] shadow-[0_0_15px_rgba(0,210,255,0.2)]' 
              : 'text-[#00d2ff44] hover:text-[#00d2ffaa]'
          }`}
        >
          <LayoutGrid size={20} />
          <span className="text-[10px] lg:text-xs font-bold uppercase tracking-widest hidden lg:block">Strategic</span>
        </button>

        <button
          onClick={() => setActiveView('chat')}
          className={`w-full flex flex-col lg:flex-row items-center gap-3 p-3 rounded-lg transition-all duration-300 group ${
            activeView === 'chat' 
              ? 'bg-[#00d2ff11] text-[#00d2ff] border border-[#00d2ff44] shadow-[0_0_15px_rgba(0,210,255,0.2)]' 
              : 'text-[#00d2ff44] hover:text-[#00d2ffaa]'
          }`}
        >
          <Zap size={20} />
          <span className="text-[10px] lg:text-xs font-bold uppercase tracking-widest hidden lg:block">Neural Link</span>
        </button>

        <button
          onClick={() => setActiveView('sync')}
          className={`w-full flex flex-col lg:flex-row items-center gap-3 p-3 rounded-lg transition-all duration-300 group ${
            activeView === 'sync' 
              ? 'bg-[#00d2ff11] text-[#00d2ff] border border-[#00d2ff44] shadow-[0_0_15px_rgba(0,210,255,0.2)]' 
              : 'text-[#00d2ff44] hover:text-[#00d2ffaa]'
          }`}
        >
          <RefreshCw size={20} />
          <span className="text-[10px] lg:text-xs font-bold uppercase tracking-widest hidden lg:block">Sync Portal</span>
        </button>
      </nav>

      <div className="mt-auto px-4 w-full">
        <div className="lg:jarvis-panel p-3 rounded-xl border border-[#00d2ff22] text-center lg:text-left overflow-hidden">
          <div className="flex items-center justify-center lg:justify-start gap-2 text-[#00d2ff] mb-1">
            <Shield size={14} className="animate-pulse" />
            <span className="text-[8px] font-bold uppercase tracking-widest hidden lg:block">Secured</span>
          </div>
          <div className="hidden lg:block">
             <div className="w-full h-1 bg-[#00d2ff11] rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-[#00d2ff] animate-[shimmer_2s_infinite]"></div>
             </div>
             <p className="text-[8px] text-[#00d2ff66] mt-2 uppercase tracking-tighter">Encrypted Local Stack</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
