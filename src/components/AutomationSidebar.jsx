import React from 'react';
import { Play, HelpCircle, GitMerge, Zap, Layers, Clock, Bell } from 'lucide-react';

export default function AutomationSidebar() {
  const onDragStart = (event, nodeData) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeData));
    event.dataTransfer.effectAllowed = 'move';
  };

  const categories = [
    {
      title: "1. Triggers (IF)",
      icon: <Play size={14} className="text-emerald-400" />,
      items: [
        { label: 'Sensor Reading', desc: 'When telemetry arrives', data: { label: 'Sensor Trigger', type: 'trigger', category: 'event', description: 'Triggers on new data' } },
        { label: 'Device Online', desc: 'When device pings', data: { label: 'Connection State', type: 'trigger', category: 'system', description: 'Device comes online' } },
        { label: 'Time Schedule', desc: 'CRON Job Timer', data: { label: 'Schedule', type: 'trigger', category: 'time', description: 'Every day at 8:00 AM' } }
      ]
    },
    {
      title: "2. Logic & Routing",
      icon: <GitMerge size={14} className="text-purple-400" />,
      items: [
        { label: 'Compare (>, <, =)', desc: 'Branch True/False', data: { label: 'Value Check', type: 'condition', category: 'math', description: 'Value > Threshold' } },
        { label: 'AND Gate', desc: 'Require both inputs', data: { label: 'AND Operator', type: 'gate', category: 'logic', description: 'Wait for all inputs' } },
        { label: 'OR Gate', desc: 'Require any input', data: { label: 'OR Operator', type: 'gate', category: 'logic', description: 'Any input triggers' } },
        { label: 'Time Delay', desc: 'Wait before next step', data: { label: 'Delay', type: 'delay', category: 'flow', description: 'Wait X seconds' } }
      ]
    },
    {
      title: "3. Actions (THEN)",
      icon: <Zap size={14} className="text-blue-400" />,
      items: [
        { label: 'Device Command', desc: 'Send Switch/Speed', data: { label: 'Send Command', type: 'action', category: 'control', description: 'Change device state' } },
        { label: 'Send Email', desc: 'Alert via Email', data: { label: 'Email Alert', type: 'notify', category: 'alert', description: 'Send alert to owner' } },
        { label: 'Webhook', desc: 'POST to external URL', data: { label: 'HTTP Webhook', type: 'notify', category: 'api', description: 'Trigger external service' } }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col h-full z-10 shadow-2xl">
      <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
        <h3 className="text-slate-800 font-semibold flex items-center gap-2 tracking-wide">
          <Layers size={18} className="text-purple-500" /> Rule Engine
        </h3>
        <p className="text-xs text-slate-500 mt-1">Build logic flows without code.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-5 custom-scrollbar">
        {categories.map((cat, i) => (
          <div key={i} className="mb-2">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-3 px-1">
              {cat.icon} {cat.title}
            </h4>
            <div className="space-y-2">
              {cat.items.map((item, j) => (
                <div
                  key={j}
                  draggable
                  onDragStart={(e) => onDragStart(e, item.data)}
                  className="bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 rounded-lg cursor-grab active:cursor-grabbing hover:border-[#0EA5E9] hover:bg-blue-50 transition-all duration-200 shadow-sm"
                >
                  <p className="text-sm text-slate-800 font-medium leading-tight">{item.label}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}