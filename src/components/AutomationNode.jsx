import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Play, HelpCircle, GitMerge, Zap, Clock, X, Bell } from 'lucide-react';

const NODE_CONFIG = {
  trigger: { icon: Play, color: 'text-emerald-400', border: 'border-emerald-500/50', bg: 'bg-emerald-500/10' },
  condition: { icon: HelpCircle, color: 'text-amber-400', border: 'border-amber-500/50', bg: 'bg-amber-500/10' },
  gate: { icon: GitMerge, color: 'text-purple-400', border: 'border-purple-500/50', bg: 'bg-purple-500/10' },
  action: { icon: Zap, color: 'text-blue-400', border: 'border-blue-500/50', bg: 'bg-blue-500/10' },
  delay: { icon: Clock, color: 'text-slate-400', border: 'border-slate-500/50', bg: 'bg-slate-500/10' },
  notify: { icon: Bell, color: 'text-rose-400', border: 'border-rose-500/50', bg: 'bg-rose-500/10' }
};

export function AutomationNode({ id, data }) {
  const { setNodes, setEdges } = useReactFlow();
  const config = NODE_CONFIG[data.type] || NODE_CONFIG.action;
  const Icon = config.icon;

  const handleDelete = () => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
  };

  return (
    <div className={`relative px-4 py-3 rounded-xl border bg-slate-900 shadow-xl min-w-[200px] group ${config.border}`}>
      
      {/* Delete Button */}
      <button onClick={handleDelete} className="absolute -top-2 -left-2 bg-rose-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-rose-600 z-10">
        <X size={12} strokeWidth={3} />
      </button>

      {/* Category Badge */}
      <div className="absolute -top-2.5 right-3 bg-slate-800 border border-slate-700 text-[9px] text-slate-300 px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
        {data.category}
      </div>

      {/* Inputs: Triggers have no inputs. Gates have multiple inputs (mapped internally). Everything else has 1 input. */}
      {data.type !== 'trigger' && (
        <Handle type="target" position={Position.Left} className="w-3 h-3 bg-slate-400 border-2 border-slate-900" />
      )}

      <div className="flex items-center gap-3 mt-1">
        <div className={`p-2 rounded-lg ${config.bg} ${config.color}`}>
          <Icon size={18} />
        </div>
        <div>
          <div className="text-xs font-bold text-white tracking-wide">{data.label}</div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{data.description}</div>
        </div>
      </div>

      {/* Outputs: Logic for True/False Branching */}
      {data.type === 'condition' ? (
        // Condition nodes get TWO outputs: True and False
        <div className="absolute -right-1.5 top-0 bottom-0 flex flex-col justify-evenly">
          <div className="relative flex items-center group/handle">
            <Handle type="source" position={Position.Right} id="true" className="!relative !transform-none w-3 h-3 bg-emerald-500 border-2 border-slate-900" />
            <span className="absolute right-4 text-[9px] font-bold text-emerald-500 opacity-0 group-hover/handle:opacity-100 transition-opacity">TRUE</span>
          </div>
          <div className="relative flex items-center group/handle">
            <Handle type="source" position={Position.Right} id="false" className="!relative !transform-none w-3 h-3 bg-rose-500 border-2 border-slate-900" />
            <span className="absolute right-4 text-[9px] font-bold text-rose-500 opacity-0 group-hover/handle:opacity-100 transition-opacity">FALSE</span>
          </div>
        </div>
      ) : data.type !== 'action' && data.type !== 'notify' ? (
        // Standard single output for Triggers, Gates, Delays
        <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-500 border-2 border-slate-900" />
      ) : null}
      
    </div>
  );
}

export default AutomationNode;
