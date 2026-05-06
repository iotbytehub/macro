import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Cpu, Activity, Zap, Database, Monitor, Radio, X } from 'lucide-react';

// Expanded Professional Library
const NODE_CONFIG = {
  controller: { icon: Cpu, color: 'text-blue-400', border: 'border-blue-500/50', bg: 'bg-blue-500/10' },
  sensor: { icon: Activity, color: 'text-emerald-400', border: 'border-emerald-500/50', bg: 'bg-emerald-500/10' },
  action: { icon: Zap, color: 'text-amber-400', border: 'border-amber-500/50', bg: 'bg-amber-500/10' },
  cloud: { icon: Database, color: 'text-purple-400', border: 'border-purple-500/50', bg: 'bg-purple-500/10' },
  display: { icon: Monitor, color: 'text-cyan-400', border: 'border-cyan-500/50', bg: 'bg-cyan-500/10' },
  comms: { icon: Radio, color: 'text-indigo-400', border: 'border-indigo-500/50', bg: 'bg-indigo-500/10' },
};

export default function HardwareNode({ id, data }) {
  // Grab the React Flow instance to allow self-deletion
  const { setNodes, setEdges } = useReactFlow();

  const config = NODE_CONFIG[data.type] || NODE_CONFIG.controller;
  const Icon = config.icon;

  // Function to delete this specific node and its connected wires cleanly
  const handleDelete = () => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
  };

  // --- NEW: Helper function to map 3 pins to any side of the box ---
  const renderPins = (sideName, position, type, colorClass) => {
    return [25, 50, 75].map((percent, index) => {
      // Determine if pin spacing should be vertical or horizontal
      const isVertical = position === Position.Left || position === Position.Right;
      const style = isVertical ? { top: `${percent}%` } : { left: `${percent}%` };
      
      return (
        <Handle
          key={`${sideName}-${index}`}
          type={type}
          position={position}
          id={`${sideName}-${index}`} // Important: Gives every pin a unique ID
          className={`w-2.5 h-2.5 rounded border border-slate-300 ${colorClass} hover:scale-150 transition-transform cursor-crosshair z-10`}
          style={style}
        />
      );
    });
  };

  return (
    <div className={`relative px-4 py-4 rounded-xl border bg-white/95 backdrop-blur-md shadow-xl min-w-[180px] group ${config.border}`}>
      
      {/* Delete Button (Visible only on Hover) */}
      <button 
        onClick={handleDelete}
        className="absolute -top-2 -left-2 bg-rose-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-rose-600 z-20"
        title="Delete Component"
      >
        <X size={12} strokeWidth={3} />
      </button>

      <div className="absolute -top-2.5 right-3 bg-slate-100 border border-slate-200 text-[9px] text-slate-600 px-2 py-0.5 rounded-full font-mono uppercase tracking-wider shadow-sm z-10 pointer-events-none">
        {data.category}
      </div>

      {/* --- THE 12-PIN LAYOUT --- */}
      {/* Top & Left Sides = Inputs (Gray) */}
      {renderPins('top', Position.Top, 'target', 'bg-slate-400')}
      {renderPins('left', Position.Left, 'target', 'bg-slate-400')}

      {/* Bottom & Right Sides = Outputs (Blue) */}
      {renderPins('bottom', Position.Bottom, 'source', 'bg-blue-500')}
      {renderPins('right', Position.Right, 'source', 'bg-blue-500')}

      {/* Node Content wrapper with pointer-events-none to make drag-and-move flawlessly smooth */}
      <div className="flex items-center gap-3 mt-1 pointer-events-none">
        <div className={`p-2 rounded-lg ${config.bg} ${config.color}`}>
          <Icon size={18} />
        </div>
        <div>
          <div className="text-xs font-bold text-slate-800 tracking-wide">{data.label}</div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">{data.hardware_module}</div>
        </div>
      </div>

    </div>
  );
}