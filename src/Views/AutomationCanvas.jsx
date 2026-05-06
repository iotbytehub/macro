import React, { useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, Background, Controls, Panel, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

import AutomationNode from '../components/AutomationNode';
import AutomationSidebar from '../components/AutomationSidebar';
import { api } from '../api/axios'; // Make sure this path is correct

const nodeTypes = { logic: AutomationNode };

export default function AutomationCanvas() {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  
  const onConnect = useCallback((params) => {
    // If it's a condition node, color the wire Green (True) or Red (False)
    const strokeColor = params.sourceHandle === 'true' ? '#10b981' : params.sourceHandle === 'false' ? '#f43f5e' : '#3b82f6';
    setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: strokeColor, strokeWidth: 2 } }, eds));
  }, []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event) => {
    event.preventDefault();
    if (!reactFlowInstance) return;
    const draggedData = event.dataTransfer.getData('application/reactflow');
    if (!draggedData) return;

    const nodeData = JSON.parse(draggedData);
    const position = reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
    const newNode = { id: `rule_${new Date().getTime()}`, type: 'logic', position, data: nodeData };
    
    setNodes((nds) => nds.concat(newNode));
  }, [reactFlowInstance]);

  const saveAutomation = async () => {
    const payload = { device_id: deviceId, nodes, edges };
    const loadId = toast.loading('Saving Automation Rules...');
    try {
      // We will build this backend endpoint later!
      await api.post(`fleet/devices/${deviceId}/automations/`, payload);
      toast.success('Rules Active!', { id: loadId });
    } catch (err) {
      toast.error('Failed to save rules.', { id: loadId });
    }
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] w-full bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-white font-medium">Automation & Rules Engine</h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">Device: {deviceId}</p>
          </div>
        </div>
        <button onClick={saveAutomation} className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-500 font-medium flex items-center gap-2">
          <Save size={16} /> Deploy Rules
        </button>
      </div>

      {/* Workspace */}
      <div className="flex-1 flex overflow-hidden">
        <AutomationSidebar />
        <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
          <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} onInit={setReactFlowInstance} onDrop={onDrop} onDragOver={onDragOver} fitView colorMode="dark">
            <Background color="#334155" gap={20} />
            <Controls className="bg-slate-800 fill-white border-slate-700" />
            <Panel position="top-left" className="bg-slate-800/80 p-2 rounded border border-slate-700 text-slate-300 text-xs backdrop-blur-sm">
              Connect Triggers (Left) to Actions (Right)
            </Panel>
          </ReactFlow>
          {!nodes.length && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
              <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
                <p className="text-slate-300 text-sm mb-2">Build an automation workflow by dragging rules from the sidebar.</p>
                <p className="text-xs text-slate-500">Start with a trigger, then add logic and actions.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}