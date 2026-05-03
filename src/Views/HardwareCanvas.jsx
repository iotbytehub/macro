import React, { useState, useCallback, useRef } from 'react';
import { 
  ReactFlow, addEdge, applyNodeChanges, applyEdgeChanges, 
  Background, Controls, ReactFlowProvider, useReactFlow 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Cpu, Wifi, Zap, Database } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../api/axios';
import HardwareNode from '../components/HardwareNode';

// Register our custom UI node
const nodeTypes = { hardware: HardwareNode };

// ID Generator for dropped nodes
let id = 0;
const getId = () => `dndnode_${id++}`;

function CanvasEngine() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const { screenToFlowPosition } = useReactFlow();

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } }, eds)), []);

  // --- DRAG AND DROP LOGIC ---
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event) => {
    event.preventDefault();

    const type = event.dataTransfer.getData('application/reactflow/type');
    const label = event.dataTransfer.getData('application/reactflow/label');
    const sublabel = event.dataTransfer.getData('application/reactflow/sublabel');

    if (!type) return;

    // Calculate exact drop position on the grid
    const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });

    const newNode = {
      id: getId(),
      type: 'hardware', // Points to our custom HardwareNode component
      position,
      data: { label, sublabel, type },
    };

    setNodes((nds) => nds.concat(newNode));
  }, [screenToFlowPosition]);

  // --- AI COMPILER ---
  const compileFirmware = async () => {
    if (nodes.length === 0) return toast.error("Canvas is empty!");
    
    const toastId = toast.loading('AI is writing your C++ firmware...');
    try {
      const response = await api.post('fleet/devices/compile-canvas/', { nodes, edges }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url; link.setAttribute('download', 'nexus_ai_firmware.ino');
      document.body.appendChild(link); link.click(); link.remove();
      toast.success('Firmware Compiled & Downloaded!', { id: toastId });
    } catch (err) {
      toast.error('AI Compilation failed.', { id: toastId });
    }
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full bg-slate-950">
      
      {/* TOOLBOX SIDEBAR */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 p-4 flex flex-col">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Hardware Library</h3>
        
        <div className="space-y-3">
          {/* Draggable Items */}
          <div 
            draggable 
            onDragStart={(e) => { e.dataTransfer.setData('application/reactflow/type', 'controller'); e.dataTransfer.setData('application/reactflow/label', 'ESP32 NodeMCU'); e.dataTransfer.setData('application/reactflow/sublabel', 'Main Brain'); }}
            className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700 rounded-lg cursor-grab active:cursor-grabbing hover:bg-slate-800 transition-colors"
          >
            <Cpu size={16} className="text-blue-400" /> <span className="text-sm text-slate-200">ESP32 Core</span>
          </div>

          <div 
            draggable 
            onDragStart={(e) => { e.dataTransfer.setData('application/reactflow/type', 'sensor'); e.dataTransfer.setData('application/reactflow/label', 'Motion Sensor'); e.dataTransfer.setData('application/reactflow/sublabel', 'PIR HC-SR501'); }}
            className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700 rounded-lg cursor-grab active:cursor-grabbing hover:bg-slate-800 transition-colors"
          >
            <Wifi size={16} className="text-emerald-400" /> <span className="text-sm text-slate-200">PIR Sensor</span>
          </div>

          <div 
            draggable 
            onDragStart={(e) => { e.dataTransfer.setData('application/reactflow/type', 'action'); e.dataTransfer.setData('application/reactflow/label', '5V Relay'); e.dataTransfer.setData('application/reactflow/sublabel', 'Digital Out'); }}
            className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700 rounded-lg cursor-grab active:cursor-grabbing hover:bg-slate-800 transition-colors"
          >
            <Zap size={16} className="text-amber-400" /> <span className="text-sm text-slate-200">Relay Switch</span>
          </div>

          <div 
            draggable 
            onDragStart={(e) => { e.dataTransfer.setData('application/reactflow/type', 'cloud'); e.dataTransfer.setData('application/reactflow/label', 'Supabase'); e.dataTransfer.setData('application/reactflow/sublabel', 'Data Logger'); }}
            className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700 rounded-lg cursor-grab active:cursor-grabbing hover:bg-slate-800 transition-colors"
          >
            <Database size={16} className="text-purple-400" /> <span className="text-sm text-slate-200">Cloud DB</span>
          </div>
        </div>

        <div className="mt-auto">
          <button onClick={compileFirmware} className="w-full bg-white text-slate-950 font-medium py-2.5 rounded-lg hover:bg-slate-200 transition-colors shadow-lg">
            Compile to C++
          </button>
        </div>
      </aside>

      {/* REACT FLOW CANVAS */}
      <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          colorMode="dark"
          fitView
        >
          <Background color="#334155" gap={20} size={1.5} />
          <Controls className="bg-slate-800 border-slate-700 fill-white" />
        </ReactFlow>
      </div>
    </div>
  );
}

// Wrapping the engine in the Provider is strictly required for the screenToFlowPosition math to work
export default function HardwareCanvas() {
  return (
    <ReactFlowProvider>
      <CanvasEngine />
    </ReactFlowProvider>
  );
}