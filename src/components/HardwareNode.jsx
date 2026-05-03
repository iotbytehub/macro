import { Handle, Position } from '@xyflow/react';
import { Cpu, Wifi, Zap, Database } from 'lucide-react';

// Maps the node type to a specific icon and color
const NODE_CONFIG = {
  controller: { icon: Cpu, color: 'text-blue-400', border: 'border-blue-500/50', bg: 'bg-blue-500/10' },
  sensor: { icon: Wifi, color: 'text-emerald-400', border: 'border-emerald-500/50', bg: 'bg-emerald-500/10' },
  action: { icon: Zap, color: 'text-amber-400', border: 'border-amber-500/50', bg: 'bg-amber-500/10' },
  cloud: { icon: Database, color: 'text-purple-400', border: 'border-purple-500/50', bg: 'bg-purple-500/10' },
};

export default function HardwareNode({ data }) {
  const config = NODE_CONFIG[data.type] || NODE_CONFIG.controller;
  const Icon = config.icon;

  return (
    <div className={`px-4 py-3 rounded-xl border bg-slate-900 shadow-xl min-w-[150px] ${config.border}`}>
      {/* Input Port (Left side) - Only show if it's not a controller */}
      {data.type !== 'controller' && (
        <Handle type="target" position={Position.Left} className="w-3 h-3 bg-slate-400 border-2 border-slate-900" />
      )}

      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${config.bg} ${config.color}`}>
          <Icon size={18} />
        </div>
        <div>
          <div className="text-xs font-bold text-white tracking-wide">{data.label}</div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{data.sublabel}</div>
        </div>
      </div>

      {/* Output Port (Right side) - Only show if it's not a cloud destination */}
      {data.type !== 'cloud' && (
        <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-500 border-2 border-slate-900" />
      )}
    </div>
  );
}