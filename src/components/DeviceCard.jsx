import { useState } from 'react';
import { Activity, Cpu, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../api/axios';

export default function DeviceCard({ device }) {
  const [isOn, setIsOn] = useState(device.config?.pin_state || false);
  const [isLoading, setIsLoading] = useState(false);

  // --- HEARTBEAT LOGIC ---
  // Compare last_ping to current time. If older than 5 mins (300,000ms), it's offline.
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

  const handleToggle = async () => {
    const previousState = isOn;
    setIsOn(!isOn);
    setIsLoading(true);

    try {
      const response = await api.post(`fleet/devices/${device.id}/toggle/`, { state: !isOn });
      if (response.data.status !== 'success') throw new Error();
      
      toast.success(`${device.name} turned ${!isOn ? 'ON' : 'OFF'}`);
    } catch (error) {
      toast.error('Device Offline. Command Failed.');
      setIsOn(previousState);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border border-slate-800 bg-slate-900 rounded-xl p-5 hover:border-slate-700 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            {isActuallyOnline && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isActuallyOnline ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
          </span>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {isActuallyOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded text-xs font-mono text-slate-300">
          <Cpu size={14} />
          {device.device_type}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">{device.name}</h3>
        <p className="text-xs text-slate-500 mt-1">{timeAgoText}</p>
        
        {/* Copy to Clipboard Utility */}
        <div className="flex items-center gap-2 mt-2 group w-fit cursor-pointer" onClick={copyToClipboard}>
          <p className="text-xs text-slate-600 font-mono truncate max-w-[200px]">{device.id}</p>
          <Copy size={12} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-800">
        <div className="text-sm text-slate-400 flex items-center gap-2">
          <Activity size={16} />
          <span>Pin State</span>
        </div>
        <button
          onClick={handleToggle}
          disabled={!isActuallyOnline || isLoading}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none 
            ${isOn ? 'bg-blue-600' : 'bg-slate-700'}
            ${(!isActuallyOnline || isLoading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isOn ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
    </div>
  );
}