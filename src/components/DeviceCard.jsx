import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Cpu, Copy, Trash2, PenTool, Gauge, ToggleRight, SlidersHorizontal, LineChart, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../api/axios';

export default function DeviceCard({ device, onRefresh, onDesignCanvas, onAutomation }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [controlStates, setControlStates] = useState({});

  const lastPingDate = new Date(device.last_ping);
  const diffMinutes = Math.floor((new Date() - lastPingDate) / 60000);
  const isActuallyOnline = device.is_online && diffMinutes < 5;
  
  let timeAgoText = "Never connected";
  if (device.last_ping) {
    if (diffMinutes === 0) timeAgoText = "Last seen: Just now";
    else if (diffMinutes < 60) timeAgoText = `Last seen: ${diffMinutes} min ago`;
    else timeAgoText = `Last seen: ${Math.floor(diffMinutes / 60)} hrs ago`;
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(device.id);
    toast.success('UUID Copied to clipboard');
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${device.name}? This will destroy its blueprint.`)) return;
    setIsLoading(true);
    try {
      await api.delete(`fleet/devices/${device.id}/`);
      toast.success(`${device.name} deleted successfully.`);
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error('Failed to delete device.');
      setIsLoading(false);
    }
  };

  const handleControlChange = (limbId, newValue) => {
    setControlStates(prev => ({ ...prev, [limbId]: newValue }));
    toast.success(`Command queued: ${newValue}`, { id: 'control-toast' });
  };

  // --- THE UPGRADED BLUEPRINT RENDERER ---
  const renderLimb = (limb) => {
    // 1. TOGGLE SWITCHES (Relays, Lights)
    if (limb.ui_element === 'toggle') {
      const isOn = controlStates[limb.id] || false;
      return (
        <div key={limb.id} className="flex justify-between items-center py-2.5 border-b border-slate-200 last:border-0">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <ToggleRight size={16} className="text-emerald-500" />
            <span>{limb.display_name}</span>
          </div>
          <button
            onClick={() => handleControlChange(limb.id, !isOn)}
            disabled={!isActuallyOnline || isLoading}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors 
              ${isOn ? 'bg-emerald-500' : 'bg-slate-300'}
              ${(!isActuallyOnline || isLoading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isOn ? 'translate-x-5' : 'translate-x-1'}`} />
          </button>
        </div>
      );
    }

    // 2. SPEED / INTENSITY SLIDERS (Motors, PWM)
    if (limb.ui_element === 'slider') {
      const val = controlStates[limb.id] || 0;
      return (
        <div key={limb.id} className="flex flex-col gap-2 py-3 border-b border-slate-200 last:border-0">
          <div className="flex justify-between items-center text-sm text-slate-700">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-amber-400" />
              <span>{limb.display_name}</span>
            </div>
            <span className="text-xs font-mono bg-amber-100 px-2 py-0.5 rounded text-amber-600">{val}%</span>
          </div>
          <input 
            type="range" min="0" max="100" value={val}
            className="w-full accent-amber-500 bg-slate-200 rounded-lg appearance-none h-1.5 cursor-pointer"
            disabled={!isActuallyOnline}
            onChange={(e) => handleControlChange(limb.id, e.target.value)}
          />
        </div>
      );
    }

    // 3. LIVE GRAPHS (Power Monitors, High-Freq Data)
    if (limb.ui_element === 'graph') {
      return (
        <div key={limb.id} className="flex flex-col gap-2 py-3 border-b border-slate-200 last:border-0">
          <div className="flex justify-between items-center text-sm text-slate-700">
            <div className="flex items-center gap-2">
              <LineChart size={16} className="text-purple-400" />
              <span>{limb.display_name}</span>
            </div>
            <span className="text-xs font-mono text-purple-400">Live</span>
          </div>
          {/* A cool CSS-only placeholder for a live sparkline graph */}
          <div className="h-10 w-full flex items-end justify-between gap-1 mt-1 opacity-70">
            {[40, 65, 45, 80, 55, 90, 75, 100, 60, 85].map((height, i) => (
              <div key={i} className="w-full bg-purple-500/20 rounded-t-sm" style={{ height: `${height}%` }}>
                <div className="w-full bg-purple-400 h-0.5" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 4. SIMPLE GAUGES (Temperature, Humidity)
    if (limb.ui_element === 'gauge') {
      return (
        <div key={limb.id} className="flex justify-between items-center py-2.5 border-b border-slate-200 last:border-0">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <Gauge size={16} className="text-blue-400" />
            <span>{limb.display_name}</span>
          </div>
          <span className="text-sm font-mono text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">
            -- 
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="group relative border border-[#E2E8F0] bg-white/80 backdrop-blur-md rounded-2xl p-6 hover:border-[#0EA5E9]/40 transition-all duration-500 flex flex-col h-full shadow-lg hover:shadow-[#0EA5E9]/15 hover:-translate-y-1 overflow-hidden">
      {/* Animated gradient border effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      {/* Status indicator with enhanced animation */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="relative flex h-4 w-4">
              {isActuallyOnline && (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-50"></span>
                </>
              )}
              <span className={`relative inline-flex rounded-full h-4 w-4 ${isActuallyOnline ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' : 'bg-rose-500'}`}></span>
            </span>
          </div>
          <span className={`text-sm font-semibold uppercase tracking-wider ${isActuallyOnline ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isActuallyOnline ? '● Online' : '● Offline'}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100/80 px-3 py-1.5 rounded-full text-xs font-mono text-slate-600 border border-slate-200">
            <Cpu size={14} className="text-cyan-400" />
            {device.device_type}
          </div>
          <button 
            onClick={handleDelete} 
            className="p-2 text-slate-500 hover:text-rose-400 transition-all duration-300 hover:bg-rose-500/10 rounded-lg group/delete" 
            title="Delete Device"
          >
            <Trash2 size={14} className="group-hover/delete:rotate-12 transition-transform duration-200" />
          </button>
        </div>
      </div>

      {/* Device info with enhanced typography */}
      <div className="mb-6 relative z-10">
        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-[#0EA5E9] transition-colors duration-300">{device.name}</h3>
        <p className="text-sm text-slate-400 mb-3 font-mono">{timeAgoText}</p>
        <div className="flex items-center gap-2 group/copy w-fit cursor-pointer p-2 rounded-lg hover:bg-slate-800/50 transition-all duration-300" onClick={copyToClipboard}>
          <p className="text-xs text-slate-500 font-mono truncate max-w-[200px] group-hover/copy:text-slate-400 transition-colors">{device.id}</p>
          <Copy size={12} className="text-slate-600 opacity-0 group-hover/copy:opacity-100 transition-all duration-300 group-hover/copy:scale-110" />
        </div>
      </div>

      {/* Enhanced control panel */}
      <div className="flex-1 bg-slate-50/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200 mb-6 overflow-y-auto min-h-[140px] relative z-10">
        {!device.blueprint ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="relative mb-4">
              <Activity size={32} className="text-slate-600 animate-pulse" />
              <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-xl animate-ping"></div>
            </div>
            <p className="text-slate-400 font-medium mb-2">No architecture defined</p>
            <p className="text-xs text-slate-500">Design the hardware to see controls</p>
          </div>
        ) : (
          <div className="flex flex-col space-y-1">
            {device.blueprint.architecture.limbs.map(renderLimb)}
          </div>
        )}
      </div>

      {/* Enhanced action buttons */}
      <div className="pt-4 border-t border-slate-200 mt-auto relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <button
            onClick={onDesignCanvas}
            className="group/btn flex-1 flex items-center justify-center gap-3 bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-sm py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-[#0EA5E9]/25 hover:-translate-y-0.5"
          >
            <PenTool size={16} className="group-hover/btn:rotate-12 transition-transform duration-200" />
            {device.blueprint ? 'Edit Architecture' : 'Design Hardware'}
          </button>
          <button
            onClick={onAutomation}
            className="group/btn flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400 text-white text-sm py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5"
          >
            <Zap size={16} className="group-hover/btn:animate-pulse" />
            Automation Rules
          </button>
          <button
            onClick={() => navigate(`/devices/${device.id}/analytics`)}
            className="group/btn flex-1 flex items-center justify-center gap-3 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 text-sm py-3 rounded-xl transition-all duration-300 font-semibold hover:scale-105 backdrop-blur-sm"
          >
            <Activity size={16} className="group-hover/btn:animate-spin" style={{ animationDuration: '2s' }} />
            Analytics
          </button>
        </div>
      </div>
    </div>
  );
}