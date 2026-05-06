import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ReactFlow, applyNodeChanges, applyEdgeChanges, Background, Controls, Panel, addEdge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { api } from '../api/axios';
import toast from 'react-hot-toast';
import HardwareNode from "../components/HardwareNode";
import HardwareSidebar from "../components/HardwareSidebar";
import { ArrowLeft, LayoutTemplate, X, Copy, Wifi, Lock, Server, Cpu } from 'lucide-react';

const nodeTypes = { hardware: HardwareNode };
const TEMPLATES = { empty: { nodes: [], edges: [] } };

export default function HardwareCanvas() {
  const { deviceId } = useParams();
  const navigate = useNavigate();

  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const [nodes, setNodes] = useState(TEMPLATES.empty.nodes);
  const [edges, setEdges] = useState(TEMPLATES.empty.edges);
  const [isRestoring, setIsRestoring] = useState(true);

  // --- NEW STATES FOR DYNAMIC CREDENTIALS ---
  const [generatedPrompt, setGeneratedPrompt] = useState(null);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [networkCreds, setNetworkCreds] = useState({
    wifi_ssid: "",
    wifi_password: "",
    server_ip: "192.168.1.100" // A sensible default
  });

  useEffect(() => {
    const fetchExistingBlueprint = async () => {
      try {
        const response = await api.get(`fleet/devices/${deviceId}/`);
        const device = response.data;

        if (device.blueprint && device.blueprint.architecture) {
          const arch = device.blueprint.architecture;
          const loadedNodes = [];

          if (arch.brain) {
            loadedNodes.push({ id: arch.brain.id, type: 'hardware', position: arch.brain.position || { x: 350, y: 150 }, data: { label: 'ESP32 (Brain)', type: 'controller', category: 'brain', hardware_type: arch.brain.hardware_type, board_model: arch.brain.board_model } });
          }

          if (arch.limbs) {
            arch.limbs.forEach((limb, index) => {
              loadedNodes.push({ id: limb.id, type: 'hardware', position: limb.position || { x: 100 + (index * 150), y: 300 }, data: { label: limb.display_name, type: limb.category === 'telemetry' ? 'sensor' : (limb.category === 'control' ? 'action' : 'comms'), category: limb.category, hardware_module: limb.hardware_module, display_name: limb.display_name, ui_element: limb.ui_element } });
            });
          }

          const loadedEdges = arch.nerves ? arch.nerves.map((nerve) => ({ id: nerve.id, source: nerve.source_node, target: nerve.target_node, data: { source_pin: nerve.source_pin, signal_type: nerve.signal_type }, animated: true })) : [];
          setNodes(loadedNodes);
          setEdges(loadedEdges);
        } else {
          setNodes([{ id: 'core_1', type: 'hardware', position: { x: 400, y: 250 }, data: { label: 'ESP32 (Brain)', type: 'controller', category: 'brain', hardware_type: 'esp32', board_model: 'esp32_wroom_32' } }]);
        }
      } catch (err) {
        toast.error("Failed to load existing architecture.");
      } finally {
        setIsRestoring(false);
      }
    };

    const fetchSuggestedServer = async () => {
      try {
        const response = await api.get(`fleet/devices/${deviceId}/suggested-server/`);
        const suggestedServer = response.data.server_ip ?? response.data.server_address ?? response.data.address ?? response.data.url ?? response.data.server;
        if (suggestedServer) {
          setNetworkCreds((prev) => ({ ...prev, server_ip: suggestedServer }));
        }
      } catch (err) {
        console.warn('Failed to fetch suggested server address:', err);
      }
    };

    fetchExistingBlueprint();
    fetchSuggestedServer();
  }, [deviceId]);

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params, animated: true, data: { source_pin: "TBD", signal_type: "digital" } }, eds)), []);
  const onDragOver = useCallback((event) => { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; }, []);
  const onDrop = useCallback((event) => {
    event.preventDefault();
    if (!reactFlowInstance) return;
    const draggedData = event.dataTransfer.getData('application/reactflow');
    if (!draggedData) return;
    const nodeData = JSON.parse(draggedData);
    const position = reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
    const newNode = { id: `${nodeData.hardware_module}_${new Date().getTime()}`, type: 'hardware', position, data: nodeData };
    setNodes((nds) => nds.concat(newNode));
  }, [reactFlowInstance]);

  const generateJSON = async () => {
    const brain = nodes.find(n => n.data.category === 'brain');
    if (!brain) return toast.error('Architecture requires an ESP32 Brain!');
    
    const limbs = nodes.filter(n => n.data.category !== 'brain');
    const blueprint = {
      blueprint_version: "1.0", device_id: deviceId,
      architecture: {
        topology: "direct_to_cloud",
        brain: { id: brain.id, hardware_type: brain.data.hardware_type, board_model: brain.data.board_model, position: brain.position },
        limbs: limbs.map(node => ({ id: node.id, category: node.data.category, hardware_module: node.data.hardware_module, display_name: node.data.display_name, ui_element: node.data.ui_element, position: node.position })),
        nerves: edges.map((edge, index) => ({ id: `wire_${index + 1}`, source_node: edge.source, source_pin: edge.data?.source_pin || "0", target_node: edge.target, signal_type: edge.data?.signal_type || "digital" }))
      },
      cloud_routing: { telemetry_interval_sec: 30, destination: "supabase" }
    };

    const loadId = toast.loading('Syncing architecture to local server...');
    try {
      await api.post(`fleet/devices/${deviceId}/blueprint/`, blueprint);
      toast.success('Architecture Locked Successfully!', { id: loadId });
    } catch (err) {
      toast.error('Sync Failed. Check terminal.', { id: loadId });
    }
  };

  // --- UPDATED: Sends dynamic credentials instead of hardcoded ones ---
  const generatePromptWithCredentials = async (e) => {
    e.preventDefault(); // Stop form submission reload
    const toastId = toast.loading('Generating Firmware Instructions...');

    try {
      const response = await api.post(`fleet/devices/${deviceId}/compile/`, networkCreds);
      if (response.status === 200) {
        setGeneratedPrompt(response.data.generated_prompt || 'No prompt returned from AI.');
        setShowCredentialsModal(false);
        toast.success('Prompt generated successfully!', { id: toastId });
      } else {
        toast.error('Unexpected response from server.', { id: toastId });
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to generate prompt.', { id: toastId });
    }
  };

  const copyPrompt = async () => {
    if (!generatedPrompt) return;
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      toast.success('Prompt copied to clipboard!');
    } catch (err) {
      toast.error('Unable to copy prompt.');
    }
  };

  if (isRestoring) return <div className="h-screen w-full bg-[#F8FAFC] flex items-center justify-center text-slate-500 font-mono">Restoring Architecture...</div>;

  return (
    <div className="h-[calc(100vh-3.5rem)] w-full bg-[#F8FAFC] flex flex-col relative">
      
      {/* 1. THE CREDENTIALS INPUT MODAL */}
      {showCredentialsModal && (
        <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center p-8">
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-lg w-full max-w-md flex flex-col">
            <div className="p-4 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC] rounded-t-xl">
              <h3 className="text-[#0F172A] font-semibold">Network Configuration</h3>
              <button onClick={() => setShowCredentialsModal(false)} className="text-slate-500 hover:text-red-500">
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={generatePromptWithCredentials} className="p-5 space-y-4">
              <p className="text-xs text-slate-600 mb-4">Enter the Wi-Fi credentials for the location where this ESP32 will be deployed. This will be hardcoded into the AI's generated firmware.</p>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#0F172A] flex items-center gap-2"><Wifi size={14}/> Wi-Fi SSID (Name)</label>
                <input 
                  type="text" required 
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-md px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:border-[#0EA5E9]"
                  value={networkCreds.wifi_ssid} 
                  onChange={e => setNetworkCreds({...networkCreds, wifi_ssid: e.target.value})} 
                  placeholder="e.g., College_WiFi_5G" 
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#0F172A] flex items-center gap-2"><Lock size={14}/> Wi-Fi Password</label>
                <input 
                  type="password" required 
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-md px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:border-[#0EA5E9]"
                  value={networkCreds.wifi_password} 
                  onChange={e => setNetworkCreds({...networkCreds, wifi_password: e.target.value})} 
                  placeholder="••••••••" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#0F172A] flex items-center gap-2"><Server size={14}/> Server IP Address</label>
                <input 
                  type="text" required 
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-md px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:border-[#0EA5E9] font-mono"
                  value={networkCreds.server_ip} 
                  onChange={e => setNetworkCreds({...networkCreds, server_ip: e.target.value})} 
                />
              </div>

              <button type="submit" className="w-full bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-medium py-2 rounded-md transition-colors mt-4">
                Inject Credentials & Generate AI Prompt
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. THE GENERATED PROMPT MODAL */}
      {generatedPrompt && (
        <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center p-8">
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-lg w-full max-w-4xl flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC] rounded-t-xl">
              <h3 className="text-[#0F172A] font-semibold flex items-center gap-2">
                <span className="text-emerald-500">●</span> AI Compiler Prompt Generated
              </h3>
              <div className="flex gap-2">
                <button onClick={copyPrompt} className="text-slate-600 hover:text-[#0F172A] transition-colors bg-[#E2E8F0] hover:bg-slate-300 px-3 py-1.5 rounded text-sm flex items-center gap-2">
                  <Copy size={14} /> Copy Text
                </button>
                <button onClick={() => setGeneratedPrompt(null)} className="text-slate-600 hover:text-red-600 transition-colors bg-[#E2E8F0] hover:bg-red-100 p-1.5 rounded">
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto custom-scrollbar flex-1 bg-white border-t border-[#E2E8F0]">
              <pre className="text-[#0EA5E9] font-mono text-xs leading-relaxed whitespace-pre-wrap">
                {generatedPrompt}
              </pre>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 border-b border-[#E2E8F0] flex justify-between items-center bg-white z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="text-slate-500 hover:text-[#0F172A] transition-colors bg-[#F8FAFC] hover:bg-[#E2E8F0] p-2 rounded-full">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-[#0F172A] font-medium">Hardware Design Studio</h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">Editing: {deviceId}</p>
          </div>
        </div>
        
        <div className="flex gap-4 items-center">
          <button onClick={generateJSON} className="bg-[#0EA5E9] text-white px-4 py-2 rounded text-sm hover:bg-[#0284C7] transition-colors font-medium">
            1. Save Blueprint
          </button>
          {/* UPDATED BUTTON: Now opens the Credentials Modal instead of instantly firing the API */}
          <button onClick={() => setShowCredentialsModal(true)} className="bg-emerald-600 text-white px-4 py-2 rounded text-sm hover:bg-emerald-500 transition-colors font-medium flex items-center gap-2">
            <Cpu size={16} /> 2. Generate Firmware AI
          </button>
          
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <HardwareSidebar />
        <div className="flex-1 h-full" ref={reactFlowWrapper}>
          <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} onInit={setReactFlowInstance} onDrop={onDrop} onDragOver={onDragOver} fitView colorMode="light">
            <Background color="#CBD5E1" gap={20} variant="dots" />
            <Controls className="bg-white fill-[#0F172A] border-[#E2E8F0]" />
            <Panel position="top-left" className="bg-white/80 p-2 rounded border border-[#E2E8F0] text-[#0F172A] text-xs backdrop-blur-sm">
              Drag nodes from the sidebar, then connect the wires.
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}