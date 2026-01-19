import React from 'react';
import { Calendar, DollarSign, Mail, Target, Crosshair } from 'lucide-react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import StatCard from './StatCard';
import { spendingData, calendarDensity } from './data';
import type { CalendarEvent } from './data';

interface DashboardProps {
  liveEvents?: CalendarEvent[];
}

const Dashboard: React.FC<DashboardProps> = ({ liveEvents = [] }) => {
  const today = new Date().toDateString();
  const todayEvents = liveEvents.filter(e => e.start && new Date(e.start).toDateString() === today);
  const eventCount = todayEvents.length || 21; 
  const eventHours = todayEvents.reduce((acc, e) => {
    if (!e.start || !e.end) return acc;
    const duration = new Date(e.end).getTime() - new Date(e.start).getTime();
    return acc + (duration / (1000 * 60 * 60));
  }, 0) || 16.5;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 relative pb-20">
      <div className="absolute top-0 right-0 p-8 text-[#00d2ff11] pointer-events-none">
        <Crosshair size={300} strokeWidth={0.5} className="rotate-45" />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-12">
        <div className="relative">
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-[#00d2ff]"></div>
          <h2 className="text-5xl font-black text-[#00d2ff] jarvis-glow-text tracking-tighter uppercase italic">
            Tactical Overview
          </h2>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-xs font-bold text-[#00d2ff88] uppercase tracking-[0.4em]">SYSTEM_READY // PROTOCOL_V4</span>
            <div className="h-[1px] w-24 bg-[#00d2ff22]"></div>
            <span className="text-[10px] text-emerald-500 font-mono animate-pulse">SYSTEMS_OPTIMAL_100%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Calendar} 
          label="Operational Schedule" 
          value={`${eventCount} ENGAGEMENTS`} 
          subValue={`${eventHours.toFixed(1)} HOURS COMMITTED`} 
          colorClass="text-[#00d2ff]"
        />
        <StatCard 
          icon={DollarSign} 
          label="Resource Allocation" 
          value="$3,340.00" 
          subValue="+15.2% VARIANCE" 
          colorClass="text-[#00d2ff]"
        />
        <StatCard 
          icon={Mail} 
          label="Inbound Comms" 
          value="47 PACKETS" 
          subValue="12 CRITICAL PRIORITY" 
          colorClass="text-[#00d2ff]"
        />
        <StatCard 
          icon={Target} 
          label="Routine Efficiency" 
          value="63.0% INDEX" 
          subValue="STREAK_ACTIVE_05_DAYS" 
          colorClass="text-[#00d2ff]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="jarvis-panel p-8 relative overflow-hidden group">
          <div className="scanning-line opacity-5"></div>
          <div className="flex justify-between items-center mb-8 border-b border-[#00d2ff22] pb-4">
            <h3 className="text-xs font-black text-[#00d2ff] uppercase tracking-[0.5em]">Sector_Expenditure_Analysis</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={spendingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="amount"
                  stroke="none"
                >
                  {spendingData.map((_entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill="#00d2ff" 
                      fillOpacity={0.1 + (index * 0.15)}
                      stroke="#00d2ff44"
                      strokeWidth={1}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000814', border: '1px solid #00d2ff44', borderRadius: '4px', fontSize: '10px', color: '#00d2ff' }}
                  itemStyle={{ color: '#00d2ff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="jarvis-panel p-8 relative overflow-hidden">
          <div className="flex justify-between items-center mb-8 border-b border-[#00d2ff22] pb-4">
            <h3 className="text-xs font-black text-[#00d2ff] uppercase tracking-[0.5em]">Temporal_Density_Matrix</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calendarDensity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#00d2ff11" vertical={false} />
                <XAxis dataKey="day" stroke="#00d2ff44" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} dy={10} />
                <YAxis stroke="#00d2ff44" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <Tooltip 
                  cursor={{fill: '#00d2ff08'}}
                  contentStyle={{ backgroundColor: '#000814', border: '1px solid #00d2ff44', borderRadius: '4px' }}
                />
                <Bar dataKey="meetings" fill="#00d2ff88" radius={[2, 2, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
