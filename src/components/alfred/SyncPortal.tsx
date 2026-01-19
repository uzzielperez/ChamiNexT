import React, { useState } from 'react';
import { RefreshCw, Globe, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { calendarService } from '../../services/alfred/calendar';

const SyncPortal: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [googleStatus, setGoogleStatus] = useState<'disconnected' | 'syncing' | 'connected'>('disconnected');
  const [icloudStatus, setIcloudStatus] = useState<'disconnected' | 'syncing' | 'connected'>('disconnected');

  const handleGoogleConnect = async () => {
    try {
      setGoogleStatus('syncing');
      const authUrl = await calendarService.getGoogleAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to get Google Auth URL:', error);
      setGoogleStatus('disconnected');
      alert('Backend not reachable. Ensure server is running on port 3001.');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-12">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black text-[#00d2ff] jarvis-glow-text tracking-tighter uppercase italic">
          Sync Portal
        </h2>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold text-[#00d2ff88] uppercase tracking-[0.4em]">External Temporal Bridging</span>
          <div className="h-[1px] w-24 bg-[#00d2ff22]"></div>
          <span className="text-[10px] text-emerald-500 font-mono animate-pulse">UPLINK_READY</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Google Calendar Panel */}
        <div className="jarvis-panel p-8 relative overflow-hidden group">
          <div className="scanning-line opacity-5"></div>
          <div className="flex justify-between items-center mb-8 border-b border-[#00d2ff22] pb-4">
            <div className="flex items-center gap-3">
              <Globe size={20} className="text-[#00d2ff]" />
              <h3 className="text-xs font-black text-[#00d2ff] uppercase tracking-[0.5em]">Google_Protocol</h3>
            </div>
            {googleStatus === 'connected' ? (
              <CheckCircle2 size={16} className="text-emerald-500" />
            ) : (
              <AlertCircle size={16} className="text-[#00d2ff22]" />
            )}
          </div>
          
          <p className="text-xs text-[#00d2ff88] leading-relaxed mb-8">
            Establish a neural link with Google Calendar. Alfred will analyze your schedule in Shadow Mode to optimize your tactical focus blocks.
          </p>

          <button
            onClick={handleGoogleConnect}
            disabled={googleStatus === 'syncing'}
            className={`w-full py-4 border border-[#00d2ff44] rounded-none text-[10px] font-black uppercase tracking-[0.3em] transition-all ${
              googleStatus === 'syncing' 
                ? 'bg-[#00d2ff11] text-[#00d2ff44] cursor-wait' 
                : 'hover:bg-[#00d2ff11] hover:text-[#00d2ff] active:scale-[0.98]'
            }`}
          >
            {googleStatus === 'syncing' ? 'Initializing_Handshake...' : 'Authorize_Uplink'}
          </button>
        </div>

        {/* iCloud Calendar Panel */}
        <div className="jarvis-panel p-8 relative overflow-hidden group">
          <div className="scanning-line opacity-5"></div>
          <div className="flex justify-between items-center mb-8 border-b border-[#00d2ff22] pb-4">
            <div className="flex items-center gap-3">
              <Lock size={20} className="text-[#00d2ff]" />
              <h3 className="text-xs font-black text-[#00d2ff] uppercase tracking-[0.5em]">iCloud_Vector</h3>
            </div>
            {icloudStatus === 'connected' ? (
              <CheckCircle2 size={16} className="text-emerald-500" />
            ) : (
              <AlertCircle size={16} className="text-[#00d2ff22]" />
            )}
          </div>

          <div className="space-y-4 mb-8">
            <div className="relative">
              <input 
                type="email" 
                placeholder="APPLE_ID_EMAIL"
                className="w-full bg-[#00d2ff05] border border-[#00d2ff22] p-3 text-[10px] font-mono text-[#00d2ff] focus:outline-none focus:border-[#00d2ff44]"
              />
            </div>
            <div className="relative">
              <input 
                type="password" 
                placeholder="APP_SPECIFIC_PASSWORD"
                className="w-full bg-[#00d2ff05] border border-[#00d2ff22] p-3 text-[10px] font-mono text-[#00d2ff] focus:outline-none focus:border-[#00d2ff44]"
              />
            </div>
          </div>

          <button
            disabled={true}
            className="w-full py-4 border border-[#00d2ff11] rounded-none text-[10px] font-black uppercase tracking-[0.3em] text-[#00d2ff11] cursor-not-allowed"
          >
            Encryption_Key_Required
          </button>
          <p className="text-[8px] text-[#00d2ff22] mt-4 text-center uppercase tracking-widest">CalDAV Protocol Under Development</p>
        </div>
      </div>

      <div className="jarvis-panel p-6 border-l-4 border-l-emerald-500">
        <div className="flex items-center gap-4">
          <RefreshCw size={24} className={isSyncing ? 'animate-spin' : ''} />
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest">Shadow Sync Status</h4>
            <p className="text-[10px] text-[#00d2ff88] font-mono mt-1">
              {googleStatus === 'disconnected' && icloudStatus === 'disconnected' 
                ? 'AWAITING_EXTERNAL_BRIDGE_INITIALIZATION' 
                : 'SYNCHRONIZING_TEMPORAL_DATA_NODES'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncPortal;
